/*global s4:true*/
jQuery.sap.declare("s4.cfnd.geminiobjectpage.controller.OutputObjects");
sap.ui.define(["sap/m/MessageBox", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"], function(MessageBox, Filter, FilterOperator) {
	"use strict";

	s4.cfnd.geminiobjectpage.controller.OutputObjects =
  
		{
			handleOutputPlanEditCancel: function(mode, pointer) {
				if (mode) {
					pointer.aOutPlanDel = [];
					pointer.aOutPlanConverts = [];
					pointer.getView().byId("TablePlanOutEdit").setVisible(true);
					pointer.getView().byId("TablePlanOutDisplay").setVisible(false);
					pointer.preValue1 = [];
					pointer.preValue2 = [];
					var oModel = pointer.getView().getModel("Gemini");
					oModel.refresh(true);
				} else {
					pointer.getView().byId("TablePlanOutEdit").setVisible(false);
					pointer.getView().byId("TablePlanOutDisplay").setVisible(true);
					pointer.oViewOut.setProperty("/aOutObjs", $.extend(true, [], pointer.aTempOutPutPlan));
				}

				pointer.getView().byId("addPlanOut").setVisible(mode);
				pointer.getView().byId("deletePlanOut").setVisible(mode);
				pointer.getView().byId("convertPlanOut").setVisible(mode);
				pointer.getView().byId("TablePlanOutEdit").removeSelections();

				// var tableOutPlan = pointer.byId("TablePlanOutEdit").getItems();
				// var oModel = pointer.getView().getModel("geminioutput");
				// tableOutPlan.forEach(function callback(currentValue, row, arrayRow) {
				// 	if (oModel.getData().aOutObjs[row].mapped_output_object === "") {
				// 		var currentRow = currentValue.getAggregation("cells");
				// 		delete currentRow[4];
				// 		delete currentRow[7];
				// 		if (currentRow[0].getSelectedKey() === "Enhancement") {
				// 			currentRow[1].setEditable(false);
				// 			currentRow[2].setEditable(mode);
				// 			currentRow[2].setShowValueHelp(true);
				// 			currentRow[2].setShowSuggestion(true);
				// 			delete currentRow[1];
				// 			delete currentRow[2];

				// 		}
				// 		currentRow.forEach(function callbackRow(currentValue1, column, arrayCol) {
				// 			currentValue1.setEditable(mode);
				// 		});
				// 	}
				// });

			},
			handleOutputPlanSave: function(pointer) {
				if (typeof pointer.aTempOutPutPlan !== "undefined") {
					var aOutputPlanItems = pointer.oViewOut.getProperty("/aOutObjs");
					$.each(aOutputPlanItems, function(iIndex, oItem) {
						if (oItem.omid !== "000") {
							for (var tempIndex = 0; tempIndex < pointer.aTempOutPutPlan.length; tempIndex++) {
								if (pointer.aTempOutPutPlan[tempIndex].omid === aOutputPlanItems[iIndex].omid) {
									if (JSON.stringify(pointer.aTempOutPutPlan[tempIndex]) !== JSON.stringify(aOutputPlanItems[iIndex])) {
										var tempUpdate = $.extend(true, {}, aOutputPlanItems[iIndex]);
										tempUpdate.changeType = (tempUpdate.changeType === "New") ? "0" :
											"1";
										pointer.oModel.update("/I_SBROMPLAN(guid'" + tempUpdate.omid + "')", tempUpdate, {
											groupId: pointer.sDeferredGroup,
											success: function() {

											},
											error: function() {

											}
										});
									}
								}
							}

						}
						if (oItem.omid === "000") {
							oItem.omid = "40f2e9af-be89-2ee7-abb0-00b7d3146c56";

							aOutputPlanItems[iIndex].changeType = (aOutputPlanItems[iIndex].changeType === "New") ? "0" :
								"1";
							pointer.oModel.create("/I_SBROMPLAN", aOutputPlanItems[iIndex], {
								groupId: pointer.sDeferredGroup,
								success: function(oResponse) {
									aOutputPlanItems[iIndex].changeType = (aOutputPlanItems[iIndex].changeType === "0") ? "New" : "Enhancement";
									aOutputPlanItems[iIndex].omid = oResponse.omid;
								},
								error: function() {
									// console.log("Error");
								}
							});
						}
					});

					for (var i = 0; i < pointer.aOutPlanDel.length; i++) {
						pointer.oModel.remove("/I_SBROMPLAN(guid'" + pointer.aOutPlanDel[i].omid + "')", {
							groupId: pointer.sDeferredGroup,
							success: function() {

							},
							error: function() {

							}
						});
					}
					// var tableOutPlan = pointer.byId("TablePlanOutEdit").getItems();
					// tableOutPlan.forEach(function callback(currentValue, row, arrayRow) {
					// 	var currentRow = currentValue.getAggregation("cells");
					// 	delete currentRow[7];
					// 	delete currentRow[4];
					// 	currentRow.forEach(function callbackRow(currentValue1, column, arrayCol) {
					// 		currentValue1.setEditable(false);
					// 	});
					// });
				}
			},
			onaddPlanOut: function() {
				var oModel = this.getView().getModel("geminioutput");
				var oOutObject = {
					sap_bo_type: this.sObj,
					area: this.sArea,
					application_object: "",
					output_type: "",
					target_release: "",
					actual_release: "",
					description: "",
					status: "",
					mapped_output_object: "",
					mapped_application_object: "",
					changeType: "New",
					status_colour: "",
					status_icon: "",
					tool_tip: "",
					omid: "000",
					jira_backlog: "",
					jira_backlog_link: "",
					jira_valid: '1'
				};
				var aOutPlanNew = oModel.getProperty("/aOutObjs");
				aOutPlanNew.unshift(oOutObject);

				// To handle value state
				var actualreleaseoutputactual = this.getView().byId("actualReleaseOutputPlanned");
				var actualreleaseoutputactualCol = this.getView().byId("TablePlanOutEdit").indexOfColumn(actualreleaseoutputactual);
				this.handleValueState(["TablePlanOutEdit"], [
					[actualreleaseoutputactualCol]
				]);

				oModel.refresh(true);
				this.getView().byId("TablePlanOutEdit").removeSelections();

				/*Output Object Planning Table toggling to editable */

				// var tableOutPlan = this.byId("TablePlanOutEdit").getItems();
				// var currentRow = tableOutPlan[tableOutPlan.length - 1].getAggregation("cells");
				// delete currentRow[4];
				// delete currentRow[7];
				// currentRow.forEach(function callbackRow(currentValue1, column, arrayCol) {
				// 	currentValue1.setEditable(true);
				// });

			},
			onOutputPlanChangeTypeSelected: function(oControlEvent) {
				var tableIndex = this.getView().byId("TablePlanOutEdit").indexOfItem(oControlEvent.getSource().getParent());
				// if (oControlEvent.getParameter("value") === "Enhancement") {
				// 	// this.getView().byId("TablePlanOutEdit").getItems()[tableIndex].getAggregation("cells")[1].setEditable(false);
				// 	// this.getView().byId("TablePlanOutEdit").getItems()[tableIndex].getAggregation("cells")[2].setShowSuggestion(true);
				// 	// this.getView().byId("TablePlanOutEdit").getItems()[tableIndex].getAggregation("cells")[2].setShowValueHelp(true);
				// 	this.getView().byId("OutputEditText").setText("Output Object*");
				// } else {
				// 	// this.getView().byId("TablePlanOutEdit").getItems()[tableIndex].getAggregation("cells")[1].setEditable(true);
				// 	// this.getView().byId("TablePlanOutEdit").getItems()[tableIndex].getAggregation("cells")[2].setShowSuggestion(false);
				// 	// this.getView().byId("TablePlanOutEdit").getItems()[tableIndex].getAggregation("cells")[2].setShowValueHelp(false);
				// 	this.getView().byId("OutputEditText").setText("Output Object");
				// 	this.getView().byId("TablePlanOutEdit").getItems()[tableIndex].getAggregation("cells")[0].setValueState("None");
				// 	this.getView().byId("TablePlanOutEdit").getItems()[tableIndex].getAggregation("cells")[1].setValueState("None");
				// 	this.getView().byId("TablePlanOutEdit").getItems()[tableIndex].getAggregation("cells")[2].setValueState("None");
				// }
				this.getView().byId("TablePlanOutEdit").getItems()[tableIndex].getCells()[1].setValue("");
				this.getView().byId("TablePlanOutEdit").getItems()[tableIndex].getCells()[2].setValue("");
				this.getView().byId("TablePlanOutEdit").getItems()[tableIndex].getCells()[1].setValueState("None");
				this.getView().byId("TablePlanOutEdit").getItems()[tableIndex].getCells()[2].setValueState("None");

			},
			onConvertPlanOut: function(oControlEvent) {
				var selectedItem = this.getView().byId("TablePlanOutEdit").getSelectedItem();
				var oBundle = this.getView().getModel("i18n").getResourceBundle();
				if (selectedItem === null) {
					
					sap.m.MessageBox.error(oBundle.getText("alreadyMappedOutput"));
						
				
				} else {
					var index = this.getView().byId("TablePlanOutEdit").indexOfItem(selectedItem);
					var oModel = this.getView().getModel("geminioutput");
					if (oModel.getData().aOutObjs[index].mapped_output_object !== "") {
						sap.m.MessageBox.error(oBundle.getText("alreadyMappedOutput"));
							
					} else {
						var row = this.getView().byId("TablePlanOutEdit").getItems()[index].getAggregation("cells");
						if (row[0].getValue() === "New") {
							if (row[3].getValue() === "" || row[2].getValue() === "" || row[1].getValue() === "") {
								var errorText = "";
								if (row[3].getValue().trim() === "") {
									errorText += "\nTarget Release ";
								}
								if (row[2].getValue().trim() === "") {
									errorText += "\nOutput Object ";
								}
								if (row[1].getValue().trim() === "") {
									errorText += "\nApplication Object Type ";
								}
								sap.m.MessageBox.error(
									"Operation canceled due to invalid entry for the following fields: " + errorText
								);
							} else {
								if (!this.outputMap) {
									this.outputMap = sap.ui.xmlfragment("s4.cfnd.geminiobjectpage.ValueHelpFragments.OutputConvertToActuals", this);
									this.getView().addDependent(this.outputMap);
								}
								jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this.outputMap);
								this.outputMap.open();
								sap.ui.getCore().byId("outObjPlan").setValue("");
								sap.ui.getCore().byId("outObjPlan").setEditable(true);
								sap.ui.getCore().byId("OutPlanApplicationObject").setValue("");
								sap.ui.getCore().byId("OutPlanApplicationObject").setVisible(false);
								sap.ui.getCore().byId("releaseActualOut").setValue(this.final);
								sap.ui.getCore().byId("OutPlanApplicationObjectLabel").setVisible(false);
								sap.ui.getCore().byId("outObjPlanLabel").setText("Select an Output Object :");
							}

						} else {
							if (row[2].getValue() === "" || row[3].getValue() === "") {
								if (row[3].getValue().trim() === "") {
									errorText += "\nTarget Release ";
								}
								if (row[2].getValue().trim() === "") {
									errorText += "\nOutput Object ";
								}
								sap.m.MessageBox.error(
									"Operation canceled due to invalid entry for the following fields: " + errorText
								);
							} else {
								if (!this.outputMap) {
									this.outputMap = sap.ui.xmlfragment("s4.cfnd.geminiobjectpage.ValueHelpFragments.OutputConvertToActuals", this);
								}
								jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this.outputMap);
								this.outputMap.open();
								sap.ui.getCore().byId("outObjPlan").setValue(this.getView().byId("TablePlanOutEdit").getItems()[index].getAggregation("cells")[2]
									.getValue());
								sap.ui.getCore().byId("outObjPlan").setEditable(false);
								sap.ui.getCore().byId("releaseActualOut").setValue(this.final);
								sap.ui.getCore().byId("OutPlanApplicationObject").setValue(this.getView().byId("TablePlanOutEdit").getItems()[index].getAggregation(
									"cells")[1].getValue());
								sap.ui.getCore().byId("outObjPlanLabel").setText("Output Object :");
							}
						}
					}
				}
			},
			handleOutputConvertClose: function() {
				sap.ui.getCore().byId("outObjPlan").setValue("");
				sap.ui.getCore().byId("releaseActualOut").setValue("");
				sap.ui.getCore().byId("OutPlanApplicationObject").setValue("");
			},
			handleOutputConvertConfirm: function() {
				var selectedItem = this.getView().byId("TablePlanOutEdit").getSelectedItem();
				var index = this.getView().byId("TablePlanOutEdit").indexOfItem(selectedItem);
				var oModel = this.getView().getModel("geminioutput");
				var oBundle = this.getView().getModel("i18n").getResourceBundle();

				if (sap.ui.getCore().byId("outObjPlan").getValue() !== "" && sap.ui.getCore().byId("releaseActualOut").getValue() !== "") {
					oModel.getData().aOutObjs[index].mapped_output_object = sap.ui.getCore().byId("outObjPlan").getValue();
					oModel.getData().aOutObjs[index].mapped_application_object = sap.ui.getCore().byId("OutPlanApplicationObject").getValue();
					oModel.getData().aOutObjs[index].actual_release = sap.ui.getCore().byId("releaseActualOut").getValue();
					oModel.getData().aOutObjs[index].status_colour = "Green";
					oModel.getData().aOutObjs[index].tool_tip = "Object already mapped";
					oModel.getData().aOutObjs[index].status_icon = "sap-icon://border";
					this.aOutPlanConverts.push(oModel.getData().aOutObjs[index]);
					oModel.refresh(true);

					var oModelActuals = this.getView().getModel("Gemini");

					var oObject = {
						value1: sap.ui.getCore().byId("OutPlanApplicationObject").getValue(),
						value: sap.ui.getCore().byId("outObjPlan").getValue()
					};
					var aOutput = oModelActuals.getProperty("/output");
					if (!(aOutput.some(function(output) {
							return output.value === oObject.value && output.value1 === oObject.value1;
						}))) {
						aOutput.unshift(oObject);
						oModelActuals.refresh(true);
						// Line to be deleted
						// this.getView().byId("idTable2").getItems()[this.getView().byId("idTable2").getItems().length - 1].getAggregation("cells")[1].setEditable(
						// 	false);
					}

					sap.m.MessageToast.show("Object Mapped");
					s4.cfnd.geminiobjectpage.controller.OutputObjects.fnDisplayButton(this);

				} else {
					
					sap.m.MessageBox.error(oBundle.getText("operationCancel"));
						
				}
				sap.ui.getCore().byId("outObjPlan").setValue("");
				sap.ui.getCore().byId("releaseActualOut").setValue("");
				sap.ui.getCore().byId("OutPlanApplicationObject").setValue("");
			},
			onOutTableSelect: function(oEvent)
			{
				var selectedItem = this.getView().byId("TablePlanOutEdit").getSelectedItem();
				var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var index = this.getView().byId("TablePlanOutEdit").indexOfItem(selectedItem);
			var oModel = this.getView().getModel("geminioutput");
				var aOutPut= oModel.getData().aOutObjs;
			if (aOutPut[index].mapped_output_object !== "") {
				this.getView().byId("deletePlanOut").setEnabled(false);
				this.getView().byId("convertPlanOut").setEnabled(false);
				this.getView().byId("deletePlanOut").setTooltip(oBundle.getText("objectAlreadyMappedErrorMessage"));
				this.getView().byId("convertPlanOut").setTooltip(oBundle.getText("objectAlreadyConvertedErrorMessage"));
			} else {
				this.getView().byId("deletePlanOut").setEnabled(true);
				this.getView().byId("convertPlanOut").setEnabled(true);
				this.getView().byId("deletePlanOut").setTooltip('');
				this.getView().byId("convertPlanOut").setTooltip('');

			}
			},
			fnDisplayButton: function(thisObj) {
			thisObj.getView().byId("TablePlanOutEdit").removeSelections();
			var oBundle = thisObj.getView().getModel("i18n").getResourceBundle();
			if ((thisObj.getView().byId("TablePlanOutEdit").getSelectedItem() === null)) {
				thisObj.getView().byId("deletePlanOut").setEnabled(false);
				thisObj.getView().byId("convertPlanOut").setEnabled(false);

				thisObj.getView().byId("deletePlanOut").setTooltip(oBundle.getText("deleteErrorMessage"));
				thisObj.getView().byId("convertPlanOut").setTooltip(oBundle.getText("convertToActualserrorText"));

			}
		},

			ondeletePlanOut: function(oEvent) {

				var selectedItem = this.getView().byId("TablePlanOutEdit").getSelectedItem();
				var oBundle = this.getView().getModel("i18n").getResourceBundle();

				if (selectedItem === null) {
					
					sap.m.MessageBox.error(oBundle.getText("deleteAlreadyMappedErrorMessage"));
					
										} 
				else {
					var index = this.getView().byId("TablePlanOutEdit").indexOfItem(selectedItem);
					var oModel = this.getView().getModel("geminioutput");
					if (oModel.getData().aOutObjs[index].mapped_output_object !== "") {
						sap.m.MessageBox.error(oBundle.getText("deleteAlreadyMappedErrorMessage"));
						
					} else {
						var deleteConfirmationMessage = oBundle.getText("deleteConfirmationMessage");
						MessageBox.confirm(
								deleteConfirmationMessage , {
								actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
								//	styleClass: bCompact ? "sapUiSizeCompact" : "",
								onClose: function(sAction) {
									if (sAction === "YES") {

										// Logic for deletion
										if (oModel.getData().aOutObjs[index].omid !== "000") {
											this.aOutPlanDel.push(oModel.getData().aOutObjs[index]);
										}

										oModel.getData().aOutObjs.splice(index, 1);
										this.oViewOut.setProperty("/aOutObjs", oModel.getData().aOutObjs);

										// To handle value state
										var actualreleaseoutputactual = this.getView().byId("actualReleaseOutputPlanned");
										var actualreleaseoutputactualCol = this.getView().byId("TablePlanOutEdit").indexOfColumn(actualreleaseoutputactual);
										this.handleValueState(["TablePlanOutEdit"], [
											[actualreleaseoutputactualCol]
										]);

										oModel.refresh(true);
										s4.cfnd.geminiobjectpage.controller.OutputObjects.fnDisplayButton(this);
									}
								}.bind(this)
							}
						);

					}
				}

			},
			outputObjectsPlanning: function(pointer) {

				pointer.oViewOut = new sap.ui.model.json.JSONModel({
					aOutObjs: [],
					aChangeType: []
				});
				var aChange = [];
				var tempx = {};
				tempx.value = "New";
				aChange[0] = $.extend({}, tempx);
				tempx.value = "Enhancement";
				aChange[1] = $.extend({}, tempx);
				pointer.oViewOut.setProperty("/aChangeType", aChange);

				var sUriOutPlan = "/I_SBROMPLAN";
				var aFiltersOut = [];
				aFiltersOut.push(new sap.ui.model.Filter("sap_bo_type", sap.ui.model.FilterOperator.EQ, pointer.sObj));

				pointer.oModel.read(sUriOutPlan, {
					filters: aFiltersOut,

					success: function(oData, oResponse) {
						for (var index = 0; index < oData.results.length; index++) {
							if (oData.results[index].mapped_output_object !== "") {
								oData.results[index].tool_tip = "Object Already Mapped";
								oData.results[index].status_colour = "Green";
								oData.results[index].status_icon = "sap-icon://border";
							}
						}
						pointer.oViewOut.setProperty("/aOutObjs", oData.results);

					}.bind(pointer),
					error: function() {}
				});
				pointer.getView().setModel(pointer.oViewOut, "geminioutput");
			},

			JiraChange: function(oEvent) {

                var OutTextRow = oEvent.getParameter("id");
                var sOutObjRow = OutTextRow.split("TablePlanOutEdit-").pop();
                var aModelData = this.getView().getModel("geminioutput").getData().aOutObjs;
                var sOutObjText = aModelData[sOutObjRow].jira_backlog;
                var oModel = this.getView().getModel("geminioutput");
                if (oEvent.getId() === "liveChange") {
                       aModelData[sOutObjRow].jira_valid = '2';
                } else {
                       if (sOutObjText.trim() !== "") {
                              s4.cfnd.geminiobjectpage.controller.Events.fnJiraCheck(sOutObjText,aModelData,oModel,this,"TablePlanOutEdit","jiraOutputPlanned");
                       } else {
                              aModelData[sOutObjRow].jira_backlog_link = sOutObjText;
                              aModelData[sOutObjRow].jira_valid = '1';
                       }
                }

          
}

		};
	return s4.cfnd.geminiobjectpage.controller.OutputObjects;

});