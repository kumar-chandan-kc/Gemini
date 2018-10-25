/*global s4:true*/

jQuery.sap.declare("s4.cfnd.geminiobjectpage.controller.Events");
sap.ui
	.define(
		["sap/m/MessageBox"],
		function(MessageBox) {
			"use strict";

			s4.cfnd.geminiobjectpage.controller.Events = {
				onEventAdd: function() {

					if (this.sEventsObjectName === "") {
						var oBundle = this.getView().getModel("i18n")
							.getResourceBundle();
						var maintainValidSAPObjRep = oBundle
							.getText("maintainValidSAPObjRep");
						MessageBox.error(maintainValidSAPObjRep);
					} else {

						var oModel = this.getView().getModel("Gemini");

						var oObjectEvent = {
							new_row: true,
							Event: "",
							TaskCode: "",
							TaskText: "",
							NodeType: "",
							ActualRelease: this.final
						};
						var aOutput = oModel.getProperty("/events");
						aOutput.unshift(oObjectEvent);
						oModel.refresh(true);
						var aValueState = [0, 1, 2];
						s4.cfnd.geminiobjectpage.controller.Events
							.fnValueState(this,
								"eventsTableOnEdit",
								aValueState);

					}

				},
				deleteEventItems: function(oEvent) {
					var oBundle = this.getView().getModel("i18n")
						.getResourceBundle();
					var selectedItem = oEvent.getParameter('listItem');
					var index = this.getView()
						.byId("eventsTableOnEdit").indexOfItem(
							selectedItem);
					var oModel = this.getView().getModel("Gemini");
					var oModelPlanned = this.getView().getModel(
						"geminievents");
					var aPlannedEvents = oModelPlanned
						.getProperty("/aEvents");
					if (aPlannedEvents
						.some(function(x) {
							return x.bo_event === oModel.getData().events[index].Event && x.status === "1";
						}) && oModel.getData().events[index].Event
						.trim() !== '') {
						var eventAlreadyMappedMessage = oBundle
							.getText("eventAlreadyMappedMessage");
						MessageBox.error(eventAlreadyMappedMessage);

					} else if (oModel.getData().events[index].ActualRelease < this.final) {
						MessageBox
							.error(oBundle
								.getText(
									"deleteEventsConfirmationMessage", [oModel.getData().events[index].Event]));
					} else {
						var deleteConfirmationMessage = oBundle
							.getText("deleteConfirmationMessage");
						MessageBox
							.confirm(
								deleteConfirmationMessage, {
									actions: [
										sap.m.MessageBox.Action.YES,
										sap.m.MessageBox.Action.CANCEL
									],
									onClose: function(sAction) {
										if (sAction === "YES") {

											if (this.tmpModel3
												.some(function(
													x) {
													return x.Event === oModel
														.getData().events[index].Event;
												})) {
												this.aEventdel
													.push(oModel
														.getData().events[index]);
											}
											oModel.getData().events
												.splice(
													index,
													1);
											oModel
												.refresh(true);
										}
									}.bind(this)
								});
						var aValueState = [0, 1, 2];
						s4.cfnd.geminiobjectpage.controller.Events
							.fnValueState(this,
								"eventsTableOnEdit",
								aValueState);
					}

				},
				EventsPlanning: function(pointer) {
					var aChange = [];
					var oTemp = {};
					oTemp.value = "New";
					aChange[0] = $.extend({}, oTemp);
					oTemp.value = "Enhancement";
					aChange[1] = $.extend({}, oTemp);
					oTemp.value = "Not Relevant";
					aChange[2] = $.extend({}, oTemp);
					pointer.oViewEvents.setProperty("/aChangeType",
						aChange);

					var that = pointer;
					var sUriMgr = "/I_SBREVENTPLAN";
					var aFiltersEvent = [];
					aFiltersEvent.push(new sap.ui.model.Filter(
						"sap_bo_type",
						sap.ui.model.FilterOperator.EQ,
						pointer.sObj));

					pointer.oModel.read(sUriMgr, {
						filters: aFiltersEvent,

						success: function(oData, oResponse) {
							that.oViewEvents.setProperty("/aEvents",
								oData.results);
						}.bind(this),
						error: function() {

						}
					});
					pointer.getView().setModel(pointer.oViewEvents,
						"geminievents");

				},
				onaddPlanEvents: function() {
					var aEventValue = $.extend(true, [], this.oTable
						.getProperty("/eventIdHelp"));
					var aEventExt = $.extend(true, [], this.oTable
						.getProperty("/events"));
					var oModel = this.getView()
						.getModel("geminievents");
					var aEventsnew = oModel.getProperty("/aEvents");
					var sNextRelease = sap.ui.view.Gemini.model.getProperty("/nextRelease");
					for (var i = 0; i < aEventExt.length; i++) {
						for (var j = 0; j < aEventValue.length; j++) {
							if (aEventValue[j].event === aEventExt[i].Event) {
								aEventValue.splice(j, 1);
							}
						}
					}

					for (i = 0; i < aEventsnew.length; i++) {
						for (j = 0; j < aEventValue.length; j++) {
							if (aEventValue[j].event === aEventsnew[i].bo_event) {
								aEventValue.splice(j, 1);
							}
						}
					}

					if (this.sEventsObjectName !== "" && aEventValue.length !== 0) {

						for (i = 0; i < aEventValue.length; i++) {
							var oObjectEvent = {
								event_id: "40f2e9af-be89-2ee7-abb0-00b7d3146c56",
								sap_bo_type: this.sObj,
								bo_task: "",
								object_node_type: "",
								bo_event: aEventValue[i].event,
								changetype: "New",
								target_release: sNextRelease,
								actual_release: "",
								description: "",
								jira_backlog: "",
								jira_backlog_link: "",
								status: "0",
								status_colour: "",
								status_icon: "",
								tool_tip: "",
								jira_valid: '1'
							};
							aEventsnew.unshift(oObjectEvent);

						}
						oModel.refresh(true);

					} else {

						var oObjectEvent = {
							event_id: "40f2e9af-be89-2ee7-abb0-00b7d3146c56",
							sap_bo_type: this.sObj,
							bo_task: "",
							object_node_type: "",
							bo_event: "",
							changetype: "New",
							target_release: sNextRelease,
							actual_release: "",
							description: "",
							jira_backlog: "",
							jira_backlog_link: "",
							status: "0",
							status_colour: "",
							status_icon: "",
							tool_tip: "",
							jira_valid: '1'
						};
						aEventsnew.unshift(oObjectEvent);
						oModel.refresh(true);
					}
					var aValueState = [0, 1, 2, 3, 4, 6];
					s4.cfnd.geminiobjectpage.controller.Events
						.fnValueState(this, "TablePlanEventsEdit",
							aValueState);
					this.getView().byId("TablePlanEventsEdit")
						.removeSelections();

				},
				onEventsRelevanceChange: function(oEvent) {
					if (this.getView().byId("isevents").getSelected()) {
						MessageBox
							.confirm(
								"Do you want to enable " + this.sObj + " for Events?", {
									actions: [
										sap.m.MessageBox.Action.YES,
										sap.m.MessageBox.Action.CANCEL
									],
									onClose: function(sAction) {
										if (sAction === "YES") {
											s4.cfnd.geminiobjectpage.controller.Events
												.EventsEdit(
													this,
													true);
											s4.cfnd.geminiobjectpage.controller.Events
												.fnEventsModelHandlingOnCancel(this);

										} else {
											this
												.getView()
												.byId(
													"isevents")
												.setSelected(
													false);
										}
									}.bind(this)
								});
					} else {
						MessageBox
							.confirm(
								"Do you want to disable " + this.sObj + " for Events?", {
									actions: [
										sap.m.MessageBox.Action.YES,
										sap.m.MessageBox.Action.CANCEL
									],
									onClose: function(sAction) {
										if (sAction === "YES") {
											s4.cfnd.geminiobjectpage.controller.Events
												.EventsEdit(
													this,
													true);
											s4.cfnd.geminiobjectpage.controller.Events
												.fnEventsModelHandlingOnCancel(this);
										} else {
											this
												.getView()
												.byId(
													"isevents")
												.setSelected(
													true);
										}
									}.bind(this)
								});

					}

				},
				fnEventsModelHandlingOnEdit: function(pointer) {
					pointer.aEventPlanDel = [];
					pointer.aEventdel = [];
					pointer.tmpModel3 = $.extend(true, [],
						pointer.oTable.getProperty("/events"));
					pointer.tmpEventValueHelp = $.extend(true, [],
						pointer.oTable.getProperty("/eventIdHelp"));
					pointer.atempeventsplan = $
						.extend(true, [], pointer.oViewEvents
							.getProperty("/aEvents"));
					pointer.oModel2.setProperty("/sEventObjectNameTemp",pointer.oModel2
							.getProperty("/sEventObjectName"));
					pointer.oModel2.setProperty("/sObjectTypeTemp",pointer.sObjectType);
				},
				fnEventsModelHandlingOnCancel: function(pointer) {
					pointer.oTable.setProperty("/eventIdHelp",
						$.extend(true, [],
							pointer.tmpEventValueHelp));
					pointer.oTable.setProperty("/events", $.extend(
						true, [], pointer.tmpModel3));
					pointer.oViewEvents.setProperty("/aEvents", $
						.extend(true, [], pointer.atempeventsplan));
					pointer.oModel2.setProperty("/sEventObjectName",
							pointer.oModel2
							.getProperty("/sEventObjectNameTemp"));
					pointer.sEventsObjectName = pointer.oModel2
					.getProperty("/sEventObjectNameTemp");
					pointer.sObjectType = pointer.oModel2.getProperty("/sObjectTypeTemp");
					pointer.getView().getModel("Gemini").refresh(true);
					pointer.getView().getModel("geminievents").refresh(
						true);

				},
				EventsEdit: function(pointer, bState) {
					var bEventApplicable = pointer.getView().byId(
						"isevents").getSelected();
					var aValueState = [0, 1, 2, 3, 6];
					s4.cfnd.geminiobjectpage.controller.Events
						.fnValueState(pointer,
							"TablePlanEventsEdit", aValueState);
					aValueState = [0, 1, 2];
					s4.cfnd.geminiobjectpage.controller.Events
						.fnValueState(pointer, "eventsTableOnEdit",
							aValueState);

					pointer.getView().getModel("geminievents").refresh(
						true);

					// buttons
					pointer.getView().byId("addPlanEvents").setVisible(
						bState);
					pointer.getView().byId("deleteplanEvents")
						.setVisible(bState);
					pointer.getView().byId("BtnMapEvent").setVisible(
						bState);
					pointer.getView().byId("eventsadd").setVisible(
						bState);
					pointer.getView().byId("AddCDSKeyFields").setVisible(
							bState);
					pointer.getView().byId("addPlanEvents").setEnabled(
						bEventApplicable);
					pointer.getView().byId("deleteplanEvents")
						.setEnabled(bEventApplicable);
					pointer.getView().byId("BtnMapEvent").setEnabled(
						bEventApplicable);
					pointer.getView().byId("eventsadd").setEnabled(
						bEventApplicable);

					if (!bEventApplicable || bState === false) {

						pointer.getView().byId("addPlanEvents")
							.setTooltip("");
						pointer.getView().byId("deleteplanEvents")
							.setTooltip("");
						pointer.getView().byId("BtnMapEvent")
							.setTooltip("");
						pointer.getView().byId("eventsadd").setTooltip(
							"");

						pointer.getView()
							.byId("TablePlanEventsDisplay")
							.setVisible(true);
						pointer.getView().byId("TablePlanEventsEdit")
							.setVisible(false);

						pointer.getView().byId("TablePlanEventsEdit")
							.setMode(sap.m.ListMode.None);

						pointer.getView().byId("eventsTableOnEdit")
							.setMode(sap.m.ListMode.none);
						pointer.getView().byId("eventsTable")
							.setVisible(true);
						pointer.getView().byId("eventsTableOnEdit")
							.setVisible(false);
					} else {
						pointer
							.getView()
							.byId("TablePlanEventsEdit")
							.setMode(
								sap.m.ListMode.SingleSelectLeft);
						pointer.getView()
							.byId("TablePlanEventsDisplay")
							.setVisible(!bState);
						pointer.getView().byId("TablePlanEventsEdit")
							.setVisible(bState);

						pointer.getView().byId("eventsTableOnEdit")
							.setMode(sap.m.ListMode.Delete);
						pointer.getView().byId("eventsTable")
							.setVisible(false);
						pointer.getView().byId("eventsTableOnEdit")
							.setVisible(true);

					}
					s4.cfnd.geminiobjectpage.controller.Events
						.fnDisplayButton(pointer);
				},
				onAddCDSKeyFields: function(oEvent)
				{
					if(this.oModel2.getData().sCDSObj=== "" || this.oModel2.getData().sCDSObj === null){

						var oBundle = this.getView().getModel("i18n").getResourceBundle();
						var cdsDoesNotExist = oBundle.getText("CDSDoesNotExist");
						MessageBox.error(cdsDoesNotExist);
						sap.ui.view.Gemini.model.setProperty("/CDSKeyFields", []);
					}
					else{
						s4.cfnd.geminiobjectpage.controller.Events.fnGetCDSKeys.call(this,this.oModel2.getData().sCDSObj);
					}
				},

				fnGetCDSKeys: function(sCDSObj)
				{
					sap.ui.view.Gemini.headerModel.setProperty("/sCDSObj",sCDSObj);

					// Update key fields table in CDS Key fields
					// subsection
					var aCDSKeyFields = [];
					var aFiltersCDSKeyFields = [];
					var aSortCDSKeyFields = [];

					aFiltersCDSKeyFields.push(new sap.ui.model.Filter("CDS_Names", sap.ui.model.FilterOperator.EQ, sCDSObj));
					aSortCDSKeyFields.push(new sap.ui.model.Sorter("KeyFieldPosition" ));
					sap.ui.core.BusyIndicator.show(); 
					sap.ui.view.Gemini.mainModel.read("/I_SBRCDSKEYFIELDS", {
						filters: aFiltersCDSKeyFields,
						sorters: aSortCDSKeyFields,
						success: function(oResponse) {

							if(oResponse.results.length !== 0 ) // if
								// not
								// empty
							{
								aCDSKeyFields[0] = {
										BOKey0: "",
										BOKey1: "",
										BOKey2: "",
										BOKey3: "",
										BOKey4: "",
										BOKey5: ""
								};

								// Converting array to key value
								// pair for
								// items
								// aggregations.
								// In layman's terms, converting
								// rows to
								// columns

								oResponse.results.forEach(function(value,index){
									aCDSKeyFields[0]["BOKey"+index] = value.Fieldnames;
								});

								// setting results to the model
								sap.ui.view.Gemini.model.setProperty("/CDSKeyFields", aCDSKeyFields);
							}
							else // set as empty
							{	
								var oBundle = this.getView().getModel("i18n").getResourceBundle();
								var cdsDoesNotExist = oBundle.getText("KeysDoesNotExist");
								MessageBox.error(cdsDoesNotExist);
								sap.ui.view.Gemini.model.setProperty("/CDSKeyFields", []);
							}
							sap.ui.core.BusyIndicator.hide();
							this.getView().byId("AddCDSKeyFields").setEnabled(false);
						}.bind(this),
						error: this.fnErrorHandler
						
					});




				},


				fnDisplayButton: function(thisObj) {
					var oBundle = thisObj.getView().getModel("i18n")
						.getResourceBundle();
					thisObj.getView().byId("TablePlanEventsEdit")
						.removeSelections();
					if ((thisObj.getView().byId("TablePlanEventsEdit")
							.getSelectedItem() === null)) {
						thisObj.getView().byId("deleteplanEvents")
							.setEnabled(false);
						thisObj.getView().byId("BtnMapEvent")
							.setEnabled(false);

						thisObj
							.getView()
							.byId("deleteplanEvents")
							.setTooltip(
								oBundle
								.getText("deleteErrorMessage"));
						thisObj
							.getView()
							.byId("BtnMapEvent")
							.setTooltip(
								oBundle
								.getText("convertToActualserrorText"));

					}
				},
				onEventsTableSelect: function(oEvent) {
					var oBundle = this.getView().getModel("i18n")
						.getResourceBundle();
					var selectedItem = this.getView().byId(
						"TablePlanEventsEdit").getSelectedItem();
					var index = this.getView().byId(
						"TablePlanEventsEdit").indexOfItem(
						selectedItem);
					var oModel = this.getView()
						.getModel("geminievents");
					var aEventPlan = oModel.getData().aEvents;
					var aEventValueHelp = this.oTable
						.getProperty("/eventIdHelp");
					var isBackendEvent = aEventValueHelp
						.some(function(object) {
							return object.event === aEventPlan[index].bo_event;
						});

					if (aEventPlan[index].status.trim() === "1") {
						this.getView().byId("deleteplanEvents")
							.setEnabled(false);
						this.getView().byId("BtnMapEvent").setEnabled(
							false);
						this
							.getView()
							.byId("deleteplanEvents")
							.setTooltip(
								oBundle
								.getText("objectAlreadyMappedErrorMessage"));
						this
							.getView()
							.byId("BtnMapEvent")
							.setTooltip(
								oBundle
								.getText("objectAlreadyConvertedErrorMessage"));
					} else if ((isBackendEvent && (aEventPlan[index].changetype === "New" || aEventPlan[index].changetype === "Not Relevant"))) {
						this.getView().byId("deleteplanEvents")
							.setEnabled(false);
						this.getView().byId("BtnMapEvent").setEnabled(
							true);
						this
							.getView()
							.byId("deleteplanEvents")
							.setTooltip(
								oBundle
								.getText("cannotDeleteErrorMessage"));
					} else if (aEventPlan[index].changetype === "Not Relevant") {
						this.getView().byId("deleteplanEvents")
							.setEnabled(true);
						this.getView().byId("BtnMapEvent").setEnabled(
							false);
						this
							.getView()
							.byId("BtnMapEvent")
							.setTooltip(
								oBundle
								.getText("changeTypeNotRelevantEvent"));
						this.getView().byId("deleteplanEvents")
							.setTooltip('');
					} else {
						this.getView().byId("deleteplanEvents")
							.setEnabled(true);
						this.getView().byId("BtnMapEvent").setEnabled(
							true);
						this.getView().byId("deleteplanEvents")
							.setTooltip('');
						this.getView().byId("BtnMapEvent").setTooltip(
							'');
					}
					var event = aEventPlan[index].bo_event;
					aEventPlan = aEventPlan
						.filter(function(data) {
							return (data.bo_event === event && data.changetype === "New");
						});
					if (aEventPlan.length > 1) {
						this.getView().byId("deleteplanEvents")
							.setEnabled(true);
						this.getView().byId("deleteplanEvents")
							.setTooltip(oBundle.getText("Delete"));
					}
				},
				onMapPlanEvents: function() {
					var oBundle = this.getView().getModel("i18n")
						.getResourceBundle();
					if (this.getView().byId("TablePlanEventsEdit")
						.getSelectedItem()) {
						var oTable = this.getView().byId(
							"TablePlanEventsEdit");
						var oItem = oTable.getSelectedItem();
						var nIndex = oTable.indexOfItem(oItem);
						this.selectedEventPlanEntry = nIndex;
						var oModel = this.getView().getModel(
							"geminievents");
						var aPlannedEvents = oModel
							.getProperty("/aEvents");
						var aEventValue = $
							.extend(true, [], this.oTable
								.getProperty("/eventIdHelp"));
						var aObjectEvents = [];
						var oModelActual = this.getView().getModel(
							"Gemini");
						var aEventsactual = oModelActual
							.getProperty("/events");
						var atemp = aEventsactual
							.filter(function(x) {
								return x.Event === aPlannedEvents[nIndex].bo_event;
							});
						for (var j = 0; j < aEventValue.length; j++) {
							aObjectEvents.push(aEventValue[j].event);
						}
						if (aPlannedEvents[nIndex].changetype === "Not Relevant") {
							var changeTypeErrorMessage = oBundle
								.getText("changeTypeErrorMessage");
							MessageBox.error(changeTypeErrorMessage);

						} else if (atemp.length !== 0 && aPlannedEvents[nIndex].changetype !== "Enhancement") {
							var eventAlreadyMappingError = oBundle
								.getText("eventAlreadyMappingError");
							MessageBox.error(eventAlreadyMappingError);

						} else if (aObjectEvents
							.indexOf(aPlannedEvents[nIndex].bo_event) === -1 && aPlannedEvents[nIndex].changetype === "Enhancement") {
							var missingEventForSAPObject = oBundle
								.getText("missingEventForSAPObject");
							MessageBox.error(missingEventForSAPObject);

						} else if (aPlannedEvents[nIndex].bo_task.trim() === "" && aPlannedEvents[nIndex].changetype === "Enhancement") {
							var missingEventTaskForSAPObject = oBundle
								.getText("missingEventTaskForSAPObject");
							MessageBox.error(missingEventTaskForSAPObject);

						} else if (aPlannedEvents[nIndex].target_release === "") {
							var maintainTargetRelease = oBundle
								.getText("maintainTargetRelease");
							MessageBox.error(maintainTargetRelease);
						} else if (aPlannedEvents[nIndex].status === "1") {
							var eventAlreadyMapped = oBundle
								.getText("eventAlreadyMapped");
							MessageBox.error(eventAlreadyMapped);

						} else {

							this.oViewEvents.setProperty("/Index",
								nIndex);
							this.oViewEvents.setProperty("/EventName",
								aPlannedEvents[nIndex].bo_event);
							this.oViewEvents.setProperty("/Taskcode",
								aPlannedEvents[nIndex].bo_task);
							this.oViewEvents.setProperty("/ChangeType",
								aPlannedEvents[nIndex].changetype);

							atemp = aEventsactual
								.filter(function(x) {
									return x.TaskCode === aPlannedEvents[nIndex].bo_task;
								});

							if (!this._oDialogEventMapping) {
								this._oDialogEventMapping = sap.ui
									.xmlfragment(
										"s4.cfnd.geminiobjectpage.view.EventsMapping",
										this);
							}
							// toggle compact style
							this.getView().addDependent(
								this._oDialogEventMapping);
							jQuery.sap.syncStyleClass(
								"sapUiSizeCompact", this.getView(),
								this._oDialogEventMapping);
							this._oDialogEventMapping.open();

							var oModelEventPlan = this.getView()
								.getModel("geminievents").getData().aEvents;
							var currentEvent = oModelEventPlan[this.selectedEventPlanEntry].bo_event;
							var currentTaskCode = oModelEventPlan[this.selectedEventPlanEntry].bo_task;
							sap.ui.getCore().byId("eventsMapEventName")
								.setValue(currentEvent);
							sap.ui.getCore().byId("eventsMapEventName")
								.setValueState("None");
							sap.ui.getCore().byId("eventsMapTaskCode")
								.setValue(currentTaskCode);
							var sapObjectEventCol = this.getView()
								.byId("sapObjectEvent");
							var sapObjectEventColNum = this.getView()
								.byId("TablePlanEventsEdit")
								.indexOfColumn(sapObjectEventCol);
							var eventsPlanTableData = this.byId(
								"TablePlanEventsEdit").getItems();
							var isEventValueHelpAvailable = eventsPlanTableData[this.selectedEventPlanEntry]
								.getAggregation("cells")[sapObjectEventColNum]
								.getProperty("showValueHelp");
							if (!isEventValueHelpAvailable && currentEvent.trim() !== "") {
								sap.ui.getCore().byId(
										"eventsMapEventName")
									.setValueState("Error");
								sap.ui
									.getCore()
									.byId("eventsMapEventName")
									.setValueStateText(
										oBundle
										.getText("invalidEventNameErrorMapping"));
							} else {
								sap.ui.getCore().byId(
										"eventsMapEventName")
									.setValueState("None");

							}
							var isEventNameEditable = eventsPlanTableData[this.selectedEventPlanEntry]
								.getAggregation("cells")[sapObjectEventColNum]
								.getEditable();

							if (this.oViewEvents.getData().ChangeType === "Enhancement") {
								sap.ui.getCore().byId(
										"eventsMapEventName")
									.setEditable(false);
							} else if (this.oViewEvents.getData().ChangeType === "New") {
								sap.ui.getCore().byId(
										"eventsMapEventName")
									.setEditable(
										isEventNameEditable);

							}
							sap.ui.getCore().byId(
								"ActualReleaseEvents1").setValue(
								this.final);
							if (atemp.length !== 0) {

								sap.ui.getCore().byId(
										"eventmappingcomment")
									.setValue(atemp[0].TaskText);
								sap.ui.getCore().byId(
										"eventmappingcomment")
									.setEditable(false);

							} else {

								sap.ui.getCore().byId(
										"eventmappingcomment")
									.setValue("");
								sap.ui.getCore().byId(
										"eventmappingcomment")
									.setEditable(true);
							}
						}

					} else {
						var alreadyMappedErrorMessage = oBundle
							.getText("alreadyMappedErrorMessage");
						MessageBox.error(alreadyMappedErrorMessage);

					}

				},
				handleEventsMappingConfirm: function() {
					var sDescription = sap.ui.getCore().byId(
						"eventmappingcomment").getValue();
					var sEventName = sap.ui.getCore().byId(
						"eventsMapEventName").getValue();
					var sTaskCode = sap.ui.getCore().byId(
						"eventsMapTaskCode").getValue();
					var oBundle = this.getView().getModel("i18n")
						.getResourceBundle();
					var errorText = "";
					var isMapAllowed = true;

					if (sEventName.trim() === "") {
						errorText += "\n" + oBundle
							.getText("SAPObjectEventColName");
						isMapAllowed = false;
					}
					if (sTaskCode.trim() === "") {
						errorText += "\n" + oBundle
							.getText("SAPObjectTaskCodeColName");
						isMapAllowed = false;
					}
					if (sDescription.trim() === "") {
						errorText += "\n" + oBundle
							.getText("SAPObjectTaskTypeNameColName");
						isMapAllowed = false;
					}

					if (!isMapAllowed) {
						sap.m.MessageBox
							.error(oBundle
								.getText("operationCanceledIncompleteDataErrorMessage") + errorText);
					} else {
						var sapObjectEventCol = this.getView().byId(
							"sapObjectEvent");
						var sapObjectEventColNum = this.getView().byId(
							"TablePlanEventsEdit").indexOfColumn(
							sapObjectEventCol);
						var eventsPlanTableData = this.byId(
							"TablePlanEventsEdit").getItems();
						var oModel = this.getView().getModel(
							"geminievents");
						var eventName = sap.ui.getCore().byId(
							"eventsMapEventName").getValue();
						var eventTask = sap.ui.getCore().byId(
							"eventsMapTaskCode").getValue();
						var oModelEventPlan = oModel.getData().aEvents;
						var nIndex = this.oViewEvents
							.getProperty("/Index");
						var aEventPlan = [];
						for (var i = 0; i < oModelEventPlan.length; i++) {
							if (i !== nIndex) {
								aEventPlan.push(oModelEventPlan[i]);
							}
						}

						aEventPlan = aEventPlan
							.filter(function(data) {
								return (data.bo_event === eventName && data.changetype === "New");
							});
						var eventsPlanTableData = this.byId(
							"TablePlanEventsEdit").getItems();

						var isEventValueHelpAvailable = eventsPlanTableData[this.selectedEventPlanEntry]
							.getAggregation("cells")[sapObjectEventColNum]
							.getProperty("showValueHelp");
						if (isEventValueHelpAvailable && oModelEventPlan[this.selectedEventPlanEntry].changetype === "New") {
							sap.m.MessageBox.error(oBundle
								.getText("invalidEventNameError"));
						} else if (aEventPlan.length !== 0 && oModelEventPlan[this.selectedEventPlanEntry].changetype === "New") {
							sap.m.MessageBox
								.error(oBundle
									.getText("cannotMapEventDuplicateEvent"));

						} else {

							oModelEventPlan[this.selectedEventPlanEntry].bo_event = eventName;
							oModelEventPlan[this.selectedEventPlanEntry].bo_task = eventTask;
							this.getView().getModel("geminievents")
								.refresh(true);
							var aPlannedEvents = oModel
								.getProperty("/aEvents");
							var nIndex = this.oViewEvents
								.getProperty("/Index");
							aPlannedEvents[nIndex].status = "1";
							aPlannedEvents[nIndex].status_colour = "Green";
							aPlannedEvents[nIndex].tool_tip = "Object already Mapped";
							aPlannedEvents[nIndex].status_icon = "sap-icon://border";
							aPlannedEvents[nIndex].actual_release = sap.ui
								.getCore().byId(
									"ActualReleaseEvents1")
								.getValue();
							var oModelActual = this.getView().getModel(
								"Gemini");
							var oObjectEvent = {
								Event: aPlannedEvents[nIndex].bo_event,
								TaskCode: aPlannedEvents[nIndex].bo_task,
								TaskText: sDescription,
								NodeType: aPlannedEvents[nIndex].object_node_type,
								ActualRelease: this.final
							};
							var aEventsactual = oModelActual
								.getProperty("/events");
							if (!(aEventsactual
									.some(function(x) {
										return x.Event === aPlannedEvents[nIndex].bo_event && x.TaskCode === aPlannedEvents[nIndex].bo_task && x.Nodetype ===
											aPlannedEvents[nIndex].object_node_type;
									}))) {

								aEventsactual.push(oObjectEvent);
								oModelActual.refresh(true);
							}

							oModel.refresh(true);
							sap.m.MessageToast.show("Object Mapped");
							s4.cfnd.geminiobjectpage.controller.Events
								.fnDisplayButton(this);
						}
					}

				},

				fnIsEventCompatible: function() {
					var sCurrentRelease = sap.ui.view.Gemini.model
						.getProperty("/currentRelease");
					var aEventsactual = sap.ui.view.Gemini.model
						.getProperty("/events");
					var bIsEventCompatible = aEventsactual
						.some(function(object) {
							return object.ActualRelease < sCurrentRelease;
						});
					return bIsEventCompatible;
				},
				fnEventApplicableEditable: function(bState) {
					if (sap.ui.view.Gemini.model === undefined || !bState) {
						return false;
					} else {
						var bIsEventCompatible = s4.cfnd.geminiobjectpage.controller.Events
							.fnIsEventCompatible();
						var aEventsactual = sap.ui.view.Gemini.model
							.getProperty("/events");
						if (!bIsEventCompatible && aEventsactual.length === 0)
							return true;
						else
							return false;
					}
				},
				fnSOBJEditable: function(bState, bIsEventApplicable) {

					if (sap.ui.view.Gemini.model === undefined || !bState) {
						return true;
					} else {
						var bIsEventCompatible = s4.cfnd.geminiobjectpage.controller.Events
							.fnIsEventCompatible();
						var sEventObjectName = sap.ui.view.Gemini.headerModel
						.getProperty("/sEventObjectName");
						if (!bIsEventCompatible && bIsEventApplicable && sEventObjectName === "")
							return false;
						else
							return true;
					}

				},
				fnSOBJInputEditable: function(bState,
					bIsEventApplicable) {
					if (sap.ui.view.Gemini.model === undefined || !bState) {
						return false;
					} else {
						var bIsEventCompatible = s4.cfnd.geminiobjectpage.controller.Events
							.fnIsEventCompatible();
						var sEventObjectName = sap.ui.view.Gemini.headerModel
						.getProperty("/sEventObjectName");
						if (!bIsEventCompatible && bIsEventApplicable &&  sEventObjectName === "")
							return true;
						else
							return false;
					}

				},

				EventPlanChange: function(oEvent) {
					var sEventPlanRow = oEvent.getSource().getId()
						.split('-')[10];
					var sEventPlanText = oEvent.getParameters().selectedItem
						.getKey();
					var aEventPlanData = this.getView().getModel(
						"geminievents").getData().aEvents;
					if (sEventPlanText === "Enhancement") {
						aEventPlanData[sEventPlanRow].bo_event = "";
					}
					this.getView().getModel("geminievents").refresh(
						true);
					var oTable = this.getView().byId(
						"TablePlanEventsEdit");
					if (oTable.indexOfItem(oTable.getSelectedItem()) !== -1) {
						oTable.setSelectedItem(
							oTable.getItems()[oTable
								.indexOfItem(oTable
									.getSelectedItem())],
							true, true);
					}

				},
				fnValueState: function(pointer, sTable, aRow) {
					var aTableItems = pointer.getView().byId(sTable)
						.getItems();

					for (var nTableRow = 0; nTableRow < aTableItems.length; nTableRow++) {
						for (var nTableColumn = 0; nTableColumn < aRow.length; nTableColumn++) {
							aTableItems[nTableRow]
								.getAggregation("cells")[aRow[nTableColumn]]
								.setValueState("None");
						}
					}

				},
				EventJiraChange: function(oEvent) {
					var sEventPlanRow = oEvent.getSource().getId()
						.split('-')[18];
					var aModelData = this.getView().getModel(
						"geminievents").getData().aEvents;
					var oModel = this.getView()
						.getModel("geminievents");
					var sEventJiraId = aModelData[sEventPlanRow].jira_backlog;
					if (oEvent.getId() === "liveChange") {
						aModelData[sEventPlanRow].jira_valid = '2';
					} else {
						if (sEventJiraId.trim() !== "") {
							s4.cfnd.geminiobjectpage.controller.Events
								.fnJiraCheck(sEventJiraId,
									aModelData, oModel, this,
									"TablePlanEventsEdit",
									"jiraeventcolumn");

						} else {
							aModelData[sEventPlanRow].jira_backlog_link = sEventJiraId;
							aModelData[sEventPlanRow].jira_valid = '1';
						}
					}
				},

				fnEventEditable: function(status, sChangeType, sEvent) {
					var aEventValueHelp = this.oTable
						.getProperty("/eventIdHelp");
					var isBackendEvent = aEventValueHelp.some(function(
						object) {
						return object.event === sEvent;
					});

					if (status === '1' || sChangeType === 'Not Relevant') {
						return false;
					} else if ((sChangeType === 'New' || sChangeType === "Not Relevant") && isBackendEvent) {
						return false;
					} else {
						return true;
					}
				},
//				fnEnableAddKeys: function(CDSObject){
//					if (sap.ui.view.Gemini.headerModelInitial === undefined ) {
//						return false;				
//					}
//					else {
//						if(sap.ui.view.Gemini.headerModelInitial.sCDSObj !== CDSObject){
//							return true;
//						}
//						else{
//							return false;
//						}
//					}
//					
//				},
				EventsMessage: function(pointer, sMsg) {

					sap.m.MessageBox.error(sMsg);
				},
				onDeletePlanEvents: function(oEvent) {
					var oSelectedItem = this.getView().byId(
						"TablePlanEventsEdit").getSelectedItem();
					var index = this.getView().byId(
						"TablePlanEventsEdit").indexOfItem(
						oSelectedItem);
					var oModel = this.getView()
						.getModel("geminievents");
					var oBundle = this.getView().getModel("i18n")
						.getResourceBundle();
					var aPlannedEvents = oModel.getData().aEvents;
					var aEventValueHelp = this.oTable
						.getProperty("/eventIdHelp");
					var event = aPlannedEvents[index].bo_event;
					var aEventPlan = aPlannedEvents
						.filter(function(data) {
							return (data.bo_event === event && data.changetype === "New");
						});
					var isBackendEvent = aEventValueHelp
						.some(function(object) {
							return object.event === aPlannedEvents[index].bo_event;
						});
					if (oSelectedItem === null) {
						var deleteEventErrorMessage = oBundle
							.getText("deleteEventErrorMessage");
						MessageBox.error(deleteEventErrorMessage);

					} else if (aPlannedEvents[index].status === "1") {

						var statusDeleteErrorMessage = oBundle
							.getText("statusDeleteErrorMessage");
						MessageBox.error(statusDeleteErrorMessage);

					} else if ((isBackendEvent && (aPlannedEvents[index].changetype === "New" || aPlannedEvents[index].changetype === "Not Relevant")) &&
						aEventPlan.length === 1) {

						var cannotDeleteErrorMessage = oBundle
							.getText("cannotDeleteErrorMessage");
						MessageBox.error(cannotDeleteErrorMessage);

					} else {
						var deleteConfirmationrMessage = oBundle
							.getText("deleteConfirmationMessage");
						MessageBox
							.confirm(

								deleteConfirmationrMessage, {
									actions: [
										sap.m.MessageBox.Action.YES,
										sap.m.MessageBox.Action.CANCEL
									],
									onClose: function(sAction) {
										if (sAction === "YES") {

											for (var i = 0; i < this.atempeventsplan.length; i++) {
												if (aPlannedEvents[index].event_id === this.atempeventsplan[i].event_id) {
													this.aEventPlanDel
														.push(oModel
															.getData().aEvents[index]);
													break;
												}
											}

											oModel.getData().aEvents
												.splice(
													index,
													1);
											oModel
												.refresh(true);
											s4.cfnd.geminiobjectpage.controller.Events
												.fnDisplayButton(this);
										}
									}.bind(this)
								});
						var aValueState = [0, 1, 2, 3, 4, 6];
						s4.cfnd.geminiobjectpage.controller.Events
							.fnValueState(this,
								"TablePlanEventsEdit",
								aValueState);

					}
				},

				onSaveEvents: function(pointer) {
					// events Planning

					var aEventUpdate = [];
					var aEventCreate = [];
					var aEventactual = pointer.getView().getModel(
						"geminievents").getData().aEvents;

					for (var i = 0; i < aEventactual.length; i++) {

						var atemp = pointer.atempeventsplan
							.filter(function(x) {
								return x.event_id === aEventactual[i].event_id;
							});

						if (atemp.length === 0) {
							aEventCreate.push(aEventactual[i]);
						} else if (JSON.stringify(atemp[0]) !== JSON
							.stringify(aEventactual[i])) {

							aEventUpdate.push(aEventactual[i]);
						}

					}

					$
						.each(
							aEventCreate,
							function(iIndex, oItem) {
								pointer.oModel
									.create(
										"/I_SBREVENTPLAN",
										aEventCreate[iIndex], {
											groupId: pointer.sDeferredGroup,
											success: function(
													oResponse) {

													aEventCreate[iIndex].event_id = oResponse.event_id;

												}
												.bind(pointer),
											error: function() {
												// console.log("Error");
											}

										});
							});
					for (i = 0; i < aEventUpdate.length; i++) {
						pointer.oModel.update("/I_SBREVENTPLAN(guid'" + aEventUpdate[i].event_id + "')",
							aEventUpdate[i], {
								groupId: pointer.sDeferredGroup,
								success: function() {

									// console.log("Success");

								},
								error: function() {
									// console.log("Error");
								}
							});
					}

					for (i = 0; i < pointer.aEventPlanDel.length; i++) {
						pointer.oModel.remove("/I_SBREVENTPLAN(guid'" + pointer.aEventPlanDel[i].event_id + "')", {
							groupId: pointer.sDeferredGroup,
							success: function() {

								// console.log("Success");

							},
							error: function() {
								// console.log("Error");
							}
						});
					}
					pointer.getView().getModel("geminievents").refresh(
						true);
				},

				fnJiraCheck: function(sJiraId, aModelData, oModel,
					objectController, sTableName, sColumnName) {
					var aJiraParameters = {
						JiraBacklogId: sJiraId
					};
					// sap.ui.view.Gemini.mainModel = this.oModel;
					sap.ui.view.Gemini.mainModel
						.callFunction(
							"/JiraValidation", {
								Method: "GET",
								urlParameters: aJiraParameters,
								success: function(oResponse) {
									var jiraIndex = null;
									if (aModelData[0].jira_backlog !== undefined) {
										var aResult = aModelData
											.filter(function(
												oObject,
												index) {
												if (oObject.jira_backlog === sJiraId && oObject.jira_valid === '2' && jiraIndex === null) {
													jiraIndex = index;
												}
												return oObject.jira_backlog === sJiraId && oObject.jira_valid === '2';
											});

									} else {
										var aResult = aModelData
											.filter(function(
												oObject,
												index) {
												if (oObject.jira_link === sJiraId && oObject.jira_valid === '2' && jiraIndex === null) {
													jiraIndex = index;
												}
												return oObject.jira_link === sJiraId && oObject.jira_valid === '2';
											});
									}
									if (aResult[0] !== undefined) {
										if (oResponse.Response) {

											aResult[0].jira_backlog_link = oResponse.JiraLink;
											aResult[0].jira_valid = '1';

										} else {
											aResult[0].jira_valid = '0';
											var oBundle = objectController
												.getView()
												.getModel(
													"i18n")
												.getResourceBundle();
											var column = objectController
												.getView()
												.byId(
													sColumnName);
											var columnNumber = objectController
												.getView()
												.byId(
													sTableName)
												.indexOfColumn(
													column);
											objectController
												.getView()
												.byId(
													sTableName)
												.getItems()[jiraIndex]
												.getCells()[columnNumber]
												.setValueState("Error");
											objectController
												.getView()
												.byId(
													sTableName)
												.getItems()[jiraIndex]
												.getCells()[columnNumber]
												.setValueStateText(oBundle
													.getText("validjira"));
										}
									}

									// oModel.refresh(true);

								}.bind(this),
								error: function() {

									sap.m.MessageBox
										.error("Error in validating Jira");
								}

							});

				}

			};
			return s4.cfnd.geminiobjectpage.controller.Events;

		});