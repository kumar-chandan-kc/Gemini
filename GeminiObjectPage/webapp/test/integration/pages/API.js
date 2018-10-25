sap.ui.define([
	
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/Press",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"s4/cfnd/geminiobjectpage/test/integration/pages/Common",
	"s4/cfnd/geminiobjectpage/test/integration/pages/shareOptions"
], function(Opa5, Press, PropertyStrictEquals, Common, shareOptions) {
	"use strict";

	var sViewName = "Object";

	Opa5.createPageObjects({
		onTheAPIFacet: {
			baseClass: Common,

			actions: jQuery.extend({
				iShouldSelectAnItemFromTheDropDown: function(sTableID, sCol) {
					return this.waitFor({
						id: sTableID,
						viewName: sViewName,
						success: function(oTable) {
							return this.waitFor({
								id: oTable.getItems()[0].getAggregation("cells")[sCol].getId(),
								controlType: "sap.m.Select",
								success: function(oSelect) {
									var oItems = oSelect.getItems();
									oSelect.setSelectedKey(oItems[0].getKey());
									//oItems[1].$().trigger("tap");
									Opa5.assert.ok(true, " Value 'New' is selected from drop down");
								},
								errorMessage: "Unable to select value from drop down"
							});
						},

						errorMessage: "Entry not selected from drop down"
					});
				},
				iShouldSelectAnItemFromTheDropDownChangeType: function(sTableID, sCol, sItem) {
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
				iShouldSelectCheckBoxes: function(sTableID, sCol) {
					return this.waitFor({
						id: sTableID,
						viewName: sViewName,
						success: function(oTable) {
							return this.waitFor({
								id: oTable.getItems()[0].getAggregation("cells")[sCol].getId(),
								controlType: "sap.m.CheckBox",
								success: function(oSelect) {
									//	var oItems = oSelect.getItems();
									oSelect.setSelected(true);
									//oItems[1].$().trigger("tap");
									Opa5.assert.ok(true, " Checkbox is checked ");
								},
								errorMessage: "Unable to select value from drop down"
							});
						},

						errorMessage: "Entry not selected from drop down"
					});

				},
				iShouldUnselectCheckBoxes: function(sTableID, sCol) {
					return this.waitFor({
						id: sTableID,
						viewName: sViewName,
						success: function(oTable) {
							return this.waitFor({
								id: oTable.getItems()[0].getAggregation("cells")[sCol].getId(),
								controlType: "sap.m.CheckBox",
								success: function(oSelect) {
									//	var oItems = oSelect.getItems();
									oSelect.setSelected(false);
									//oItems[1].$().trigger("tap");
									Opa5.assert.ok(true, " Checkbox is unchecked ");
								},
								errorMessage: "Unable to select value from drop down"
							});
						},

						errorMessage: "Entry not selected from drop down"
					});

				},
				iShouldClickValueHelpInDialog: function(sValueID){
					return this.waitFor({
						viewName: sViewName,
						id: sValueID,
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
				iShouldSelectValueFromF4HelpAPI: function(sDialogId ,sDialog, objPos) {
					return this.waitFor({
						viewName: sViewName,
						id: sDialogId,
						controlType: "sap.m.Dialog",
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
				},
				iShouldClickOnValueHelpInMapToActualsDialog: function(sInputId){
					return this.waitFor({
						viewName: sViewName,
						id: sInputId,
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
				}
			}, shareOptions.createActions(sViewName)),

			assertions: jQuery.extend({

			}, shareOptions.createAssertions(sViewName))

		}

	});

});