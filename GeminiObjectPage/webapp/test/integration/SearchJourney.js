sap.ui.define([

	"sap/ui/test/opaQunit"
], function(opaTest) {
	"use strict";

	QUnit.module("Search");
	var icheck = "abcdefghijklmnopqrstuvwxyz12345";
	var ibacklogid = "";
	//	var ibacklogid = "CFNDRCBLR3-xyz";
	opaTest("Search Facet: Creation of new entry in the planning for Enhancement", function(Given, When, Then) {
		// Arrangements
//		Given.iStartMyApp({
//			hash: "Bank#Default"
//		});
		// Actions
		When.onTheMainPage.iPressOnTheButtonWithText("Edit");

		When.onTheMainPage.iShouldUnSelectCheckBox("issearch");
		When.onTheMainPage.iConfirmDeleteAction("Yes");
		Then.onTheMainPage.TheButtonWithIdEnabled("addSearchPlan", false);
		When.onTheMainPage.iShouldSelectCheckBox("issearch");
		When.onTheMainPage.iConfirmDeleteAction("Yes");
		Then.onTheMainPage.TheButtonWithIdEnabled("addSearchPlan", true);
		//checking buttons enabled functionality
		Then.onTheMainPage.TheButtonWithIdEnabled("deleteSearchPlan", false);
		Then.onTheMainPage.TheButtonWithIdEnabled("BtnConvertSearch", false);
		When.onTheMainPage.iPressOnTheButtonWithId("addSearchPlan");
		//	When.onTheMainPage.iShouldEnterTextInput("idTable9", 0, 5, "CFNDRCBLR3-xyz");
		When.onTheMainPage.iShouldSelectAnItemFromTheDropDown("idTable9");
		When.onTheMainPage.iShouldClickOnValueHelp("idTable9", 0, 1);
		When.onTheOutputPage.iShouldSelectValueFromF4HelpSearch("SearchDialog-Dialog", 0, 0);
		When.onTheMainPage.iShouldEnterTextInput("idTable9", 0, 5, "");
		When.onTheMainPage.iShouldClickOnValueHelp("idTable9", 0, 2);
		When.onTheOutputPage.iShouldSelectValueFromF4HelpSearch("TargetReleaseHelp-Dialog", 0, 0);
		//		When.onTheMainPage.iShouldEnterTextInput("idTable9", 0, 5, "CFNDRCBLR3-119");

		When.onTheMainPage.iPressOnTheButtonWithText("Save");
		//Assertions
		Then.onTheMainPage.TheTableShouldHaveExpectedEntries("TablePlanSearchDisplay", 2);

	});
	opaTest("Search Facet: Creation of new entry in the planning for New", function(Given, When, Then) {
		// Arrangements

		// Actions
		When.onTheMainPage.iPressOnTheButtonWithText("Edit");
		When.onTheMainPage.iPressOnTheButtonWithId("addSearchPlan");
		When.onTheMainPage.iShouldSelectAnItemFromTheDropDownNewChangeType("idTable9", 0, 0);
		When.onTheMainPage.iShouldClickOnValueHelp("idTable9", 0, 2);
		When.onTheMainPage.iShouldSelectValueFromF4Help(0, 0);
		When.onTheMainPage.iPressOnTheButtonWithText("Save");

		//Assertions
		Then.onTheMainPage.TheTableShouldHaveExpectedEntries("TablePlanSearchDisplay", 3);

	});
	opaTest("Search Facet: Checking delete functionality for planning", function(Given, When, Then) {
		// Arrangements             

		//Actions
		When.onTheMainPage.iPressOnTheButtonWithText("Edit");
		When.onTheMainPage.iPressOnTheButtonWithId("addSearchPlan");
		When.onTheMainPage.iShouldSelectAnItemFromTheTable("idTable9", 0);
		When.onTheMainPage.iPressOnTheButtonWithId("deleteSearchPlan");
		When.onTheMainPage.iConfirmDeleteAction("Yes");
		Then.onTheMainPage.TheTableShouldHaveExpectedEntries("idTable9", 3);
		//.and.iTeardownMyAppFrame();            
	});
	opaTest("Search Facet: Checking delete functionality (with selection for actuals)", function(Given, When, Then) {
		// Arrangements      

		//Actions
		When.onTheMainPage.iPressOnTheButtonWithId("addSearchActual");
		When.onTheMainPage.iShouldSelectAnItemFromTheTable("Searchactualtable", 0);
		When.onTheMainPage.iPressOnTheButtonWithId("deleteSearchActual");
		When.onTheMainPage.iConfirmDeleteAction("Yes");
		Then.onTheMainPage.TheTableShouldHaveExpectedEntries("Searchactualtable", 0);

	});
	opaTest("Search Facet: Creation of new entry in the actuals", function(Given, When, Then) {
		// Arrangements

		// Actions
		//  When.onTheMainPage.iPressOnTheButtonWithText("Edit");
		When.onTheMainPage.iPressOnTheButtonWithId("addSearchActual");
		//When.onTheMainPage.iShouldEnterTextIntoInput("searchobject","OPASearchObj");  
		When.onTheMainPage.iShouldEnterTextInput("Searchactualtable", 0, 0, "SearchObjOpa");
		When.onTheMainPage.iPressOnTheButtonWithText("Save");

		//Assertions
		Then.onTheMainPage.TheTableShouldHaveExpectedEntries("Searchactualtabledisplay", 1);

	});

	opaTest("Search Facet: Mapping planned enrty to actuals", function(Given, When, Then) {
		// Arrangements             

		//Actions
		When.onTheMainPage.iPressOnTheButtonWithText("Edit");
		When.onTheMainPage.iPressOnTheButtonWithId("addSearchPlan");
		When.onTheMainPage.iShouldSelectAnItemFromTheTable("idTable9", 0);
		When.onTheMainPage.iShouldClickOnValueHelp("idTable9", 0, 2);
		When.onTheMainPage.iShouldSelectValueFromF4Help(0, 0);
		When.onTheMainPage.iPressOnTheButtonWithId("BtnConvertSearch");
		When.onTheMainPage.iShouldSeeMapToActualsDialogOpen();
		When.onTheMainPage.iShouldClickOnAllValueHelpsInMapToActualsDialog();
		When.onTheMainPage.iShouldSelectValueFromF4Help(1, 0);
		When.onTheMainPage.iShouldSelectValueFromF4Help(1, 2);
		When.onTheMainPage.iConfirmDeleteAction("OK");

		Then.onTheMainPage.TheMappedEntryShouldBeUnEditable("idTable9", 0);
	});
	
	opaTest("Search Facet: Catching Error when SrchObjID len, JiraBackLogID len", function(Given, When, Then) {
		
		// Actions

		//checking buttons enabled functionality
		Then.onTheMainPage.TheButtonWithIdEnabled("deleteSearchPlan", false);
		Then.onTheMainPage.TheButtonWithIdEnabled("BtnConvertSearch", false);
		When.onTheMainPage.iPressOnTheButtonWithId("addSearchPlan");
		When.onTheMainPage.iPressOnTheButtonWithId("addSearchPlan");
		When.onTheMainPage.iShouldSelectAnItemFromTheDropDown("idTable9");
		When.onTheMainPage.iShouldEnterTextInput("idTable9", 0, 1, "search_objectPlan120a");
		When.onTheMainPage.iShouldEnterTextInput("idTable9", 0, 5, ibacklogid);

		//Then.onTheMainPage.TheTableShouldHaveExpectedEntries("TablePlanSearchDisplay", 1);

	});

	opaTest("Search Facet: Catching Error when Srch ObjID length is more than 20 in Actuals", function(Given, When, Then) {
		// Arrangements
	
		// Actions
		When.onTheMainPage.iPressOnTheButtonWithId("addSearchActual");
		//  When.onTheMainPage.iShouldSelectAnItemFromTheDropDown("Searchactualtable");
		When.onTheMainPage.iShouldEnterTextInput("Searchactualtable", 0, 0, "search_objectPlan120a");

		//	Then.onTheMainPage.TheTableShouldHaveExpectedEntries("TablePlanSearchDisplay", 1);

	});
	
	opaTest("CDS Facet: Catching Error for Usage Type and View Name ", function(Given, When, Then) {

		// Actions
		When.onTheMainPage.iPressOnTheButtonWithId("CDSadd");	
		When.onTheMainPage.iPressOnTheButtonWithText("Save");
		When.onTheMainPage.iPressOnTheButtonWithId("error");

		//Assertions
		// Then.onTheMainPage.TheTableShouldHaveExpectedEntries("TableActualCDS", 1);
		
		When.onTheMainPage.iPressOnTheButtonWithTextWithi18n("Cancel");
		When.onTheMainPage.iPressOnTheButtonWithTextWithi18n("Discard");

		// Then.onTheMainPage.TheTableShouldHaveExpectedEntries("TableActualCDSnonEdit", 0);

	});

});