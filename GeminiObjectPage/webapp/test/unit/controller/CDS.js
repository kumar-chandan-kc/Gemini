sap.ui.define([
	
		"s4/cfnd/geminiobjectpage/controller/CDS",
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
	//1. convertto usage
	//2. delete is left, getaggregation !
	function(CDS, ObjectController,ResourceModel,ManagedObject, Control, Controller, JSONModel) {
		QUnit.module("CDS - test methods", {
			beforeEach: function() {

			},
			afterEach: function() {
				//this.eventsmappingcomment.destroy();

			}
		});
         QUnit.test("convertUsageTypeToFlags", function(assert)
         {
         	var oAppController = CDS;
         	var aCDS = 	 {
					cdsUsageTypeKeysArray: ["Analytics", "API Interface", "Extensibility", "Key Structure", "BW Extraction", "Data Extraction", "Search"],
					usagetypeString:"Analytics, API Interface",
					cds_artifact: "Cube View",
					isanalytics: true,
					isapiinterface:	true,
					isbwextraction:	true,
					isdataextraction:true,
					isextensibility:true,
					iskeystructure:	true,
					issearch:false,
					release_status:	"",
					sap_bo_type:"GeminiDemo2",
					view_name:"Dummy",
					new_row: true
				};
				var fn = oAppController.convertUsageTypeToFlags.bind(aCDS);
				fn(aCDS);
				var x = aCDS.issearch;
				if (x === false)
				{
					var isTrue = 1;
				}
				assert.equal(isTrue, 1, "Function Passed");
				
         });
		QUnit.test("readCDSActualData", function(assert) {
			var oAppcontroller = CDS;
			var oView = {
				cds: [],
				cdsArtifactList: [],
				cdsUsageTypeList: []
			};
			var oTableCDS = new sap.m.Table();
			var oTableCDSEdit = new sap.m.Table();
			var busyIndicator = new sap.m.BusyIndicator();
			var getid = {
				byId: function(sName) {
					if (sName === "busyCDSActual") {
						return busyIndicator;
					} else if (sName === "TableActualCDS") {
						return oTableCDS;
					} else {
						return oTableCDSEdit;
					}
				}

			};
			var oControllerStub = {
				oModel: new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/CA_BUSINESS_REPOSITORY_SRV", true),
				oTable: new sap.ui.model.json.JSONModel(oView),
				sResCDSActual: [{
					isanalytics: "",
					isbwextraction: "",
					issearch: "",
					isapiinterface: "",
					isdataextraction: "",
					isextensibility: "",
					iskeystructure: "",
					cdsUsageTypeKeysArray: "",
					cdsUsageTypeString: "",
					release_status: ""

				}],
				getView: function() {
					return getid;
				}
			};
			var fn = oAppcontroller.readCDSActualData.bind(oControllerStub);
			fn("GeminiDemo2", oControllerStub);
			var x = oControllerStub.oTable.getProperty("/cdsArtifactList");
			var y = oControllerStub.oTable.getProperty("/cdsUsageTypeList");
			if (x.length !== 0 && y.length !== 0) {
				var isFlagSet = 1;
			}

			assert.equal(isFlagSet, 1, "Read CDS Data");
			oTableCDS.destroy();
			oTableCDSEdit.destroy();
		});
		QUnit.test("handleEditCDS", function(assert) {
			var oAppController = CDS;
			var oView = {
				cds: [],
				cdsArtifactList: [],
				cdsUsageTypeList: []
			};
			var oTableCDSEdit = new sap.m.Table();
			var oTableCDS = new sap.m.Table();
			var cdsAdd = new sap.m.Button();
			var cdsCombo = new sap.m.Select();
			var usageType = new sap.m.ComboBox();
			var cdsViewName = new sap.m.Input();
			var getid = {
				byId: function(sName) {
					if (sName === "TableActualCDSnonEdit") {
						return oTableCDSEdit;
					} else if (sName === "TableActualCDS") {
						return oTableCDS;
					} else if (sName === "CDSadd") {
						return cdsAdd;
					} else if (sName === "artifactCDSCombo") {
						return cdsCombo;
					} else if (sName === "usageType") {
						return usageType;
					} else {
						return cdsViewName;
					}
				}

			};
			var oControllerStub = {
				oTable: new sap.ui.model.json.JSONModel(oView),
				tmpModelCDS: {},
				getView: function() {
					return getid;
				}
			};
			var fn = oAppController.handleEditCDS.bind(oControllerStub);
			fn(oControllerStub);
			var x = oControllerStub.getView().byId("TableActualCDS").getVisible();
			var y = oControllerStub.getView().byId("TableActualCDSonEdit").getVisible();
			var isMode = oControllerStub.getView().byId("TableActualCDS").getMode();
			if (x === true && y === true && isMode === "Delete") {
				var isTrue = 1;
			}
			assert.equal(isTrue, 1, "Table Actual CDS is displayed");
		});

		QUnit.test("handleCancelCDS", function(assert) {
			var oAppController = CDS;
			var oView = {
				cds: [],
				cdsArtifactList: [],
				cdsUsageTypeList: []
			};
			var oTableCDSEdit = new sap.m.Table();
			var oTableCDS = new sap.m.Table();
			var cdsAdd = new sap.m.Button();
			var cdsCombo = new sap.m.Select();
			var usageType = new sap.m.ComboBox();
			var cdsViewName = new sap.m.Input();
			var getid = {
				byId: function(sName) {
					if (sName === "TableActualCDSnonEdit") {
						return oTableCDSEdit;
					} else if (sName === "TableActualCDS") {
						return oTableCDS;
					} else if (sName === "CDSadd") {
						return cdsAdd;
					} else if (sName === "artifactCDSCombo") {
						return cdsCombo;
					} else if (sName === "usageType") {
						return usageType;
					} else {
						return cdsViewName;
					}
				}

			};
			var oControllerStub = {
				oTable: new sap.ui.model.json.JSONModel(oView),
				tmpModelCDS: {},
				getView: function() {
					return getid;
				}
			};
			var fn = oAppController.handleCancelCDS.bind(oControllerStub);
			fn(oControllerStub);
			var x = oControllerStub.getView().byId("TableActualCDS").getVisible();
			var y = oControllerStub.getView().byId("TableActualCDSonEdit").getVisible();
			var isMode = oControllerStub.getView().byId("TableActualCDS").getMode();
			if (x === false || y === false || isMode === "None") {
				var isTrue = 1;
			}
			assert.equal(isTrue, 1, "Table Actual CDS is displayed");
		});
		QUnit.test("onCDSAdd", function(assert) {
			var oAppController = CDS;
			var oView = {
				cds: []
			};
			var getmodel = {
				getModel: function(sName) {
					if (sName === 'Gemini') {
						return new sap.ui.model.json.JSONModel(oView);
					}
				}
			};
			var oControllerStub = {
				getView: function() {
					return getmodel;
				}
			};
			var fn = oAppController.onCDSAdd.bind(oControllerStub);
			fn(oControllerStub);
			var x = oControllerStub.getView().getModel("Gemini");
			var checkProperty = x.getProperty("/cds");
			if (checkProperty[0].new_row === true) {
				var isNew = 1;
			}
			assert.equal(isNew, 1, "New row added successfully");
		});
		QUnit.test("handleCDSSave", function(assert) {
			var oAppController = CDS;
			var oView = {
				cds: [{
					cdsUsageTypeKeysArray: ["Analytics", "API Interface"],
					cdsUsageTypeString:"Analytics, API Interface",
					cds_artifact: "Cube View",
					isanalytics: true,
					isapiinterface:	true,
					isbwextraction:	false,
					isdataextraction:false,
					isextensibility:false,
					iskeystructure:	false,
					issearch:false,
					release_status:	"",
					sap_bo_type:"GeminiDemo2",
					view_name:"Dummy",
					new_row: true
				}]
			};
		//	var oViewConvert
			var oTableCDSEdit = new sap.m.Table();
			var oTableCDS = new sap.m.Table();
			var cdsAdd = new sap.m.Button();
			var cdsCombo = new sap.m.Select();
			var usageType = new sap.m.ComboBox();
			var cdsViewName = new sap.m.Input();
			var getid = {
				byId: function(sName) {
					if (sName === "TableActualCDSnonEdit") {
						return oTableCDSEdit;
					} else if (sName === "TableActualCDS") {
						return oTableCDS;
					} else if (sName === "CDSadd") {
						return cdsAdd;
					} else if (sName === "artifactCDSCombo") {
						return cdsCombo;
					} else if (sName === "usageType") {
						return usageType;
					} else {
						return cdsViewName;
					}
				}

			};
			var oControllerStub = {
				sObj: "GeminiDemo2",
				oTable: new sap.ui.model.json.JSONModel(oView),
				oModel: new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/CA_BUSINESS_REPOSITORY_SRV", true),
				getView: function() {
					return getid;
				},
				formUsageTypeString: function() {},
				convertUsageTypeToFlags: function() {
					return oView;
				},
				aCDSDel: [{
					sap_bo_type: "GeminiDemo2",
					cds_artifact: "",
					view_name: ""
				}
				]
				
			};
			var fn = oAppController.handleSaveCDS.bind(oControllerStub);
			fn(oControllerStub);
			var x = oControllerStub.oTable.getProperty("/cds");
			if (x[0].new_row === "")
			{
				var isTrue = undefined;
			}
		assert.equal(isTrue, undefined, "Create is working" );

		});
		QUnit.test("deleteCDSItems", function(assert) {
			var oAppController = CDS;
			var oResourceModel = new ResourceModel({
				bundleName: "s4.cfnd.geminiobjectpage.i18n.i18n"
			});
			var oTableCDS = new sap.m.Table();
				oTableCDS.setMode("SingleSelect");     
			var oCDSArtifactColumn = new sap.m.Column("cdsArtifact", {
				header: new sap.m.Label({
					text: "cdsartifact"
				})
			});
		oTableCDS.addColumn(oCDSArtifactColumn);
			var oColumnListItem = new sap.m.ColumnListItem({
				cells: [
					new sap.m.Input({
						value: "New"
					}),
					
				]
			});
			oTableCDS.addItem(oColumnListItem);
			oTableCDS.setSelectedItem(oColumnListItem, true);
				var oView = {
				cds: [{
					cdsUsageTypeKeysArray: ["Analytics", "API Interface"],
					cdsUsageTypeString:"Analytics, API Interface",
					cds_artifact: "Cube View",
					isanalytics: true,
					isapiinterface:	true,
					isbwextraction:	false,
					isdataextraction:false,
					isextensibility:false,
					iskeystructure:	false,
					issearch:false,
					release_status:	"",
					sap_bo_type:"GeminiDemo2",
					view_name:"Dummy",
					new_row: true
				}]
			};
			
			var getid = {
				byId : function(sName)
				{
					if (sName === "TableActualCDS")
					{
						return oTableCDS;
					}
				},
				getModel : function(sName)
				{
					if(sName === "Gemini")
					{
						return new sap.ui.model.json.JSONModel(oView);
					}
					if(sName === "i18n")
					{
						return oResourceModel;
					}
				}
			};
			var oControllerStub = {
				adelCountCDS: [],
				tmpModelCDS: new sap.ui.model.json.JSONModel(oView),
				oTable: new sap.ui.model.json.JSONModel(oView),
				getView: function()
				{
					return getid;
				},
				getParameter: function()
				{
					return oColumnListItem;
				}
			};
          var fn = oAppController.deleteCDSItems.bind(oControllerStub);
          fn(oControllerStub);
          assert.equal(true, true, "delete is working");
          oCDSArtifactColumn.destroy();
          oColumnListItem.destroy();
          oTableCDS.destroy();
		});
		QUnit.test("formUsageTypeString", function(assert)
		{
			var oAppController = CDS;
			var oView = {
				cds: [{
					cdsUsageTypeKeysArray: ["Analytics", "API Interface", "Extensibility", "Key Structure", "BW Extraction", "Data Extraction", "Search"],
					usagetypeString:"Analytics, API Interface",
					cdsUsageTypeString: "",
					cds_artifact: "Cube View",
					isanalytics: true,
					isapiinterface:	true,
					isbwextraction:	true,
					isdataextraction:true,
					isextensibility:true,
					iskeystructure:	true,
					issearch:false,
					release_status:	"",
					sap_bo_type:"GeminiDemo2",
					view_name:"Dummy",
					new_row: true
					
			
				}]
			};
			var oControllerStub = {
				oTable : new sap.ui.model.json.JSONModel(oView),
			};
			var fn = oAppController.formUsageTypeString.bind(oControllerStub);
			fn(oControllerStub);
			var x = oControllerStub.oTable.getProperty("/cds");
			if (x[0].cdsUsageTypeString.trim() !== "")
			{
				var istrue = 1;
			}
			assert.equal(istrue, 1, "usage type string formed");
			
		});
		// QUnit.test("onCDSArtifactSelected",function(assert)
		// {
		// 	var oAppController = CDS;
		// 	var oControllerStub = {};
		// });

	});