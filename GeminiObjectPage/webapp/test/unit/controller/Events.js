sap.ui.define([
	
		"s4/cfnd/geminiobjectpage/controller/Events",
		"s4/cfnd/geminiobjectpage/controller/Object.controller",
		//	"s4/cfnd/geminiobjectpage/controller/API",
		"sap/ui/model/resource/ResourceModel",
		"sap/ui/base/ManagedObject",
		"sap/ui/core/Control",
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/json/JSONModel",
		"sap/ui/model/odata/ODataModel",
		"sap/ui/thirdparty/sinon",
		"sap/ui/thirdparty/sinon-qunit",
		//	"sap.m.ListBase" 

	],
	function(Events, ObjectController, ResourceModel,ManagedObject, Control, Controller, JSONModel) {
		//1. deletevent itmes no proper assertion
		//3.Message box confirm in delete
		//4. odata call for events planning
		//5. eventplanchange pending
		// var eventsmappingcomment = new sap.m.Input("eventmappingcomment",{
		// 				value: "CHANGED"
		// 			});
		QUnit.module("Events - test methods", {
			beforeEach: function() {
				// 	this.extmap = new sap.m.Input();
				// this.actualRelExt = new sap.m.Input();
			//	this.eventsmappingcomment = new sap.m.Input();

			},
			afterEach: function() {
				// this.extmap.destroy();
				// this.actualRelExt.destroy();
				//	this.eventsmappingcomment.destroy();

			}
		});
		QUnit.test("fnValueState", function(assert) {
			var oAppcontroller = Events;
			var oTableEvent = new sap.m.Table("TablePlanEventsEdit");
			var oChangeTypeColumn = new sap.m.Column("changeType", {
				header: new sap.m.Label({
					text: "Change Type"
				})
			});
			oTableEvent.addColumn(oChangeTypeColumn);
			var oColumnListItem = new sap.m.ColumnListItem({
				cells: [
					new sap.m.Input({
						value: "New"
					}),
				]
			});
			oTableEvent.addItem(oColumnListItem);
			var aTableItems = oTableEvent.getItems();
			var getid = {
				byId: function(sName) {
					return oTableEvent;
				}
			};
			var oControllerStub = {
				getView: function() {
					return getid;
				}
			};
			var fn = oAppcontroller.fnValueState.bind(oControllerStub);
			var arr = [0];
			fn(oControllerStub, oTableEvent, arr);
			var x = aTableItems[0].getAggregation("cells")[0].getValueState();
			assert.equal(x, "None", "Check value state set to none");
			oTableEvent.destroy();
		});
		QUnit.test("fnEventEditable", function(assert) {
			var oAppController = Events;
			var oView = {
				events: [],
				eventIdHelp: ["CHANGED", "ASSIGNED"]
			};
			var oControllerStub = {
				sEvent: "CHANGED",
				oTable: new sap.ui.model.json.JSONModel(oView),
			};
			var fn = oAppController.fnEventEditable.bind(oControllerStub);
			var checkReturnVal = fn('1', 'Not Relevant', oControllerStub);
			assert.equal(checkReturnVal, false, "check for event editable when status is 1 and not relevant");

		});
		QUnit.test("fnEventEditable", function(assert) {
			var oAppController = Events;
			var oView = {
				events: [],
				eventIdHelp: ["CHANGED", "ASSIGNED"]
			};
			var oControllerStub = {
				sEvent: "CHANGED",
				oTable: new sap.ui.model.json.JSONModel(oView),
			};
			var fn = oAppController.fnEventEditable.bind(oControllerStub);
			var checkReturnVal = fn("", 'New', oControllerStub);
			assert.equal(checkReturnVal, true, "check for event editable when status is 1 and not relevant");

		});
		QUnit.test("fnDisplayButton", function(assert)
			{
				var oAppController = Events;
				var oTablePlanExt = new sap.m.Table();
				var oDelExt = new sap.m.Button();
				oDelExt.setEnabled(true);
					var oResourceModel = new ResourceModel({
				bundleName: "s4.cfnd.geminiobjectpage.i18n.i18n"
			});
				
				var oConvertExt = new sap.m.Button();
					oConvertExt.setEnabled(true);
				var getid = {
					byId : function(sName)
					{
						if(sName === "TablePlanEventsEdit")
						{
							return oTablePlanExt;
						}
						if(sName === "deleteplanEvents")
						{
							return oDelExt;
						}
						if(sName === "BtnMapEvent")
						{
							return oConvertExt;
						}
						
					},
					getModel : function(sName)
					{
						if(sName === "i18n")
						{
							return oResourceModel;
						}
					}
				};
				var oControllerStub = {
					getView: function()
					{
						return getid;
					}
				};
				var fn = oAppController.fnDisplayButton.bind(oControllerStub);
				
				assert.equal(fn(oControllerStub), undefined, "Display button successful");
			});
		// QUnit.test("ActualEventsEdit", function(assert) {
		// 	var oAppController = Events;
		// 	var oEventTable = new sap.m.Table("eventsTable");
		// 	var oEventsTableOnEdit = new sap.m.Table("eventsTableOnEdit");
		// 	var oEventsAdd = new sap.m.Button("eventsadd");
		// 	var getid = {
		// 		byId: function(sName) {
		// 			if (sName === "eventsTableOnEdit") {
		// 				return oEventsTableOnEdit;
		// 			} else if (sName === "eventsTable") {
		// 				return oEventTable;
		// 			} else {
		// 				return oEventsAdd;
		// 			}
		// 		}
		// 	};
		// 	var oControllerStub = {
		// 		getView: function() {
		// 			return getid;
		// 		}
		// 	};
		// 	var fn = oAppController.ActualEventsEdit.bind(oControllerStub);
		// 	fn(oControllerStub);
		// 	var isVisible = oEventsAdd.getVisible();
		// 	var isVisibleTable = oEventTable.getVisible();
		// 	var isVisibleTableEdit = oEventsTableOnEdit.getVisible();
		// 	var isSetModeDeleted = oEventsTableOnEdit.getMode();
		// 	assert.equal(isVisible, true, "Add button is visible");
		// 	assert.equal(isVisibleTable, false, "event table is disabled");
		// 	assert.equal(isVisibleTableEdit, true, "event table is disabled");
		// 	assert.equal(isSetModeDeleted, "Delete", "event table is disabled");
		// 	oEventsAdd.destroy();
		// 	oEventTable.destroy();
		// 	oEventsTableOnEdit.destroy();
		// });
		// QUnit.test("ActualEventsUnEdit", function(assert) {
		// 	var oAppController = Events;
		// 	var oEventTable = new sap.m.Table("eventsTable");
		// 	var oEventsTableOnEdit = new sap.m.Table("eventsTableOnEdit");
		// 	var oEventsAdd = new sap.m.Button("eventsadd");
		// 	var getid = {
		// 		byId: function(sName) {
		// 			if (sName === "eventsTableOnEdit") {
		// 				return oEventsTableOnEdit;
		// 			} else if (sName === "eventsTable") {
		// 				return oEventTable;
		// 			} else {
		// 				return oEventsAdd;
		// 			}
		// 		}
		// 	};
		// 	var oControllerStub = {
		// 		getView: function() {
		// 			return getid;
		// 		}
		// 	};
		// 	var fn = oAppController.ActualEventsUnEdit.bind(oControllerStub);
		// 	fn(oControllerStub);
		// 	var isVisible = oEventsAdd.getVisible();
		// 	var isVisibleTable = oEventTable.getVisible();
		// 	var isVisibleTableEdit = oEventsTableOnEdit.getVisible();
		// 	var isSetModeDeleted = oEventsTableOnEdit.getMode();
		// 	assert.equal(isVisible, false, "Add button is visible");
		// 	assert.equal(isVisibleTable, true, "event table is disabled");
		// 	assert.equal(isVisibleTableEdit, false, "event table is disabled");
		// 	assert.equal(isSetModeDeleted, "None", "event table is disabled");
		// 	oEventsAdd.destroy();
		// 	oEventTable.destroy();
		// 	oEventsTableOnEdit.destroy();

		// });
//		QUnit.test("ObjectNameEditCancel", function(assert) {
//			var oAppController = Events;
//			var oObjectName = new sap.m.Input("objectname");
//			var oObjectName1 = new sap.m.Text("objectname1");
//			var getid = {
//				byId: function(sName) {
//					if (sName === "objectName") {
//						return oObjectName;
//					}
//					if (sName === "objectName1") {
//						return oObjectName1;
//					}
//				}
//			};
//			var oControllerStub = {
//				getView: function() {
//					return getid;
//				}
//			};
//			var fn = oAppController.ObjectNameEditCancel.bind(oControllerStub);
//			fn(oControllerStub, true, false);
//			assert.equal(oObjectName.getVisible(), true, "Object is visible");
//			assert.equal(oObjectName.getEditable(), true, "Object is Editable");
//			assert.equal(oObjectName1.getVisible(), false, "Object is not visible");
//			oObjectName.destroy();
//			oObjectName1.destroy();
//
//		});
		// QUnit.test("PlannedEventsEdit", function(assert) {
		// 	var oAppController = Events;
		// 	var addPlanEvents = new sap.m.Button("addPlanEvents");
		// 	var deletePlanEvents = new sap.m.Button("deletePlanEvents");
		// 	var BtnMapEvent = new sap.m.Button("BtnMapEvent");
		// 	var oTablePlanEventsEdit = new sap.m.Table("TablePlanEventsEdit");
		// 	var TablePlanEventsDisplay = new sap.m.Table("TablePlanEventsDisplay");
		// 	var oChangeTypeColumn = new sap.m.Column("changeType", {
		// 		header: new sap.m.Label({
		// 			text: "Change Type"
		// 		})
		// 	});
	
		// 	var oSAPObjectEventColumn = new sap.m.Column("sapObjectEvent", {
		// 		header: new sap.m.Label({
		// 			text: "Change Type"
		// 		})
		// 	});
		// 	var oSAPObjectTaskCodeColumn = new sap.m.Column("sapObjectTaskCode", {
		// 		header: new sap.m.Label({
		// 			text: "Change Type"
		// 		})
		// 	});
		// 	var oTargetReleaseEventColumn = new sap.m.Column("targetReleaseEvent", {
		// 		header: new sap.m.Label({
		// 			text: "Change Type"
		// 		})
		// 	});
		// 	var oactualReleaseEventsColumn = new sap.m.Column("actualReleaseEvents", {
		// 		header: new sap.m.Label({
		// 			text: "Change Type"
		// 		})
		// 	});
		// 	var oDescriptionColumn = new sap.m.Column("description", {
		// 		header: new sap.m.Label({
		// 			text: "Change Type"
		// 		})
		// 	});
			
		// 	var ojiraEventColumn = new sap.m.Column("jiraEventColumn", {
		// 		header: new sap.m.Label({
		// 			text: "Change Type"
		// 		})
		// 	});
			
		// 	oTablePlanEventsEdit.addColumn(oChangeTypeColumn);
		// 	var oColumnListItem = new sap.m.ColumnListItem({
		// 		cells: [
		// 			new sap.m.Input({
		// 				value: "New"
		// 			}),
		// 				new sap.m.Input({
		// 				value: "Changed"
		// 			}),
		// 				new sap.m.Input({
		// 				value: "ASSIGNED"
		// 			}),
		// 				new sap.m.Input({
		// 				value: "1805"
		// 			}),
		// 				new sap.m.Input({
		// 				value: "1805"
		// 			}),
		// 				new sap.m.Text({
		// 				value: "New"
		// 			}),
		// 				new sap.m.Input({
		// 				value: "hello jira"
		// 			}),
		// 		]
		// 	});
		// 	oTablePlanEventsEdit.addItem(oColumnListItem);
		// 	var oView = {
		// 		eventIdHelp: [],
		// 		events: []	};
		// 	var oViewEvents = {
		// 		aEvents: ["CHANGED"],
		// 		aChangeType: [],
		// 		BOR: []
		// 	};
		// 	var getview = {
		// 		getModel: function(sName) {
		// 			if (sName === "Gemini") {
		// 				return new sap.ui.model.json.JSONModel(oView);
		// 			} else if (sName === "geminievents") {
		// 				return new sap.ui.model.json.JSONModel(oViewEvents);
		// 			}
		// 		},
		// 		byId: function(sName) {
		// 			if (sName === "addPlanEvents") {
		// 				return addPlanEvents;
		// 			}
		// 			else if(sName === "deletePlanEvents")
		// 			{
		// 				return deletePlanEvents;
		// 			}
		// 			else if(sName === "BtnMapEvent")
		// 			{
		// 				return BtnMapEvent;
		// 			}
		// 			else if(sName === "TablePlanEventsDisplay")
		// 			{
		// 				return TablePlanEventsDisplay ;
		// 			}
		// 			else if (sName === "TablePlanEventsEdit")
		// 			{
		// 				return oTablePlanEventsEdit;
		// 			}
		// 			else 
		// 			 {return oTablePlanEventsEdit; }
		// 		}
		// 	};
		// 	var oControllerStub = {
		// 		aEventPlanDel: [],
		// 		getView: function() {
		// 			return getview;
		// 		},
		// 		ObjectNameEditCancel: function(){}
		// 	};
		// 	var fn = oAppController.PlannedEventsEdit.bind(oControllerStub);
		// 	fn(oControllerStub);
		// 	var isVisible = addPlanEvents.getVisible();
		// 	var isVisibleDel = deletePlanEvents.getVisible();
		// 	var isVisibleBtnMap = BtnMapEvent.getVisible();
		// 	var isSetModeDeleted = oTablePlanEventsEdit.getMode();
		// 	var isVisibleTable = TablePlanEventsDisplay.getVisible();
		// 	assert.equal(isVisible, true, "Add button is visible");
		// 	assert.equal(isVisibleDel, true, "Add button is visible");
		// 	assert.equal(isVisibleBtnMap, true, "Add button is visible");
		// 	assert.equal(isVisibleTable, false, "event table is disabled");
		// 	assert.equal(isSetModeDeleted, "SingleSelectLeft", "event table is disabled");
		// 	addPlanEvents.destroy();
		// 	deletePlanEvents.destroy();
		// 	BtnMapEvent.destroy();
		// 	oChangeTypeColumn.destroy();
		// 	oactualReleaseEventsColumn.destroy();
		// 	oTargetReleaseEventColumn.destroy();
		// 	oDescriptionColumn.destroy();
		// 	oSAPObjectEventColumn.destroy();
		// 	oSAPObjectTaskCodeColumn.destroy();
		// 	ojiraEventColumn.destroy();
		// 	oColumnListItem.destroy();
		// 	oTablePlanEventsEdit.destroy();
		// 	TablePlanEventsDisplay.destroy();

		// });
		// QUnit.test("PlannedEventsUnEdit", function(assert)
		// {
		// 	var oAppController = Events;
		// 	var addPlanEvents = new sap.m.Button("addPlanEvents");
		// 	var deletePlanEvents = new sap.m.Button("deletePlanEvents");
		// 	var BtnMapEvent = new sap.m.Button("BtnMapEvent");
		// 	var oTablePlanEventsEdit = new sap.m.Table("TablePlanEventsEdit");
		// 	var TablePlanEventsDisplay = new sap.m.Table("TablePlanEventsDisplay");
		// 	var oChangeTypeColumn = new sap.m.Column("changeType", {
		// 		header: new sap.m.Label({
		// 			text: "Change Type"
		// 		})
		// 	});
	
		// 	var oSAPObjectEventColumn = new sap.m.Column("sapObjectEvent", {
		// 		header: new sap.m.Label({
		// 			text: "Change Type"
		// 		})
		// 	});
		// 	var oSAPObjectTaskCodeColumn = new sap.m.Column("sapObjectTaskCode", {
		// 		header: new sap.m.Label({
		// 			text: "Change Type"
		// 		})
		// 	});
		// 	var oTargetReleaseEventColumn = new sap.m.Column("targetReleaseEvent", {
		// 		header: new sap.m.Label({
		// 			text: "Change Type"
		// 		})
		// 	});
		// 	var oactualReleaseEventsColumn = new sap.m.Column("actualReleaseEvents", {
		// 		header: new sap.m.Label({
		// 			text: "Change Type"
		// 		})
		// 	});
		// 	var oDescriptionColumn = new sap.m.Column("description", {
		// 		header: new sap.m.Label({
		// 			text: "Change Type"
		// 		})
		// 	});
			
		// 	var ojiraEventColumn = new sap.m.Column("jiraEventColumn", {
		// 		header: new sap.m.Label({
		// 			text: "Change Type"
		// 		})
		// 	});
			
		// 	oTablePlanEventsEdit.addColumn(oChangeTypeColumn);
		// 	var oColumnListItem = new sap.m.ColumnListItem({
		// 		cells: [
		// 			new sap.m.Input({
		// 				value: "New"
		// 			}),
		// 				new sap.m.Input({
		// 				value: "Changed"
		// 			}),
		// 				new sap.m.Input({
		// 				value: "ASSIGNED"
		// 			}),
		// 				new sap.m.Input({
		// 				value: "1805"
		// 			}),
		// 				new sap.m.Input({
		// 				value: "1805"
		// 			}),
		// 				new sap.m.Text({
		// 				value: "New"
		// 			}),
		// 				new sap.m.Input({
		// 				value: "hello jira"
		// 			}),
		// 		]
		// 	});
		// 	oTablePlanEventsEdit.addItem(oColumnListItem);
		// 	var getview = {
		// 		byId: function(sName) {
		// 			if (sName === "addPlanEvents") {
		// 				return addPlanEvents;
		// 			}
		// 			else if(sName === "deletePlanEvents")
		// 			{
		// 				return deletePlanEvents;
		// 			}
		// 			else if(sName === "BtnMapEvent")
		// 			{
		// 				return BtnMapEvent;
		// 			}
		// 			else if(sName === "TablePlanEventsDisplay")
		// 			{
		// 				return TablePlanEventsDisplay ;
		// 			}
		// 			else if (sName === "TablePlanEventsEdit")
		// 			{
		// 				return oTablePlanEventsEdit;
		// 			}
		// 			else 
		// 			 {return oTablePlanEventsEdit; }
		// 		}
		// 	};
		// 	var oControllerStub = {
		// 		aEventPlanDel: [],
		// 		getView: function() {
		// 			return getview;
		// 		},
		// 		ObjectNameEditCancel: function(){}
		// 	};
			
		// 	var fn = oAppController.PlannedEventsUnEdit.bind(oControllerStub);
		// 	fn(oControllerStub);
		// 	var isVisible = addPlanEvents.getVisible();
		// 	var isVisibleDel = deletePlanEvents.getVisible();
		// 	var isVisibleBtnMap = BtnMapEvent.getVisible();
		// 	var isSetModeDeleted = oTablePlanEventsEdit.getMode();
		// 	var isVisibleTable = TablePlanEventsDisplay.getVisible();
		// 	assert.equal(isVisible, false, "Add button is visible");
		// 	assert.equal(isVisibleDel, true, "Del button is visible");
		// 	assert.equal(isVisibleBtnMap, true, "Map button is visible");
		// 	assert.equal(isVisibleTable, true, "event table is disabled");
		// 	assert.equal(isSetModeDeleted, "None", "event table is disabled");
		// 	addPlanEvents.destroy();
		// 	deletePlanEvents.destroy();
		// 	BtnMapEvent.destroy();
		// 	oChangeTypeColumn.destroy();
		// 	oactualReleaseEventsColumn.destroy();
		// 	oTargetReleaseEventColumn.destroy();
		// 	oDescriptionColumn.destroy();
		// 	oSAPObjectEventColumn.destroy();
		// 	oSAPObjectTaskCodeColumn.destroy();
		// 	ojiraEventColumn.destroy();
		// 	oColumnListItem.destroy();
		// 	oTablePlanEventsEdit.destroy();
		// 	TablePlanEventsDisplay.destroy();
		// });
		QUnit.test("onEventAdd", function(assert)
		{
			var oAppController = Events;
			var oView = {
			events: [],
			eventIdHelp: []};
			var oTablePlanEventsEdit = new sap.m.Table("TablePlanEventsEdit");
			var oChangeTypeColumn = new sap.m.Column("changeType", {
				header: new sap.m.Label({
					text: "Change Type"
				})
			});
			var oSAPObjectEventColumn = new sap.m.Column("sapObjectEvent", {
				header: new sap.m.Label({
					text: "Change Type"
				})
			});
			var oSAPObjectTaskCodeColumn = new sap.m.Column("sapObjectTaskCode", {
				header: new sap.m.Label({
					text: "Change Type"
				})
			});
			var oResourceModel = new ResourceModel({
				bundleName: "s4.cfnd.geminiobjectpage.i18n.i18n"
			});

			var getmodel = {
				getModel: function(sName)
				{
					if(sName === "Gemini")
					{
						return new sap.ui.model.json.JSONModel(oView);
					}
					if(sName === "i18n")
					{
						return oResourceModel;
					}
				},
				byId: function(sName)
				{
					if(sName === "eventsTableOnEdit")
					{
						return oTablePlanEventsEdit;
					}
				}

			};
			var oControllerStub = {
				sEventsObjectName: "GeminiDemo2",
				getView: function()
				{
					return getmodel;
				},
				
				//fnValueState: function(){}

			};
			var fn = oAppController.onEventAdd.bind(oControllerStub);
			fn(oControllerStub);
			var x = oControllerStub.getView().getModel("Gemini");
			var aCheckNewRow = 	x.getProperty("/events");
			if (aCheckNewRow.length !== 0)
			 {
			 	var flagPass = 1;
			 }
			assert.equal(flagPass, 1, "Added to events planning");
		    oTablePlanEventsEdit.destroy();
		    oChangeTypeColumn.destroy();
		    oSAPObjectEventColumn.destroy();
		    oSAPObjectTaskCodeColumn.destroy();
		});
		// QUnit.test("deleteEventItems", function(assert)
		// {
		// 	var oAppController = Events;
		// 	var oResourceModel = new ResourceModel({
		// 		bundleName: "s4.cfnd.geminiobjectpage.i18n.i18n"
		// 	});

		// 	var oView = {
		// 	events: ["ASSIGNED"],
		// 	eventIdHelp: []};
		// 	var oViewEvents = {
		// 		aEvents: ["CHANGED"],
		// 		aChangeType: [],
		// 		BOR: []
		// 	};
		// 	var oTablePlanEventsEdit = new sap.m.Table("eventsTableOnEdit");
		// 	oTablePlanEventsEdit.setMode("SingleSelect");     
		// 	var oChangeTypeColumn = new sap.m.Column("changeType", {
		// 		header: new sap.m.Label({
		// 			text: "Change Type"
		// 		})
		// 	});
		// 	oTablePlanEventsEdit.addColumn(oChangeTypeColumn);
		// 	var oSAPObjectEventColumn = new sap.m.Column("sapObjectEvent", {
		// 		header: new sap.m.Label({
		// 			text: "Change Type"
		// 		})
		// 	});
		// 	var oSAPObjectTaskCodeColumn = new sap.m.Column("sapObjectTaskCode", {
		// 		header: new sap.m.Label({
		// 			text: "Change Type"
		// 		})
		// 	});
		// 	var oColumnListItem = new sap.m.ColumnListItem({
		// 		cells: [
		// 			new sap.m.Input({
		// 				value: "New"
		// 			}),
		// 			new sap.m.Input({
		// 				value: "New"
		// 			}),
		// 			new sap.m.Input({
		// 				value: "New"
		// 			})
		// 		]
		// 	});
		// 	oTablePlanEventsEdit.addItem(oColumnListItem);
		// 	oTablePlanEventsEdit.setSelectedItem(oColumnListItem, true);
		// 	var getview = {
		// 		byId: function(sName)
		// 		{
		// 			if(sName === "eventsTableOnEdit")
		// 			{
		// 				return oTablePlanEventsEdit;
		// 			}
		// 		},
		// 		getModel:function(sName)
		// 		{
		// 			if (sName === "Gemini")
		// 			{
		// 				return new sap.ui.model.json.JSONModel(oView);
		// 			}
		// 			else if (sName === "geminievents") {
		// 				return new sap.ui.model.json.JSONModel(oViewEvents);
		// 			}
		// 			else
		// 			 return oResourceModel;
					
		// 		}
		// 	};
		// 	var oControllerStub = {
		// 		aEventdel: [],
		// 		tmpModel3: [],
		// 		getView : function()
		// 		{
		// 			return getview;
		// 		},
		// 		getParameter: function(sName)
		// 		{
		// 			return oColumnListItem;
		// 		}
		// 	};
		// 	var fn = oAppController.deleteEventItems.bind(oControllerStub);
		// 	fn(oControllerStub);
		// 	assert.equal(fn(), undefined, "Delete items in events");
		// 	oChangeTypeColumn.destroy();
		// 	oSAPObjectEventColumn.destroy();
		// 	oSAPObjectTaskCodeColumn.destroy();
		// 	oTablePlanEventsEdit.destroy();
		// });
		QUnit.test("EventsPlanning", function(assert)
		{
			var oAppController = Events;
			var oViewEvents = {aEvents: [],
				aChangeType: [],
				BOR: []};
			var setmodel = {
				setModel: function(sName, sName1)
				{
					return new sap.ui.model.json.JSONModel(oViewEvents);
				}
			};
			var oControllerStub = {
				oViewEvents: new sap.ui.model.json.JSONModel(oViewEvents),
				sObj: "GeminiDemo2",
				oModel: new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/CA_BUSINESS_REPOSITORY_SRV", true),
				getView: function()
				{
					return setmodel;
				}
			};
			var fn = oAppController.EventsPlanning.bind(oControllerStub);
			fn(oControllerStub);
			var x = oControllerStub.oViewEvents.getProperty("/aEvents");
			if (x.length === 0)
			{
				var flagPass = 1;
			}
			assert.equal(flagPass,1, "model set for events planning");
		});
//		QUnit.test("onaddPlanEvents", function(assert)
//		{
//			var oAppController = Events;
//			var oView = {
//				events: ["CHANGED","ASSIGNED"],
//				eventIdHelp: ["CONFIRMED", "CLOSED"]
//			};
//			var oViewEvents = {
//				aEvents: ["CHANGED"],
//				aChangeType: [],
//				BOR: []
//			};
//			var oTablePlanEventsEdit = new sap.m.Table("TablePlanEventsEdit");
//			var oChangeTypeColumn = new sap.m.Column("changeType", {
//				header: new sap.m.Label({
//					text: "Change Type"
//				})
//			});
//	
//			var oSAPObjectEventColumn = new sap.m.Column("sapObjectEvent", {
//				header: new sap.m.Label({
//					text: "Change Type"
//				})
//			});
//			var oSAPObjectTaskCodeColumn = new sap.m.Column("sapObjectTaskCode", {
//				header: new sap.m.Label({
//					text: "Change Type"
//				})
//			});
//			var oTargetReleaseEventColumn = new sap.m.Column("targetReleaseEvent", {
//				header: new sap.m.Label({
//					text: "Change Type"
//				})
//			});
//			var oactualReleaseEventsColumn = new sap.m.Column("actualReleaseEvents", {
//				header: new sap.m.Label({
//					text: "Change Type"
//				})
//			});
//			var oDescriptionColumn = new sap.m.Column("description", {
//				header: new sap.m.Label({
//					text: "Change Type"
//				})
//			});
//			
//			var ojiraEventColumn = new sap.m.Column("jiraEventColumn", {
//				header: new sap.m.Label({
//					text: "Change Type"
//				})
//			});
//			
//			oTablePlanEventsEdit.addColumn(oChangeTypeColumn);
//			var oColumnListItem = new sap.m.ColumnListItem({
//				cells: [
//					new sap.m.Input({
//						value: "New"
//					}),
//						new sap.m.Input({
//						value: "Changed"
//					}),
//						new sap.m.Input({
//						value: "ASSIGNED"
//					}),
//						new sap.m.Input({
//						value: "1805"
//					}),
//						new sap.m.Input({
//						value: "1805"
//					}),
//						new sap.m.Text({
//						value: "New"
//					}),
//						new sap.m.Input({
//						value: "hello jira"
//					}),
//				]
//			});
//			oTablePlanEventsEdit.addItem(oColumnListItem);
//			var getmodel = {
//				getModel : function(sName)
//				{
//					if(sName === "geminievents")
//					{
//						return new sap.ui.model.json.JSONModel(oViewEvents);
//					}
//				},
//				byId: function(sName)
//				{
//					return oTablePlanEventsEdit;
//				}
//			};
//			var oControllerStub = {
//				getView: function()
//				{
//					return getmodel;
//				},
//				oTable: new sap.ui.model.json.JSONModel(oView),
//			//	sEventsObjectName: 
//			};
//			var fn = oAppController.onaddPlanEvents.bind(oControllerStub);
//			fn(oControllerStub);
//			var x = oControllerStub.getView().getModel("geminievents");
//			var checkProperty = x.getProperty("/aEvents");
//			 if (checkProperty[0].event_id === "40f2e9af-be89-2ee7-abb0-00b7d3146c56")
//			 {
//			 	var isExistGUID = 1;
//			 }
//			assert.equal(isExistGUID, 1, "Events planning");
//			oChangeTypeColumn.destroy();
//			oactualReleaseEventsColumn.destroy();
//			oTargetReleaseEventColumn.destroy();
//			oDescriptionColumn.destroy();
//			oSAPObjectEventColumn.destroy();
//			oSAPObjectTaskCodeColumn.destroy();
//			ojiraEventColumn.destroy();
//			oColumnListItem.destroy();
//			oTablePlanEventsEdit.destroy();
//			
//			
//		});
//		QUnit.test("onMapPlanEvents", function(assert)
//		{
//			var oAppController = Events;
//			var oResourceModel = new ResourceModel({
//				bundleName: "s4.cfnd.geminiobjectpage.i18n.i18n"
//			});
//
//			var oView = {
//			events: ["ASSIGNED"],
//			eventIdHelp: []};
//			var oViewEvents = {
//				aEvents: ["CHANGED"],
//				aChangeType: [],
//				BOR: []
//			};
//			var oTablePlanEventsEdit = new sap.m.Table("eventsTableOnEdit");
//			oTablePlanEventsEdit.setMode("SingleSelect");     
//			var oChangeTypeColumn = new sap.m.Column("changeType", {
//				header: new sap.m.Label({
//					text: "Change Type"
//				})
//			});
//			oTablePlanEventsEdit.addColumn(oChangeTypeColumn);
//			var oSAPObjectEventColumn = new sap.m.Column("sapObjectEvent", {
//				header: new sap.m.Label({
//					text: "Change Type"
//				})
//			});
//			var oSAPObjectTaskCodeColumn = new sap.m.Column("sapObjectTaskCode", {
//				header: new sap.m.Label({
//					text: "Change Type"
//				})
//			});
//			var oColumnListItem = new sap.m.ColumnListItem({
//				cells: [
//					new sap.m.Input({
//						value: "New"
//					}),
//					new sap.m.Input({
//						value: "New"
//					}),
//					new sap.m.Input({
//						value: "New"
//					})
//				]
//			});
//			oTablePlanEventsEdit.addItem(oColumnListItem);
//			oTablePlanEventsEdit.setSelectedItem(oColumnListItem, true);
//			var getview = {
//				byId : function(sName)
//				{
//					if(sName === "TablePlanEventsEdit")
//					{
//						return oTablePlanEventsEdit;
//					}
//				},
//				getModel:function(sName)
//				{
//					if (sName === "Gemini")
//					{
//						return new sap.ui.model.json.JSONModel(oView);
//					}
//					if (sName === "geminievents") {
//						return new sap.ui.model.json.JSONModel(oViewEvents);
//					}
//					if (sName === "i18n")
//					{
//						return oResourceModel;
//						
//					}
//					
//				}
//			};
//			var oControllerStub = {
//				oTable : new sap.ui.model.json.JSONModel(oView),
//				oViewEvents: new sap.ui.model.json.JSONModel(oViewEvents),
//				getView: function()
//				{
//					return getview;
//				}
//			};
//			var fn = oAppController.onMapPlanEvents.bind(oControllerStub);
//			//fn(oControllerStub);
//			assert.equal(fn(oControllerStub), undefined, "Event is already mapped and exists in actuals");
//			oChangeTypeColumn.destroy();
//			oSAPObjectEventColumn.destroy();
//			oSAPObjectTaskCodeColumn.destroy();
//			oTablePlanEventsEdit.destroy();
//			
//			
//		});
//		QUnit.test("onMapPlanEvents", function(assert)
//		{
//			var oAppController = Events;
//				var oResourceModel = new ResourceModel({
//				bundleName: "s4.cfnd.geminiobjectpage.i18n.i18n"
//			});
//			var oView = {
//			events: ["ASSIGNED"],
//			eventIdHelp: ["CLOSED"]};
//			var oViewEvents = {
//				aEvents: [{
//					changetype: "Not Relevant",
//					bo_event: "",
//					bo_task: "",
//					target_release:"",
//					status: ""	}],
//				aChangeType: [],
//				BOR: []
//			};
//			var oTablePlanEventsEdit = new sap.m.Table("eventsTableOnEdit");
//			oTablePlanEventsEdit.setMode("SingleSelect");     
//			var oChangeTypeColumn = new sap.m.Column("changeType", {
//				header: new sap.m.Label({
//					text: "Change Type"
//				})
//			});
//			oTablePlanEventsEdit.addColumn(oChangeTypeColumn);
//			var oSAPObjectEventColumn = new sap.m.Column("sapObjectEvent", {
//				header: new sap.m.Label({
//					text: "Change Type"
//				})
//			});
//			var oSAPObjectTaskCodeColumn = new sap.m.Column("sapObjectTaskCode", {
//				header: new sap.m.Label({
//					text: "Change Type"
//				})
//			});
//			var oColumnListItem = new sap.m.ColumnListItem({
//				cells: [
//					new sap.m.Input({
//						value: "New"
//					}),
//					new sap.m.Input({
//						value: "New"
//					}),
//					new sap.m.Input({
//						value: "New"
//					})
//				]
//			});
//			oTablePlanEventsEdit.addItem(oColumnListItem);
//			oTablePlanEventsEdit.setSelectedItem(oColumnListItem, true);
//			var getview = {
//				byId : function(sName)
//				{
//					if(sName === "TablePlanEventsEdit")
//					{
//						return oTablePlanEventsEdit;
//					}
//				},
//				getModel:function(sName)
//				{
//					if (sName === "Gemini")
//					{
//						return new sap.ui.model.json.JSONModel(oView);
//					}
//					 if (sName === "geminievents") {
//						return new sap.ui.model.json.JSONModel(oViewEvents);
//					}
//					if(sName === "i18n")
//					{
//						return oResourceModel;
//					}
//					
//				}
//			};
//			var oControllerStub = {
//				oTable : new sap.ui.model.json.JSONModel(oView),
//				oViewEvents: new sap.ui.model.json.JSONModel(oViewEvents),
//				getView: function()
//				{
//					return getview;
//				}
//			};
//			var fn = oAppController.onMapPlanEvents.bind(oControllerStub);
//		//	fn(oControllerStub);
//			assert.equal(fn(oControllerStub), undefined, "Change type of the event is not relevant, cannot convert to actuals");
//			oChangeTypeColumn.destroy();
//			oSAPObjectEventColumn.destroy();
//			oSAPObjectTaskCodeColumn.destroy();
//			oTablePlanEventsEdit.destroy();
//			
//			
//		});
//		QUnit.test("onMapPlanEvents", function(assert)
//		{
//			var oAppController = Events;
//			var oResourceModel = new ResourceModel({
//				bundleName: "s4.cfnd.geminiobjectpage.i18n.i18n"
//			});
//			var oView = {
//			events: ["ASSIGNED"],
//			eventIdHelp: ["CLOSED"]};
//			var oViewEvents = {
//				aEvents: [{
//					changetype: "",
//					bo_event: "",
//					bo_task: "",
//					target_release:"",
//					status: ""	}],
//				aChangeType: [],
//				BOR: []
//			};
//			var oTablePlanEventsEdit = new sap.m.Table("eventsTableOnEdit");
//			oTablePlanEventsEdit.setMode("SingleSelect");     
//			var oChangeTypeColumn = new sap.m.Column("changeType", {
//				header: new sap.m.Label({
//					text: "Change Type"
//				})
//			});
//			oTablePlanEventsEdit.addColumn(oChangeTypeColumn);
//			var oSAPObjectEventColumn = new sap.m.Column("sapObjectEvent", {
//				header: new sap.m.Label({
//					text: "Change Type"
//				})
//			});
//			var oSAPObjectTaskCodeColumn = new sap.m.Column("sapObjectTaskCode", {
//				header: new sap.m.Label({
//					text: "Change Type"
//				})
//			});
//			var oColumnListItem = new sap.m.ColumnListItem({
//				cells: [
//					new sap.m.Input({
//						value: "New"
//					}),
//					new sap.m.Input({
//						value: "New"
//					}),
//					new sap.m.Input({
//						value: "New"
//					})
//				]
//			});
//			oTablePlanEventsEdit.addItem(oColumnListItem);
//			oTablePlanEventsEdit.setSelectedItem(oColumnListItem, true);
//			var getview = {
//				byId : function(sName)
//				{
//					if(sName === "TablePlanEventsEdit")
//					{
//						return oTablePlanEventsEdit;
//					}
//				},
//				getModel:function(sName)
//				{
//					if (sName === "Gemini")
//					{
//						return new sap.ui.model.json.JSONModel(oView);
//					}
//					 if (sName === "geminievents") {
//						return new sap.ui.model.json.JSONModel(oViewEvents);
//					}
//					if (sName === "i18n")
//					{
//						return oResourceModel;
//					}
//					
//				}
//			};
//			var oControllerStub = {
//				oTable : new sap.ui.model.json.JSONModel(oView),
//				oViewEvents: new sap.ui.model.json.JSONModel(oViewEvents),
//				getView: function()
//				{
//					return getview;
//				}
//			};
//			var fn = oAppController.onMapPlanEvents.bind(oControllerStub);
//		//	fn(oControllerStub);
//			assert.equal(fn(oControllerStub), undefined, "Cannot convert to actuals as the event does not exist for the corresponding SAP Object Representation");
//			oChangeTypeColumn.destroy();
//			oSAPObjectEventColumn.destroy();
//			oSAPObjectTaskCodeColumn.destroy();
//			oTablePlanEventsEdit.destroy();
//			
//			
//		});
//			QUnit.test("onMapPlanEvents", function(assert)
//		{
//			var oAppController = Events;
//			var oResourceModel = new ResourceModel({
//				bundleName: "s4.cfnd.geminiobjectpage.i18n.i18n"
//			});
//			var oView = {
//			events: ["ASSIGNED"],
//			eventIdHelp: [{event: "ASSIGNED"}]};
//			var oViewEvents = {
//				aEvents: [{
//					changetype: "NEW",
//					bo_event: "ASSIGNED",
//					bo_task: "",
//					target_release:"",
//					status: ""	}],
//				aChangeType: [],
//				BOR: []
//			};
//			var oTablePlanEventsEdit = new sap.m.Table("eventsTableOnEdit");
//			oTablePlanEventsEdit.setMode("SingleSelect");     
//			var oChangeTypeColumn = new sap.m.Column("changeType", {
//				header: new sap.m.Label({
//					text: "Change Type"
//				})
//			});
//			oTablePlanEventsEdit.addColumn(oChangeTypeColumn);
//			var oSAPObjectEventColumn = new sap.m.Column("sapObjectEvent", {
//				header: new sap.m.Label({
//					text: "Change Type"
//				})
//			});
//			var oSAPObjectTaskCodeColumn = new sap.m.Column("sapObjectTaskCode", {
//				header: new sap.m.Label({
//					text: "Change Type"
//				})
//			});
//			var oColumnListItem = new sap.m.ColumnListItem({
//				cells: [
//					new sap.m.Input({
//						value: "New"
//					}),
//					new sap.m.Input({
//						value: "New"
//					}),
//					new sap.m.Input({
//						value: "New"
//					})
//				]
//			});
//			oTablePlanEventsEdit.addItem(oColumnListItem);
//			oTablePlanEventsEdit.setSelectedItem(oColumnListItem, true);
//			var getview = {
//				byId : function(sName)
//				{
//					if(sName === "TablePlanEventsEdit")
//					{
//						return oTablePlanEventsEdit;
//					}
//				},
//				getModel:function(sName)
//				{
//					if (sName === "Gemini")
//					{
//						return new sap.ui.model.json.JSONModel(oView);
//					}
//					else if (sName === "geminievents") {
//						return new sap.ui.model.json.JSONModel(oViewEvents);
//					}
//					else
//					{
//						return oResourceModel;
//					}
//					
//				}
//			};
//			var oControllerStub = {
//				oTable : new sap.ui.model.json.JSONModel(oView),
//				oViewEvents: new sap.ui.model.json.JSONModel(oViewEvents),
//				getView: function()
//				{
//					return getview;
//				}
//			};
//			var fn = oAppController.onMapPlanEvents.bind(oControllerStub);
//		//	fn(oControllerStub);
//			assert.equal(fn(oControllerStub), undefined, "Maintain valid SAP Object Task Code");
//			oChangeTypeColumn.destroy();
//			oSAPObjectEventColumn.destroy();
//			oSAPObjectTaskCodeColumn.destroy();
//			oTablePlanEventsEdit.destroy();
//			
//			
//		});
//			QUnit.test("onMapPlanEvents", function(assert)
//		{
//			var oAppController = Events;
//			var oResourceModel = new ResourceModel({
//				bundleName: "s4.cfnd.geminiobjectpage.i18n.i18n"
//			});
//			var oView = {
//			events: ["ASSIGNED"],
//			eventIdHelp: [{event: "ASSIGNED"}]};
//			var oViewEvents = {
//				aEvents: [{
//					changetype: "NEW",
//					bo_event: "ASSIGNED",
//					bo_task: "CLOSED",
//					target_release:"",
//					status: ""	}],
//				aChangeType: [],
//				BOR: []
//			};
//			var oTablePlanEventsEdit = new sap.m.Table("eventsTableOnEdit");
//			oTablePlanEventsEdit.setMode("SingleSelect");     
//			var oChangeTypeColumn = new sap.m.Column("changeType", {
//				header: new sap.m.Label({
//					text: "Change Type"
//				})
//			});
//			oTablePlanEventsEdit.addColumn(oChangeTypeColumn);
//			var oSAPObjectEventColumn = new sap.m.Column("sapObjectEvent", {
//				header: new sap.m.Label({
//					text: "Change Type"
//				})
//			});
//			var oSAPObjectTaskCodeColumn = new sap.m.Column("sapObjectTaskCode", {
//				header: new sap.m.Label({
//					text: "Change Type"
//				})
//			});
//			var oColumnListItem = new sap.m.ColumnListItem({
//				cells: [
//					new sap.m.Input({
//						value: "New"
//					}),
//					new sap.m.Input({
//						value: "New"
//					}),
//					new sap.m.Input({
//						value: "New"
//					})
//				]
//			});
//			oTablePlanEventsEdit.addItem(oColumnListItem);
//			oTablePlanEventsEdit.setSelectedItem(oColumnListItem, true);
//			var getview = {
//				byId : function(sName)
//				{
//					if(sName === "TablePlanEventsEdit")
//					{
//						return oTablePlanEventsEdit;
//					}
//				},
//				getModel:function(sName)
//				{
//					if (sName === "Gemini")
//					{
//						return new sap.ui.model.json.JSONModel(oView);
//					}
//					else if (sName === "geminievents") {
//						return new sap.ui.model.json.JSONModel(oViewEvents);
//					}
//					else
//					 {
//					 	return oResourceModel;
//					 }
//				}
//			};
//			var oControllerStub = {
//				oTable : new sap.ui.model.json.JSONModel(oView),
//				oViewEvents: new sap.ui.model.json.JSONModel(oViewEvents),
//				getView: function()
//				{
//					return getview;
//				}
//			};
//			var fn = oAppController.onMapPlanEvents.bind(oControllerStub);
//		//	fn(oControllerStub);
//			assert.equal(fn(oControllerStub), undefined, "Maintain valid Target Release");
//			oChangeTypeColumn.destroy();
//			oSAPObjectEventColumn.destroy();
//			oSAPObjectTaskCodeColumn.destroy();
//			oTablePlanEventsEdit.destroy();
//			
//			
//		});
//			QUnit.test("onMapPlanEvents", function(assert)
//		{
//			var oAppController = Events;
//			var oResourceModel = new ResourceModel({
//				bundleName: "s4.cfnd.geminiobjectpage.i18n.i18n"
//			});
//			var oView = {
//			events: ["ASSIGNED"],
//			eventIdHelp: [{event: "ASSIGNED"}]};
//			var oViewEvents = {
//				aEvents: [{
//					changetype: "NEW",
//					bo_event: "ASSIGNED",
//					bo_task: "CLOSED",
//					target_release: "1805",
//					status: "1"	}],
//				aChangeType: [],
//				BOR: []
//			};
//			var oTablePlanEventsEdit = new sap.m.Table("eventsTableOnEdit");
//			oTablePlanEventsEdit.setMode("SingleSelect");     
//			var oChangeTypeColumn = new sap.m.Column("changeType", {
//				header: new sap.m.Label({
//					text: "Change Type"
//				})
//			});
//			oTablePlanEventsEdit.addColumn(oChangeTypeColumn);
//			var oSAPObjectEventColumn = new sap.m.Column("sapObjectEvent", {
//				header: new sap.m.Label({
//					text: "Change Type"
//				})
//			});
//			var oSAPObjectTaskCodeColumn = new sap.m.Column("sapObjectTaskCode", {
//				header: new sap.m.Label({
//					text: "Change Type"
//				})
//			});
//			var oColumnListItem = new sap.m.ColumnListItem({
//				cells: [
//					new sap.m.Input({
//						value: "New"
//					}),
//					new sap.m.Input({
//						value: "New"
//					}),
//					new sap.m.Input({
//						value: "New"
//					})
//				]
//			});
//			oTablePlanEventsEdit.addItem(oColumnListItem);
//			oTablePlanEventsEdit.setSelectedItem(oColumnListItem, true);
//			var getview = {
//				byId : function(sName)
//				{
//					if(sName === "TablePlanEventsEdit")
//					{
//						return oTablePlanEventsEdit;
//					}
//				},
//				getModel:function(sName)
//				{
//					if (sName === "Gemini")
//					{
//						return new sap.ui.model.json.JSONModel(oView);
//					}
//					else if (sName === "geminievents") {
//						return new sap.ui.model.json.JSONModel(oViewEvents);
//					}
//					else
//					{
//						return oResourceModel;
//					}
//					
//				}
//			};
//			var oControllerStub = {
//				oTable : new sap.ui.model.json.JSONModel(oView),
//				oViewEvents: new sap.ui.model.json.JSONModel(oViewEvents),
//				getView: function()
//				{
//					return getview;
//				}
//			};
//			var fn = oAppController.onMapPlanEvents.bind(oControllerStub);
//		//	fn(oControllerStub);
//			assert.equal(fn(oControllerStub), undefined, "Event is already mapped");
//			oChangeTypeColumn.destroy();
//			oSAPObjectEventColumn.destroy();
//			oSAPObjectTaskCodeColumn.destroy();
//			oTablePlanEventsEdit.destroy();
//			
//			
//		});
//	
//		QUnit.test("onMapPlanEvents", function(assert)
//		{
//			var oAppController = Events;
//			// var eventmappingcomment = new sap.m.Input("eventmappingcomment");
//			// var ActualReleaseEvents1 =new sap.m.Input("ActualReleaseEvents1");
//			var oResourceModel = new ResourceModel({
//				bundleName: "s4.cfnd.geminiobjectpage.i18n.i18n"
//			});
//			var oView = {
//			events: ["ASSIGNED"],
//			eventIdHelp: [{event: "ASSIGNED"}]};
//			var oViewEvents = {
//				aEvents: [{
//					changetype: "NEW",
//					bo_event: "ASSIGNED",
//					bo_task: "CLOSED",
//					target_release: "1805",
//					status: ""	}],
//				aChangeType: [],
//				BOR: [],
//				Index: []
//			};
//			var oTablePlanEventsEdit = new sap.m.Table("eventsTableOnEdit");
//			oTablePlanEventsEdit.setMode("SingleSelect");     
//			var oChangeTypeColumn = new sap.m.Column("changeType", {
//				header: new sap.m.Label({
//					text: "Change Type"
//				})
//			});
//			oTablePlanEventsEdit.addColumn(oChangeTypeColumn);
//			var oSAPObjectEventColumn = new sap.m.Column("sapObjectEvent", {
//				header: new sap.m.Label({
//					text: "Change Type"
//				})
//			});
//			var oSAPObjectTaskCodeColumn = new sap.m.Column("sapObjectTaskCode", {
//				header: new sap.m.Label({
//					text: "Change Type"
//				})
//			});
//			var oColumnListItem = new sap.m.ColumnListItem({
//				cells: [
//					new sap.m.Input({
//						value: "New"
//					}),
//					new sap.m.Input({
//						value: "New"
//					}),
//					new sap.m.Input({
//						value: "New"
//					})
//				]
//			});
//			oTablePlanEventsEdit.addItem(oColumnListItem);
//			oTablePlanEventsEdit.setSelectedItem(oColumnListItem, true);
//			var getview = {
//				byId : function(sName)
//				{
//					if(sName === "TablePlanEventsEdit")
//					{
//						return oTablePlanEventsEdit;
//					}
//				},
//				getModel:function(sName)
//				{
//					if (sName === "Gemini")
//					{
//						return new sap.ui.model.json.JSONModel(oView);
//					}
//					else if (sName === "geminievents") {
//						return new sap.ui.model.json.JSONModel(oViewEvents);
//					}
//					else
//					{
//						return oResourceModel;
//					}
//					
//				},
//				addDependent : function(sName)
//				{ return; }
//			};
//			var oControllerStub = {
//				oTable : new sap.ui.model.json.JSONModel(oView),
//				oViewEvents: new sap.ui.model.json.JSONModel(oViewEvents),
//				getView: function()
//				{
//					return getview;
//				}
//			};
//			var fn = oAppController.onMapPlanEvents.bind(oControllerStub);
//		//	fn(oControllerStub);
//			assert.equal(fn(oControllerStub), undefined, "Value help should appear");
//			oChangeTypeColumn.destroy();
//			oSAPObjectEventColumn.destroy();
//			oSAPObjectTaskCodeColumn.destroy();
//			oTablePlanEventsEdit.destroy();
//			
//			
//		});
//		QUnit.test("handleEventsMappingConfirm", function(assert)
//		{
//			var oAppController = Events;
//			var oResourceModel = new ResourceModel({
//				bundleName: "s4.cfnd.geminiobjectpage.i18n.i18n"
//			});
//			var getmodel = {
//				getModel: function(sName)
//				{
//					if(sName === "i18n")
//					{
//						return oResourceModel;
//					}
//				}
//			};
//			var oControllerStub = {getView: function()
//				{return getmodel;}
//			};
//			var fn = oAppController.handleEventsMappingConfirm.bind(oControllerStub);
//			if(!sap.ui.getCore().byId("eventmappingcomment"))
//			{
//				var eventmappingcomment = new sap.m.Input("eventmappingcomment");
//			}
//			sap.ui.getCore().byId("eventmappingcomment").setValue("");
//			assert.equal(fn(), undefined, "No valid sap object task type name");
//			
//		});
		// QUnit.test("handleEventsMappingConfirm", function(assert)
		// {
		// 	var oAppController = Events;
		// 	var oResourceModel = new ResourceModel({
		// 		bundleName: "s4.cfnd.geminiobjectpage.i18n.i18n"
		// 	});
		// 		var oView = {
		// 	events: [{
		// 		Event:"",
		// 		TaskCode:"",
		// 		TaskText:""
		// 	}],
		// 	eventIdHelp: [{event: "ASSIGNED"}]};
		// 	var oViewEvents = {
		// 		aEvents: [{
		// 			changetype: "NEW",
		// 			bo_event: "ASSIGNED",
		// 			bo_task: "CLOSED",
		// 			target_release: "1805",
		// 			status: "",
		// 			status_colour:"",
		// 			tool_tip: "",
		// 			status_icon: "",
		// 			actual_release: ""
		// 		}],
		// 		aChangeType: [],
		// 		BOR: [],
		// 		Index: [0]
		// 	};
		// 	var getmodel = {
		// 		getModel:function(sName)
		// 		{
		// 			if (sName === "Gemini")
		// 			{
		// 				return new sap.ui.model.json.JSONModel(oView);
		// 			}
		// 			else if (sName === "geminievents") {
		// 				return new sap.ui.model.json.JSONModel(oViewEvents);
		// 			}
		// 			else
		// 			{
		// 			return oResourceModel;
		// 			}
					
		// 		},
		// 	};
		// 	var oControllerStub = {
		// 	 oViewEvents: new sap.ui.model.json.JSONModel(oViewEvents),
		// 	  getView: function()
		// 	  {
		// 	  	return getmodel;
		// 	  }
		// 	};
		// 	var fn = oAppController.handleEventsMappingConfirm.bind(oControllerStub);
		// 	if(!sap.ui.getCore().byId("eventmappingcomment"))
		// 	{
		// 		var eventmappingcomment = new sap.m.Input("eventmappingcomment");
		// 	}
		// 	if(!sap.ui.getCore().byId("ActualReleaseEvents1"))
		// 	{
		// 		var eventmappingcomment = new sap.m.Input("ActualReleaseEvents1");
		// 	}
		// 	sap.ui.getCore().byId("eventmappingcomment").setValue("CHANGED");
		// 	sap.ui.getCore().byId("ActualReleaseEvents1").setValue("1808");
		// 	assert.equal(fn(), undefined, "Object Mapped");
		// });
		// QUnit.test("EventJiraChange", function(assert)
		// {
		// 	var oAppController = Events;
		// 	var oViewEvents = {
		// 		aEvents: [{
		// 			changetype: "NEW",
		// 			bo_event: "ASSIGNED",
		// 			bo_task: "CLOSED",
		// 			target_release: "1805",
		// 			status: "",
		// 			status_colour:"",
		// 			tool_tip: "",
		// 			status_icon: "",
		// 			actual_release: "",
		// 			jira_valid : "",
		// 			jira_backlog_link: ""
		// 		}],
		// 		aChangeType: [],
		// 		BOR: [],
		// 		Index: [0]
		// 	};

		// 	var oTablePlanEventsEdit = new sap.m.Table("TablePlanEventsEdit");
		// 	var oJiraEventColumn = new sap.m.Column("jiraEventColumn", {
		// 		header: new sap.m.Label({
		// 			text: "Change Type"
		// 		})
		// 	});
		// 	oTablePlanEventsEdit.addColumn(oJiraEventColumn);
		// 	var oColumnListItem = new sap.m.ColumnListItem({
		// 		cells: [
		// 			new sap.m.Input({
		// 				value: "New"
		// 			}),
						

		// 		]
		// 	});
		// 	oTablePlanEventsEdit.addItem(oColumnListItem);
		// 	var getview = {
		// 		getModel : function(sName)
		// 		{
		// 			if (sName === "geminievents") {
		// 				return new sap.ui.model.json.JSONModel(oViewEvents);
		// 			}
		// 		},
		// 		byId: function(sName)
		// 		{
		// 			if(sName === "jiraeventcolumn")
		// 			{
		// 				return oJiraEventColumn;
		// 			}
		// 			if(sName === "TablePlanEventsEdit")
		// 			{
		// 				return oTablePlanEventsEdit;
		// 			}
					
		// 		}
		// 	};
		// 	var getid = {
		// 		getId : function(sName)
		// 		{
			
		// 				var EventRowText =
		// 					"application-Gemini-manage-component---object--jiraOut-application-Gemini-manage-component---object--TablePlanOutEdit-0";
		// 				return EventRowText;
					
		// 		}
		// 	};
		// 	var oControllerStub = {
		// 		getView: function()
		// 		{
		// 			return getview;
		// 		},
		// 		getSource : function()
		// 		{
		// 			return getid;
		// 		},
		// 			getParameter: function(sName) {
					
		// 			if(sName === "value")
		// 			 {
		// 			 	return "CFNDRCBLR3-119";
		// 			 }
		// 		}
		// 	};
		// 	var fn = oAppController.EventJiraChange.bind(oControllerStub);
		// 	assert.equal(fn(oControllerStub),undefined,"Jira change");
		// 	oJiraEventColumn.destroy();
		// 	oColumnListItem.destroy();
		// 	oTablePlanEventsEdit.destroy();
			
		// });
		QUnit.test("onSaveEvents", function(assert)
		{
			var oAppController = Events;
			var oViewEvents = {
				aEvents: [{
					changetype: "NEW",
					bo_event: "ASSIGNED",
					bo_task: "CLOSED",
					target_release: "1805",
					status: "",
					status_colour:"",
					tool_tip: "",
					status_icon: "",
					actual_release: "",
					jira_valid : "",
					jira_backlog_link: ""
				}],
				aChangeType: [],
				BOR: [],
				Index: [0]
			};

			var getmodel = {
				getModel : function(sName)
				{
					if (sName === "geminievents") {
						return new sap.ui.model.json.JSONModel(oViewEvents);
					}
				},
			};
			var oControllerStub = {
			oModel: new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/CA_BUSINESS_REPOSITORY_SRV", true),
			atempeventsplan: [{
					changetype: "NEW",
					bo_event: "ASSIGNED",
					bo_task: "CLOSED",
					target_release: "1805",
					status: "",
					status_colour:"",
					tool_tip: "",
					status_icon: "",
					actual_release: "",
					jira_valid : "",
					jira_backlog_link: ""
				}],
			aEventPlanDel: [],
		
			getView: function()	{
				return getmodel;
					
				}
			};
			var fn = oAppController.onSaveEvents.bind(oControllerStub);
			assert.equal(fn(oControllerStub), undefined, "Save events");
		});
//		QUnit.test("onDeletePlanEvents", function(assert)
//		{
//			var oAppController = Events;
//				var oResourceModel = new ResourceModel({
//				bundleName: "s4.cfnd.geminiobjectpage.i18n.i18n"
//			});
//			var oView = {
//			events: [{
//				Event:"",
//				TaskCode:"",
//				TaskText:""
//			}],
//			eventIdHelp: [{event: "ASSIGNED"}]};
//			var oViewEvents = {
//				aEvents: [{
//					changetype: "NEW",
//					bo_event: "ASSIGNED",
//					bo_task: "CLOSED",
//					target_release: "1805",
//					status: "",
//					status_colour:"",
//					tool_tip: "",
//					status_icon: "",
//					actual_release: ""
//				}],
//				aChangeType: [],
//				BOR: [],
//				Index: [0]
//			};
//			var oTablePlanEventsEdit = new sap.m.Table("eventsTableOnEdit");
//			oTablePlanEventsEdit.setMode("SingleSelect");     
//		    	var oChangeTypeColumn = new sap.m.Column("changeType", {
//				header: new sap.m.Label({
//					text: "Change Type"
//				})
//			});
//	
//			var oSAPObjectEventColumn = new sap.m.Column("sapObjectEvent", {
//				header: new sap.m.Label({
//					text: "Change Type"
//				})
//			});
//			var oSAPObjectTaskCodeColumn = new sap.m.Column("sapObjectTaskCode", {
//				header: new sap.m.Label({
//					text: "Change Type"
//				})
//			});
//			var oTargetReleaseEventColumn = new sap.m.Column("targetReleaseEvent", {
//				header: new sap.m.Label({
//					text: "Change Type"
//				})
//			});
//			var oactualReleaseEventsColumn = new sap.m.Column("actualReleaseEvents", {
//				header: new sap.m.Label({
//					text: "Change Type"
//				})
//			});
//			var oDescriptionColumn = new sap.m.Column("description", {
//				header: new sap.m.Label({
//					text: "Change Type"
//				})
//			});
//			
//			var ojiraEventColumn = new sap.m.Column("jiraEventColumn", {
//				header: new sap.m.Label({
//					text: "Change Type"
//				})
//			});
//			oTablePlanEventsEdit.addColumn(oChangeTypeColumn);
//			var oColumnListItem = new sap.m.ColumnListItem({
//				cells: [
//					new sap.m.Input({
//						value: "New"
//					}),
//						new sap.m.Input({
//						value: "Changed"
//					}),
//						new sap.m.Input({
//						value: "ASSIGNED"
//					}),
//						new sap.m.Input({
//						value: "1805"
//					}),
//						new sap.m.Input({
//						value: "1805"
//					}),
//						new sap.m.Text({
//						value: "New"
//					}),
//						new sap.m.Input({
//						value: "hello jira"
//					}),
//				]
//			});
//			oTablePlanEventsEdit.addItem(oColumnListItem);
//	     	oTablePlanEventsEdit.setSelectedItem(oColumnListItem, true);
//			var getview = {
//					getModel: function(sName) {
//					if (sName === "Gemini") {
//						return new sap.ui.model.json.JSONModel(oView);
//					} else if (sName === "geminievents") {
//						return new sap.ui.model.json.JSONModel(oViewEvents);
//					}
//					else
//					{
//						return oResourceModel;
//					}
//				},
//				byId: function(sName)
//				{
//					if(sName === "TablePlanEventsEdit")
//					{
//						return oTablePlanEventsEdit;
//					}
//				}
//				
//			};
//		
//			var oControllerStub = {
//				oTable: new sap.ui.model.json.JSONModel(oView),
//				aEventPlanDel: [],
//				atempeventsplan: [{
//					changetype: "NEW",
//					bo_event: "ASSIGNED",
//					bo_task: "CLOSED",
//					target_release: "1805",
//					status: "",
//					status_colour:"",
//					tool_tip: "",
//					status_icon: "",
//					actual_release: "",
//					jira_valid : "",
//					jira_backlog_link: ""
//				}],
//				getView: function()
//				{
//					return getview;
//				}
//			};
//			var fn = oAppController.onDeletePlanEvents.bind(oControllerStub);
//			
//			assert.equal(fn(oControllerStub),undefined,"Deleted planned events");
//			oChangeTypeColumn.destroy();
//			oactualReleaseEventsColumn.destroy();
//			oTargetReleaseEventColumn.destroy();
//			oDescriptionColumn.destroy();
//			oSAPObjectEventColumn.destroy();
//			oSAPObjectTaskCodeColumn.destroy();
//			ojiraEventColumn.destroy();
//			oColumnListItem.destroy();
//			oTablePlanEventsEdit.destroy();
//			
//		});

	});