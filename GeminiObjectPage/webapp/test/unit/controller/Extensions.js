sap.ui.define([
	
		"s4/cfnd/geminiobjectpage/controller/Extensibility",
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
	
	// on 19.02. === Onvaluehelp not covered and check if ajax call possible. 

	function(Extensions, ObjectController, ResourceModel, ManagedObject, Control, Controller, JSONModel) {
		//     		var extmap = new sap.m.Input("ExtMapBC",{
		// 				value: "TestBC"
		// 			});
		// var actualRelExt = new sap.m.Input("ActualReleaseExt",{
		// 				value: "1805"
		// 			});
		QUnit.module("Extensions - test methods", {
			beforeEach: function() {
				// 	this.extmap = new sap.m.Input();
				// this.actualRelExt = new sap.m.Input();

			},
			afterEach: function() {
				// this.extmap.destroy();
				// this.actualRelExt.destroy();

			}
		});
		QUnit.test("onaddPlanExtensibility", function(assert) {
			var oAppController = Extensions;
			var oView = {

				migr: [],
				output: [],
				businessContext: [],
				comment: [],
				api: [],
				events: [],
				eventIdHelp: [],
				apiplan: [],

				extplan: [],
				apiPlanProtocol: [],
				apiCRUDFlag: [],
				apiChangeType: [],
				extType: [],
				currentRelease: [],
				//	aAnalyticsPlan: [],
				apiConvertSIValueHelp: [],
				apiConvertSIValueHelpExceptActuals: {},
				cds: [],
				cdsArtifactList: [],
				cdsUsageTypeList: []

			};
			var oTable = new sap.m.Table();
			var oActualRelColumn = new sap.m.Column("actualReleaseExt", {
				header: new sap.m.Label({
					text: "Actual Release"
				})
			});
			oTable.addColumn(oActualRelColumn);
			var oColumnExtActRel = new sap.m.ColumnListItem({
				cells: [
					new sap.m.Text({
						text: ""
					})
				]
			});
			oTable.addItem(oColumnExtActRel);
			var a = {
				getModel: function(sName) {
					if (sName === "Gemini") {
						return new sap.ui.model.json.JSONModel(oView);;
					}
				},
				byId: function(sName) {
					if (sName === "actualReleaseExt") {
						return oActualRelColumn;
					}
					if (sName === "TablePlanExt") {
						return oTable;
					}

				}
			};

			var oControllerStub = {
				uniqueEntryExtPlanID: 0,
				oModel: new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/CA_BUSINESS_REPOSITORY_SRV", true),
				getView: function() {
					return a;
				},
				handleValueState: function() {}
			};

			var fnOnaddPlanExtensions = oAppController.onaddPlanExtensibility.bind(oControllerStub);
			fnOnaddPlanExtensions(oControllerStub);
			var x = oControllerStub.getView().getModel("Gemini");
			var checkProperty = x.getProperty("/extplan");
			if (checkProperty[0].ext_id === "1") {
				var isExistGUID = 1;
			}
			assert.equal(isExistGUID, 1, "The new entry to planning has been added");
			oActualRelColumn.destroy();
			oColumnExtActRel.destroy();
			oTable.destroy();

			//	assert.equal(fnOnaddPlanExtensions(), undefined, "The new entry to planning has been added");
			//assert.equal(fnOnaddPlanExtensions.uniqueEntryExtPlanID, "", "The new entry to planning has been added");

		});

		QUnit.test("onBtnMapExt", function(assert) {
			var oAppController = Extensions;
			var oTableExt = new sap.m.Table();
			oTableExt.setMode("SingleSelect");
			var oActualRelColumn = new sap.m.Column("actualRel", {
				header: new sap.m.Label({
					text: "Jira ID"
				})
			});
			var oBCColumn = new sap.m.Column("businessContext", {
				header: new sap.m.Label({
					text: "Jira ID"
				})
			});
			oTableExt.addColumn(oActualRelColumn);
			oTableExt.addColumn(oBCColumn);
			var oColumnExtActRel = new sap.m.ColumnListItem({
				cells: [
					new sap.m.Input({
						value: "1708"
					}),
					new sap.m.Input({
						value: "TestBC"
					}),
				]
			});

			oTableExt.addItem(oColumnExtActRel);
			oTableExt.setSelectedItem(oColumnExtActRel, true);

			var oView = {

				migr: [],
				output: [],
				businessContext: [],
				comment: [],
				api: [],
				events: [],
				eventIdHelp: [],
				apiplan: [],

				extplan: [{
					actual_release: "",
					area: "CLOUDFND",
					business_context: "",
					change_type: "New",
					description: "Edit Test Visibility",
					ext_id: "",
					ext_type: "Process Extension",
					jira_backlog: "",
					jira_backlog_link: "",
					sap_bo_type: "GeminiDemo2",
					target_release: "1708"

				}],
				apiPlanProtocol: [],
				apiCRUDFlag: [],
				apiChangeType: [],
				extType: [],
				currentRelease: [],
				//	aAnalyticsPlan: [],
				apiConvertSIValueHelp: [],
				apiConvertSIValueHelpExceptActuals: {},
				cds: [],
				cdsArtifactList: [],
				cdsUsageTypeList: []

			};
			var oResourceModel = new ResourceModel({
				bundleName: "s4.cfnd.geminiobjectpage.i18n.i18n"
			});

			var getView = {
				getModel: function(sName) {
					if (sName === "Gemini") {
						return new sap.ui.model.json.JSONModel(oView);
					}
					if (sName === "i18n") {
						return oResourceModel;
					}
				},
				byId: function(sName) {
					if (sName === "TablePlanExt") {
						return oTableExt;
					}
				},
				setModel: function(sName, sName1) {
					if (sName1 === "i18n") {
						return oResourceModel;
					}

				},
				addDependent: function() {}

			};
			var Open = {
				open: function() {
					return true;
				}
			};
			var oControllerStub = {
				businessContextArray: ["QunitTest"],
				ExtMap: null,
				getView: function() {
					return getView;
				},
				byId: function(sName) {
					if (sName === "TablePlanExt") {
						return oTableExt;
					}
				},

			};
			var fnonBtnMapExt = oAppController.onBtnMapExt.bind(oControllerStub);
			assert.equal(fnonBtnMapExt(oControllerStub), undefined, "Mapped successfully");
			oActualRelColumn.destroy();
			oBCColumn.destroy();
			oColumnExtActRel.destroy();
			oTableExt.destroy();

		});

		QUnit.test("onBtnMapExt", function(assert) {
			var oAppController = Extensions;
			var oTableExt = new sap.m.Table();
			var oResourceModel = new ResourceModel({
				bundleName: "s4.cfnd.geminiobjectpage.i18n.i18n"
			});

			oTableExt.setMode("SingleSelect");
			var oActualRelColumn = new sap.m.Column("actualRel", {
				header: new sap.m.Label({
					text: "Jira ID"
				})
			});
			var oBCColumn = new sap.m.Column("businessContext", {
				header: new sap.m.Label({
					text: "Jira ID"
				})
			});
			oTableExt.addColumn(oActualRelColumn);
			oTableExt.addColumn(oBCColumn);
			var oColumnExtActRel = new sap.m.ColumnListItem({
				cells: [
					new sap.m.Input({
						value: "1708"
					}),
					new sap.m.Input({
						value: "TestBC"
					}),
				]
			});

			oTableExt.addItem(oColumnExtActRel);
			//	oTableExt.setSelectedItem(oColumnExtActRel, true);

			var oView = {

				migr: [],
				output: [],
				businessContext: [],
				comment: [],
				api: [],
				events: [],
				eventIdHelp: [],
				apiplan: [],

				extplan: [{
					actual_release: "",
					area: "CLOUDFND",
					business_context: "",
					change_type: "New",
					description: "Edit Test Visibility",
					ext_id: "",
					ext_type: "Process Extension",
					jira_backlog: "",
					jira_backlog_link: "",
					sap_bo_type: "GeminiDemo2",
					target_release: "1708"

				}],
				apiPlanProtocol: [],
				apiCRUDFlag: [],
				apiChangeType: [],
				extType: [],
				currentRelease: [],
				//	aAnalyticsPlan: [],
				apiConvertSIValueHelp: [],
				apiConvertSIValueHelpExceptActuals: {},
				cds: [],
				cdsArtifactList: [],
				cdsUsageTypeList: []

			};

			var getView = {
				getModel: function(sName) {
					if (sName === "Gemini") {
						return new sap.ui.model.json.JSONModel(oView);
					}
					if (sName === "i18n") {
						return oResourceModel;
					}
				},
				byId: function(sName) {
					if (sName === "TablePlanExt") {
						return oTableExt;
					}
				},
				setModel: function(sName, sName1) {
					if (sName1 === "i18n") {
						return oResourceModel;
					}
				}

			};

			// var Open = {
			// 	open: function() {
			// 		return true;
			// 	}
			// };
			var oControllerStub = {
				businessContextArray: ["QunitTest"],
				ExtMap: null,
				getView: function() {
					return getView;
				},
				byId: function(sName) {
					if (sName === "TablePlanExt") {
						return oTableExt;
					}
				},

			};
			var fnonBtnMapExt = oAppController.onBtnMapExt.bind(oControllerStub);
			assert.equal(fnonBtnMapExt(oControllerStub), undefined, "Display error message whnen no entry selected");
			oActualRelColumn.destroy();
			oBCColumn.destroy();
			oTableExt.destroy();

		});

		QUnit.test("onBtnMapExt", function(assert) {
			var oAppController = Extensions;
			var oTableExt = new sap.m.Table();
			oTableExt.setMode("SingleSelect");
			var oActualRelColumn = new sap.m.Column("actualRel", {
				header: new sap.m.Label({
					text: "Jira ID"
				})
			});
			var oBCColumn = new sap.m.Column("businessContext", {
				header: new sap.m.Label({
					text: "Jira ID"
				})
			});
			oTableExt.addColumn(oActualRelColumn);
			oTableExt.addColumn(oBCColumn);
			var oColumnExtActRel = new sap.m.ColumnListItem({
				cells: [
					new sap.m.Input({
						value: "1708"
					}),
					new sap.m.Input({
						value: "TestBC"
					}),
				]
			});

			oTableExt.addItem(oColumnExtActRel);
			oTableExt.setSelectedItem(oColumnExtActRel, true);

			var oView = {

				migr: [],
				output: [],
				businessContext: [],
				comment: [],
				api: [],
				events: [],
				eventIdHelp: [],
				apiplan: [],

				extplan: [{
					actual_release: "",
					area: "CLOUDFND",
					business_context: "",
					change_type: "New",
					description: "Edit Test Visibility",
					ext_id: "",
					ext_type: "Process Extension",
					jira_backlog: "",
					jira_backlog_link: "",
					sap_bo_type: "GeminiDemo2",
					target_release: ""

				}],
				apiPlanProtocol: [],
				apiCRUDFlag: [],
				apiChangeType: [],
				extType: [],
				currentRelease: [],
				//	aAnalyticsPlan: [],
				apiConvertSIValueHelp: [],
				apiConvertSIValueHelpExceptActuals: {},
				cds: [],
				cdsArtifactList: [],
				cdsUsageTypeList: []

			};
			var oResourceModel = new ResourceModel({
				bundleName: "s4.cfnd.geminiobjectpage.i18n.i18n"
			});

			var getView = {
				getModel: function(sName) {
					if (sName === "Gemini") {
						return new sap.ui.model.json.JSONModel(oView);
					}
					if (sName === "i18n") {
						return oResourceModel;
					}
				},
				byId: function(sName) {
					if (sName === "TablePlanExt") {
						return oTableExt;
					}
				},
				setModel: function(sName, sName1) {
					if (sName1 === "i18n") {
						return oResourceModel;
					}
				}

			};

			var oControllerStub = {
				businessContextArray: ["QunitTest"],
				ExtMap: null,
				getView: function() {
					return getView;
				},
				byId: function(sName) {
					if (sName === "TablePlanExt") {
						return oTableExt;
					}
				},

			};
			var fnonBtnMapExt = oAppController.onBtnMapExt.bind(oControllerStub);
			assert.equal(fnonBtnMapExt(oControllerStub), undefined, "Mandatory values not maintained, not mapped");
			oActualRelColumn.destroy();
			oBCColumn.destroy();
			oTableExt.destroy();

		});

		QUnit.test("onBtnMapExt", function(assert) {
			var oAppController = Extensions;
			var oTableExt = new sap.m.Table();

			oTableExt.setMode("SingleSelect");
			var oActualRelColumn = new sap.m.Column("actualRel", {
				header: new sap.m.Label({
					text: "Jira ID"
				})
			});
			var oBCColumn = new sap.m.Column("businessContext", {
				header: new sap.m.Label({
					text: "Jira ID"
				})
			});
			oTableExt.addColumn(oActualRelColumn);
			oTableExt.addColumn(oBCColumn);
			var oColumnExtActRel = new sap.m.ColumnListItem({
				cells: [
					new sap.m.Input({
						value: "1708"
					}),
					new sap.m.Input({
						value: "TestBC"
					}),
				]
			});

			oTableExt.addItem(oColumnExtActRel);
			oTableExt.setSelectedItem(oColumnExtActRel, true);

			var oView = {

				migr: [],
				output: [],
				businessContext: [],
				comment: [],
				api: [],
				events: [],
				eventIdHelp: [],
				apiplan: [],

				extplan: [{
					actual_release: "",
					area: "CLOUDFND",
					business_context: "",
					change_type: "New",
					description: "Edit Test Visibility",
					ext_id: "",
					ext_type: "Process Extension",
					jira_backlog: "",
					jira_backlog_link: "",
					sap_bo_type: "GeminiDemo2",
					target_release: "1708"

				}],
				apiPlanProtocol: [],
				apiCRUDFlag: [],
				apiChangeType: [],
				extType: [],
				currentRelease: [],
				//	aAnalyticsPlan: [],
				apiConvertSIValueHelp: [],
				apiConvertSIValueHelpExceptActuals: {},
				cds: [],
				cdsArtifactList: [],
				cdsUsageTypeList: []

			};
			var oResourceModel = new ResourceModel({
				bundleName: "s4.cfnd.geminiobjectpage.i18n.i18n"
			});

			var getView = {
				getModel: function(sName) {
					if (sName === "Gemini") {
						return new sap.ui.model.json.JSONModel(oView);
					}
					if (sName === "i18n") {
						return oResourceModel;
					}
				},
				byId: function(sName) {
					if (sName === "TablePlanExt") {
						return oTableExt;
					}
				},
				setModel: function(sName, sName1) {
					if (sName1 === "i18n") {
						return oResourceModel;
					}
				}

			};
			var Open = {
				open: function() {
					return true;
				}
			};
			var oControllerStub = {
				businessContextArray: [],
				ExtMap: null,
				getView: function() {
					return getView;
				},
				byId: function(sName) {
					if (sName === "TablePlanExt") {
						return oTableExt;
					}
				},

			};
			var fnonBtnMapExt = oAppController.onBtnMapExt.bind(oControllerStub);
			assert.equal(fnonBtnMapExt(oControllerStub), undefined, "No Business Context exists, not mapped");
			oActualRelColumn.destroy();
			oBCColumn.destroy();
			oTableExt.destroy();

		});

		QUnit.test("handleCRUDCREATE2", function(assert) {
			var oAppController = Extensions;
			var oTablePlanExt = new sap.m.Table();
			var jiraExt = new sap.m.Column();
			oTablePlanExt.addColumn(jiraExt);
			var oColumnJira = new sap.m.ColumnListItem({
				cells: [
					new sap.m.Input({
						value: "New"
					})
				]
			});
			oTablePlanExt.addItem(oColumnJira);
			var oView = {

				migr: [],
				output: [],
				businessContext: [],
				comment: [],
				api: [],
				events: [],
				eventIdHelp: [],
				apiplan: [],
				extplan: [{
					actual_release: "",
					area: "CLOUDFND",
					business_context: "QUnits",
					change_type: "New",
					description: "Edit Test Visibility",
					ext_id: "42f2e9af-c4ef-1ee8-85a7-17ddd29c706a",
					ext_type: "Process Extension",
					jira_backlog: "",
					jira_backlog_link: "",
					jira_valid: "0",
					mapped_business_context: "",
					sap_bo_type: "GeminiDemo2",
					status: "",
					status_colour: "",
					status_icon: "",
					target_release: "1708",
					tool_tip: ""
				}],
				apiPlanProtocol: [],
				apiCRUDFlag: [],
				apiChangeType: [],
				extType: [],
				currentRelease: [],
				//	aAnalyticsPlan: [],
				apiConvertSIValueHelp: [],
				apiConvertSIValueHelpExceptActuals: {},
				cds: [],
				cdsArtifactList: [],
				cdsUsageTypeList: []

			};
			var getView = {
				getModel: function(sName) {
					return new sap.ui.model.json.JSONModel(oView);
				},
				byId: function(sName) {
					if (sName === "TablePlanExt") {
						return oTablePlanExt;
					}
					if (sName === "jiraExt") {
						return jiraExt;
					}
				}
			};
			var oControllerStub = {
				oModel: new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/CA_BUSINESS_REPOSITORY_SRV", true),
				oTable: new sap.ui.model.json.JSONModel(oView),
				aExtPlanDel: [],
				aExtPlanMap: [{
					actual_release: "",
					area: "CLOUDFND",
					business_context: "",
					change_type: "New",
					description: "Edit Test Visibility",
					ext_id: "",
					ext_type: "Process Extension",
					jira_backlog: "",
					jira_backlog_link: "",
					sap_bo_type: "GeminiDemo2",
					target_release: "1708"

				}],
				//setTooltipForMap:,
				tmpModelExtPlan: [{
					actual_release: "",
					area: "CLOUDFND",
					business_context: "",
					change_type: "New",
					description: "Edit Test Visibility",
					ext_id: "",
					ext_type: "Process Extension",
					jira_backlog: "",
					jira_backlog_link: "",
					sap_bo_type: "GeminiDemo2",
					target_release: "1708"

				}],
				getView: function() {
					return getView;
				},
				byId: function(sName) {
					if (sName === "TablePlanExt") {
						return oTablePlanExt;
					}
					if (sName === "jiraExt") {
						return jiraExt;
					}
				},
				//	setTooltipForMap: function() {}

			};
			var fn = oAppController.handleExtCRUD.bind(oControllerStub);
			fn(oControllerStub);

			var x = oControllerStub.getView().getModel("Gemini");
			var checkProperty = x.getProperty("/extplan");
			if (checkProperty[0].ext_id.trim() !== "") {
				var isExistGUID = 1;
			}
			assert.equal(isExistGUID, 1, "Create operation successful");
			oTablePlanExt.destroy();
			jiraExt.destroy();
			oColumnJira.destroy();
			//assert.equal(fn, undefined, "Create operation successful");

		});
		QUnit.test("handleCRUDUPDATE", function(assert) {
			var oAppController = Extensions;
			var oTablePlanExt = new sap.m.Table();
			var jiraExt = new sap.m.Column();
			oTablePlanExt.addColumn(jiraExt);
			var oColumnJira = new sap.m.ColumnListItem({
				cells: [
					new sap.m.Input({
						value: "New"
					})
				]
			});
			oTablePlanExt.addItem(oColumnJira);
			var oView = {

				migr: [],
				output: [],
				businessContext: [],
				comment: [],
				api: [],
				events: [],
				eventIdHelp: [],
				apiplan: [],
				extplan: [{
					actual_release: "",
					area: "CLOUDFND",
					business_context: "QUnits",
					change_type: "New",
					description: "Edit Test Visibility",
					ext_id: "000",
					ext_type: "Process Extension",
					jira_backlog: "",
					jira_backlog_link: "",
					jira_valid: "0",
					mapped_business_context: "",
					sap_bo_type: "GeminiDemo2",
					status: "",
					status_colour: "",
					status_icon: "",
					target_release: "1708",
					tool_tip: ""
				}],
				apiPlanProtocol: [],
				apiCRUDFlag: [],
				apiChangeType: [],
				extType: [],
				currentRelease: [],
				//	aAnalyticsPlan: [],
				apiConvertSIValueHelp: [],
				apiConvertSIValueHelpExceptActuals: {},
				cds: [],
				cdsArtifactList: [],
				cdsUsageTypeList: []

			};
			var getView = {
				getModel: function(sName) {
					return new sap.ui.model.json.JSONModel(oView);
				},
				byId: function(sName) {
					if (sName === "TablePlanExt") {
						return oTablePlanExt;
					}
					if (sName === "jiraExt") {
						return jiraExt;
					}
				}
			};
			var oControllerStub = {
				oModel: new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/CA_BUSINESS_REPOSITORY_SRV", true),
				oTable: new sap.ui.model.json.JSONModel(oView),
				aExtPlanDel: [],
				aExtPlanMap: [{
					actual_release: "",
					area: "CLOUDFND",
					business_context: "QUnits",
					change_type: "New",
					description: "Edit Test Visibility",
					ext_id: "000",
					ext_type: "Process Extension",
					jira_backlog: "",
					jira_backlog_link: "",
					jira_valid: "0",
					mapped_business_context: "",
					sap_bo_type: "GeminiDemo2",
					status: "",
					status_colour: "",
					status_icon: "",
					target_release: "1708",
					tool_tip: ""

				}],
				//setTooltipForMap:,
				tmpModelExtPlan: [{
					actual_release: "",
					area: "CLOUDFND",
					business_context: "QUnits",
					change_type: "New",
					description: "Edit Test Visibility",
					ext_id: "000",
					ext_type: "Process Extension",
					jira_backlog: "",
					jira_backlog_link: "",
					jira_valid: "0",
					mapped_business_context: "",
					sap_bo_type: "GeminiDemo2",
					status: "",
					status_colour: "",
					status_icon: "",
					target_release: "1708",
					tool_tip: ""

				}],
				getView: function() {
					return getView;
				},
				byId: function(sName) {
					if (sName === "TablePlanExt") {
						return oTablePlanExt;
					}
					if (sName === "jiraExt") {
						return jiraExt;
					}
				},
				//	setTooltipForMap: function() {}

			};
			var fn = oAppController.handleExtCRUD.bind(oControllerStub);
			fn(oControllerStub);

			var x = oControllerStub.getView().getModel("Gemini");
			var checkProperty = x.getProperty("/extplan");
			if (checkProperty[0].ext_id.trim() === "000") {
				var isExistGUID = 1;
			}
			assert.equal(isExistGUID, 1, "Update operation successful");
			oTablePlanExt.destroy();
			jiraExt.destroy();
			oColumnJira.destroy();
			//assert.equal(fn, undefined, "Create operation successful");

		});
		QUnit.test("fnDisplayButton", function(assert) {
			var oAppController = Extensions;
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
					if (sName === "TablePlanExt") {
						return oTablePlanExt;
					}
					if (sName === "BtnDelExtPlan") {
						return oDelExt;
					}
					if (sName === "BtnMapExt") {
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
		QUnit.test("deleteExtPlanItems", function(assert) {
			var oAppController = Extensions;
			var oView = {

				migr: [],
				output: [],
				businessContext: [],
				comment: [],
				api: [],
				events: [],
				eventIdHelp: [],
				apiplan: [],
				extplan: [{
					actual_release: "",
					area: "CLOUDFND",
					business_context: "",
					change_type: "New",
					description: "Edit Test Visibility",
					ext_id: "",
					ext_type: "Process Extension",
					jira_backlog: "",
					jira_backlog_link: "",
					sap_bo_type: "GeminiDemo2",
					target_release: "1708"

				}],
				apiPlanProtocol: [],
				apiCRUDFlag: [],
				apiChangeType: [],
				extType: [],
				currentRelease: [],
				//	aAnalyticsPlan: [],
				apiConvertSIValueHelp: [],
				apiConvertSIValueHelpExceptActuals: {},
				cds: [],
				cdsArtifactList: [],
				cdsUsageTypeList: []

			};
			var oResourceModel = new ResourceModel({
				bundleName: "s4.cfnd.geminiobjectpage.i18n.i18n"
			});
			var oTablePlanExt = new sap.m.Table();
			oTablePlanExt.setMode("SingleSelect");
			var oActualRelColumn = new sap.m.Column("actualReleaseExt", {
				header: new sap.m.Label({
					text: "Jira ID"
				})
			});
			oTablePlanExt.addColumn(oActualRelColumn);
			var oColumnExtActRel = new sap.m.ColumnListItem({
				cells: [
					new sap.m.Text({
						text: ""
					})
				]
			});
			oTablePlanExt.addItem(oColumnExtActRel);
			oTablePlanExt.setSelectedItem(oColumnExtActRel, true);
			var getId = {
				byId: function(sName) {
					if (sName === "TablePlanExt") {
						return oTablePlanExt;
					}
					if (sName === "actualReleaseExt") {
						return oActualRelColumn;
					}
				},
				getModel: function(sName) {
					if (sName === "Gemini") {
						return new sap.ui.model.json.JSONModel(oView);
					}
					if (sName === "i18n") {
						return oResourceModel;
					}
				}
			};
			var oControllerStub = {
				adelCountExtplan: 0,
				oTable: new sap.ui.model.json.JSONModel(oView),
				aExtPlanDel: [],
				tmpModelExtPlan: [{
					actual_release: "",
					area: "CLOUDFND",
					business_context: "",
					change_type: "New",
					description: "Edit Test Visibility",
					ext_id: "",
					ext_type: "Process Extension",
					jira_backlog: "",
					jira_backlog_link: "",
					sap_bo_type: "GeminiDemo2",
					target_release: "1708"

				}],

				getView: function() {
					return getId;
				},
				byId: function(sName) {
					if (sName === "TablePlanExt") {
						return oTablePlanExt;
					}

				},
				handleValueState: function() {},
				fnDisplayButton: function() {},

			};
			var fn = oAppController.deleteExtPlanItems.bind(oControllerStub);
			assert.equal(fn(oControllerStub), undefined, 'Deleted successfully');
			oActualRelColumn.destroy();
			oColumnExtActRel.destroy();
			oTablePlanExt.destroy();

			//assert.equal
		});
		QUnit.test("checkDeleteMappedExtPlanItems", function(assert) {
			var oAppController = Extensions;
			var oView = {

				migr: [],
				output: [],
				businessContext: [],
				comment: [],
				api: [],
				events: [],
				eventIdHelp: [],
				apiplan: [],
				extplan: [{
					actual_release: "",
					area: "CLOUDFND",
					business_context: "",
					change_type: "New",
					description: "Edit Test Visibility",
					ext_id: "",
					ext_type: "Process Extension",
					jira_backlog: "",
					jira_backlog_link: "",
					sap_bo_type: "GeminiDemo2",
					target_release: "1708"

				}],
				apiPlanProtocol: [],
				apiCRUDFlag: [],
				apiChangeType: [],
				extType: [],
				currentRelease: [],
				//	aAnalyticsPlan: [],
				apiConvertSIValueHelp: [],
				apiConvertSIValueHelpExceptActuals: {},
				cds: [],
				cdsArtifactList: [],
				cdsUsageTypeList: []

			};
			var oResourceModel = new ResourceModel({
				bundleName: "s4.cfnd.geminiobjectpage.i18n.i18n"
			});
			var oTablePlanExt = new sap.m.Table();
			oTablePlanExt.setMode("SingleSelect");
			var oActualRelColumn = new sap.m.Column("actualReleaseExt", {
				header: new sap.m.Label({
					text: "Jira ID"
				})
			});
			oTablePlanExt.addColumn(oActualRelColumn);
			var oColumnExtActRel = new sap.m.ColumnListItem({
				cells: [
					new sap.m.Text({
						text: "1805"
					})
				]
			});
			oTablePlanExt.addItem(oColumnExtActRel);
			oTablePlanExt.setSelectedItem(oColumnExtActRel, true);
			var getId = {
				byId: function(sName) {
					if (sName === "TablePlanExt") {
						return oTablePlanExt;
					}
					if (sName === "actualReleaseExt") {
						return oActualRelColumn;
					}
				},
				getModel: function(sName) {
					if (sName === "Gemini") {
						return new sap.ui.model.json.JSONModel(oView);
					}
					if (sName === "i18n") {
						return oResourceModel;
					}
				}
			};
			var oControllerStub = {
				adelCountExtplan: 0,
				oTable: new sap.ui.model.json.JSONModel(oView),
				aExtPlanDel: [],
				tmpModelExtPlan: [{
					actual_release: "",
					area: "CLOUDFND",
					business_context: "",
					change_type: "New",
					description: "Edit Test Visibility",
					ext_id: "",
					ext_type: "Process Extension",
					jira_backlog: "",
					jira_backlog_link: "",
					sap_bo_type: "GeminiDemo2",
					target_release: "1708"

				}],

				getView: function() {
					return getId;
				},
				byId: function(sName) {
					if (sName === "TablePlanExt") {
						return oTablePlanExt;
					}

				},
				handleValueState: function() {}

			};
			var fn = oAppController.deleteExtPlanItems.bind(oControllerStub);
			assert.equal(fn(oControllerStub), undefined, 'cannot delete an object that is not mapped');
			oActualRelColumn.destroy();
			oColumnExtActRel.destroy();
			oTablePlanExt.destroy();
		});
		QUnit.test("checkNoentrySelectedDeletePlan", function(assert) {
			var oAppController = Extensions;
			var oTablePlanExtDel = new sap.m.Table();
			var oResourceModel = new ResourceModel({
				bundleName: "s4.cfnd.geminiobjectpage.i18n.i18n"
			});
			var getId = {
				byId: function(sName) {
					if (sName === "TablePlanExt") {
						return oTablePlanExtDel;
					}
				},
				getModel: function(sName) {
					if (sName === "i18n") {
						return oResourceModel;
					}
				},
			};
			var oControllerStub = {
				getView: function() {
					return getId;
				},
				byId: function(sName) {
					if (sName === "TablePlanExt") {
						return oTablePlanExtDel;
					}
				},
				handleValueState: function() {}
			};
			var fn = oAppController.deleteExtPlanItems.bind(oControllerStub);
			assert.equal(fn(oControllerStub), undefined, 'No entry selected passed');
		});

		QUnit.test("handlechangeTypeExtCombo", function(assert) {
			var oAppController = Extensions;
			var oTablePlanExtComb = new sap.m.Table();
			var oBusinessContextInput = new sap.m.Column("businessContextInput", {
				header: new sap.m.Label({
					text: "Jira ID"
				})
			});
			oTablePlanExtComb.addColumn(oBusinessContextInput);
			var oColumnBusinessContext = new sap.m.ColumnListItem({
				cells: [
					new sap.m.Input({
						value: "New"
					})
				]
			});
			oTablePlanExtComb.addItem(oColumnBusinessContext);
			var oView = {

				migr: [],
				output: [],
				businessContext: [],
				comment: [],
				api: [],
				events: [],
				eventIdHelp: [],
				apiplan: [],
				extplan: [{
					actual_release: "",
					area: "CLOUDFND",
					business_context: "",
					change_type: "New",
					description: "Edit Test Visibility",
					ext_id: "",
					ext_type: "Process Extension",
					jira_backlog: "",
					jira_backlog_link: "",
					sap_bo_type: "GeminiDemo2",
					target_release: "1708"

				}],
				apiPlanProtocol: [],
				apiCRUDFlag: [],
				apiChangeType: [],
				extType: [],
				currentRelease: [],
				//	aAnalyticsPlan: [],
				apiConvertSIValueHelp: [],
				apiConvertSIValueHelpExceptActuals: {},
				cds: [],
				cdsArtifactList: [],
				cdsUsageTypeList: []

			};
			var getModel = {
				getModel: function(sName) {
					if (sName === "Gemini") {
						return new sap.ui.model.json.JSONModel(oView);
					}
				},
				byId: function(sName) {
					if (sName === "businessContextInput") {
						return oBusinessContextInput;
					}
					if (sName === "TablePlanExt") {
						return oTablePlanExtComb;
					}
				},
			};
			var oControllerStub = {
				getView: function() {
					return getModel;

				},
				byId: function(sName) {
					if (sName === "TablePlanExt") {
						return oTablePlanExtComb;
					}
				},
				getParameter: function(sName) {
					if (sName === "id") {
						return "application-Gemini-display-component---object--jiraAPIInput-application-Gemini-display-component---object--TablePlanExt-0";
					}
				}

			};
			var fn = oAppController.HandlechangeTypeExtCombo.bind(oControllerStub);

			// var x = oTablePlanExtComb[0].getAggregation("cells")[oBusinessContextInput].getValue;
			// if (x === "")
			// {
			// 	var isChanged = 1;
			// }

			//assert.equal(isChanged, 1, "Change type chnaged");
			assert.equal(fn(oControllerStub), undefined, "Change type combo");
			oBusinessContextInput.destroy();
			oColumnBusinessContext.destroy();
			oTablePlanExtComb.destroy();

		});

		// QUnit.test("ExtJiraChangeValid", function(assert) {
		// 	var oAppController = Extensions;
		// 	var oTablePlanExtJira = new sap.m.Table();
		// 	var oJiraExt = new sap.m.Column("jiraExt", {
		// 		header: new sap.m.Label({
		// 			text: "Jira ID"
		// 		})
		// 	});
		// 	oTablePlanExtJira.addColumn(oJiraExt);
		// 	var oColumnJiraExt = new sap.m.ColumnListItem({
		// 		cells: [
		// 			new sap.m.Input({
		// 				value: "CFNDRCBLR3-119"
		// 			})
		// 		]
		// 	});
		// 	oTablePlanExtJira.addItem(oColumnJiraExt);
		// 	var oView = {

		// 		migr: [],
		// 		output: [],
		// 		businessContext: [],
		// 		comment: [],
		// 		api: [],
		// 		events: [],
		// 		eventIdHelp: [],
		// 		apiplan: [],
		// 		extplan: [{
		// 			actual_release: "",
		// 			area: "CLOUDFND",
		// 			business_context: "",
		// 			change_type: "New",
		// 			description: "Edit Test Visibility",
		// 			ext_id: "",
		// 			ext_type: "Process Extension",
		// 			jira_backlog: "",
		// 			jira_backlog_link: "",
		// 			jira_valid: "",
		// 			sap_bo_type: "GeminiDemo2",
		// 			target_release: "1708"

		// 		}],
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
		// 	var getModel = {
		// 		getModel: function(sName) {
		// 			if (sName === "Gemini") {
		// 				return new sap.ui.model.json.JSONModel(oView);
		// 			}
		// 		},
		// 		byId: function(sName) {
		// 			if (sName === "TablePlanExt") {
		// 				return oTablePlanExtJira;
		// 			}
		// 			if (sName === "jiraExt") {
		// 				return oJiraExt;
		// 			}
		// 		}
		// 	};
		// 	var oControllerStub = {
		// 		getView: function() {
		// 			return getModel;
		// 		},
		// 		getParameter: function(sName) {
		// 			if (sName === "id") {
		// 				var ExtRowText =
		// 					"application-Gemini-display-component---object--jiraExtInput-application-Gemini-display-component---object--TablePlanExt-0";
		// 				return ExtRowText;
		// 			}
		// 			if (sName === "value") {
		// 				return "CFNDRCBLR3-119";
		// 			}
		// 		}

		// 	};
		// 	var fn = oAppController.ExtJiraChange.bind(oControllerStub);
		// 	assert.equal(fn(oControllerStub), undefined, 'Jira validation');

		// 	oJiraExt.destroy();

		// });

		// QUnit.test("checkExtJiraChangeNoEntry", function(assert) {
		// 	var oAppController = Extensions;
		// 	var oTablePlanExtenJira = new sap.m.Table();
		// 	var oJiraExten = new sap.m.Column("jiraExt", {
		// 		header: new sap.m.Label({
		// 			text: "Jira ID"
		// 		})
		// 	});
		// 	oTablePlanExtenJira.addColumn(oJiraExten);
		// 	var oColumnJiraExten = new sap.m.ColumnListItem({
		// 		cells: [
		// 			new sap.m.Input({
		// 				value: "CFNDRCBLR3-119"
		// 			})
		// 		]
		// 	});
		// 	oTablePlanExtenJira.addItem(oColumnJiraExten);
		// 	var oView = {

		// 		migr: [],
		// 		output: [],
		// 		businessContext: [],
		// 		comment: [],
		// 		api: [],
		// 		events: [],
		// 		eventIdHelp: [],
		// 		apiplan: [],
		// 		extplan: [{
		// 			actual_release: "",
		// 			area: "CLOUDFND",
		// 			business_context: "",
		// 			change_type: "New",
		// 			description: "Edit Test Visibility",
		// 			ext_id: "",
		// 			ext_type: "Process Extension",
		// 			jira_backlog: "",
		// 			jira_backlog_link: "",
		// 			jira_valid: "",
		// 			sap_bo_type: "GeminiDemo2",
		// 			target_release: "1708"

		// 		}],
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
		// 	var getModel = {
		// 		getModel: function(sName) {
		// 			if (sName === "Gemini") {
		// 				return new sap.ui.model.json.JSONModel(oView);
		// 			}
		// 		},
		// 		byId: function(sName) {
		// 			if (sName === "TablePlanExt") {
		// 				return oTablePlanExtenJira;
		// 			}
		// 			if (sName === "jiraExt") {
		// 				return oJiraExten;
		// 			}
		// 		}
		// 	};
		// 	var oControllerStub = {
		// 		getView: function() {
		// 			return getModel;
		// 		},
		// 		getParameter: function(sName) {
		// 			if (sName === "id") {
		// 				var ExtRowText =
		// 					"application-Gemini-display-component---object--jiraExtInput-application-Gemini-display-component---object--TablePlanExt-0";
		// 				return ExtRowText;
		// 			}
		// 			if (sName === "value") {
		// 				return "";
		// 			}
		// 		}

		// 	};
		// 	var fn = oAppController.ExtJiraChange.bind(oControllerStub);
		// 	assert.equal(fn(oControllerStub), undefined, 'Jira validation for no entry');
		// 	// oJiraExten.destroy();
		// 	// oColumnJiraExten.destroy();
		// 	// oTablePlanExtenJira.destroy();

		// });
	});