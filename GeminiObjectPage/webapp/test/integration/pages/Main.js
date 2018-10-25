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
		onTheMainPage: {
			baseClass: Common,

			actions: jQuery.extend({

				iPressOnTheButtonWithTextWithi18n: function(i18ID){
					return this.waitFor({
						viewName: sViewName,
						controlType: "sap.m.Button",
						matchers: function (oPage) {
							var sExpectedText = oPage.getModel("i18n").getResourceBundle().getText(i18ID);
							return new PropertyStrictEquals({
								name: "text",
								value: sExpectedText
							}).isMatching(oPage);
						},
						actions: new Press(),
						success: function(oButton) {
							Opa5.assert.ok(oButton, "Button Pressed");
						},
						errorMessage: "Doesn't find the button"
					});
				},
				
				iPressOnTheButtonWithText: function(sText) {
					return this.waitFor({
						viewName: sViewName,
						controlType: "sap.m.Button",
						matchers: new PropertyStrictEquals({
							name: "text",
							value: sText
						}),

						actions: new Press(),
						success: function(oButton) {
							Opa5.assert.ok(oButton, "Button Pressed");
						},
						errorMessage: "Doesn't find the button"
					});
				},

				iPressOnTheButtonWithId: function(sId) {
					return this.waitFor({
						id: sId,
						viewName: sViewName,
						controlType: "sap.m.Button",
						actions: new Press(),
						success: function(oButton) {
							Opa5.assert.ok(oButton, "Button with id " + sId + " is Pressed");
						},
						errorMessage: "Doesn't found the button"
					});
				},
				
				iShouldClickOnValueHelpInput: function(sInput) {
					return this.waitFor({
						id: sInput,
						viewName: sViewName,
						controlType: "sap.m.Input",						
						success: function(oInput) {
							oInput.fireValueHelpRequest();
							Opa5.assert.ok(true, "An entry got selected");
						},
						errorMessage: "Input is not found "
					});
				}, 
				iShouldClickOnValueHelpInputBlock: function(sInput, viewNmae) {
                    return this.waitFor({
                           id: sInput,
                           viewName: viewNmae,
                           controlType: "sap.m.Input",                                         
                           success: function(oInput) {
                                  oInput.fireValueHelpRequest();
                                  Opa5.assert.ok(true, "An entry got selected");
                           },
                           errorMessage: "Input is not found "
                    });
				},
				
				iShouldSelectBORObject: function()
				{
					return this.waitFor({
						id: "borcl1--Dialog",
						viewName: sViewName,
						searchOpenDialogs: true,
						autoWait: true,
						controlType: "sap.m.Dialog",
						success: function(oDialog) {
							oDialog[0].getContent()[0].getItems()[0].getContent()[1].getItems()[0].setSelected(true);
							Opa5.assert.ok(true, "An entry got selected");
						},
						errorMessage: "List is not found "
					});
					
				},

				iShouldEnterTextIntoInput: function(sId, sText) {
					return this.waitFor({
						viewName: sViewName,
						controlType: "sap.m.Input",
						actions: function(oInput) {
							// debugger;
							if (oInput.getId() === sId) {
								oInput.setValue(sText);
							}
						},
						success: function(oInput) {

							Opa5.assert.ok(true, "An entry got selected");
						},
						errorMessage: "Input is not found "
					});
				},

				// Select Enhancement from the drop down
				iShouldSelectAnItemFromTheDropDown: function(sTableId) {
					return this.waitFor({
						id: sTableId,
						viewName: sViewName,
						success: function(oTable) {
							return this.waitFor({
								id: oTable.getItems()[0].getAggregation("cells")[0].getId(),
								controlType: "sap.m.Select",
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

				//when the input box id is generated while rendering
				iShouldClickOnValueHelp: function(sTableId, rId, cId) {
					return this.waitFor({
						id: sTableId,
						viewName: sViewName,
						success: function(oTable) {
							return this.waitFor({
								id: oTable.getItems()[rId].getAggregation("cells")[cId].getId(),
								controlType: "sap.m.Input",
								success: function(oInput) {
									oInput.fireValueHelpRequest();
									ok(true, "F4 Help opened");
								},
								errorMessage: "Unable to select value from drop down"
							});
						}
					});
				},

				iShouldClickOnAllValueHelpsInMapToActualsDialog: function() {
					return this.waitFor({
						viewName: sViewName,
						controlType: "sap.m.Input",
						searchOpenDialogs: true,
						actions: function(oInput) {
							oInput.fireValueHelpRequest();
						},
						success: function(oInput) {
							ok(true, "Map to actuals dialog open");
						},
						errorMessage: "Error in opening F4 value help"
					});
				},

				iShouldSelectValueFromF4Help: function(cDialog, objPos) {
					return this.waitFor({
						viewName: sViewName,
						controlType: "sap.m.Dialog",
						searchOpenDialogs: true,
						autoWait: true,
						success: function(aDialog) {
							var a = aDialog[cDialog].getAggregation("content")[1];
							a.getItems()[objPos].$().trigger("tap");
							ok(true, "Value for F4 help is selected");
						},
						errorMessage: "Value help not selected"
					});
				},

				iShouldEnterTextInput: function(sTableId, rId, cId, sText) {
					return this.waitFor({
						id: sTableId,
						viewName: sViewName,
						autoWait: true,
						success: function(oTable) {
														return this.waitFor({
								id: oTable.getItems()[rId].getAggregation("cells")[cId].getId(),
								actions: new sap.ui.test.actions.EnterText({
									text: sText
								})
							});
						}
					});
				},

				iPressButtonOnResponsivePopover: function(sText) {
					return this.waitFor({
						viewName: sViewName,
						controlType: "sap.m.Button",
						searchOpenDialogs: true,
						matchers: new I18NText({
							propertyName: "text",
							key: "Discard"
						}),
						actions: new Press(),
						success: function(oResponsivePopover) {
							ok(true, "Pressed button on responsive popover");
						},
						errorMessage: "Responsive popover not opened"
					});
				},

				iShouldSelectAnItemFromTheTable: function(sTableId, rId) {
					return this.waitFor({
						viewName: sViewName,
						id: sTableId,
						actions: function(oTable) {
							oTable.getItems()[rId].setSelected(true);
							oTable.fireSelectionChange();
						},
						success: function() {
							Opa5.assert.ok(true, "An entry got selected");
						},
						errorMessage: "An Item is not selected"
					});
				},

				iSeeErrorMessagePopover: function(sErrorMessage) {
					return this.waitFor({
						pollingInterval: 100,
						searchOpenDialogs: true, //mandatory
						success: function(oDialogs) {
							return this.waitFor({
								actions: function() {
									if (oDialogs[oDialogs.length - 1].$().text() === "Close") {
										oDialogs[oDialogs.length - 1].$().trigger("tap");
										Opa5.assert.ok(true, "Found OK button inside open dialog! action");
									}
								}
							});

						},
						errorMessage: "Did not find either the open dialog or buttons inside an open dialog"
					});

				},

				iConfirmDeleteAction: function(sText) {
					return this.waitFor({
						pollingInterval: 100,
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

				iShouldSelectCheckBox: function(sId) {

					return this.waitFor({
						id: sId,
						viewName: sViewName,
						controlType: "sap.m.CheckBox",
						success: function(oItem) {

							oItem.setSelected(true);
							oItem.fireSelect();
							//oItems[1].$().trigger("tap");
							Opa5.assert.ok(true, " Checkbox is checked ");
						},
						errorMessage: "Entry not selected from drop down"

					});

				},

				iShouldUnSelectCheckBox: function(sId) {

					return this.waitFor({
						id: sId,
						viewName: sViewName,
						controlType: "sap.m.CheckBox",
						success: function(oItem) {

							oItem.setSelected(false);
							oItem.fireSelect();

							//oItems[1].$().trigger("tap");
							Opa5.assert.ok(true, " Checkbox is checked ");
						},
						errorMessage: "Entry not selected from drop down"

					});

				},

				iShouldSeeMapToActualsDialogOpen: function() {
					return this.waitFor({
						viewName: sViewName,
						controlType: "sap.m.Dialog",
						searchOpenDialogs: true,
						// change view settings dialog to select dialog
						// Write check/matchers to check title.
						success: function(oDialog) {
							ok(true, "Map to actuals dialog open");
						},
						errorMessage: "A new entry is not added"
					});
				},
				iRemoveItemFromTheActualsTable: function(sTableId, sRowIndex) {
					return this.waitFor({
						id: sTableId,
						viewName: sViewName,
						success: function(oTable) {
							return this.waitFor({
								id: oTable.getItems()[sRowIndex].getDeleteControl().getId(),
								actions: new Press(),
								success: function(oDelete) {
									Opa5.assert.ok(oDelete, "Delete from  actual table is triggred");
								},
								errorMessage: "Unable to select value from drop down"
							});
						},

						errorMessage: "Entry not selected from drop down"
					});
				},
				iShouldSelectAnItemFromChangeTypeExtTypeTheDropDown: function(sTableId) {
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
									//oItems[1].$().trigger("tap");
									Opa5.assert.ok(true, " Value 'enhancement' is selected from drop down");
								},
								errorMessage: "Unable to select value from drop down"
							});
						},

						errorMessage: "Entry not selected from drop down"
					});
				},
				iShouldSelectAnItemFromTheDropDownNewChangeType: function(sTableID, sCol, sItem) {
					return this.waitFor({
						id: sTableID,
						viewName: sViewName,
						success: function(oTable) {
							return this.waitFor({
								id: oTable.getItems()[0].getAggregation("cells")[sCol].getId(),
								controlType: "sap.m.Select",
								success: function(oSelect) {
									var oItems = oSelect.getItems();
									oSelect.setSelectedKey(oItems[sItem].getKey());
									//oItems[1].$().trigger("tap");
									Opa5.assert.ok(true, " Value 'New' is selected from drop down");
								},
								errorMessage: "Unable to select value from drop down"
							});
						},

						errorMessage: "Entry not selected from drop down"
					});
				},
				iShouldSelectAnItemFromExtensionTypeTheDropDown: function(sTableId) {
					return this.waitFor({
						id: sTableId,
						viewName: sViewName,
						success: function(oTable) {
							return this.waitFor({
								id: oTable.getItems()[0].getAggregation("cells")[2].getId(),
								controlType: "sap.m.ComboBox",
								success: function(oSelect) {
									var oItems = oSelect.getItems();
									oSelect.setSelectedKey(oItems[1].getKey());
									//oItems[1].$().trigger("tap");
									Opa5.assert.ok(true, " Value 'ProcessExtension' is selected from drop down");
								},
								errorMessage: "Unable to select value from drop down"
							});
						},

						errorMessage: "Entry not selected from drop down"
					});
				},
				iPressOntheActualsRowNavigation: function(sTableId, sViewId) {
					return this.waitFor({

						viewName: sViewId,

						id: sTableId,

						actions: function(oTable) {

							oTable.getItems()[0].$().trigger("tap");

						},

						success: function() {

							Opa5.assert.ok(true, "An entry got selected");

						},

						errorMessage: "An Item is not selected"

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
							Opa5.assert.ok(oButton, "Button is visible " + bStatus);
						},
						errorMessage: "Doesn't find the button"
					});
				},
				
				TheEntryisEditableInTable: function(sID,iRow,iColumn,bStatus){
					return this.waitFor({
						id: sID,
						viewName: sViewName,
						check: function(oTable) {
							if (oTable.getItems()[iRow].getAggregation("cells")[iColumn].getEditable() === bStatus) {
								return true;
							}
						},
						success: function() {
							Opa5.assert.ok(true, "Entry is editable");
						},
						errorMessage: "Given input field is not editable"
					});
				},

				TheMappedEntryShouldBeUnEditable: function(sTableId, rowIndex) {
					return this.waitFor({
						id: sTableId,
						viewName: sViewName,
						check: function(oTable) {
							if (oTable.getItems()[rowIndex].getAggregation("cells")[0].getEnabled() === false) {
								return true;
							}
						},
						success: function() {
							Opa5.assert.ok(true, "Entry mapped to actuals");
						},
						errorMessage: "Entry not mapped"
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