/*global s4:true*/

jQuery.sap.declare("s4.cfnd.geminiobjectpage.controller.API");
sap.ui.define(["sap/m/MessageBox"], function(MessageBox) {
	"use strict";

	s4.cfnd.geminiobjectpage.controller.API = {

		onaddPlanAPI: function() {
			var oModel = this.getView().getModel("Gemini");
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			this.uniqueEntryAPIPlanID++;
			var oObject = {

				api_id: this.uniqueEntryAPIPlanID.toString(),
				sap_bo_type: this.sObj,
				protocol: this.defaultProtocol,
				area: this.sArea,
				read_applicable: false,
				create_applicable: false,
				update_applicable: false,
				delete_applicable: false,
				others_applicable: false,
				target_release: "",
				description: "",
				status: "",
				change_type: oBundle.getText("changeTypeNew"),
				status_colour: "",
				status_icon: "",
				tool_tip: "",
				mapped_service_interface: "",
				actual_release: "",
				jira_backlog: "",
				jira_backlog_link: "",
				jira_valid: '1',
				requirement_jira: "",
				requirement_jira_link: "",
				jira_req_valid: '1'
			};

			var aAPIPlan = oModel.getProperty("/apiplan");
			aAPIPlan.unshift(oObject);

			// To reset value state for Target Release
			var actualRelease = this.getView().byId("actualReleaseAPI");
			var actualReleaseInputCol = this.getView().byId("TablePlanAPI").indexOfColumn(actualRelease);
			var jiraLinkAPI = this.getView().byId("jiraLinkAPI");
            var jiraLinkAPICol = this.getView().byId("TablePlanAPI").indexOfColumn(jiraLinkAPI);
            

			
			this.handleValueState(["TablePlanAPI"], [
				[actualReleaseInputCol, jiraLinkAPICol]
			]);

			oModel.refresh(true);
			this.getView().byId("TablePlanAPI").removeSelections();

		},
		APIJiraChange: function(oEvent) {

            var APIPlanRowText = oEvent.getParameter("id");
            var APIPlanRow = APIPlanRowText.split("TablePlanAPI-").pop();
            var oModel = this.getView().getModel("Gemini");
            var aModelData = oModel.getData().apiplan;
            var sAPIPlanText = aModelData[APIPlanRow].jira_backlog;
            if (oEvent.getId() === "liveChange") {
                  aModelData[APIPlanRow].jira_valid = '2';
                  
            } else {
                  if (sAPIPlanText === "") {
                         aModelData[APIPlanRow].jira_valid = '1';

                  } else {
                         s4.cfnd.geminiobjectpage.controller.Events.fnJiraCheck(sAPIPlanText,aModelData,oModel,this, "TablePlanAPI", "jiraAPI");
                  }
            }

     },
     APIReqJiraChange:  function(oEvent) {

         var APIPlanRowText = oEvent.getParameter("id");
         var APIPlanRow = APIPlanRowText.split("TablePlanAPI-").pop();
         var oModel = this.getView().getModel("Gemini");
         var aModelData = oModel.getData().apiplan;
         var sAPIPlanText = aModelData[APIPlanRow].requirement_jira;
         if (oEvent.getId() === "liveChange") {
               aModelData[APIPlanRow].jira_req_valid = '2';
               
         } else {
               if (sAPIPlanText === "") {
                      aModelData[APIPlanRow].jira_req_valid = '1';

               } else {
                      this.fnJiraReqCheck(sAPIPlanText,aModelData,oModel,this, "TablePlanAPI", "reqJiraLinkAPI");
               }
         }

  },
  

		onBtnMapDelAPI: function(oEvent) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();

			var isSelected = this.getView().byId("TablePlanAPI").getSelectedItem();
			var tempRemoval = -1;
			var xTemp = this.byId("TablePlanAPI").getItems();
			if (isSelected) {
				tempRemoval = this.getView().byId("TablePlanAPI").indexOfItem(isSelected);
				var changeTypeAPI = this.getView().byId("changeTypeAPI");
				var changeTypeAPICol = this.getView().byId("TablePlanAPI").indexOfColumn(changeTypeAPI);

				if (xTemp[tempRemoval].getAggregation("cells")[changeTypeAPICol].getProperty("enabled") === true) {

					// Deletion confirmation
					var deleteConfirmationMessage = oBundle.getText("deleteConfirmationMessage");

					MessageBox.confirm(
						deleteConfirmationMessage, {
							actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
							onClose: function(sAction) {
								if (sAction === "YES") {

									// Logic for deletion

									var oModel = this.getView().getModel("Gemini");
									if (parseInt(oModel.getData().apiplan[tempRemoval].api_id, 10).toString().length !== oModel.getData().apiplan[tempRemoval].api_id
											.length) {
											this.aAPIPlanDel.push(oModel.getData().apiplan[tempRemoval]);
										}
									oModel.getData().apiplan.splice(tempRemoval, 1);
									this.oTable.setProperty("/apiplan", oModel.getData().apiplan);
									var actualRelease = this.getView().byId("actualReleaseAPI");
									var actualReleaseInputCol = this.getView().byId("TablePlanAPI").indexOfColumn(actualRelease);
									var jiraLinkAPI = this.getView().byId("jiraLinkAPI");
						            var jiraLinkAPICol = this.getView().byId("TablePlanAPI").indexOfColumn(jiraLinkAPI);
						            
									this.handleValueState(["TablePlanAPI"], [
										[actualReleaseInputCol, jiraLinkAPICol]
									]);

									oModel.refresh(true);
									s4.cfnd.geminiobjectpage.controller.API.fnDisplayButton(this);

								}
							}.bind(this)
						}
					);

				} 
			}
		},
		onAPIPlanTableSelect: function(oEvent) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var selectedItem = this.getView().byId("TablePlanAPI").getSelectedItem();
			var index = this.getView().byId("TablePlanAPI").indexOfItem(selectedItem);
			var oModel = this.getView().getModel("Gemini");
			var aAPIPlan = oModel.getData().apiplan;
			if (aAPIPlan[index].actual_release.trim() !== "") {
				this.getView().byId("BtnDelAPI").setEnabled(false);
				this.getView().byId("BtnConvertAPI").setEnabled(false);
				this.getView().byId("BtnDelAPI").setTooltip(oBundle.getText("objectAlreadyMappedErrorMessage"));
				this.getView().byId("BtnConvertAPI").setTooltip(oBundle.getText("objectAlreadyConvertedErrorMessage"));
			} else {
				this.getView().byId("BtnDelAPI").setEnabled(true);
				this.getView().byId("BtnConvertAPI").setEnabled(true);
				this.getView().byId("BtnDelAPI").setTooltip('');
				this.getView().byId("BtnConvertAPI").setTooltip('');

			}

		},
		fnDisplayButton: function(thisObj) {
			var oBundle = thisObj.getView().getModel("i18n").getResourceBundle();
			thisObj.getView().byId("TablePlanAPI").removeSelections();
			if ((thisObj.getView().byId("TablePlanAPI").getSelectedItem() === null)) {
				thisObj.getView().byId("BtnDelAPI").setEnabled(false);
				thisObj.getView().byId("BtnConvertAPI").setEnabled(false);

				thisObj.getView().byId("BtnDelAPI").setTooltip(oBundle.getText("deleteErrorMessage"));
				thisObj.getView().byId("BtnConvertAPI").setTooltip(oBundle.getText("convertToActualserrorText"));

			}
		},

		onSIAdd: function() {

			var oModel = this.getView().getModel("Gemini");

			var oObjectSI = {
				new_row: true,
				comm: "",
				si: "",
				protocol: ""
			};
			var aData = oModel.getProperty("/api");
			aData.unshift(oObjectSI);
			// To reset value state for all columns except Service Interface

			var communicationScenarioCol = this.getView().byId("idTable6").indexOfColumn(this.getView().byId(
				"communicationScenarioCol"));
			var protocolCol = this.getView().byId("idTable6").indexOfColumn(this.getView().byId("protocolCol"));
			var readApplicableCol = this.getView().byId("idTable6").indexOfColumn(this.getView().byId("readApplicableCol"));
			var cudApplicableCol = this.getView().byId("idTable6").indexOfColumn(this.getView().byId("cudApplicableCol"));
			this.handleValueState(["idTable6"], [
				[communicationScenarioCol, protocolCol, readApplicableCol, cudApplicableCol]
			]);

			oModel.refresh(true);

		},
		deleteAPIItems: function(oEvent) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var listItem = oEvent.getParameter('listItem');
			var index = this.getView().byId("idTable6").indexOfItem(listItem);
			var oModel = this.getView().getModel("Gemini");
			var selectedRow = oModel.getData().api[index];
			var oModelAPIPlan = this.getView().getModel("Gemini").getData().apiplan;
			var changeTypeAPI = this.getView().byId("changeTypeAPI");
			var changeTypeAPICol = this.getView().byId("TablePlanAPI").indexOfColumn(changeTypeAPI);

			if (selectedRow.si !== "" && selectedRow.comm !== "" && oModelAPIPlan.some(function(APIPlan) {
					return APIPlan.mapped_service_interface === selectedRow.si && APIPlan.actual_release !== "";
				})) {
				var deleteAlreadyMappedErrorMessage = oBundle.getText("deleteAlreadyMappedErrorMessage");

				MessageBox.error(deleteAlreadyMappedErrorMessage);
			} else {
				var deleteConfirmationMessage = oBundle.getText("deleteConfirmationMessage");
				MessageBox.confirm(
					deleteConfirmationMessage, {
						actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
						onClose: function(sAction) {
							if (sAction === "OK") {

								// Logic for deletion

								if ((parseInt(index, 10) + (this.adelCountapi)) <= ((this.tmpModel2.length) - 1)) {
									var aItems = this.byId("idTable6").getItems();
									aItems[this.tmpModel2.length - this.adelCountapi - 1].getAggregation("cells")[changeTypeAPICol].setEnabled(true);
									if (this.adelCountapi < (this.tmpModel2.length - 1)) {
										this.adelCountapi++;
									}
								}
								var x = 0;
								for (var i = 0; i < this.tmpModel2.length; i++) {
									if (oModel.getData().api[index].si === this.tmpModel2[i].si) {
										x = 1;
										break;
									}
								}
								if (x === 1) {
									this.aApidel.push(oModel.getData().api[index]);
								}

								// To reset value state for all columns except Service Interface

								var communicationScenarioCol = this.getView().byId("idTable6").indexOfColumn(this.getView().byId(
									"communicationScenarioCol"));
								var protocolCol = this.getView().byId("idTable6").indexOfColumn(this.getView().byId("protocolCol"));
								var readApplicableCol = this.getView().byId("idTable6").indexOfColumn(this.getView().byId("readApplicableCol"));
								var cudApplicableCol = this.getView().byId("idTable6").indexOfColumn(this.getView().byId("cudApplicableCol"));
								this.handleValueState(["idTable6"], [
									[communicationScenarioCol, protocolCol, readApplicableCol, cudApplicableCol]
								]);

								oModel.getData().api.splice(index, 1);
								oModel.refresh(true);

							}
						}.bind(this)
					}
				);

			}
		},
		onValueHelpRequestAPIObject: function(oEvent) {
			this.ipIdAPI = oEvent.getSource().getId();
			if (!this._SIDialog) {
				this._SIDialog = sap.ui.xmlfragment("s4.cfnd.geminiobjectpage.view.ServiceInterfaceValueHelp", this);
				this.getView().addDependent(this._SIDialog);
			}
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._SIDialog);
			this._SIDialog.open();
			if (this._SIDialog) {
				var searchField = sap.ui.getCore().byId("ServiceInterfaceDialog-list");
				searchField.addEventDelegate({
					onfocusin: function() {
						sap.ui.getCore().byId("ServiceInterfaceDialog-searchField").focus();
					}
				}, this);
			}

		},
		onValueHelpRequestAPIObjectPlan: function(oEvent) {
			this.ipIdAPIPlan = oEvent.getSource().getId();
			if (!this._SI2Dialog) {
				this._SI2Dialog = sap.ui.xmlfragment("s4.cfnd.geminiobjectpage.view.ServiceInterfaceValueHelpAPIPlanTable", this);
				this.getView().addDependent(this._SI2Dialog);
			}
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._SI2Dialog);
			this._SI2Dialog.open();

			if (this._SI2Dialog) {
				var searchField = sap.ui.getCore().byId("ServiceInterfaceDialogAPIPlanTable-list");
				searchField.addEventDelegate({
					onfocusin: function() {
						sap.ui.getCore().byId("ServiceInterfaceDialogAPIPlanTable-searchField").focus();
					}
				}, this);
			}

		},
		onAPIPlanChangeTypeSelected: function(oEvent) {
			var tableIndex = oEvent.getSource().getId().split("-")[18];

			//Expressions binding
			var oModel = this.getView().getModel("Gemini");
			var currRow = this.oTable.getProperty("/apiplan")[tableIndex];
			if (oEvent.getParameter("value") === "Enhancement") {
				currRow.protocol = "";
			} else {
				currRow.mapped_service_interface = "";
			}

			oModel.refresh(true);
		},
		handleAPIConvertConfirm: function(oEvent) {
	           try
	           {
	                 var allValuesEntered = false;
	                 var oBundle = this.getView().getModel("i18n").getResourceBundle();
	                 var check2 = false;
	                 var oBundle = this.getView().getModel("i18n").getResourceBundle();
	                 var oModel = this.getView().getModel("Gemini");
	//model for api planned items               
	                 var aapiplan = this.oTable.getProperty("/apiplan");
	//model for api actuals items
	                 var aApiActuals = this.oTable.getProperty("/api");
	                 //var xTemp = this.byId("TablePlanAPI").getItems();
	                 this.APIMapObj = {};
	                 var siExists = sap.ui.getCore().byId("APIMAP").getValue();
//	               if (siExists !== "") {
//	                    allValuesEntered = true;
//	               }
//	               var selectedRowNumber = -1;
//	               var changeTypeAPI = this.getView().byId("changeTypeAPI");
//	               var changeTypeAPICol = this.getView().byId("TablePlanAPI").indexOfColumn(changeTypeAPI);
//	               var serviceInterfaceAPI = this.getView().byId("serviceInterfaceAPI");
//	               var mappedServiceInterfaceCol = this.getView().byId("TablePlanAPI").indexOfColumn(serviceInterfaceAPI);
	                 //                            var aAPIPlanTemp = $.extend(true, [], this.oTable.getProperty("/apiplan"));

	                 //checks whether service interface has been selected from the f4 help
	                 if (siExists !== "") {
	                      
	                      // adding the selected values in f4 help fragment to the new object
	                       this.APIMapObj.mapped_service_interface = siExists;
	                      this.APIMapObj.actual_release = sap.ui.getCore().byId("ActualReleaseAPI").getValue();
	                       this.APIMapObj.communicationscenario = sap.ui.getCore().byId("csPlanVal").getValue();
	                      // end of assignment
	                      
	                      // getting the selected item and its index from the api plan table
	                      var oSelectedItem = this.byId("TablePlanAPI").getSelectedItem();
	                      var iSelectedItemIndex = oSelectedItem.getId()[oSelectedItem.getId().length-1];
	                      
	                      //getting the guid
	                      //this.APIMapObj.api_id = aapiplan[iSelectedItemIndex].api_id;
//	               aapiplan[iSelectedItemIndex].mapped_service_interface = this.APIMapObj.mapped_service_interface;
//	                     aapiplan[iSelectedItemIndex].actual_release = this.APIMapObj.actual_release;
//	                     aapiplan[iSelectedItemIndex].area = this.sArea;
	                      
	                      // adding the service interface to the object created
	                       this.APIMapObj.service_interface_wov = siExists;
	                      
	                      //getting the flags of the selected item
	                      var readSelected   = aapiplan[iSelectedItemIndex].read_applicable;
	                      var createSelected = aapiplan[iSelectedItemIndex].create_applicable;
	                      var updateSelected = aapiplan[iSelectedItemIndex].update_applicable;
	                      var deleteSelected = aapiplan[iSelectedItemIndex].delete_applicable;
	                      var othersSelected = aapiplan[iSelectedItemIndex].others_applicable;
	                      
	                      // creating a deep copy of apiplan
	                      var aApiPlanCopy = $.extend(true, [], aapiplan);
	                       aApiPlanCopy.splice(iSelectedItemIndex,1);
	                      
	                      // this filter is used to get any planned entry with a mapped service interface same as the service interface selected in the f4 help and having same operations as the selected entry
	                      var aApiConversionAllowed = aApiPlanCopy.filter(function(data){
	                            var sameOperationCheck;
	                            if( ( data.create_applicable && createSelected ) || ( data.read_applicable && readSelected ) || ( data.update_applicable && updateSelected )|| ( data.delete_applicable && deleteSelected ) || ( data.others_applicable && othersSelected ))
	                                 {sameOperationCheck = true;}
	                            if(data.mapped_service_interface === siExists && aapiplan[iSelectedItemIndex].change_type === 'New' &&  sameOperationCheck)
	                                 return true;
	                            else
	                                 return false;
	                      });
	                      
	                      // if any of the entries have same service interface or operations, then length of the array created will be greater than zero, hence will throw an error as such an entry shouldn't be allowed 
	                      if(aApiConversionAllowed.length > 0 )
	                            {throw "Selected planned entry cannot be converted to Actuals because the operations are similar to an existing entry"; }
	                      
	                      // this checks whether an entry with the same service interface is already present in actuals or not
	                      var aApiExists = aApiActuals.filter(function(data) {
	                            if(data.si === siExists)
	                                 {return true;}
	                            else
	                                 {return false;}
	                      });
	                      
	                      // if entry is not present in actuals, only then will it be added to the actuals model
	                      if ( aApiExists.length === 0 && aapiplan[iSelectedItemIndex].change_type === 'New')
	                            {
	                            this.APIMapObj.service_interface_wov = siExists;
	                      s4.cfnd.geminiobjectpage.controller.API.uiWriteIntoAPIActuals(this.APIMapObj, aapiplan[iSelectedItemIndex].protocol, siExists, this);
	                            }
	                      
	                      // adding the actual release, selected service interface into the model
	                 aapiplan[iSelectedItemIndex].mapped_service_interface = this.APIMapObj.mapped_service_interface;
	                       aapiplan[iSelectedItemIndex].actual_release = this.APIMapObj.actual_release;
	                       aapiplan[iSelectedItemIndex].area = this.sArea;
	                      
	                      
	                      this.APIMapObj = aapiplan[iSelectedItemIndex];
	                      
	                      //adding status and other properties to apiplan after conversion to actuals
	                       aapiplan[iSelectedItemIndex].status_colour = "Green";
	                       aapiplan[iSelectedItemIndex].tool_tip = "Object already mapped";
	                       aapiplan[iSelectedItemIndex].status_icon = "sap-icon://border";
	                      
	                      
	                      // this was the old code
//	                    for (var i = 0; i < xTemp.length; i++) {
//	                          if (xTemp[i].getSelected() === true) {
//	                               //getting service_interface_wov for uiWriteIntoAPIActuals() call
//	                               selectedRowNumber = i;
//	                                this.APIMapObj.api_id = aapiplan[i].api_id;
//	                                aapiplan[i].mapped_service_interface = this.APIMapObj.mapped_service_interface;
//	                                aapiplan[i].actual_release = this.APIMapObj.actual_release;
//	                               aapiplan[i].area = this.sArea;
//	                               
//	                               if (xTemp[i].getAggregation("cells")[changeTypeAPICol].getProperty("selectedKey") === oBundle.getText("changeTypeNew")) {
	//
//	                                     var SIHelp = this.oTable.getProperty("/apiConvertSIValueHelpExceptActuals");
//	                                     SIHelp = SIHelp.filter(function(data) {
//	                                          return (data.ServiceInterface === siExists );
//	                                     });
//	                                     this.APIMapObj.service_interface_wov = SIHelp[0].service_interface_wov;
//	                                     this.getView().byId("siId").setEditable(false);
//	                               s4.cfnd.geminiobjectpage.controller.API.uiWriteIntoAPIActuals(this.APIMapObj, aapiplan[i].protocol, this.service_interface_wov, this);
//	                                     this.getView().byId("siId").setEditable(true);
//	                               }
//	                               this.APIMapObj = aapiplan[i];
//	                                aapiplan[i].status_colour = "Green";
//	                               aapiplan[i].tool_tip = "Object already mapped";
//	                                aapiplan[i].status_icon = "sap-icon://border";
//	                          }
	//
//	                    }
	                      
	                      //resetting and then refreshing the model
	                      oModel.setProperty("/apiplan", aapiplan);
	                      oModel.refresh(true);
	                      //            var x = this.byId("TablePlanAPI").getItems();

	                      
	                       this.aAPIPlanMap.push(this.APIMapObj);
	                      if (aapiplan[iSelectedItemIndex].change_type === "New") {

	                      sap.m.MessageToast.show(oBundle.getText("objectConvertedToast"));
	                      } else {
	                      sap.m.MessageToast.show(oBundle.getText("objectMappedToast"));
	                      }

	                 s4.cfnd.geminiobjectpage.controller.API.fnDisplayButton(this);
	                 } else {
	                      var convertWithoutCompleteDataErrorMessage = oBundle.getText("convertWithoutCompleteDataErrorMessage");
	                 MessageBox.error(convertWithoutCompleteDataErrorMessage);
	                 }
	           }
	            catch(err)
	                 { MessageBox.error(err);   }
	           
	           //resetting the values of the convert to actuals fragment
	                 sap.ui.getCore().byId("APIMAP").setValue("");
	               sap.ui.getCore().byId("csPlan").setVisible(false);
	           sap.ui.getCore().byId("csPlanVal").setVisible(false);
	                 sap.ui.getCore().byId("csPlanVal").setValue("");
	           sap.ui.getCore().byId("ActualReleaseAPI").setValue(this.final);
	                 this.APIMapObj = null;
	           },

		handleAPIConvertClose: function(oEvent) {
			sap.ui.getCore().byId("APIMAP").setValue("");
			sap.ui.getCore().byId("csPlan").setVisible(false);
			sap.ui.getCore().byId("csPlanVal").setVisible(false);
			sap.ui.getCore().byId("csPlanVal").setValue("");
			sap.ui.getCore().byId("ActualReleaseAPI").setValue(this.final);
			this.APIMapObj = null;

		},
		siValueHelpAPIExceptActuals: function(thisObj, protocolFilter) {
			var array = thisObj.getView().getModel("Gemini").getData().api;
			var siHelp;
			var that = thisObj;
			var sUriSI = "/I_SBRSERVICEINTERFACEVH";
			thisObj.oModel.read(sUriSI, {
				success: function(oResponse) {
					//TRY FILTER
					siHelp = oResponse.results;
//					for (var i = 0; i < array.length; i++) {
//						for (var j = 0; j < siHelp.length; j++) {
//							if ((array[i].si === siHelp[j].ServiceInterface && array[i].comm === siHelp[j].communication_scenario_id &&
//									array[i].protocol === siHelp[j].protocol) || siHelp[j].protocol !== protocolFilter) {
//								siHelp.splice(j, 1);
//							}
//						}
//					}

					that.oTable.setProperty("/apiConvertSIValueHelpExceptActuals", siHelp);
				},
				error: function() {

				}
			});

		},
		onValueHelpRequestAPIObjectConvertAPI: function(oEvent) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();

			if (!this._SIMapDialog) {
				this._SIMapDialog = sap.ui.xmlfragment("s4.cfnd.geminiobjectpage.view.ServiceInterfaceValueHelpConvertAPI", this);
				this.getView().addDependent(this._SIMapDialog);
			}
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._SIMapDialog);
			var isSelected = this.getView().byId("TablePlanAPI").getSelectedItem();
			var tempRemoval = -1;
			var xTemp = this.byId("TablePlanAPI").getItems();
			var protocolValue;
			var protocolAPI = this.getView().byId("protocolAPI");
			var protocolAPICol = this.getView().byId("TablePlanAPI").indexOfColumn(protocolAPI);
			var changeTypeAPI = this.getView().byId("changeTypeAPI");
			var changeTypeAPICol = this.getView().byId("TablePlanAPI").indexOfColumn(changeTypeAPI);

			if (isSelected) {
				tempRemoval = this.getView().byId("TablePlanAPI").indexOfItem(isSelected);
				protocolValue = xTemp[tempRemoval].getAggregation("cells")[protocolAPICol].getSelectedKey();
			}
			this._SIMapDialog.open();
			if (this._SIMapDialog) {
				var searchField = sap.ui.getCore().byId("ServiceInterfaceDialogAPIPlanned-list");
				searchField.addEventDelegate({
					onfocusin: function() {
						sap.ui.getCore().byId("ServiceInterfaceDialogAPIPlanned-searchField").focus();
					}
				}, this);
			}

			if (xTemp[tempRemoval].getAggregation("cells")[changeTypeAPICol].getSelectedKey() === oBundle.getText("changeTypeNew")) {
				this._SIMapDialog.setTitle("Service Interface Value Help for " + protocolValue + " Protocol");
			}

		},
		CRUDOperationsAPI: function(thisObj) {
			sap.ui.namespace("sap.ui.view.model");
			sap.ui.view.model.oModel = thisObj.getView().getModel("Gemini");
			var aAPI = $.extend(true, [], thisObj.oTable.getProperty("/api")),
				j;

			for (var i = 0; i < thisObj.aApidel.length; i++) {
				thisObj.aApidel[i].sapobjecttype = thisObj.sObj;
				thisObj.aApidel[i].apitype = thisObj.aApidel[i].protocol;
				thisObj.aApidel[i].communicationscenario = thisObj.aApidel[i].comm;
				thisObj.aApidel[i].serviceinterface = thisObj.aApidel[i].si;
				thisObj.oModel.remove("/I_SBRSOTAPIMAP(sapobjecttype='" + thisObj.aApidel[i].sapobjecttype + "',serviceinterface='" +
					encodeURIComponent(thisObj.aApidel[
							i]
						.serviceinterface) +
					"',communicationscenario='" + thisObj.aApidel[i].communicationscenario + "',apitype='" + thisObj.aApidel[i].apitype + "')", {
						groupId: thisObj.sDeferredGroup,
						success: function() {

						},
						error: function() {
						}
					});
			}
			for (var i = 0; i < aAPI.length; i++) {
				if (aAPI[i].new_row || aAPI[i].new_mapped_row) {
					aAPI[i].sapobjecttype = thisObj.sObj;
					aAPI[i].serviceinterface = aAPI[i].si;
					aAPI[i].communicationscenario = aAPI[i].comm;
					aAPI[i].apitype = aAPI[i].protocol;
					delete aAPI[i].si;
					delete aAPI[i].comm;
					delete aAPI[i].protocol;
					delete aAPI[i].new_row;
					delete aAPI[i].read;
					delete aAPI[i].create;
					delete aAPI[i].others;
					delete aAPI[i].new_mapped_row;
					delete thisObj.oTable.getProperty("/api")[i].new_row;
					delete thisObj.oTable.getProperty("/api")[i].new_mapped_row; 
						 

					var uri = '/I_SBRSOTAPIMAP';
					thisObj.oModel.create(uri, aAPI[i], {
						groupId: thisObj.sDeferredGroup,
						success: function() {
						},
						error: function() {
						}
					});
				}
			}
			// Create for API Planning

			var oModel = thisObj.getView().getModel("Gemini");
			var aAPIPlanCreate = $.extend(true, [], thisObj.oTable.getProperty("/apiplan"));
			var x4 = thisObj.byId("TablePlanAPI").getItems();
			var oHearderModel = thisObj.getView().getModel("Header").getData();
			var area = oHearderModel.sArea;
			var sAPILength = aAPIPlanCreate.length;
			for (i = sAPILength - 1; i >= 0; i--) {
				if (aAPIPlanCreate[aAPIPlanCreate.length - 1].api_id.length > 25) { 
					aAPIPlanCreate.splice(aAPIPlanCreate.length - 1, 1);

				}
			}
			for (i = 0; i < aAPIPlanCreate.length; i++) {
				aAPIPlanCreate[i].area = area;
				for (var j = 0; j < thisObj.aAPIPlanMap.length; j++) {
					if (aAPIPlanCreate[i].api_id === thisObj.aAPIPlanMap[j].api_id) {
						thisObj.aAPIPlanMap.splice(j, 1);
					}
				}
			}
			var aAPIPlanUpdate = $.extend(true, [], thisObj.oTable.getProperty("/apiplan"));
			for (var k = 0; k < aAPIPlanUpdate.length; k++) {
				aAPIPlanUpdate[k].area = area;
				for (var j = 0; j < aAPIPlanCreate.length; j++) {
					if (aAPIPlanCreate[j].api_id === aAPIPlanUpdate[k].api_id) {
						aAPIPlanUpdate.splice(k, 1);
					}
				}
			}
			// If no details are changed from tmp Model then don't send for update

			for (k = 0; k < aAPIPlanUpdate.length; k++) {
				for (var j = 0; j < thisObj.tmpModelAPIPlan.length; j++) {
					if (JSON.stringify(thisObj.tmpModelAPIPlan[j]) === JSON.stringify(aAPIPlanUpdate[k])) {
						aAPIPlanUpdate.splice(k, 1);
					}
				}
			}

			var that = thisObj;
			$.each(aAPIPlanCreate, function(iIndex, oItem) {
				aAPIPlanCreate[iIndex].api_id = "11000000-0000-0000-0000-000000000000";

				thisObj.oModel.create("/I_SBRAPIPLAN", aAPIPlanCreate[iIndex], {
					groupId: thisObj.sDeferredGroup,
					success: function(oResponse) {
						var oModel = thisObj.getView().getModel("Gemini");
						oModel.getData().apiplan[iIndex].api_id = oResponse.api_id;
						aAPIPlanCreate[iIndex].api_id = oResponse.api_id;
					},
					error: function() {}
				});
			});


			/* End Planning Creations */
			//            Start API Planned objects update
			for (var k = 0; k < aAPIPlanUpdate.length; k++) {
				thisObj.oModel.update("/I_SBRAPIPLAN(guid'" + aAPIPlanUpdate[k].api_id + "')", aAPIPlanUpdate[k], {
					groupId: thisObj.sDeferredGroup,
					success: function() {

						// console.log("Success");

					},
					error: function() {
						// console.log("Error");
					}
				});
			}

			// Start of planning qualities deletion

			//Start of API Planned objects deletion
			for (var i = 0; i < thisObj.aAPIPlanDel.length; i++) {


				thisObj.oModel.remove("/I_SBRAPIPLAN(guid'" + thisObj.aAPIPlanDel[i].api_id + "')", {
					groupId: thisObj.sDeferredGroup,
					success: function() {

					},
					error: function() {
					}
				});
			}
			if (thisObj.aAPIPlanMap.length) {

				for (var i = 0; i < thisObj.aAPIPlanMap.length; i++) {
					if (thisObj.aAPIPlanMap[i].api_id.length < 25) {
						thisObj.aAPIPlanMap[i].api_id = "40f2e9af-be89-2ee7-abb0-00b7d3146c57";
					}
					thisObj.oModel.update("/I_SBRAPIPLAN(guid'" + thisObj.aAPIPlanMap[i].api_id + "')", thisObj.aAPIPlanMap[i], {
						groupId: thisObj.sDeferredGroup,
						success: function() {
						},
						error: function() {
						}
					});
				}
			}

		},
		createError: function(response) {

		},

		uiWriteIntoAPIActuals: function(array, protocol, si, thisObj) {
			var oModel = thisObj.getView().getModel("Gemini");

			var sUri1 = "/I_SBRSICRUD";
			var aFiltersAPI = [];
			aFiltersAPI.push(new sap.ui.model.Filter("ServiceInterface", sap.ui.model.FilterOperator.EQ, array.service_interface_wov));
			var setReadValue = "",
				setCUDValue = "",
				setOthValue = "";
			thisObj.oModel.read(sUri1, {
				filters: aFiltersAPI,
				success: function(oResponse) {

					if (oResponse.results.length > 0) {
						setReadValue = oResponse.results[0].readapi;
						setOthValue =  oResponse.results[0].othersapi;
						setCUDValue = ((oResponse.results[0].createapi + oResponse.results[0].updateapi + oResponse.results[0].deleteapi) > 0 ? 1 : 0);

						setReadValue = ((setReadValue > 0) ? "Yes" : "No");
						setCUDValue = ((setCUDValue > 0) ? "Yes" : "No");
						setOthValue = ((setCUDValue > 0) ? "Yes" : "No");
					}
					var oObjectSI = {
						comm: array.communicationscenario,
						si: array.mapped_service_interface,
						protocol: protocol,
						service_interface_wov: si,
						read: setReadValue,
						create: setCUDValue,
						others: setOthValue,
						new_mapped_row: true
					};
					var aOutput = oModel.getProperty("/api");
					aOutput.unshift(oObjectSI);
					oModel.refresh(true);

				}.bind(this),
				error: function() {
					var oObjectSI = {
						comm: array.communicationscenario,
						si: array.mapped_service_interface,
						protocol: protocol,
						service_interface_wov: si,
						read: setReadValue,
						create: setCUDValue,
						others: setOthValue,
						new_mapped_row: true
					};
					var aOutput = oModel.getProperty("/api");
					aOutput.unshift(oObjectSI);
					oModel.refresh(true);
				}
			});

		},
		onValueHelpRequestTargetReleaseAPIConvert: function(oEvent) {

			this.ipActualReleaseId = oEvent.getSource().getId();
			if (!this.actualReleaseHelp) {
				this.actualReleaseHelp = sap.ui.xmlfragment("s4.cfnd.geminiobjectpage.view.TargetReleaseValueHelpAPIConvert", this);
				this.getView().addDependent(this.actualReleaseHelp);
			}
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this.actualReleaseHelp);
			this.actualReleaseHelp.open();
			if (this.actualReleaseHelp) {
				var searchField = sap.ui.getCore().byId("TargetReleaseHelpAPIConvert-list");
				searchField.addEventDelegate({
					onfocusin: function() {
						sap.ui.getCore().byId("TargetReleaseHelpAPIConvert-searchField").focus();
					}
				}, this);
			}

		},

		handleAppCloseEventAPIConvert: function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oEvent.getSource().getId() === "TargetReleaseHelpAPIConvert" && oSelectedItem !== undefined) {
				var x = sap.ui.getCore().byId("ActualReleaseAPI");
				x.setValue(oSelectedItem.getTitle());
			}
			this.APIMapObj.actual_release = oSelectedItem.getTitle();
			oEvent.getSource().getBinding("items").filter([]);
		},

	};
	return s4.cfnd.geminiobjectpage.controller.API;

});