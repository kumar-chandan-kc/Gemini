sap.ui.define([
	
                "sap/ui/test/opaQunit"
], function(opaTest) {
                "use strict";
 
                QUnit.module("Events");
 
                opaTest("Changing SAP Object Representation", function(Given, When, Then) {
                    // Arrangements
//                      Given.iStartMyApp({
//                    	  hash: "Bank#Default"
//                           });

                    When.onTheMainPage.iPressOnTheButtonWithId("edit");
                    Then.onTheMainPage.TheButtonWithIdEnabled("deleteplanEvents", false);
                    Then.onTheMainPage.TheButtonWithIdEnabled("BtnMapEvent", false);
                    When.onTheMainPage.iShouldClickOnValueHelpInput("objectName");
                    When.onTheMainPage.iShouldSelectBORObject();
                    When.onTheMainPage.iPressOnTheButtonWithText("Confirm");
                    
                    
                    // saving and capturing in TR
                    When.onTheMainPage.iPressOnTheButtonWithText("Save");
                    When.onTheMainPage.iShouldSeeMapToActualsDialogOpen();
                    When.onTheMainPage.iConfirmDeleteAction("Confirm");
                    When.onTheMainPage.iConfirmDeleteAction("Close");
                    When.onTheMainPage.iShouldClickOnAllValueHelpsInMapToActualsDialog();
                    When.onTheMainPage.iShouldSelectValueFromF4Help(1, 0);
                    When.onTheMainPage.iConfirmDeleteAction("Confirm");
                    When.onTheMainPage.iConfirmDeleteAction("Yes");
                    Then.onTheMainPage.TheButtonWithIdEnabled("edit", true);

                 
                   
    });

                opaTest("Create an entry in Events Planning", function(Given, When, Then) {
                	
                	When.onTheMainPage.iPressOnTheButtonWithId("edit");
                	When.onTheMainPage.iPressOnTheButtonWithId("addPlanEvents");
                    
                    //Filling the details
                    When.onTheMainPage.iShouldClickOnValueHelp("TablePlanEventsEdit", 0, 2);
                    When.onTheOutputPage.iShouldSelectValueFromF4HelpSearch("EventTaskHelp-Dialog", 0, 1);
                    When.onTheMainPage.iShouldClickOnValueHelp("TablePlanEventsEdit", 0, 3);
                    When.onTheOutputPage.iShouldSelectValueFromF4HelpSearch("EventNodeTypeHelp-Dialog", 1, 1);
                    When.onTheMainPage.iShouldClickOnValueHelp("TablePlanEventsEdit", 0, 4);
                    When.onTheOutputPage.iShouldSelectValueFromF4HelpSearch("TargetReleaseHelp-Dialog", 2, 1);
                    
                    Then.onTheMainPage.TheTableShouldHaveExpectedEntries("TablePlanEventsEdit", 3);
                                
 
                });
                
                opaTest("Mapping Functionality in Events Planning", function(Given, When, Then) {
                	
                	When.onTheMainPage.iShouldSelectAnItemFromTheTable("TablePlanEventsEdit", 0);
                	When.onTheMainPage.iPressOnTheButtonWithId("BtnMapEvent");
                    When.onTheMainPage.iShouldEnterTextIntoInput("eventmappingcomment", "testing");
                    When.onTheMainPage.iConfirmDeleteAction("OK");
                                                   
 
                });
                opaTest("Error Handling in Events Planning", function(Given, When, Then) {
		                	
                	 When.onTheMainPage.iPressOnTheButtonWithId("addPlanEvents");
                     //                            Then.onTheMainPage.TheTableShouldHaveExpectedEntries("TablePlanEventsEdit", 3);
                     When.onTheMainPage.iShouldClickOnValueHelp("TablePlanEventsEdit", 0, 4);
                     When.onTheOutputPage.iShouldSelectValueFromF4HelpSearch("TargetReleaseHelp-Dialog", 3, 1);
                     When.onTheMainPage.iShouldSelectAnItemFromTheTable("TablePlanEventsEdit", 0);
                     When.onTheMainPage.iPressOnTheButtonWithId("BtnMapEvent");
                     When.onTheMainPage.iConfirmDeleteAction("Cancel");
                     When.onTheMainPage.iShouldSelectAnItemFromTheDropDown("TablePlanEventsEdit");
                     When.onTheMainPage.iShouldSelectAnItemFromTheTable("TablePlanEventsEdit", 0);
                     When.onTheMainPage.iPressOnTheButtonWithId("BtnMapEvent");
                     When.onTheMainPage.iConfirmDeleteAction("Cancel");
                     When.onTheMainPage.iConfirmDeleteAction("Close");
                     When.onTheMainPage.iShouldSelectAnItemFromTheTable("TablePlanEventsEdit", 0);
                     When.onTheMainPage.iPressOnTheButtonWithId("deleteplanEvents");
                     When.onTheMainPage.iConfirmDeleteAction("Yes");

                     //checking delete functionality

                     When.onTheMainPage.iPressOnTheButtonWithId("addPlanEvents");
                     Then.onTheMainPage.TheTableShouldHaveExpectedEntries("TablePlanEventsEdit", 4);

                     When.onTheMainPage.iShouldSelectAnItemFromTheTable("TablePlanEventsEdit", 0);
                     When.onTheMainPage.iPressOnTheButtonWithId("deleteplanEvents");
                     When.onTheMainPage.iConfirmDeleteAction("Yes");
                     Then.onTheMainPage.TheTableShouldHaveExpectedEntries("TablePlanEventsEdit", 3);

                     //check error functionality
                     When.onTheMainPage.iPressOnTheButtonWithId("addPlanEvents");
                     When.onTheMainPage.iShouldSelectAnItemFromTheDropDown("TablePlanEventsEdit");
                     When.onTheMainPage.iShouldClickOnValueHelp("TablePlanEventsEdit", 0, 4);
                     When.onTheOutputPage.iShouldSelectValueFromF4HelpSearch("TargetReleaseHelp-Dialog", 4, 1);
                     When.onTheMainPage.iShouldSelectAnItemFromTheTable("TablePlanEventsEdit", 0);
                     When.onTheMainPage.iPressOnTheButtonWithId("BtnMapEvent");
                     When.onTheMainPage.iConfirmDeleteAction("Close");
                     When.onTheMainPage.iPressOnTheButtonWithText("Save");

                     //click on cancel and no of entries should be same as before

             		When.onTheMainPage.iPressOnTheButtonWithTextWithi18n("Cancel");
            		When.onTheMainPage.iPressOnTheButtonWithTextWithi18n("Discard");
                    
		       });
                
               opaTest("Events Actual Facet", function(Given, When, Then) {
			 	
                 When.onTheMainPage.iPressOnTheButtonWithId("edit");
				 When.onTheMainPage.iPressOnTheButtonWithId("eventsadd");
	             When.onTheMainPage.iPressOnTheButtonWithText("Save");
	
	             Then.onTheMainPage.TheTableShouldHaveExpectedEntries("eventsTableOnEdit", 1);
	             When.onTheMainPage.iShouldClickOnValueHelp("eventsTableOnEdit", 0, 0);
	             When.onTheOutputPage.iShouldSelectValueFromF4HelpSearch("EventHelp", 0, 0);
	             When.onTheMainPage.iShouldClickOnValueHelp("eventsTableOnEdit", 0, 1);
	             When.onTheOutputPage.iShouldSelectValueFromF4HelpSearch("EventTaskHelp-Dialog", 1, 1);
	             When.onTheMainPage.iRemoveItemFromTheActualsTable("eventsTableOnEdit", 0);
	             When.onTheMainPage.iConfirmDeleteAction("Yes");
	
	             Then.onTheMainPage.TheTableShouldHaveExpectedEntries("eventsTableOnEdit", 0);
	     		 When.onTheMainPage.iPressOnTheButtonWithTextWithi18n("Cancel");
	    	     When.onTheMainPage.iPressOnTheButtonWithTextWithi18n("Discard");
			                 
			
			 });
                
//          opaTest("Maintaining CDS View and displaying Key fields", function(Given, When, Then) {
//               	              	
//                When.onTheMainPage.iPressOnTheButtonWithId("edit");                  
//                When.onTheMainPage.iShouldClickOnValueHelpInputBlock("sInputCDSObject", "HeaderBlockLeft");
//                When.onTheOutputPage.iShouldSelectValueFromF4HelpSearch("CDSDialog", 0, 0);
//                    
//                When.onTheMainPage.iPressOnTheButtonWithId("AddCDSKeyFields");
//                Then.onTheMainPage.TheButtonWithIdEnabled("AddCDSKeyFields", false);
//                    
//                Then.onTheOutputPage.TheCellShouldHaveExpectedEntry("idCDSKeyFieldsTable",0,0,"Businesssubscriber");
//                Then.onTheOutputPage.TheCellShouldHaveExpectedEntry("idCDSKeyFieldsTable",0,1, "");
//                    
//                    
//       	      When.onTheMainPage.iPressOnTheButtonWithTextWithi18n("Cancel");
//    	          When.onTheMainPage.iPressOnTheButtonWithTextWithi18n("Discard");
//           });
               
});