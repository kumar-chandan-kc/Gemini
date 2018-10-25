sap.ui.define([

	"sap/ui/test/opaQunit"
], function(opaTest) {
	"use strict";

	QUnit.module("OutputObject");
	var icheck = "abcdefghijklmnopqrstuvwxyz12345";
	var ibacklogid = "";
	//	var ibacklogid = "CFNDRCBLR3-xyz";

	opaTest("OutputObject Facet: Creation of new entry in the planning", function(Given, When, Then) {
		// Arrangements
		// Given.iStartMyApp({
		// 	hash: "Bank#Default"
		// });

		// Actions
		When.onTheMainPage.iPressOnTheButtonWithText("Edit");

		When.onTheMainPage.iShouldUnSelectCheckBox("isout");
		// When.onTheMainPage.iConfirmDeleteAction("Yes");
		// Then.onTheMainPage.TheButtonWithIdEnabled("addPlanEvents", false);

		When.onTheMainPage.iShouldSelectCheckBox("isout");
		// When.onTheMainPage.iConfirmDeleteAction("Yes");
		// Then.onTheMainPage.TheButtonWithIdEnabled("addPlanEvents", true); 

		//checking buttons enabled functionality
		Then.onTheMainPage.TheButtonWithIdEnabled("deletePlanOut", false);
		Then.onTheMainPage.TheButtonWithIdEnabled("convertPlanOut", false);

		When.onTheMainPage.iPressOnTheButtonWithId("addPlanOut");
		When.onTheOutputPage.iShouldSelectAnItemFromTheDropDown("TablePlanOutEdit");
		//When.onTheMainPage.iShouldEnterTextInput("TablePlanOutEdit", 0, 6, "CFNDRCBLR3-xyz");
		When.onTheMainPage.iShouldClickOnValueHelp("TablePlanOutEdit", 0, 3);
		//When.onTheOutputPage.iShouldSelectValueFromF4Help("TargetReleaseHelp-dialog", 0);
		When.onTheOutputPage.iShouldSelectValueFromF4Help(0, 0);
		When.onTheMainPage.iShouldClickOnValueHelp("TablePlanOutEdit", 0, 2);
		//When.onTheOutputPage.iShouldSelectValueFromF4Help("OutputObjectDialog-dialog", 0);
		When.onTheOutputPage.iShouldSelectValueFromF4Help(0, 0);

		//		When.onTheMainPage.iShouldEnterTextInput("TablePlanOutEdit", 0, 6, "");
		//		When.onTheMainPage.iShouldEnterTextInput("TablePlanOutEdit", 0, 6, "CFNDRCBLR3-119");

		//Assertions
		Then.onTheMainPage.TheTableShouldHaveExpectedEntries("TablePlanOutEdit", 2);

	});

	opaTest("OutputObject Facet: Checking delete functionality", function(Given, When, Then) {
		// Arrangements	
		//Given.iStartMyApp({hash : "Bank#Default"});

		//Actions
		When.onTheMainPage.iPressOnTheButtonWithId("addPlanOut");

		When.onTheMainPage.iShouldSelectAnItemFromTheTable("TablePlanOutEdit", 0);
		When.onTheMainPage.iPressOnTheButtonWithId("deletePlanOut");
		When.onTheMainPage.iConfirmDeleteAction("Yes");

		Then.onTheMainPage.TheTableShouldHaveExpectedEntries("TablePlanOutEdit", 2);
		//.and.iTeardownMyAppFrame();	
	});

	opaTest("OutputObject Facet: Converting planned enrty to actuals", function(Given, When, Then) {
		// Arrangements	
		//Given.iStartMyApp({hash : "Bank#Default"});

		//Actions
		When.onTheMainPage.iShouldSelectAnItemFromTheTable("TablePlanOutEdit", 0);

		Then.onTheMainPage.TheButtonWithIdEnabled("convertPlanOut", true);

		When.onTheMainPage.iPressOnTheButtonWithId("convertPlanOut");
		When.onTheOutputPage.iShouldSeeConvertToActualsDialogOpen();

		When.onTheOutputPage.iShouldClickOnValueHelpsInConvertToActualsDialog();
		//When.onTheOutputPage.iShouldSelectValueFromF4Help(1, 3);
		//When.onTheOutputPage.iShouldClickOnValueHelpsInConvertToActualsDialog("releaseActualOut");
		//When.onTheOutputPage.iShouldSelectValueFromF4Help("TargetReleaseHelp-dialog", 2);
		When.onTheOutputPage.iShouldSelectValueFromF4Help(2, 2);
		When.onTheOutputPage.iShouldSelectValueFromF4Help(1, 3);
		//When.onTheOutputPage.iShouldClickOnValueHelpsInConvertToActualsDialog("releaseActualOut");
		//When.onTheOutputPage.iShouldSelectValueFromF4Help("TargetReleaseHelp-dialog", 2);
		//When.onTheOutputPage.iShouldSelectValueFromF4Help(2, 2);

		When.onTheMainPage.iConfirmDeleteAction("OK");

		Then.onTheOutputPage.TheMappedEntryShouldBeUnEditableInOutput("TablePlanOutEdit", 0);
	});

	opaTest("Output Facet: Checking error messages on save", function(Given, When, Then) {
		// Arrangements	
		//Given.iStartMyApp({hash : "Bank#Default"});

		//Actions
		When.onTheMainPage.iPressOnTheButtonWithId("addPlanOut");
		When.onTheMainPage.iPressOnTheButtonWithText("Save");
		When.onTheMainPage.iPressOnTheButtonWithId("error");

		Then.onTheMainPage.TheTableShouldHaveExpectedEntries("TablePlanOutEdit", 3);
		//Then.onTheMainPage.AllTheErrorsAreDisplayedInStack();
	});

	opaTest("OutputObject Facet: Catching Error for Jira ID, Appl obj, OP obj ", function(Given, When, Then) {

		// Actions
		When.onTheMainPage.iPressOnTheButtonWithId("addPlanOut");
		When.onTheMainPage.iShouldEnterTextInput("TablePlanOutEdit", 0, 1, icheck);
		When.onTheMainPage.iShouldEnterTextInput("TablePlanOutEdit", 0, 2, icheck);
		When.onTheMainPage.iShouldEnterTextInput("TablePlanOutEdit", 0, 6, ibacklogid);

		When.onTheMainPage.iPressOnTheButtonWithId("outadd");

	});

	opaTest("OutputObject Facet: Catching Error for Jira ID, No Appl obj, No OP obj ", function(Given, When, Then) {

		// Actions

		When.onTheMainPage.iPressOnTheButtonWithId("addPlanOut");
		//When.onTheOutputPage.iShouldSelectAnItemFromTheDropDown("TablePlanOutEdit");
		When.onTheMainPage.iShouldEnterTextInput("TablePlanOutEdit", 0, 1, "");
		When.onTheMainPage.iShouldEnterTextInput("TablePlanOutEdit", 0, 2, "");
		When.onTheMainPage.iShouldEnterTextInput("TablePlanOutEdit", 0, 6, ibacklogid);

		When.onTheMainPage.iPressOnTheButtonWithId("outadd");
		When.onTheMainPage.iPressOnTheButtonWithText("Save");
		When.onTheMainPage.iPressOnTheButtonWithId("error");

		When.onTheMainPage.iPressOnTheButtonWithTextWithi18n("Cancel");
		When.onTheMainPage.iPressOnTheButtonWithTextWithi18n("Discard");
		//	Then.onTheMainPage.TheTableShouldHaveExpectedEntries("TablePlanOutDisplay", 1);

	});

});