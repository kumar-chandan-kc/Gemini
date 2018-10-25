sap.ui.define([
	
	"sap/ui/test/opaQunit"
], function(opaTest) {
	"use strict";

	QUnit.module("Extensibility");
	var icheck = "abcdefghijklmnopqrstuvwxyz12345";
	var ibacklogid = "";
	//	var ibacklogid = "CFNDRCBLR3-xyz";

	opaTest("Checking navigation for Business Context", function(Given, When, Then) {

		// Arrangements
		// Given.iStartMyApp({
		// 	hash: "Bank#Default"
		// });

		//Actions
		When.onTheMainPage.iPressOntheActualsRowNavigation("idTable5", "Object");
		When.onTheMainPage.iPressOntheActualsRowNavigation("idTable4", "Object1");

	});
	opaTest("Extensions Facet: Creation of new entry in the planning", function(Given, When, Then) {
		// Actions
		When.onTheMainPage.iPressOnTheButtonWithText("Edit");
		// When.onTheMainPage.iShouldUnSelectCheckBox("isext");
		// When.onTheMainPage.iConfirmDeleteAction("Yes");
		// // // Then.onTheMainPage.TheButtonWithIdEnabled("addPlanExt", false);

		// When.onTheMainPage.iShouldSelectCheckBox("isext");
		// When.onTheMainPage.iConfirmDeleteAction("Yes");
		// // // Then.onTheMainPage.TheButtonWithIdEnabled("addPlanExt", true); 

		Then.onTheMainPage.TheButtonWithIdEnabled("BtnDelExtPlan", false);
		//Then.onTheMainPage.TheButtonWithIdEnabled("BtnMapExt", false);
		When.onTheMainPage.iPressOnTheButtonWithId("addPlanExt");
		When.onTheMainPage.iShouldSelectAnItemFromChangeTypeExtTypeTheDropDown("TablePlanExt");
//		When.onTheMainPage.iShouldEnterTextInput("TablePlanExt", 0, 6, "CFNDRCBLR3-xyz");
		When.onTheMainPage.iShouldClickOnValueHelp("TablePlanExt", 0, 3);
		When.onTheMainPage.iShouldSelectValueFromF4Help(0, 0);
		When.onTheMainPage.iShouldEnterTextInput("TablePlanExt", 0, 6, "");
		When.onTheMainPage.iShouldClickOnValueHelp("TablePlanExt", 0, 1);
		//When.onTheOutputPage.iShouldSelectValueFromF4Help("BusinessContextDialogExtPlanned2-dialog", 0);
		When.onTheMainPage.iShouldSelectValueFromF4Help(0, 0);
		When.onTheMainPage.iShouldSelectAnItemFromExtensionTypeTheDropDown("TablePlanExt");
//		When.onTheMainPage.iShouldEnterTextInput("TablePlanExt", 0, 6, "CFNDRCBLR3-119");
		When.onTheMainPage.iPressOnTheButtonWithText("Save");

		//Assertions
		Then.onTheMainPage.TheTableShouldHaveExpectedEntries("TablePlanExt2", 1);

	});

	opaTest("Extensions Facet: Checking delete functionality (Planning)", function(Given, When, Then) {
		// Arrangements             
		//Given.iStartMyApp({hash : "Bank#Default"});

		//Actions
		When.onTheMainPage.iPressOnTheButtonWithText("Edit");
		When.onTheMainPage.iPressOnTheButtonWithId("addPlanExt");
		When.onTheMainPage.iShouldSelectAnItemFromTheTable("TablePlanExt", 0);
		When.onTheMainPage.iPressOnTheButtonWithId("BtnDelExtPlan");
		When.onTheMainPage.iConfirmDeleteAction("Yes");
		Then.onTheMainPage.TheTableShouldHaveExpectedEntries("TablePlanExt", 1);
		//.and.iTeardownMyAppFrame();            
	});
	
	opaTest("Extensions Facet: Mapping planned enrty to actuals", function(Given, When, Then) {
		// Arrangements             
		//Given.iStartMyApp({hash : "Bank#Default"});

		//Actions
		When.onTheMainPage.iShouldSelectAnItemFromTheTable("TablePlanExt", 0);
		When.onTheMainPage.iPressOnTheButtonWithId("BtnMapExt");
		// When.onTheMainPage.iShouldSeeMapToActualsDialogOpen();
		// When.onTheMainPage.iShouldClickOnAllValueHelpsInMapToActualsDialog();
		// When.onTheMainPage.iShouldSelectValueFromF4Help(1, 0);
		// When.onTheMainPage.iShouldSelectValueFromF4Help(1, 2);
		When.onTheMainPage.iConfirmDeleteAction("OK");

		Then.onTheMainPage.TheTableShouldHaveExpectedEntries("TablePlanExt", 1);
	});
	
	opaTest("Extensions Facet: Checking error messages on save", function(Given, When, Then) {
		// Arrangements             
		//Given.iStartMyApp({hash : "Bank#Default"});

		//Actions
		When.onTheMainPage.iPressOnTheButtonWithId("addPlanExt");
		When.onTheMainPage.iPressOnTheButtonWithText("Save");
		When.onTheMainPage.iPressOnTheButtonWithId("error");

		Then.onTheMainPage.TheTableShouldHaveExpectedEntries("TablePlanExt", 2);
		//.and.iTeardownMyAppFrame();
		//Then.onTheMainPage.AllTheErrorsAreDisplayedInStack();
	});
	
	opaTest("Extension Facet: Catching Error for Jira ID, business context, Target Release ", function(Given, When, Then) {

		// Actions
		When.onTheMainPage.iPressOnTheButtonWithId("addPlanExt");
		When.onTheMainPage.iShouldEnterTextInput("TablePlanExt", 0, 1, icheck);
		When.onTheMainPage.iShouldEnterTextInput("TablePlanExt", 0, 6, ibacklogid);

		// Then.onTheMainPage.TheTableShouldHaveExpectedEntries("TablePlanExt2", 0);

	});
	
	opaTest("Extension Facet: Catching Error for Jira ID, business context, Target Release ", function(Given, When, Then) {

		// Actions
		When.onTheMainPage.iPressOnTheButtonWithId("addPlanExt");
		When.onTheOutputPage.iShouldSelectAnItemFromTheDropDown("TablePlanExt");
		
		When.onTheMainPage.iPressOnTheButtonWithText("Save");
		When.onTheMainPage.iPressOnTheButtonWithId("error");

		//Assertions
		//	Then.onTheMainPage.TheTableShouldHaveExpectedEntries("TablePlanExt", 1);
		When.onTheMainPage.iPressOnTheButtonWithTextWithi18n("Cancel");
		When.onTheMainPage.iPressOnTheButtonWithTextWithi18n("Discard")
			.and.iTeardownMyAppFrame();
		// Then.onTheMainPage.TheTableShouldHaveExpectedEntries("TablePlanExt2", 0);

	});

});