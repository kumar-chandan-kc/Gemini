sap.ui.define([
		"sap/ui/test/opaQunit"
	], function (opaTest) {
		"use strict";

		QUnit.module("ListReport");
		
		opaTest("ListReport Page: Opening the app", function(Given, When, Then){
			// Arrangements
			Given.iStartMyApp();
			
			// Actions
			When.onTheListReportPage.iPressOnTheButtonWithId("GeminiSmartTemplate::sap.suite.ui.generic.template.ListReport.view.ListReport::C_SBRBACKUP--listReportFilter-btnGo");
			When.onTheListReportPage.iPressOnTheButtonWithId("GeminiSmartTemplate::sap.suite.ui.generic.template.ListReport.view.ListReport::C_SBRBACKUP--ActionC_SBRBACKUP6button");
			
			When.onTheListReportPage.iPressOnResponsivePopover(0);
			When.onTheListReportPage.iPressOnResponsivePopover(1);
			When.onTheListReportPage.iPressOnResponsivePopover(2);
			When.onTheListReportPage.iPressOnResponsivePopover(3);
			When.onTheListReportPage.iPressOnResponsivePopover(4);
			//Assertions
			//Then.onTheListReportPage.theResponsivePopOverContainsTheCorrectItems();
			Then.onTheListReportPage.iSeeButtonWithText("Assign");
			
		});
		
		opaTest("ListReport Page: Checking Assign(Not Default User)", function(Given, When, Then){
			//Arrangements
			
			When.onTheListReportPage.iShouldSelectAnItemFromTheTable("GeminiSmartTemplate::sap.suite.ui.generic.template.ListReport.view.ListReport::C_SBRBACKUP--responsiveTable", 1);
			When.onTheListReportPage.iPressOnTheButtonWithText("Assign");
			
			Then.onTheListReportPage.iSeeErrorMessagePopover();
		
		});
		
		opaTest("ListReport Page: Checking Assign(cancel on popover)", function(Given, When, Then){
			//Arrangements
			
			When.onTheListReportPage.iShouldSelectAnItemFromTheTable("GeminiSmartTemplate::sap.suite.ui.generic.template.ListReport.view.ListReport::C_SBRBACKUP--responsiveTable", 0);
			When.onTheListReportPage.iPressOnTheButtonWithText("Assign");
			When.onTheListReportPage.iShouldSeeMapToActualsDialogOpen();
			When.onTheListReportPage.iPressOnTheButtonWithText("Cancel");
			
			Then.onTheListReportPage.iSeeButtonWithText("Assign");
		
		});
		
		opaTest("ListReport Page: Checking Assign(Default User)", function(Given, When, Then){
			//Arrangements
			
			When.onTheListReportPage.iShouldSelectAnItemFromTheTable("GeminiSmartTemplate::sap.suite.ui.generic.template.ListReport.view.ListReport::C_SBRBACKUP--responsiveTable", 0);
			When.onTheListReportPage.iPressOnTheButtonWithText("Assign");
			When.onTheListReportPage.iShouldSeeMapToActualsDialogOpen();
			When.onTheListReportPage.iShouldClickOnAllValueHelpsInMapToActualsDialog();
			// When.onTheListReportPage.iPressOnTheButtonWithText("Cancel");
			// debugger;
			When.onTheListReportPage.iShouldSelectValueFromF4Help(1, 8);
			When.onTheListReportPage.iPressOnTheButtonWithText("OK");
			
			Then.onTheListReportPage.iSeeButtonWithText("Assign");
		
		});
		
		opaTest("ListReport Page: Checking Assign(Default User)", function(Given, When, Then){
			//Arrangements
			
			When.onTheListReportPage.iShouldSelectAnItemFromTheTable("GeminiSmartTemplate::sap.suite.ui.generic.template.ListReport.view.ListReport::C_SBRBACKUP--responsiveTable", 0);
			When.onTheListReportPage.iPressOnTheButtonWithText("Assign");
			When.onTheListReportPage.iShouldSeeMapToActualsDialogOpen();
			//When.onTheListReportPage.iShouldClickOnAllValueHelpsInMapToActualsDialog();
			When.onTheListReportPage.iPressOnTheButtonWithText("OK");
			When.onTheListReportPage.iSeeErrorMessagePopover();
			
			Then.onTheListReportPage.iSeeButtonWithText("Assign");
					// and.iTeardownMyAppFrame();
		});
		
		opaTest("ListReport Page: Checking Assign(Default User)", function(Given, When, Then){
			//Arrangements
			
			When.onTheListReportPage.iShouldSelectAnItemFromTheTable("GeminiSmartTemplate::sap.suite.ui.generic.template.ListReport.view.ListReport::C_SBRBACKUP--responsiveTable", 0);
			When.onTheListReportPage.iPressOnTheButtonWithText("Assign");
			When.onTheListReportPage.iShouldSeeMapToActualsDialogOpen();
			When.onTheListReportPage.iShouldClickOnAllValueHelpsInMapToActualsDialog();
			// When.onTheListReportPage.iPressOnTheButtonWithText("Cancel");
			// debugger;
			When.onTheListReportPage.iShouldSelectValueFromF4Help(1, 2);
			When.onTheListReportPage.iPressOnTheButtonWithText("OK");
			
			Then.onTheListReportPage.iSeeErrorMessagePopover().
				and.iTeardownMyAppFrame();
		
		});
		
		// opaTest("ListReport Page: Checking Download functionality)", function(Given, When, Then){
			
		// 	// Arrangements
		// 	Given.iStartMyApp();
			
		// 	When.onTheListReportPage.iPressOnTheButtonWithId("GeminiSmartTemplate::sap.suite.ui.generic.template.ListReport.view.ListReport::C_SBRBACKUP--ActionC_SBRBACKUP1button");
			     
		// 	//Assertions
		// 	Then.onTheListReportPage.iSeeButtonWithText("Assign").
		// 			and.iTeardownMyAppFrame();
		// });
		
		
	
	}
);