sap.ui.define([
	
		"s4/cfnd/geminiobjectpage/controller/API",
		"s4/cfnd/geminiobjectpage/controller/Object.controller",
		//            "s4/cfnd/geminiobjectpage/controller/API",
		"sap/ui/model/resource/ResourceModel",
		"sap/ui/base/ManagedObject",
		"sap/ui/core/Control",
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/json/JSONModel",
		"sap/ui/model/odata/ODataModel",
		"sap/ui/thirdparty/sinon",
		"sap/ui/thirdparty/sinon-qunit"

	],
	//1. sivaluehelpexceptactuals : data for array- ie. getapi - for succesful odata response.
	//2. uiwriteintoapiactuals : data for proper odata response
	//3. OnBtnMapDelAPI : messagebox confirm
	//4. deleteAPIitems : messagebox confirm and seteditable in deleteitems
	//5. handleconfirm : setselectedkey
	function(API, ObjectController, ResourceModel, ManagedObject, Control, Controller, JSONModel) {
		"use strict";

		var apimap = new sap.m.Input("APIMAP", {
			value: "API_BILLING_DOCUMENT_SRV_0001"
		});
		var actualRelAPI = new sap.m.Input("ActualReleaseAPI", {
			value: "1805"
		});
		var csAPI = new sap.m.Input("csPlanVal", {
			value: "SAP_COM_000"
		});
		var csAPIText = new sap.m.Text("csPlan", {
			text: "SAP_COM_000"
		});

		QUnit.module("API - test methods", {
			beforeEach: function() {

				this.apimap = new sap.m.Input();
				this.actualRelAPI = new sap.m.Input();
				this.csAPI = new sap.m.Input();
				this.csAPIText = new sap.m.Text();
			},
			afterEach: function() {
				this.apimap.destroy();
				this.actualRelAPI.destroy();
				//            this.csAPI.destory();
				this.csAPIText.destroy();

			}
		});

		QUnit.test("onaddPlanAPI", function(assert) {
			var oAppController = API;
			var oResourceModel = new ResourceModel({
				bundleName: "s4.cfnd.geminiobjectpage.i18n.i18n"
			});
			var oView = {

				api: [],

				apiplan: [],

				apiPlanProtocol: [],
				apiCRUDFlag: [],
				apiChangeType: [],

				apiConvertSIValueHelp: [],
				apiConvertSIValueHelpExceptActuals: {}

			};
			var oActualRelease = new sap.m.Column();
			var oTablePlanAPI = new sap.m.Table();
			oTablePlanAPI.addColumn(oActualRelease);
			// var p = {
			//            getProperty: function(sName) {
			//                            var apiplan = [{

			//                                            api_id: "",
			//                                            sap_bo_type: "",
			//                                            protocol: "",
			//                                            area: "",
			//                                            read_applicable: false,
			//                                            create_applicable: false,
			//                                            update_applicable: false,
			//                                            delete_applicable: false,
			//                                            target_release: "",
			//                                            description: "",
			//                                            status: "",
			//                                            change_type: "",
			//                                            status_colour: "",
			//                                            status_icon: "",
			//                                            tool_tip: "",
			//                                            mapped_service_interface: "",
			//                                            actual_release: "",
			//                                            jira_backlog: "",
			//                                            jira_backlog_link: "",
			//                                            jira_valid: '1'
			//                            }];
			//                            if (sName === "/apiplan") {
			//                                            return apiplan;
			//                            }
			//            },

			// };  
			

			var a = {
				getModel: function(sName) {
					if (sName === "Gemini") {
						return new sap.ui.model.json.JSONModel(oView);
					}
					if(sName === "i18n")
					{
						return oResourceModel;
					}
				},
				byId: function(sName) {
					if (sName === "actualReleaseAPI") {
						return oActualRelease;
					} else {
						return oTablePlanAPI;
					}
				}
			};

			var oControllerStub = {
				uniqueEntryAPIPlanID: 1,
				getView: function() {
					return a;
				},
				handleValueState: function() {}
			};
			var fnAPI = oAppController.onaddPlanAPI.bind(oControllerStub);
			fnAPI(oControllerStub);
			var x = oControllerStub.getView().getModel("Gemini").getProperty("/apiplan");
			if (x[0].api_id === "2") {
				var isTrue = 1;
			}

			assert.equal(isTrue, 1, "The new entry has been added");
		});
		QUnit.test("fnDisplayButton", function(assert)
			{
				var oAppController = API;
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
						if(sName === "TablePlanAPI")
						{
							return oTablePlanExt;
						}
						if(sName === "BtnDelAPI")
						{
							return oDelExt;
						}
						if(sName === "BtnConvertAPI")
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
		// QUnit.test("APIJirachange", function(assert) {
		//            var oAppController = API;
		//            var oTablePlanAPI = new sap.m.Table();
		//            var oJiraColumn = new sap.m.Column("JiraAPI", {
		//                            header: new sap.m.Label({
		//                                            text: "Jira ID"
		//                            })
		//            });
		//            oTablePlanAPI.addColumn(oJiraColumn);
		//            var oColumnJiraAPI = new sap.m.ColumnListItem({
		//                            cells: [
		//                                            new sap.m.Input({
		//                                                            value: "CFNDRCBLR3-119"
		//                                            })
		//                            ]
		//            });
		//            oTablePlanAPI.addItem(oColumnJiraAPI);
		//            var oView = {

		//                            migr: [],
		//                            output: [],
		//                            businessContext: [],
		//                            comment: [],
		//                            api: [{
		//                                            apitype: "ODATA",
		//                                            comm: "SAP_COM_0120",
		//                                            create: "No",
		//                                            entityset: undefined,
		//                                            protocol: "ODATA",
		//                                            read: "Yes",
		//                                            si: "API_BILLING_DOCUMENT_SRV_0001"
		//                            }],
		//                            events: [],
		//                            eventIdHelp: [],
		//                            apiplan: [{
		//                                            api_id: "40f2e9af-be79-1ed8-8393-adad2fb8d511",
		//                                            area: "CLOUDFND",
		//                                            change_type: "New",
		//                                            communication_scenario: "",
		//                                            create_applicable: true,
		//                                            delete_applicable: false,
		//                                            description: "test08",
		//                                            jira_backlog: "CFNDRCBLR3-119",
		//                                            jira_backlog_link: "", //"https://sapjira.wdf.sap.corp/browse/CFNDRCBLR3-119"
		//                                            jira_valid: "1",
		//                                            mapped_service_interface: "",
		//                                            protocol: "ODATA",
		//                                            read_applicable: true,
		//                                            sap_bo_type: "GeminiDemo2",
		//                                            status: "",
		//                                            status_colour: "Red",
		//                                            status_icon: "sap-icon://circle-task",
		//                                            target_release: "1705",
		//                                            tool_tip: "Passed the planned release",
		//                                            update_applicable: true
		//                            }],
		//                            extplan: [],
		//                            apiPlanProtocol: [],
		//                            apiCRUDFlag: [],
		//                            apiChangeType: [],
		//                            extType: [],
		//                            currentRelease: [],
		//                            //            aAnalyticsPlan: [],
		//                            apiConvertSIValueHelp: [],
		//                            apiConvertSIValueHelpExceptActuals: {
		//                                            ServiceInterface: "",
		//                                            communication_scenario_id: "",
		//                                            ibis_id: "",
		//                                            protocol: "",
		//                                            service_interface_wov: ""

		//                            },
		//                            cds: [],
		//                            cdsArtifactList: [],
		//                            cdsUsageTypeList: []

		//            };
		//            var getModel = {
		//                            getModel: function(sName) {
		//                                            if (sName === "Gemini") {
		//                                                            return new sap.ui.model.json.JSONModel(oView);
		//                                            }
		//                            },
		//                            byId: function(sName) {
		//                                            if (sName === "TablePlanAPI") {
		//                                                            return oTablePlanAPI;
		//                                            }
		//                                            if (sName === "jiraAPI") {
		//                                                            return oJiraColumn;
		//                                            }
		//                            }
		//            };
		//            var oControllerStub = {
		//                            getView: function() {
		//                                            return getModel;
		//                            },
		//                            getParameter: function(sName) {
		//                                            if (sName === "id") {
		//                                                            var APIRowText =
		//                                                                            "application-Gemini-display-component---object--jiraExtInput-application-Gemini-display-component---object--TablePlanAPI-0";
		//                                                            return APIRowText;
		//                                            }
		//                                            if (sName === "value") {
		//                                                            return "CFNDRCBLR3-119";
		//                                            }
		//                            }

		//            };
		//            var fn = oAppController.APIJiraChange.bind(oControllerStub);
		//            //fn(oEvent);
		//            assert.equal(fn(oControllerStub), JSON.stringify(), "The function JiraChangeAPI is passed succesfully");
		//            oJiraColumn.destroy();
		//            oColumnJiraAPI.destroy();
		//            oTablePlanAPI.destroy();

		// });
		// QUnit.test("checkAPIJiraChangeNoEntry", function(assert) {
		//            var oAppController = API;
		//            var oTablePlanAPI = new sap.m.Table();
		//            var oJiraColumn = new sap.m.Column("JiraAPI", {
		//                            header: new sap.m.Label({
		//                                            text: "Jira ID"
		//                            })
		//            });
		//            oTablePlanAPI.addColumn(oJiraColumn);
		//            var oColumnJiraAPI = new sap.m.ColumnListItem({
		//                            cells: [
		//                                            new sap.m.Input({
		//                                                            value: "CFNDRCBLR3-119"
		//                                            })
		//                            ]
		//            });
		//            oTablePlanAPI.addItem(oColumnJiraAPI);
		//            var oView = {

		//                            migr: [],
		//                            output: [],
		//                            businessContext: [],
		//                            comment: [],
		//                            api: [{
		//                                            apitype: "ODATA",
		//                                            comm: "SAP_COM_0120",
		//                                            create: "No",
		//                                            entityset: undefined,
		//                                            protocol: "ODATA",
		//                                            read: "Yes",
		//                                            si: "API_BILLING_DOCUMENT_SRV_0001"
		//                            }],
		//                            events: [],
		//                            eventIdHelp: [],
		//                            apiplan: [{
		//                                            api_id: "40f2e9af-be79-1ed8-8393-adad2fb8d511",
		//                                            area: "CLOUDFND",
		//                                            change_type: "New",
		//                                            communication_scenario: "",
		//                                            create_applicable: true,
		//                                            delete_applicable: false,
		//                                            description: "test08",
		//                                            jira_backlog: "CFNDRCBLR3-119",
		//                                            jira_backlog_link: "", //"https://sapjira.wdf.sap.corp/browse/CFNDRCBLR3-119"
		//                                            jira_valid: "1",
		//                                            mapped_service_interface: "",
		//                                            protocol: "ODATA",
		//                                            read_applicable: true,
		//                                            sap_bo_type: "GeminiDemo2",
		//                                            status: "",
		//                                            status_colour: "Red",
		//                                            status_icon: "sap-icon://circle-task",
		//                                            target_release: "1705",
		//                                            tool_tip: "Passed the planned release",
		//                                            update_applicable: true
		//                            }],
		//                            extplan: [],
		//                            apiPlanProtocol: [],
		//                            apiCRUDFlag: [],
		//                            apiChangeType: [],
		//                            extType: [],
		//                            currentRelease: [],
		//                            //            aAnalyticsPlan: [],
		//                            apiConvertSIValueHelp: [],
		//                            apiConvertSIValueHelpExceptActuals: {
		//                                            ServiceInterface: "",
		//                                            communication_scenario_id: "",
		//                                            ibis_id: "",
		//                                            protocol: "",
		//                                            service_interface_wov: ""

		//                            },
		//                            cds: [],
		//                            cdsArtifactList: [],
		//                            cdsUsageTypeList: []

		//            };
		//            var getModel = {
		//                            getModel: function(sName) {
		//                                            if (sName === "Gemini") {
		//                                                            return new sap.ui.model.json.JSONModel(oView);
		//                                            }
		//                            },
		//                            byId: function(sName) {
		//                                            if (sName === "TablePlanAPI") {
		//                                                            return oTablePlanAPI;
		//                                            }
		//                                            if (sName === "jiraAPI") {
		//                                                            return oJiraColumn;
		//                                            }
		//                            }
		//            };
		//            var oControllerStub = {
		//                            getView: function() {
		//                                            return getModel;
		//                            },
		//                            getParameter: function(sName) {
		//                                            if (sName === "id") {
		//                                                            var APIRowText =
		//                                                                            "application-Gemini-display-component---object--jiraExtInput-application-Gemini-display-component---object--TablePlanAPI-0";
		//                                                            return APIRowText;
		//                                            }
		//                                            if (sName === "value") {
		//                                                            return "";
		//                                            }
		//                            }

		//            };
		//            var fn = oAppController.APIJiraChange.bind(oControllerStub);
		//            //fn(oEvent);
		//            assert.equal(fn(oControllerStub), JSON.stringify(), "The function JiraChangeAPI when no entryis given is passed succesfully");
		//            oJiraColumn.destroy();
		//            oColumnJiraAPI.destroyCells();
		//            oTablePlanAPI.destroy();

		// });
		QUnit.test("OnBtnMapDelAPI", function(assert) {
			var oAppController = API;
			var oView = {

				migr: [],
				output: [],
				businessContext: [],
				comment: [],
				api: [],
				events: [],
				eventIdHelp: [],
				apiplan: [{
					api_id: "40f2e9af-be79-1ed8-8393-adad2fb8d511",
					area: "CLOUDFND",
					change_type: "New",
					communication_scenario: "",
					create_applicable: true,
					delete_applicable: false,
					description: "test08",
					jira_backlog: "CFNDRCBLR3-119",
					jira_backlog_link: "", //"https://sapjira.wdf.sap.corp/browse/CFNDRCBLR3-119"
					jira_valid: "1",
					mapped_service_interface: "",
					protocol: "ODATA",
					read_applicable: true,
					sap_bo_type: "GeminiDemo2",
					status: "",
					status_colour: "Red",
					status_icon: "sap-icon://circle-task",
					target_release: "1705",
					tool_tip: "Passed the planned release",
					update_applicable: true
				}],

				extplan: [],
				apiPlanProtocol: [],
				apiCRUDFlag: [],
				apiChangeType: [],
				extType: [],
				currentRelease: [],
				//            aAnalyticsPlan: [],
				apiConvertSIValueHelp: [],
				apiConvertSIValueHelpExceptActuals: {},
				cds: [],
				cdsArtifactList: [],
				cdsUsageTypeList: []

			};
			var oTablePlanAPIDel = new sap.m.Table();
			oTablePlanAPIDel.setMode("SingleSelect");
			var oChangeTypeAPIColumn = new sap.m.Column("changeTypeAPI", {
				header: new sap.m.Label({
					text: "Jira ID"
				})
			});
			oTablePlanAPIDel.addColumn(oChangeTypeAPIColumn);
			var oColumnChangeType = new sap.m.ColumnListItem({
				cells: [
					new sap.m.Input({
						value: ""
					})
				]
			});
			oTablePlanAPIDel.addItem(oColumnChangeType);
			oTablePlanAPIDel.setSelectedItem(oColumnChangeType, true);
			var oResourceModel = new ResourceModel({
				bundleName: "s4.cfnd.geminiobjectpage.i18n.i18n"
			});
			var getid = {
				byId: function(sName) {
					if (sName === "TablePlanAPI") {
						return oTablePlanAPIDel;
					}
					if (sName === "changeTypeAPI") {
						return oChangeTypeAPIColumn;
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
				aAPIPlanDel: [],
				oTable: new sap.ui.model.json.JSONModel(oView),
				getView: function() {
					return getid;
				},
				byId: function(sName) {
					if (sName === "TablePlanAPI") {
						return oTablePlanAPIDel;
					}
				},
				handleValueState: function() {}

			};
			var fnOnBtnMapDelAPI = oAppController.onBtnMapDelAPI.bind(oControllerStub);
			//oAppController.onBtnMapDelAPI(oEvent);    

			assert.equal(fnOnBtnMapDelAPI(oControllerStub), JSON.stringify(), "The function onBtnMapDelAPI is passed succesfully");
			oChangeTypeAPIColumn.destroy();
			oColumnChangeType.destroy();
			oTablePlanAPIDel.destroy();

		});
		// QUnit.test("deleteAPIItems", function(assert)
		// {
		//            var oAppController = API;
		//            var oView = {

		//                            migr: [],
		//                            output: [],
		//                            businessContext: [],
		//                            comment: [],
		//                            api: [{
		//                                            apitype: "ODATA",
		//                                            comm: "SAP_COM_0120",
		//                                            create: "No",
		//                                            entityset: undefined,
		//                                            protocol: "ODATA",
		//                                            read: "Yes",
		//                                            si: "API_BILLING_DOCUMENT_SRV_0001"
		//                            }],
		//                            events: [],
		//                            eventIdHelp: [],
		//                            apiplan: [{
		//                                            api_id: "40f2e9af-be79-1ed8-8393-adad2fb8d511",
		//                                            area: "CLOUDFND",
		//                                            change_type: "New",
		//                                            communication_scenario: "",
		//                                            create_applicable: true,
		//                                            delete_applicable: false,
		//                                            description: "test08",
		//                                            jira_backlog: "CFNDRCBLR3-119",
		//                                            jira_backlog_link: "", //"https://sapjira.wdf.sap.corp/browse/CFNDRCBLR3-119"
		//                                            jira_valid: "1",
		//                                            mapped_service_interface: "",
		//                                            protocol: "ODATA",
		//                                            read_applicable: true,
		//                                            sap_bo_type: "GeminiDemo2",
		//                                            status: "",
		//                                            status_colour: "Red",
		//                                            status_icon: "sap-icon://circle-task",
		//                                            target_release: "1705",
		//                                            tool_tip: "Passed the planned release",
		//                                            update_applicable: true
		//                            }],

		//                            extplan: [],
		//                            apiPlanProtocol: [],
		//                            apiCRUDFlag: [],
		//                            apiChangeType: [],
		//                            extType: [],
		//                            currentRelease: [],
		//                            //            aAnalyticsPlan: [],
		//                            apiConvertSIValueHelp: [],
		//                            apiConvertSIValueHelpExceptActuals: {},
		//                            cds: [],
		//                            cdsArtifactList: [],
		//                            cdsUsageTypeList: []

		//            };
		//                            var oResourceModel = new ResourceModel({
		//                            bundleName: "s4.cfnd.geminiobjectpage.i18n.i18n"
		//            });
		//            var oTablePlanAPIDelItm = new sap.m.Table();
		//            oTablePlanAPIDelItm.setMode("SingleSelect");
		//            var oChangeTypeAPIColumn = new sap.m.Column("changeTypeAPI", {
		//                            header: new sap.m.Label({
		//                                            text: "Jira ID"
		//                            })
		//            });
		//            oTablePlanAPIDelItm.addColumn(oChangeTypeAPIColumn);
		//            var oRowPlanAPI = new sap.m.ColumnListItem({
		//                            cells: [
		//                                            new sap.m.Input({
		//                                                            value: "New"
		//                                            })
		//                            ]
		//            });
		//            oTablePlanAPIDelItm.addItem(oRowPlanAPI);
		//            oTablePlanAPIDelItm.setSelectedItem(oRowPlanAPI, true);

		//            var oTabPlanAPI =  new sap.m.Table();
		//            var oActualReleaseColumn = new sap.m.Column("actualReleaseAPI", {
		//                            header: new sap.m.Label({
		//                                            text: "Jira ID"
		//                            })
		//            });
		//            var oMapSIColumn = new sap.m.Column("mapped_service_interface", {
		//                            header: new sap.m.Label({
		//                                            text: "Jira ID"
		//                            })
		//            });
		//            oTabPlanAPI.addColumn(oActualReleaseColumn);
		//            oTabPlanAPI.addColumn(oMapSIColumn);
		//            var oRowTabPlanAPI = new sap.m.ColumnListItem({
		//                            cells: [
		//                                            new sap.m.Input({
		//                                                            value: "1708"
		//                                            }),
		//                                                            new sap.m.Input({
		//                                                            value: "API_BILLING_DO"
		//                                            })
		//                            ]
		//            });
		//            oTabPlanAPI.addItem(oRowTabPlanAPI);
		//            var getview = {
		//                            getModel: function(sName)
		//                            {
		//                                            if(sName === "Gemini")
		//                                            {return new sap.ui.model.json.JSONModel(oView);}
		//                                            if(sName === "i18n")
		//                                            {
		//                                                            return oResourceModel;
		//                                            }
		//                            },
		//                            byId: function(sName)
		//                            {
		//                                            if (sName === "idTable6")
		//                                            {return oTablePlanAPIDelItm;}
		//                                            if (sName === "changeTypeAPI")
		//                                            {
		//                                                            return oChangeTypeAPIColumn ;
		//                                            }
		//                                            if (sName === "TablePlanAPI"){
		//                                                return oTabPlanAPI;
		//                                            }
		//                            }
		//            };
		//            var oControllerStub = {
		//               tmpModel2:  [{
		//                                            apitype: "ODATA",
		//                                            comm: "SAP_COM_0120",
		//                                            create: "No",
		//                                            entityset: undefined,
		//                                            protocol: "ODATA",
		//                                            read: "Yes",
		//                                            si: "API_BILLING_DOCUMENT_SRV_0001"
		//                            }],
		//               adelCountapi: 0,
		//               aApidel: [],
		//                            getView: function()
		//                            {
		//                                            return getview;
		//                            },
		//                                            byId: function(sName)
		//                            {
		//                                            if (sName === "idTable6")
		//                                            {return oTablePlanAPIDelItm;}
		//            },
		//            getParameter: function(sName)
		//            {
		//                            if(sName === "listItem")
		//                            {
		//                                            return oRowPlanAPI;
		//                            }
		//            },
		//            handleValueState: {}
		//            };
		//            var fn = oAppController.deleteAPIItems.bind(oControllerStub);
		//            assert.equal(fn(oControllerStub), undefined, "Deleted Successfully");
		//            oChangeTypeAPIColumn.destroy();
		//            oActualReleaseColumn.destroy();
		//            oTablePlanAPIDelItm.destroy();
		//            oTabPlanAPI.destroy();
		// });
		QUnit.test("onAPIPlanChangeTypeSelected", function(assert) {
			var oAppControllerStub = API;
			var oView = {

				migr: [],
				output: [],
				businessContext: [],
				comment: [],
				api: [{
					apitype: "ODATA",
					comm: "SAP_COM_0120",
					create: "No",
					entityset: undefined,
					protocol: "ODATA",
					read: "Yes",
					si: "API_BILLING_DOCUMENT_SRV_0001"
				}],
				events: [],
				eventIdHelp: [],
				apiplan: [{
					api_id: "40f2e9af-be79-1ed8-8393-adad2fb8d511",
					area: "CLOUDFND",
					change_type: "New",
					communication_scenario: "",
					create_applicable: true,
					delete_applicable: false,
					description: "test08",
					jira_backlog: "CFNDRCBLR3-119",
					jira_backlog_link: "", //"https://sapjira.wdf.sap.corp/browse/CFNDRCBLR3-119"
					jira_valid: "1",
					mapped_service_interface: "",
					protocol: "ODATA",
					read_applicable: true,
					sap_bo_type: "GeminiDemo2",
					status: "",
					status_colour: "Red",
					status_icon: "sap-icon://circle-task",
					target_release: "1705",
					tool_tip: "Passed the planned release",
					update_applicable: true
				}],
				extplan: [],
				apiPlanProtocol: [],
				apiCRUDFlag: [],
				apiChangeType: [],
				extType: [],
				currentRelease: [],
				//            aAnalyticsPlan: [],
				apiConvertSIValueHelp: [],
				apiConvertSIValueHelpExceptActuals: {
					ServiceInterface: "",
					communication_scenario_id: "",
					ibis_id: "",
					protocol: "",
					service_interface_wov: ""

				},
				cds: [],
				cdsArtifactList: [],
				cdsUsageTypeList: []

			};
			var getmodel = {
				getModel: function(sName) {
					if (sName === "Gemini") {
						return new sap.ui.model.json.JSONModel(oView);
					}
				}
			};
			var getId = {
				getId: function() {
					return "application-Gemini-manage-component---object--changeTypeAPICombo-application-Gemini-manage-component---object--TablePlanAPI-0";
				}
			};
			var oControllerStub = {
				oTable: new sap.ui.model.json.JSONModel(oView),
				getView: function() {
					return getmodel;
				},
				getSource: function() {
					return getId;
				},
				getParameter: function(sName) {
					if (sName === "value") {
						return "Enhancement";
					}
				}
			};
			var fn = oAppControllerStub.onAPIPlanChangeTypeSelected.bind(oControllerStub);
			assert.equal(fn(oControllerStub), undefined, "The change type is tested");

		});

		QUnit.test("onSIAdd", function(assert) {

			var oAppController = API;
			var oView = {

				api: [],

				apiplan: [],

				apiPlanProtocol: [],
				apiCRUDFlag: [],
				apiChangeType: [],

				apiConvertSIValueHelp: [],
				apiConvertSIValueHelpExceptActuals: {}

			};
			var commsceCol = new sap.m.Column();
			var cudcol = new sap.m.Column();
			var readCol = new sap.m.Column();
			var protoCol = new sap.m.Column();
			var oTablePlanAPI = new sap.m.Table();

			var a = {
				getModel: function(sName) {
					if (sName === "Gemini") {
						return new sap.ui.model.json.JSONModel(oView);
					}
				},
				byId: function(sName) {
					if (sName === "idTable6") {
						return oTablePlanAPI;
					} else if (sName === "communicationScenarioCol") {
						return commsceCol;
					} else if (sName === "protocolCol") {
						return protoCol;
					} else if (sName === "readApplicableCol") {
						return readCol;
					} else {
						return cudcol;
					}
				}
			};

			var oControllerStub = {
				getView: function() {
					return a;
				},
				handleValueState: function() {}
			};

			var fnSIAdd = oAppController.onSIAdd.bind(oControllerStub);
			fnSIAdd(oControllerStub);
			var x = oControllerStub.getView().getModel("Gemini").getProperty("/api");
			if (x[0].new_row === true) {
				var isTrue = 1;
			}

			//            assert.ok(flag, "1" , "The new1 entry has been added");
			assert.equal(isTrue, 1, "The SI entry has been added");
		});

		QUnit.test("siValueHelpAPIExceptActuals", function(assert) {
			//ask krithika for the proper test data
			var oAppcontroller = API;
			var oView = {

				migr: [],
				output: [],
				businessContext: [],
				comment: [],
				api: [{
					apitype: "ODATA",
					comm: "SAP_COM_0120",
					create: "No",
					entityset: undefined,
					protocol: "ODATA",
					read: "Yes",
					si: "API_BILLING_DOCUMENT_SRV_0001"
				}],
				events: [],
				eventIdHelp: [],
				apiplan: [],
				extplan: [],
				apiPlanProtocol: [],
				apiCRUDFlag: [],
				apiChangeType: [],
				extType: [],
				currentRelease: [],
				//            aAnalyticsPlan: [],
				apiConvertSIValueHelp: [],
				apiConvertSIValueHelpExceptActuals: {
					ServiceInterface: "",
					communication_scenario_id: "",
					ibis_id: "",
					protocol: "",
					service_interface_wov: ""

				},
				cds: [],
				cdsArtifactList: [],
				cdsUsageTypeList: []

			};
			var protocol = "ODATA";
			var a = {
				getModel: function(sName) {

					if (sName === "Gemini") {
						return new sap.ui.model.json.JSONModel(oView);
					}
				}
			};

			var oControllerStub = {

				oModel: new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/CA_BUSINESS_REPOSITORY_SRV", true),
				oTable: new sap.ui.model.json.JSONModel(oView),
				getView: function() {
					return a;
				}

			};
			var objectSI = {
				ServiceInterface: "",
				communication_scenario_id: "",
				ibis_id: "",
				protocol: "",
				service_interface_wov: ""
			};

			var fnValueHelpAPI = oAppcontroller.siValueHelpAPIExceptActuals(oControllerStub, protocol);
			// assert.equal(oControllerStub.oTable.getProperty("/apiConvertSIValueHelpExceptActuals"), objectSI,
			//            "apiConvertSIValueHelpExceptActuals PROPERTY IS SET");
			assert.equal(fnValueHelpAPI, undefined, "The API entry has been added");
		});

		QUnit.test("uiWriteIntoAPIActuals", function(assert) {
			//last three lines are running in the debugger but does not come in the percentage
			var oAppcontroller = API;
			var oView = {

				migr: [],
				output: [],
				businessContext: [],
				comment: [],
				api: [{
					apitype: "ODATA",
					comm: "SAP_COM_0120",
					create: "No",
					entityset: undefined,
					protocol: "ODATA",
					read: "Yes",
					si: "API_BILLING_DOCUMENT_SRV_0001"
				}],
				events: [],
				eventIdHelp: [],
				apiplan: [],
				extplan: [],
				apiPlanProtocol: [],
				apiCRUDFlag: [],
				apiChangeType: [],
				extType: [],
				currentRelease: [],
				//            aAnalyticsPlan: [],
				apiConvertSIValueHelp: [],
				apiConvertSIValueHelpExceptActuals: {
					ServiceInterface: "",
					communication_scenario_id: "",
					ibis_id: "",
					protocol: "",
					service_interface_wov: ""

				},
				cds: [],
				cdsArtifactList: [],
				cdsUsageTypeList: []

			};
			var APIMAPObj = {
				actual_release: "1805",
				api_id: "40f2e9af-be79-1ed8-8393-adad2fb8d511",
				communicationscenario: "SAP_COM_0229",
				mapped_service_interface: "ANA_PAI_PF_SRV_0001",
				service_interface_wov: "ANA_PAI_PF_SRV"

			};
			var si_wov = "ANA_PAI_PF_SRV";
			var protocol = "ODATA";
			var a = {
				getModel: function(sName) {

					if (sName === "Gemini") {
						return new sap.ui.model.json.JSONModel(oView);
					}
				}
			};
			var oControllerStub = {

				oModel: new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/CA_BUSINESS_REPOSITORY_SRV", true),
				oTable: new sap.ui.model.json.JSONModel(oView),
				getView: function() {
					return a;
				}

			};
			var fnUIWriteIntoAPIActuals = oAppcontroller.uiWriteIntoAPIActuals(APIMAPObj, protocol, si_wov, oControllerStub);
			assert.equal(fnUIWriteIntoAPIActuals, undefined, "Converted to Actuals");

		});

//		QUnit.test("CrudOperationsAPI", function(assert) {
//			var oAppcontroller = API;
//			var oView = {
//
//				migr: [],
//				output: [],
//				businessContext: [],
//				comment: [],
//				api: [{
//					apitype: "ODATA",
//					comm: "SAP_COM_0120",
//					create: "No",
//					entityset: undefined,
//					protocol: "ODATA",
//					read: "Yes",
//					si: "API_BILLING_DOCUMENT_SRV_0001"
//				}],
//				events: [],
//				eventIdHelp: [],
//				apiplan: [],
//				extplan: [],
//				apiPlanProtocol: [],
//				apiCRUDFlag: [],
//				apiChangeType: [],
//				extType: [],
//				currentRelease: [],
//				//            aAnalyticsPlan: [],
//				apiConvertSIValueHelp: [],
//				apiConvertSIValueHelpExceptActuals: [],
//				cds: [],
//				cdsArtifactList: [],
//				cdsUsageTypeList: []
//
//			};
//			var oTablePlanAPICrud = new sap.m.Table();
//			var oJiraColumn = new sap.m.Column("protocol", {
//				header: new sap.m.Label({
//					text: "Jira ID"
//				})
//			});
//			oTablePlanAPICrud.addColumn(oJiraColumn);
//			var oColumnJiraAPI = new sap.m.ColumnListItem({
//				cells: [
//					new sap.m.Input({
//						value: "CFNDRCBLR3-119"
//					})
//				]
//			});
//			oTablePlanAPICrud.addItem(oColumnJiraAPI);
//
//			var getmodel = {
//				getModel: function(sName) {
//					if (sName === "Gemini") {
//						return new sap.ui.model.json.JSONModel(oView);
//					}
//				}
//			};
//			var oControllerStub = {
//				sObj: "GeminiDemo2",
//				oModel: new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/CA_BUSINESS_REPOSITORY_SRV", true),
//				oTable: new sap.ui.model.json.JSONModel(oView),
//				aApidel: [{
//					apitype: "ODATA",
//					comm: "",
//					protocol: "SOAP",
//					service_interface_wov: "ECC_SUPLRINVCERPCRTRC",
//					si: "ECC_SUPLRINVCERPCRTRC"
//				}],
//				aAPIPlanMap: [],
//				aAPIPlanDel: [],
//				tmpModelAPIPlan: [{
//					api_id: "40f2e9af-be79-1ed8-8393-adad2fb8d511",
//					area: "CLOUDFND",
//					change_type: "New",
//					communication_scenario: "",
//					create_applicable: true,
//					delete_applicable: false,
//					description: "test08",
//					jira_backlog: "CFNDRCBLR3-119",
//					jira_backlog_link: "", //"https://sapjira.wdf.sap.corp/browse/CFNDRCBLR3-119"
//					jira_valid: "1",
//					mapped_service_interface: "",
//					protocol: "ODATA",
//					read_applicable: true,
//					sap_bo_type: "GeminiDemo2",
//					status: "",
//					status_colour: "Red",
//					status_icon: "sap-icon://circle-task",
//					target_release: "1705",
//					tool_tip: "Passed the planned release",
//					update_applicable: true
//				}],
//				getView: function() {
//					return getmodel;
//				},
//				byId: function(sName) {
//					if (sName === "TablePlanAPI") {
//						return oTablePlanAPICrud;
//					}
//				}
//			};
//
//			var fnCRUDAPI = oAppcontroller.CRUDOperationsAPI.bind(oControllerStub);
//			assert.equal(fnCRUDAPI(oControllerStub), undefined, "CRUD Operations successful");
//			oJiraColumn.destroy();
//			oColumnJiraAPI.destroy();
//			oTablePlanAPICrud.destroy();
//		});
		// QUnit.test("handleAPIConvertConfirm", function(assert) {
		// 	var oAppController = API;
		// 	var oView = {

		// 		migr: [],
		// 		output: [],
		// 		businessContext: [],
		// 		comment: [],
		// 		api: [{
		// 			apitype: "ODATA",
		// 			comm: "SAP_COM_0120",
		// 			create: "No",
		// 			entityset: undefined,
		// 			protocol: "ODATA",
		// 			read: "Yes",
		// 			si: "API_BILLING_DOCUMENT_SRV_0001"
		// 		}],
		// 		events: [],
		// 		eventIdHelp: [],
		// 		apiplan: [{
		// 			api_id: "40f2e9af-be79-1ed8-8393-adad2fb8d511",
		// 			area: "CLOUDFND",
		// 			change_type: "New",
		// 			communication_scenario: "",
		// 			create_applicable: true,
		// 			delete_applicable: false,
		// 			description: "test08",
		// 			jira_backlog: "CFNDRCBLR3-119",
		// 			jira_backlog_link: "", //"https://sapjira.wdf.sap.corp/browse/CFNDRCBLR3-119"
		// 			jira_valid: "1",
		// 			mapped_service_interface: "",
		// 			protocol: "ODATA",
		// 			read_applicable: true,
		// 			sap_bo_type: "GeminiDemo2",
		// 			status: "",
		// 			status_colour: "Red",
		// 			status_icon: "sap-icon://circle-task",
		// 			target_release: "1705",
		// 			tool_tip: "Passed the planned release",
		// 			update_applicable: true
		// 		}],
		// 		extplan: [],
		// 		apiPlanProtocol: [],
		// 		apiCRUDFlag: [],
		// 		apiChangeType: [],
		// 		extType: [],
		// 		currentRelease: [],
		// 		//            aAnalyticsPlan: [],
		// 		apiConvertSIValueHelp: [],
		// 		apiConvertSIValueHelpExceptActuals: [],
		// 		cds: [],
		// 		cdsArtifactList: [],
		// 		cdsUsageTypeList: []

		// 	};
		// 	var oResourceModel = new ResourceModel({
		// 		bundleName: "s4.cfnd.geminiobjectpage.i18n.i18n"
		// 	});
		// 	var oTableAPIConvert = new sap.m.Table();
		// 	oTableAPIConvert.setMode("SingleSelect");
		// 	var oColumnchangeTypeAPI = new sap.m.Column("changeTypeAPI", {
		// 		header: new sap.m.Label({
		// 			text: "Jira ID"
		// 		})
		// 	});
		// 	oTableAPIConvert.addColumn(oColumnchangeTypeAPI);
		// 	var oColChangeTypeAPI = new sap.m.ColumnListItem({
		// 		cells: [
		// 			new sap.m.Input({
		// 				value: "New"
		// 			})
		// 		]
		// 	});
		// 	//            oColumnchangeTypeAPI.setSelectedKey("New");
		// 	oTableAPIConvert.addItem(oColChangeTypeAPI);
		// 	oTableAPIConvert.setSelectedItem(oColChangeTypeAPI, true);
		// 	var getmodel = {
		// 		getModel: function(sName) {
		// 			if (sName === "Gemini") {
		// 				return new sap.ui.model.json.JSONModel(oView);
		// 			}
		// 			if (sName === "i18n") {
		// 				return oResourceModel;
		// 			}
		// 		},
		// 		byId: function(sName) {
		// 			if (sName === "TablePlanAPI") {
		// 				return oTableAPIConvert;
		// 			}
		// 			if (sName === "changeTypeAPI") {
		// 				return oColumnchangeTypeAPI;
		// 			}
		// 		}
		// 	};
		// 	var oControllerStub = {
		// 		oModel: new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/CA_BUSINESS_REPOSITORY_SRV", true),
		// 		oTable: new sap.ui.model.json.JSONModel(oView),
		// 		aAPIPlanMap: [],
		// 		APIMapObj: {},
		// 		sArea: "CLOUDFND",
		// 		getView: function() {
		// 			return getmodel;
		// 		},
		// 		byId: function(sName) {
		// 			if (sName === "TablePlanAPI") {
		// 				return oTableAPIConvert;
		// 			}
		// 		}
		// 	};
		// 	var fn = oAppController.handleAPIConvertConfirm.bind(oControllerStub);
		// 	assert.equal(fn(oControllerStub), undefined, "Converted to actuals confirm");
		// 	oColumnchangeTypeAPI.destroy();
		// 	oTableAPIConvert.destroy();

		// });

	});