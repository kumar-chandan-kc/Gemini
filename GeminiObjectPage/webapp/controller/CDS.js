/*global s4:true*/

jQuery.sap.declare("s4.cfnd.geminiobjectpage.controller.CDS");
sap.ui.define(["sap/m/MessageBox", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"], function(MessageBox, Filter, FilterOperator) {
	"use strict";
	
	s4.cfnd.geminiobjectpage.controller.CDS = {
 
		readCDSActualData: function(sObjectId, thisObj) {
			var that = thisObj;
			var sUriCDSActual = "/I_SBRCDSACTUALS";
			var aFilterCDSActual = [];
			var aValueHelpResult;
			aFilterCDSActual.push(new sap.ui.model.Filter("sap_bo_type", sap.ui.model.FilterOperator.EQ, sObjectId));
			thisObj.oModel.read(sUriCDSActual, {
				filters: aFilterCDSActual,

				success: function(oResponse) {
					var usagetypeString = "";

					that.sResCDSActual = oResponse.results;
					for (var i = 0; i < that.sResCDSActual.length; i++) {
						usagetypeString = "";
						if (that.sResCDSActual[i].isanalytics) {
							usagetypeString += " Analytics,";
						}
						if (that.sResCDSActual[i].isapiinterface) {
							usagetypeString += " API Interface,";
						}
						if (that.sResCDSActual[i].isbwextraction) {
							usagetypeString += " BW Extraction,";
						}
						if (that.sResCDSActual[i].isdataextraction) {
							usagetypeString += " Data Extraction,";
						}
						if (that.sResCDSActual[i].isextensibility) {
							usagetypeString += " Extensibility,";
						}

						if (that.sResCDSActual[i].iskeystructure) {
							usagetypeString += " Key Structure,";
						}

						if (that.sResCDSActual[i].issearch) {
							usagetypeString += " Search,";
						}
						if (usagetypeString !== "" && usagetypeString.substr(-1) === ",") {
							usagetypeString = usagetypeString.substr(1);
							usagetypeString = usagetypeString.substr(0, usagetypeString.length - 1);
						}
						that.sResCDSActual[i].cdsUsageTypeString = usagetypeString;
						that.sResCDSActual[i].cdsUsageTypeKeysArray = usagetypeString.split(", ");

						if (that.sResCDSActual[i].release_status === "1") {
							that.sResCDSActual[i].release_status = "Released";
						} else {
							that.sResCDSActual[i].release_status = "Not Released";
						}

					}

					that.oTable.setProperty("/cds", that.sResCDSActual);
					that.getView().byId("busyCDSActual").setVisible(false);
					that.getView().byId("TableActualCDS").setVisible(false);
					that.getView().byId("TableActualCDSnonEdit").setVisible(true);

				},
				error: function() {

				}

			});
			var aCDSArtifact = [];
			var tempx = {};
			//tempx.value = "Association View";
			//aCDSArtifact[0] = $.extend({}, tempx);
			tempx.value = "Cube View";
			aCDSArtifact[0] = $.extend({}, tempx);
			tempx.value = "Dimension View";
			aCDSArtifact[1] = $.extend({}, tempx);
			tempx.value = "Interface View";
			aCDSArtifact[2] = $.extend({}, tempx);
			tempx.value = "Query View";
			aCDSArtifact[3] = $.extend({}, tempx);
			tempx.value = "Value Help View";
			aCDSArtifact[4] = $.extend({}, tempx);
			thisObj.oTable.setProperty("/cdsArtifactList", aCDSArtifact);

			var aCDSUsageType = [];
			tempx = {};
			tempx.value = "Analytics";
			aCDSUsageType[0] = $.extend({}, tempx);
			tempx.value = "API Interface";
			aCDSUsageType[1] = $.extend({}, tempx);
			tempx.value = "BW Extraction";
			aCDSUsageType[2] = $.extend({}, tempx);
			tempx.value = "Data Extraction";
			aCDSUsageType[3] = $.extend({}, tempx);
			tempx.value = "Extensibility";
			aCDSUsageType[4] = $.extend({}, tempx);
			tempx.value = "Key Structure";
			aCDSUsageType[5] = $.extend({}, tempx);
			tempx.value = "Search";
			aCDSUsageType[6] = $.extend({}, tempx);
			thisObj.oTable.setProperty("/cdsUsageTypeList", aCDSUsageType);
		},
		handleEditCDS: function(thisObj) {

			thisObj.getView().byId("TableActualCDSnonEdit").setVisible(false);
			thisObj.getView().byId("TableActualCDS").setVisible(true);
			thisObj.getView().byId("CDSadd").setVisible(true);
			thisObj.getView().byId("TableActualCDS").setMode(sap.m.ListMode.Delete);
			//Make the columns editable for new entries
			thisObj.getView().byId("artifactCDSCombo").setEnabled(true);
			thisObj.getView().byId("usageType").setEditable(true);
			thisObj.getView().byId("CDSViewName").setEditable(true);

			//Store the current data in a temporary model
			thisObj.tmpModelCDS = $.extend(true, [], thisObj.oTable.getProperty("/cds"));

		},

		handleCancelCDS: function(thisObj) {
			thisObj.getView().byId("TableActualCDS").setVisible(false);
			thisObj.getView().byId("TableActualCDSnonEdit").setVisible(true);
			thisObj.getView().byId("CDSadd").setVisible(false);
			thisObj.getView().byId("TableActualCDS").setMode(sap.m.ListMode.None);
			thisObj.getView().byId("artifactCDSCombo").setEnabled(false);
			thisObj.getView().byId("usageType").setEditable(false);
			thisObj.getView().byId("CDSViewName").setEditable(false);
			//RESTORE THE MODEL OF THE TABLE
			thisObj.oTable.setProperty("/cds", thisObj.tmpModelCDS);
		},
		onValueHelpRequestViewName: function(oEvent, thisObj) {

			thisObj.ipCDSName = oEvent.getSource().getId();
			var rowNumber = oEvent.getParameters()['id'].split("TableActualCDS-").pop();

			//Set dynamic filter based on CDS artifact
			var array = thisObj.getView().getModel("Gemini").getData().cds;
			var FilterName = array[rowNumber].cds_artifact;
			var resultList;

			// Using Ternary Operator to Set Filter Name

			FilterName = (FilterName === 'Query View') ? "IsQuery" : FilterName;
			FilterName = (FilterName === 'Cube View') ? "IsCube" : FilterName;
			FilterName = (FilterName === 'Dimension View') ? "IsDimension" : FilterName;
			FilterName = (FilterName === 'Interface View') ? "IsInterface" : FilterName;
			FilterName = (FilterName === 'Value Help View') ? "IsValueHelp" : FilterName;
			FilterName = (FilterName === 'Association View') ? "IsAssociation" : FilterName;

			var sUriCDSValueHelp = "/I_SBRCDSACTUALFINAL";
			var aFilterCDS = [];
			aFilterCDS.push(new sap.ui.model.Filter(FilterName, sap.ui.model.FilterOperator.EQ, 'true'));
			//that.sResCDSValueHelp = null;
			thisObj.oModel.read(sUriCDSValueHelp, {
				filters: aFilterCDS,

				success: function(oResponse) {

					var resultList = oResponse.results;
					if (resultList.length > 0) {

						// Logic to remove values from value help which are already maintained
						var oModel = thisObj.getView().getModel("Gemini");
						var cdsData = oModel.getData().cds;
						for (var i = 0; i < cdsData.length; i++) {
							for (var j = 0; j < resultList.length; j++) {
								if (cdsData[i].view_name === resultList[j].CDSName) {
									resultList.splice(j, 1);
									break;
								}
							}
						}

						thisObj.oTable.setProperty("/cdsViewName", resultList);

						if (!thisObj._BCMapDialog) {
							thisObj._BCMapDialog = sap.ui.xmlfragment("s4.cfnd.geminiobjectpage.view.CDSFacetViewNameValueHelp", thisObj);
							thisObj.getView().addDependent(thisObj._BCMapDialog);
						}

						jQuery.sap.syncStyleClass("sapUiSizeCompact", thisObj.getView(), thisObj._BCMapDialog);
						thisObj._BCMapDialog.open();
						if (thisObj._BCMapDialog) {
							var searchField = sap.ui.getCore().byId("CDSFacetViewNameValueHelp-list");
							searchField.addEventDelegate({
								onfocusin: function() {
									sap.ui.getCore().byId("CDSFacetViewNameValueHelp-searchField").focus();
								}
							}, this);
						}
					} else {
						var oBundle = this.getView().getModel("i18n").getResourceBundle();
						MessageBox.error(oBundle.getText("noValueHelpCDSArtifact"));
				
					}

				},
				error: function() {

				}
			});

		},
		convertUsageTypeToFlags: function(object) {
			if (object.usagetypeString.indexOf("Analytics") >= 0) {
				object.isanalytics = true;
			} else {
				object.isanalytics = false;
			}
			if (object.usagetypeString.indexOf("Extensibility") >= 0) {
				object.isextensibility = true;
			} else {
				object.isextensibility = false;
			}
			if (object.usagetypeString.indexOf("API Interface") >= 0) {
				object.isapiinterface = true;
			} else {
				object.isapiinterface = false;
			}
			if (object.usagetypeString.indexOf("Key Structure") >= 0) {
				object.iskeystructure = true;
			} else {
				object.iskeystructure = false;
			}
			if (object.usagetypeString.indexOf("Data Extraction") >= 0) {
				object.isdataextraction = true;
			} else {
				object.isdataextraction = false;
			}
			if (object.usagetypeString.indexOf("BW Extraction") >= 0) {
				object.isbwextraction = true;
			} else {
				object.isbwextraction = false;
			}
			if (object.usagetypeString.indexOf("Search") >= 0) {
				object.issearch = true;
			} else {
				object.issearch = false;
			}
			return object;
		},
		fnCDSDisplayMode: function(thisObj) {
			thisObj.getView().byId("TableActualCDSnonEdit").setVisible(true);
			thisObj.getView().byId("TableActualCDS").setVisible(false);
			thisObj.getView().byId("CDSadd").setVisible(false);
			thisObj.getView().byId("TableActualCDS").setMode(sap.m.ListMode.None);
			thisObj.getView().byId("artifactCDSCombo").setEnabled(false);
			thisObj.getView().byId("usageType").setEditable(false);
			thisObj.getView().byId("CDSViewName").setEditable(false);

		},
		handleSaveCDS: function(thisObj) {
			
			var aCDSCreate = [];
			var aCDS = $.extend(true, [], thisObj.oTable.getProperty("/cds"));
			for (var i = 0; i < aCDS.length; i++) {

				//            delete aCDS[i].new_row;
				if (aCDS[i].new_row === true) {
					aCDSCreate.push(aCDS[i]);
				}
			}

			//            thisObj.oTable.setProperty("/cds", aCDS);

			//Create call to the backend for CDS Actual starts

			for (var i = 0; i < aCDSCreate.length; i++) {

				aCDSCreate[i] = this.convertUsageTypeToFlags(aCDSCreate[i]);

				aCDSCreate[i].sap_bo_type = thisObj.sObj;

				// Setting Released Status
				if (aCDSCreate[i].release_status === "Released") {
					aCDSCreate[i].release_status = "1";
				} else {
					aCDSCreate[i].release_status = "0";
				}

				// Setting new property to Usage Type
				this.formUsageTypeString(thisObj);

				// Deleting unneccesary property
				delete aCDSCreate[i].usagetypeString;
				delete aCDSCreate[i].new_row;
				delete aCDSCreate[i].cdsUsageTypeKeysArray;

				var uri = '/I_SBRCDSACTUALS';
				thisObj.oModel.create(uri, aCDSCreate[i], {
						groupId: this.sDeferredGroup,
					success: function() {

					},
					error: function() {

					}
				});
			}

			//Delete call to the backend for CDS Actual starts
			for (var i = 0; i < thisObj.aCDSDel.length; i++) {
				thisObj.aCDSDel[i].sap_bo_type = thisObj.sap_bo_type;
				thisObj.aCDSDel[i].cds_artifact = thisObj.aCDSDel[i].cds_artifact;
				thisObj.aCDSDel[i].view_name = thisObj.aCDSDel[i].view_name;

				thisObj.oModel.remove("/I_SBRCDSACTUALS(sap_bo_type='" + thisObj.aCDSDel[i].sap_bo_type + "',cds_artifact='" + encodeURIComponent(
						thisObj.aCDSDel[
							i]
						.cds_artifact) +
					"',view_name='" + thisObj.aCDSDel[i].view_name + "')", {
							groupId: this.sDeferredGroup,
						success: function() {
							// console.log("Success");

						},
						error: function() {
							// console.log("Error");
						}
					});
			}

		},

		onCDSAdd: function(oEvent) {
			var oModel = this.getView().getModel("Gemini");

			var newObject = {
				cds_artifact: "Cube View",
				usagetypeString: "",
				view_name: "",
				release_status: "",
				new_row: true
			};
			var CDSData = oModel.getProperty("/cds");

			CDSData.unshift(newObject);
			oModel.refresh(true);
		},
		deleteCDSItems: function(oEvent) {
			var selectedItem = oEvent.getParameter('listItem');
			var index = this.getView().byId("TableActualCDS").indexOfItem(selectedItem);
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var oModel = this.getView().getModel("Gemini");
			var selectedRow = oModel.getData().cds[index];
			var deleteConfirmationMessage = oBundle.getText("deleteConfirmationMessage");

			MessageBox.confirm(
				deleteConfirmationMessage, {
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
					onClose: function(sAction) {
						if (sAction === "YES") {

							// On press of OK the logic goes here

							if ((parseInt(index, 10) + (this.adelCountCDS)) <= ((this.tmpModelCDS.length) - 1)) {
								var aItems = this.byId("TableActualCDS").getItems();
								aItems[this.tmpModelCDS.length - this.adelCountCDS - 1].getAggregation("cells")[0].setEnabled(true);
								if (this.adelCountCDS < (this.tmpModelCDS.length - 1)) {
									this.adelCountCDS++;
								}
							}
							var x = 0;
							for (var i = 0; i < this.tmpModelCDS.length; i++) {
								if (oModel.getData().cds[index].si === this.tmpModelCDS[i].si) {
									x = 1;
									break;
								}
							}
							if (x === 1) {
								this.aCDSDel.push(oModel.getData().cds[index]);
							}
							oModel.getData().cds.splice(index, 1);

							// Two Variables to refresh model
							var test2 = oModel.getData().cds;
							var test = null;

							// Setting Model to null and then setting it to original value
							this.oTable.setProperty("/cds", test);
							this.oTable.setProperty("/cds", test2);

							/* Logic Ends */

							oModel.refresh(true);

						}
					}.bind(this)
				});

		},
		onCDSArtifactSelected: function(oEvent) {
			var id = oEvent.getSource().getId();
			var CDSViewNameCol = this.getView().byId("CDSViewNameCol");
			var viewCol = this.getView().byId("TableActualCDS").indexOfColumn(CDSViewNameCol);
			this.getView().byId("TableActualCDS").getItems()[id.split("-")[18]].getAggregation("cells")[viewCol].setValue("");
			var CDSReleaseStatusCol = this.getView().byId("CDSReleaseStatusCol");
			var relCol = this.getView().byId("TableActualCDS").indexOfColumn(CDSReleaseStatusCol);

			this.getView().byId("TableActualCDS").getItems()[id.split("-")[18]].getAggregation("cells")[relCol].setText("");
		},
		handleUsageTypeSelectionChange: function(oEvent) {},

		handleUsageTypeSelectionFinish: function(oEvent) {
			var rowNumber = oEvent.getParameters()['id'].split("TableActualCDS-").pop();
			var aCDS = $.extend(true, [], this.oTable.getProperty("/cds"));
			var selectedItems = oEvent.getParameter("selectedItems");
			var lengthSelectedItems = selectedItems.length;
			aCDS[rowNumber].usagetypeString = "";
			for (var i = 0; i < lengthSelectedItems; i++) {

				aCDS[rowNumber].usagetypeString += oEvent.getParameter("selectedItems")[i].getKey();
				if (i === lengthSelectedItems - 1) {
					sap.ui.getCore().byId(oEvent.getSource().getId()).setValueState("None");
				}

			}
			this.oTable.setProperty("/cds", aCDS);
		},

		formUsageTypeString: function(thisObj) {
			//console.log("Hello");
			var aCDS = $.extend(true, [], thisObj.oTable.getProperty("/cds"));
			var rows = aCDS.length;
			for (var i = 0; i < rows; i++) {
				if (aCDS[i].new_row) {
					aCDS[i].cdsUsageTypeString = "";
					if (aCDS[i].usagetypeString.indexOf("Analytics") >= 0) {
						aCDS[i].cdsUsageTypeString = aCDS[i].cdsUsageTypeString + " Analytics,";
					}
					if (aCDS[i].usagetypeString.indexOf("Extensibility") >= 0) {
						aCDS[i].cdsUsageTypeString = aCDS[i].cdsUsageTypeString + " Extensibility,";
					}
					if (aCDS[i].usagetypeString.indexOf("API Interface") >= 0) {
						aCDS[i].cdsUsageTypeString = aCDS[i].cdsUsageTypeString + " API Interface,";
					}
					if (aCDS[i].usagetypeString.indexOf("Key Structure") >= 0) {
						aCDS[i].cdsUsageTypeString = aCDS[i].cdsUsageTypeString + " Key Structure,";
					}
					if (aCDS[i].usagetypeString.indexOf("Data Extraction") >= 0) {
						aCDS[i].cdsUsageTypeString = aCDS[i].cdsUsageTypeString + " Data Extraction,";
					}
					if (aCDS[i].usagetypeString.indexOf("BW Extraction") >= 0) {
						aCDS[i].cdsUsageTypeString = aCDS[i].cdsUsageTypeString + " BW Extraction,";
					}
					if (aCDS[i].usagetypeString.indexOf("Search") >= 0) {
						aCDS[i].cdsUsageTypeString = aCDS[i].cdsUsageTypeString + " Search,";
					}

					if (aCDS[i].cdsUsageTypeString !== "" && aCDS[i].cdsUsageTypeString.substr(-1) === ",") {
						aCDS[i].cdsUsageTypeString = aCDS[i].cdsUsageTypeString.substr(1);
						aCDS[i].cdsUsageTypeString = aCDS[i].cdsUsageTypeString.substr(0, aCDS[i].cdsUsageTypeString.length - 1);
					}

				}

				delete aCDS[i].new_row;

			}

			thisObj.oTable.setProperty("/cds", aCDS);
		}
	};
	return s4.cfnd.geminiobjectpage.controller.CDS;

});