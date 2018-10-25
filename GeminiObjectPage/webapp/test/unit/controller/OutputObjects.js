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
		function migrationPlanChangeMode(sName, mParameters) {

		}
		var MigrObjMap = new sap.m.Input("MigrObjMap", {
			value: "MigrObjDummy"
		});
		var ActualReleaseMigr = new sap.m.Input("ActualReleaseMigr", {
			value: "1805"
		});
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

	});