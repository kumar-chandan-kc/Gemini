sap.ui.define([

	"sap/ui/test/opaQunit"
], function(opaTest) {
	"use strict";

	QUnit.module("API");
	var icheck = "abcdefghijklmnopqrstuvwxyz12345";
	var ibacklogid = "";
	//var ibacklogid = "CFNDRCBLR3-xyz";

	opaTest("API Planning Facet: Creation of new entry with 'New' Change type", function(Given, When, Then) {
		// Arrangements
		// Given.iStartMyApp({
		// 	hash: "Bank#Default"
		// });
		// Actions
		When.onTheMainPage.iPressOnTheButtonWithText("Edit");
		//checking buttons enabled functionality
		Then.onTheMainPage.TheButtonWithIdEnabled("BtnDelAPI", false);
		Then.onTheMainPage.TheButtonWithIdEnabled("BtnConvertAPI", false);

		When.onTheMainPage.iPressOnTheButtonWithId("addPlanAPI");
		When.onTheAPIFacet.iShouldSelectAnItemFromTheDropDownChangeType("TablePlanAPI", 0, 0);
		When.onTheAPIFacet.iShouldSelectAnItemFromTheDropDownChangeType("TablePlanAPI", 0, 1);
		When.onTheAPIFacet.iShouldSelectAnItemFromTheDropDownChangeType("TablePlanAPI", 0, 0);
		When.onTheAPIFacet.iShouldSelectAnItemFromTheDropDown("TablePlanAPI", 1);
		//   When.onTheMainPage.iShouldEnterTextInput("TablePlanAPI", 0, 11, "CFNDRCBLR3-xyz");
		//   When.onTheMainPage.iShouldEnterTextInput("TablePlanAPI", 0, 11, "");
		//   When.onTheMainPage.iShouldEnterTextInput("TablePlanAPI", 0, 13, "CFNDRCBLR3-xyz");
		//   When.onTheMainPage.iShouldEnterTextInput("TablePlanAPI", 0, 13, "");
		When.onTheAPIFacet.iShouldSelectCheckBoxes("TablePlanAPI", 2);
		When.onTheMainPage.iShouldEnterTextInput("TablePlanAPI", 0, 11, "");
		//   When.onTheAPIFacet.iShouldSelectCheckBoxes("TablePlanAPI", 3);
		When.onTheAPIFacet.iShouldSelectCheckBoxes("TablePlanAPI", 4);
		//   When.onTheMainPage.iShouldEnterTextInput("TablePlanAPI", 0, 11, "CFNDRCBLR3-119");
		//   When.onTheMainPage.iShouldEnterTextInput("TablePlanAPI", 0, 13, "CFNDRCBLR3-xyz");
		When.onTheMainPage.iShouldEnterTextInput("TablePlanAPI", 0, 13, "");
		When.onTheAPIFacet.iShouldSelectCheckBoxes("TablePlanAPI", 5);
		When.onTheMainPage.iShouldClickOnValueHelp("TablePlanAPI", 0, 8);
		When.onTheMainPage.iShouldSelectValueFromF4Help(0, 4);
		//Assertions
		Then.onTheMainPage.TheTableShouldHaveExpectedEntries("TablePlanAPI", 1);

	});

	opaTest("API Actuals Facet: Creation of new entry", function(Given, When, Then) {
		// Arrangements

		// Actions
		When.onTheMainPage.iPressOnTheButtonWithId("APIadd");
		When.onTheMainPage.iShouldClickOnValueHelp("idTable6", 0, 0);
		When.onTheMainPage.iShouldSelectValueFromF4Help(0, 4);
		//Assertions
		Then.onTheMainPage.TheTableShouldHaveExpectedEntries("idTable6", 1);

	});

	opaTest("API Planning Facet: Creation of new entry with 'Enhancement' Change type", function(Given, When, Then) {
		// Arrangements

		// Actions
		When.onTheMainPage.iPressOnTheButtonWithId("addPlanAPI");
		When.onTheAPIFacet.iShouldSelectAnItemFromTheDropDownChangeType("TablePlanAPI", 0, 1);
		When.onTheAPIFacet.iShouldSelectCheckBoxes("TablePlanAPI", 2);
		When.onTheAPIFacet.iShouldSelectCheckBoxes("TablePlanAPI", 3);
		When.onTheAPIFacet.iShouldSelectCheckBoxes("TablePlanAPI", 4);
		When.onTheAPIFacet.iShouldSelectCheckBoxes("TablePlanAPI", 5);
		When.onTheMainPage.iShouldClickOnValueHelp("TablePlanAPI", 0, 7);
		When.onTheMainPage.iShouldSelectValueFromF4Help(0, 0);
		When.onTheMainPage.iShouldClickOnValueHelp("TablePlanAPI", 0, 8);
		When.onTheMainPage.iShouldSelectValueFromF4Help(0, 4);
		//Assertions
		Then.onTheMainPage.TheTableShouldHaveExpectedEntries("TablePlanAPI", 2);

	});

	opaTest("API Planning Facet: Mapping planned entry to actuals", function(Given, When, Then) {
		// Arrangements              
		//Given.iStartMyApp({hash : "Bank#Default"});

		//Actions
		//Convert to Actuals without complete data
		When.onTheMainPage.iShouldSelectAnItemFromTheTable("TablePlanAPI", 0);
		When.onTheAPIFacet.iShouldUnselectCheckBoxes("TablePlanAPI", 2);
		When.onTheAPIFacet.iShouldUnselectCheckBoxes("TablePlanAPI", 3);
		When.onTheAPIFacet.iShouldUnselectCheckBoxes("TablePlanAPI", 4);
		When.onTheAPIFacet.iShouldUnselectCheckBoxes("TablePlanAPI", 5);
		When.onTheMainPage.iPressOnTheButtonWithId("BtnConvertAPI");
		When.onTheMainPage.iConfirmDeleteAction("Close");

		When.onTheAPIFacet.iShouldSelectCheckBoxes("TablePlanAPI", 2);
		When.onTheAPIFacet.iShouldSelectCheckBoxes("TablePlanAPI", 3);
		When.onTheAPIFacet.iShouldSelectCheckBoxes("TablePlanAPI", 4);
		When.onTheAPIFacet.iShouldSelectCheckBoxes("TablePlanAPI", 5);
		When.onTheMainPage.iShouldSelectAnItemFromTheTable("TablePlanAPI", 0);
		When.onTheMainPage.iPressOnTheButtonWithId("BtnConvertAPI");
		When.onTheMainPage.iConfirmDeleteAction("OK");

		When.onTheMainPage.iShouldSelectAnItemFromTheTable("TablePlanAPI", 0);
		
		Then.onTheMainPage.TheButtonWithIdEnabled("BtnDelAPI", false);
		Then.onTheMainPage.TheButtonWithIdEnabled("BtnConvertAPI", false);
		Then.onTheMainPage.TheMappedEntryShouldBeUnEditable("TablePlanAPI", 0);

	});

	opaTest("API Planning Facet: Converting planned entry to actuals", function(Given, When, Then) {

		When.onTheMainPage.iShouldSelectAnItemFromTheTable("TablePlanAPI", 1);
		When.onTheMainPage.iPressOnTheButtonWithId("BtnConvertAPI");

		When.onTheAPIFacet.iShouldClickOnValueHelpInMapToActualsDialog("APIMAP");
		When.onTheMainPage.iShouldClickOnAllValueHelpsInMapToActualsDialog();
		When.onTheMainPage.iShouldSelectValueFromF4Help(1, 0);
		When.onTheMainPage.iShouldSelectValueFromF4Help(1, 0);
		When.onTheMainPage.iConfirmDeleteAction("OK");

		Then.onTheMainPage.TheMappedEntryShouldBeUnEditable("TablePlanAPI", 1);
	});

	opaTest("API Planning Facet: Creation of new entry with 'New' Change type", function(Given, When, Then) {
		
		When.onTheMainPage.iPressOnTheButtonWithId("addPlanAPI");
		When.onTheAPIFacet.iShouldSelectAnItemFromTheDropDownChangeType("TablePlanAPI", 0, 0);
		When.onTheAPIFacet.iShouldSelectAnItemFromTheDropDown("TablePlanAPI", 1);
		When.onTheAPIFacet.iShouldSelectCheckBoxes("TablePlanAPI", 2);
		When.onTheMainPage.iShouldClickOnValueHelp("TablePlanAPI", 0, 8);
		When.onTheMainPage.iShouldSelectValueFromF4Help(0, 4);
		//Assertions
		Then.onTheMainPage.TheTableShouldHaveExpectedEntries("TablePlanAPI", 3);

	});
	
	opaTest("API Actuals Facet: Creation of new entry", function(Given, When, Then) {
		// Arrangements

		// Actions
		When.onTheMainPage.iPressOnTheButtonWithId("APIadd");
		When.onTheMainPage.iShouldClickOnValueHelp("idTable6", 0, 0);
		When.onTheMainPage.iShouldSelectValueFromF4Help(0, 5);
		When.onTheMainPage.iPressOnTheButtonWithText("Save");
		//Assertions
		Then.onTheMainPage.TheTableShouldHaveExpectedEntries("idTable6nonEdit", 3);

	});

	opaTest("API Planning Facet: Checking delete functionality", function(Given, When, Then) {
		// Arrangements              
		//Given.iStartMyApp({hash : "Bank#Default"});

		//Actions
		When.onTheMainPage.iPressOnTheButtonWithText("Edit");
		When.onTheMainPage.iShouldSelectAnItemFromTheTable("TablePlanAPI", 0);
		Then.onTheMainPage.TheButtonWithIdEnabled("BtnDelAPI", true);
		Then.onTheMainPage.TheButtonWithIdEnabled("BtnConvertAPI", true);
		When.onTheMainPage.iPressOnTheButtonWithId("BtnDelAPI");
		When.onTheMainPage.iConfirmDeleteAction("Yes");
		Then.onTheMainPage.TheTableShouldHaveExpectedEntries("TablePlanAPI", 2);
	});

	opaTest("API Actuals Facet: Checking delete functionality (with and without selection)", function(Given, When, Then) {
		
		When.onTheMainPage.iRemoveItemFromTheActualsTable("idTable6", 0);
		When.onTheMainPage.iConfirmDeleteAction("OK");
		When.onTheMainPage.iPressOnTheButtonWithText("Save");
		Then.onTheMainPage.TheTableShouldHaveExpectedEntries("idTable6nonEdit", 2);
	});
	
	opaTest("API Facet: Catching Error for Jira ID, Service Interface, TargetRelease & checkbox", function(Given, When, Then) {

		// Actions
		When.onTheMainPage.iPressOnTheButtonWithText("Edit");
		When.onTheMainPage.iPressOnTheButtonWithId("addPlanAPI");
		When.onTheAPIFacet.iShouldSelectAnItemFromTheDropDownChangeType("TablePlanAPI", 0, 1);
		
		When.onTheMainPage.iShouldEnterTextInput("TablePlanAPI", 0, 10,ibacklogid );
		
		When.onTheMainPage.iPressOnTheButtonWithId("APIadd");
		When.onTheMainPage.iPressOnTheButtonWithText("Save");
		When.onTheMainPage.iPressOnTheButtonWithId("error");

		//Assertions
		Then.onTheMainPage.TheTableShouldHaveExpectedEntries("TablePlanAPI", 3);
		
		When.onTheMainPage.iPressOnTheButtonWithTextWithi18n("Cancel");
		When.onTheMainPage.iPressOnTheButtonWithTextWithi18n("Discard");

		Then.onTheMainPage.TheTableShouldHaveExpectedEntries("TablePlanAPInonEdit", 2);

	});
	
});