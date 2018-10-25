sap.ui.define([
	
		"s4/cfnd/geminiobjectpage/controller/MigrationObjects",
		"s4/cfnd/geminiobjectpage/controller/Object.controller",
		//	"s4/cfnd/geminiobjectpage/controller/API",
		"sap/ui/model/resource/ResourceModel",
		"sap/ui/base/ManagedObject",
		"sap/ui/core/Control",
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/json/JSONModel",
		"sap/ui/model/odata/ODataModel",
		"sap/ui/thirdparty/sinon",
		"sap/ui/thirdparty/sinon-qunit"

	],

	function(Migration, ObjectController, ResourceModel, ManagedObject, Control, Controller, JSONModel) {
		//19.02.2018 " mapplanMigr function" 2. delete yes 3. delete odata
		//1. check for deletemigr
		//2. getbindingcontext to remove
		//3. migractuals data needs to be populated
		// function migrationPlanChangeMode(sName, mParameters) {

		// }
		// var MigrObjMap = new sap.m.Input("MigrObjMap", {
		// 	value: "MigrObjDummy"
		// });
		// var ActualReleaseMigr = new sap.m.Input("ActualReleaseMigr", {
		// 	value: "1805"
		// });
		QUnit.module("Migration - test methods", {

			beforeEach: function() {
				//  this.migrationPlanChangeMode();  
				this.MigrObjMap = new sap.m.Input();
				this.ActualReleaseMigr = new sap.m.Input();
			},
			afterEach: function() {
				//	this.oGeminiModel.destroy();
				//  this.migrationPlanChangeMode.destroy();   
				this.MigrObjMap.destroy();
				this.ActualReleaseMigr.destroy();
			}
		});

		QUnit.test("OnaddplanMigr", function(assert) {
			var oAppController = Migration;

			var oViewMigr = {
				aMigrPlan: [{
					migrid: "000",
					sap_bo_type: "GeminiDemo2",
					migration_object: "",
					change_type: "New",
					load_api: "",
					load_avail: false,
					load_avail_plan: "",
					target_release: "",
					description: "",
					status: "",
					migration_mapped: "",
					actual_release: "",
					jira_link: "",
					jira_backlog_link: "",
					jira_valid: '1'

				}],
				aChangeType: []
			};
			var oTablePlanMigr = new sap.m.Table();
			var oActualRelColumn = new sap.m.Column("actualReleaseMigration", {
				header: new sap.m.Label({
					text: " Actual Release"
				})
			});

			oTablePlanMigr.addColumn(oActualRelColumn);
			var oRowActRel = new sap.m.ColumnListItem({
				cells: [
					new sap.m.Input({
						value: "1708"
					}),
				]
			});

			oTablePlanMigr.addItem(oRowActRel);
			var getmodel = {
				getModel: function(sName) {
					if (sName === "geminiMigr") {
						return new sap.ui.model.json.JSONModel(oViewMigr);
					}
				},
				byId: function(sName) {
					if (sName === "TablePlanMigrEdit") {
						return oTablePlanMigr;
					}
					if (sName === "actualReleaseMigration") {
						return oActualRelColumn;
					}
				}
			};
			var oControllerStub = {
				getView: function() {
					return getmodel;
				},
				handleValueState: function() {}
			};
			var fn = oAppController.addPlanMigr.bind(oControllerStub);
			fn(oControllerStub);
			var x = oControllerStub.getView().getModel("geminiMigr");
			var checkProperty = x.getProperty("/aMigrPlan");
			if (checkProperty[0].migrid === "000") {
				var isExistGUID = 1;
			}
			assert.equal(isExistGUID, 1, "Migration planning");
			//	assert.equal(fn(oControllerStub), undefined, "Added In Migration Planning");
			oActualRelColumn.destroy();
			oRowActRel.destroyCells();
			oTablePlanMigr.destroy();

		});
		QUnit.test("migrationPlanning", function(assert) {
			var oAppController = Migration;
			var oTablePlanMigr = new sap.m.Table();
			var oActualRelColumn = new sap.m.Column("actualReleaseMigration", {
				header: new sap.m.Label({
					text: " Actual Release"
				})
			});

			oTablePlanMigr.addColumn(oActualRelColumn);
			var oRowActRel = new sap.m.ColumnListItem({
				cells: [
					new sap.m.Input({
						value: "1708"
					}),
				]
			});

			oTablePlanMigr.addItem(oRowActRel);
			var oViewMigr = {
				aMigrPlan: [{
					migrid: "000",
					sap_bo_type: "GeminiDemo2",
					migration_object: "",
					change_type: "New",
					load_api: "",
					load_avail: false,
					load_avail_plan: "",
					target_release: "",
					description: "",
					status: "",
					migration_mapped: "",
					actual_release: "",
					jira_link: "",
					jira_backlog_link: "",
					jira_valid: '1'

				}],
				aChangeType: []
			};

			var getId = {
				byId: function(sName) {
					if (sName === "TablePlanMigrEdit") {
						return oTablePlanMigr;
					}
				},
				setModel: function(sName, sName1) {
					if (sName1 === "geminiMigr") {
						return new sap.ui.model.json.JSONModel(oViewMigr);
					}
				}
			};
			var oControllerStub = {
				oModel: new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/CA_BUSINESS_REPOSITORY_SRV", true),
				getView: function() {
					return getId;
				}

			};
			var fn = oAppController.migrationPlanning.bind(oControllerStub);
			fn(oControllerStub);
			var xMode = oControllerStub.getView().byId("TablePlanMigrEdit").getMode();
			if (xMode === "SingleSelectLeft") {
				var isModeSet = 1;
			}
			assert.equal(isModeSet, 1, "Migration Planning  model successful");
			//	assert.equal(fn(oControllerStub), undefined, "Migration Planning successful");
			oActualRelColumn.destroy();
			oRowActRel.destroy();
			oTablePlanMigr.destroy();

		});
//		QUnit.test("deletePlanMigr", function(assert) {
//			var oAppController = Migration;
//			var oViewMigr = {
//				aMigrPlan: [{
//					actual_release: "",
//					change_type: "New",
//					description: "test",
//					jira_backlog_link: "",
//					jira_link: "",
//					jira_valid: "1",
//					load_api: "test08",
//					load_avail: false,
//					load_avail_plan: "test08",
//					migration_mapped: "",
//					migration_object: "",
//					migrid: "8cdcd400-8ed0-1ed7-beee-a4493ed974a5",
//					sap_bo_type: "GeminiDemo2",
//					status: "",
//					status_colour: "Green",
//					status_icon: "sap-icon://border",
//					target_release: "1805",
//					tool_tip: "In Development Phase"
//
//				}],
//				aChangeType: []
//			};
//			var oTablePlanMigrEdit = new sap.m.Table();
//			oTablePlanMigrEdit.setMode("SingleSelect");
//			var oActualRelColumn = new sap.m.Column("actualReleaseMigration", {
//				header: new sap.m.Label({
//					text: " Actual Release"
//				})
//			});
//
//			oTablePlanMigrEdit.addColumn(oActualRelColumn);
//			var oRowActRel = new sap.m.ColumnListItem({
//				cells: [
//					new sap.m.Input({
//						value: "1708"
//					}),
//				]
//			});
//
//			oTablePlanMigrEdit.addItem(oRowActRel);
//			oTablePlanMigrEdit.setSelectedItem(oRowActRel, true);
//			var getId = {
//				getModel: function(sName) {
//					return new sap.ui.model.json.JSONModel(oViewMigr);
//				},
//				byId: function(sName) {
//					if (sName === "TablePlanMigrEdit") {
//						return oTablePlanMigrEdit;
//					}
//				}
//			};
//			var oControllerStub = {
//				oViewMigr: new sap.ui.model.json.JSONModel(oViewMigr),
//				aMigrPlanDel: [],
//				getView: function() {
//					return getId;
//				},
//				handleValueState: function() {},
//				fnDisplayButton: function() {}
//			};
//			var fn = oAppController.deletePlanMigr.bind(oControllerStub);
//			assert.equal(fn(oControllerStub), undefined, "Deletion in Migration Planning successful");
//			oActualRelColumn.destroy();
//			oRowActRel.destroy();
//			oTablePlanMigrEdit.destroy();
//
//		});
		QUnit.test("fnDisplayButton", function(assert) {
			var oAppController = Migration;
			var oTablePlanExt = new sap.m.Table();
			var oDelExt = new sap.m.Button();
			oDelExt.setEnabled(true);
			var oResourceModel = new ResourceModel({
				bundleName: "s4.cfnd.geminiobjectpage.i18n.i18n"
			});

			var oConvertExt = new sap.m.Button();
			oConvertExt.setEnabled(true);
			var getid = {
				byId: function(sName) {
					if (sName === "TablePlanMigrEdit") {
						return oTablePlanExt;
					}
					if (sName === "deleteMigrPlan") {
						return oDelExt;
					}
					if (sName === "mapPlanMigr") {
						return oConvertExt;
					}

				},
				getModel: function(sName) {
					if (sName === "i18n") {
						return oResourceModel;
					}
				}
			};
			var oControllerStub = {
				getView: function() {
					return getid;
				}
			};
			var fn = oAppController.fnDisplayButton.bind(oControllerStub);

			assert.equal(fn(oControllerStub), undefined, "Display button successful");
		});
//		QUnit.test("migrationPlanChangeModeEdit", function(assert) {
//			var oAppController = Migration;
//			var addPlanMigr = new sap.m.Button("addPlanMigr");
//			var deletePlanMigr = new sap.m.Button("deletePlanMigr");
//			var mapPlanMigr = new sap.m.Button("mapPlanMigr");
//			var oViewMigr = {
//				aMigrPlan: [{
//					actual_release: "",
//					change_type: "New",
//					description: "test",
//					jira_backlog_link: "",
//					jira_link: "",
//					jira_valid: "1",
//					load_api: "test08",
//					load_avail: false,
//					load_avail_plan: "test08",
//					migration_mapped: "",
//					migration_object: "",
//					migrid: "8cdcd400-8ed0-1ed7-beee-a4493ed974a5",
//					sap_bo_type: "GeminiDemo2",
//					status: "",
//					status_colour: "Green",
//					status_icon: "sap-icon://border",
//					target_release: "1805",
//					tool_tip: "In Development Phase"
//
//				}],
//				aChangeType: []
//			};
//			var oTablePlanMigrEdit = new sap.m.Table();
//			//oTablePlanMigrEdit.setMode("SingleSelect");
//			var oActualRelColumn = new sap.m.Column("actualReleaseMigration", {
//				header: new sap.m.Label({
//					text: " Actual Release"
//				})
//			});
//
//			oTablePlanMigrEdit.addColumn(oActualRelColumn);
//			var oRowActRel = new sap.m.ColumnListItem({
//				cells: [
//					new sap.m.Input({
//						value: "1708"
//					}),
//				]
//			});
//
//			oTablePlanMigrEdit.addItem(oRowActRel);
//			//	oTablePlanMigrEdit.setSelectedItem(oRowActRel, true);
//			var getId = {
//				getModel: function(sName) {
//					if (sName === "geminiMigr") {
//						return new sap.ui.model.json.JSONModel(oViewMigr);
//					}
//				},
//				byId: function(sName) {
//					if (sName === "TablePlanMigrEdit" || "TablePlanMigrDisplay") {
//						return oTablePlanMigrEdit;
//					}
//					if (sName === "addPlanMigr") {
//						return addPlanMigr;
//					}
//					if (sName === "deletePlanMigr") {
//						return deletePlanMigr;
//					}
//					if (sName === "mapPlanMigr") {
//						return mapPlanMigr;
//					}
//				}
//			};
//			var oControllerStub = {
//				aMigrPlanDel: [],
//				getView: function() {
//					return getId;
//				}
//			};
//			var fn = oAppController.migrationPlanChangeMode.bind(oControllerStub);
//			fn(oControllerStub, 2);
//			var isVisibleAdd = addPlanMigr.getVisible();
//			var isVisibleDel = deletePlanMigr.getVisible();
//			var isVisibleMap = mapPlanMigr.getVisible();
//			var isVisibleTable = oTablePlanMigrEdit.getVisible();
//
//			assert.equal(isVisibleAdd, true, "Add button is visible");
//			assert.equal(isVisibleDel, true, "Add button is visible");
//			assert.equal(isVisibleMap, true, "Add button is visible");
//			assert.equal(isVisibleTable, false, "event table is disabled");
//
//			//	assert.equal(fn(oControllerStub,2), undefined, "Edit mode for migration Planning checked");
//			addPlanMigr.destroy();
//			mapPlanMigr.destroy();
//			deletePlanMigr.destroy();
//			oActualRelColumn.destroy();
//			oRowActRel.destroy();
//			oTablePlanMigrEdit.destroy();
//
//		});
//		QUnit.test("migrationPlanChangeModeCancel", function(assert) {
//			var oAppController = Migration;
//			var addPlanMigr = new sap.m.Button("addPlanMigr");
//			var deletePlanMigr = new sap.m.Button("deletePlanMigr");
//			var mapPlanMigr = new sap.m.Button("mapPlanMigr");
//			var oViewMigr = {
//				aMigrPlan: [{
//					actual_release: "",
//					change_type: "New",
//					description: "test",
//					jira_backlog_link: "",
//					jira_link: "",
//					jira_valid: "1",
//					load_api: "test08",
//					load_avail: false,
//					load_avail_plan: "test08",
//					migration_mapped: "",
//					migration_object: "",
//					migrid: "8cdcd400-8ed0-1ed7-beee-a4493ed974a5",
//					sap_bo_type: "GeminiDemo2",
//					status: "",
//					status_colour: "Green",
//					status_icon: "sap-icon://border",
//					target_release: "1805",
//					tool_tip: "In Development Phase"
//
//				}],
//				aChangeType: []
//			};
//			var oTablePlanMigrEdit = new sap.m.Table();
//			//oTablePlanMigrEdit.setMode("SingleSelect");
//			var oActualRelColumn = new sap.m.Column("actualReleaseMigration", {
//				header: new sap.m.Label({
//					text: " Actual Release"
//				})
//			});
//
//			oTablePlanMigrEdit.addColumn(oActualRelColumn);
//			var oRowActRel = new sap.m.ColumnListItem({
//				cells: [
//					new sap.m.Input({
//						value: "1708"
//					}),
//				]
//			});
//
//			oTablePlanMigrEdit.addItem(oRowActRel);
//			oTablePlanMigrEdit.setModel(new sap.ui.model.json.JSONModel(oViewMigr));
//			var getId = {
//				getModel: function(sName) {
//					if (sName === "geminiMigr") {
//						return new sap.ui.model.json.JSONModel(oViewMigr);
//					} else {
//						return new sap.ui.model.json.JSONModel();
//					}
//				},
//				byId: function(sName) {
//					if (sName === "TablePlanMigrEdit" || "TablePlanMigrDisplay") {
//						return oTablePlanMigrEdit;
//					}
//					if (sName === "addPlanMigr") {
//						return addPlanMigr;
//					}
//					if (sName === "deletePlanMigr") {
//						return deletePlanMigr;
//					}
//					if (sName === "mapPlanMigr") {
//						return mapPlanMigr;
//					}
//				}
//			};
//			var oControllerStub = {
//				aMigrPlanDel: [],
//				oViewMigr: new sap.ui.model.json.JSONModel(oViewMigr),
//				oMigrPlanTempModel: [],
//				getView: function() {
//					return getId;
//				}
//			};
//			var fn = oAppController.migrationPlanChangeMode.bind(oControllerStub);
//			fn(oControllerStub, 1);
//			var isVisibleAdd = addPlanMigr.getVisible();
//			var isVisibleDel = deletePlanMigr.getVisible();
//			var isVisibleMap = mapPlanMigr.getVisible();
//			var isVisibleTable = oTablePlanMigrEdit.getVisible();
//
//			assert.equal(isVisibleAdd, true, "Add button is visible");
//			assert.equal(isVisibleDel, true, "Add button is visible");
//			assert.equal(isVisibleMap, true, "Add button is visible");
//			assert.equal(isVisibleTable, true, "event table is disabled");
//
//			//assert.equal(fn(oControllerStub,1), undefined, "Edit mode for migration Planning checked");
//			oActualRelColumn.destroy();
//			addPlanMigr.destroy();
//			mapPlanMigr.destroy();
//			deletePlanMigr.destroy();
//			oRowActRel.destroy();
//			oTablePlanMigrEdit.destroy();
//
//		});
		 //QUnit.test("handleMigrPlanCRUDUpdate", function(assert) {
		// 	var oAppController = Migration;
		// 	var oViewMigr = {
		// 		aMigrPlan: [{
		// 			actual_release: "",
		// 			change_type: "New",
		// 			description: "test",
		// 			jira_backlog_link: "",
		// 			jira_link: "",
		// 			jira_valid: "1",
		// 			load_api: "test08",
		// 			load_avail: false,
		// 			load_avail_plan: "test08",
		// 			migration_mapped: "",
		// 			migration_object: "",
		// 			migrid: "8cdcd400-8ed0-1ed7-beee-a4493ed974a5",
		// 			sap_bo_type: "GeminiDemo2",
		// 			status: "",
		// 			status_colour: "Green",
		// 			status_icon: "sap-icon://border",
		// 			target_release: "1805",
		// 			tool_tip: "In Development Phase"

		// 		}],
		// 		aChangeType: []
		// 	};
		// 	var oControllerStub = {
		// 		oModel: new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/CA_BUSINESS_REPOSITORY_SRV", true),
		// 		oViewMigr: new sap.ui.model.json.JSONModel(oViewMigr),
		// 		aMigrPlanDel: [],
		// 		oMigrPlanTempModel: [{
		// 			actual_release: "",
		// 			change_type: "New",
		// 			description: "testqunitUpdate",
		// 			jira_backlog_link: "",
		// 			jira_link: "",
		// 			jira_valid: "1",
		// 			load_api: "test10",
		// 			load_avail: false,
		// 			load_avail_plan: "test10",
		// 			migration_mapped: "",
		// 			migration_object: "",
		// 			migrid: "8cdcd400-8ed0-1ed7-beee-a4493ed974a5",
		// 			sap_bo_type: "GeminiDemo2",
		// 			status: "",
		// 			status_colour: "Green",
		// 			status_icon: "sap-icon://border",
		// 			target_release: "1805",
		// 			tool_tip: "In Development Phase"
		// 		}],
		// 		migrationPlanChangeMode: function() {}
		// 	};
		// 	var fn = oAppController.handleMigrPlanCRUD.bind(oControllerStub);
		// 	fn(oControllerStub);
		// 	var x = oControllerStub.oViewMigr.getProperty("/aMigrPlan");
		// 	if (x[0].description === "test") {
		// 		var isUpdate = 1;
		// 	}
		// 	assert.equal(isUpdate, 1, "Update operation successful");
		// 	//assert.equal(fn(oControllerStub), undefined, "Crud operations successful");
		// });
		 //QUnit.test("handleMigrPlanCRUDCreate", function(assert) {
		// 	var oAppController = Migration;
		// 	var oViewMigr = {
		// 		aMigrPlan: [{
		// 			actual_release: "",
		// 			change_type: "New",
		// 			description: "test",
		// 			jira_backlog_link: "",
		// 			jira_link: "",
		// 			jira_valid: "1",
		// 			load_api: "test08",
		// 			load_avail: false,
		// 			load_avail_plan: "test08",
		// 			migration_mapped: "",
		// 			migration_object: "",
		// 			migrid: "000",
		// 			sap_bo_type: "GeminiDemo2",
		// 			status: "",
		// 			status_colour: "Green",
		// 			status_icon: "sap-icon://border",
		// 			target_release: "1805",
		// 			tool_tip: "In Development Phase"

		// 		}],
		// 		aChangeType: []
		// 	};
		// 	var oControllerStub = {
		// 		oModel: new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/CA_BUSINESS_REPOSITORY_SRV", true),
		// 		oViewMigr: new sap.ui.model.json.JSONModel(oViewMigr),
		// 		migrCreate: [{
		// 			actual_release: "",
		// 			change_type: "",
		// 			description: "",
		// 			jira_backlog_link: "",
		// 			jira_link: "",
		// 			jira_valid: "",
		// 			load_api: "",
		// 			load_avail: "",
		// 			load_avail_plan: "",
		// 			migration_mapped: "",
		// 			migration_object: "",
		// 			migrid: "",
		// 			sap_bo_type: "GeminiDemo2",
		// 			status: "",
		// 			status_colour: "",
		// 			status_icon: "",
		// 			target_release: "",
		// 			tool_tip: ""

		// 		}],
		// 		aMigrPlanDel: [],
		// 		oMigrPlanTempModel: [],
		// 		migrationPlanChangeMode: function() {}
		// 	};
		// 	var fn = oAppController.handleMigrPlanCRUD.bind(oControllerStub);
		// 	assert.equal(fn(oControllerStub), undefined, "Crud operations successful when migrid == 000");
		// });
		
		// // QUnit.test("migrMapConfirm", function(assert)
		// {
		// 	var oAppController = Migration;
		// 	var oViewMigr = {
		// 		aMigrPlan: [{
		// 			actual_release: "",
		// 			change_type: "New",
		// 			description: "test",
		// 			jira_backlog_link: "",
		// 			jira_link: "",
		// 			jira_valid: "1",
		// 			load_api: "test08",
		// 			load_avail: false,
		// 			load_avail_plan: "test08",
		// 			migration_mapped: "",
		// 			migration_object: "",
		// 			migrid: "000",
		// 			sap_bo_type: "GeminiDemo2",
		// 			status: "",
		// 			status_colour: "Green",
		// 			status_icon: "sap-icon://border",
		// 			target_release: "1805",
		// 			tool_tip: "In Development Phase"

		// 		}],
		// 		aChangeType: []
		// 	};
		// 	var oTablePlanMigrEdit = new sap.m.Table();
		// 	oTablePlanMigrEdit.setMode("SingleSelect");
		// 	var oActualRelColumn = new sap.m.Column("actualReleaseMigration", {
		// 		header: new sap.m.Label({
		// 			text: " Actual Release"
		// 		})
		// 	});

		// 	oTablePlanMigrEdit.addColumn(oActualRelColumn);
		// 	var oRowActRel = new sap.m.ColumnListItem({
		// 		cells: [
		// 			new sap.m.Input({
		// 				value: "1708"
		// 			}),
		// 		]
		// 	});

		// 	oTablePlanMigrEdit.addItem(oRowActRel);
		// 	oTablePlanMigrEdit.setSelectedItem(oRowActRel, true);
		// 	var getmodel = {
		// 		getModel: function(sName)
		// 		{
		// 			if (sName === "geminiMigr")
		// 			{
		// 			return new sap.ui.model.json.JSONModel(oViewMigr);
		// 			}

		// 		},
		// 		byId: function(sName)
		// 		{
		// 			if(sName === "TablePlanMigrEdit")
		// 			{
		// 				return oTablePlanMigrEdit;
		// 			}
		// 		}
		// 	};
		// 	var oControllerStub = {
		// 		getView: function()
		// 		{
		// 			return getmodel;
		// 		}
		// 	};
		// 	var fn = oAppController.migrMapConfirm.bind(oControllerStub);
		// 	fn(oControllerStub);

		// 	var x = oControllerStub.getView().getModel("geminiMigr");
		// 	var checkProperty = x.getProperty("/aMigrPlan");
		// 	 if (checkProperty[0].migration_mapped === "MigrObjDummy")
		// 	 {
		// 	 	var isExist = 1;
		// 	 }

		// 	assert.equal(isExist, 1, "Migration planning");    
		// //	assert.equal(fn(oControllerStub), undefined, "Mapping Confirmed successsfully");
		// 	oActualRelColumn.destroy();
		// 	oRowActRel.destroy();
		// 	oTablePlanMigrEdit.destroy();
		// //	this.MigrObjMap.destroy();
		// });
		// QUnit.test("mapPlanMigr", function(assert)
		// {
		// 	var oAppController = Migration;
		// 	var oView = {

		// 		migr: [{value:"Dummy_cost"},{value:"Dummy_price"}],
		// 		output: [],
		// 		businessContext: [],
		// 		comment: [],
		// 		api: [],
		// 		events: [],
		// 		eventIdHelp: [],
		// 		apiplan: [],
		// 		extplan: [],
		// 		apiPlanProtocol: [],
		// 		apiCRUDFlag: [],
		// 		apiChangeType: [],
		// 		extType: [],
		// 		currentRelease: [],
		// 		//	aAnalyticsPlan: [],
		// 		apiConvertSIValueHelp: [],
		// 		apiConvertSIValueHelpExceptActuals: {},
		// 		cds: [],
		// 		cdsArtifactList: [],
		// 		cdsUsageTypeList: []

		// 	};
		// 	var oViewMigr = {
		// 		aMigrPlan: [{
		// 			migrid: "000",
		// 			sap_bo_type: "GeminiDemo2",
		// 			migration_object: "DummyDemo",
		// 			change_type: "New",
		// 			load_api: "yes",
		// 			load_avail: false,
		// 			load_avail_plan: "",
		// 			target_release: "1805",
		// 			description: "",
		// 			status: "",
		// 			migration_mapped: "",
		// 			actual_release: "",
		// 			jira_link: "",
		// 			jira_backlog_link: "",
		// 			jira_valid: '1'

		// 		}],
		// 		aChangeType: []
		// 	};
		// 	var oTablePlanMigrEdit = new sap.m.Table();
		// 	oTablePlanMigrEdit.setMode("SingleSelect");
		// 	var oActualRelColumn = new sap.m.Column("actualReleaseMigration", {
		// 		header: new sap.m.Label({
		// 			text: " Actual Release"
		// 		})
		// 	});
		// 	var oMigrObjColumn = new sap.m.Column("migrationObject", {
		// 		header: new sap.m.Label({
		// 			text: " Migration Object"
		// 		})
		// 	});
		//          oTablePlanMigrEdit.addColumn(oActualRelColumn);
		// 	oTablePlanMigrEdit.addColumn(oMigrObjColumn);
		// 	var oRowActRel = new sap.m.ColumnListItem({
		// 		cells: [
		// 			new sap.m.Input({
		// 				value: "1708"
		// 			}),
		// 				new sap.m.Input({
		// 				value: "dummy_migr"
		// 			}),
		// 		]
		// 	});

		// 	oTablePlanMigrEdit.addItem(oRowActRel);
		// 	oTablePlanMigrEdit.setSelectedItem(oRowActRel, true);
		//         var getmodel = {
		//         	getModel: function(sName)
		//         	{
		//         		if (sName === "geminiMigr")
		//         		{
		//         			return new sap.ui.model.json.JSONModel(oViewMigr);
		//         		}
		//         	},
		//         	byId: function(sName)
		//         	{
		//         		if (sName === "TablePlanMigrEdit")
		//         		{
		//         			return oTablePlanMigrEdit;
		//         		}
		//         	}
		//         };

		// 	var oControllerStub = {
		// 		oTable:new sap.ui.model.json.JSONModel(oView),
		// 		getView: function()
		// 		{return getmodel;},
		// 		byId : function(sName)
		// 		{
		// 			if (sName === "TablePlanMigrEdit")
		// 			{
		// 				return oTablePlanMigrEdit;
		// 			}
		// 		}
		// 	};
		// 	var fn = oAppController.mapPlanMigr.bind(oControllerStub);
		// 	assert.equal(fn(oControllerStub), undefined, "Map to actuals should fail when all the mandataroty values are not passes");
		// 	oActualRelColumn.destroy();
		// 	oMigrObjColumn.destroy();
		// 	oTablePlanMigrEdit.destroy();
		// });

	});