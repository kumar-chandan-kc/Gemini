sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/Press",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"GeminiSmartTemplate/test/integration/pages/Common",
	"GeminiSmartTemplate/test/integration/pages/shareOptions",
	"sap/ui/test/matchers/AggregationFilled"
], function(Opa5, Press, PropertyStrictEquals, Common, shareOptions, AggregationFilled) {
	"use strict";

	var sViewName = "ListReport";

	Opa5.createPageObjects({
		onTheListReportPage: {
			baseClass: Common,

			actions: jQuery.extend({

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
						success: function(aDialog) {
							var a = aDialog[cDialog].getAggregation("content")[1];
							a.getItems()[objPos].$().trigger("tap");
							ok(true, "Value fro F4 help is selected");
						},
						errorMessage: "Value help not selected"
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

				iPressOnResponsivePopover: function(sItemIndex) {
					return this.waitFor({
						//id: new RegExp('listinpopover'),
						id: "__list1",
						controlType: "sap.m.List",
						matchers: new AggregationFilled({
							name: "items"
						}),
						success: function(oPopover) {
							var items = oPopover.getItems();
							items[sItemIndex].firePress();
							Opa5.assert.ok(oPopover, "Item on responsive popover is Pressed");
						},
						errorMessage: "Item not selected on responsive popover"
					});
				}

			}, shareOptions.createActions(sViewName)),

			assertions: jQuery.extend({

				theResponsivePopOverContainsTheCorrectItems: function() {
					return true;
				},

				iSeeErrorMessagePopover: function() {
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

				iSeeButtonWithText: function(sText) {
					return this.waitFor({
						viewName: sViewName,
						controlType: "sap.m.Button",
						matchers: new PropertyStrictEquals({
							name: "text",
							value: sText
						}),

						//actions: new Press(),
						success: function(oButton) {
							Opa5.assert.ok(oButton, "Button Pressed");
						},
						errorMessage: "Doesn't find the button"
					});
				}

			}, shareOptions.createAssertions(sViewName))

		}

	});

});