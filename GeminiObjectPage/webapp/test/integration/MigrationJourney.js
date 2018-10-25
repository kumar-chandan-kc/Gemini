sap.ui.define([
	"sap/ui/test/opaQunit"

], function(opaTest) {
	"use strict";

	QUnit.module("Migration");
	var icheck = "abcdefghijklmnopqrstuvwxyz12345";
	var ibacklogid = "";
	
	opaTest("Checking Convert to actuals functionality in where a new entry is added to Actuals", function(Given, When, Then) {
		
		// Arrangements
		//    Given.iStartMyApp({
		//          hash: "Bank#Default"
		//       });

		When.onTheMainPage.iPressOnTheButtonWithText("Edit");
		When.onTheMainPage.iPressOnTheButtonWithId("addPlanMigr");
		When.onTheMainPage.iShouldSelectAnItemFromTheDropDownNewChangeType("TablePlanMigrEdit", 0, 0);
		When.onTheMainPage.iShouldEnterTextInput("TablePlanMigrEdit", 0, 1, "ident5");
		When.onTheAPIFacet.iShouldSelectCheckBoxes("TablePlanMigrEdit", 2);
		When.onTheMainPage.iShouldEnterTextInput("TablePlanMigrEdit", 0, 3, "test");
		When.onTheMainPage.iShouldEnterTextInput("TablePlanMigrEdit", 0, 4, "test");
		When.onTheMainPage.iShouldClickOnValueHelp("TablePlanMigrEdit", 0, 5);
		When.onTheMainPage.iShouldSelectValueFromF4Help(0, 0);
		When.onTheMainPage.iShouldSelectAnItemFromTheTable("TablePlanMigrEdit", 0);
		When.onTheMainPage.iPressOnTheButtonWithId("mapPlanMigr");
		When.onTheMainPage.iShouldSeeMapToActualsDialogOpen();
		When.onTheMainPage.iConfirmDeleteAction("OK");
		
		Then.onTheMainPage.TheTableShouldHaveExpectedEntries("TablePlanMigrEdit", 1);

	});

	opaTest("Migration Facet: Checking delete functionality", function(Given, When, Then) {
		// Arrangements             

		//Actions
		When.onTheMainPage.iPressOnTheButtonWithId("addPlanMigr");
		// When.onTheMainPage.iPressOnTheButtonWithId("deleteMigrPlan");
		// When.onTheMainPage.iSeeErrorMessagePopover("Select a valid entry to delete");                      
		When.onTheMainPage.iShouldSelectAnItemFromTheTable("TablePlanMigrEdit", 0);
		When.onTheMainPage.iPressOnTheButtonWithId("deleteMigrPlan");
		When.onTheMainPage.iConfirmDeleteAction("Yes");
		
		Then.onTheMainPage.TheTableShouldHaveExpectedEntries("TablePlanMigrEdit", 1);            
	});

	opaTest("Migration Facet: Mapping planned enrty to actuals", function(Given, When, Then) {
		// Arrangements

		//Actions
		When.onTheMainPage.iPressOnTheButtonWithId("addPlanMigr");
		When.onTheMainPage.iShouldSelectAnItemFromTheDropDownNewChangeType("TablePlanMigrEdit", 0, 0);
		When.onTheMainPage.iShouldEnterTextInput("TablePlanMigrEdit", 0, 1, "ident6");
		When.onTheMainPage.iShouldEnterTextInput("TablePlanMigrEdit", 0, 3, "test");
		When.onTheAPIFacet.iShouldSelectCheckBoxes("TablePlanMigrEdit", 2);
		When.onTheMainPage.iShouldEnterTextInput("TablePlanMigrEdit", 0, 4, "test");
		When.onTheMainPage.iShouldClickOnValueHelp("TablePlanMigrEdit", 0, 5);
		When.onTheMainPage.iShouldSelectValueFromF4Help(0, 0);
		When.onTheMainPage.iShouldSelectAnItemFromTheTable("TablePlanMigrEdit", 0);

		Then.onTheMainPage.TheButtonWithIdEnabled("mapPlanMigr", true);
		Then.onTheMainPage.TheButtonWithIdEnabled("mapPlanMigr", true);

		When.onTheMainPage.iPressOnTheButtonWithId("mapPlanMigr");
		When.onTheMainPage.iShouldSeeMapToActualsDialogOpen();
		// When.onTheMainPage.iShouldClickOnAllValueHelpsInMapToActualsDialog();
		// When.onTheMainPage.iShouldSelectValueFromF4Help(1, 0);
		// When.onTheMainPage.iShouldSelectValueFromF4Help(2, 2);
		When.onTheMainPage.iConfirmDeleteAction("OK");

		Then.onTheMainPage.TheTableShouldHaveExpectedEntries("TablePlanMigrEdit", 2);
	});
	
	opaTest("Migration Facet: creation of entry in Actuals", function(Given, When, Then) {

		//Actions
		When.onTheMainPage.iPressOnTheButtonWithId("migrationActualsAdd");
		When.onTheMainPage.iShouldClickOnValueHelp("tableMigrationActualsEdit", 0, 0);
		When.onTheMainPage.iShouldSelectValueFromF4Help(0, 6);
		When.onTheMainPage.iPressOnTheButtonWithText("Save");

	});

	opaTest("Migration Facet: Deletion of entry in Actuals", function(Given, When, Then) {

		//Actions
		When.onTheMainPage.iPressOnTheButtonWithText("Edit");
		When.onTheMainPage.iRemoveItemFromTheActualsTable("tableMigrationActualsEdit", 3);
		When.onTheMainPage.iConfirmDeleteAction("Yes");
		When.onTheMainPage.iPressOnTheButtonWithText("Save");

	});
	
	opaTest("Migration Facet: Catching Error for Jira ID, Load API, Load API Avl Plan, Trgt Rel for new and Enhc ", function(Given, When, Then) {

		// Actions
		When.onTheMainPage.iPressOnTheButtonWithText("Edit");

		When.onTheMainPage.iPressOnTheButtonWithId("addPlanMigr");
		When.onTheMainPage.iShouldEnterTextInput("TablePlanMigrEdit", 0, 8, ibacklogid);
		
		When.onTheMainPage.iPressOnTheButtonWithId("addPlanMigr");
		When.onTheMainPage.iShouldSelectAnItemFromTheDropDown("TablePlanMigrEdit");
		When.onTheMainPage.iShouldEnterTextInput("TablePlanMigrEdit", 0, 3, icheck);
		When.onTheMainPage.iShouldEnterTextInput("TablePlanMigrEdit", 0, 4, icheck);
		When.onTheMainPage.iShouldEnterTextInput("TablePlanMigrEdit", 0, 8, ibacklogid);
		
	});
	
	opaTest("Migration Facet: Catching Error for Jira ID, Load API, Load API Avl Plan, Trgt Rel for Enhc ", function(Given, When, Then) {

		// Actions

		When.onTheMainPage.iPressOnTheButtonWithId("addPlanMigr");
		When.onTheMainPage.iShouldSelectAnItemFromTheDropDown("TablePlanMigrEdit");
		
		When.onTheMainPage.iPressOnTheButtonWithId("migrationActualsAdd");
		When.onTheMainPage.iPressOnTheButtonWithText("Save");
		When.onTheMainPage.iPressOnTheButtonWithId("error");
		
		When.onTheMainPage.iPressOnTheButtonWithTextWithi18n("Cancel");
		When.onTheMainPage.iPressOnTheButtonWithTextWithi18n("Discard");

		//Then.onTheMainPage.TheTableShouldHaveExpectedEntries("TablePlanMigrDisplay", 0);

	});

});