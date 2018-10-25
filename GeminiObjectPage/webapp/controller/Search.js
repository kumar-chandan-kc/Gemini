/*global s4:true*/
      jQuery.sap.declare("s4.cfnd.geminiobjectpage.controller.Search");
      sap.ui.define(["sap/m/MessageBox", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"], function(MessageBox, Filter, FilterOperator) {
      	"use strict";
      	
      	s4.cfnd.geminiobjectpage.controller.Search =
 
      		{
      			onSearchPlanAdd: function() {
      				var oModel = this.getView().getModel("Gemini");
      				var oObject = {

      					search_id: "40f2e9af-be89-2ee7-abb0-00b7d3146c58",
      					sap_bo_type: this.objId,
      					area: "testarea",
      					search_object: "",
      					search_object_type: "",
      					target_release: "",
      					description: "",
      					status: "",
      					change_type: "New",
      					tool_tip: "",
      					status_colour: "",
      					status_icon: "",
      					ident_mapping: "",
      					actual_release: "",
      					jira_backlog: "",
      					jira_backlog_link: "",
      					jira_valid: '1'
      				};
      				var searchPlan = oModel.getProperty("/search");
      				searchPlan.unshift(oObject);

      				var actualRelease = this.getView().byId("searchplan_actualrel");
      				var actualReleaseInputCol = this.getView().byId("idTable9").indexOfColumn(actualRelease);
      				this.handleValueState(["idTable9"], [
      					[actualReleaseInputCol]
      				]);
      				oModel.refresh(true);
      				this.getView().byId("idTable9").removeSelections();
      			},
      			onSearchTableSelect: function(oEvent) {
      				var selectedItem = this.getView().byId("idTable9").getSelectedItem();
      				var index = this.getView().byId("idTable9").indexOfItem(selectedItem);
      				var oModel = this.getView().getModel("Gemini");

      				var aSearchPlan = oModel.getData().search;
      				if (aSearchPlan[index].ident_mapping !== "") {
      					this.getView().byId("deleteSearchPlan").setEnabled(false);
      					this.getView().byId("BtnConvertSearch").setEnabled(false);
      					this.getView().byId("deleteSearchPlan").setTooltip("Object already converted, cannot delete");
      					this.getView().byId("BtnConvertSearch").setTooltip("Object already converted");
      				} else {
      					this.getView().byId("deleteSearchPlan").setEnabled(true);
      					this.getView().byId("BtnConvertSearch").setEnabled(true);
      					this.getView().byId("deleteSearchPlan").setTooltip('');
      					this.getView().byId("BtnConvertSearch").setTooltip('');

      				}
      			},
      			fnDisplayButton: function(thisObj) {
      				thisObj.getView().byId("idTable9").removeSelections();
      				if ((thisObj.getView().byId("idTable9").getSelectedItem() === null)) {
      					thisObj.getView().byId("deleteSearchPlan").setEnabled(false);
      					thisObj.getView().byId("BtnConvertSearch").setEnabled(false);

      					thisObj.getView().byId("deleteSearchPlan").setTooltip("Select entry to delete");
      					thisObj.getView().byId("BtnConvertSearch").setTooltip("Select entry to Convert");

      				}
      			},
      			fnDisplayButtonActual: function(thisObj) {
      				thisObj.getView().byId("Searchactualtable").removeSelections();
      				if ((thisObj.getView().byId("Searchactualtable").getSelectedItem() === null)) {
      					thisObj.getView().byId("deleteSearchActual").setEnabled(false);
      					thisObj.getView().byId("deleteSearchActual").setTooltip("Select entry to delete");

      				}

      			},
      			onSearchActualAdd: function() {
      				var oModel = this.getView().getModel("search");
      				var oObject = {

      					sap_bo_type: this.objId,
      					search_object: "",
      					edit: '1'
      				};
      				var searchActual = oModel.getProperty("/searchactual");
      				//            var prevlength = searchActual.length;
      				searchActual.unshift(oObject);
      				oModel.refresh(true);
      				this.getView().byId("Searchactualtable").removeSelections();
      				// var searchactualtable = this.getView().byId("Searchactualtable");
      				// var test = searchactualtable.getAggregation("items");
      				// // console.log(test[0].getAggregation("cells")[2].getValue());

      				// for (var i = prevlength; i < searchActual.length; i++) {
      				//            for (var j = 0; j < 1; j++) {
      				//                            test[i].getAggregation("cells")[j].setEditable(true);
      				//            }
      				// }
      			},
      			searchActualTableSelect: function(oEvent) {
      				var selectedItem = this.getView().byId("Searchactualtable").getSelectedItem();
      				var oBundle = this.getView().getModel("i18n").getResourceBundle();
      				var nIndex = this.getView().byId("Searchactualtable").indexOfItem(selectedItem);
      				var searchplanned = this.getView().getModel("Gemini").getProperty("/search");
      				var searchactualarray = this.getView().getModel("search").getProperty("/searchactual");
      				if (searchactualarray[nIndex].search_object !== "") {
      					for (var x = 0; x < searchplanned.length; x++) {
      						if (searchplanned[x].ident_mapping === searchactualarray[nIndex].search_object) {
      							var plannedcheck = 1;
      							break;
      						}
      					}
      				}
      				if (plannedcheck === 1) {
      					this.getView().byId("deleteSearchActual").setEnabled(false);

      					this.getView().byId("deleteSearchActual").setTooltip(oBundle.getText("objectAlreadyMapErrorMessage"));
      				} else {
      					this.getView().byId("deleteSearchActual").setEnabled(true);
      					this.getView().byId("deleteSearchActual").setTooltip('');

      				}
      			},
      			deleteSearchPlanItems: function(oEvent) {
      				var table = this.getView().byId("idTable9");
      				var items = table.getAggregation("items");
      				var oBundle = this.getView().getModel("i18n").getResourceBundle();
      				var selecteditem = table.getSelectedItem();
      				// var selecteditemcells = selecteditem.getAggregation("cells");
      				//            try {
      				if (selecteditem !== null) {
      					var i = selecteditem.getId().split("idTable9-")[1];
      					var oModel = this.getView().getModel("Gemini");
      					var searchPlan = oModel.getProperty("/search");
      					if (searchPlan[i].actual_release === "") {
      						var deleteConfirmationMessage = oBundle.getText("deleteConfirmationMessage");
      						MessageBox.confirm(
      								deleteConfirmationMessage, {
      								actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
      								//            styleClass: bCompact ? "sapUiSizeCompact" : "",
      								onClose: function(sAction) {
      									if (sAction === "YES") {

      										var compareobject = JSON.stringify(searchPlan[i]);
      										searchPlan.splice(i, 1);
      										oModel.refresh();
      										s4.cfnd.geminiobjectpage.controller.Search.fnDisplayButton(this);
      										var actualRelease = this.getView().byId("searchplan_actualrel");
      										var actualReleaseInputCol = this.getView().byId("idTable9").indexOfColumn(actualRelease);
      										this.handleValueState(["idTable9"], [
      											[actualReleaseInputCol]
      										]);

      										//to check whether the object which has been deleted was actually present in database by going through the copy array.
      										for (var x = 0; x < this.searchcopy.length; x++) {
      											if (JSON.stringify(this.searchcopy[x]) === compareobject) {
      												this.searchdeleteindex = this.searchdeleteindex + x + "delimiter";
      												break;
      											}
      										}
      									}
      								}.bind(this)
      							}
      						);

      					} else {
      						
      						MessageBox.error(oBundle.getText("alreadyConvertedDeleteMessage"));
      						
      							
      					}

      					// var x4 = this.byId("idTable9").getItems();
      					// for (var j = 0; j < x4.length; j++) {

      					//            if (x4[j].getAggregation("cells")[3].getValue() !== "") // Checking if Actual Release Coloumn is Empty - Not Mapped
      					//            {
      					//                            x4[j].getAggregation("cells")[0].setEditable(false);
      					//                            //            x4[i].getAggregation("cells")[5].setEditable(false);
      					//                            x4[j].getAggregation("cells")[1].setEditable(false);
      					//                            x4[j].getAggregation("cells")[2].setEditable(false);
      					//                            x4[j].getAggregation("cells")[4].setEditable(false);
      					//            }

      					// }
      				} else {
      					// } catch (err) {
      					//            var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
      					MessageBox.error(oBundle.getText("deleteErrorMessage"));
      						
      						
      				}

      				// table.removeItem(parseInt(i));

      			},
      			onSearchActualDelete: function(oEvent) {
      				var oBundle = this.getView().getModel("i18n").getResourceBundle();
      				if (this.getView().byId("Searchactualtable").getSelectedItem()) {
      					var oTable = this.getView().byId("Searchactualtable");
      					var oItem = oTable.getSelectedItem();
      					var nIndex = oTable.indexOfItem(oItem);
      					var plannedcheck = 0;
      					var searchplanned = this.getView().getModel("Gemini").getProperty("/search");
      					var searchactualarray = this.getView().getModel("search").getProperty("/searchactual");
      					if (searchactualarray[nIndex].search_object !== "") {
      						for (var x = 0; x < searchplanned.length; x++) {
      							if (searchplanned[x].ident_mapping === searchactualarray[nIndex].search_object) {
      								plannedcheck = 1;
      								break;
      							}
      						}
      					}
      					if (plannedcheck !== 1) {
      						var deleteConfirmationMessage = oBundle.getText("deleteConfirmationMessage");

      						MessageBox.confirm(
      								deleteConfirmationMessage, {
      								actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
      								//            styleClass: bCompact ? "sapUiSizeCompact" : "",
      								onClose: function(sAction) {
      									if (sAction === "YES") {

      										var compareobject = JSON.stringify(searchactualarray[nIndex]);
      										//to check whether the object which has been deleted was actually present in database by going through the copy array.
      										for (var x = 0; x < this.searchactualcopy.length; x++) {
      											if (JSON.stringify(this.searchactualcopy[x]) === compareobject) {
      												this.searchactualdeleteindex = this.searchactualdeleteindex + x + "delimiter";
      												break;
      											}
      										}
      										this.getView().getModel("search").getProperty("/searchactual").splice(nIndex, 1);
      										this.getView().getModel("search").refresh();
      										var searchItems = oTable.getItems();
      										var searchobjactual = this.getView().byId("searchObjectActual");
      										var searchobjactualInputCol = this.getView().byId("Searchactualtable").indexOfColumn(searchobjactual);
      										for (var index = 0; index < searchItems.length; index++) {
      											searchItems[index].getAggregation("cells")[searchobjactualInputCol].setValueState("None");
      											searchItems[index].getAggregation("cells")[searchobjactualInputCol].setValueStateText("");
      										}
      										s4.cfnd.geminiobjectpage.controller.Search.fnDisplayButtonActual(this);
      									}
      								}.bind(this)
      							}
      						);

      					} else {
      						//            var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
      						MessageBox.error(oBundle.getText("alreadyConvertedDeleteMessage"));
      							
      			
      					}
      				} else {
      					// sap.m.MessageToast.show("No item selected");
      					//            var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
      					MessageBox.error(oBundle.getText("deleteErrorMessage"));
      						
      				}

      			},
      			searchjirachange: function(oEvent) {
                    var searchPlanRow = oEvent.getParameter("id").split("idTable9-").pop();
                           var oModel = this.getView().getModel("Gemini");
                           var aModelData = oModel.getData().search;
                           var searchPlanRowText = aModelData[searchPlanRow].jira_backlog;
                    if (oEvent.getId() === "liveChange") {
                           aModelData[searchPlanRow].jira_valid = '2';
                    } else {
                           if (searchPlanRowText === "") {
                                  aModelData[searchPlanRow].jira_valid = '1';

                           } else {
                                  s4.cfnd.geminiobjectpage.controller.Events.fnJiraCheck(searchPlanRowText,aModelData,oModel,this,"idTable9", "jirasearch");
                           }
                    }

             },
      			onBtnConvertSearch: function(oEvent) {
      				try {
      					// get the table in the view
      					var table = this.getView().byId("idTable9");
      					var oBundle = this.getView().getModel("i18n").getResourceBundle();
      					//            var aItems = table.getItems();
      					//get selected item
      					var selecteditem = table.getSelectedItem();
      					//get the index of the selected item.
      					var i = selecteditem.getId().split("idTable9-")[1];
      					var searchplanned = this.getView().getModel("Gemini").getProperty("/search");
      					if (searchplanned[i].target_release.trim() === "") {
      						
      						MessageBox.error(oBundle.getText("targetReleaseMissing"));
      							
      					
      					} 
      					else if (searchplanned[i].search_object.trim() === "" && searchplanned[i].change_type === "Enhancement") {
      						//            var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
      						MessageBox.error(oBundle.getText("searchObjmissing"));
      							
      					} else {
      						if (searchplanned[i].ident_mapping === "") {
      							if (!this._oDialogSearchMapping) {
      								this._oDialogSearchMapping = sap.ui.xmlfragment("s4.cfnd.geminiobjectpage.view.SearchConvertToActuals", this);
      							}
      							// toggle compact style
      							this.getView().addDependent(this._oDialogSearchMapping);
      							jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogSearchMapping);
      							var that = this;
      							sap.ui.getCore().byId("SearchSapBOType").setValue(that.getView().getModel("Gemini").getProperty("/search")[parseInt(i, 0)].sap_bo_type);

      							if (searchplanned[i].change_type === "New") {
      								sap.ui.getCore().byId("Search_Obj").setShowValueHelp(true);
      							} else {
      								sap.ui.getCore().byId("Search_Obj").setShowValueHelp(false);
      								sap.ui.getCore().byId("Search_Obj").setValue(that.getView().getModel("Gemini").getProperty("/search")[parseInt(i, 0)].search_object);
      								sap.ui.getCore().byId("Search_Obj").setEditable(false);
      							}
      							this._oDialogSearchMapping.open();
      							// sap.ui.getCore().byId("ActualReleaseEvents1").setValue("1802");

      							// creating the string for converting         
      							// this.convertindexsearch = this.convertindexsearch + i + "delimiter";
      							// searchplanned[i].status_colour = "Green";
      							// searchplanned[i].tool_tip = "Object Already Mapped";
      							// searchplanned[i].status_icon = "sap-icon://color-fill";
      							// //setting the row selected as uneditable
      							// for (var x = 0; x < 6; x++) {
      							//                 table.getAggregation("items")[i].getAggregation("cells")[x].setEditable(false);
      							// }
      							// var searchplanned = this.getView().getModel("Gemini").getProperty("/search");
      							// var searchactual = {
      							//            "sap_bo_type": searchplanned[parseInt(i)].sap_bo_type,
      							//            "search_object": searchplanned[parseInt(i)].search_object
      							// };
      							// var searchactualarray = this.getView().getModel("search").getProperty("/searchactual");
      							// var flagcheckduplicate = 0;
      							// for (var x = 0; x < searchactualarray.length; x++) {
      							//            if (searchactual.search_object === searchactualarray[x].search_object) {
      							//                            flagcheckduplicate = 1;;
      							//                            break;
      							//            }
      							// }
      							// if (flagcheckduplicate === 0) {
      							//            searchactualarray.push(searchactual);
      							// }
      							sap.ui.getCore().byId("ActualReleaseSearch").setValue(this.final);
      						} else {
      							//            var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
      							MessageBox.error(oBundle.getText("objectAlreadyMapErrorMessage"));
      						
      						}

      					}
      				} catch (error) {
      					//            var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
      					MessageBox.error(oBundle.getText("alreadyMappedErrorMessage"));
      						
      				}

      			},
      			handleSearchConvertConfirm: function(oEvent) {
      				var y = sap.ui.getCore().byId("Search_Obj").getValue();
      			
      				if (y === "") {
      					
      					MessageBox.error(oBundle.getText("alreadyMappedErrorMessage"));
      						
      				
      				} else {
      					var table = this.getView().byId("idTable9");
      					var oBundle = this.getView().getModel("i18n").getResourceBundle();
      					//get selected item
      					var selecteditem = table.getSelectedItem();
      					//get the index of the selected item.
      					var i = selecteditem.getId().split("idTable9-")[1];
      					var searchplanned = this.getView().getModel("Gemini").getProperty("/search");
      					this.convertindexsearch = this.convertindexsearch + i + "delimiter";
      					//            searchplanned[i].ident_mapping = "converted";
      					searchplanned[i].ident_mapping = sap.ui.getCore().byId("Search_Obj").getValue();
      					searchplanned[i].status_colour = "Green";
      					searchplanned[i].tool_tip = oBundle.getText("objectAlreadyMapErrorMessage");
      					searchplanned[i].status_icon = "sap-icon://border";
      					//setting the row selected as uneditable
      					// for (var x = 0; x < 6; x++) {
      					//            if (searchplanned[i].actual_release != ' ') {
      					//                            table.getAggregation("items")[i].getAggregation("cells")[x].setEditable(false);

      					//            }

      					// }

      					var searchactual = {
      						"sap_bo_type": searchplanned[parseInt(i)].sap_bo_type,
      						"search_object": sap.ui.getCore().byId("Search_Obj").getValue()
      					};
      					var searchactualarray = this.getView().getModel("search").getProperty("/searchactual");
      					var flagcheckduplicate = 0;
      					for (var x = 0; x < searchactualarray.length; x++) {
      						if (searchactual.search_object === searchactualarray[x].search_object) {
      							flagcheckduplicate = 1;
      							break;
      						}
      					}
      					if (flagcheckduplicate === 0) {
      						searchactualarray.push(searchactual);
      					}
      					var x = sap.ui.getCore().byId("ActualReleaseSearch").getValue();
      					// get the table in the view
      					var table = this.getView().byId("idTable9");
      					//get selected item
      					var selecteditem = table.getSelectedItem();
      					//get the index of the selected item.
      					var i = selecteditem.getId().split("idTable9-")[1];
      					sap.ui.getCore().byId("Search_Obj").setValue("");
      					sap.ui.getCore().byId("ActualReleaseSearch").setValue();
      					// this.getView().getModel("search").getProperty("/searchactual")[parseInt(i)].actual_release = x;
      					this.getView().byId("idTable9").getAggregation("items")[parseInt(i)].getAggregation("cells")[3].setText(x);
      					this.getView().getModel("search").refresh();
      					sap.m.MessageToast.show("Object converted");
      					s4.cfnd.geminiobjectpage.controller.Search.fnDisplayButton(this);
      				}
      			},
      			searchcancelhandle: function(thisObj) {
      				thisObj.getView().byId("TablePlanSearchDisplay").setVisible(true);
      				thisObj.getView().byId("idTable9").setVisible(false);
      				thisObj.getView().byId("Searchactualtabledisplay").setVisible(true);
      				thisObj.getView().byId("Searchactualtable").setVisible(false);
      				//            this.getView().byId("jirasearch").setVisible(false);
      				//            this.getView().byId("jiralinksearch").setVisible(true);
      				var oModel = thisObj.getView().getModel("Gemini");
      				var oModelactual = thisObj.getView().getModel("search");
      				//to get back deleted items if without saving an item has been deleted
      				thisObj.searchdeleteindex = "";
      				thisObj.convertindexsearch = "";
      				thisObj.searchactualdeleteindex = "";
      				//end of delete cancel handling
      				thisObj.getView().byId("addSearchPlan").setVisible(false);
      				thisObj.getView().byId("deleteSearchPlan").setVisible(false);
      				thisObj.getView().byId("BtnConvertSearch").setVisible(false);
      				thisObj.getView().byId("deleteSearchActual").setVisible(false);
      				thisObj.getView().byId("addSearchActual").setVisible(false);
      				thisObj.getView().byId("idTable9").setMode(sap.m.ListMode.none);
      				thisObj.getView().byId("Searchactualtable").setMode(sap.m.ListMode.none);

      				//resetting model to original state by taking values from the copy
      				oModel.getData().search = $.extend(true, [], thisObj.searchcopy);
      				oModel.refresh();

      				oModelactual.getData().searchactual = $.extend(true, [], thisObj.searchactualcopy);
      				oModelactual.refresh();

//      				thisObj.getView().getModel("search").getData().searchactual = $.extend(true, [], this.searchactualcopy);
//      				thisObj.getView().getModel("search").refresh();

      				//setting everything uneditable
      				// var searchtable = this.getView().byId("idTable9");
      				// var test = searchtable.getAggregation("items");
      				// for (var i = 0; i < test.length; i++) {
      				//            for (var j = 0; j < 5; j++) {
      				//                            if (j !== 3) {
      				//                                            test[i].getAggregation("cells")[j].setEditable(false);
      				//                            }
      				//            }
      				// }

//      				var searchactualtable = thisObj.getView().byId("Searchactualtable");
//      				var testactual = searchactualtable.getAggregation("items");
//      				for (var i = 0; i < testactual.length; i++) {
//      					for (var j = 0; j < 1; j++) {
//
//      						testactual[i].getAggregation("cells")[j].setEditable(false);
//
//      					}
//      				}
      			},
      			handlesearchconvert: function(thisObj) {
      				//getting the planned table          
      				var searchplanned = thisObj.getView().getModel("Gemini").getProperty("/search");
      				var searchactualarray = thisObj.getView().getModel("search").getProperty("/searchactual");
      				var proceedcheck = 0;

      				var arraysearchconvert = thisObj.convertindexsearch.split("delimiter");
      				var oBundle = thisObj.getView().getModel("i18n").getResourceBundle();

      				for (var x = 0; x < arraysearchconvert.length - 1; x++) {

      					//creating structure of actual entity set for insertion         
      					var searchactual = {
      						"sap_bo_type": searchplanned[parseInt(arraysearchconvert[x], 10)].sap_bo_type,
      						//            "search_object": searchplanned[parseInt(arraysearchconvert[x])].search_object
      						"search_object": searchplanned[parseInt(arraysearchconvert[x], 10)].ident_mapping
      					};

      					thisObj.oModel.update("/I_SBRSEARCHPLAN(guid'" + searchplanned[parseInt(arraysearchconvert[x], 10)].search_id + "')",
      						searchplanned[
      							parseInt(arraysearchconvert[x], 10)], {
      							groupId: thisObj.sDeferredGroup,
      							success: function() {
      								// console.log("Success");

      							},
      							error: function() {
      								// console.log("Error");
      							}
      						});
      					//            searchplanned[parseInt(arraysearchconvert[x], 10)].ident_mapping = "converted";
      					searchplanned[parseInt(arraysearchconvert[x], 10)].status_colour = "Green";
      					searchplanned[parseInt(arraysearchconvert[x], 10)].tool_tip = oBundle.getText("objectAlreadyMapErrorMessage");
      					searchplanned[parseInt(arraysearchconvert[x], 10)].status_icon = "sap-icon://border";

      					thisObj.getView().getModel("Gemini").refresh();

      					for (var z = 0; z < this.searchconvertlength; z++) {
      						if (searchactualarray[z].sap_bo_type === searchactual.sap_bo_type && searchactualarray[z].search_object === searchactual.search_object) {
      							proceedcheck = 1;
      							break;
      						}
      					}
      					if (proceedcheck !== 1) {
      						// this is the code to create an entry into the actual backend table
      						thisObj.oModel.create("/I_SBRSEARCHACTUAL", searchactual, {
      							groupId: thisObj.sDeferredGroup,
      							success: function(oResponse) {

      								// searchPlan[i].search_id = oResponse.search_id;
      								//this is to insert into search actual array and refresh the model
      								// var searchactualinsertarray = this.getView().getModel("search").getProperty("/searchactual");
      								// searchactualarray.push(searchactual);

      							}.bind(thisObj),
      							error: function() {

      							}

      						});

      					}

      				}

      				//refreshing the model   for actuals(search)                          
      				thisObj.getView().getModel("search").refresh();
      				thisObj.convertindexsearch = "";
      				thisObj.searchconvertlength = thisObj.getView().getModel("search").getProperty("/searchactual").length;

      			},
      			searchPlanChangeMode: function(oEvent, nMode) {
      				var bMode;
      				if (nMode === 2) {
      					bMode = true;
      				} else if (nMode === 0 || nMode === 1) {
      					bMode = false;
      				}
      				oEvent.getView().byId("addSearchPlan").setVisible(bMode);
      				oEvent.getView().byId("deleteSearchPlan").setVisible(bMode);
      				oEvent.getView().byId("BtnConvertSearch").setVisible(bMode);
      				oEvent.getView().byId("idTable9").setVisible(bMode);
      				oEvent.getView().byId("TablePlanSearchDisplay").setVisible(!bMode);

      				if (bMode) {
//      					oEvent.searchdeleteindex = "";
//      					oEvent.searchcopy = $.extend(true, [], oEvent.getView().getModel("Gemini").getData().search);

      				} else {

      					if (nMode === 1) {
      						oEvent.oTable.setProperty("/search", oEvent.searchcopy);
      						oEvent.getView().getModel("Gemini").refresh(true);
      						oEvent.getView().byId("idTable9").getModel().refresh(true);
      					}

      					oEvent.searchdeleteindex = "";
      				}
      			},
      			searchActualChangeMode: function(oEvent, nMode) {
      				var bMode;
      				if (nMode === 2) {
      					bMode = true;
      				} else if (nMode === 0 || nMode === 1) {
      					bMode = false;
      				}
      				oEvent.getView().byId("addSearchActual").setVisible(bMode);
      				oEvent.getView().byId("deleteSearchActual").setVisible(bMode);
      				oEvent.getView().byId("Searchactualtable").setVisible(bMode);
      				oEvent.getView().byId("Searchactualtabledisplay").setVisible(!bMode);

      				if (bMode) {
//      					oEvent.searchactualdeleteindex = "";
//      					oEvent.searchactualcopy = $.extend(true, [], oEvent.getView().getModel("search").getData().searchactual);

      				} else {

      					if (nMode === 1) {
      						oEvent.oTable.setProperty("/searchactual", oEvent.searchactualcopy);
      						oEvent.getView().getModel("search").refresh(true);
      						oEvent.getView().byId("Searchactualtable").getModel().refresh(true);
      					}

      					oEvent.searchactualdeleteindex = "";
      				}
      			},
      			onSearchApplicable: function(oEvent) {
      				var that = this;
      				if (this.getView().byId("issearch").getSelected()) {
      					MessageBox.confirm(
      						"Do you want to enable Search Objects for " + that.sObj + "?", {
      							actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
      							onClose: function(sAction) {
      								if (sAction === "YES") {
      									s4.cfnd.geminiobjectpage.controller.Search.searchPlanChangeMode(that, 2);
      									s4.cfnd.geminiobjectpage.controller.Search.searchActualChangeMode(that, 2);
      									that.getView().byId("addSearchPlan").setEnabled(true);
      									that.getView().byId("addSearchActual").setEnabled(true);
      									that.getView().byId("idTable9").setMode(sap.m.ListMode.SingleSelectLeft);
      								} else {
      									that.getView().byId("issearch").setSelected(false);
      								}
      							}
      						});
      				} else {
      					MessageBox.confirm(
      						"Do you want to disable Search Objects for " + that.sObj + "?", {
      							actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
      							onClose: function(sAction) {
      								if (sAction === "YES") {
      									s4.cfnd.geminiobjectpage.controller.Search.searchPlanChangeMode(that, 1);
      									s4.cfnd.geminiobjectpage.controller.Search.searchActualChangeMode(that, 1);
      									that.getView().byId("addSearchPlan").setVisible(true);
      									that.getView().byId("deleteSearchPlan").setVisible(true);
      									that.getView().byId("BtnConvertSearch").setVisible(true);
      									that.getView().byId("addSearchPlan").setEnabled(false);
      									that.getView().byId("deleteSearchPlan").setEnabled(false);
      									that.getView().byId("BtnConvertSearch").setEnabled(false);
      									that.getView().byId("addSearchActual").setVisible(true);
      									that.getView().byId("deleteSearchActual").setVisible(true);
      									that.getView().byId("addSearchActual").setEnabled(false);
      									that.getView().byId("deleteSearchActual").setEnabled(false);
      								} else {
      									that.getView().byId("issearch").setSelected(true);
      								}
      							}
      						});

      				}

      			},
      			handlesearchedit: function(thisObj) {
      				if (thisObj.getView().byId("issearch").getSelected()) {
      					thisObj.getView().byId("TablePlanSearchDisplay").setVisible(false);
      					thisObj.getView().byId("idTable9").setVisible(true);
      					thisObj.getView().byId("Searchactualtabledisplay").setVisible(false);
      					thisObj.getView().byId("Searchactualtable").setVisible(true);
      					//enabling buttons for edit operations
      					if (thisObj.getView().byId("issearch").getSelected()) {
      						thisObj.getView().byId("addSearchPlan").setVisible(true);
      						thisObj.getView().byId("deleteSearchPlan").setVisible(true);
      						thisObj.getView().byId("BtnConvertSearch").setVisible(true);
      						thisObj.getView().byId("deleteSearchActual").setVisible(true);
      						thisObj.getView().byId("addSearchActual").setVisible(true);
      					}
      					//            this.getView().byId("jirasearch").setVisible(true);
      					//            this.getView().byId("jiralinksearch").setVisible(false);
      					var searchtable = thisObj.getView().byId("idTable9");
      					var test = searchtable.getAggregation("items");
      					thisObj.getView().byId("idTable9").setMode(sap.m.ListMode.SingleSelectLeft);
      					thisObj.getView().byId("Searchactualtable").setMode(sap.m.ListMode.SingleSelectLeft);

      					//setting everything editable
      					// for (var i = 0; i < test.length; i++) {

      					//            if (this.getView().getModel("Gemini").getProperty("/search")[i].ident_mapping === "")

      					//            {
      					//                            var atempValueChangeType = test[i].getAggregation("cells")[0].getValue();

      					//                            for (var j = 0; j < 7; j++) {
      					//                                            if (j !== 3 && j !== 6) {
      					//                                                            test[i].getAggregation("cells")[j].setEditable(true);
      					//                                            }
      					//                            }
      					//                            if (atempValueChangeType === "Enhancement") {
      					//                                            test[i].getAggregation("cells")[1].setShowSuggestion(true);
      					//                                            test[i].getAggregation("cells")[1].setShowValueHelp(true);
      					//                            } else {
      					//                                            test[i].getAggregation("cells")[1].setShowSuggestion(false);
      					//                                            test[i].getAggregation("cells")[1].setShowValueHelp(false);

      					//                            }
      					//                            this.getView().byId("jirasearch").setVisible(true);
      					//                            this.getView().byId("jiralinksearch").setVisible(false);
      					//            } else {
      					//                            for (var j = 0; j < 7; j++) {
      					//                                            if (j !== 3 && j !== 6) {
      					//                                                            test[i].getAggregation("cells")[j].setEditable(false);
      					//                                            }
      					//                            }
      					//            }

      					// }
      				}
      			},
      			fnSearchDisplayModeAfterSave: function(thisObj) {
      				thisObj.getView().byId("TablePlanSearchDisplay").setVisible(true);
      				thisObj.getView().byId("idTable9").setVisible(false);
      				thisObj.getView().byId("Searchactualtabledisplay").setVisible(true);
      				thisObj.getView().byId("Searchactualtable").setVisible(false);
      				thisObj.getView().byId("idTable9").setMode(sap.m.ListMode.none);
      				thisObj.getView().byId("Searchactualtable").setMode(sap.m.ListMode.none);
      				thisObj.getView().byId("addSearchPlan").setVisible(false);
      				thisObj.getView().byId("deleteSearchPlan").setVisible(false);
      				thisObj.getView().byId("BtnConvertSearch").setVisible(false);
      				thisObj.getView().byId("deleteSearchActual").setVisible(false);
      				thisObj.getView().byId("addSearchActual").setVisible(false);
      			},
      			handlesearchsave: function(thisObj) {

      				//            this.getView().byId("jirasearch").setVisible(false);
      				//            this.getView().byId("jiralinksearch").setVisible(true);
      				var oModel = thisObj.getView().getModel("Gemini");
      				var searchPlan = oModel.getProperty("/search");

      				//to delete elements from main copy
      				if (thisObj.searchdeleteindex !== "") {
      					var deletearray = thisObj.searchdeleteindex.split("delimiter");

      					for (var i = 0; i < deletearray.length - 1; i++) {
      						try {

      							thisObj.oModel.remove("/I_SBRSEARCHPLAN(guid'" + thisObj.searchcopy[parseInt(deletearray[i])].search_id + "')", {
      								method: "DELETE",
      								groupId: thisObj.sDeferredGroup,
      								success: function(data) {

      								},
      								error: function(e) {

      								}
      							});
      						} catch (err) {

      						}
      					}
      				}
      				//to update changes
      				// for (var i = 0; i < searchPlan.length && i < this.searchcopy.length; i++) {
      				//            var string1 = JSON.stringify(searchPlan[i]);
      				//            var string2 = JSON.stringify(this.searchcopy[i]);
      				//            if (string1 === string2) {} else {
      				//                            this.oModel.create("/I_SBRSEARCHPLAN", searchPlan[i], {
      				//                                            success: function(oResponse) {

      				//                                                            // searchPlan[i].search_id = oResponse.search_id;

      				//                                            }.bind(this),
      				//                                            error: function() {

      				//                                            }

      				//                            });
      				//            }
      				// }

      				var aSearchCopy = thisObj.searchcopy;
      				var oTempModel = thisObj.oModel;
      				jQuery.each(searchPlan, function(index, oSC) {
      					if (index < aSearchCopy.length) {
      						var string1 = JSON.stringify(searchPlan[index]);
      						var string2 = JSON.stringify(aSearchCopy[index]);
      						if (string1 === string2) {

      						} else {
      							oTempModel.create("/I_SBRSEARCHPLAN", searchPlan[index], {
      								groupId: thisObj.sDeferredGroup,
      								success: function(oResponse) {
      									searchPlan[index].search_id = oResponse.search_id;
      								},
      								error: function() {

      								}

      							});
      						}

      					}

      				});
      				//to create new elements
      				// if (searchPlan.length > this.searchcopy.length) {
      				//            for (i = this.searchcopy.length; i < searchPlan.length; i++) {
      				//                            this.oModel.create("/I_SBRSEARCHPLAN", searchPlan[i], {
      				//                                            success: function(oResponse) {

      				//                                                            searchPlan[i].search_id = oResponse.search_id;

      				//                                            }.bind(this),
      				//                                            error: function() {

      				//                                            }

      				//                            });
      				//            }
      				// }
      				aSearchCopy = thisObj.searchcopy;
      				oTempModel = thisObj.oModel;
      				jQuery.each(searchPlan, function(index, oSC) {
      					if (index >= aSearchCopy.length) {
      						oTempModel.create("/I_SBRSEARCHPLAN", searchPlan[index], {
      							groupId: thisObj.sDeferredGroup,
      							success: function(oResponse) {
      								searchPlan[index].search_id = oResponse.search_id;
      							},
      							error: function() {

      							}

      						});

      					}

      				});
      				//resetting items
      				thisObj.searchlength = searchPlan.length;
      				thisObj.searchdeleteindex = "";

      				//setting everything uneditable
      				// this.searchcopy = $.extend(true, [], searchPlan);
      				// var searchtable = this.getView().byId("idTable9");
      				// var test = searchtable.getAggregation("items");

      				// for (var i = 0; i < test.length; i++) {
      				//            for (var j = 0; j < 6; j++) {
      				//                            test[i].getAggregation("cells")[j].setEditable(false);
      				//            }
      				// }
      				s4.cfnd.geminiobjectpage.controller.Search.handlesearchactualdelete(thisObj);
      				s4.cfnd.geminiobjectpage.controller.Search.handlesearchconvert(thisObj);
      				s4.cfnd.geminiobjectpage.controller.Search.handlesearchactualsave(thisObj);
      				thisObj.searchcopy = $.extend(true, [], thisObj.getView().getModel("Gemini").getProperty("/search"));
      				thisObj.searchactualcopy = $.extend(true, [], thisObj.getView().getModel("search").getProperty("/searchactual"));

      			},
      			handlesearchactualdelete: function(thisObj) {
      				var deletearray = thisObj.searchactualdeleteindex.split("delimiter");

      				for (var x = 0; x < deletearray.length - 1; x++) {
      					thisObj.oModel.remove("/I_SBRSEARCHACTUAL(sap_bo_type='" + thisObj.searchactualcopy[parseInt(deletearray[x])].sap_bo_type +
      						"',search_object='" + thisObj.searchactualcopy[parseInt(deletearray[x])].search_object + "')", {
      							method: "DELETE",
      							groupId: thisObj.sDeferredGroup,
      							success: function(data) {

      							},
      							error: function(e) {

      							}
      						});
      				}
      				// this.searchactualcopy = $.extend(true, [], this.searchobjects);
      				// this.getView().getModel("search").refresh();
      				thisObj.searchactualdeleteindex = "";
      			},
      			handlesearchactualsave: function(thisObj) {
      				var oModelactual = thisObj.getView().getModel("search");
      				var searchActual = oModelactual.getProperty("/searchactual");
      				// this.getView().byId("Searchactualtable").setMode(sap.m.ListMode.none);
      				var actualtable = thisObj.getView().byId("Searchactualtable");
      				var actualtableitems = actualtable.getAggregation("items");

      				for (var i = 0; i < actualtableitems.length; i++) {
      					var searchobject = actualtableitems[i].getAggregation("cells")[0].getValue();

      					if (actualtableitems[i].getAggregation("cells")[0].getEditable()) {
      						actualtableitems[i].getAggregation("cells")[0].setEditable(false);
      						var actual = {
      							"sap_bo_type": thisObj.sObj,
      							"search_object": searchobject
      						};

      						thisObj.oModel.create("/I_SBRSEARCHACTUAL", actual, {
      							groupId: thisObj.sDeferredGroup,
      							success: function(oResponse) {

      							}.bind(thisObj),
      							error: function() {

      							}

      						});
      					} else {
      						break;
      					}
      				}

      			},
      			searchPlanChange: function(oEvent) {
      				var searchPlanRowText = oEvent.getParameter("id");
      				var searchPlanRow = searchPlanRowText.split("idTable9-").pop();
      				var searchPlanText = oEvent.getParameter("value");

      				var oModel = this.getView().getModel("Gemini");
      				var searchPlan = oModel.getProperty("/search");
      				var x4 = this.byId("idTable9").getItems();
      				var row = this.getView().byId("idTable9").indexOfItem(oEvent.getSource().getParent());
      				this.getView().byId("idTable9").getItems()[row].getCells()[1].setValue("");
      				// searchPlan[searchPlanRow].change_type = searchPlanText;
      				// 
      				// if (searchPlanText === "New") {
      				//            // searchPlan[searchPlanRow].search_object = "";
      				//            x4[searchPlanRow].getAggregation("cells")[1].setShowSuggestion(false);
      				//            x4[searchPlanRow].getAggregation("cells")[1].setShowValueHelp(false);

      				// } else if (searchPlanText === "Enhancement") {
      				//            x4[searchPlanRow].getAggregation("cells")[1].setShowSuggestion(true);
      				//            x4[searchPlanRow].getAggregation("cells")[1].setShowValueHelp(true);
      				// }
      				// oModel.refresh(true);

      			}
      		};
      	return s4.cfnd.geminiobjectpage.controller.Search;

      });