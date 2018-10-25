sap.ui.define([
                "sap/ui/test/opaQunit"
                
], function(opaTest) {
                "use strict";
 
                QUnit.module("NodeType");
 
                opaTest("NodeType Facet: Creation of new entry in the planning", function(Given, When, Then) {
                				//  Arrangements
                                // Given.iStartMyApp({
                                //                  hash: "Bank#Default"
                                // });
                                // Actions
                                When.onTheMainPage.iPressOnTheButtonWithText("Edit");
 
                                //checking buttons enabled functionality
                                Then.onTheMainPage.TheEntryisEditableInTable("TableNodeDisplay",0,6,true);
                                Then.onTheMainPage.TheEntryisEditableInTable("TableNodeDisplay",0,8,false);
                                
                                When.onTheMainPage.iShouldClickOnValueHelp("TableNodeDisplay", 0, 6);
                                When.onTheMainPage.iShouldSelectValueFromF4Help(0, 0);
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
               
               
 
});