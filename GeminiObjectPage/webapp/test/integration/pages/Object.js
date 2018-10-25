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
		onTheObjectPage: {
			baseClass: Common,

			actions: jQuery.extend({

				findButton: function(sText) {
					return this.waitFor({
						viewName: sViewName,
						success: function(oView) {
							Opa5.assert.ok(oView, "View Rendered");
							return this.waitFor({
								controlType: "sap.m.Button",
								viewName: sViewName,
								matchers: new PropertyStrictEquals({
									name: "text",
									value: sText
								}),

								actions: new Press(),
								success: function(oButton) {
									Opa5.assert.ok(oButton, "Button Pressed");
								},
								errorMessage: "Doesn't find the button"
							});
						},
						errorMessage: "Doesn't find the button"
					});
				},

				findButtonWithId: function(sId) {
					return this.waitFor({
						viewName: sViewName,
						success: function(oView) {
							Opa5.assert.ok(oView, "View Rendered");
							return this.waitFor({
								controlType: "sap.m.Button",
								viewName: sViewName,
								id: sId,
								actions: new Press(),
								success: function(oButton) {
									Opa5.assert.ok(oButton, "Button " + sId + " Pressed");
								},
								errorMessage: "Doesn't find the button"
							});
						},
						errorMessage: "Doesn't find the button"
					});
				},

				addEntry: function(sTableId) {
					return this.waitFor({
						id: sTableId,
						viewName: sViewName,
						success: function(oTable) {
					
							return this.waitFor({
								id: oTable.getItems()[0].getAggregation("cells")[5].getId(),
								actions: new sap.ui.test.actions.EnterText({
									text: "1805"
								}),
								success: function() {
									Opa5.assert.ok(true, "Input values entered");
									return this.waitFor({
										id: oTable.getItems()[0].getAggregation("cells")[4].getId(),
										actions: new sap.ui.test.actions.EnterText({
											text: "1805"
										}),
										success: function() {
											Opa5.assert.ok(true, "Input values entered");
											return this.waitFor({
												id: oTable.getItems()[0].getAggregation("cells")[3].getId(),
												actions: new sap.ui.test.actions.EnterText({
													text: "Api"
												}),
												success: function() {
													Opa5.assert.ok(true, "Input values entered");
												}
											});
										}
									});
								}
							});
						},
						errorMessage: "A new entry is not added"
					});

				},

				addMigrationEntry: function(sTableId) {
					this.waitFor({
						viewName: sViewName,
						id: sTableId,
						actions: function(oTable){
							var columns = oTable.getItems()[0].getAggregation("cells");
							oTable.getItems()[0].setSelected(true);
							columns[5].setValue("1805");
							columns[4].setValue("1805");
							columns[3].setValue("API");
							columns[1].setValue("API");
						},
						success: function(oTable) {
							ok(true, "Entered Values");
						},
						errorMessage: "A new entry is not added"
					});
				},

				mapMigrationEntry: function(mapId) {
					return this.waitFor({
						controlType : "sap.m.Button",
						id: mapId,
						viewName: sViewName,
						
						actions: new Press(),
						success: function(oButton){
							ok(oButton, "Map to Migration Objects dialog opens");	
						}
					});
				},
				isShouldSeeConfirmationPopOver: function(sConfirmationMessage) {
					return this.waitFor({
						pollingInterval: 100,
						searchOpenDialogs: true, //mandatory
                        success: function(oDialogs) {
                       	return this.waitFor({
                    		 actions: function(){
                    		 
                    			if (oDialogs[oDialogs.length - 1].$().text() === "Yes") {
                    					oDialogs[0].close();
                            			Opa5.assert.ok(true, "Found OK button inside open dialog! action");
                        		}
                    		 }	
                    	 });
                    
                    },
                    errorMessage: "Did not find either the open dialog or buttons inside an open dialog"
					});
				},
				
				selectMigrationObjectWhileMap: function(tittle){
					return this.waitFor({
						//searchOpenDialogs : true,
						controlType : "sap.m.ViewSettingsDialog",
						viewName: sViewName,
						check: function(aDialogs){
						
							if (aDialogs[0].getTitle() === tittle){
								return true;
							}	
						}
					});
				}

			}, shareOptions.createActions(sViewName)),

			assertions: jQuery.extend({

				isShouldSeeSucessMessagePopOver: function(sSuccessMessage) {
					return this.waitFor({
						pollingInterval: 100,
						//viewName: sViewName,
						// check: function() {
						// 	return sap.ui.test.Opa5.getJQuery()(".sapMMessageBoxError").find(".sapMText").text() === sSuccessMessage;
						// },
						// actions: function(oControl) {
						// 	debugger;
						// 	oControl.close();
						// }
					//	pollingInterval: 10, //optional
                    searchOpenDialogs: true, //mandatory
                    //controlType: "sap.m.Button", //optional
                    
                    success: function(oDialogs) {
                       	return this.waitFor({
                    		 actions: function(){
                    			if (oDialogs[oDialogs.length - 1].$().text() === "Close") {
                    			
                            		oDialogs[0].close();
                            		Opa5.assert.ok(true, "Found OK button inside open dialog! action");
                        		}
                    		 }	
                    	 });
                    
                    },
                    errorMessage: "Did not find either the open dialog or buttons inside an open dialog"
					});
				},
				
				isShouldSeeErrorMessagePopOver: function(sErrorMessage) {
					return this.waitFor({
						// controlType: "sap.m.MessageBox",
						viewName: sViewName,
						matchers: new PropertyStrictEquals({
							name: "title",
							value: "Error"
						}),
						// searchOpenDialogs : true,
						success: function(oControls) {
					
							ok(true, "I see a error popup");
						},
						errorMessage: "Did not find confirmation popup"

					});
				},

				iShouldSeeTheRememberedObject: function() {
					return this.waitFor({
						success: function() {
							var sBindingPath = this.getContext().currentItem.bindingPath;
							this.waitFor({
								id: "page",
								viewName: sViewName,
								matchers: function(oPage) {
									return oPage.getBindingContext() && oPage.getBindingContext().getPath() === sBindingPath;
								},
								success: function(oPage) {
									Opa5.assert.strictEqual(oPage.getBindingContext().getPath(), sBindingPath, "was on the remembered detail page");
								},
								errorMessage: "Remembered object " + sBindingPath + " is not shown"
							});
						}
					});
				},

				iShouldSeeTheObjectViewsBusyIndicator: function() {
					return this.waitFor({
						id: "page",
						viewName: sViewName,
						matchers: function(oPage) {
							return oPage.getBusy();
						},
						success: function(oPage) {
							Opa5.assert.ok(oPage.getBusy(), "The object view is busy");
						},
						errorMessage: "The object view is not busy"
					});
				},

				theViewIsNotBusyAnymore: function() {
					return this.waitFor({
						id: "page",
						viewName: sViewName,
						matchers: function(oPage) {
							return !oPage.getBusy();
						},
						success: function(oPage) {
							Opa5.assert.ok(!oPage.getBusy(), "The object view is not busy");
						},
						errorMessage: "The object view is busy"
					});
				},

				theObjectViewsBusyIndicatorDelayIsZero: function() {
					return this.waitFor({
						id: "page",
						viewName: sViewName,
						success: function(oPage) {
							Opa5.assert.strictEqual(oPage.getBusyIndicatorDelay(), 0, "The object view's busy indicator delay is zero.");
						},
						errorMessage: "The object view's busy indicator delay is not zero."
					});
				},

				theObjectViewsBusyIndicatorDelayIsRestored: function() {
					return this.waitFor({
						id: "page",
						viewName: sViewName,
						matchers: new PropertyStrictEquals({
							name: "busyIndicatorDelay",
							value: 1000
						}),
						success: function() {
							Opa5.assert.ok(true, "The object view's busy indicator delay default is restored.");
						},
						errorMessage: "The object view's busy indicator delay is still zero."
					});
				},

				theShareTileButtonShouldContainTheRememberedObjectName: function() {
					return this.waitFor({
						id: "shareTile",
						viewName: sViewName,
						matchers: function(oButton) {
							var sObjectName = this.getContext().currentItem.name;
							var sTitle = oButton.getTitle();
							return sTitle && sTitle.indexOf(sObjectName) > -1;
						}.bind(this),
						success: function() {
							Opa5.assert.ok(true, "The Save as Tile button contains the object name");
						},
						errorMessage: "The Save as Tile did not contain the object name"
					});
				},
				
				findEditTable: function(sId, noOfItems) {
					return this.waitFor({
						id: sId,
						viewName: sViewName,
						check: function(oTable) {
							if (oTable.getItems().length === noOfItems) {
								return true;
							}
						},
						success: function() {
							Opa5.assert.ok(true, "Table has required number of Items");
						},
						errorMessage: "Table not found"
					});
				}

			}, shareOptions.createAssertions(sViewName))

		}

	});

});