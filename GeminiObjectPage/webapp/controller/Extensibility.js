/*global s4:true*/

jQuery.sap.declare("s4.cfnd.geminiobjectpage.controller.Extensibility");
sap.ui.define(["sap/m/MessageBox", "sap/ui/model/resource/ResourceModel"], function(MessageBox, ResourceModel) {
       "use strict";

       s4.cfnd.geminiobjectpage.controller.Extensibility = {

                     // Function to check Jira Backlog ID

                     ExtChangeHeaderSelection: function(oEvent) {

                           var state = oEvent.getParameter("selected");
                           var that = this;

                           if (state) {

                                  MessageBox.confirm(
                                                "Do you want to enable Extensibility for " + that.sObj + "?", {
                                                       actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
                                                       onClose: function(sAction) {
                                                              if (sAction === "YES") {
                                                                     that.getView().byId("TablePlanExt").setVisible(true);
                                                                     // this.getView().byId("TablePlanExt").setMode(sap.m.ListMode.SingleSelectLeft);
                                                                     that.getView().byId("TablePlanExt2").setVisible(false);
                                                                     that.getView().byId("BtnMapExt").setVisible(true);
                                                                     that.getView().byId("addPlanExt").setVisible(true);
                                                                     that.getView().byId("BtnDelExtPlan").setVisible(true);
                                                              } else {
                                                                     that.getView().byId("isext").setSelected(false);
                                                              }
                                                       }
                                                });

                           } else {

                                  MessageBox.confirm(
                                                "Do you want to disable Extensibility for " + that.sObj + "?", {
                                                       actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
                                                       onClose: function(sAction) {
                                                              if (sAction === "YES") {
                                                                     that.getView().byId("TablePlanExt").setVisible(false);
                                                                     that.getView().byId("TablePlanExt2").setVisible(true);
                                                                     // that.getView().byId("BtnMapExt").setVisible(false);
                                                                     // that.getView().byId("addPlanExt").setVisible(false);
                                                                     // that.getView().byId("BtnDelExtPlan").setVisible(false);
                                                                     that.oTable.setProperty("/extplan", $.extend(true, [], that.tmpModelExtPlan));

                                                              } else {
                                                                     that.getView().byId("isext").setSelected(true);
                                                              }
                                                       }
                                                });
                           }

                     },

                     // Function to check Jira Backlog ID
                     ExtJiraChange: function(oEvent) {
                         
                         var ExtPlanRow = oEvent.getParameter("id").split("TablePlanExt-").pop();
                
                         var aModelData = this.getView().getModel("Gemini").getData().extplan;
                         var oModel = this.getView().getModel("Gemini");
                         var ExtPlanRowText = aModelData[ExtPlanRow].jira_backlog;
                         if (oEvent.getId() === "liveChange") {
                           aModelData[ExtPlanRow].jira_valid = '2';
                         } else {

                                if (ExtPlanRowText === "") {

                                aModelData[ExtPlanRow].jira_valid = '1';

                                } else {
                                s4.cfnd.geminiobjectpage.controller.Events.fnJiraCheck(ExtPlanRowText,aModelData,oModel,this,"TablePlanExt","jiraExt");
                                      

                                }

                         }

                   },


                     // Function to add a new row on click of add
                     // button
                     onaddPlanExtensibility: function() {
                           var oModel = this.getView().getModel("Gemini");
                           this.uniqueEntryExtPlanID++;
                           var oObject = {

                                         ext_id: this.uniqueEntryExtPlanID.toString(),
                                         sap_bo_type: this.sObj,
                                         area: this.sArea,
                                         business_context: "",
                                         ext_type: "Field",
                                         target_release: "",
                                         description: "",
                                         status: "",
                                         change_type: "New",
                                         mapped_business_context: "",
                                         actual_release: "",
                                         status_colour: "",
                                         status_icon: "",
                                         tool_tip: "",
                                         jira_backlog: "",
                                         jira_backlog_link: "",
                                         jira_valid: '1'
                           };
                           var aExtPlan = oModel.getProperty("/extplan");
                           aExtPlan.unshift(oObject);

                           // To reset value state for
                           // Target Release
                           var actualRelease = this.getView().byId("actualReleaseExt");
                           var actualReleaseInputCol = this.getView().byId("TablePlanExt").indexOfColumn(actualRelease);
                           this.handleValueState(["TablePlanExt"], [
                                  [actualReleaseInputCol]
                                  ]);

                           oModel.refresh(true);
                           this.getView().byId("TablePlanExt").removeSelections();

                     },

                     // Function to delete Planned Extensibility
                     // Items
                     deleteExtPlanItems: function(oEvent) {

                           var oBundle = this.getView().getModel("i18n").getResourceBundle();
                           var selectedItem = this.getView().byId("TablePlanExt").getSelectedItem();
                           var itemIndex = this.byId("TablePlanExt").indexOfItem(selectedItem);
                           var oTableExtPlan = this.byId("TablePlanExt");
                            var oTableExtPlanItems = oTableExtPlan.getItems();

                           var actualRelease = this.getView().byId("actualReleaseExt");
                           var actualReleaseCol = this.getView().byId("TablePlanExt").indexOfColumn(actualRelease);

                           if (selectedItem === null) {

                                  var deleteErrorMessage = oBundle.getText("deleteErrorMessage");

                                  MessageBox.error(deleteErrorMessage);

                           } else if (oTableExtPlanItems[itemIndex].getCells()[actualReleaseCol].getText() !== "") {

                                  var deleteAlreadyMappedErrorMessage = oBundle.getText("deleteAlreadyMappedErrorMessage");

                                  MessageBox.error(deleteAlreadyMappedErrorMessage);

                           } else {

                                  var deleteConfirmationMessage = oBundle.getText("deleteConfirmationMessage");

                                  MessageBox.confirm(
                                                deleteConfirmationMessage, {
                                                       actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
                                                       onClose: function(sAction) {
                                                              if (sAction === "YES") {

                                                                     var index = itemIndex;
                                                                     var oModel = this.getView().getModel("Gemini");
                                                                     if ((parseInt(index, 10) + (this.adelCountExtplan)) <= ((this.tmpModelExtPlan.length) - 1)) {

                                                                           if (this.adelCountExtplan < (this.tmpModelExtPlan.length - 1)) {
                                                                                  this.adelCountExtplan++;
                                                                           }
                                                                     }
                                                                     var x = 0;
                                                                     for (var rowNo = 0; rowNo < this.tmpModelExtPlan.length; rowNo++) {
                                                                           if (oModel.getData().extplan[index].ext_id === this.tmpModelExtPlan[rowNo].ext_id) {
                                                                                  x = 1;
                                                                                  break;
                                                                           }
                                                                     }
                                                                     if (x === 1) {
                                                                            this.aExtPlanDel.push(oModel.getData().extplan[index]);
                                                                     }

                                                                     oModel.getData().extplan.splice(index, 1);
                                                                     this.oTable.setProperty("/extplan", oModel.getData().extplan);
                                                                     oModel.refresh(true);
                                                                     s4.cfnd.geminiobjectpage.controller.Extensibility.fnDisplayButton(this);

                                                              }

                                                       }.bind(this)
                                                }
                                  );

                           }

                           // To reset value state for
                           // Target Release
                           var actualRelease = this.getView().byId("actualReleaseExt");
                           var actualReleaseInputCol = this.getView().byId("TablePlanExt").indexOfColumn(actualRelease);
                           this.handleValueState(["TablePlanExt"], [
                                  [actualReleaseInputCol]
                                  ]);
                     },

                     // Function Called on Click of Map to Actuals in
                     // Extensibility
                     onBtnMapExt: function(oEvent) {
                           var checkFlag = false;
                           var manVat = false; // Flag to

                           var xTemp = this.byId("TablePlanExt").getItems();
                           var isSelected = this.getView().byId("TablePlanExt").getSelectedItem();
                           var tempRemoval = -1;
                           var mode = "";
                           var bCompact = null;

                           var i18nModel = new ResourceModel({
                                  bundleName: "s4.cfnd.geminiobjectpage.i18n.i18n"
                           });

                           this.getView().setModel(i18nModel, "i18n");

                           var oBundle = this.getView().getModel("i18n").getResourceBundle();

                           if (isSelected) {
                                  if (this.businessContextArray.length === 0) {

                                         var noBusinessContextPresentinActualsText = oBundle.getText("noBusinessContextPresentinActualsText");
                                         MessageBox.error(noBusinessContextPresentinActualsText);

                                  } else {
                                         // check change
                                         var selectedItem = this.getView().byId("TablePlanExt").getSelectedItem();
                                         tempRemoval = this.getView().byId("TablePlanExt").indexOfItem(selectedItem);
                                       var oModel = this.getView().getModel("Gemini");
                                         var aExtPlan = oModel.getData().extplan;
                                         if (aExtPlan[tempRemoval].change_type.trim() !== "" && aExtPlan[tempRemoval].ext_type.trim() !== "" && aExtPlan[tempRemoval].target_release !==
                                         "") {
                                                manVat = true;
                                                /*
                                                * If
                                                * change
                                                * type
                                                * is
                                                * enhacement
                                                * and
                                                * business
                                                * context
                                                * in
                                                * not
                                                * maintained
                                                */
                                                if (aExtPlan[tempRemoval].change_type.trim() === "Enhancement" && aExtPlan[tempRemoval].business_context.trim() === "") {
                                                       manVat = false;
                                                }
                                         }
                                         if (!manVat) {

                                                var mapToActualserrorTextMantValuesMissing = oBundle.getText("mapToActualserrorTextMantValuesMissing");
                                                MessageBox.error(mapToActualserrorTextMantValuesMissing);
                                         }
                                         if (xTemp[tempRemoval].getAggregation("cells")[0].getProperty("editable") === true) {
                                                checkFlag = true;
                                         } else {

                                                var mapToActualserrorText = oBundle.getText("mapToActualserrorText");
                                                MessageBox.error(mapToActualserrorText);
                                         }
                                         if (checkFlag && manVat) {

                                                if (xTemp[tempRemoval].getAggregation("cells")[0].getProperty("editable") === true) {
                                                       if (xTemp[tempRemoval].getAggregation("cells")[0].getValue() === "New") {
                                                              mode = "New";
                                                       } else {
                                                              mode = "Enhancement";
                                                       }
                                                       if (this.ExtMap === null) {
                                                              this.ExtMap = sap.ui.xmlfragment("s4.cfnd.geminiobjectpage.view.ExtMapToActuals", this);
                                                              this.getView().addDependent(this.ExtMap);
                                                       }
                                                }
                                                jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this.ExtMap);
                                                this.ExtMap.open();

                                                if (mode === "New") {
                                                       sap.ui.getCore().byId("ActualReleaseExt").setValue(this.final);
                                                       sap.ui.getCore().byId("ExtMapBC").setEditable(true);

                                                } else {

                                                sap.ui.getCore().byId("ExtMapBC").setValue(xTemp[tempRemoval].getAggregation("cells")[1].getValue()); // Setting
                                                       // Default
                                                       // Value
                                                       // as
                                                       // Business
                                                       // Context
                                                       sap.ui.getCore().byId("ExtMapBC").setEditable(false);
                                                       sap.ui.getCore().byId("ActualReleaseExt").setValue(this.final);
                                                }
                                         }

                                  }
                           } else {

                                  var mapToActualsNotSelectedErrorText = oBundle.getText("mapToActualsNotSelectedErrorText");
                                  MessageBox.error(mapToActualsNotSelectedErrorText);
                           }

                     },
                     // Function to change change fiels on basis of
                     // "New" or "Enhancement"
                     HandlechangeTypeExtCombo: function(oEvent) {
                           var ExtPlanRowText = oEvent.getParameter("id");
                           var ExtPlanRow = ExtPlanRowText.split("TablePlanExt-").pop();

                           var ExtPlanText = oEvent.getParameter("value");

                           var oModel = this.getView().getModel("Gemini");
                           var ExtPlan = oModel.getProperty("/extplan");
                           var ExtTableItems = this.byId("TablePlanExt").getItems();

                          
                           var BC = this.getView().byId("businessContextInput");
                           var businessContextInputCol = this.getView().byId("TablePlanExt").indexOfColumn(BC);
                            ExtTableItems[ExtPlanRow].getAggregation("cells")[businessContextInputCol].setValue("");
                     ExtTableItems[ExtPlanRow].getAggregation("cells")[businessContextInputCol].setValueState("None");

                     },

                     // Function to open Value Help for Mapping
                     onValueHelpRequestExtObjectMapExt: function(oEvent) {
                           // this.ipIdAPI =
                                  // oEvent.getSource().getId();
                           if (!this._BCMapDialog) {
                                  this._BCMapDialog = sap.ui.xmlfragment("s4.cfnd.geminiobjectpage.view.BusinessContextValueHelpMap", this);
                                  this.getView().addDependent(this._BCMapDialog);
                           }
                           jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._BCMapDialog);
                           this._BCMapDialog.open();
                           if (this._BCMapDialog) {
                                  var searchField = sap.ui.getCore().byId("BusinessContextDialogExtPlanned-list");
                                  searchField.addEventDelegate({
                                         onfocusin: function() {
                                                sap.ui.getCore().byId("BusinessContextDialogExtPlanned-searchField").focus();
                                         }
                                  }, this);
                            }

                     },

                     // Function for value help of business context
                     // field
                     onValueHelpRequestExtObject: function(oEvent) {
                           this.planExtId = oEvent.getSource();
                           var oBundle = this.getView().getModel("i18n").getResourceBundle();

                           if (this.businessContextArray.length > 0) {
                                  this.ipBusinessContext = oEvent.getSource().getId();
                                  if (!this._BCDialog) {
                                         this._BCDialog = sap.ui.xmlfragment("s4.cfnd.geminiobjectpage.view.BusinessContextValueHelp", this);
                                         this.getView().addDependent(this._BCDialog);
                                  }
                                  jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._BCDialog);
                                  this._BCDialog.open();
                                  if (this._BCDialog) {
                                         var searchField = sap.ui.getCore().byId("BusinessContextDialogExtPlanned2-list");
                                         searchField.addEventDelegate({
                                                onfocusin: function() {
                                                       sap.ui.getCore().byId("BusinessContextDialogExtPlanned2-searchField").focus();
                                                }
                                         }, this);
                                  }

                           } else {

                                  var noBusinessContextPresentinActualsText = oBundle.getText("noBusinessContextPresentinActualsText");
                                  MessageBox.error(noBusinessContextPresentinActualsText);
                           }
                     },

                     // Function for CRUD of Extensibility
                     handleExtCRUD: function(othis) {

                           /*
                           * Begin Create for Extension
                           * Planning
                           */
                           var k;
                           var oModel = othis.getView().getModel("Gemini");
                           sap.ui.namespace("sap.ui.view.model");
                           sap.ui.view.model.oModel = othis.getView().getModel("Gemini");
                           var aExtPlanItems = othis.oTable.getProperty("/extplan");
                           var aExtPlanCreate = [];
                           var aExtPlanUpdate = [];
                           var x4 = othis.byId("TablePlanExt").getItems();

                           for (var i = 0; i < aExtPlanItems.length; i++) {

                                  var atemp = othis.tmpModelExtPlan.filter(function(oObject) {
                                         return oObject.ext_id === aExtPlanItems[i].ext_id;
                                  });

                                  if (atemp.length === 0) {
                                         aExtPlanCreate.push(aExtPlanItems[i]);
                                  } else if (JSON.stringify(atemp[0]) !== JSON.stringify(aExtPlanItems[i])) {

                                         aExtPlanUpdate.push(aExtPlanItems[i]);
                                  }

                           }
                           // Normal Update Begins

                           for (k = 0; k < aExtPlanUpdate.length; k++) {
                                  // if(aExtPlanUpdate[k].ext_id.toString().length
                                  // < 10)
                                  // {
                                  // aExtPlanUpdate[k].ext_id
                                  // =
                                  // "11000000-0000-0000-0000-000000000000";
                                  // }
                                  othis.oModel.update("/I_SBREXTPLAN(guid'" + aExtPlanUpdate[k].ext_id + "')", aExtPlanUpdate[k], {
                                         groupId: othis.sDeferredGroup,
                                         success: function() {

                                                // console.log("Success");

                                         },
                                         error: function() {
                                                // console.log("Error");
                                         }
                                  });
                           }

                           /* End update for extension */

                           var that = othis;
                           $.each(aExtPlanCreate, function(iIndex, oItem) {

                                  aExtPlanCreate[iIndex].ext_id = "11000000-0000-0000-0000-000000000000";
                                  othis.oModel.create("/I_SBREXTPLAN", aExtPlanCreate[iIndex], {
                                         groupId: othis.sDeferredGroup,
                                         success: function(oResponse) {
                                                aExtPlanCreate[iIndex].ext_id = oResponse.ext_id;
                                         },
                                         error: function() {}
                                  });

                           });

                           var x4 = that.byId("TablePlanExt").getItems();
                           var jiraext = othis.getView().byId("jiraExt");
                           var jiraextCol = othis.getView().byId("TablePlanExt").indexOfColumn(jiraext);
                           for (var i = 0; i < x4.length; i++) {

                                  x4[i].getAggregation("cells")[jiraextCol].setVisible(true); // For
                                  // Jira
                                  // Link
                           }

                           // Delete for Extension Planning

                           for (var i = 0; i < othis.aExtPlanDel.length; i++) {

                                  othis.oModel.remove("/I_SBREXTPLAN(guid'" + othis.aExtPlanDel[i].ext_id + "')", {
                                         groupId: othis.sDeferredGroup,
                                         success: function() {

                                         },
                                         error: function() {

                                         }
                                  });
                           }

                           // othis.setTooltipForMap(); //
                           // For Tooltip

                           // Setting JIRA Link

                           var extItems = othis.byId("TablePlanExt").getItems();
                           var oModel = othis.getView().getModel("Gemini");

                           var jiraext = othis.getView().byId("jiraExt");
                           var jiraextCol = othis.getView().byId("TablePlanExt").indexOfColumn(jiraext);
                           for (var i = 0; i < extItems.length; i++) {

                                  if (extItems[i].getAggregation("cells")[jiraextCol].getValue() !== "") // If
                                         // Jira
                                         // Backlog
                                         // is
                                         // maintained
                                  {
                                         oModel.getData().extplan[i].jira_backlog_link = "ht" + "tps://" + "sapjira.wdf.sap.corp/browse/".concat(extItems[i].getAggregation(
                                         "cells")[jiraextCol].getValue());
                                  }

                           }

                           oModel.refresh(true);

                           /* Update for Mapping */

                           if (othis.aExtPlanMap.length) {

                                  for (var i = 0; i < othis.aExtPlanMap.length; i++) {
                                         if (othis.aExtPlanMap[i].ext_id.length < 25) {
                                                othis.aExtPlanMap[i].ext_id = "40f2e9af-be89-2ee7-abb0-00b7d3146c57";
                                         }
                                         othis.oModel.update("/I_SBREXTPLAN(guid'" + othis.aExtPlanMap[i].ext_id + "')", othis.aExtPlanMap[i], {
                                                groupId: othis.sDeferredGroup,
                                                success: function() {

                                                },
                                                error: function() {

                                                }
                                         });
                                  }
                           }

                           /* End Create for Extension */

                     },
                     onExtTableSelect: function(oEvent) {
                           var oBundle = this.getView().getModel("i18n").getResourceBundle();
                           var selectedItem = this.getView().byId("TablePlanExt").getSelectedItem();
                           var index = this.getView().byId("TablePlanExt").indexOfItem(selectedItem);
                           var oModel = this.getView().getModel("Gemini");
                           var aExtPlan = oModel.getData().extplan;
                           if (aExtPlan[index].actual_release.trim() !== "") {
                                  this.getView().byId("BtnDelExtPlan").setEnabled(false);
                                  this.getView().byId("BtnMapExt").setEnabled(false);

                           this.getView().byId("BtnDelExtPlan").setTooltip(oBundle.getText("objectAlreadyMappedErrorMessage"));
                               this.getView().byId("BtnMapExt").setTooltip(oBundle.getText("objectAlreadyMapErrorMessage"));
                           } else {
                                  this.getView().byId("BtnDelExtPlan").setEnabled(true);

                                  this.getView().byId("BtnDelExtPlan").setTooltip('');

                                  if (this.businessContextArray.length > 0) {
                                         this.getView().byId("BtnMapExt").setEnabled(true);
                                         this.getView().byId("BtnMapExt").setTooltip('');
                                  }
                           }

                     },
                     fnDisplayButton: function(thisObj) {
                           thisObj.getView().byId("TablePlanExt").removeSelections();
                           var oBundle = thisObj.getView().getModel("i18n").getResourceBundle();
                           if ((thisObj.getView().byId("TablePlanExt").getSelectedItem() === null)) {
                                  thisObj.getView().byId("BtnDelExtPlan").setEnabled(false);
                                  thisObj.getView().byId("BtnMapExt").setEnabled(false);

                                  thisObj.getView().byId("BtnDelExtPlan").setTooltip(oBundle.getText("deleteErrorMessage"));
                           thisObj.getView().byId("BtnMapExt").setTooltip(oBundle.getText("mapToActualsNotSelectedErrorText"));

                           }
                     },

                     createSuccess: function(oResponse) {

                           for (var i = 0; i < sap.ui.view.model.oModel.getData().extplan.length; i++) {

                                  if (oResponse.sap_bo_type === sap.ui.view.model.oModel.getData().extplan[i].sap_bo_type &&
                                                oResponse.business_context === sap.ui.view.model.oModel.getData().extplan[i].business_context &&
                                                oResponse.area === sap.ui.view.model.oModel.getData().extplan[i].area &&
                                                oResponse.ext_type === sap.ui.view.model.oModel.getData().extplan[i].ext_type &&
                                                oResponse.target_release === sap.ui.view.model.oModel.getData().extplan[i].target_release &&
                                                oResponse.description === sap.ui.view.model.oModel.getData().extplan[i].description &&
                                                oResponse.status === sap.ui.view.model.oModel.getData().extplan[i].status &&
                                                oResponse.change_type === sap.ui.view.model.oModel.getData().extplan[i].change_type &&
                                                oResponse.jira_backlog === sap.ui.view.model.oModel.getData().extplan[i].jira_backlog
                                  ) {
                                         sap.ui.view.model.oModel.getData().extplan[i].ext_id = oResponse.ext_id;
                                         sap.ui.view.model.oModel.getData().extplan[i].jira_backlog_link = oResponse.jira_backlog_link;
                                         sap.ui.view.model.oModel.refresh(true);

                                  }
                           }

                     },
                     toggleExtensionEditButtons: function(oEvent) {
                           var isExtFlagSet = this.getView().byId("isext").getSelected();
                           this.getView().byId("addPlanExt").setVisible(isExtFlagSet);
                           this.getView().byId("BtnMapExt").setVisible(isExtFlagSet);
                           this.getView().byId("BtnDelExtPlan").setVisible(isExtFlagSet);

                     }

       };
       return s4.cfnd.geminiobjectpage.controller.Extensibility;

});