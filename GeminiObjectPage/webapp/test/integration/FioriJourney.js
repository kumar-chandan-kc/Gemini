sap.ui.define([
	"sap/ui/test/opaQunit"

], function(opaTest) {
	"use strict";

	QUnit.module("Fiori App");

	opaTest("Fiori Facet: Checking display and addition functionality", function(Given, When, Then) {
		// Arrangements
//		 Given.iStartMyApp({
//				          hash: "Bank#Default"
//				       });
		//Actions
		When.onTheMainPage.iPressOnTheButtonWithText("Edit");
		When.onTheMainPage.iPressOnTheButtonWithId("addFioriApp");
		When.onTheMainPage.iShouldSeeMapToActualsDialogOpen();
		When.onTheMainPage.iShouldSelectValueFromF4Help(0, 5);
		
		When.onTheMainPage.iRemoveItemFromTheActualsTable("TableFioriEdit", 1);	
		When.onTheMainPage.iConfirmDeleteAction("Yes");
		When.onTheMainPage.iRemoveItemFromTheActualsTable("TableFioriEdit", 1);	
		When.onTheMainPage.iConfirmDeleteAction("Yes");
		
		When.onTheMainPage.iPressOnTheButtonWithId("addFioriApp");
		When.onTheMainPage.iShouldSeeMapToActualsDialogOpen();
		When.onTheMainPage.iShouldSelectValueFromF4Help(0, 3);
		
		When.onTheMainPage.iPressOnTheButtonWithText("Save");

		Then.onTheMainPage.TheTableShouldHaveExpectedEntries("TableFioriDisplay", 2);
	});
	
	

});