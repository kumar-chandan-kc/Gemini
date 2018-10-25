sap.ui.define([
	
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/Press",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"s4/cfnd/geminiobjectpage/test/integration/pages/Common",
	"s4/cfnd/geminiobjectpage/test/integration/pages/shareOptions",
	"sap/ui/test/matchers/I18NText"
], function(Opa5, Press, PropertyStrictEquals, Common, shareOptions, I18NText) {
	"use strict";

	var sViewName = "Object";

	Opa5.createPageObjects({
		onTheOutputPage: {
			baseClass: Common,

			actions: jQuery.extend({


				// Select Enhancement from the drop down
				iShouldSelectAnItemFromTheDropDown: function(sTableId) {
					return this.waitFor({
						id: sTableId,
						viewName: sViewName,
						success: function(oTable) {
							return this.waitFor({
								id: oTable.getItems()[0].getAggregation("cells")[0].getId(),
								controlType: "sap.m.ComboBox",
								success: function(oSelect) {
									var oItems = oSelect.getItems();
									oSelect.setSelectedKey(oItems[1].getKey());
									//oSelect.fireChange();
									//oItems[1].$().trigger("tap");
									Opa5.assert.ok(true, " Value 'Enhancement' is selected from drop down");
								},
								errorMessage: "Unable to select value from drop down"
							});
						},

						errorMessage: "Entry not selected from drop down"
					});
				},

				iShouldSelectValueFromF4Help: function(sDialog, objPos) {
					return this.waitFor({
						viewName: sViewName,
						controlType: "sap.m.Dialog",
						//id: sDialogId,
						searchOpenDialogs: true,
						autoWait: true,
						success: function(oDialog) {
									var a = oDialog[sDialog].getAggregation("content")[1];
									if(a.getItems[objPos] !== null){
									a.getItems()[objPos].$().trigger("tap");
									ok(true, "Value for F4 help is selected");		
									}
						},
						errorMessage: "Value help not selected"
					});
				},


				iShouldSeeConvertToActualsDialogOpen: function() {
					return this.waitFor({
						viewName: sViewName,
						controlType: "sap.m.Dialog",
						searchOpenDialogs: true,
						//id: sDialogID,
					/*	id: "__dialog0-page1",
						check: function(oDialog){
							// check for header title
							return true;
						},*/
						// change view settings dialog to select dialog
						// Write check/matchers to check title.
						success: function(oDialog) {
							ok(true, "Convert to actuals dialog open");
						},
						errorMessage: "A new entry is not added"
					});
				},	
				iShouldClickOnValueHelpsInConvertToActualsDialog: function() {
					return this.waitFor({
						viewName: sViewName,
						controlType: "sap.m.Input",
						//id: sValueID,
						searchOpenDialogs: true,
						actions: function(oInput) {
							//debugger;
							oInput.fireValueHelpRequest();
						},
						success: function(oInput) {
							ok(true, "Map to actuals dialog open");
						},
						errorMessage: "Error in opening F4 value help"
					});
				},
		
				iShouldSelectValueFromF4HelpForDialog: function(sDialogId, objPos) {
					return this.waitFor({
						viewName: sViewName,
						controlType: "sap.m.Dialog",
						id: sDialogId,
						searchOpenDialogs: true,
						autoWait: true,
						success: function(oDialog) {
									var a = oDialog[2].getAggregation("content")[1];
									if(a.getItems[objPos] !== null){
									a.getItems()[objPos].$().trigger("tap");
									ok(true, "Value for F4 help is selected");		
									}
						},
						errorMessage: "Value help not selected"
					});
				},
			
				iShouldSelectValueFromF4HelpSearch: function(sDialogId ,sDialog, objPos) {
					return this.waitFor({
						viewName: sViewName,
						controlType: "sap.m.Dialog",
						id: sDialogId,
						searchOpenDialogs: true,
						autoWait: true,
						success: function(oDialog) {
									var a = oDialog[0].getAggregation("content")[1];
									if(a.getItems[objPos] !== null){
									a.getItems()[objPos].$().trigger("tap");
									ok(true, "Value for F4 help is selected");		
									}
						},
						errorMessage: "Value help not selected"
					});
				}
				
			}, shareOptions.createActions(sViewName)),

			assertions: jQuery.extend({

				TheTableShouldHaveExpectedEntries: function(sTableId, noOfItems) {
					return this.waitFor({
						id: sTableId,
						viewName: sViewName,
						check: function(oTable) {
							if (oTable.getItems().length === noOfItems) {
								return true;
							}
						},
						success: function() {
							Opa5.assert.ok(true, "Table has required number of Items");
						},
						errorMessage: "Table not found"
					});
				},
				
				TheCellShouldHaveExpectedEntry: function(sTableId, rId, cId, sCellText){
                    return this.waitFor({
                           id: sTableId,
                           viewName: sViewName,
                           autoWait: true,
                           controlType: "sap.m.Table",
                           check: function(oTable) {
                               if (oTable.getItems()[rId].getAggregation("cells")[cId].getText() === sCellText) {
                                      return true;
                               }
                		   },   
                           success: function() {             	   
                        	   Opa5.assert.ok(true, "Table has the expected entry");
                           },
                           errorMessage: "Table not found"
                    });
				},
				TheButtonWithIdEnabled: function(sID, bStatus) {
					return this.waitFor({
						viewName: sViewName,
						id: sID,
						controlType: "sap.m.Button",
						
						check: function(oButton) {
							// debugger;
							if (oButton.getEnabled() === bStatus) {
								return true;
							}
						},
						success: function(oButton) {
							Opa5.assert.ok(oButton, "Button is visible "+bStatus);
						},
						errorMessage: "Doesn't find the button"
					});
				},

				TheMappedEntryShouldBeUnEditableInOutput: function(sTableId, rowIndex) {
					return this.waitFor({
						id: sTableId,
						viewName: sViewName,
						check: function(oTable) {
							if (oTable.getItems()[rowIndex].getAggregation("cells")[1].getEditable() === false) {
								return true;
							}
						},
						success: function() {
							Opa5.assert.ok(true, "Entry mapped to actuals");
						},
						errorMessage: "Entry not mapped"
					});
				},
				
				iConfirmDeleteActionForOutput: function(sText) {
					return this.waitFor({
						pollingInterval: 50,
						searchOpenDialogs: true, //mandatory
						success: function(oDialogs) {
							return this.waitFor({
								actions: function() {
									jQuery.each(oDialogs, function(index, oDialog) {
										if (oDialog.$().text() === sText) {
											oDialog.$().trigger("tap");
											Opa5.assert.ok(true, "Found OK button inside open dialog! action");
										}
									});
								}
							});

						},
						errorMessage: "Did not find either the open dialog or buttons inside an open dialog"
					});
				},
				
				AllTheErrorsAreDisplayedInStack: function() {
					// return this.waitFor({
					// 	viewName: sViewName,
					// 	controlType: "sap.m.MessagePopover",

					// 	// check: function(aMessage) {

					// 	// 	debugger;
					// 	// },
					// 	success: function(aMessage) {
					// 		debugger;
					// 		Opa5.assert.ok(true, "Entry mapped to actuals");
					// 	},
					// 	errorMessage: "Entry not mapped"
					// });
					return this.waitFor({
						pollingInterval: 100,
						viewName: sViewName,
						//	controlType: "sap.m.MessagePopover",
						check: function(aMessage) {
							return !!sap.ui.test.Opa5.getJQuery()(".sapMMessageToast").length;
						},
						success: function() {
							ok(true, "Found a Toast");
						},
						errorMessage: "No Toast message detected!"
					});

				}

			}, shareOptions.createAssertions(sViewName))

		}

	});

});