/*global s4:true*/

jQuery.sap.declare("s4.cfnd.geminiobjectpage.controller.TransportRequest");
sap.ui
	.define(
		["sap/m/MessageBox", "sap/ui/model/resource/ResourceModel"],
		function(MessageBox, ResourceModel) {
			"use strict";

			s4.cfnd.geminiobjectpage.controller.TransportRequest = {

				/*
				 * Function which initiates TR handling for each
				 * NodeType and events as a whole (If any modification
				 * is made)
				 */
				handleTransportRequest: function() {

					this.aTRObjects = [];
					this.iTRObjectIndex = 0;
					this.aDiscardedObjects = [];


					for (var iIndex = 0; iIndex < this.aUpdateNodeType.length; iIndex++) {

						var oTRObjects = {
							sObjectName: this.aUpdateNodeType[iIndex].object_node_type,
							sObj: "BR02"
						};

						s4.cfnd.geminiobjectpage.controller.TransportRequest.checkLockedObject
							.call(this, oTRObjects);

					}
					this.oModel
						.submitChanges({

							groupId: this.sDeferredGroup,
							success: jQuery
								.proxy(
									s4.cfnd.geminiobjectpage.controller.TransportRequest.fnTRObjectsSort,
									this),
							error: this.fnErrorHandler
						});

				},
				
				fnTRObjectsSort: function()
				{
					this.aTRObjects.sort(function(oObject){ return (oObject.IsObjectLocked===true ? 1 : -1) ;  });
					s4.cfnd.geminiobjectpage.controller.TransportRequest.handleTRpopup.call(this);
				},
				

				handleTRpopup: function() {

					if (this.iTRObjectIndex < this.aTRObjects.length) {
						// for objects locked in any TR
						if (this.aTRObjects[this.iTRObjectIndex].IsObjectLocked) {

							if (!this.aTRObjects[this.iTRObjectIndex].IsTaskOpen) {
								s4.cfnd.geminiobjectpage.controller.TransportRequest.onOpenTaskCreateDialog
									.call(this);
							} else {

								if (this.aTRObjects[this.iTRObjectIndex].IsLockRequiredInNewTask) {
									s4.cfnd.geminiobjectpage.controller.TransportRequest.fnTRObjectLock
										.call(
											this,
											this.aTRObjects[this.iTRObjectIndex].sObj,
											this.aTRObjects[this.iTRObjectIndex].sObjectName,
											this.aTRObjects[this.iTRObjectIndex].TRNumber);
								}
								this.iTRObjectIndex++;
								s4.cfnd.geminiobjectpage.controller.TransportRequest.handleTRpopup
									.call(this);

							}
						}
						// if object is not locked in any TR
						else if ((!this.aTRObjects[this.iTRObjectIndex].IsObjectLocked)) {
							s4.cfnd.geminiobjectpage.controller.TransportRequest.onOpenTRSelectDialog
								.call(this);
						}
					} else if(this.aTRObjects.length !== 0) {
						this.fnSaveEntriesWithTR();
						this.handleSave();
						
						//If any changes have been discarded show the discard message
                        if (this.aDiscardedObjects.length > 0) {
                               
                               var oBundle = this.getView().getModel("i18n").getResourceBundle();
                               var sDiscardInfoMsg = oBundle.getText("ChangeDiscarded") + " ";

                               for(var i =0;i< this.aDiscardedObjects.length; i++)
                               {
                                      sDiscardInfoMsg = sDiscardInfoMsg + this.aDiscardedObjects[i] +", "; 
                               }
                               
                               // To remove last ,
                               sDiscardInfoMsg = sDiscardInfoMsg.slice(0, -2);
                               // Show info popup
                               sap.m.MessageBox.information(sDiscardInfoMsg);

                        }
					}

				},

				/*
				 * Function to check whether the passed object is
				 * already locked under a TR.*/

				checkLockedObject: function(oTRObjects) {

					sap.ui.view.Gemini.mainModel
						.callFunction(
							"/TRCheckLockedObject", {
								Method: "GET",
								urlParameters: oTRObjects,
								groupId: this.sDeferredGroup,
								success: function(oResponse) {
									this.aTRObjects
										.push(oResponse);

								}.bind(this),
								error: function() {

									sap.m.MessageBox
										.error("Error in locking the objects in TR");
								}

							});

				},

				// To set the properties of locked object in model
				fnTRSetProperties: function() {
					this.oTable
						.setProperty(
							"/TRTaskDialogNumber",
							this.aTRObjects[this.iTRObjectIndex].TRNumber);
					this.oTable
						.setProperty(
							"/TRTaskDialogDesc",
							this.aTRObjects[this.iTRObjectIndex].TRDescription);
					this.oTable
						.setProperty(
							"/TRTaskDialogOwner",
							this.aTRObjects[this.iTRObjectIndex].TROwner);
					this.oTable
						.setProperty(
							"/TRObjectName",
							this.aTRObjects[this.iTRObjectIndex].sObjectName);
					this.getView().getModel("Gemini").refresh(true);
				},

				// Opening New task create dialog ( asking the user to create a task or not)
				onOpenTaskCreateDialog: function() {
					s4.cfnd.geminiobjectpage.controller.TransportRequest.fnTRSetProperties
						.call(this);
					this.oTRTaskCreateDialog = sap.ui
						.xmlfragment(
							"s4.cfnd.geminiobjectpage.view.TransportRequestFragments.NewTaskCreationConfirmation",
							this);
					this.getView().addDependent(
						this.oTRTaskCreateDialog);
					jQuery.sap.syncStyleClass("sapUiSizeCompact", this
						.getView(), this.oTRTaskCreateDialog);
					this.oTRTaskCreateDialog.open();
				},
				//Dialog shows list of all the open TR's for a user
				onOpenTRSelectDialog: function() {

					s4.cfnd.geminiobjectpage.controller.TransportRequest.fnTRSetProperties
						.call(this);

					this.oTRSelectDialog = sap.ui
						.xmlfragment(
							"s4.cfnd.geminiobjectpage.view.TransportRequestFragments.TransportRequest",
							this);
					this.getView().addDependent(this.oTRSelectDialog);
					jQuery.sap.syncStyleClass("sapUiSizeCompact", this
						.getView(), this.oTRSelectDialog);
					this.oTRSelectDialog.open();

				},
				onOpenTRConfirm: function() {

					// If TR is open and Task is Released popup for Task
					// Creation

					var oBundle = this.getView().getModel("i18n").getResourceBundle();
					var sTaskCreationText = oBundle.getText("NewTaskConfirmMsgAlreadyReleased");					

					if (this.oTable.getProperty("/TRSelectedNumber") === "" || this.oTable.getProperty("/TRSelectedNumber") === undefined) {
						MessageBox.error(oBundle.getText("SelectValidRequest"));
					} else // Change
					{
						
						var aTransport = this.oTable.getProperty("/aTRANSPORT");
						var sTRNumber = this.oTable.getProperty("/TRSelectedNumber");
						var oSelectedTransport = aTransport.filter(function(oObject){return oObject.TRNumber === sTRNumber;});
						
						if(oSelectedTransport[0].IsTaskOpen !== true)
							{
							sap.m.MessageBox.confirm(
									sTaskCreationText, {
										actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
										onClose: function(sAction) {
											if (sAction === "YES") {

												s4.cfnd.geminiobjectpage.controller.TransportRequest.fnCreateNewTaskAndLock.call(this);

											}
										}.bind(this)
									});
							}
						else {
							s4.cfnd.geminiobjectpage.controller.TransportRequest.fnCreateNewTaskAndLock.call(this);
						}

						
					} 
				},

				fnCreateNewTaskAndLock: function() {

					s4.cfnd.geminiobjectpage.controller.TransportRequest.fnTRObjectLock
						.call(
							this,
							this.aTRObjects[this.iTRObjectIndex].sObj,
							this.aTRObjects[this.iTRObjectIndex].sObjectName,
							this.oTable.getProperty(
								"/TRSelectedNumber"));
					this.iTRObjectIndex++;
					this.oTRSelectDialog.destroy();
					s4.cfnd.geminiobjectpage.controller.TransportRequest.handleTRpopup
						.call(this);

				},

				onOpenTRCancel: function() {
					s4.cfnd.geminiobjectpage.controller.TransportRequest.onTRDiscardChanges
						.call(this);
					this.iTRObjectIndex++;
					this.oTRSelectDialog.destroy();
					s4.cfnd.geminiobjectpage.controller.TransportRequest.handleTRpopup
						.call(this);
				},

				onTRListOpenDialog: function() {

					var sUri = "/TRANSPORT";
					this.oModel.read(sUri, {
						success: function(oResponse) {

							this.oTable.setProperty("/aTRANSPORT", oResponse.results);
							this.oTRListDialog.open();
						}.bind(this),
						error: function() {

						}
					});
					this.oTRListDialog = sap.ui
						.xmlfragment(
							"s4.cfnd.geminiobjectpage.view.TransportRequestFragments.TransportPopUp",
							this);
					this.getView().addDependent(this.oTRListDialog);
					jQuery.sap.syncStyleClass("sapUiSizeCompact", this
						.getView(), this.oTRListDialog);

				},
				onOpenTRSelectConfirm: function(oEvent) {

					var oSelectedItem = oEvent.getParameter("selectedItem");
					var sSelectedTRNumber = oSelectedItem.getTitle();
					this.oTable.setProperty("/TRSelectedNumber",
						sSelectedTRNumber);
					this.getView().getModel("Gemini").refresh(true);

				},
				onOpenTRSelectCancel: function() {

				},
				onTRDiscardChanges: function() {
					var oBundle = this.getView().getModel("i18n").getResourceBundle();
					if (this.aTRObjects[this.iTRObjectIndex].sObj === "GEVT") {
						
						this.aDiscardedObjects.push(oBundle
                                .getText("EventsFacet"));
						this.oModel2.setProperty("/sCDSObj",this.oModel2.getProperty("/sCDSObjTemp"));
						this.oTable.setProperty("/CDSKeyFields", $.extend(true, [], this.oTable.getProperty("/CDSKeyFieldsTemp"))); 
						this.oViewEvents.setProperty("/aEvents", $
								.extend(true, [], this.atempeventsplan));
						this.aEventPlanDel=[];
						this.aEvents = [];
						this.aEventdel = [];
						this.oTable.setProperty("/events", $.extend(
							true, [], this.tmpModel3));
						this.oTable.setProperty("/cds",
							this.tmpModelCDS);
					} 
					else if (this.aTRObjects[this.iTRObjectIndex].sObj === "BR01") {
						
						this.aDiscardedObjects.push(oBundle
                                .getText("SAPObjectRepresentation"));	
						this.oModel2.setProperty("/sEventObjectName",
								this.oModel2
								.getProperty("/sEventObjectNameTemp"));
						this.sEventsObjectName = this.oModel2
						.getProperty("/sEventObjectNameTemp");
						this.sObjectType = this.oModel2.getProperty("/sObjectTypeTemp");
					}
					else {
						this.aDiscardedObjects
                        .push(this.aTRObjects[this.iTRObjectIndex].sObjectName);
						var sObjectName = this.aTRObjects[this.iTRObjectIndex].sObjectName;
						var iNodeTypeDicardingIndex = this.aUpdateNodeType
							.findIndex(function(oObject) {
								return oObject.object_node_type === sObjectName;
							});
						this.aUpdateNodeType.splice(
							iNodeTypeDicardingIndex, 1);
						var aNodeType = this.oTable
							.getProperty("/nodetype");
						var aNodeTypeTemp = $.extend(true, [],
							this.oTable
							.getProperty("/NodeTypeTemp"));
						var iNodeTypeDicardingIndex = aNodeType
							.findIndex(function(oObject) {
								return oObject.object_node_type === sObjectName;
							});
						aNodeType[iNodeTypeDicardingIndex] = aNodeTypeTemp[iNodeTypeDicardingIndex];

					}
				},
				
				
                // When user click confirm for new task creation popup then call object lock function and recursive call for the next locking object
				onNewTaskCreateConfirm: function() {
					s4.cfnd.geminiobjectpage.controller.TransportRequest.fnTRObjectLock
						.call(
							this,
							this.aTRObjects[this.iTRObjectIndex].sObj,
							this.aTRObjects[this.iTRObjectIndex].sObjectName,
							this.aTRObjects[this.iTRObjectIndex].TRNumber);
					this.iTRObjectIndex++;
					this.oTRTaskCreateDialog.destroy();
					s4.cfnd.geminiobjectpage.controller.TransportRequest.handleTRpopup
						.call(this);
				},
				
				// Search Implementation for TR popup
				onOpenTRSelectSearch: function(oDialog) {
					var sQuery = oDialog.getSource()._sSearchFieldValue;

					var aFilter = new sap.ui.model.Filter({
						filters: [
							new sap.ui.model.Filter("TRNumber", sap.ui.model.FilterOperator.Contains, sQuery)
						],
						and: false
					});
					oDialog.getSource().getBinding("items").filter([aFilter]);

				},
				
				// When user clicks on Cancel in New Task Confirmation Dialog
				onNewTaskCreateCancel: function() {
					s4.cfnd.geminiobjectpage.controller.TransportRequest.onTRDiscardChanges
						.call(this);
					this.iTRObjectIndex++;
					this.oTRTaskCreateDialog.destroy();
					s4.cfnd.geminiobjectpage.controller.TransportRequest.handleTRpopup
						.call(this);

				},
				
				// Function to lock an object in given TR by calling Transport Create Entity Set
				fnTRObjectLock: function(sObj, sObjectName, sTRNumber) {
					// var i ;
					var aTransportRequest = {};
					aTransportRequest.sObj = sObj;
					aTransportRequest.sObjectName = sObjectName;
					aTransportRequest.TRNumber = sTRNumber;
					this.oModel.create("/TRANSPORT", aTransportRequest, {
						groupId: this.sDeferredGroup,
						success: function(oResponse) {

						}.bind(this),
						error: function() {

						}

					});

				}

			};
			return s4.cfnd.geminiobjectpage.controller.TransportRequest;

		});