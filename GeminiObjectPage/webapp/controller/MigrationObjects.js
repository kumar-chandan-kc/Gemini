/*global s4:true*/
jQuery.sap.declare("s4.cfnd.geminiobjectpage.controller.MigrationObjects");
sap.ui.define([
	"sap/m/MessageBox"
], function(MessageBox) {
	"use strict";

	s4.cfnd.geminiobjectpage.controller.MigrationObjects = {

		// Edit or cancel mode for Migration Planning table
		// bMode : Edit = 2 | Cancel = 1 | After successful save = 0
		// Migration Objects
		migrationPlanChangeMode: function(oEvent, nMode) {
			var bMode;
			if (nMode === 2) {
				bMode = true;
			} else if (nMode === 0 || nMode === 1) {
				bMode = false;
			}
			oEvent.getView().byId("addPlanMigr").setVisible(bMode);
			oEvent.getView().byId("deleteMigrPlan").setVisible(bMode);
			oEvent.getView().byId("mapPlanMigr").setVisible(bMode);
			oEvent.getView().byId("TablePlanMigrEdit").setVisible(bMode);
			oEvent.getView().byId("TablePlanMigrDisplay").setVisible(!bMode);

			if (bMode) {
				oEvent.aMigrPlanDel = [];
				oEvent.oMigrPlanTempModel = $.extend(true, [], oEvent.getView().getModel("geminiMigr").getData().aMigrPlan);

			} else {

				if (nMode === 1) {
					oEvent.oViewMigr.setProperty("/aMigrPlan", oEvent.oMigrPlanTempModel);
					oEvent.getView().getModel("geminiMigr").refresh(true);
				}

				oEvent.aMigrPlanDel = null;
			}
		},
		
		migrationActualsChangeMode: function(oEvent, nMode){
			var bMode;
			if (nMode === 2) {
				bMode = true;
			} else if (nMode === 0 || nMode === 1) {
				bMode = false;
			}
			oEvent.getView().byId("migrationActualsAdd").setVisible(bMode);
			oEvent.getView().byId("tableMigrationActualsEdit").setVisible(bMode);
			oEvent.getView().byId("idTable").setVisible(!bMode);

			if (bMode) {
				oEvent.aMigrationActualsDelete = [];
				oEvent.aMigrationActualCopy = $.extend(true, [], oEvent.oTable.getProperty("/migr"));
				
			} else {
				if (nMode === 1) {
					oEvent.oTable.setProperty("/migr", oEvent.aMigrationActualCopy);
					oEvent.getView().getModel("Gemini").refresh(true);
				}
				
				oEvent.aMigrationActualsDelete = null;
			}
		},

		// handling CRUD operations for Migration Planning table
		handleMigrPlanCRUD: function(oEvent) {
			if (oEvent.oViewMigr.getProperty("/aMigrPlan")) {
				var intialModel = oEvent.oMigrPlanTempModel;
				var aMigrationPlanItems = oEvent.oViewMigr.getProperty("/aMigrPlan");
				$.each(aMigrationPlanItems, function(iIndex, oItem) {
						if (oItem.migrid !== "000") {
							var tempUpdate = $.extend(true, {}, oItem);
							var atemp = intialModel.filter(function(x) {
								return tempUpdate.migrid === x.migrid;
							});
							if (JSON.stringify(atemp[0]) !== JSON.stringify(tempUpdate)) {
								tempUpdate.change_type = (tempUpdate.change_type === "New") ? "0" :
									"1";
								oEvent.oModel.update("/I_SBRMIGRPLAN(guid'" + tempUpdate.migrid + "')", tempUpdate, {
									groupId: oEvent.sDeferredGroup,
									success: function() {

									},
									error: function() {

									}
								});
							}
						}
						if (oItem.migrid === "000") {
							oItem.migrid = "40f2e9af-be89-2ee7-abb0-00b7d3146c56";
							oEvent.migrCreate = oItem;
							oEvent.migrCreate.change_type = (oEvent.migrCreate.change_type === "New") ? "0" :
								"1";
							oEvent.oModel.create("/I_SBRMIGRPLAN", aMigrationPlanItems[iIndex], {
								groupId: oEvent.sDeferredGroup,
								success: function(oResponse) {
									aMigrationPlanItems[iIndex].change_type = (oEvent.migrCreate.change_type === "0") ? "New" : "Enhancement";
									aMigrationPlanItems[iIndex].migrid = oResponse.migrid;
								},
								error: function(oResponse) {
									// console.log(oResponse);
								}
							});
						}
					});
			}
			if (oEvent.aMigrPlanDel !== null) {
				for (var i = 0; i < oEvent.aMigrPlanDel.length; i++) {
					oEvent.oModel.remove("/I_SBRMIGRPLAN(guid'" + oEvent.aMigrPlanDel[i].migrid + "')", {
						groupId: oEvent.sDeferredGroup,
						success: function() {

						},
						error: function() {

						}
					});
				}
			}
			// Toggle mode for migration (set editable to false and hide add and
			// delete buttons) 0 = Save mode

			var migrActualData = $.extend(true, [], oEvent.oTable.getProperty("/migr"));
		
			var uri = '/I_SBRMIGRATIONACTUALS';
			for (var index = 0; index < migrActualData.length; index++) {
				if (migrActualData[index].rowType === "New" || migrActualData[index].rowType === "maped") {
					delete migrActualData[index].rowType;
					oEvent.oModel.create(uri, migrActualData[i], {
						groupId: oEvent.sDeferredGroup,
						success: function() {
						},
						error: function() {}
					});
				}
			}
			oEvent.oTable.setProperty("/migr", migrActualData);
			oEvent.getView().getModel("Gemini").refresh(true);
			
			if(oEvent.aMigrationActualsDelete !== null){
				for (var k = 0; k < oEvent.aMigrationActualsDelete.length; k++) {
					
					oEvent.oModel.remove("/I_SBRMIGRATIONACTUALS(ident='" + oEvent.aMigrationActualsDelete[k].ident + "',lfdno='" + encodeURIComponent(oEvent.aMigrationActualsDelete[k].lfdno) + "',sapobjecttype='" + oEvent.aMigrationActualsDelete[k].sapobjecttype + "')", {	
					
						groupId: oEvent.sDeferredGroup,
						success: function() {
						},
						error: function() {
						}
					});
				}
			}

		},
		
		migrationPlanning: function(oEvent) {

			oEvent.oViewMigr = new sap.ui.model.json.JSONModel({
				aMigrPlan: [],
				aChangeType: []
			});
			var aChange = [];
			var tempx = {};
			tempx.value = "New";
			aChange[0] = $.extend({}, tempx);
			tempx.value = "Enhancement";
			aChange[1] = $.extend({}, tempx);
			oEvent.oViewMigr.setProperty("/aChangeType", aChange);

			var that = oEvent;
			var sUriMgr = "/I_SBRMIGRPLAN";
			var aFiltersMigr = [];

			aFiltersMigr.push(new sap.ui.model.Filter("sap_bo_type", sap.ui.model.FilterOperator.EQ, oEvent.sObj)); 
			oEvent.oModel.read(sUriMgr, {
				filters: aFiltersMigr,
				success: function(oData, oResponse) {
					that.oViewMigr.setProperty("/aMigrPlan", oData.results);
				},
				error: function() {}
			});
			oEvent.getView().setModel(oEvent.oViewMigr, "geminiMigr");
			oEvent.getView().byId("TablePlanMigrEdit").setMode(sap.m.ListMode.SingleSelectLeft);

		},

		addPlanMigr: function(oEvent) {

			var oModel = oEvent.getView().getModel("geminiMigr");
			var oObject = {
				migrid: "000",
				sap_bo_type: oEvent.sObj,
				migration_object: "",
				change_type: "New",
				load_api: "",
				load_avail: false,
				load_avail_plan: "",
				target_release: "",
				description: "",
				status: "",
				migration_mapped: "",
				actual_release: "",
				jira_link: "",
				jira_backlog_link: "",
				jira_valid: '1'

			};
			var aMigrPlan = oModel.getProperty("/aMigrPlan");
			aMigrPlan.unshift(oObject);

			// To reset value state for Target Release
			var actualRelease = oEvent.getView().byId("actualReleaseMigration");
			var actualReleaseInputCol = oEvent.getView().byId("TablePlanMigrEdit").indexOfColumn(actualRelease);
			oEvent.handleValueState(["TablePlanMigrEdit"], [
				[actualReleaseInputCol]
			]);

			oModel.refresh(true);
			oEvent.getView().byId("TablePlanMigrEdit").removeSelections();

		},

		deletePlanMigr: function(oEvent) {

			var selectedItem = oEvent.getView().byId("TablePlanMigrEdit").getSelectedItem();
			var oBundle = oEvent.getView().getModel("i18n").getResourceBundle();
			if (selectedItem === null) {
				// var bCompact =
				// !!oEvent.getView().$().closest(".sapUiSizeCompact").length;
				sap.m.MessageBox.error(oBundle.getText("deleteErrorMessage"));
					
			
			} else {
				var nIndex = oEvent.getView().byId("TablePlanMigrEdit").indexOfItem(selectedItem);
				var oModel = oEvent.getView().getModel("geminiMigr");
				if (oModel.getData().aMigrPlan[nIndex].migration_mapped !== "") {
					// bCompact =
					// !!oEvent.getView().$().closest(".sapUiSizeCompact").length;
					sap.m.MessageBox.error("statusDeleteErrorMessage");
									
				} else {
					var deleteConfirmationMessage = oBundle.getText("deleteConfirmationMessage");
					MessageBox.confirm(
							deleteConfirmationMessage, {
							actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
							// styleClass: bCompact ? "sapUiSizeCompact" : "",
							onClose: function(sAction) {
								if (sAction === "YES") {

									// Logic for deletion

									if (oModel.getData().aMigrPlan[nIndex].migrid !== "000") {
										oEvent.aMigrPlanDel.push(oModel.getData().aMigrPlan[nIndex]);
									}
									oModel.getData().aMigrPlan.splice(nIndex, 1);
									oEvent.oViewMigr.setProperty("/aMigrPlan", oModel.getData().aMigrPlan);

									// To reset value state for Target Release
									var actualRelease = oEvent.getView().byId("actualReleaseMigration");
									var actualReleaseInputCol = oEvent.getView().byId("TablePlanMigrEdit").indexOfColumn(actualRelease);
									oEvent.handleValueState(["TablePlanMigrEdit"], [
										[actualReleaseInputCol]
									]);

									oModel.refresh(true);
									this.fnDisplayButton(oEvent);
								}
							}.bind(this)
						}
					);

				}
			}
		},
		
		onMigrTableSelect: function(oEvent) {
			var selectedItem = this.getView().byId("TablePlanMigrEdit").getSelectedItem();
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var index = this.getView().byId("TablePlanMigrEdit").indexOfItem(selectedItem);
			var oModel = this.getView().getModel("geminiMigr");
			var aMigrationPlan = oModel.getData().aMigrPlan;
			if (aMigrationPlan[index].actual_release.trim() !== "") {
				this.getView().byId("deleteMigrPlan").setEnabled(false);
				this.getView().byId("mapPlanMigr").setEnabled(false);
				this.getView().byId("deleteMigrPlan").setTooltip(oBundle.getText("objectAlreadyMappedErrorMessage"));
				this.getView().byId("mapPlanMigr").setTooltip(oBundle.getText("objectAlreadyMappedErrorMessage"));
			} else {
				this.getView().byId("deleteMigrPlan").setEnabled(true);
				this.getView().byId("mapPlanMigr").setEnabled(true);
				this.getView().byId("deleteMigrPlan").setTooltip('');
				this.getView().byId("mapPlanMigr").setTooltip('');

			}
		},
		
		fnDisplayButton: function(oEvent) {
			var oBundle = oEvent.getView().getModel("i18n").getResourceBundle();
			oEvent.getView().byId("TablePlanMigrEdit").removeSelections();
			if ((oEvent.getView().byId("TablePlanMigrEdit").getSelectedItem() === null)) {
				oEvent.getView().byId("deleteMigrPlan").setEnabled(false);
				oEvent.getView().byId("mapPlanMigr").setEnabled(false);

				oEvent.getView().byId("deleteMigrPlan").setTooltip(oBundle.getText("deleteErrorMessage"));
				oEvent.getView().byId("mapPlanMigr").setTooltip(oBundle.getText("mapToActualsNotSelectedErrorText"));

			}
		},

		migrMapConfirm: function(oEvent) {
			var oBundle = oEvent.getView().getModel("i18n").getResourceBundle();

			var allValuesEntered = false;
			var check2 = false;
			var oModel = oEvent.getView().getModel("geminiMigr");
			var nIndex = -1;
			var migrPlanTable = oEvent.getView().byId("TablePlanMigrEdit");
			var oMigrObject = migrPlanTable.getSelectedItem();
			if (oMigrObject) {
				nIndex = migrPlanTable.indexOfItem(oMigrObject);
			}
			var aMigrplan = oModel.getData().aMigrPlan;
			aMigrplan[nIndex].migration_mapped = sap.ui.getCore().byId("MigrObjMap").getValue("");
			aMigrplan[nIndex].actual_release = sap.ui.getCore().byId("ActualReleaseMigr").getValue("");

			if (aMigrplan[nIndex].migration_mapped !== "") {
				allValuesEntered = true;
			}
			if (aMigrplan[nIndex].actual_release !== "") {
				check2 = true;
			}

			if (!check2) {
				aMigrplan[nIndex].actual_release = oEvent.final;
			}

			if (allValuesEntered) {

				if (sap.ui.getCore().byId("MigrObjMap").getValueState() === "Error") {
					aMigrplan[nIndex].migration_mapped = "";
					aMigrplan[nIndex].actual_release = "";
					MessageBox.error(oBundle.getText("operationCancel"));
				} else {
					oModel.setProperty("/aMigrPlan", aMigrplan);
					oModel.refresh(true);

					if (aMigrplan[nIndex].change_type === "New") {
						s4.cfnd.geminiobjectpage.controller.MigrationObjects.onMappingMigrationActualsAdd(oEvent);
					}
					sap.m.MessageToast.show("Object mapped");
				}

				this.fnDisplayButton(oEvent);

			} else {
				// var bCompact =
				// !!oEvent.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.error(oBundle.getText("operationCancel"));
							}
			sap.ui.getCore().byId("MigrObjMap").setValue("");
			sap.ui.getCore().byId("ActualReleaseMigr").setValue(oEvent.final);

		},
		
		onMigrationActualsAdd: function(oEvent){
			var oModel = this.getView().getModel("Gemini");
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			
			var oObject = {
				rowType: oBundle.getText("changeTypeNew"),
				ident: "",
				lfdno: "",
				sapobjecttype: this.sObj,
				firstrelease: "",
				funcname: "Load_API"
			};
			
			var aMigrActual = oModel.getProperty("/migr");
			aMigrActual.unshift(oObject);
			oModel.refresh(true);
		},
		
		onMappingMigrationActualsAdd: function(thisObj) {
			var oModel = thisObj.getView().getModel("Gemini");
			thisObj.tmpMigrActual = $.extend(true, [], oModel.getProperty("/migr"));
			var isSelected = thisObj.getView().byId("TablePlanMigrEdit").getSelectedItem();
			var tempRemoval = thisObj.getView().byId("TablePlanMigrEdit").indexOfItem(isSelected);
			var loadAPI = thisObj.getView().byId("loadAPI");
			var loadAPICol = thisObj.getView().byId("TablePlanMigrEdit").indexOfColumn(loadAPI);
			var migrPlan = thisObj.byId("TablePlanMigrEdit").getItems();
			var funcName = migrPlan[tempRemoval].getAggregation("cells")[loadAPICol].getValue();

			thisObj.uniqueEntryAPIPlanID++;
			var oObject = {
				rowType: "maped",

				ident: sap.ui.getCore().byId("MigrObjMap").getValue(),
				sapobjecttype: thisObj.sObj,
				firstrelease: sap.ui.getCore().byId("ActualReleaseMigr").getValue(),
				funcname: funcName
			};

			var aMigrActual = oModel.getProperty("/migr");
			aMigrActual.unshift(oObject);
			oModel.refresh(true);
		},
		
		onMigrationActualsDelete: function(oEvent){
			var index = oEvent.getParameter("listItem").getBindingContextPath().split("/")[2];
			var oModel = this.getView().getModel("Gemini");
			var selectedRow = oModel.getData().migr[index];
			var aMigrationPlan = this.getView().getModel("geminiMigr").getData().aMigrPlan;
			var oBundle = this.getView().getModel("i18n").getResourceBundle();

			if (selectedRow.ident !== "" && aMigrationPlan.some(function(aMigrPlan) {
					return aMigrPlan.migration_mapped === selectedRow.ident;
				})) {
				sap.m.MessageBox.error(oBundle.getText("deleteAlreadyMappedErrorMessage"));
			} else {
				var deleteConfirmationMessage = oBundle.getText("deleteConfirmationMessage");
				MessageBox.confirm(
						deleteConfirmationMessage, {
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
						onClose: function(sAction) {
							if (sAction === "YES") {
						
							if(oModel.getData().migr[index].rowType === undefined){
								this.aMigrationActualsDelete.push(oModel.getData().migr[index]);
							}	
								
								oModel.getData().migr.splice(index, 1);
								oModel.refresh(true);
							}
						}.bind(this)
					}
				);

			}
		},
		
		mapPlanMigr: function(oEvent) {

			var checkFlag = false;
			var oBundle = oEvent.getView().getModel("i18n").getResourceBundle();
			var xTemp = oEvent.byId("TablePlanMigrEdit").getItems();
			var isSelected = oEvent.getView().byId("TablePlanMigrEdit").getSelectedItem();
			var tempRemoval = -1;
			var mdtVal = false;
			var oMigrActuals = oEvent.oTable.getProperty("/migr");
			if (isSelected) {
				var selectedItem = oEvent.getView().byId("TablePlanMigrEdit").getSelectedItem();
				tempRemoval = oEvent.getView().byId("TablePlanMigrEdit").indexOfItem(selectedItem);
			}

			if ((isSelected && oMigrActuals.length !== 0) || (isSelected && xTemp[tempRemoval].getAggregation("cells")[0].getSelectedKey())) {

				// tempRemoval =
				// oEvent.getView().byId("TablePlanMigrEdit").getSelectedItem().getBindingContextPath().split("/")[2];
				var selectedItem = oEvent.getView().byId("TablePlanMigrEdit").getSelectedItem();
				tempRemoval = oEvent.getView().byId("TablePlanMigrEdit").indexOfItem(selectedItem);
				var oModel = oEvent.getView().getModel("geminiMigr");
				var aMigrplan = oModel.getData().aMigrPlan;
				if (aMigrplan[tempRemoval].migration_object.trim() !== "" && aMigrplan[tempRemoval].load_api.trim() !== "" &&
					aMigrplan[tempRemoval].load_avail_plan.trim() !== "" && aMigrplan[tempRemoval].target_release !== "") {
					mdtVal = true;
				}
				if (xTemp[tempRemoval].getAggregation("cells")[0].getProperty("enabled") === true) {
					checkFlag = true;
				}
				if (!mdtVal) {
					
					MessageBox.error(oBundle.getText("detailsBeforeMapping"));
						
				} else
				if (!aMigrplan[tempRemoval].load_avail) {
					MessageBox.error(oBundle.getText("loadAPIMissing"));
				} else if (checkFlag) {
					tempRemoval = oEvent.getView().byId("TablePlanMigrEdit").getSelectedItem().getBindingContextPath().split("/")[2];

					if (!oEvent.MigrMap && xTemp[tempRemoval].getAggregation("cells")[1].getProperty("editable") === true) {
						oEvent.MigrMap = sap.ui.xmlfragment("s4.cfnd.geminiobjectpage.view.MigrMapToActuals", oEvent);
						oEvent.getView().addDependent(oEvent.MigrMap);
					}
					jQuery.sap.syncStyleClass("sapUiSizeCompact", oEvent.getView(), oEvent.MigrMap);
					var dataMigrVH = oEvent.oTable.getData().migrVH;
					var dataMigrActual = oEvent.oTable.getData().migr;
					// for(var row=0; row< dataMigrVH.length; row++) {
					// for(var actualItem=0; actualItem<dataMigrActual.length;
					// actualItem++) {
					// if(dataMigrActual[actualItem].ident !==
					// dataMigrVH[row].ident) {
					// dataMigrVH.splice(row,1);
					//                                                      
					// }
					// }
					// }

					dataMigrVH = dataMigrVH.filter(function(el) {
						return !dataMigrActual.some(function(f) {
							return f.ident === el.ident;
						});
					});
					oEvent.oTable.setProperty("/migrVH", dataMigrVH);
					if (sap.ui.getCore().byId("MigrObjMap") === undefined) {
						sap.ui.getCore().byId("MigrObjMap").setValueState("None");
					}
					oEvent.MigrMap.open();
					var migrHelp = oEvent.oTable.getProperty("/migrVH");
					// var currentMigrObjName =
					// sap.ui.getCore().byId("MigrObjMap").getValue();
					var currentMigrObjName = oEvent.getView().byId("TablePlanMigrEdit").getSelectedItem().getCells()[1].getValue();
					migrHelp = migrHelp.filter(function(data) {
						return (data.ident === currentMigrObjName);
					});
					if (migrHelp.length === 0 && xTemp[tempRemoval].getAggregation("cells")[0].getSelectedKey() === "New") {
						sap.ui.getCore().byId("MigrObjMap").setValueState("Error");
						sap.ui.getCore().byId("MigrObjMap").setValueStateText("Choose a valid Migration Object");
					} else {
						sap.ui.getCore().byId("MigrObjMap").setValueState("None");
					}
					var currentMigrName = xTemp[tempRemoval].getAggregation("cells")[1].getValue();
					sap.ui.getCore().byId("MigrObjMap").setValue(currentMigrName);
					if (xTemp[tempRemoval].getAggregation("cells")[0].getSelectedKey() === "Enhancement") {

						sap.ui.getCore().byId("MigrObjMap").setEditable(false);
					}
					sap.ui.getCore().byId("ActualReleaseMigr").setValue(oEvent.final);

				} else {

					
					MessageBox.error(oBundle.getText("objectAlreadyMapErrorMessage"));
						
				}

			} else if (!isSelected) {

				MessageBox.error(oBundle.getText("mapToActualserrorText"));
					
			} else if (oMigrActuals.length === 0) {

				MessageBox.error(oBundle.getText("noMigObjInActual"));
					;
			}

		},

		onValueHelpRequestMigrationObject: function(oEvent, thisObj) {

			thisObj.currRow = oEvent.getSource().getId();
			if (!thisObj.MigrObjDialog) {
				thisObj.MigrObjDialog = sap.ui.xmlfragment("s4.cfnd.geminiobjectpage.view.MigrationObjectActualValueHelp", thisObj);
				thisObj.getView().addDependent(thisObj.MigrObjDialog);
			}
			jQuery.sap.syncStyleClass("sapUiSizeCompact", thisObj.getView(), thisObj.MigrObjDialog);
			thisObj.MigrObjDialog.open();
			if (thisObj.MigrObjDialog) {
				var searchField = sap.ui.getCore().byId("MigrationObjectActualValueHelpDialog-list");
				searchField.addEventDelegate({
					onfocusin: function() {
						sap.ui.getCore().byId("MigrationObjectActualValueHelpDialog-searchField").focus();
					}
				}, this);
			}

		},
		MigrJiraChange: function(oEvent) {

            var sMigrPlanRow = oEvent.getSource().getId().split('-')[18];
            
            var oModel = this.getView().getModel("geminiMigr");
            var aModelData = oModel.getData().aMigrPlan;
            var sMigrPlanText = aModelData[sMigrPlanRow].jira_link;
            if (oEvent.getId() === "liveChange") {
                  aModelData[sMigrPlanRow].jira_valid = '2';
            } else {
                  if (sMigrPlanText.trim() !== "") {
                         s4.cfnd.geminiobjectpage.controller.Events.fnJiraCheck(sMigrPlanText,aModelData,oModel,this,"TablePlanMigrEdit","col1M19");
                  } else {
                         aModelData[sMigrPlanRow].jira_backlog_link = sMigrPlanText;
                         aModelData[sMigrPlanRow].jira_valid = '1';
                  }
            }

     }


	};
	return s4.cfnd.geminiobjectpage.controller.MigrationObjects;
});