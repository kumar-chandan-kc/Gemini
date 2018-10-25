/*global location*/

sap.ui.define([
	"s4/cfnd/geminiobjectpage/controller/Blocks.controller",
	"s4/cfnd/geminiobjectpage/controller/BaseController",
	"s4/cfnd/geminiobjectpage/controller/Handler",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/resource/ResourceModel",
	"sap/ui/core/routing/History",
	"s4/cfnd/geminiobjectpage/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/Sorter",
	"s4/cfnd/geminiobjectpage/controller/OutputObjects",
	"s4/cfnd/geminiobjectpage/controller/ValueHelp",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox",
	"sap/m/MessagePopover",
	"sap/m/MessagePopoverItem",
	"sap/m/MessageItem",
	"s4/cfnd/geminiobjectpage/controller/Search",
	"s4/cfnd/geminiobjectpage/controller/Extensibility",
	"s4/cfnd/geminiobjectpage/controller/API",
	"s4/cfnd/geminiobjectpage/controller/CDS",
	"s4/cfnd/geminiobjectpage/controller/Events",
	"s4/cfnd/geminiobjectpage/controller/MigrationObjects",
	"s4/cfnd/geminiobjectpage/controller/Fiori",
	"s4/cfnd/geminiobjectpage/controller/NodeType",
	"s4/cfnd/geminiobjectpage/controller/TransportRequest",
	"sap/m/StandardListItem",
	"sap/m/Dialog",
	"sap/m/List",
	"sap/m/Button",
	"sap/m/Label",
	"sap/m/MessageToast",
	"sap/m/Text",
	"sap/m/TextArea",
	"sap/m/ListType"

], function (
	Blocks,
	BaseController,
	Handler,
	JSONModel,
	ResourceModel,
	History,
	formatter,
	Filter,
	Sorter,
	OutputObjects,
	ValueHelp,
	FilterOperator,
	MessageBox,
	MessagePopover,
	MessagePopoverItem,
	MessageItem,
	Search,
	Extensibility,
	API,
	CDS,
	Events,
	MigrationObjects,
	Fiori,
	NodeType,
	TransportRequest,
	Dialog,
	StandaradListItem,
	List,
	Button,
	Label,
	MessageToast,
	Text,
	TextArea

) {
	"use strict";

	return BaseController.extend("s4.cfnd.geminiobjectpage.controller.Object", {
		currRow: null,
		oMessagePopover: {},
		oMessage: [],
		service_interface_wov: "",
		prevValue1API: [],
		prevValue2API: [],
		ipIdAPIPlan: null,
		final: 9999,
		APIMapObj: {},
		APIMapObj2: {},
		APIMap2: null,
		ExtMapObj: null,
		ExtMap: null,
		aMigrPlanDel: [],
		aMigrationActualsDelete: [],
		ipActualReleaseId: null,
		ipMigrationId: null,
		ipBusinessContext: null,
		aAPIPlanMap: [],
		aExtPlanMap: [],
		APIMap: null,
		ipTargetReleaseId: null,
		protocolhelp: [],
		defaultProtocol: null,
		uniqueEntryAPIPlanID: 0,
		uniqueEntryExtPlanID: 0,
		aExtPlanDel: [],
		tmpModelExtPlan: {},
		adelCountExt: 0,
		adelCountExtplan: 0,
		adelCountapiplan: 0,
		aAPIPlanDel: [],
		tmpModelAPIPlan: {},
		isLoaded: false,
		ipId: null,
		eventTaskId: null,
		add: null,
		ipIdAPI: null,
		ipIdEventId: null,
		ipIdEventTask: null,
		ipIdEventNodeTy: null,
		ipIdCS: null,
		adelCount: 0,
		adelCountapi: 0,
		adelCountEvents: 0,
		aOutdel: [],
		aApidel: [],
		Eventdel: [],
		ipIdProtocol: null,
		formatter: formatter,
		tmpModel2: {},
		tmpModel3: {},
		tmpEventValueHelp: {},
		comment: {},
		oR: {},
		oModel: [],
		oTable2: [],
		oTable: [],
		oViewEvents: [],
		atempeventsplan: [],
		aEventPlanDel: [],
		aEventDel: [],
		sRes: [],
		sObj: [],
		ipCDSName: null,
		adelCountCDS: 0,
		aCDSDel: [],
		tmpModelCDS: {},
		sResCDSActual: [],
		sEventsObjectName: null,
		sObjectType: "BO",
		objArray: [],
		badiArray: [],
		migrArray: [],
		odataArray: [],
		cdsViewArray: [],
		businessContextArray: [],
		eventsArray: [],
		oModel2: [],
		objId: null,
		headerModel: {},
		id: 0,
		tmpModel: {},
		apiArray: [],
		sRes2: [],
		sSAPName: null,
		edit: false,
		status: null,
		tempborcl: "",
		oMigrPlanTempModel: [],
		aMigrationActualCopy: [],
		bMigrPlanSaveFlag: 0,
		searchobjects: [],
		searchobjectsactual: [],
		searchcopy: [],
		searchactualcopy: [],
		searchlength: 0,
		searchdeleteindex: "",
		convertindexsearch: "",
		searchactualdeleteindex: "",
		searchconvertlength: "",
		aResponseFlag: {},
		aflag: {},
		counter: "",
		atransportNumCus: "",
		oViewHandleTR: {},
		aflaglock: {},
		aEvents: {},
		oViewTRreleased: [],
		oMessageTemplate: {},
		isRendered: false,
		nodeTypeTable: [],
		tmpMigrActual: {},

		/* =========================================================== */
		/* lifecycle methods */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * 
		 * @public
		 */
		onInit: function () {
			// Model used to manipulate control states. The chosen values make
			// sure,
			// detail page is busy indication immediately so there is no break
			// in between the busy indication for loading the view's meta data
			sap.ui.namespace("sap.ui.view.Gemini");
			var iOriginalBusyDelay,
				oViewModel = new JSONModel({
					busy: true,
					delay: 0,
					result: [],
					editable: false
				});
			sap.ui.view.Gemini.viewModel = oViewModel;
			this.oViewEvents = new sap.ui.model.json.JSONModel({
				aEvents: [],
				aChangeType: [],
				BOR: []
			});

			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

			// Store original busy indicator delay, so it can be restored later
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "objectView");
			this.getOwnerComponent().getModel().metadataLoaded().then(function () {
				// Restore original busy indicator delay for the object view
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});

			// Initialization for validation
			this.oMessageTemplate = new MessageItem({
				type: '{type}',
				title: '{title}',
				description: '{description}',
				link: new sap.m.Link({
					text: "Click here",
					press: jQuery.proxy(this.fnNavigateToSection, this),
					target: '{target}'
				})

			});

			this.oMessagePopover = new MessagePopover({
				items: {
					path: '/',
					template: this.oMessageTemplate
				}
			});

		},
		fnNavigateToSection: function (oEvent) {
			var sSectionId = oEvent.getSource().getProperty("target");
			var sSectionIdLong = this.getView().byId(sSectionId).getId();
			this.getView().byId("ObjectPageLayout").scrollToSection(
				sSectionIdLong);
		},
		onClick: function (oEvent) {
			sap.ushell.Container.setDirtyFlag(false);
			// object of values needed to be restored
			var oItem = oEvent.getSource().getAggregation("cells")[0].getProperty("text");

			this.getRouter().navTo("object1", {
				businessContext: oItem,
				businessObject: this.sObj

			});
		},
		fnComment: function (comment) {
			var c3 = [];
			var c1 = comment.split('|');
			var c2 = [];
			var j = 0;
			for (var i = 1; i < c1.length; i++) {
				c2 = c1[i].split('^');
				c3[j] = {};
				c3[j].createdat = c2[2];
				c3[j].createdby = c2[1];
				c3[j].statuscomments = c2[0];
				j++;
			}
			return c3;
		},

		fnContains: function (v, objArr) {
			for (var i = 0; i < objArr.length; i++) {
				if (objArr[i].value === v) {
					return true;
				}
			}
			return false;
		},

		fnUnique: function (objArr) {
			var arr = [];
			var j = 0;
			for (var i = 0; i < objArr.length; i++) {
				if (!this.fnContains(objArr[i], arr)) {
					if (objArr[i] !== "") {
						arr[j] = {};
						arr[j++].value = objArr[i];
					}
				}

			}
			return arr;
		},
		fnEventEditable: function (status, sChangeType, sEvent) {
			var aEventValueHelp = this.oTable.getProperty("/eventIdHelp");
			var isBackendEvent = aEventValueHelp.some(function (object) {
				return object.event === sEvent;
			});

			if (status === '1' || sChangeType === 'Not Relevant') {
				return false;
			} else if ((sChangeType === 'New' || sChangeType === "Not Relevant") && isBackendEvent) {
				return false;
			} else {
				return true;
			}
		},

		fnOutputActualsEditable: function (outputObj) {
			if (outputObj === "") {
				return true;
			} else {
				return false;
			}
		},
		fnFindInvalidJiraObject: function () {
			var aPlannedOutputObjects = this.getView().getModel("geminioutput").getData().aOutObjs;
			var aPlannedMigrationObjects = this.getView().getModel("geminiMigr").getData().aMigrPlan;
			var aPlannnedApiObjects = this.getView().getModel("Gemini").getData().apiplan;
			var aPlannedEventObjects = this.getView().getModel("geminievents").getData().aEvents;
			var aPlannedSearchObjects = this.getView().getModel("Gemini").getData().search;
			var aPlannedExtObjects = this.getView().getModel("Gemini").getData().extplan;

			var aPlannnedApiObjects = this.getView().getModel("Gemini").getData().apiplan;
			var invalidJiraObject = aPlannedOutputObjects.filter(function (invalidJira) {
				return invalidJira.jira_valid === "2";
			});
			if (invalidJiraObject.length === 0) {
				invalidJiraObject = aPlannedMigrationObjects.filter(function (invalidJira) {
					return invalidJira.jira_valid === "2";
				});

			}
			if (invalidJiraObject.length === 0) {
				invalidJiraObject = aPlannnedApiObjects.filter(function (invalidJira) {
					return invalidJira.jira_valid === "2";
				});
			}
			if (invalidJiraObject.length === 0) {
				invalidJiraObject = aPlannedEventObjects.filter(function (invalidJira) {
					return invalidJira.jira_valid === "2";
				});
			}
			if (invalidJiraObject.length === 0) {
				invalidJiraObject = aPlannedSearchObjects.filter(function (invalidJira) {
					return invalidJira.jira_valid === "2";
				});
			}
			if (invalidJiraObject.length === 0) {
				invalidJiraObject = aPlannedExtObjects.filter(function (invalidJira) {
					return invalidJira.jira_valid === "2";
				});
			}

			// Requirement JIRA
			if (invalidJiraObject.length === 0) {
				invalidJiraObject = aPlannnedApiObjects.filter(function (invalidJira) {
					return invalidJira.jira_req_valid === "2";
				});
			}

			return invalidJiraObject;

		},

		fnJiraValidation: function () {
			var invalidJiraObject = this.fnFindInvalidJiraObject();
			if (invalidJiraObject.length === 0) {
				this.onClickSave();
			} else {
				if (invalidJiraObject[0].jira_backlog === undefined && invalidJiraObject[0].jira_valid === '2') {
					var jiraId = invalidJiraObject[0].jira_link;
				} else if (invalidJiraObject[0].jira_valid === '2' && invalidJiraObject[0].jira_link === undefined) {
					var jiraId = invalidJiraObject[0].jira_backlog;
				} else if (invalidJiraObject[0].jira_req_valid === '2') {
					var jiraId = invalidJiraObject[0].requirement_jira;
				}
				if (jiraId.trim() !== "") {
					var aJiraParameters = {
						JiraBacklogId: jiraId
					};
					sap.ui.view.Gemini.mainModel.callFunction("/JiraValidation", {
						Method: "GET",
						urlParameters: aJiraParameters,

						success: function (oResponse) {

							if (oResponse.Response) {
								if (invalidJiraObject[0].jira_valid === '2') {
									invalidJiraObject[0].jira_backlog_link = oResponse.JiraLink;
									invalidJiraObject[0].jira_valid = '1';
								} else if (invalidJiraObject[0].jira_req_valid === '2' && jiraId.startsWith("APIREQ")) {
									invalidJiraObject[0].requirement_jira_link = oResponse.JiraLink;
									invalidJiraObject[0].jira_req_valid = '1';
								}
							} else {
								if (invalidJiraObject[0].jira_valid === '2') {
									invalidJiraObject[0].jira_valid = '0';
								} else if (invalidJiraObject[0].jira_req_valid === '2') {
									invalidJiraObject[0].jira_req_valid = '0';
								}
							}
							this.onClickSave();
						}.bind(this),
						error: function () {
							this.onClickSave();
						}
					});
				} else {
					invalidJiraObject[0].jira_valid = '1';
					this.onClickSave();
				}
			}

		},

		_onObjectMatched: function (oEvent) {
			// Busy indicator

			var sObjectId = oEvent.getParameter("arguments").objectId;
			var sSectionId = oEvent.getParameter("arguments").sectionId;
			this.sap_bo_type = oEvent.getParameter("arguments").objectId;

			sap.ui.core.BusyIndicator.show();

			sap.ui.view.Gemini.viewModel.setProperty("/editable", false);
			if (!this.isLoaded || this.sObj !== sObjectId) {
				this.sObj = sObjectId;
				this.objId = sObjectId;
				this.headerModel = {
					sObjectId: sObjectId,
					sAppComp: null,
					sArea: null,
					sContactperson: null,
					sSearchO: null,
					sIsCDS: null,
					sStatus: null,
					sIsCloud: null,
					sIsEvents: null,
					sIsExt: null,
					sIsMig: null,
					sIsSearch: null,
					sIsOut: null,
					sIsEvent: null,
					sCDSObj: null,
					sPackage: null,
					sPriority: null,
					sPriorityKey: null,
					bFlag: null,
					iscudapiapplicable: "true",
					isreadapiapplicable: "true",
					sSAPObjectCategory: null

				};
				sap.ui.view.Gemini.SAPObjectType = this.sObj;
				this.oModel2 = new sap.ui.model.json.JSONModel(this.headerModel);
				// Creating a JSON Model from Data
				this.getView().setModel(this.oModel2, "Header");
				sap.ui.view.Gemini.headerModel = this.oModel2;
				this.oModel = this.getOwnerComponent().getModel();
				sap.ui.view.Gemini.mainModel = this.oModel;
				this.aDeferredGroups = this.oModel.getDeferredGroups();
				this.sDeferredGroup = "GeminiGroup";
				if (!this.aDeferredGroups || !(this.aDeferredGroups instanceof Array))
					this.aDeferredGroups = [];
				this.aDeferredGroups.push(this.sDeferredGroup);
				this.oModel.setDeferredGroups(this.aDeferredGroups);
				// end of setting omodel
				var aFilters = [];

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
					nextRelease: [],
					apiConvertSIValueHelp: [],
					apiConvertSIValueHelpExceptActuals: [],
					cds: [],
					cdsArtifactList: [],
					cdsUsageTypeList: [],
					target_release: [],
					migrVH: []

				};
				this.oTable = new sap.ui.model.json.JSONModel(oView);
				sap.ui.view.Gemini.model = this.oTable;
				// Creating a JSON Model from Data
				this.getView().setModel(this.oTable, "Gemini");

				var sUriAPI = "/I_SBRAPIOPERATIONSMASTER";
				var aFiltersAPI = [];
				aFiltersAPI.push(new sap.ui.model.Filter("sapobjecttype", sap.ui.model.FilterOperator.EQ, sObjectId));
				// Filter Conditions

				this.getView().byId("busyAPI").setVisible(true);
				this.getView().byId("idTable6").setVisible(false);
				this.getView().byId("busyMigr").setVisible(true);
				this.getView().byId("idTable").setVisible(false);
				this.getView().byId("busyOut").setVisible(true);
				this.getView().byId("idTable2Display").setVisible(false);
				this.getView().byId("busyBusContext").setVisible(true);
				this.getView().byId("idTable5").setVisible(false);
				this.getView().byId("busyComments").setVisible(true);
				this.getView().byId("idCommentsList").setVisible(false);
				var that = this;
				var sUriProtocol = "/I_SBRPROTOCOLVH";

				this.oModel.read(sUriProtocol, {

					success: function (oResponse1) {
						if (oResponse1.results.length !== 0) {
							that.defaultProtocol = oResponse1.results[0].Protocol;
						}
						that.protocolhelp = oResponse1.results;

						that.oTable.setProperty("/apiPlanProtocol", that.protocolhelp);

					},
					error: function () {

					}
				});

				var that = this;
				this.oModel.read(sUriAPI, {
					filters: aFiltersAPI,
					success: function (oResponse1) {
						that.sRes2 = oResponse1.results;
						that.apiArray = [];
						var i;
						for (i = 0; i < that.sRes2.length; i++) {

							that.apiArray[i] = {};
							that.apiArray[i].comm = that.sRes2[i].communicationscenario;
							that.apiArray[i].protocol = that.sRes2[i].protocol;
							that.apiArray[i].si = that.sRes2[i].service_interface;
							that.apiArray[i].entityset = that.sRes2[i].entityset;
							that.apiArray[i].apitype = that.sRes2[i].apitype;

							if (that.sRes2[i].readapi) {
								that.apiArray[i].read = 'Yes';
							} else {
								that.apiArray[i].read = 'No';
							}

							if (that.sRes2[i].createapi || that.sRes2[i].updateapi || that.sRes2[i].deleteapi) {
								that.apiArray[i].create = 'Yes';
							} else {
								that.apiArray[i].create = 'No';
							}
							if (that.sRes2[i].othersapi) {
								that.apiArray[i].others = 'Yes';
							} else {
								that.apiArray[i].others = 'No';
							}

						}
						that.oTable.setProperty("/api", that.apiArray);
						that.getView().byId("busyAPI").setVisible(false);
						that.getView().byId("idTable6").setVisible(true);

					},
					error: function () {

					}
				});

				/* Read Business Events Data */

				var sUriMgr = "/C_SBRBUSINESSEVENTS";
				var aFilterEvent = [];
				aFilterEvent.push(new sap.ui.model.Filter("SAPObjectType", sap.ui.model.FilterOperator.EQ, sObjectId));
				that.sResEvent = null;
				this.oModel.read(sUriMgr, {
					filters: aFilterEvent,

					success: function (oResponse) {

						that.sResEvent = oResponse.results;
						that.oTable.setProperty("/events", that.sResEvent);
					},
					error: function () {

					}
				});

				/* End read Event ID Help */

				var that = this;
				var sUriMigrValueHelp = "/I_SBRMIGRVH";
				var aFilterMigrplan = [];
				this.oModel.read(sUriMigrValueHelp, {
					filters: aFilterMigrplan,

					success: function (oResponse) {
						that.sResMigrVH = oResponse.results;
						that.oTable.setProperty("/migrVH", that.sResMigrVH);
					},
					error: function () {

					}

				});

				var sUriMgr = "/I_SBRCombinedObjectView";
				var aFiltersMgr = [];
				// Filter Conditions
				aFiltersMgr.push(new sap.ui.model.Filter("ObjectName", sap.ui.model.FilterOperator.EQ, sObjectId));

				that.sRes = null;
				this.oModel.read(sUriMgr, {
					filters: aFiltersMgr,

					success: function (oResponse) {
						that.sRes = oResponse.results;
						// Reading the result
						var i;
						that.objArray = [];
						that.outputArray = [];
						that.businessContextArray = [];

						for (i = 0; i < that.sRes.length; i++) {
							that.objArray[i] = that.sRes[i];
							that.businessContextArray[i] = that.sRes[i].BusinessContext;
							that.outputArray[i] = that.sRes[i].applicationobjecttype;
						}
						that.comment = that.fnComment(that.sRes[0].StatusComments);
						that.isCloud = (that.sRes[0].isCloudRelevant === "True" ? true : false);
						that.sIsCDS = that.sRes[0].CDSCountRequired;
						that.sIsExt = that.sRes[0].isExtensionApplicable === "True" ? true : false;
						that.sIsMig = that.sRes[0].ismigrationapplicable === "True" ? true : false;
						that.sIsSearch = that.sRes[0].issearchapplicable === "True" ? true : false;
						that.sIsOut = that.sRes[0].isoutputapplicable === "True" ? true : false;
						that.iscudapiapplicable = that.sRes[0].iscudapiapplicable === "True" ? true : false;
						that.isreadapiapplicable = that.sRes[0].isreadapiapplicable === "True" ? true : false;
						that.sIsEvents = that.sRes[0].is_event_applicable === "True" ? true : false;
						that.sCDSObj = that.sRes[0].CDSViewname;
						that.sAppComp = that.sRes[0].ApplicationComponent;
						that.sArea = that.sRes[0].Area;
						that.sContactperson = that.sRes[0].PersonResponsible;
						that.sSAPName = that.sRes[0].contactperson;
						that.sSAPIno = that.sRes[0].contactperson;
						that.sPackage = that.sRes[0].devclass;
						that.sPriority = that.sRes[0].Priority;
						that.sPriorityKey = that.sRes[0].PriorityKey;
						that.sSAPObjectCategory = that.sRes[0].sap_object_category;
						that.sReleaseState = that.sRes[0].ReleaseState;
						that.sReleaseStateText = that.sRes[0].ReleaseStateText;
						that.oModel2.setProperty("/sReleaseStateText", that.sReleaseStateText);
						that.oModel2.setProperty("/sReleaseState", that.sRes[0].ReleaseState);

						that.businessContextArray = that.fnUnique(that.businessContextArray);
						that.outputArray = that.fnUnique(that.outputArray);

						if (that.sRes[0].bodef_classobject !== "") {
							that.sEventsObjectName = that.sRes[0].bodef_classobject;
							that.sObjectType = "CL";
							that.oModel2.setProperty("/sEventObjectName", that.sEventsObjectName);
						} else if (that.sRes[0].bodef_borobject !== "") {
							that.sEventsObjectName = that.sRes[0].bodef_borobject;
							that.sObjectType = "BO";

							that.oModel2.setProperty("/sEventObjectName", that.sEventsObjectName);
						} else {
							that.sEventsObjectName = "";
							that.oModel2.setProperty("/sEventObjectName", "");
						}

						for (i = 0; i < that.outputArray.length; i++) {
							for (var j = 0; j < that.sRes.length; j++) {
								if (that.sRes[j].applicationobjecttype === that.outputArray[i].value) {
									that.outputArray[i].value1 = that.sRes[j].applicationobjecttype;
									that.outputArray[i].value = that.sRes[j].outputtype;
									break;
								}
							}
						}

						that.status = that.sRes[0].Status;
						if (that.sRes[0].Status === "rejected" || that.sRes[0].Status === "deprecated") {
							that.getView().byId("assign").setVisible(true);
							that.getView().byId("edit").setEnabled(false);
						} else if (that.sRes[0].Status === "notInGTNC") {
							that.getView().byId("assign").setVisible(true);
						}

						// Setting up values to the model

						that.oTable.setProperty("/migr", that.migrArray);
						that.getView().byId("busyMigr").setVisible(false);
						that.getView().byId("idTable").setVisible(true);
						that.oTable.setProperty("/businessContext", that.businessContextArray);
						that.getView().byId("busyBusContext").setVisible(false);
						that.getView().byId("idTable5").setVisible(true);
						that.oTable.setProperty("/comment", that.comment);
						that.getView().byId("busyComments").setVisible(false);
						that.getView().byId("idCommentsList").setVisible(true);

						that.oTable.setProperty("/output", that.outputArray);
						that.getView().byId("busyOut").setVisible(false);

						/* For Events */
						that.getView().byId("busyEvents").setVisible(false);

						that.getView().byId("idTable2Display").setVisible(true);
						that.oModel2.setProperty("/sIsCloud", that.isCloud);
						that.oModel2.setProperty("/sIsEvents", that.sIsEvents);
						that.oModel2.setProperty("/sIsCDS", that.sIsCDS);
						that.oModel2.setProperty("/sIsExt", that.sIsExt);
						that.oModel2.setProperty("/sIsMig", that.sIsMig);
						that.oModel2.setProperty("/sIsSearch", that.sIsSearch);
						that.oModel2.setProperty("/sStatus", that.status);
						that.oModel2.setProperty("/sIsOut", that.sIsOut);
						that.oModel2.setProperty("/sCDSObj", that.sCDSObj);

						that.oModel2.setProperty("/sAppComp", that.sAppComp);
						that.oModel2.setProperty("/sPackage", that.sPackage);
						that.oModel2.setProperty("/sPriority", that.sPriority);
						that.oModel2.setProperty("/sPriorityKey", that.sRes[0].PriorityKey);
						that.oModel2.setProperty("/sContactperson", that.sContactperson);
						that.oModel2.setProperty("/sArea", that.sArea);
						that.oModel2.setProperty("/iscudapiapplicable", that.iscudapiapplicable);
						that.oModel2.setProperty("/isreadapiapplicable", that.isreadapiapplicable);
						that.oModel2.setProperty("/sSAPObjectCategory", that.sSAPObjectCategory);
						that.isLoaded = true;
						that.onReload();

						if (that.sEventsObjectName !== "") {
							that.readEventsValueHelp();
						}
					},
					error: function () {

					}
				});

				var sUriMgr = "/I_SBRMIGRATIONACTUALS";
				var aFiltersMgr = [];
				that.migrArray = [];
				aFiltersMgr.push(new sap.ui.model.Filter("sapobjecttype", sap.ui.model.FilterOperator.EQ, sObjectId));
				that.sRes = null;
				this.oModel.read(sUriMgr, {
					filters: aFiltersMgr,
					success: function (oResponse) {
						that.sRes = oResponse.results;
						that.migrArray = oResponse.results;
						that.oTable.setProperty("/migr", that.migrArray);
					},
					error: function () {

					}
				});

				Events.EventsPlanning(this);
				OutputObjects.outputObjectsPlanning(this);
				MigrationObjects.migrationPlanning(this);
				/* Begin Reads for Planning */

				// Read planned API objects

				var sUriAPIplan = "/I_SBRAPIPLAN";
				var aFilterAPIplan = [];
				aFilterAPIplan.push(new sap.ui.model.Filter("sap_bo_type", sap.ui.model.FilterOperator.EQ, sObjectId));
				this.oModel.read(sUriAPIplan, {
					filters: aFilterAPIplan,

					success: function (oResponse) {

						that.sResAPIplan = oResponse.results;
						for (var i = 0; i < that.sResAPIplan.length; i++) {

							if (that.sResAPIplan[i].actual_release !== "") {
								that.sResAPIplan[i].status_colour = "Green";
								that.sResAPIplan[i].tool_tip = "Object already mapped";
								that.sResAPIplan[i].status_icon = "sap-icon://border";

							}

						}
						that.oTable.setProperty("/apiplan", that.sResAPIplan);
						that.getView().byId("busyAPIPlan").setVisible(false);
						that.getView().byId("TablePlanAPI").setVisible(false);
						that.getView().byId("TablePlanAPInonEdit").setVisible(true);
						that.getView().byId("idTable6").setVisible(false);
						that.getView().byId("idTable6nonEdit").setVisible(true);

					},
					error: function () {

					}

					/* End Reads for Planning */
				});

				// Fetch CDS Key fields
				var aCDSKeyFields = [];
				var aFiltersCDSKeyFields = [];
				that.oModel.read("/I_SBRSOTToCDS('" + sObjectId + "')/to_CDSKeys", {
					filters: aFiltersCDSKeyFields,
					success: function (oResponse) {

						if (oResponse.results.length !== 0) // if not empty
						{
							aCDSKeyFields[0] = {
								BOKey0: "",
								BOKey1: "",
								BOKey2: "",
								BOKey3: "",
								BOKey4: "",
								BOKey5: ""
							};

							// Converting array to key value pair for items
							// aggregations.
							// In layman's terms, converting rows to columns

							oResponse.results.forEach(function (value, index) {
								aCDSKeyFields[0]["BOKey" + index] = value.Fieldnames;
							});

							// setting results to the model
							that.oTable.setProperty("/CDSKeyFields", aCDSKeyFields);
						}
					},
					error: function () {

					}
				});

				/* Begin Read Plan for extensibility */

				var sUriExtplan = "/I_SBREXTPLAN";
				var aFilterExtplan = [];
				aFilterExtplan.push(new sap.ui.model.Filter("sap_bo_type", sap.ui.model.FilterOperator.EQ, sObjectId));
				this.oModel.read(sUriExtplan, {
					filters: aFilterExtplan,

					success: function (oResponse) {

						that.sResExtplan = oResponse.results;
						that.oTable.setProperty("/extplan", that.sResExtplan);
						that.getView().byId("busyPlanExt").setVisible(false);
						that.getView().byId("TablePlanExt2").setVisible(true);

						var x = that.byId("TablePlanExt2").getItems();
						var statusExt = that.getView().byId("extStatus");
						var statusExtCol = that.getView().byId("TablePlanExt2").indexOfColumn(statusExt);

						for (var i = 0; i < x.length; i++) {

							if (that.sResExtplan[i].mapped_business_context !== "") {
								x[i].getAggregation("cells")[statusExtCol].setAggregation("tooltip", "Object already mapped");
								x[i].getAggregation("cells")[statusExtCol].setProperty("color", "Green");
								x[i].getAggregation("cells")[statusExtCol].setProperty("src", "sap-icon://border");

							}
						}

					},
					error: function () {

					}

				});

				/* End Read Plan for extensibility */

				var aReadAPI = [];
				var tempx = {};
				tempx.value = "Yes";
				aReadAPI[0] = $.extend({}, tempx);
				tempx.value = "No";
				aReadAPI[1] = $.extend({}, tempx);
				this.oTable.setProperty("/apiCRUDFlag", aReadAPI);
				var oBundle = this.getView().getModel("i18n").getResourceBundle();
				var tempx1 = {};
				var aChange1 = [];
				tempx1.value = oBundle.getText("changeTypeNew");
				aChange1[0] = $.extend({}, tempx1);
				tempx1.value = oBundle.getText("changeTypeEnhancement");
				aChange1[1] = $.extend({}, tempx1);

				this.oTable.setProperty("/apiChangeType", aChange1);

				var tempx2 = {};
				var aChangeExt = [];
				tempx2.value = "Field";
				aChangeExt[0] = $.extend({}, tempx2);
				tempx2.value = "Process Extension";
				aChangeExt[1] = $.extend({}, tempx2);

				this.oTable.setProperty("/extType", aChangeExt);

				var sUri = "/I_SBRTargetRelease";

				this.oModel.read(sUri, {

					success: function (oResponse) {

						that.oTable.setProperty("/target_release", oResponse.results);
						var x = oResponse.results;
						var release_ids = [];
						var nextRelease;
						var currDateTime = new Date();
						for (var i = 0; i < x.length - 1; i++) {
							for (var j = i + 1; j < x.length; j++) {
								if (currDateTime > x[i].ecc && currDateTime < x[j].ecc && x[j].release_id < that.final) {
									that.final = x[j].release_id;
								}
							}

							for (var k = i; k < x.length; k++) {
								if (that.final < x[k].release_id) {
									release_ids.push(x[k].release_id);
								}
							}
						}
						nextRelease = Math.min.apply(null, release_ids);
						nextRelease = nextRelease.toString();

						that.oTable.setProperty("/currentRelease", that.final);
						that.oTable.setProperty("/nextRelease", nextRelease);

					},
					error: function () {

					}
				});

				// search planning

				var aFiltersSearch = [];
				aFiltersSearch.push(new sap.ui.model.Filter("sap_bo_type", sap.ui.model.FilterOperator.EQ, sObjectId));
				var searchuri = "/I_SBRSEARCHPLAN";
				this.oModel.read(searchuri, {
					filters: aFiltersSearch,
					success: function (oResponse1) {
						that.sRes2 = oResponse1.results;
						that.searchobjects = [];

						for (var i = 0; i < that.sRes2.length; i++) {
							that.searchobjects[i] = {};
							that.searchobjects[i].search_id = that.sRes2[i].search_id;
							that.searchobjects[i].sap_bo_type = that.sRes2[i].sap_bo_type;
							that.searchobjects[i].area = that.sRes2[i].area;
							that.searchobjects[i].search_object = that.sRes2[i].search_object;
							that.searchobjects[i].search_object_type = that.sRes2[i].search_object_type;
							that.searchobjects[i].target_release = that.sRes2[i].target_release;
							that.searchobjects[i].description = that.sRes2[i].description;
							that.searchobjects[i].status = that.sRes2[i].status;
							that.searchobjects[i].change_type = that.sRes2[i].change_type;
							that.searchobjects[i].tool_tip = that.sRes2[i].tool_tip;
							that.searchobjects[i].status_colour = that.sRes2[i].status_colour;
							that.searchobjects[i].status_icon = that.sRes2[i].status_icon;
							that.searchobjects[i].ident_mapping = that.sRes2[i].ident_mapping;
							that.searchobjects[i].actual_release = that.sRes2[i].actual_release;
							that.searchobjects[i].jira_backlog = that.sRes2[i].jira_backlog;
							that.searchobjects[i].jira_backlog_link = that.sRes2[i].jira_backlog_link;
							that.searchobjects[i].jira_valid = that.sRes2[i].jira_valid;

						}

						var aChange = [];
						var tempx = {};
						tempx.value = "New";
						aChange[0] = $.extend({}, tempx);
						tempx.value = "Enhancement";
						aChange[1] = $.extend({}, tempx);

						that.oTable.setProperty("/aChange", aChange);
						that.oTable.setProperty("/search", that.searchobjects);
						this.searchlength = that.searchobjects.length;
						var oModel = this.getView().getModel("Gemini");
						var searchPlan = oModel.getProperty("/search");
						this.searchcopy = $.extend(true, [], searchPlan);
					}.bind(this)
				});

				// search actual
				var aFiltersSearchActual = [];
				sap.ui.view.Gemini.search = new sap.ui.model.json.JSONModel({
					searchactual: []
				});

				aFiltersSearchActual.push(new sap.ui.model.Filter("sap_bo_type", sap.ui.model.FilterOperator.EQ, sObjectId));
				var searchuriactual = "/I_SBRSEARCHACTUAL";
				this.oModel.read(searchuriactual, {
					filters: aFiltersSearchActual,
					success: function (oResponse1) {
						that.sRes2 = oResponse1.results;
						that.searchobjectsactual = [];

						for (var i = 0; i < that.sRes2.length; i++) {

							that.searchobjectsactual[i] = {};
							that.searchobjectsactual[i].sap_bo_type = that.sRes2[i].sap_bo_type;
							that.searchobjectsactual[i].search_object = that.sRes2[i].search_object;

						}

						sap.ui.view.Gemini.search.setProperty('/searchactual', this.searchobjectsactual);
						this.getView().setModel(sap.ui.view.Gemini.search, 'search');
						this.searchactualcopy = $.extend(true, [], this.searchobjectsactual);
						this.searchconvertlength = this.searchactualcopy.length;
					}.bind(this)
				});
			}

			// calling the function for Nodetype facet

			var aFiltersNode = [];
			aFiltersNode.push(new sap.ui.model.Filter("object_type", sap.ui.model.FilterOperator.EQ, sObjectId));
			var nodeuri = "/I_SBRSAPOBJECTNODETYPE";
			this.oModel.read(nodeuri, {
				filters: aFiltersNode,
				success: function (oResponse) {
					this.oTable.setProperty("/nodetype", oResponse.results);
				}.bind(this)
			});
			// End ofNode Type

			/* Read for Fiori Actual */
			var sUriFiori = "/I_SBRFIORIACTLS";
			var aFiltersFiori = [];

			aFiltersFiori.push(new sap.ui.model.Filter("SapObjectType", sap.ui.model.FilterOperator.EQ, sObjectId));

			this.oModel.read(sUriFiori, {
				filters: aFiltersFiori,
				success: function (oResponse) {
					this.oTable.setProperty("/fiori", oResponse.results);
				}.bind(this),
				error: function () {}
			});

			// CDS Cloud Quality Read Operation
			var oUser = new sap.ushell.services.UserInfo();
			var userID = oUser.getUser().getId();
			if (userID === "DEENADAYALU" || userID === "JAYANNAGOWDA" || userID === "CHANDRAANK" || userID === "NAMAR" || userID === "PRADEEPS" ||
				userID === "DAMACH" || userID === "NAMIC" || userID === "SHETTYRAK" || userID === "KHAREMA" || userID === ".DI" || userID ===
				"YADAVSAC" || userID === "KAKANI" || userID === "JAMESJER" || userID === "VORAJ" || userID === "NATHI" || userID ===
				"DEFAULT_USER") {

				// || userID === "DEFAULT_USER"
				CDS.readCDSActualData(sObjectId, this); // retain this only
				/* Read for Semantic Object */
				if (userID !== "DEFAULT_USER") {
					var sUri = "/sap/opu/odata/UI2/INTEROP";
					var OData = new sap.ui.model.odata.v2.ODataModel(sUri);
					OData.read("/SemanticObjects", {
						success: function (oResponse) {
							this.oTable.setProperty("/semanticObject", oResponse.results);
						}.bind(this),
						error: function () {}
					});
				}
			} else {
				this.getView().byId("SectionCDS").setVisible(false);
//				this.getView().byId("SectionFiori").setVisible(false);
			}
			// End CDS Cloud Quality Read Operation
			if (sSectionId !== "Default") {
				this.oObjectPageLayout = this.getView().byId("ObjectPageLayout");
				this.oTargetSubSection = this.getView().byId(sSectionId);

				this.oObjectPageLayout.addEventDelegate({
					onAfterRendering: jQuery.proxy(function () {
						// need to wait for the scrollEnablement to be active
						jQuery.sap.delayedCall(500, this.oObjectPageLayout, this.oObjectPageLayout.scrollToSection, [this.oTargetSubSection.getId()]);
					}, this)
				});
			}

			sap.ui.core.BusyIndicator.hide();

			// Setting i18 model
			var i18nModel = new ResourceModel({
				bundleName: "s4.cfnd.geminiobjectpage.i18n.i18n"
			});
			this.getView().setModel(i18nModel, "i18n");

			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var deleteConfirmationMessage = oBundle.getText("deleteConfirmationMessage");

		},

		/**
		 * Binds the view to the object path.
		 * 
		 * @function
		 * @param {string}
		 *            sObjectPath path to the object to be bound
		 * @private
		 */
		_bindView: function (sObjectPath) {
			var oViewModel = this.getModel("objectView"),
				oDataModel = this.getModel();

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						oDataModel.metadataLoaded().then(function () {
							// Busy indicator on view should only be set if
							// metadata is loaded,
							// otherwise there may be two busy indications next
							// to each other on the screen.
							// This happens because route matched handler
							// already calls '_bindView'
							// while metadata is loaded.
							oViewModel.setProperty("/busy", true);
						});
					},
					dataReceived: function () {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},
		siValueHelpAPI: function () {
			var siHelp;
			var that = this;
			var sUriSI = "/I_SBRSERVICEINTERFACEVH";
			this.oModel.read(sUriSI, {
				success: function (oResponse) {
					// TRY FILTER
					siHelp = oResponse.results;
					that.oTable.setProperty("/apiConvertSIValueHelp", siHelp);
				},
				error: function () {

				}
			});

		},

		onValueHelpRequestTargetReleaseExtMap: function (oEvent) {

			this.ipActualReleaseId = oEvent.getSource().getId();
			if (!this.actualReleaseHelp) {
				this.actualReleaseHelp = sap.ui.xmlfragment("s4.cfnd.geminiobjectpage.view.TargetReleaseHelpExtMap", this);
				this.getView().addDependent(this.actualReleaseHelp);
			}
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this.actualReleaseHelp);
			this.actualReleaseHelp.open();
			if (this.actualReleaseHelp) {
				var searchField = sap.ui.getCore().byId("TargetReleaseHelpExtMap-list");
				searchField.addEventDelegate({
					onfocusin: function () {
						sap.ui.getCore().byId("TargetReleaseHelpExtMap-searchField").focus();
					}
				}, this);
			}

		},
		onValueHelpRequestTargetReleaseExtMapEnhancement: function (oEvent) {

			this.ipActualReleaseId = oEvent.getSource().getId();
			if (!this.actualReleaseHelp) {
				this.actualReleaseHelp = sap.ui.xmlfragment("s4.cfnd.geminiobjectpage.view.TargetReleaseHelpExtMapEnhancement", this);
				this.getView().addDependent(this.actualReleaseHelp);
			}

			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this.actualReleaseHelp);
			this.actualReleaseHelp.open();
		},
		onValueHelpRequestTargetRelease: function (oEvent) {

			this.ipTargetReleaseId = oEvent.getSource().getId();
			if (!this.targetReleaseHelp) {
				this.targetReleaseHelp = sap.ui.xmlfragment("s4.cfnd.geminiobjectpage.view.TargetReleaseValueHelp", this);
				this.getView().addDependent(this.targetReleaseHelp);
			}

			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this.targetReleaseHelp);
			this.targetReleaseHelp.open();
			if (this.targetReleaseHelp) {
				var searchField = sap.ui.getCore().byId("TargetReleaseHelp-list");
				searchField.addEventDelegate({
					onfocusin: function () {
						sap.ui.getCore().byId("TargetReleaseHelp-searchField").focus();
					}
				}, this);
			}

		},
		onAssign: function (oEvent) {
			//			var oUser = new sap.ushell.services.UserInfo();
			//			var userId = oUser.getUser().getFullName();
			//			if (this.headerModel.sContactperson === userId) 
			//			{
			//				if(this.headerModel.sStatus === 'rejected' ||  this.headerModel.sStatus === 'deprecated'){

			if (!this._oDialog25) {
				this._oDialog25 = sap.ui.xmlfragment("s4.cfnd.geminiobjectpage.view.Assign", this);
			}
			// toggle compact style
			this.getView().addDependent(this._oDialog25);
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog25);
			this._oDialog25.open();
			//				}
			//				else{
			//						var oBundle = this.getView().getModel("i18n").getResourceBundle();
			//						MessageBox.error(oBundle.getText("invalidStatus"));
			//					}
			//			} else {
			//				MessageBox.error(
			//						"You do not have authorization to perform this operation"
			//					);
			//				
			//			}
		},

		onObjValueHelpRequest: function (oEvent) {
			if (!this._oDialog24) {
				this._oDialog24 = sap.ui.xmlfragment("s4.cfnd.geminiobjectpage.view.ObjectName", this);
				this._oDialog24.setModel(this.getView().getModel());
			}

			// Multi-select if required
			var bMultiSelect = !!oEvent.getSource().data("multi");
			this._oDialog24.setMultiSelect(bMultiSelect);

			// clear the old search filter
			this._oDialog24.getBinding("items").filter([]);

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog1);

			var searchField = sap.ui.getCore().byId("Obj-list");
			searchField.addEventDelegate({
				onfocusin: function () {
					sap.ui.getCore().byId("Obj-searchField").focus();
				}
			}, this);
			var aFilter = new Filter({
				filters: [
					new Filter("ObjectName", FilterOperator.NE, this.sObj),
					new Filter("Status", FilterOperator.NE, "deprecated"),
					new Filter("Status", FilterOperator.NE, "rejected")
				],
				and: true
			});
			searchField.getBinding("items").filter([aFilter]);

			this._oDialog24.open();
		},
		handleObjSearch: function (oDialog) {
			var sQuery = oDialog.getSource()._sSearchFieldValue;

			var aFilter = new Filter({
				filters: [
					new Filter("ObjectName", FilterOperator.Contains, sQuery),
					new Filter("ObjectName", FilterOperator.NE, this.sObj),
					new Filter("Status", FilterOperator.NE, "deprecated"),
					new Filter("Status", FilterOperator.NE, "rejected")
				],
				and: true
			});
			oDialog.getSource().getBinding("items").filter([aFilter]);
		},

		handleObjClose: function (oEvent) {
			var aTemp = oEvent.getParameter("selectedItems");
			var oSelectedItem = aTemp[0].getProperty("title");
			var x = sap.ui.getCore().byId("Assign1");
			x.setValue(oSelectedItem);
		},
		handleAssignConfirm: function (oEvent) {
			var aTemp = {};
			aTemp.sapobjecttypeold = this.sObj;
			aTemp.sapobjecttypenew = sap.ui.getCore().byId("Assign1").getValue();
			aTemp.comment = sap.ui.getCore().byId("TypeCommentHere").getValue();
			aTemp.createdate = this.getDateTime();

			if (sap.ui.getCore().byId("Assign1").getValue() !== "") {
				var sUriNew = "/I_SBRCombinedObjectView";
				var aFilters = [];
				// Filter Conditions
				aFilters.push(new sap.ui.model.Filter("ObjectName", sap.ui.model.FilterOperator.EQ, aTemp.sapobjecttypenew));
				this.oModel.read(sUriNew, {
					filters: aFilters,
					success: function (oResponse) {
						var sRes = oResponse.results;
						var oUser = new sap.ushell.services.UserInfo();
						var userId = oUser.getUser().getFullName();
						if (this.headerModel.sContactperson === sRes[0].PersonResponsible && sRes[0].PersonResponsible === userId) {
							if ((sRes[0].bodef_borobject === "" && sRes[0].bodef_classobject === "") || ((sRes[0].bodef_borobject === this.sEventsObjectName) ||
									(sRes[0].bodef_classobject ===
										this.sEventsObjectName))) {
								this.oModel.create("/AssignSet", aTemp, {
									success: function () {
										var oModel = this.getView().getModel("Header").getData();
										oModel.sStatus = "forDeletion";
										this.getView().getModel("Header").refresh(true);
										// sap.ui.getCore().byId("edit").setVisible(false);
										this.getView().byId("edit").setVisible(false);
										this.getView().byId("assign").setVisible(true);
										var oBundle = this.getView().getModel("i18n").getResourceBundle();
										sap.m.MessageToast.show(oBundle.getText("assignSuccessful"));

									}.bind(this),
									error: function () {
										var oBundle = this.getView().getModel("i18n").getResourceBundle();
										MessageBox.error(oBundle.getText("assignFailed"));

									}.bind(this)
								});
							} else {
								var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
								MessageBox.error(
									"The SAP Object Type Representations of " + this.sObj + " and " + sap.ui.getCore().byId("Assign1").getValue() +
									" are not compatible to perform this operation", {
										styleClass: bCompact ? "sapUiSizeCompact" : ""
									}
								);
							}
						} else {
							bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
							MessageBox.error(
								"You do not have authorization to assign to " + sap.ui.getCore().byId("Assign1").getValue(), {
									styleClass: bCompact ? "sapUiSizeCompact" : ""
								}
							);
						}

					}.bind(this),
					error: function () {

					}
				});
			} else {
				var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.error(
					"Please select a SAP Object Type", {
						styleClass: bCompact ? "sapUiSizeCompact" : ""
					}
				);
			}

			if (sap.ui.getCore().byId("Obj") !== undefined)

			{

				sap.ui.getCore().byId("Obj").destroy();

			}

			delete this._oDialog24;
		},

		getDateTime: function () {
			var now = new Date();
			var year = now.getFullYear();
			var month = now.getMonth() + 1;
			var day = now.getDate();
			var hour = now.getHours();
			var minute = now.getMinutes();
			var second = now.getSeconds();
			if (month.toString().length === 1) {
				month = '0' + month;
			}
			if (day.toString().length === 1) {
				day = '0' + day;
			}
			if (hour.toString().length === 1) {
				hour = '0' + hour;
			}
			if (minute.toString().length === 1) {
				minute = '0' + minute;
			}
			if (second.toString().length === 1) {
				second = '0' + second;
			}
			var dateTime = year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':' + second + 'Z';
			return dateTime;
		},

		fnCommentsSuccess: function () {

			var oEntryBackend = {};
			oEntryBackend.sapobjecttype = this.sObj;
			oEntryBackend.statuscomments = this.getView().byId("TypeComment").getValue();
			var oUser = new sap.ushell.services.UserInfo();

			var rawDate = this.getDateTime();
			var year = rawDate.substring(0, 4);
			var month = rawDate.substring(5, 7);
			var date = rawDate.substring(8, 10);
			var time = rawDate.substring(11, 19);
			time = time.replace(':', '.');
			var final = date + '.' + month + '.' + year + ' ' + time;
			oEntryBackend.createdat = final;

			// To get user
			var oUser = new sap.ushell.services.UserInfo();
			var userID = oUser.getUser().getId();
			oEntryBackend.createdby = userID;

			// Setting to Model
			var oModel = this.getModel("Gemini");
			var aComments = oModel.getProperty("/comment");
			aComments.unshift(oEntryBackend);

			oModel.refresh(true);

			this.getView().byId("TypeComment").setValue("");

		},

		onPost: function () {

			var oEntryBackend = {};
			oEntryBackend.sapobjecttype = this.sObj;
			oEntryBackend.statuscomments = this.getView().byId("TypeComment").getValue();

			oEntryBackend.createdat = this.getDateTime();

			// To Get User
			var oUser = new sap.ushell.services.UserInfo();
			var userID = oUser.getUser().getId();
			oEntryBackend.createdby = userID;

			if (oEntryBackend.statuscomments !== '') {
				this.oModel.create("/I_SBRBORCOMMENT", oEntryBackend, {
					groupId: this.sDeferredGroup,
					success: this.fnCommentsSuccess.bind(this)
				});
				// Logic for Comment on UI

			}

		},

		_onBindingChange: function () {
			var oView = this.getView(),
				oViewModel = this.getModel("objectView"),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("objectNotFound");
				return;
			}

			var oResourceBundle = this.getResourceBundle(),
				oObject = oView.getBindingContext().getObject(),
				sObjectId = oObject.ObjectName,
				sObjectName = oObject.ObjectName;

			// Everything went fine.
			oViewModel.setProperty("/busy", false);
			oViewModel.setProperty("/saveAsTileTitle", oResourceBundle.getText("saveAsTileTitle", [sObjectName]));
			oViewModel.setProperty("/shareOnJamTitle", sObjectName);

		},
		onPlanSave: function () {
			var that = this;
			var sUriAPIplan = "/I_SBRAPIPLAN";
			var aFilterAPIplan = [];
			aFilterAPIplan.push(new sap.ui.model.Filter("sap_bo_type", sap.ui.model.FilterOperator.EQ, this.sObj));
			this.oModel.read(sUriAPIplan, {
				filters: aFilterAPIplan,

				success: function (oResponse) {

					that.sResAPIplan = oResponse.results;
					that.oTable.setProperty("/apiplan", that.sResAPIplan);
					that.getView().byId("busyAPIPlan").setVisible(false);
					that.getView().byId("TablePlanAPI").setVisible(true);

				},
				error: function () {

					}
					/* End Reads for Planning */

			});
		},

		applyChangeExtType: function (oEvent) {
			var sExtTypeRow = oEvent.getParameters().id.slice(-1);
			var sExtTypeText = oEvent.getParameters().selectedItem.getProperty("text");

			var oModel = this.getView().getModel("Gemini").getData().extplan;

			oModel[sExtTypeRow].ext_type = sExtTypeText;

		},
		applyChangeExt: function (oEvent) {
			var sExtChangeTypeRow = oEvent.getParameters().id.slice(-1);
			var sExtChangeTypeText = oEvent.getParameters().selectedItem.getProperty("text");

			var oModel = this.getView().getModel("Gemini").getData().extplan;
			oModel[sExtChangeTypeRow].change_type = sExtChangeTypeText;

		},
		onSave: function () {

			var aEventsActualItems = this.oTable.getProperty("/events");
			this.aEvents = [];
			for (var i = 0; i < aEventsActualItems.length; i++) {
				if (!(this.tmpModel3.some(function (oObject) {
						return oObject.Event === aEventsActualItems[i].Event && oObject.TaskCode === aEventsActualItems[i].TaskCode && oObject.TaskText ===
							aEventsActualItems[i].TaskText;
					}))) {
					this.aEvents.push(aEventsActualItems[i]);
				}
			}

			NodeType.onCheckNodeTypeSave(this);
			if (this.aEvents.length > 0 || this.aEventdel.length > 0 || sap.ui.view.Gemini.headerModelInitial.sCDSObj !== sap.ui.view.Gemini.headerModel
				.getProperty("/sCDSObj")) {
				var bflagTREvent = "1";
				var oTRObjects = {
					sObjectName: this.sap_bo_type,
					sObj: "GEVT"
				};

				TransportRequest.checkLockedObject
					.call(this, oTRObjects);
			} else {
				var bflagTREvent = "0";
			}
			if (this.oModel2.getProperty("/sEventObjectNameTemp") !== this.oModel2.getProperty("/sEventObjectName")) {
				var oTRObjects = {
					sObjectName: this.sap_bo_type,
					sObj: "BR01"
				};

				TransportRequest.checkLockedObject
					.call(this, oTRObjects);
				var bflagTRObj = "1";
			} else {
				var bflagTRObj = "0";
			}

			if (this.aUpdateNodeType.length > 0 || bflagTREvent === "1" || bflagTRObj === "1") {
				TransportRequest.handleTransportRequest.call(this);
			} else {
				this.handleSave();
			}
		},
		// Update CDS Key fields in CDS Object is changed.
		fnUpdateCDSKeys: function () {

			// Creating URL Paramaters
			var aCDSKeyFields = {
				BOKey0: "",
				BOKey1: "",
				BOKey2: "",
				BOKey3: "",
				BOKey4: "",
				BOKey5: ""
			};
			if (sap.ui.view.Gemini.model.getProperty("/CDSKeyFields")[0] !== undefined) {
				aCDSKeyFields = sap.ui.view.Gemini.model.getProperty("/CDSKeyFields")[0];
			}
			var aCDSKeyFieldsParams = {
				SAPObjectType: sap.ui.view.Gemini.SAPObjectType,
				CDSView: sap.ui.view.Gemini.headerModel.getProperty("/sCDSObj"),
				Key1: aCDSKeyFields.BOKey0,
				Key2: aCDSKeyFields.BOKey1,
				Key3: aCDSKeyFields.BOKey2,
				Key4: aCDSKeyFields.BOKey3,
				Key5: aCDSKeyFields.BOKey4,
				Key6: aCDSKeyFields.BOKey5

			};

			// Call Function Import that updates CDS
			
			this.oModel
			.create(
				"/CDSKeyFieldsSetNew",
				aCDSKeyFieldsParams, {
					groupId: this.sDeferredGroup,
					success: function(
							oResponse) {
						}
						.bind(this),
					error: function() {
						
					}

				});

		},
		handleSave: function () {

			sap.ui.core.BusyIndicator.show(0);
			var oEditEntry = {};

			oEditEntry.ObjectName = this.objId;
			oEditEntry.CDSObjectName = this.oModel2.getProperty("/sCDSObj");
			oEditEntry.isCloudRelevant = (this.oModel2.getProperty("/sIsCloud") === false) ? "N" : "Y";
			oEditEntry.isExtensionApplicable = (this.oModel2.getProperty("/sIsExt") === false) ? "N" : "Y";
			oEditEntry.ismigrationapplicable = (this.oModel2.getProperty("/sIsMig") === false) ? "N" : "Y";
			oEditEntry.isSearchapplicable = (this.oModel2.getProperty("/sIsSearch") === false) ? "N" : "Y";
			oEditEntry.isOutputapplicable = (this.oModel2.getProperty("/sIsOut") === false) ? "N" : "Y";
			oEditEntry.isreadapiapplicable = (this.oModel2.getProperty("/isreadapiapplicable") === false) ? "N" : "Y";
			oEditEntry.iscudapiapplicable = (this.oModel2.getProperty("/iscudapiapplicable") === false) ? "N" : "Y";
			oEditEntry.is_event_applicable = (this.oModel2.getProperty("/sIsEvents") === false) ? "N" : "Y";
			oEditEntry.contactperson = this.sSAPIno;
			oEditEntry.ApplicationComponent = this.oModel2.getProperty("/sAppComp");
			oEditEntry.Area = this.oModel2.getProperty("/sArea");
			oEditEntry.devclass = this.oModel2.getProperty("/sPackage");
			oEditEntry.Priority = this.oModel2.getProperty("/sPriorityKey");
			oEditEntry.ReleaseState = this.oModel2.getProperty("/sReleaseState");

			if (this.sObjectType === "BO") {
				oEditEntry.borObject = this.oModel2.getProperty("/sEventObjectName");
				oEditEntry.clObject = "";

			} else if (this.sObjectType === "CL") {
				oEditEntry.clObject = this.oModel2.getProperty("/sEventObjectName");
				oEditEntry.borObject = "";
			}
			this.oModel.update("/I_SBRCloudQuality('" + this.objId + "')", oEditEntry, {
				groupId: this.sDeferredGroup,
				success: function () {
					// console.log("Success");
				},
				error: function () {
					// console.log("Error");
				}
			});
			if (this.getView().byId("isout").getSelected()) {
				OutputObjects.handleOutputPlanSave(this);
				this.outputObjectsActualSave();
			}
			Search.handlesearchsave(this);
			MigrationObjects.handleMigrPlanCRUD(this);
			/* Begin Extensibility CRUD */
			Extensibility.handleExtCRUD(this);
			/* End Extensibility CRUD */

			// CRUD for API
			API.CRUDOperationsAPI(this);

			/* Create for Events */
			this.onPost();
			Events.onSaveEvents(this);
			// Call Save method for CDS Actuals
			CDS.handleSaveCDS(this);
			Fiori.handleFioriSave(this);

			this.oModel.submitChanges({

				groupId: this.sDeferredGroup,
				success: jQuery.proxy(this.fnSaveHandler, this),
				error: this.fnErrorHandler
			});

		},
		fnSaveEntriesWithTR: function () {
			this.createEvent();
			this.deleteEvent();
			if (sap.ui.view.Gemini.headerModelInitial.sCDSObj !== sap.ui.view.Gemini.headerModel
				.getProperty("/sCDSObj")) {
				this.fnUpdateCDSKeys();
			}
			NodeType.fnOnSaveNodeType(this);
		},
		fnErrorHandler: function (oError) {

			var sMessage = $(oError.responseText).find("message").first().text();
			MessageBox.error(sMessage);
			sap.ui.core.BusyIndicator.hide(0);
		},
		fnSaveHandler: function (oData, oResponse) {
			var bSaveSuccessfull = true;
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var oError = {};
			if (oData && oData.__batchResponses) {
				jQuery.each(oData.__batchResponses,
					function (index, batchResponse) {
						if (batchResponse.response && batchResponse.response.statusCode && !batchResponse.response.statusCode.startsWith("2")) {
							bSaveSuccessfull = false;
							oError = batchResponse;
						}
					});
			}
			sap.ui.core.BusyIndicator.hide(0);
			if (!bSaveSuccessfull) {
				var sErrorName = this.fnErrorMessage(oError);
				MessageBox.error(sErrorName);
			} else {

				this.fnDisplaymode();
				sap.m.MessageToast.show(oBundle.getText("Savesuccessful"));
			}

		},
		fnErrorMessage: function (oError) {
			var errorName = "";
			if (oError) {
				if (oError.responseText) {
					var errorText = JSON.parse(oError.responseText);
					if (errorText.error && errorText.error.message && errorText.error.message.value) {
						errorName = errorText.error.message.value;
						oError.response = oError.responseText;
					}
				} else if (oError.response && oError.response.body) {
					errorText = oError.response.body;
					if (JSON.parse(errorText).error.message.value) {
						errorName = JSON.parse(errorText).error.message.value;
					}
				}
			}
			return errorName;
		},
		fnDisplaymode: function () {
			sap.ui.view.Gemini.viewModel.setProperty("/editable", false);

			this.getView().byId("TablePlanAPI").setVisible(false);
			this.getView().byId("TablePlanAPInonEdit").setVisible(true);
			this.getView().byId("idTable6").setVisible(false);
			this.getView().byId("idTable6nonEdit").setVisible(true);

			this.getView().byId("isext").setEditable(false);
			this.getView().byId("ismig").setEditable(false);
			this.getView().byId("issearch").setEditable(false);
			this.getView().byId("isout").setEditable(false);
			this.getView().byId("isAPICUD").setEditable(false);
			this.getView().byId("isAPIRead").setEditable(false);
			// simulate end of operation

			this.edit = false;
			this.onselectoutput();

			this.getView().byId("BtnDelAPI").setVisible(false);
			this.getView().byId("BtnConvertAPI").setVisible(false);

			if (this.status === "rejected" || this.status === "deprecated") {
				this.getView().byId("assign").setVisible(true);
				this.getView().byId("edit").setVisible(true);
				this.getView().byId("edit").setEnabled(false);
			} else {
				this.getView().byId("edit").setVisible(true);
				this.getView().byId("assign").setVisible(true);
				this.getView().byId("edit").setEnabled(true);
			}

			this.getView().byId("TablePlanAPI").setMode(sap.m.ListMode.none);

			this.getView().byId("TablePlanExt").setMode(sap.m.ListMode.none);

			this.getView().byId("idTable6").setMode(sap.m.ListMode.none);
			this.getView().byId("idTable2").setMode(sap.m.ListMode.none);
			this.getView().byId("idTable2Display").setVisible(true);
			this.getView().byId("idTable2").setVisible(false);

			sap.ushell.Container.setDirtyFlag(false);

			this.getView().byId("save").setVisible(false);
			this.getView().byId("cancel").setVisible(false);
			this.getView().byId("edit").setVisible(true);
			this.getView().byId("error").setVisible(false);

			this.getView().byId("TypeComment").setVisible(false);
			this.getView().byId("TypeComment").setEditable(false);
			this.getView().byId("addPlanAPI").setVisible(false);

			// Migration Objects

			/* For Extensibility */

			this.getView().byId("addPlanExt").setVisible(false);
			this.getView().byId("BtnMapExt").setVisible(false);
			this.getView().byId("BtnDelExtPlan").setVisible(false);
			this.getView().byId("jiraExt").setVisible(false);
			this.getView().byId("jiraLinkExt").setVisible(true);

			if (this.headerModel.sIsExt === true) {
				this.getView().byId("isext").setSelected(true);
			} else {
				this.getView().byId("isext").setSelected(false);
			}

			MigrationObjects.migrationPlanChangeMode(this, 0);
			MigrationObjects.migrationActualsChangeMode(this, 0);
			Search.fnSearchDisplayModeAfterSave(this);
			CDS.fnCDSDisplayMode(this);
			Fiori.fnFioriDisplayMode(this);

			this.getView().byId("TablePlanOutDisplay").setVisible(true);
			this.getView().byId("TablePlanOutEdit").setVisible(false);
			this.getView().byId("addPlanOut").setVisible(false);
			this.getView().byId("deletePlanOut").setVisible(false);
			this.getView().byId("convertPlanOut").setVisible(false);

		},
		createEvent: function () {
			for (var i = 0; i < this.aEvents.length; i++) {

				this.aEvents[i].SAPObjectType = this.sObj;
				this.aEvents[i].Task = "";
				delete this.aEvents[i].new_row;
				this.oModel.create("/C_SBRBUSINESSEVENTS", this.aEvents[i], {
					groupId: this.sDeferredGroup,
					success: function () {
						// console.log("Success");
					},
					error: function () {
						// console.log("Error");
					}
				});

			}
		},
		deleteEvent: function () {
			for (var i = 0; i < this.aEventdel.length; i++) {

				this.oModel.remove("/C_SBRBUSINESSEVENTS(SAPObjectType='" + this.sObj + "',Task='" + this.aEventdel[i].Task +
					"',Event='" + this.aEventdel[i].Event + "')", {
						groupId: this.sDeferredGroup,
						success: function () {
							// console.log("Success");
						},
						error: function () {
							// console.log("Error");
						}
					});
			}

		},

		onClosePopover: function () {
			this._savePopover.destroy();
		},

		readEventsValueHelp: function () {
			/* Read Event ID Help */

			var sUriMgr = "/EventValueHelp";
			var aFilterEvent = [];
			aFilterEvent.push(new sap.ui.model.Filter("SAPObjectType", sap.ui.model.FilterOperator.EQ, this.sEventsObjectName));
			aFilterEvent.push(new sap.ui.model.Filter("event", sap.ui.model.FilterOperator.EQ, this.sObjectType));
			this.sResHelpEvent = null;
			this.oModel.read(sUriMgr, {
				filters: aFilterEvent,

				success: function (oResponse) {

					this.sResHelpEvent = oResponse.results;
					this.oTable.setProperty("/eventIdHelp", this.sResHelpEvent);

				}.bind(this),
				error: function () {

				}
			});

		},

		/* End read Event ID Help */

		onClickSave: function () {
			var aTarget = [];
			var flag = 0,
				flagOut = 0,
				flagAPI = 0,
				flagEventPlan = 0,
				flagAPIPlan = 0,
				flagExtPlan = 0,
				flagOutPlan = 0,
				flagMigrPlan = 0,
				flagSearchPlan = 0,
				flagEventActual = 0,
				flagSearchActual = 0,
				flagHeader = 0,
				flagCDSActual = 0;

			// Get i18n texts
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var deleteConfirmationMessage = oBundle.getText("deleteConfirmationMessage");
			var errorMsg;

			var releaseStateValidation = this.fnValidateReleaseState();
			if (releaseStateValidation === false) {
				errorMsg = oBundle.getText("releaseStateCheck");
				this.oMessage.push(errorMsg);
				flagHeader = 1;
				aTarget.push("headerSection");
				sap.ui.Gemini.Blocks.getView().byId("sReleaseStatus").setValueState("Error");
				sap.ui.Gemini.Blocks.getView().byId("sReleaseStatus").setValueStateText("Change the release state");
			}

			var oModel = this.getView().getModel("Gemini");
			this.getView().getModel("Gemini").refresh(true);
			var searchPlan = oModel.getProperty("/search");
			var searchtable = this.getView().byId("idTable9");

			var aItems = searchtable.getItems();
			if (searchPlan.length != 0) {
				for (var check = 0; check < searchPlan.length; check++) {
					var searchPlanF1 = true,
						searchPlanF2 = true,
						searchPlanF3 = true,
						searchPlanF4 = true;

					var targetrelease = this.getView().byId("targetReleaseSearch");
					var targetreleaseCol = this.getView().byId("idTable9").indexOfColumn(targetrelease);
					var jiraBacklog = this.getView().byId("jirasearch");
					var jiraBacklogCol = this.getView().byId("idTable9").indexOfColumn(jiraBacklog);
					var searchObject = this.getView().byId("searchObjectPlanned");
					var searchObjectCol = this.getView().byId("idTable9").indexOfColumn(searchObject);

					aItems[check].getAggregation("cells")[targetreleaseCol].setValueState("None");
					aItems[check].getAggregation("cells")[searchObjectCol].setValueState("None");
					aItems[check].getAggregation("cells")[jiraBacklogCol].setValueState("None");

					if (searchPlan[check].search_object.trim().length > 20 && searchPlanF1) {
						searchPlanF1 = false;
						flagSearchPlan = 1;

						errorMsg = oBundle.getText("genericLengthCheck", ["Search Object", "20"]);
						aItems[check].getAggregation("cells")[searchObjectCol].setValueState("Error");
						aItems[check].getAggregation("cells")[searchObjectCol].setValueStateText("Value should be less than 20 characters");

						this.oMessage.push(errorMsg);
						aTarget.push("Section6");
					}

					if (searchPlan[check].target_release.trim() === "" && searchPlanF3) {
						searchPlanF3 = false;
						flagSearchPlan = 1;
						errorMsg = oBundle.getText("onSaveErrorGenericTextEmptyValue", ["Target Release", "Planned", "Search Objects"]);
						this.oMessage.push(errorMsg);
						aTarget.push("Section6");
						aItems[check].getAggregation("cells")[targetreleaseCol].setValueState("Error");
						aItems[check].getAggregation("cells")[targetreleaseCol].setValueStateText("Enter value");

					}

					if ((searchPlan[check].jira_valid === '0' || searchPlan[check].jira_backlog.length > 100) && searchPlanF4) {
						flagSearchPlan = 1;
						searchPlanF4 = false;
						if (searchPlan[check].jira_backlog.length > 100) {
							errorMsg = oBundle.getText("genericLengthCheck", ["JIRA Backlog ID", "100"]);

						} else {
							errorMsg = oBundle.getText("onSaveErrorGenericTextEmptyValue", ["valid JIRA ID", "Planned", "Search Objects"]);

						}

						aItems[check].getAggregation("cells")[jiraBacklogCol].setValueState("Error");
						aItems[check].getAggregation("cells")[jiraBacklogCol].setValueStateText("Enter valid JIRA ID");
						this.oMessage.push(errorMsg);
						aTarget.push("Section6");
					}

				}
			}
			// search actual add entries save
			var oModelactual = this.getView().getModel("search");
			this.getView().getModel("search").refresh(true);
			var searchActual = oModelactual.getProperty("/searchactual");
			var searchactualtable = this.getView().byId("Searchactualtable");

			var actualItems = searchactualtable.getItems();
			if (searchActual.length != 0) {
				var searchobject = this.getView().byId("searchObjectActual");
				var searchobjectCol = this.getView().byId("Searchactualtable").indexOfColumn(searchobject);
				for (var checkactual = 0; checkactual < searchActual.length; checkactual++) {

					var searchActualF1 = true;

					actualItems[checkactual].getAggregation("cells")[searchobjectCol].setValueState("None");

					if ((searchActual[checkactual].search_object.trim() === "" || searchActual[checkactual].search_object == null || searchActual[
							checkactual].search_object.trim().length > 20) && searchActualF1) {
						searchActualF1 = false;
						flagSearchActual = 1;
						if (searchActual[checkactual].search_object.trim().length > 20) {
							errorMsg = oBundle.getText("genericLengthCheck", ["Search Object", "20"]);
							actualItems[checkactual].getAggregation("cells")[searchobjectCol].setValueState("Error");
							actualItems[checkactual].getAggregation("cells")[searchobjectCol].setValueStateText("Value should be less than 20 characters");
						} else {
							errorMsg = oBundle.getText("onSaveErrorGenericTextEmptyValue", ["Search Object", "Actuals", "Search Objects"]);
							this.oMessage.push(errorMsg);
							aTarget.push("Section6");
							actualItems[checkactual].getAggregation("cells")[searchobjectCol].setValueState("Error");
							actualItems[checkactual].getAggregation("cells")[searchobjectCol].setValueStateText("Enter value");
						}

					}
				}
			}
			var aAPIPlan = $.extend(true, [], this.oTable.getProperty("/apiplan"));

			var apitable = this.getView().byId("TablePlanAPI");
			var aItems = apitable.getItems();
			if (aAPIPlan.length != 0) {

				var changeType = this.getView().byId("changeTypeAPI");
				var changeTypeCol = this.getView().byId("TablePlanAPI").indexOfColumn(changeType);
				var protocol = this.getView().byId("protocolAPI");
				var protocolCol = this.getView().byId("TablePlanAPI").indexOfColumn(protocol);
				var readApplicable = this.getView().byId("readApplicableAPI");
				var readApplicableCol = this.getView().byId("TablePlanAPI").indexOfColumn(readApplicable);
				var createApplicable = this.getView().byId("createApplicableAPI");
				var createApplicableCol = this.getView().byId("TablePlanAPI").indexOfColumn(createApplicable);
				var updateApplicable = this.getView().byId("updateApplicableAPI");
				var updateApplicableCol = this.getView().byId("TablePlanAPI").indexOfColumn(updateApplicable);
				var deleteApplicable = this.getView().byId("deleteApplicableAPI");
				var deleteApplicableCol = this.getView().byId("TablePlanAPI").indexOfColumn(deleteApplicable);
				var othersApplicable = this.getView().byId("othersApplicableAPI");
				var othersApplicableCol = this.getView().byId("TablePlanAPI").indexOfColumn(othersApplicable);
				var serviceInterface = this.getView().byId("serviceInterfaceAPI");
				var serviceInterfaceCol = this.getView().byId("TablePlanAPI").indexOfColumn(serviceInterface);
				var targetRelease = this.getView().byId("targetReleaseAPI");
				var targetReleaseCol = this.getView().byId("TablePlanAPI").indexOfColumn(targetRelease);
				var jira = this.getView().byId("jiraAPI");
				var jiraCol = this.getView().byId("TablePlanAPI").indexOfColumn(jira);
				var reqJira = this.getView().byId("reqJiraLinkAPI");
				var reqJiraCol = this.getView().byId("TablePlanAPI").indexOfColumn(reqJira);

				for (var i = 0; i < aAPIPlan.length; i++) {
					var aAPIPlanF1 = true,
						aAPIPlanF2 = true,
						aAPIPlanF3 = true,
						aAPIPlanF4 = true,
						aAPIPlanF5 = true,
						aAPIPlanF6 = true;

					aItems[i].getAggregation("cells")[changeTypeCol].setValueState("None");
					aItems[i].getAggregation("cells")[protocolCol].setValueState("None");
					aItems[i].getAggregation("cells")[serviceInterfaceCol].setValueState("None");
					aItems[i].getAggregation("cells")[targetReleaseCol].setValueState("None");

					if (aAPIPlan[i].change_type === oBundle.getText("changeTypeNew")) {
						if (aAPIPlan[i].protocol.trim() === "" && aAPIPlanF2) {
							flagAPIPlan = 1;
							aAPIPlanF2 = false;
							errorMsg = oBundle.getText("onSaveErrorGenericTextEmptyValue", ["Protocol", "Planned", "API"]);
							this.oMessage.push(errorMsg);
							aTarget.push("SectionAPI");
							aItems[i].getAggregation("cells")[protocolCol].setValueState("Error");
							aItems[i].getAggregation("cells")[protocolCol].setValueStateText("Enter value");

						}
					} else if (aAPIPlan[i].change_type === oBundle.getText("changeTypeEnhancement")) {
						if (aAPIPlan[i].mapped_service_interface.trim() === "" && aAPIPlanF4) {
							flagAPIPlan = 1;
							aAPIPlanF4 = false;
							errorMsg = oBundle.getText("onSaveErrorGenericTextEmptyValue", ["Service Interface", "Planned", "API"]);
							this.oMessage.push(errorMsg);
							aTarget.push("SectionAPI");
							aItems[i].getAggregation("cells")[serviceInterfaceCol].setValueState("Error");
							aItems[i].getAggregation("cells")[serviceInterfaceCol].setValueStateText("Enter value");

						}
					}

					if (aAPIPlan[i].target_release.trim() === "" && aAPIPlanF3) {
						flagAPIPlan = 1;
						aAPIPlanF3 = false;
						errorMsg = oBundle.getText("onSaveErrorGenericTextEmptyValue", ["Target Release", "Planned", "API"]);
						this.oMessage.push(errorMsg);
						aTarget.push("SectionAPI");
						aItems[i].getAggregation("cells")[targetReleaseCol].setValueState("Error");
						aItems[i].getAggregation("cells")[targetReleaseCol].setValueStateText("Enter value");

					}
					if (aAPIPlan[i].jira_valid === '0' || aAPIPlan[i].jira_backlog.length > 100) {
						flagAPIPlan = 1;
						aAPIPlanF3 = false;
						if (aAPIPlan[i].jira_backlog.length > 100) {
							errorMsg = oBundle.getText("genericLengthCheck", ["JIRA Backlog ID", "100"]);

						} else {
							errorMsg = oBundle.getText("onSaveErrorGenericTextEmptyValue", ["valid JIRA ID", "Planned", "API"]);

						}

						aItems[i].getAggregation("cells")[jiraCol].setValueState("Error");
						aItems[i].getAggregation("cells")[jiraCol].setValueStateText("Enter valid JIRA ID");
						this.oMessage.push(errorMsg);
						aTarget.push("SectionAPI");

					}
					if (aAPIPlan[i].jira_req_valid === '0' || aAPIPlan[i].requirement_jira.length > 100) {
						flagAPIPlan = 1;
						aAPIPlanF6 = false;
						if (aAPIPlan[i].requirement_jira.length > 100) {
							errorMsg = oBundle.getText("genericLengthCheck", ["Requirement JIRA Backlog ID", "100"]);

						} else {
							errorMsg = oBundle.getText("onSaveErrorGenericTextEmptyValue", ["valid Requirement JIRA ID", "Planned", "API"]);

						}

						aItems[i].getAggregation("cells")[reqJiraCol].setValueState("Error");
						aItems[i].getAggregation("cells")[reqJiraCol].setValueStateText("Enter valid JIRA ID");
						this.oMessage.push(errorMsg);
						aTarget.push("SectionAPI");

					}
					if (aItems[i].getAggregation("cells")[readApplicableCol].getSelected() === false && aItems[i].getAggregation("cells")[
							createApplicableCol].getSelected() === false && aItems[i].getAggregation("cells")[othersApplicableCol].getSelected() === false &&
						aItems[i].getAggregation("cells")[updateApplicableCol].getSelected() === false && aItems[i].getAggregation("cells")[
							deleteApplicableCol].getSelected() === false) {
						flagAPIPlan = 1;
						aAPIPlanF5 = false;
						errorMsg = oBundle.getText("onSaveErrorGenericTextEmptyValue", ["at least one checkbox", "Planned", "API"]);
						this.oMessage.push(errorMsg);
						aTarget.push("SectionAPI");

					}

				}
			}
			var aOutput = $.extend(true, [], this.oTable.getProperty("/output"));

			var outputtable = this.getView().byId("idTable2");
			var aItems = outputtable.getItems();
			if (aOutput.length != 0) {
				var outputobject = this.getView().byId("outputObject");
				var outputobjectCol = this.getView().byId("idTable2").indexOfColumn(outputobject);
				for (var i = 0; i < aOutput.length; i++) {
					var aOutputF1 = true;

					aItems[i].getAggregation("cells")[outputobjectCol].setValueState("None");

					aItems[i].getAggregation("cells")[outputobjectCol].setValueState("None");
					if (aOutput[i].value.trim() === "" && aOutputF1) {
						flagOut = 1;
						aOutputF1 = false;
						errorMsg = oBundle.getText("onSaveErrorGenericTextEmptyValue", ["Output Object", "Actuals", "Output Objects"]);
						this.oMessage.push(errorMsg);
						aTarget.push("Section2");
						aItems[i].getAggregation("cells")[outputobjectCol].setValueState("Error");
						aItems[i].getAggregation("cells")[outputobjectCol].setValueStateText("Enter value");

					}
				}
			}

			var aAPI = $.extend(true, [], this.oTable.getProperty("/api"));

			var aAPItable = this.getView().byId("idTable6");
			var aItems = aAPItable.getItems();
			if (aAPI.length != 0) {
				var serviceinterface = this.getView().byId("serviceInterfaceCol");
				var serviceinterfaceCol = this.getView().byId("idTable6").indexOfColumn(serviceinterface);
				for (i = 0; i < aAPI.length; i++) {
					var aAPIF1 = true;
					aItems[i].getAggregation("cells")[serviceinterfaceCol].setValueState("None");

					if (aAPI[i].si.trim() === "" && aAPIF1) {
						flagAPI = 1;
						aAPIF1 = false;
						errorMsg = oBundle.getText("onSaveErrorGenericTextEmptyValue", ["Service Interface", "Actuals", "API"]);
						this.oMessage.push(errorMsg);
						aTarget.push("SectionAPI");
						aItems[i].getAggregation("cells")[serviceinterfaceCol].setValueState("Error");
						aItems[i].getAggregation("cells")[serviceinterfaceCol].setValueStateText("Enter value");
					}
				}
			}
			var aEventPlan = $.extend(true, [], this.getView().getModel("geminievents").getData().aEvents);

			var eventtable = this.getView().byId("TablePlanEventsEdit");

			var aItems = eventtable.getItems();
			if (aEventPlan.length != 0) {
				var changetype = this.getView().byId("changeTypeEvent");
				var changetypeCol = this.getView().byId("TablePlanEventsEdit").indexOfColumn(changetype);
				var sapobjectevent = this.getView().byId("sapObjectEvent");
				var sapobjecteventCol = this.getView().byId("TablePlanEventsEdit").indexOfColumn(sapobjectevent);
				var sapobjecttaskcode = this.getView().byId("sapObjectTaskCode");
				var sapobjecttaskcodeCol = this.getView().byId("TablePlanEventsEdit").indexOfColumn(sapobjecttaskcode);
				var targetreleaseevent = this.getView().byId("targetReleaseEvent");
				var targetreleaseeventCol = this.getView().byId("TablePlanEventsEdit").indexOfColumn(targetreleaseevent);
				var jiraevent = this.getView().byId("jiraeventcolumn");
				var jiraeventCol = this.getView().byId("TablePlanEventsEdit").indexOfColumn(jiraevent);
				for (i = 0; i < aEventPlan.length; i++) {

					aItems[i].getAggregation("cells")[sapobjecteventCol].setValueState("None");
					aItems[i].getAggregation("cells")[sapobjecttaskcodeCol].setValueState("None");
					aItems[i].getAggregation("cells")[jiraeventCol].setValueState("None");
					var aFindEvent = aEventPlan.filter(function (Object) {
						return Object.bo_event === aEventPlan[i].bo_event && Object.changetype === 'New' && aEventPlan[i].bo_event.trim().length !== 0;
					});
					if (aFindEvent.length > 1 && aEventPlan[i].changetype !== 'Not Relevant') {
						flagEventPlan = 1;
						errorMsg = oBundle.getText("changeTypeExistsEvent");
						this.oMessage.push(errorMsg);
						aTarget.push("events");
						aItems[i].getAggregation("cells")[changetypeCol].setValueState("Error");
						aItems[i].getAggregation("cells")[sapobjecteventCol].setValueState("Error");
					}
					if ((aEventPlan[i].changetype.trim() === "Enhancement" && aEventPlan[i].bo_event.trim() === "") || aEventPlan[i].bo_event.trim()
						.length >
						32) {
						flagEventPlan = 1;
						if (aEventPlan[i].bo_event.trim().length > 32) {
							errorMsg = oBundle.getText("genericLengthCheck", ["SAP Object Event", "32"]);
							aItems[i].getAggregation("cells")[sapobjecteventCol].setValueState("Error");
							aItems[i].getAggregation("cells")[sapobjecteventCol].setValueStateText("Value should be less than 32 characters");
						} else {
							errorMsg = oBundle.getText("onSaveErrorGenericTextEmptyValue", ["SAP Object Event", "Planned", "Events"]);

							aItems[i].getAggregation("cells")[sapobjecteventCol].setValueState("Error");
							aItems[i].getAggregation("cells")[sapobjecteventCol].setValueStateText("Enter value");
						}
						this.oMessage.push(errorMsg);
						aTarget.push("events");
					}
					if (aEventPlan[i].changetype.trim() !== "Not Relevant" && aEventPlan[i].target_release.trim() === "") {
						flagEventPlan = 1;
						errorMsg = oBundle.getText("onSaveErrorGenericTextEmptyValue", ["Target Release", "Planned", "Events"]);
						this.oMessage.push(errorMsg);
						aTarget.push("events");

						aItems[i].getAggregation("cells")[targetreleaseeventCol].setValueState("Error");
						aItems[i].getAggregation("cells")[targetreleaseeventCol].setValueStateText("Enter value");

					}
					if (aEventPlan[i].changetype.trim() === "Enhancement" && aEventPlan[i].bo_task.trim() === "") {
						flagEventPlan = 1;
						errorMsg = oBundle.getText("onSaveErrorGenericTextEmptyValue", ["SAP Object Task Code", "Planned", "Events"]);
						this.oMessage.push(errorMsg);
						aTarget.push("events");
						aItems[i].getAggregation("cells")[sapobjecttaskcodeCol].setValueState("Error");
						aItems[i].getAggregation("cells")[sapobjecttaskcodeCol].setValueStateText("Enter value");

					}
					if (aEventPlan[i].changetype.trim() === "Enhancement" && aEventPlan[i].bo_event.trim() === "") {
						flagEventPlan = 1;
						errorMsg = oBundle.getText("onSaveErrorGenericTextEmptyValue", ["SAP Object Event", "Planned", "Events"]);
						this.oMessage.push(errorMsg);
						aTarget.push("events");
						aItems[i].getAggregation("cells")[sapobjecttaskcodeCol].setValueState("Error");
						aItems[i].getAggregation("cells")[sapobjecttaskcodeCol].setValueStateText("Enter value");

					}
					if (aEventPlan[i].jira_valid === '0' || aEventPlan[i].jira_backlog.trim().length > 100) {
						flagEventPlan = 1;

						if (aEventPlan[i].jira_backlog.trim().length > 100) {
							errorMsg = oBundle.getText("genericLengthCheck", ["JIRA Backlog ID", "100"]);

						} else {

							errorMsg = oBundle.getText("onSaveErrorGenericTextEmptyValue", ["Valid JIRA ID", "Planned", "Events"]);
						}
						aItems[i].getAggregation("cells")[jiraeventCol].setValueState("Error");
						aItems[i].getAggregation("cells")[jiraeventCol].setValueStateText("Enter valid JIRA ID");
						this.oMessage.push(errorMsg);
						aTarget.push("events");
					}

				}
			}

			var aEventActual = $.extend(true, [], this.getView().getModel("Gemini").getData().events);

			var EventTable = this.getView().byId("eventsTableOnEdit");
			var aItems = EventTable.getItems();
			if (aEventActual.length != 0) {
				var sapobjecteventactual = this.getView().byId("sapObjectEventActual");
				var sapobjecteventactualCol = this.getView().byId("eventsTableOnEdit").indexOfColumn(sapobjecteventactual);
				var sapobjecttaskcodeactual = this.getView().byId("sapObjectTaskCodeActual");
				var sapobjecttaskcodeactualCol = this.getView().byId("eventsTableOnEdit").indexOfColumn(sapobjecttaskcodeactual);
				var sapobjecttasktypename = this.getView().byId("sapObjectTaskTypeName");
				var sapobjecttasktypenameCol = this.getView().byId("eventsTableOnEdit").indexOfColumn(sapobjecttasktypename);

				for (i = 0; i < aEventActual.length; i++) {

					aItems[i].getAggregation("cells")[sapobjecteventactualCol].setValueState("None");
					aItems[i].getAggregation("cells")[sapobjecttaskcodeactualCol].setValueState("None");
					aItems[i].getAggregation("cells")[sapobjecttasktypenameCol].setValueState("None");

					if (aEventActual[i].Event.trim() === "") {
						flagEventActual = 1;
						errorMsg = oBundle.getText("onSaveErrorGenericTextEmptyValue", ["SAP Object Event", "Actuals", "Events"]);
						this.oMessage.push(errorMsg);
						aTarget.push("events");
						aItems[i].getAggregation("cells")[sapobjecteventactualCol].setValueState("Error");
						aItems[i].getAggregation("cells")[sapobjecteventactualCol].setValueStateText("Enter value");

					}
					if (aEventActual[i].TaskCode.trim() === "") {
						flagEventActual = 1;
						errorMsg = oBundle.getText("onSaveErrorGenericTextEmptyValue", ["SAP Object Task Code", "Actuals", "Events"]);
						this.oMessage.push(errorMsg);
						aTarget.push("events");

						aItems[i].getAggregation("cells")[sapobjecttaskcodeactualCol].setValueState("Error");
						aItems[i].getAggregation("cells")[sapobjecttaskcodeactualCol].setValueStateText("Enter value");

					}
					if (aEventActual[i].TaskText.trim() === "" || aEventActual[i].TaskText.trim().length > 80) {
						flagEventActual = 1;
						if (aEventActual[i].TaskText.trim().length > 80) {
							errorMsg = oBundle.getText("genericLengthCheck", ["SAP Object Task Type Name", "80"]);
							aItems[i].getAggregation("cells")[sapobjecttasktypenameCol].setValueState("Error");
							aItems[i].getAggregation("cells")[sapobjecttasktypenameCol].setValueStateText("Value should be less 80 characters");
						} else {
							errorMsg = oBundle.getText("onSaveErrorGenericTextEmptyValue", ["SAP Object Task Type Name", "Actuals", "Events"]);
							aItems[i].getAggregation("cells")[sapobjecttasktypenameCol].setValueState("Error");
							aItems[i].getAggregation("cells")[sapobjecttasktypenameCol].setValueStateText("Enter value");
						}
						this.oMessage.push(errorMsg);
						aTarget.push("events");
					}
				}
			}

			flagOutPlan = 0;
			var aOutputPlan = $.extend(true, [], this.getView().getModel("geminioutput").getData().aOutObjs);

			var aOutputTable = this.getView().byId("TablePlanOutEdit");
			var aItems = aOutputTable.getItems();
			if (aOutputPlan.length !== 0) {
				var applicationbjectypectual = this.getView().byId("applicationObjectTypePlanned");
				var applicationbjectypectualCol = this.getView().byId("TablePlanOutEdit").indexOfColumn(applicationbjectypectual);
				var outputobjectactual = this.getView().byId("outputObjectPlanned");
				var outputobjectactualCol = this.getView().byId("TablePlanOutEdit").indexOfColumn(outputobjectactual);
				var targetreleaseoutputactual = this.getView().byId("targetReleaseOutputPlanned");
				var targetreleaseoutputactualCol = this.getView().byId("TablePlanOutEdit").indexOfColumn(targetreleaseoutputactual);
				var jiraoutputactual = this.getView().byId("jiraOutputPlanned");
				var jiraoutputactualCol = this.getView().byId("TablePlanOutEdit").indexOfColumn(jiraoutputactual);
				var changeTypeactual = this.getView().byId("changeTypeOutput");
				var changeTypeactualCol = this.getView().byId("TablePlanOutEdit").indexOfColumn(changeTypeactual);

				for (i = 0; i < aOutputPlan.length; i++) {

					var aOutputPlanF1 = true,
						aOutputPlanF2 = true,
						aOutputPlanF3 = true,
						aOutputPlanF4 = true;

					aItems[i].getAggregation("cells")[applicationbjectypectualCol].setValueState("None");
					aItems[i].getAggregation("cells")[outputobjectactualCol].setValueState("None");
					aItems[i].getAggregation("cells")[targetreleaseoutputactualCol].setValueState("None");

					if ((aOutputPlan[i].application_object.trim() === "" && aOutputPlanF1 && aOutputPlan[i].changeType.trim() !==
							"New") && (aOutputPlan[i].output_type.trim() !== "") || (aOutputPlan[i].application_object.trim().length > 30 && aOutputPlanF1)) {
						flagOutPlan = 1;
						aOutputPlanF1 = false;
						if (aOutputPlan[i].application_object.trim().length > 30) {
							errorMsg = oBundle.getText("genericLengthCheck", ["Application Object Type", "30"]);

							aItems[i].getAggregation("cells")[applicationbjectypectualCol].setValueState("Error");
							aItems[i].getAggregation("cells")[applicationbjectypectualCol].setValueStateText("Value should be less than 30 characters");

						} else {
							errorMsg = oBundle.getText("onSaveErrorGenericTextEmptyValue", ["Application Object Type", "Planned", "Output Objects"]);

							aItems[i].getAggregation("cells")[applicationbjectypectualCol].setValueState("Error");
							aItems[i].getAggregation("cells")[applicationbjectypectualCol].setValueStateText("Enter value");

						}
						this.oMessage.push(errorMsg);
						aTarget.push("Section2");

					}
					if ((aOutputPlan[i].output_type.trim() === "" && aOutputPlanF2 && aOutputPlan[i].changeType.trim() !==
							"New") || (aOutputPlan[i].output_type.trim().length > 30 && aOutputPlanF2)) {
						flagOutPlan = 1;
						aOutputPlanF2 = false;
						if (aOutputPlan[i].output_type.trim().length > 30) {
							errorMsg = oBundle.getText("genericLengthCheck", ["Output Object", "30", "Output Objects"]);

							aItems[i].getAggregation("cells")[outputobjectactualCol].setValueState("Error");
							aItems[i].getAggregation("cells")[outputobjectactualCol].setValueStateText("Value should be less than 30 characters");
						} else {
							errorMsg = oBundle.getText("onSaveErrorGenericTextEmptyValue", ["Output Object", "Planned", "Output Objects"]);

							aItems[i].getAggregation("cells")[outputobjectactualCol].setValueState("Error");
							aItems[i].getAggregation("cells")[outputobjectactualCol].setValueStateText("Enter value");
						}
						this.oMessage.push(errorMsg);
						aTarget.push("Section2");
					}
					if (aOutputPlan[i].target_release.trim() === "" && aOutputPlanF3) {
						flagOutPlan = 1;
						aOutputPlanF3 = false;
						errorMsg = oBundle.getText("onSaveErrorGenericTextEmptyValue", ["Target Release", "Planned", "Output Objects"]);
						this.oMessage.push(errorMsg);
						aTarget.push("Section2");
						aItems[i].getAggregation("cells")[targetreleaseoutputactualCol].setValueState("Error");
						aItems[i].getAggregation("cells")[targetreleaseoutputactualCol].setValueStateText("Enter value");

					}
					if ((aOutputPlan[i].jira_valid === '0' || aOutputPlan[i].jira_backlog.trim().length > 100) && aOutputPlanF4) {
						flagOutPlan = 1;
						aOutputPlanF4 = false;
						if (aOutputPlan[i].jira_backlog.trim().length > 100) {
							errorMsg = oBundle.getText("genericLengthCheck", ["JIRA Backlog ID", "100"]);
						} else {
							errorMsg = oBundle.getText("onSaveErrorGenericTextEmptyValue", ["Valid JIRA ID", "Planned", "Output Objects"]);

						}
						aItems[i].getAggregation("cells")[jiraoutputactualCol].setValueState("Error");
						aItems[i].getAggregation("cells")[jiraoutputactualCol].setValueStateText("Enter valid JIRA ID");
						this.oMessage.push(errorMsg);
						aTarget.push("Section2");
					}
				}
			}

			var aExtPlan = $.extend(true, [], this.oTable.getProperty("/extplan"));

			var aExtTable = this.getView().byId("TablePlanExt");
			var aItems = aExtTable.getItems();
			if (aExtPlan.length != 0) {
				for (i = 0; i < aExtPlan.length; i++) {

					var aExtPlanF1 = true,
						aExtPlanF2 = true,
						aExtPlanF3 = true,
						aExtPlanF4 = true,
						aExtPlanF5 = true;

					var targetreleaseext = this.getView().byId("targetReleaseExtInput");
					var targetreleaseextCol = this.getView().byId("TablePlanExt").indexOfColumn(targetreleaseext);
					var businesscontext = this.getView().byId("businessContextInput");
					var businesscontextCol = this.getView().byId("TablePlanExt").indexOfColumn(businesscontext);
					var jiraext = this.getView().byId("jiraExt");
					var jiraextCol = this.getView().byId("TablePlanExt").indexOfColumn(jiraext);

					aItems[i].getAggregation("cells")[businesscontextCol].setValueState("None");
					aItems[i].getAggregation("cells")[targetreleaseextCol].setValueState("None");

					// Business Context Check only if change type is enhancement

					if (((aExtPlan[i].change_type.trim() === "Enhancement" && aExtPlan[i].business_context.trim() === "") || (aExtPlan[i].business_context
							.trim().length > 30)) && aExtPlanF1) {
						flagExtPlan = 1;
						aExtPlanF1 = false;
						if (aExtPlan[i].business_context.trim().length > 30) {
							errorMsg = oBundle.getText("genericLengthCheck", ["Business Context", "30"]);
							aItems[i].getAggregation("cells")[businesscontextCol].setValueState("Error");
							aItems[i].getAggregation("cells")[businesscontextCol].setValueStateText("Value should be less than 30 characters");
						} else {
							errorMsg = oBundle.getText("onSaveErrorGenericTextEmptyValue", ["Business Context", "Planned", "Extensions"]);
							aItems[i].getAggregation("cells")[businesscontextCol].setValueState("Error");
							aItems[i].getAggregation("cells")[businesscontextCol].setValueStateText("Enter value");
						}
						this.oMessage.push(errorMsg);
						aTarget.push("SectionE");

					}

					if (aExtPlan[i].target_release.trim() === "" && aExtPlanF2) {
						flagExtPlan = 1;
						aExtPlanF2 = false;
						errorMsg = oBundle.getText("onSaveErrorGenericTextEmptyValue", ["Target Release", "Planned", "Extensions"]);
						this.oMessage.push(errorMsg);
						aTarget.push("SectionE");
						aItems[i].getAggregation("cells")[targetreleaseextCol].setValueState("Error");
						aItems[i].getAggregation("cells")[targetreleaseextCol].setValueStateText("Enter value");

					}

					if ((aExtPlan[i].jira_valid === "0" && aExtPlanF3 && aExtPlan[i].jira_backlog.trim() !== "") || (aExtPlan[i].jira_backlog.trim().length >
							100 && aExtPlanF3)) {
						flagExtPlan = 1;
						aExtPlanF3 = false;
						if (aExtPlan[i].jira_backlog.trim().length > 100) {
							errorMsg = oBundle.getText("genericLengthCheck", ["JIRA Backlog ID", "100"]);
						} else {
							errorMsg = oBundle.getText("onSaveErrorGenericTextEmptyValue", ["valid JIRA ID", "Planned", "Extensions"]);

						}
						this.oMessage.push(errorMsg);
						aTarget.push("SectionE");
						aItems[i].getAggregation("cells")[jiraextCol].setValueState("Error");
						aItems[i].getAggregation("cells")[jiraextCol].setValueStateText("Enter valid JIRA ID");
					}

				}
			}

			var aMigrPlanTable = this.getView().getModel("geminiMigr").getData().aMigrPlan;
			var aMigrationActuals = this.oTable.getProperty("/migr");

			var aMigrTable = this.getView().byId("TablePlanMigrEdit");
			var aItems = aMigrTable.getItems();
			if (aMigrPlanTable.length !== 0) {

				var migrationobjectsplan = this.getView().byId("migrObjPlan");
				var migrationobjectsplanCol = this.getView().byId("TablePlanMigrEdit").indexOfColumn(migrationobjectsplan);
				var loadapi = this.getView().byId("loadAPI");
				var loadapiCol = this.getView().byId("TablePlanMigrEdit").indexOfColumn(loadapi);
				var loadapiavailabilityplan = this.getView().byId("colM15");
				var loadapiavailabilityplanCol = this.getView().byId("TablePlanMigrEdit").indexOfColumn(loadapiavailabilityplan);
				var targetreleasemigration = this.getView().byId("colM16");
				var targetreleasemigrationCol = this.getView().byId("TablePlanMigrEdit").indexOfColumn(targetreleasemigration);
				var jiramigration = this.getView().byId("col1M19");
				var jiramigrationCol = this.getView().byId("TablePlanMigrEdit").indexOfColumn(jiramigration);

				for (i = 0; i < aMigrPlanTable.length; i++) {

					aItems[i].getAggregation("cells")[migrationobjectsplanCol].setValueState("None");
					aItems[i].getAggregation("cells")[loadapiCol].setValueState("None");
					aItems[i].getAggregation("cells")[loadapiavailabilityplanCol].setValueState("None");
					aItems[i].getAggregation("cells")[targetreleasemigrationCol].setValueState("None");

					if ((aMigrPlanTable[i].change_type.trim() === "Enhancement" && aMigrPlanTable[i].migration_object.trim() === "") || (
							aMigrPlanTable[i].migration_object.trim().length > 20)) {
						flagMigrPlan = 1;
						if (aMigrPlanTable[i].migration_object.trim().length > 20) {
							errorMsg = oBundle.getText("genericLengthCheck", ["Migration Object", "20"]);

							aItems[i].getAggregation("cells")[migrationobjectsplanCol].setValueState("Error");
							aItems[i].getAggregation("cells")[migrationobjectsplanCol].setValueStateText("Value should be less than 20 characters");

						} else {
							errorMsg = oBundle.getText("onSaveErrorGenericTextEmptyValue", ["Migration Object", "Planned", "Migration Objects"]);

							aItems[i].getAggregation("cells")[migrationobjectsplanCol].setValueState("Error");
							aItems[i].getAggregation("cells")[migrationobjectsplanCol].setValueStateText("Enter value");
						}
						this.oMessage.push(errorMsg);
						aTarget.push("Section");
					}

					if (aMigrPlanTable[i].load_api.trim() === "" || aMigrPlanTable[i].load_api.trim().length > 30) {
						flagMigrPlan = 1;
						if (aMigrPlanTable[i].load_api.trim().length > 30) {

							errorMsg = oBundle.getText("genericLengthCheck", ["Load API", "30"]);

							aItems[i].getAggregation("cells")[loadapiCol].setValueState("Error");
							aItems[i].getAggregation("cells")[loadapiCol].setValueStateText("Value should be less than 30 characters");

						} else {
							errorMsg = oBundle.getText("onSaveErrorGenericTextEmptyValue", ["Load API", "Planned", "Migration Objects"]);

							aItems[i].getAggregation("cells")[loadapiCol].setValueState("Error");
							aItems[i].getAggregation("cells")[loadapiCol].setValueStateText("Enter value");
						}
						this.oMessage.push(errorMsg);
						aTarget.push("Section");

					}
					if (aMigrPlanTable[i].load_avail_plan.trim() === "" || aMigrPlanTable[i].load_avail_plan.trim().length > 20) {
						flagMigrPlan = 1;
						if (aMigrPlanTable[i].load_avail_plan.trim().length > 20) {

							errorMsg = oBundle.getText("genericLengthCheck", ["Load API Availability Plan", "20"]);

							aItems[i].getAggregation("cells")[loadapiavailabilityplanCol].setValueState("Error");
							aItems[i].getAggregation("cells")[loadapiavailabilityplanCol].setValueStateText("Value should be less than 20 characters");

						} else {
							errorMsg = oBundle.getText("onSaveErrorGenericTextEmptyValue", ["Load API Availability Plan", "Planned", "Migration Objects"]);

							aItems[i].getAggregation("cells")[loadapiavailabilityplanCol].setValueState("Error");
							aItems[i].getAggregation("cells")[loadapiavailabilityplanCol].setValueStateText("Enter value");
						}
						this.oMessage.push(errorMsg);
						aTarget.push("Section");
					}
					if (aMigrPlanTable[i].target_release.trim() === "") {
						flagMigrPlan = 1;
						errorMsg = oBundle.getText("onSaveErrorGenericTextEmptyValue", ["Target Release", "Planned", "Migration Objects"]);
						this.oMessage.push(errorMsg);
						aTarget.push("Section");

						aItems[i].getAggregation("cells")[targetreleasemigrationCol].setValueState("Error");
						aItems[i].getAggregation("cells")[targetreleasemigrationCol].setValueStateText("Enter value");

					}
					if (aMigrPlanTable[i].jira_valid === '0' || aMigrPlanTable[i].jira_link.trim().length > 100) {

						flagMigrPlan = 1;
						if (aMigrPlanTable[i].jira_link.trim().length > 100) {

							errorMsg = oBundle.getText("genericLengthCheck", ["JIRA Backlog ID", "100"]);

						} else {
							errorMsg = oBundle.getText("onSaveErrorGenericTextEmptyValue", ["Valid JIRA ID", "Planned", "Migration Objects"]);

						}
						aItems[i].getAggregation("cells")[jiramigrationCol].setValueState("Error");
						aItems[i].getAggregation("cells")[jiramigrationCol].setValueStateText("Enter valid JIRA ID");
						this.oMessage.push(errorMsg);
						aTarget.push("Section");
					}
				}
			}

			var aMigrationActuals = this.oTable.getProperty("/migr");
			var aMigrationActualTable = this.getView().byId("tableMigrationActualsEdit");
			var aItems = aMigrationActualTable.getItems();

			for (i = 0; i < aMigrationActuals.length; i++) {
				if (aMigrationActuals[i].ident.trim() === "") {
					flagMigrPlan = 1;
					errorMsg = oBundle.getText("onSaveErrorGenericTextEmptyValue", ["Migration Objects", "Actuals", "Migration Objects"]);
					this.oMessage.push(errorMsg);
					aTarget.push("Section");
					aItems[i].getAggregation("cells")[0].setValueState("Error");
					aItems[i].getAggregation("cells")[0].setValueStateText("Enter value");

				}
			}

			/* CDS Actuals value validation */

			var aCDSActual = $.extend(true, [], this.oTable.getProperty("/cds"));

			var aCDSTable = this.getView().byId("TableActualCDS");
			var aItems = aCDSTable.getItems();
			if (aCDSActual.length != 0) {

				var cdsartifactactual = this.getView().byId("CDSArtifactCol");
				var cdsartifactactualCol = this.getView().byId("TableActualCDS").indexOfColumn(cdsartifactactual);
				var cdsusagetypeactual = this.getView().byId("CDSUsageTypeCol");
				var cdsusagetypeactualCol = this.getView().byId("TableActualCDS").indexOfColumn(cdsusagetypeactual);
				var cdsviewnameactual = this.getView().byId("CDSViewNameCol");
				var cdsviewnameactualCol = this.getView().byId("TableActualCDS").indexOfColumn(cdsviewnameactual);

				for (i = 0; i < aCDSActual.length; i++) {

					var aCDSActualF1 = true,
						aCDSActualF2 = true,
						aCDSActualF3 = true;

					// aItems[i].getAggregation("cells")[0].setValueState("None");
					aItems[i].getAggregation("cells")[cdsusagetypeactualCol].setValueState("None");
					aItems[i].getAggregation("cells")[cdsviewnameactualCol].setValueState("None");
					if (aItems[i].getAggregation("cells")[cdsartifactactualCol].getEnabled()) {

						if (aCDSActual[i].usagetypeString.trim() === "" && aCDSActualF2) {
							flagCDSActual = 1;
							aCDSActualF2 = false;
							errorMsg = oBundle.getText("onSaveErrorGenericTextEmptyValueOneSubSection", ["Usage Type", "CDS"]);
							this.oMessage.push(errorMsg);
							aTarget.push("SectionCDS");
							aItems[i].getAggregation("cells")[cdsusagetypeactualCol].setValueState("Error");
							aItems[i].getAggregation("cells")[cdsusagetypeactualCol].setValueStateText("Enter Value");
						}

						if (aCDSActual[i].view_name.trim() === "" && aCDSActualF3) {
							flagCDSActual = 1;
							aCDSActualF3 = false;
							errorMsg = oBundle.getText("onSaveErrorGenericTextEmptyValueOneSubSection", ["CDS View Name", "CDS"]);
							this.oMessage.push(errorMsg);
							aTarget.push("SectionCDS");
							aItems[i].getAggregation("cells")[cdsviewnameactualCol].setValueState("Error");
							aItems[i].getAggregation("cells")[cdsviewnameactualCol].setValueStateText("Enter Value");

						}

					}
				}
			}

			if (flag || flagAPI || flagOut || flagEventPlan || flagEventActual || flagAPIPlan || flagExtPlan || flagOutPlan || flagMigrPlan ||
				flagSearchPlan || flagSearchActual || flagCDSActual || flagHeader) {
				this.getView().byId("error").setVisible(true);
				var oErrorMessage = new sap.ui.model.json.JSONModel({
					aMockMessage: [],
				});
				var aMockMessages = [];

				for (i = 0; i <= this.oMessage.length - 1; i++) {
					aMockMessages[i] = {
						type: 'Error',
						title: this.oMessage[i],
						description: " ",
						target: aTarget[i]
					};

				}

				this.getView().byId("error").setVisible(true);
				var isMessagePopoverOpen = this.oMessagePopover.isOpen();
				var oMessageButton = this.getView().byId("error");

				this.getView().byId("error").setText(aMockMessages.length);
				oErrorMessage.setData(aMockMessages);

				this.oMessagePopover.setModel(oErrorMessage);

				if (this.isRendered === false) {
					this.getView().byId("error").addEventDelegate({
						"onAfterRendering": function () {
							this.oMessagePopover.openBy(oMessageButton);
							this.isRendered = true;
						}
					}, this);
				} else {

					if (isMessagePopoverOpen === false) {
						this.oMessagePopover.openBy(oMessageButton);
					}
				}

				this.oMessage.splice(0, this.oMessage.length);
			} else {
				this.onSave();
			}
		},
		onReload: function () {
			this.edit = false;
			sap.ushell.Container.setDirtyFlag(false);

			this.getView().byId("idTable6").setMode(sap.m.ListMode.none);
			this.getView().byId("save").setVisible(false);
			this.getView().byId("cancel").setVisible(false);
			if (this.status === "rejected" || this.status === "deprecated") {
				this.getView().byId("assign").setVisible(true);
				this.getView().byId("edit").setVisible(true);
				this.getView().byId("edit").setEnabled(false);
			} else {
				this.getView().byId("edit").setVisible(true);
				this.getView().byId("assign").setVisible(true);
				this.getView().byId("edit").setEnabled(true);
			}

			this.getView().byId("TypeComment").setEditable(false);
			this.getView().byId("TypeComment").setVisible(false);
			this.getView().byId("isext").setEditable(false);
			this.getView().byId("ismig").setEditable(false);
			this.getView().byId("issearch").setEditable(false);
			this.getView().byId("isout").setEditable(false);
			this.getView().byId("isAPIRead").setEditable(false);
			this.getView().byId("isAPICUD").setEditable(false);
			this.onselectoutput();

		},

		onValueHelpRequest: function (oEvent) {
			if (!this._CDSDialog) {
				this._CDSDialog = sap.ui.xmlfragment("s4.cfnd.geminiobjectpage.view.CDSvalueHelp", this);
				this.getView().addDependent(this._CDSDialog);
			}
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._CDSDialog);
			this._CDSDialog.open();
			if (this._CDSDialog) {
				var searchField = sap.ui.getCore().byId("CDSDialog-list");
				searchField.addEventDelegate({
					onfocusin: function () {
						sap.ui.getCore().byId("CDSDialog-searchField").focus();
					}
				}, this);
			}

		},

		handleMessagePopoverPress: function (oEvent) {
			this.oMessagePopover.openBy(oEvent.getSource());
		},
		onMigrationRelevanceChange: function () {
			var that = this;
			if (that.getView().byId("ismig").getSelected()) {
				MessageBox.confirm(
					"Do you want to enable Migration Objects for " + that.sObj + "?", {
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
						onClose: function (sAction) {
							if (sAction === "YES") {
								MigrationObjects.migrationPlanChangeMode(that, 2);
								MigrationObjects.migrationActualsChangeMode(that, 2);
								that.getView().byId("addPlanMigr").setEnabled(true);
								that.getView().byId("migrationActualsAdd").setEnabled(true);
							} else {
								that.getView().byId("ismig").setSelected(false);
							}
						}
					});
			} else {
				MessageBox.confirm(
					"Do you want to disable Migration Objects for " + that.sObj + "?", {
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
						onClose: function (sAction) {
							if (sAction === "YES") {
								MigrationObjects.migrationPlanChangeMode(that, 1);
								MigrationObjects.migrationActualsChangeMode(that, 1);
								that.getView().byId("addPlanMigr").setVisible(true);
								that.getView().byId("addPlanMigr").setEnabled(false);
								that.getView().byId("deleteMigrPlan").setVisible(true);
								that.getView().byId("deleteMigrPlan").setEnabled(false);
								that.getView().byId("mapPlanMigr").setVisible(true);
								that.getView().byId("mapPlanMigr").setEnabled(false);
								that.getView().byId("migrationActualsAdd").setEnabled(false);
								that.getView().byId("migrationActualsAdd").setEnabled(false);
							} else {
								that.getView().byId("ismig").setSelected(true);
							}
						}
					});

			}

		},

		onValueHelpRequestSearch: function (oEvent) {
			this.ipSearchId = oEvent.getSource().getId();
			if (!this._searchDialog) {
				this._searchDialog = sap.ui.xmlfragment("s4.cfnd.geminiobjectpage.view.SearchValueHelp", this);
				this.getView().addDependent(this._searchDialog);
			}

			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._searchDialog);
			this._searchDialog.open();

			if (this._searchDialog) {
				var searchField = sap.ui.getCore().byId("SearchDialog-list");
				searchField.addEventDelegate({
					onfocusin: function () {
						sap.ui.getCore().byId("SearchDialog-searchField").focus();
					}
				}, this);
			}

		},
		handleValueHelpOutputObject: function (oDialog) {
			var sQuery = oDialog.getSource()._sSearchFieldValue;

			var aFilter = new Filter({
				filters: [
					new Filter("OutputType", FilterOperator.Contains, sQuery)
				],
				and: false
			});
			oDialog.getSource().getBinding("items").filter([aFilter]);
		},

		handleValueHelpSearchCDS: function (oDialog) {
			var sQuery = oDialog.getSource()._sSearchFieldValue;

			var aFilter = new Filter({
				filters: [
					new Filter("CDSName", FilterOperator.Contains, sQuery)
				],
				and: false
			});
			oDialog.getSource().getBinding("items").filter([aFilter]);
		},
		handleValueHelpSearch: function (oDialog) {
			var sQuery = oDialog.getSource()._sSearchFieldValue;

			var aFilter = new Filter({
				filters: [
					new Filter("model", FilterOperator.Contains, sQuery)
				],
				and: false
			});
			oDialog.getSource().getBinding("items").filter([aFilter]);
		},

		onAdd: function () {
			this.add = true;
			var oModel = this.getView().getModel("Gemini");

			var oObject = {
				value: "",
				value1: "",
				new_row: true
			};
			var aOutput = oModel.getProperty("/output");
			aOutput.unshift(oObject);
			oModel.refresh(true);
		},

		onValueHelpRequestEventIdObject: function (oEvent) {
			this.ipIdEventId = oEvent.getSource().getId();
			if (!this._OutEventDialog) {
				this._OutEventDialog = sap.ui.xmlfragment("s4.cfnd.geminiobjectpage.view.EventIdValueHelp", this);
				this.getView().addDependent(this._OutEventDialog);
			}

			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._OutEventDialog);
			this._OutEventDialog.open();
			if (this._OutEventDialog) {
				var searchField = sap.ui.getCore().byId("EventHelp-list");
				searchField.addEventDelegate({
					onfocusin: function () {
						sap.ui.getCore().byId("EventHelp-searchField").focus();
					}
				}, this);
			}
		},

		onValueHelpRequestEventTaskCode: function (oEvent) {
			this.ipIdEventTask = oEvent.getSource().getId();
			this.eventTaskId = oEvent.getSource().getId();
			if (!this.eventTaskHelp) {
				this.eventTaskHelp = sap.ui.xmlfragment("s4.cfnd.geminiobjectpage.view.EventTaskHelp", this);
				this.getView().addDependent(this.eventTaskHelp);
			}

			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this.eventTaskHelp);
			this.eventTaskHelp.open();
			if (this.eventTaskHelp) {
				var searchField = sap.ui.getCore().byId("EventTaskHelp-list");
				searchField.addEventDelegate({
					onfocusin: function () {
						sap.ui.getCore().byId("EventTaskHelp-searchField").focus();
					}
				}, this);
			}

		},

		onValueHelpRequestEventNodeType: function (oEvent) {
			this.ipIdEventNodeType = oEvent.getSource().getId();
			if (!this.eventNodeTypeHelp) {
				this.eventNodeTypeHelp = sap.ui.xmlfragment("s4.cfnd.geminiobjectpage.view.EventNodeTypeHelp", this);
				this.getView().addDependent(this.eventNodeTypeHelp);
			}

			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this.eventNodeTypeHelp);
			if (this.eventNodeTypeHelp) {
				var searchField = sap.ui.getCore().byId("EventNodeTypeHelp-list");
				searchField.addEventDelegate({
					onfocusin: function () {
						sap.ui.getCore().byId("EventNodeTypeHelp-searchField").focus();
					}
				}, this);
				var aFilter = new Filter({
					filters: [
						new Filter("SAPObjectType", FilterOperator.EQ, this.sObj)
					],
					and: false
				});
				searchField.getBinding("items").filter([aFilter]);

			}
			this.eventNodeTypeHelp.open();

		},

		fnHandleValueHelpSearchNodeType: function (oEvent) {
			var sQuery = oEvent.getSource()._sSearchFieldValue;

			var aFilter = new Filter({
				filters: [
					new Filter("NodeType", FilterOperator.Contains, sQuery),
					new Filter("SAPObjectType", FilterOperator.EQ, this.sObj)
				],
				and: true
			});
			oEvent.getSource().getBinding("items").filter([aFilter]);

		},

		onValueHelpRequestOutputObject: function (oEvent) {
			this.ipId = oEvent.getSource().getId();
			if (!this._OutDialog) {
				this._OutDialog = sap.ui.xmlfragment("s4.cfnd.geminiobjectpage.view.OutputObjectValueHelp", this);
				this.getView().addDependent(this._OutDialog);
			}

			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._OutDialog);
			this._OutDialog.open();
			if (this._OutDialog) {
				var searchField = sap.ui.getCore().byId("OutputObjectDialog-list");
				searchField.addEventDelegate({
					onfocusin: function () {
						sap.ui.getCore().byId("OutputObjectDialog-searchField").focus();
					}
				}, this);
			}

		},

		onValueHelpRequestCDSViewName: function (oEvent) {
			CDS.onValueHelpRequestViewName(oEvent, this);
		},

		handleedit: function () {
			this.getView().getModel("Header").refresh(true);
			Events.fnEventsModelHandlingOnEdit(this);
			sap.ui.view.Gemini.EventsView = this.getView();
			sap.ui.view.Gemini.headerModelInitial = $.extend(true, {}, this.getView().getModel("Header").getData());
			this.oModel2.setProperty("/sCDSObjTemp", this.oModel2.getProperty("/sCDSObj"));
			this.oTable.setProperty("/NodeTypeTemp", $.extend(true, [], this.oTable.getProperty("/nodetype")));
			this.oTable.setProperty("/CDSKeyFieldsTemp", $.extend(true, [], this.oTable.getProperty("/CDSKeyFields")));
			sap.ui.view.Gemini.viewModel.setProperty("/editable", true);
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			Search.handlesearchedit(this);
			this.sEventplandelcount = 0;
			this.adelCount = 0;
			this.adelCountapi = 0;
			this.adelCountEvents = 0;
			this.adelCountExt = 0;
			this.aOutdel = [];
			this.aApidel = [];
			this.aEventdel = [];
			this.edit = true;
			this.aAPIPlanDel = [];
			this.aExtPlanDel = [];
			this.aAPIPlanMap = [];
			this.aExtPlanMap = [];
			// Edit method for CDS Facet
			CDS.handleEditCDS(this);
			Fiori.handleFioriEdit(this);
			this.oTable.setProperty("/TRSelectedNumber", '');
			this.getView().byId("TablePlanAPI").setVisible(true);
			this.getView().byId("TablePlanAPInonEdit").setVisible(false);
			this.getView().byId("idTable6").setVisible(true);
			this.getView().byId("idTable6nonEdit").setVisible(false);
			this.getView().byId("siId").setEditable(true);

			this.getView().byId("BtnDelAPI").setVisible(true);
			this.getView().byId("BtnConvertAPI").setVisible(true);

			this.getView().byId("BtnDelAPI").setEnabled(false);
			this.getView().byId("BtnConvertAPI").setEnabled(false);
			this.getView().byId("BtnDelAPI").setTooltip(oBundle.getText("deleteErrorMessage"));
			this.getView().byId("BtnConvertAPI").setTooltip(oBundle.getText("convertToActualserrorText"));

			this.getView().byId("deleteMigrPlan").setEnabled(false);
			this.getView().byId("mapPlanMigr").setEnabled(false);
			this.getView().byId("deleteMigrPlan").setTooltip(oBundle.getText("deleteErrorMessage"));
			this.getView().byId("mapPlanMigr").setTooltip(oBundle.getText("mapToActualsNotSelectedErrorText"));

			this.getView().byId("BtnDelExtPlan").setEnabled(false);
			this.getView().byId("BtnMapExt").setEnabled(false);
			this.getView().byId("BtnDelExtPlan").setTooltip(oBundle.getText("deleteErrorMessage"));
			this.getView().byId("BtnMapExt").setTooltip(oBundle.getText("mapToActualsNotSelectedErrorText"));

			this.getView().byId("convertPlanOut").setEnabled(false);
			this.getView().byId("deletePlanOut").setEnabled(false);
			this.getView().byId("deletePlanOut").setTooltip(oBundle.getText("deleteErrorMessage"));
			this.getView().byId("convertPlanOut").setTooltip(oBundle.getText("convertToActualserrorText"));
			this.getView().byId("AddCDSKeyFields").setEnabled(false);

			this.getView().byId("BtnConvertSearch").setEnabled(false);
			this.getView().byId("deleteSearchPlan").setEnabled(false);
			this.getView().byId("deleteSearchPlan").setTooltip(oBundle.getText("deleteErrorMessage"));
			this.getView().byId("BtnConvertSearch").setTooltip(oBundle.getText("convertToActualserrorText"));
			this.getView().byId("deleteSearchActual").setEnabled(false);
			this.getView().byId("deleteSearchActual").setTooltip(oBundle.getText("deleteErrorMessage"));

			this.getView().byId("deleteplanEvents").setTooltip(oBundle.getText("deleteErrorMessage"));
			this.getView().byId("BtnMapEvent").setTooltip(oBundle.getText("convertToActualserrorText"));

			this.prevValue1 = [];
			this.prevValue2 = [];

			this.getView().byId("releaseAPI").setEditable(true);
			this.getView().byId("descAPI").setEditable(true);

			// Toggling Field Visibility for Extensibility
			this.getView().byId("bc").setEditable(true);
			this.getView().byId("changeTypeExtCombo").setEditable(true);
			this.getView().byId("changeTypeExtCombo").setShowButton(true);
			this.getView().byId("releaseExt").setEditable(true);
			this.getView().byId("descExt").setEditable(true);
			this.getView().byId("ExtTypeCombo").setEditable(true);
			this.getView().byId("ExtTypeCombo").setShowButton(true);
			this.getView().byId("jiraExt").setVisible(true);
			this.getView().byId("jiraLinkExt").setVisible(false);
			this.getView().byId("TablePlanExt2").setVisible(false);
			this.getView().byId("TablePlanExt").setVisible(true);

			// For Output
			// Migration Objects Edit mode
			if (this.getView().byId("ismig").getSelected()) {
				MigrationObjects.migrationPlanChangeMode(this, 2);
				MigrationObjects.migrationActualsChangeMode(this, 2);
			}

			// Enabling deletion for API planning objects
			this.getView().byId("TablePlanAPI").setMode(sap.m.ListMode.SingleSelectLeft);
			this.tmpModelAPIPlan = $.extend(true, [], this.oTable.getProperty("/apiplan"));

			// Enabling deletion for Extensibility planning objects only if
			// Extension Applicable Checkbox is ticked
			this.getView().byId("BtnDelExtPlan").setVisible(true);
			if (this.headerModel.sIsExt) {

				this.getView().byId("TablePlanExt").setMode(sap.m.ListMode.SingleSelectLeft);
				this.getView().byId("TablePlanExt").setVisible(true); // Edit
				// Table
				this.getView().byId("TablePlanExt2").setVisible(false); // Display
				// Table
			} else {
				this.getView().byId("TablePlanExt").setVisible(false); // Edit
				// Table
				this.getView().byId("TablePlanExt2").setVisible(true); // Display
				// Table
			}
			this.tmpModelExtPlan = $.extend(true, [], this.oTable.getProperty("/extplan"));
			// To reset value state for Target Release
			var actualRelease = this.getView().byId("actualReleaseExt");
			var actualReleaseInputCol = this.getView().byId("TablePlanExt").indexOfColumn(actualRelease);
			this.handleValueState(["TablePlanExt"], [
				[actualReleaseInputCol]
			]);

			this.aTempOutPutPlan = $.extend(true, [], this.oViewOut.getProperty("/aOutObjs"));

			this.tmpModel = $.extend(true, [], this.oTable.getProperty("/output"));
			this.getView().byId("idTable6").setMode(sap.m.ListMode.Delete);
			this.tmpModel2 = $.extend(true, [], this.oTable.getProperty("/api"));

			sap.ushell.Container.setDirtyFlag(true);

			this.getView().byId("TypeComment").setVisible(true);
			this.getView().byId("TypeComment").setEditable(true);

			this.getView().byId("assign").setVisible(false);
			this.getView().byId("save").setVisible(true);
			this.getView().byId("cancel").setVisible(true);
			this.getView().byId("edit").setVisible(false);

			this.getView().byId("isext").setEditable(true);
			this.getView().byId("ismig").setEditable(true);
			this.getView().byId("issearch").setEditable(true);
			this.getView().byId("isout").setEditable(true);

			this.getView().byId("isAPIRead").setEditable(true);
			this.getView().byId("isAPICUD").setEditable(true);

			this.onselectoutput();

		},

		// on pressing the add button in Migration Planning table
		onAddPlanMigr: function () {
			MigrationObjects.addPlanMigr(this);
		},
		checkNotEmptyValidation: function (oEvent) {
			var oSource = oEvent.getSource();
			var sValue = oSource.getValue();
			sValue = sValue.replace(/\s/g, "");
			if (sValue === "") {
				this.bMigrPlanSaveFlag = false;
				oSource.setValueState("Error");
				oSource.setValueStateText("Should not be empty");
			} else {
				this.bMigrPlanSaveFlag = true;
				oSource.setValueState("None");
				oSource.setValueStateText("");
			}

		},

		// on pressing the delete button in Migration Planning table
		onDeletePlanMigr: function () {
			MigrationObjects.deletePlanMigr(this);
		},

		handleMigrMapClose: function (oEvent) {
			sap.ui.getCore().byId("MigrObjMap").setValue("");
			sap.ui.getCore().byId("ActualReleaseMigr").setValue(this.final);
		},

		handleMigrMapConfirm: function (oEvent) {

			MigrationObjects.migrMapConfirm(this);
		},
		onMapPlanMigr: function (oEvent) {
			MigrationObjects.mapPlanMigr(this);
		},
		onMigrationPlanChangeTypeSelected: function (oEvent) {
			var tableIndex = this.getView().byId("TablePlanMigrEdit").indexOfItem(oEvent.getSource().getParent());
			this.getView().byId("TablePlanMigrEdit").getItems()[tableIndex].getAggregation("cells")[1].setValue("");
		},

		deleteOutputItems: function (oEvent) {
			var index = oEvent.getParameter('listItem').getBindingContextPath().split("/")[2];
			var oModel = this.getView().getModel("Gemini");
			var selectedRow = oModel.getData().output[index];
			var oModelOutPlan = this.getView().getModel("geminioutput").getData().aOutObjs;
			var x = 0;
			if (selectedRow.value !== "" && selectedRow.value1 !== "" && oModelOutPlan.some(function (OutPlan) {
					return OutPlan.mapped_output_object === selectedRow.value && OutPlan.mapped_application_object === selectedRow.value1;
				})) {

				var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
				sap.m.MessageBox.error(
					"To delete, select an object that is not mapped", {
						styleClass: bCompact ? "sapUiSizeCompact" : ""
					}
				);
			} else {

				MessageBox.confirm(
					"Do you want to delete this entry?", {
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
						styleClass: bCompact ? "sapUiSizeCompact" : "",
						onClose: function (sAction) {
							if (sAction === "YES") {

								for (var i = 0; i < this.tmpModel.length; i++) {
									if (oModel.getData().output[index].value === this.tmpModel[i].value) {
										x = 1;
										break;
									}
								}

								if (x === 1) {
									this.aOutdel.push(oModel.getData().output[index]);
								}
								oModel.getData().output.splice(index, 1);
								oModel.refresh(true);
							}
						}.bind(this)
					}
				);

			}
		},

		handleValueState: function (tableIDArray, rowIDArray) {
			var currTableName;
			var currTable, currTableLength;
			var count = 0;
			for (var key in tableIDArray) {

				currTableName = tableIDArray[key];
				currTable = this.getView().byId(currTableName);
				var currTableItems = currTable.getItems();
				currTableLength = currTable.getAggregation("columns").length;
				for (var i = 0; i < currTable.getItems().length; i++) {
					for (var j = 0; j < currTableLength - 2; j++) {
						if (rowIDArray[count].indexOf(j) === -1) {
							if (currTableItems[i].getAggregation("cells")[j].getValueState() === "Error") {
								currTableItems[i].getAggregation("cells")[j].setValueState("None");
								currTableItems[i].getAggregation("cells")[j].setValueStateText("");
							}

						}
					}

				}
				count++;
			}
		},

		fnCancelling: function () {

			Events.fnEventsModelHandlingOnCancel(this);
			this.getView().getModel("Header").setData($.extend(true, {}, sap.ui.view.Gemini.headerModelInitial));
			this.oTable.setProperty("/nodetype", $.extend(true, [], this.oTable.getProperty("/NodeTypeTemp")));
			this.oTable.setProperty("/CDSKeyFields", $.extend(true, [], this.oTable.getProperty("/CDSKeyFieldsTemp")));
			sap.ui.core.BusyIndicator.show(0);
			this.getView().byId("TablePlanAPI").setVisible(false);
			this.getView().byId("TablePlanAPInonEdit").setVisible(true);
			this.getView().byId("idTable6").setVisible(false);
			this.getView().byId("idTable6nonEdit").setVisible(true);
			// Cancel CDS
			CDS.handleCancelCDS(this);
			// Cancel Fiori
			Fiori.handleFioriCancel(this);
			Search.searchcancelhandle(this);
			this.edit = false;
			this.onselectoutput();

			sap.ui.view.Gemini.viewModel.setProperty("/editable", false);
			// Replacing the changed model to it's original state

			// this.oModel2.setData(this.oHeaderModelCopy.getData());
			/*
			 * This function handles the value state on press on cancel. Pass
			 * the table for table in the array
			 */
			var tableIDArray = [];
			tableIDArray.push("TablePlanAPI");
			tableIDArray.push("TablePlanExt");
			tableIDArray.push("TablePlanOutEdit");
			tableIDArray.push("TablePlanMigrEdit");
			// API Planning Section Columns
			var actualRelease = this.getView().byId("actualReleaseAPI");
			var actualReleaseInputCol = this.getView().byId("TablePlanAPI").indexOfColumn(actualRelease);
			// In the array below, enter the coloumn number which is
			// non-editable for ex: Actual Release and in the sequence of array
			// defined above
			var jiraLinkAPI = this.getView().byId("jiraLinkAPI");
			var jiraLinkAPICol = this.getView().byId("TablePlanAPI").indexOfColumn(jiraLinkAPI);

			var rowIDArray = [
				[actualReleaseInputCol, jiraLinkAPICol],
				[4],
				[4],
				[6]
			];
			this.handleValueState(tableIDArray, rowIDArray);

			// For Output
			OutputObjects.handleOutputPlanEditCancel(false, this);
			this.getView().byId("BtnDelAPI").setVisible(false);
			this.getView().byId("BtnConvertAPI").setVisible(false);
			this.getView().byId("error").setVisible(false);

			if (this.status === "rejected" || this.status === "deprecated") {
				this.getView().byId("assign").setVisible(true);
				this.getView().byId("edit").setVisible(true);
				this.getView().byId("edit").setEnabled(false);
			} else {
				this.getView().byId("edit").setVisible(true);
				this.getView().byId("assign").setVisible(true);
				this.getView().byId("edit").setEnabled(true);
			}

			this.getView().byId("idTable6").setMode(sap.m.ListMode.none);
			this.oTable.setProperty("/api", this.tmpModel2);
			this.getView().byId("idTable2").setMode(sap.m.ListMode.none);
			this.getView().byId("idTable2Display").setVisible(true);
			this.getView().byId("idTable2").setVisible(false);

			this.oTable.setProperty("/output", $.extend(true, [], this.tmpModel));
			this.oModel2.setProperty("/sPriority", this.sPriority);
			this.oModel2.setProperty("/sPriorityKey", this.sPriorityKey);
			this.getView().byId("TablePlanAPI").setMode(sap.m.ListMode.none);
			this.oTable.setProperty("/apiplan", this.tmpModelAPIPlan);
			// For API Convert to Actuals
			this.oTable.setProperty("/migr", this.tmpMigrActual);

			// For Extensibility
			this.getView().byId("TablePlanExt").setMode(sap.m.ListMode.none);
			this.getView().byId("TablePlanExt").setVisible(false);
			this.getView().byId("TablePlanExt2").setVisible(true);
			this.oTable.setProperty("/extplan", this.tmpModelExtPlan);

			sap.ushell.Container.setDirtyFlag(false);
			this.getView().byId("save").setVisible(false);
			this.getView().byId("cancel").setVisible(false);
			this.getView().byId("edit").setVisible(true);
			this.getView().byId("addPlanAPI").setVisible(false);

			/* For Extensibility */
			this.getView().byId("addPlanExt").setVisible(false);
			this.getView().byId("BtnMapExt").setVisible(false);
			this.getView().byId("BtnDelExtPlan").setVisible(false);
			this.getView().byId("BtnDelExtPlan").setVisible(false);
			this.getView().byId("jiraExt").setVisible(false);
			this.getView().byId("jiraLinkExt").setVisible(true);

			this.getView().byId("isext").setEditable(false);
			this.getView().byId("ismig").setEditable(false);
			this.getView().byId("issearch").setEditable(false);

			this.getView().byId("TypeComment").setVisible(false);
			this.getView().byId("TypeComment").setEditable(false);
			this.getView().byId("TypeComment").setValue("");

			this.getView().byId("isout").setEditable(false);

			var aAPIPlanTemp = this.oTable.getProperty("/apiplan");
			var x = this.byId("TablePlanAPI").getItems();
			this.getView().byId("isext").setEditable(false);
			this.getView().byId("ismig").setEditable(false);

			this.getView().byId("issearch").setEditable(false);
			this.getView().byId("isout").setEditable(false);
			this.getView().byId("isAPIRead").setEditable(false);
			this.getView().byId("isAPICUD").setEditable(false);

			// Migration Objects Cancel Mode
			MigrationObjects.migrationPlanChangeMode(this, 1);
			MigrationObjects.migrationActualsChangeMode(this, 1);
			sap.ui.core.BusyIndicator.hide(0);
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			sap.m.MessageToast.show(oBundle.getText("Changesdiscarded"));
		},

		cancel: function (oEvent) {
			if (!this.cancel_oPopover) {
				this.cancel_oPopover = sap.ui.xmlfragment("s4.cfnd.geminiobjectpage.view.cancel", this);
				this.getView().addDependent(this.cancel_oPopover);
			}

			this.cancel_oPopover.openBy(oEvent.getSource());
		},

		onselectoutput: function () {

			var x1 = this.byId("idTable2").getItems();
			for (var i = 0; i < x1.length; i++) {

				x1[i].getAggregation("cells")[1].setEditable(false);
			}

			var x2 = this.byId("idTable6").getItems();
			for (var i = 0; i < x2.length; i++) {
				x2[i].getAggregation("cells")[0].setEditable(false);
			}
			if (this.edit) {
				if (this.getView().byId("isout").getSelected()) {
					OutputObjects.handleOutputPlanEditCancel(true, this);
					this.getView().byId("outadd").setVisible(true);
					this.getView().byId("idTable2").setMode(sap.m.ListMode.Delete);
					this.getView().byId("idTable2Display").setVisible(false);
					this.getView().byId("idTable2").setVisible(true);
				} else {
					OutputObjects.handleOutputPlanEditCancel(false, this);
					this.getView().byId("outadd").setVisible(false);
					this.oTable.setProperty("/output", $.extend(true, [], this.tmpModel));
					this.getView().byId("idTable2").setMode(sap.m.ListMode.none);
					this.getView().byId("idTable2Display").setVisible(true);
					this.getView().byId("idTable2").setVisible(false);
				}

				this.getView().byId("APIadd").setVisible(true);
				if (this.getView().byId("isout").getSelected()) {
					this.getView().byId("outadd").setVisible(true);
				}
				this.getView().byId("addPlanAPI").setVisible(true);

				this.getView().byId("addPlanExt").setVisible(true);
				this.getView().byId("BtnMapExt").setVisible(true);

				var aAPIPlanTemp = $.extend(true, [], this.oTable.getProperty("/apiplan"));
				Events.EventsEdit(this, true);

				var x = this.byId("TablePlanAPI").getItems();

				this.getView().byId("jiraAPI").setVisible(true);

			} else {
				Events.EventsEdit(this, false);

				this.getView().byId("jiraAPI").setVisible(false);
				this.getView().byId("APIadd").setVisible(false);
				this.getView().byId("outadd").setVisible(false);

				this.getView().byId("addPlanAPI").setVisible(false);
				this.getView().byId("BtnMapEvent").setVisible(false);
				this.getView().byId("addPlanExt").setVisible(false);

				this.getView().byId("TablePlanExt").setVisible(false);
				this.getView().byId("TablePlanExt2").setVisible(true);

			}

		},
		suggestionItemSelectedServInt: function (oEvent) {
			var id = oEvent.getSource().getId();
			var si = oEvent.getParameter("selectedItem").getBindingContext().getObject().ServiceInterface;
			var protocol = oEvent.getParameter("selectedItem").getBindingContext().getObject().protocol;
			var comm = oEvent.getParameter("selectedItem").getBindingContext().getObject().communication_scenario_id;
			var service_interface_wov = oEvent.getParameter("selectedItem").getBindingContext().getObject().service_interface_wov;
			var temp = [];
			temp = this.oTable.getData().api;
			temp[temp.length - 1].service_interface_wov = service_interface_wov;

			this.getView().byId(id).setValue(si);
			this.getView().byId(id.replace("siId", "csId")).setText(comm);
			this.getView().byId(id.replace("siId", "proId")).setText(protocol);

		},
		suggestionItemSelected: function (oEvent) {
			var id = oEvent.getSource().getId();
			var app = oEvent.getParameter("selectedItem").getBindingContext().getObject().ApplicationObjectType;
			var outObj = oEvent.getParameter("selectedItem").getBindingContext().getObject().OutputType;
			if (id.split("-")[17] === "TablePlanOutEdit") {
				this.getView().byId("TablePlanOutEdit").getItems()[id.split("-")[18]].getAggregation("cells")[2].setValue(outObj);
				this.getView().byId("TablePlanOutEdit").getItems()[id.split("-")[18]].getAggregation("cells")[1].setValue(app);
			} else {
				this.getView().byId(id).setValue(outObj);
				this.getView().byId(id.replace("outc1", "outc2")).setValue(app);
			}

		},
		handleValueHelpClose: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (typeof oSelectedItem !== "undefined") {
				if (oEvent.getSource().getId() === "CDSDialog") {
					this.getView().byId("scobji").setValue(oSelectedItem.getTitle());
				} else if (oEvent.getSource().getId() === "SearchDialog") {

					sap.ui.getCore().byId(this.ipSearchId).setValue(oSelectedItem.getTitle());
					sap.ui.getCore().byId(this.ipSearchId).setValueState("None");

				} else if (oEvent.getSource().getId() === "OutputObjectDialog") {
					if (this.ipId === "outObjPlan") {
						sap.ui.getCore().byId(this.ipId).setValue(oSelectedItem.getTitle());
						sap.ui.getCore().byId("OutPlanApplicationObject").setVisible(true);
						sap.ui.getCore().byId("OutPlanApplicationObjectLabel").setVisible(true);
						sap.ui.getCore().byId("OutPlanApplicationObject").setValue(oSelectedItem.getDescription());
					} else if (this.ipId.split("-")[9] === "TablePlanOutEdit") {
						this.getView().byId("TablePlanOutEdit").getItems()[this.ipId.split("-")[10]].getAggregation("cells")[2].setValueState("None");
						this.getView().byId("TablePlanOutEdit").getItems()[this.ipId.split("-")[10]].getAggregation("cells")[2].setValue(oSelectedItem.getTitle());
						this.getView().byId("TablePlanOutEdit").getItems()[this.ipId.split("-")[10]].getAggregation("cells")[1].setValue(oSelectedItem.getDescription());
					} else {
						this.getView().byId(this.ipId).setValue(oSelectedItem.getTitle());
						this.getView().byId(this.ipId.replace("outc1", "outc2")).setText(oSelectedItem.getDescription());
						sap.ui.getCore().byId(this.ipId).setValueState("None");
					}
					sap.ui.getCore().byId(this.ipId).setValueState("None");
				} else if (oEvent.getSource().getId() === "AreaDialog") {
					this.oModel2.setProperty("/sArea", (oSelectedItem.getTitle()));
				} else if (oEvent.getSource().getId() === "UserDialog") {
					this.sSAPName = oSelectedItem.getDescription();
					this.sSAPIno = oSelectedItem.getTitle();
					this.getView().byId("prespLabel").setValue(this.sSAPName);
				} else if (oEvent.getSource().getId() === "ServiceInterfaceDialog") {
					var aTemp = oEvent.getParameter("selectedItems");
					sap.ui.getCore().byId(this.ipIdAPI).setValueState("None");
					if (typeof (aTemp) !== "undefined") {
						var rowNumber = this.ipIdAPI.split("idTable6-")[1];
						this.getView().byId(this.ipIdAPI).setValue(oSelectedItem.getTitle());
						this.getView().byId(this.ipIdAPI.replace("siId", "csId")).setText(oSelectedItem.getDescription());
						var service_interface_wov = oEvent.getParameter("selectedItem").getBindingContext().getObject().service_interface_wov;
						var apiActuals = {};
						apiActuals = this.oTable.getData().api;
						apiActuals[rowNumber].service_interface_wov = service_interface_wov;
						apiActuals[rowNumber].protocol = oEvent.getParameter("selectedItem").getBindingContext().getObject().protocol;
						apiActuals[rowNumber].apitype = oEvent.getParameter("selectedItem").getBindingContext().getObject()
							.protocol;
						this.getView().byId(this.ipIdAPI.replace("siId", "proId")).setText(oEvent.getParameter("selectedItem").getBindingContext().getObject()
							.protocol);
						var newRow = apiActuals[rowNumber];
						var duplicateEntryFlag = false;
						for (var existingRow = 0; existingRow < apiActuals.length; existingRow++) {
							if (existingRow !== Number(rowNumber)) {
								if (newRow.protocol === apiActuals[existingRow].protocol &&
									newRow.si === apiActuals[existingRow].si && newRow.comm === apiActuals[existingRow].comm) {

									duplicateEntryFlag = true;
									apiActuals[rowNumber].si = "";
									apiActuals[rowNumber].protocol = "";
									apiActuals[rowNumber].apitype = "";
									apiActuals[rowNumber].comm = "";
									apiActuals[rowNumber].service_interface_wov = "";
								}
							}
						}
						if (duplicateEntryFlag) {
							var oBundle = this.getView().getModel("i18n").getResourceBundle();
							MessageBox.error(oBundle.getText("APIActualDuplicateEntryErrorMessage"));
						} else {
							var sUri1 = "/I_SBRSICRUD";
							var aFiltersAPI = [];

							aFiltersAPI.push(new sap.ui.model.Filter("ServiceInterface", sap.ui.model.FilterOperator.EQ, service_interface_wov));

							this.oModel.read(sUri1, {
								filters: aFiltersAPI,
								success: function (oResponse) {
									var setReadValue = "",
										setCUDValue = "",
										setOthValue = "";
									if (oResponse.results.length > 0) {
										apiActuals.read = oResponse.results[0].readapi;
										apiActuals.create = ((oResponse.results[0].createapi + oResponse.results[0].updateapi + oResponse.results[0].deleteapi) >
											0 ? 1 : 0);
										apiActuals.others = oResponse.results[0].othersapi;

										setReadValue = ((apiActuals.read > 0) ? "Yes" : "No");
										setCUDValue = ((apiActuals.create > 0) ? "Yes" : "No");
										setOthValue = ((apiActuals.others > 0) ? "Yes" : "No");
									}
									this.getView().byId(this.ipIdAPI.replace("siId", "readFlg")).setText(setReadValue);
									this.getView().byId(this.ipIdAPI.replace("siId", "CUDFlg")).setText(setCUDValue);
									this.getView().byId(this.ipIdAPI.replace("siId", "othFlg")).setText(setOthValue);

								}.bind(this),
								error: function () {

								}
							});
						}
					}
				} else if (oEvent.getSource().getId() === "ServiceInterfaceDialogAPIPlanned") {
					if (this.APIMapObj === null) {
						this.APIMapObj = {};
					}

					var aTemp = oEvent.getParameter("selectedItems");
					if (typeof (aTemp) !== "undefined") {
						var si = aTemp[0].getProperty("title");
						var index = -1;
						var xTemp = this.byId("TablePlanAPI").getItems();
						for (var i = 0; i < xTemp.length; i++) {
							if (xTemp[i].getSelected() === true) {
								index = i;
							}
						}
					}
					var tableProtocol = xTemp[index].getAggregation("cells")[1].getProperty("selectedKey");
					var CSValue = aTemp[0].getProperty("description");
					var x = sap.ui.getCore().byId("APIMAP");
					x.setValue(si);
					var SIHelp = this.oTable.getProperty("/apiConvertSIValueHelpExceptActuals");
					SIHelp = SIHelp.filter(function (data) {
						return (data.ServiceInterface === si);
					});

					this.service_interface_wov = SIHelp[0].service_interface_wov;
					this.APIMapObj.mapped_service_interface = si;
					this.APIMapObj.communicationscenario = CSValue;
					this.APIMapObj.service_interface_wov = service_interface_wov;

					sap.ui.getCore().byId("csPlan").setVisible(true);
					sap.ui.getCore().byId("csPlanVal").setVisible(true);
					sap.ui.getCore().byId("csPlanVal").setValue(CSValue);
					sap.ui.getCore().byId(this.ipIdAPIPlan).setValueState("None");

				} else if (oEvent.getSource().getId() === "PackageDialog") {
					this.oModel2.setProperty("/sPackage", (oSelectedItem.getTitle()));
				} else if (oEvent.getSource().getId() === "migrMapActualsDialog") {
					if (this.ipMigrationId === "MigrObjMap") {
						sap.ui.getCore().byId("MigrObjMap").setValue(oSelectedItem.getTitle());
					} else {
						sap.ui.getCore().byId(this.ipMigrationId).setValue(oSelectedItem.getTitle());
					}
					sap.ui.getCore().byId(this.ipMigrationId).setValueState("None");

				} else if (oEvent.getSource().getId() === "TargetReleaseHelpMigrMap") {
					sap.ui.getCore().byId("ActualReleaseMigr").setValue(oSelectedItem.getTitle());
				}

				// For Extensibility: Setting Value of Selected Business Context
				// to the field in popup
				else if (oEvent.getSource().getId() === "BusinessContextDialogExtPlanned" || oEvent.getSource().getId() ===
					"TargetReleaseHelpExtMap") {

					if (this.ExtMapObj === null) {
						this.ExtMapObj = {};
						this.ExtMapObj.actual_release = this.final;
					}

					var aTemp = oEvent.getParameter("selectedItems");
					if (typeof (aTemp) !== "undefined") {
						var oSelectedItem = aTemp[0].getProperty("title");
						if (oEvent.getSource().getId() === "BusinessContextDialogExtPlanned") {
							var businessContext = oSelectedItem;

							var x = sap.ui.getCore().byId("ExtMapBC");
							x.setValue(businessContext);

							this.ExtMapObj.mapped_business_context = businessContext;
						} else {

							var actualRelease = oSelectedItem;

							var x = sap.ui.getCore().byId("ActualReleaseExt");
							x.setValue(actualRelease);

							this.ExtMapObj.actual_release = actualRelease;
						}
					}

				}

				// For Enhancement Type Setting Value to Business Context
				else if (oEvent.getSource().getId() === "BusinessContextDialogExtPlanned2") {

					this.getView().byId(this.ipBusinessContext).setValue(oSelectedItem.getTitle());
					var aTemp = oEvent.getParameter("selectedItems");
					var oSelectedItem = aTemp[0].getProperty("title");
					this.planExtId.setValueState("None");

				} else if (oEvent.getSource().getId() === "ServiceInterfaceDialogAPIPlanTable") {

					var siValue = oSelectedItem.getTitle();
					var csValue = oSelectedItem.getDescription();
					var protocol = oSelectedItem.getInfo();
					var rowNumber = this.ipIdAPIPlan.split("TablePlanAPI-").pop();
					var oModel = this.getView().getModel("Gemini");
					oModel.getData().apiplan[rowNumber].protocol = protocol;
					this.getView().byId(this.ipIdAPIPlan).setValue(siValue);
					this.getView().byId(this.ipIdAPIPlan.replace("siIdPlan", "protCombo")).setValue(protocol);
					this.getView().byId(this.ipIdAPIPlan.replace("siIdPlan", "csAPI")).setValue(csValue);

				} else if (oEvent.getSource().getId() === "MigrationObjectActualValueHelpDialog") {
					var migrationObject = oSelectedItem.getTitle();
					var migrData = this.oViewMigr.getProperty("/aMigrPlan");
					var rowNumber = this.currRow.split("TablePlanMigrEdit-").pop();
					var oModel = this.getView().getModel("geminiMigr");
					migrData[rowNumber].migration_object = migrationObject;

					// When Selected already mapped
					for (var k = 0; k < this.oMigrPlanTempModel.length; k++) {
						if (migrationObject === this.oMigrPlanTempModel[k].migration_mapped) {
							migrData[rowNumber].load_avail = this.oMigrPlanTempModel[k].load_avail;
							migrData[rowNumber].load_api = this.oMigrPlanTempModel[k].load_api;
							migrData[rowNumber].load_avail_plan = this.oMigrPlanTempModel[k].load_avail_plan;
							break;
						}
					}

					this.planMigrId.setValueState("None");

					oModel.setProperty("/aMigrPlan", migrData);
					oModel.refresh(true);

				} else if (oEvent.getSource().getId() === "CDSFacetViewNameValueHelp") {

					var CDSName = oSelectedItem.getTitle();
					var ReleasedStatus = oSelectedItem.getInfo();
					var CDSData = this.oTable.getProperty("/cds");
					var rowNumber = this.ipCDSName.split("TableActualCDS-").pop();
					var oModel = this.getView().getModel("Gemini");
					CDSData[rowNumber].view_name = CDSName;
					CDSData[rowNumber].release_status = ReleasedStatus;
					sap.ui.getCore().byId(this.ipCDSName).setValueState("None");
					oModel.setProperty("/cds", CDSData);
					oModel.refresh(true);
				}
			}
			oEvent.getSource().getBinding("items").filter([]);

		},

		handleValueHelpCDSViewName: function (_oDialog) {

			var sQuery = _oDialog.getSource()._sSearchFieldValue;

			var aFilter = new Filter({
				filters: [
					new Filter("CDSName", FilterOperator.Contains, sQuery)
				],
				and: false
			});
			_oDialog.getSource().getBinding("items").filter([aFilter]);

		},
		handleValueHelpSearchArea: function (_AreaDialog) {
			var sQuery = _AreaDialog.getSource()._sSearchFieldValue;

			var aFilter = new Filter({
				filters: [
					new Filter("Area", FilterOperator.Contains, sQuery),
					new Filter("Description", FilterOperator.Contains, sQuery)
				],
				and: false
			});
			_AreaDialog.getSource().getBinding("items").filter([aFilter]);
		},
		handleValueHelpSearchUser: function (oDialog) {
			var sQuery = oDialog.getSource()._sSearchFieldValue;

			var aFilter = new Filter({
				filters: [
					new Filter("accnt", FilterOperator.Contains, sQuery),
					new Filter("UserDescription", FilterOperator.Contains, sQuery)
				],
				and: false
			});
			oDialog.getSource().getBinding("items").filter([aFilter]);
		},

		onValueHelpRequestArea: function (oEvent) {
			if (!this._AreaDialog) {
				this._AreaDialog = sap.ui.xmlfragment("s4.cfnd.geminiobjectpage.view.AreaValueHelp", this);
				this.getView().addDependent(this._AreaDialog);
			}
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._AreaDialog);
			this._AreaDialog.open();
			if (this._AreaDialog) {
				var searchField = sap.ui.getCore().byId("AreaDialog-list");
				searchField.addEventDelegate({
					onfocusin: function () {
						sap.ui.getCore().byId("AreaDialog-searchField").focus();
					}
				}, this);
			}
		},
		onValueHelpRequestContact: function (oEvent) {
			if (!this._ContactDialog) {
				this._ContactDialog = sap.ui.xmlfragment("s4.cfnd.geminiobjectpage.view.UserNameHelp", this);
				this.getView().addDependent(this._ContactDialog);
			}

			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._ContactDialog);
			this._ContactDialog.open();
			if (this._ContactDialog) {
				var searchField = sap.ui.getCore().byId("UserDialog-list");
				searchField.addEventDelegate({
					onfocusin: function () {
						sap.ui.getCore().byId("UserDialog-searchField").focus();
					}
				}, this);
			}

		},
		onValueHelpRequestAch: function (oEvent) {
			if (!this._AchDialog) {
				this._AchDialog = sap.ui.xmlfragment("s4.cfnd.geminiobjectpage.view.ApplicationComponent", this);
				this.getView().addDependent(this._AchDialog);
			}

			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._AchDialog);
			this._AchDialog.open();
			if (this._AchDialog) {
				var searchField = sap.ui.getCore().byId("Appf-list");
				searchField.addEventDelegate({
					onfocusin: function () {
						sap.ui.getCore().byId("Appf-searchField").focus();
					}
				}, this);
			}
		},

		onValueHelpRequestMigrObjectMap: function (oEvent) {

			this.ipMigrationId = oEvent.getSource().getId();
			var dataMigrVH = this.oTable.getData().migrVH;
			var dataMigrActual = this.oTable.getData().migr;

			dataMigrVH = dataMigrVH.filter(function (el) {
				return !dataMigrActual.some(function (f) {
					return f.ident === el.ident;
				});
			});
			this.oTable.setProperty("/migrVH", dataMigrVH);

			if (!this._MigrMapDialog2) {
				this._MigrMapDialog2 = sap.ui.xmlfragment("s4.cfnd.geminiobjectpage.view.MigrationObjectServiceHelp", this);
				this.getView().addDependent(this._MigrMapDialog2);
			}
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._MigrMapDialog2);
			this._MigrMapDialog2.open();
			if (this._MigrMapDialog2) {
				var searchField = sap.ui.getCore().byId("migrMapActualsDialog-list");
				searchField.addEventDelegate({
					onfocusin: function () {
						sap.ui.getCore().byId("migrMapActualsDialog-searchField").focus();
					}
				}, this);
			}

		},
		onValueHelpRequestTargetReleaseMigrMap: function (oEvent) {
			if (!this._MigrMapDialog3) {
				this._MigrMapDialog3 = sap.ui.xmlfragment("s4.cfnd.geminiobjectpage.view.TargetReleaseValueHelpMigrMap", this);
				this.getView().addDependent(this._MigrMapDialog3);
			}
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._MigrMapDialog3);
			this._MigrMapDialog3.open();
			if (this._MigrMapDialog3) {
				var searchField = sap.ui.getCore().byId("TargetReleaseHelpMigrMap-list");
				searchField.addEventDelegate({
					onfocusin: function () {
						sap.ui.getCore().byId("TargetReleaseHelpMigrMap-searchField").focus();
					}
				}, this);
			}

		},
		handleAppSearch: function (oDialog) {
			var sQuery = oDialog.getSource()._sSearchFieldValue;

			var aFilter = new Filter({
				filters: [
					new Filter("ApplicationComponent", FilterOperator.Contains, sQuery)
				],
				and: false
			});
			oDialog.getSource().getBinding("items").filter([aFilter]);
		},
		handleAppCloseEvent: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");

			if (oEvent.getSource().getId() === "EventHelp" && oSelectedItem !== undefined && this.ipIdEventId.indexOf("eventsTableOnEdit") !==
				-1) {

				var sEventPlanText = oSelectedItem.getTitle();
				var oModel = this.getView().getModel("Gemini");
				var aActualEvents = oModel.getData().events;
				var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
				if (aActualEvents.some(function (x) {
						return x.Event === sEventPlanText;
					})) {
					MessageBox.error(
						"Event already exists in actuals, hence cannot be added", {
							styleClass: bCompact ? "sapUiSizeCompact" : ""
						}
					);
				} else {
					this.getView().byId(this.ipIdEventId).setValue(oSelectedItem.getTitle());
					sap.ui.getCore().byId(this.ipIdEventId).setValueState("None");
				}

			}
			if (oEvent.getSource().getId() === "EventHelp" && oSelectedItem !== undefined) {

				sap.ui.getCore().byId(this.ipIdEventId).setValue(oSelectedItem.getTitle());
				sap.ui.getCore().byId(this.ipIdEventId).setValueState("None");
				var oModelEventPlan = this.getView().getModel("geminievents").getData().aEvents;
				var aEventPlan = oModelEventPlan;
				aEventPlan = aEventPlan.filter(function (data) {
					return (data.bo_event === oSelectedItem.getTitle() && data.changetype === "New");
				});
				if (aEventPlan.length !== 0 && oModelEventPlan[this.selectedEventPlanEntry].changetype === "New") {
					sap.ui.getCore().byId("eventsMapEventName").setValueState("Error");
					sap.ui.getCore().byId("eventsMapEventName").setValueStateText(
						"A planning object already exists for this event");
				}
			}

			if (oEvent.getSource().getId() === "EventTaskHelp" && oSelectedItem !== undefined) {
				sap.ui.getCore().byId(this.ipIdEventTask).setValue(oSelectedItem.getTitle());
				sap.ui.getCore().byId(this.ipIdEventTask).setValueState("None");
			}
			if (oEvent.getSource().getId() === "EventNodeTypeHelp" && oSelectedItem !== undefined) {
				this.getView().byId(this.ipIdEventNodeType).setValue(oSelectedItem.getTitle());
				sap.ui.getCore().byId(this.ipIdEventNodeType).setValueState("None");
			}
			if (oEvent.getSource().getId() === "NodeTypeCDSValueHelp" && oSelectedItem !== undefined) {
				this.getView().byId(this.ipIdNodeTypeCDS).setValue(oSelectedItem.getTitle());
				sap.ui.getCore().byId(this.ipIdNodeTypeCDS).setValueState("None");
			}
			if (oEvent.getSource().getId() === "TargetReleaseHelp" && this.ipTargetReleaseId === "ActualReleaseEvents1" && oSelectedItem !==
				undefined) {
				sap.ui.getCore().byId("ActualReleaseEvents1").setValue(oSelectedItem.getTitle());
				sap.ui.getCore().byId(this.ipTargetReleaseId).setValueState("None");
			} else if (oEvent.getSource().getId() === "TargetReleaseHelp" && this.ipTargetReleaseId === "ActualReleaseSearch" && oSelectedItem !==
				undefined) {
				sap.ui.getCore().byId("ActualReleaseSearch").setValue(oSelectedItem.getTitle());
				sap.ui.getCore().byId(this.ipTargetReleaseId).setValueState("None");
			} else if (oEvent.getSource().getId() === "TargetReleaseHelp" && oSelectedItem !== undefined) {

				sap.ui.getCore().byId(this.ipTargetReleaseId).setValueState("None");
				sap.ui.getCore().byId(this.ipTargetReleaseId).setValue(oSelectedItem.getTitle());
				var aTarget = this.oTable.getData().target_release;
				var aStatus = aTarget.filter(function (x) {
					return x.release_id === oSelectedItem.getTitle();
				});
				var tempsplit = this.ipTargetReleaseId.split('-');
				var sTable = tempsplit[17];
				var sRow = tempsplit[18];
				if (tempsplit[8] === "releaseEvent1") {
					if (sTable === "TablePlanEventsEdit") {
						var oModel = this.getView().getModel("geminievents").getData().aEvents;
						oModel[sRow].status_colour = aStatus[0].status_colour;
						oModel[sRow].status_icon = aStatus[0].status_icon;
						oModel[sRow].tool_tip = aStatus[0].tool_tip;
						this.getView().getModel("geminievents").refresh(true);
					}

				}
				if (sTable === "TablePlanAPI") {
					var oModel = this.getView().getModel("Gemini").getData().apiplan;
					oModel[sRow].status_colour = aStatus[0].status_colour;
					oModel[sRow].status_icon = aStatus[0].status_icon;
					oModel[sRow].tool_tip = aStatus[0].tool_tip;
					this.getView().getModel("Gemini").refresh(true);
				}

				if (sTable === "TablePlanExt") {
					var oModel = this.getView().getModel("Gemini").getData().extplan;
					oModel[sRow].status_colour = aStatus[0].status_colour;
					oModel[sRow].status_icon = aStatus[0].status_icon;
					oModel[sRow].tool_tip = aStatus[0].tool_tip;
					this.getView().getModel("Gemini").refresh(true);
				}

				if (tempsplit[9] === "TablePlanOutEdit" && tempsplit[8] !== "releaseActualOut") {
					var oModel = this.getView().getModel("geminioutput").getData().aOutObjs;
					oModel[tempsplit[10]].status_colour = aStatus[0].status_colour;
					oModel[tempsplit[10]].status_icon = aStatus[0].status_icon;
					oModel[tempsplit[10]].tool_tip = aStatus[0].tool_tip;
					this.getView().getModel("geminioutput").refresh(true);
				}
				if (sTable === "TablePlanMigrEdit") {
					var oModel = this.getView().getModel("geminiMigr").getData().aMigrPlan;
					oModel[sRow].status_colour = aStatus[0].status_colour;
					oModel[sRow].status_icon = aStatus[0].status_icon;
					oModel[sRow].tool_tip = aStatus[0].tool_tip;
					this.getView().getModel("geminiMigr").refresh(true);
				}

				if (sTable === "idTable9") {
					var oModel = this.getView().getModel("Gemini").getData().search;
					oModel[sRow].status_colour = aStatus[0].status_colour;
					oModel[sRow].status_icon = aStatus[0].status_icon;
					oModel[sRow].tool_tip = aStatus[0].tool_tip;
					this.getView().getModel("Gemini").refresh(true);
				}
			}

			oEvent.getSource().getBinding("items").filter([]);
		},
		handleAppClose: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");

			if (oEvent.getSource().getId() === "Appf") {
				this.getView().byId("achLabel").setValue(oSelectedItem.getTitle());
			}
			oEvent.getSource().getBinding("items").filter([]);
		},
		handleAssignClose: function (oEvent) {
			sap.ui.getCore().byId("Assign1").setValue("");
			sap.ui.getCore().byId("TypeCommentHere").setValue("");
			if (sap.ui.getCore().byId("Obj") !== undefined)

			{

				sap.ui.getCore().byId("Obj").destroy();

			}
			delete this._oDialog24;

		},

		handleValueHelpServiceInterface: function (_oDialog) {
			var sQuery = _oDialog.getSource()._sSearchFieldValue;

			var aFilter = new Filter({
				filters: [
					new Filter("ServiceInterface", FilterOperator.Contains, sQuery),
					new Filter("communication_scenario_id", FilterOperator.Contains, sQuery),
					new Filter("protocol", FilterOperator.Contains, sQuery)

				],
				and: false
			});
			_oDialog.getSource().getBinding("items").filter([aFilter]);
		},
		handleValueHelpBusinessContext: function (_oDialog) {
			var sQuery = _oDialog.getSource()._sSearchFieldValue;

			var aFilter = new Filter({
				filters: [
					new Filter("value", FilterOperator.Contains, sQuery)

				],
				and: false
			});
			_oDialog.getSource().getBinding("items").filter([aFilter]);
		},

		onBtnConvertAPI: function (oEvent) {

			var oBundle = this.getView().getModel("i18n").getResourceBundle();

			var checkFlag = false,
				noDataFlag = false,
				atLeastOneFlagSet = false;
			var isSelected = this.getView().byId("TablePlanAPI").getSelectedItem();
			var tempRemoval = -1;
			var xTemp = this.byId("TablePlanAPI").getItems();
			var errorText = "";
			var changeTypeAPI = this.getView().byId("TablePlanAPI").indexOfColumn(this.getView().byId(
				"changeTypeAPI"));
			var protocolAPI = this.getView().byId("TablePlanAPI").indexOfColumn(this.getView().byId("protocolAPI"));
			var readCol = this.getView().byId("TablePlanAPI").indexOfColumn(this.getView().byId("readApplicableAPI"));
			var othersCol = this.getView().byId("TablePlanAPI").indexOfColumn(this.getView().byId("othersApplicableAPI"));

			var targetReleaseCol = this.getView().byId("TablePlanAPI").indexOfColumn(this.getView().byId("targetReleaseAPI"));
			var serviceInterfaceCol = this.getView().byId("TablePlanAPI").indexOfColumn(this.getView().byId("serviceInterfaceAPI"));
			if (isSelected) {
				tempRemoval = this.getView().byId("TablePlanAPI").indexOfItem(isSelected);
				if (xTemp[tempRemoval].getAggregation("cells")[changeTypeAPI].getProperty("enabled") === true) {
					checkFlag = true;
				}
			}

			if (checkFlag) {
				for (var i = readCol; i <= othersCol; i++) {
					if (xTemp[tempRemoval].getAggregation("cells")[i].getSelected() === true) {
						atLeastOneFlagSet = true;
					}
				}
				if (xTemp[tempRemoval].getAggregation("cells")[changeTypeAPI].getSelectedKey() === oBundle.getText("changeTypeNew")) {
					if (xTemp[tempRemoval].getAggregation("cells")[protocolAPI].getSelectedKey().trim() === "") {

						errorText += "\n" + oBundle.getText("protocolColName");
						noDataFlag = true;

					}
				} else {
					if (xTemp[tempRemoval].getAggregation("cells")[serviceInterfaceCol].getValue().trim() === "") {
						errorText += "\n" + oBundle.getText("serviceInterfaceColName");
						noDataFlag = true;
					}
				}
				if (atLeastOneFlagSet === false) {
					noDataFlag = true;
					errorText += "\n" + oBundle.getText("crudFlagNotSetErrorMessage");
				}
				if (xTemp[tempRemoval].getAggregation("cells")[targetReleaseCol].getValue().trim() === "") {
					noDataFlag = true;
					errorText += "\n" + oBundle.getText("targetReleaseColName");
				}

			}
			if (noDataFlag) {
				sap.m.MessageBox.error(
					oBundle.getText("operationCanceledIncompleteDataErrorMessage") + errorText);
			} else if (isSelected === null) {
				MessageBox.error(oBundle.getText("alreadyMappedErrorMessage"));
			} else if (checkFlag) {

				if (!this.APIMap2) {

					this.APIMap2 = sap.ui.xmlfragment("s4.cfnd.geminiobjectpage.view.APIConvertToActuals", this);
					this.getView().addDependent(this.APIMap2);
				}
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this.APIMap2);

				this.APIMap2.open();
				if (xTemp[tempRemoval].getAggregation("cells")[changeTypeAPI].getSelectedKey() === "Enhancement") {
					sap.ui.getCore().byId("APIMAP").setEditable(false);
					sap.ui.getCore().byId("APIMAP").setValue(xTemp[tempRemoval].getAggregation("cells")[serviceInterfaceCol].getValue());
					sap.ui.getCore().byId("csPlan").setVisible(true);
					sap.ui.getCore().byId("csPlanVal").setVisible(true);
					sap.ui.getCore().byId("csPlanVal").setValue(xTemp[tempRemoval].getAggregation("cells")[xTemp[tempRemoval].getCells().length - 1]
						.getValue());
					sap.ui.getCore().byId("csPlanVal").setEditable(false);
				} else {
					API.siValueHelpAPIExceptActuals(this, xTemp[tempRemoval].getAggregation("cells")[protocolAPI].getSelectedKey());
					sap.ui.getCore().byId("APIMAP").setEditable(true);
				}
				sap.ui.getCore().byId("ActualReleaseAPI").setValue(this.final);
			}

		},

		suggestionItemSelectedServIntAPIPlan: function (oEvent) {
			var id = oEvent.getSource().getId();
			var si = oEvent.getParameter("selectedItem").getBindingContext().getObject().ServiceInterface;
			var protocol = oEvent.getParameter("selectedItem").getBindingContext().getObject().protocol;
			var comm = oEvent.getParameter("selectedItem").getBindingContext().getObject().communication_scenario_id;
			var service_interface_wov = oEvent.getParameter("selectedItem").getBindingContext().getObject().service_interface_wov;

			this.getView().byId(id).setValue(si);
			this.getView().byId(id.replace("siIdPlan", "protCombo")).setValue(protocol);
			this.getView().byId(id.replace("siIdPlan", "csAPI")).setValue(comm);

		},

		handleExtMapConfirm: function (oEvent) {

			if (this.ExtMapObj === null) {
				this.ExtMapObj = {};
				this.ExtMapObj.actual_release = this.final;
			}
			var allValuesEntered = false;
			var check1 = false,
				check2 = false;
			var oModel = this.getView().getModel("Gemini");
			var aExtplan = this.oTable.getProperty("/extplan");
			var xTemp = this.byId("TablePlanExt").getItems();
			for (var key in this.ExtMapObj) {
				if (key === "mapped_business_context") {
					check1 = true;
				}
				if (key === "actual_release") {
					check2 = true;
				}
			}
			if (check1 && check2) {
				allValuesEntered = true;
			}

			if (allValuesEntered) {

				for (var i = 0; i < xTemp.length; i++) {
					if (xTemp[i].getSelected() === true) {

						this.ExtMapObj.ext_id = aExtplan[i].ext_id;
						aExtplan[i].mapped_business_context = this.ExtMapObj.mapped_business_context;
						aExtplan[i].actual_release = this.ExtMapObj.actual_release;
						aExtplan[i].area = this.sArea;
						this.ExtMapObj = aExtplan[i];

					}

				}

				oModel.setProperty("/extplan", aExtplan);

				var x = this.byId("TablePlanExt").getItems();

				var extItems = this.byId("TablePlanExt").getItems();
				var oModel = this.getView().getModel("Gemini");

				var jiraext = this.getView().byId("jiraExt");
				var jiraextCol = this.getView().byId("TablePlanExt").indexOfColumn(jiraext);
				for (var i = 0; i < extItems.length; i++) {

					if (extItems[i].getAggregation("cells")[jiraextCol].getValue() !== "") // If
					// Jira
					// Backlog
					// is
					// maintained
					{
						oModel.getData().extplan[i].jira_backlog_link = "ht" + "tps://" + "sapjira.wdf.sap.corp/browse/".concat(extItems[i].getAggregation(
							"cells")[jiraextCol].getValue());
					}

				}

				this.aExtPlanMap.push(this.ExtMapObj);
				sap.m.MessageToast.show("Object mapped");
				oModel.refresh(true);
				Extensibility.fnDisplayButton(this);

			} else if (sap.ui.getCore().byId("ExtMapBC").getEditable() === false) {

				sap.m.MessageToast.show("Object mapped");

				for (var i = 0; i < xTemp.length; i++) {
					if (xTemp[i].getSelected() === true) {

						this.ExtMapObj.ext_id = aExtplan[i].ext_id;
						aExtplan[i].mapped_business_context = xTemp[i].getAggregation("cells")[1].getValue();
						aExtplan[i].actual_release = this.ExtMapObj.actual_release;
						aExtplan[i].area = this.sArea;
						this.ExtMapObj = aExtplan[i];

					}

				}

				oModel.setProperty("/extplan", aExtplan);

				var x = this.byId("TablePlanExt").getItems();

				// Setting Jira Link
				var extItems = this.byId("TablePlanExt").getItems();
				var oModel = this.getView().getModel("Gemini");

				var jiraext = this.getView().byId("jiraExt");
				var jiraextCol = this.getView().byId("TablePlanExt").indexOfColumn(jiraext);
				for (var i = 0; i < extItems.length; i++) {

					if (extItems[i].getAggregation("cells")[jiraextCol].getValue() !== "") // If
					// Jira
					// Backlog
					// is
					// maintained
					{
						oModel.getData().extplan[i].jira_backlog_link = "ht" + "tps://" + "sapjira.wdf.sap.corp/browse/".concat(extItems[i].getAggregation(
							"cells")[jiraextCol].getValue());
					}

				}
				this.aExtPlanMap.push(this.ExtMapObj);
				oModel.refresh(true);

			} else {
				var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.error(
					"Operation cancelled due to incomplete data", {
						styleClass: bCompact ? "sapUiSizeCompact" : ""
					}
				);
			}
			sap.ui.getCore().byId("ExtMapBC").setValue("");
			this.ExtMapObj = null;
		},

		handleExtMapClose: function (oEvent) {
			sap.ui.getCore().byId("ExtMapBC").setValue("");
			this.ExtMapObj = null;

		},

		handleExtMapCloseEnhancement: function (oEvent) {

			this.ExtMapObj = null;

		},

		handleAppCloseEventExtMap: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oEvent.getSource().getId() === "TargetReleaseHelpAPIMap" && oSelectedItem !== undefined) {
				var x = sap.ui.getCore().byId("ActualReleaseAPI");
				x.setValue(oSelectedItem.getTitle());
			}
			this.ExtMapObj.actual_release = oSelectedItem.getTitle();
			oEvent.getSource().getBinding("items").filter([]);
		},

		handleValueHelpCS: function (_oDialog) {
			var sQuery = _oDialog.getSource()._sSearchFieldValue;

			var aFilter = new Filter({
				filters: [
					new Filter("CommunicationScenario", FilterOperator.Contains, sQuery),
					new Filter("communication_scenario_id", FilterOperator.Contains, sQuery)

				],
				and: false
			});
			_oDialog.getSource().getBinding("items").filter([aFilter]);
		},
		handleValueHelpProtocol: function (_oDialog) {
			var sQuery = _oDialog.getSource()._sSearchFieldValue;

			var aFilter = new Filter({
				filters: [
					new Filter("Protocol", FilterOperator.Contains, sQuery)

				],
				and: false
			});
			_oDialog.getSource().getBinding("items").filter([aFilter]);
		},
		onAsisgnObjRepValueHelpRequest: function (oEvent) {
			var sCurrentRelease = sap.ui.view.Gemini.model.getProperty("/currentRelease");
			var sNextRelease = sap.ui.view.Gemini.model.getProperty("/nextRelease");
			var aEventsactual = sap.ui.view.Gemini.model.getProperty("/events");
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			if (aEventsactual.length === 0) {
				this.sObjectTypetemp = this.sObjectType;
				this.sObjectType = 'BO';
				var sUriEvents = "/C_SBRBusinessObjectVH"; // URI to read
				this.oModel.read(sUriEvents, {
					async: false,
					success: function (oResponse) {
						this.oTable.setProperty("/BusValueHelp", oResponse.results);
					}.bind(this),
					error: function () {}
				});

				if (!this._oDialogObj) {
					this._oDialogObj = sap.ui.xmlfragment("s4.cfnd.geminiobjectpage.view.ObjectNameValueHelp", this);
					this._oDialogObj.setModel(this.getView().getModel());
				}
				this.getView().addDependent(this._oDialogObj);
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogObj);
				this._oDialogObj.open();
			} else {
				var SAPObjAlertMessage = oBundle.getText("SAPObjAlertMessage");
				MessageBox.error(SAPObjAlertMessage);

			}
		},
		onSearch: function (oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master listitem.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
			} else {
				var oTableSearchState = [];
				var sQuery = oEvent.getSource().getProperty("value");
				var aFilter = new Filter({
					filters: [
						new Filter("ObjectName", FilterOperator.Contains, sQuery)
					],
					and: false
				});

				if (sQuery && sQuery.length > 0) {
					oTableSearchState = aFilter;
				}
				this.applySearch(oTableSearchState);

			}

		},

		applySearch: function (oTableSearchState) {
			if (this.sObjectType === "BO") {
				sap.ui.getCore().byId("Borobjects").getBinding("items").filter(oTableSearchState);
			} else if (this.sObjectType === "CL") {
				sap.ui.getCore().byId("classobjects").getBinding("items").filter(oTableSearchState);
			}

		},
		onDialogCancelButton: function () {
			sap.ui.getCore().byId("classobjects").removeSelections();
			sap.ui.getCore().byId("Borobjects").removeSelections();
			this._oDialogObj.close();
			this.sObjectType = this.sObjectTypetemp;
		},
		onDialogSubmitButton: function () {

			if (this.sObjectType === "BO") {

				this.fnUpdateSOBJ("Borobjects");

			} else if (this.sObjectType === "CL") {

				this.fnUpdateSOBJ("classobjects");

			}

		},
		fnUpdateSOBJ: function (objectType) {
			var oSelectedItem = sap.ui.getCore().byId(objectType).getSelectedItem();
			if (oSelectedItem !== null) {
				this.oModel2.setProperty("/sEventObjectName", oSelectedItem.getProperty("title"));
				this.sEventsObjectName = oSelectedItem.getProperty("title");
				this._oDialogObj.close();
				sap.ui.getCore().byId("classobjects").removeSelections();
				sap.ui.getCore().byId("Borobjects").removeSelections();
				sap.ui.getCore().byId("searchField").setValue("");
				sap.ui.getCore().byId("searchField1").setValue("");

				var aFilter = new Filter({
					filters: [
						new Filter("ObjectName", FilterOperator.Contains, "")
					],
					and: false
				});
				this.applySearch(aFilter);

				this.readEventsValueHelp();

			}
		},

		onobjectbarselect: function (oEvent) {
			if (oEvent.getParameters().item.getProperty("text") === "BOR Object") {
				this.sObjectType = "BO";
				sap.ui.getCore().byId("classobjects").removeSelections();

			} else if (oEvent.getParameters().item.getProperty("text") === "Class") {
				sap.ui.getCore().byId("Borobjects").removeSelections();
				var that = this;
				var sUriNode = "/C_SBRBUSOBJNAMEVH"; // URI to read the Node
				// entity set
				this.oModel.read(sUriNode, {
					async: false,
					success: function (oResponse) {
						that.oTable.setProperty("/ClassValueHelp", oResponse.results);
					}.bind(this),
					error: function () {}
				});
				this.sObjectType = "CL";
			}

		},
		handleObjectSearch: function (oDialog) {
			var sQuery = oDialog.getSource()._sSearchFieldValue;

			var aFilter = new Filter({
				filters: [
					new Filter("ObjectName", FilterOperator.StartsWith, sQuery)
				],
				and: false
			});
			oDialog.getSource().getBinding("items").filter([aFilter]);
		},
		handleObjectClose: function (oEvent) {
			var aTemp = [];
			aTemp = oEvent.getParameter("selectedItems");
			var oSelectedItem = aTemp[0].getProperty("title");
			var x = sap.ui.getCore().byId("objectName");
			x.setValue(oSelectedItem);
		},
		handleTargetReleaseSearch: function (_oDialog) {
			var sQuery = _oDialog.getSource()._sSearchFieldValue;
			var sFilterValue;
			if (_oDialog.getParameters().id === "TargetReleaseHelp") {
				sFilterValue = "release_id";
			} else if (_oDialog.getParameters().id === "EventTaskHelp") {
				sFilterValue = "taskCode";
			} else if (_oDialog.getParameters().id === "EventHelp") {
				sFilterValue = "event";
			}
			var aFilter = new Filter({
				filters: [
					new Filter(sFilterValue, FilterOperator.Contains, sQuery)

				],
				and: false
			});
			_oDialog.getSource().getBinding("items").filter([aFilter]);
		},
		handleValueHelpSearchMigrationObjectActual: function (_oDialog) {
			var sQuery = _oDialog.getSource()._sSearchFieldValue;

			var aFilter = new Filter({
				filters: [
					new Filter("ident", FilterOperator.Contains, sQuery)

				],
				and: false
			});
			_oDialog.getSource().getBinding("items").filter([aFilter]);
		},
		onValueHelpRequestMigrationObject: function (oEvent) {
			this.planMigrId = oEvent.getSource();
			MigrationObjects.onValueHelpRequestMigrationObject(oEvent, this);
		},

		outputObjectsActualSave: function () {
			var aOutput = this.oTable.getProperty("/output");
			var aOutputCreate = [];
			for (var i = 0; i < aOutput.length; i++) {

				if (this.tmpModel.some(function (x) {
						return x.value1 === aOutput[i].value1;

					})) {
					if ((this.aOutdel.some(function (x) {
							return x.value1 === aOutput[i].value1;
						}))) {
						if (typeof aOutput[i].new_row !== "undefined") {
							delete aOutput[i].new_row;
						}
						aOutputCreate.push($.extend(true, {}, aOutput[i]));

					}
				} else {
					if (typeof aOutput[i].new_row !== "undefined") {
						delete aOutput[i].new_row;
					}
					aOutputCreate.push($.extend(true, {}, aOutput[i]));

				}

			}

			for (i = 0; i < this.aOutdel.length; i++) {
				this.aOutdel[i].ObjectName = this.sObj;
				this.aOutdel[i].outputtype = this.aOutdel[i].value;
				this.aOutdel[i].applicationobjecttype = this.aOutdel[i].value1;
				delete this.aOutdel[i].value;
				delete this.aOutdel[i].value1;
				this.oModel.remove("/I_SBRBOOUTPUTMAP(ObjectName='" + this.aOutdel[i].ObjectName + "',applicationobjecttype='" + this.aOutdel[
						i].applicationobjecttype +
					"',outputtype='" + this.aOutdel[i].outputtype + "')", {
						groupId: this.sDeferredGroup,
						success: function () {
							// console.log("Success");
						},
						error: function () {
							// console.log("Error");
						}
					});
			}
			for (var i = 0; i < aOutputCreate.length; i++) {
				aOutputCreate[i].outputtype = aOutputCreate[i].value;
				aOutputCreate[i].applicationobjecttype = aOutputCreate[i].value1;
				aOutputCreate[i].ObjectName = this.sObj;
				delete aOutputCreate[i].value;
				delete aOutputCreate[i].value1;

				this.oModel.create("/I_SBRBOOUTPUTMAP", aOutputCreate[i], {
					groupId: this.sDeferredGroup,
					success: function () {
						// console.log("Success");
					},
					error: function () {
						// console.log("Error");
					}
				});

			}

		},
		onHandleLiveChange: function (oEvent) {
			if (oEvent.getSource().getValue().trim() !== "") {
				oEvent.getSource().setValueState("None");
			}
		},

		fnValidateReleaseState: function () {
			if (sap.ui.view.Gemini.headerModelInitial.sReleaseState === "1" &&
				this.oModel2.getData().sReleaseState === "0") {

				if (sap.ui.Gemini.Blocks.fnCloudQualityActualExists()) {
					return false;
				}

			}
		},

		fnJiraReqCheck: function (sJiraId, aModelData, oModel, objectController, sTableName, sColumnName) {
			var aJiraParameters = {
				JiraBacklogId: sJiraId
			};
			sap.ui.view.Gemini.mainModel.callFunction("/JiraValidation", {
				Method: "GET",
				urlParameters: aJiraParameters,
				success: function (oResponse) {
					var jiraIndex = null;
					if (aModelData[0].requirement_jira !== undefined) {
						var aResult = aModelData.filter(function (oObject, index) {
							if (oObject.requirement_jira === sJiraId && oObject.jira_req_valid === '2' && jiraIndex === null) {
								jiraIndex = index;
							}
							return oObject.requirement_jira === sJiraId && oObject.jira_req_valid === '2';
						});

					}
					if (aResult[0] !== undefined) {
						if (oResponse.Response && sJiraId.startsWith("APIREQ")) {

							aResult[0].requirement_jira_link = oResponse.JiraLink;
							aResult[0].jira_req_valid = '1';

						} else {
							aResult[0].jira_req_valid = '0';
							var oBundle = objectController.getView().getModel("i18n").getResourceBundle();
							var column = objectController.getView().byId(sColumnName);
							var columnNumber = objectController.getView().byId(sTableName).indexOfColumn(column);
							objectController.getView().byId(sTableName).getItems()[jiraIndex].getCells()[columnNumber].setValueState("Error");
							objectController.getView().byId(sTableName).getItems()[jiraIndex].getCells()[columnNumber].setValueStateText(oBundle.getText(
								"validjira"));
						}
					}

				}.bind(this),
				error: function () {

					sap.m.MessageBox.error("Error in validating Jira");
				}

			});

		},
		handleValueHelpSemObj : function(_SemObjDialog) {
			var sQuery = _SemObjDialog.getSource()._sSearchFieldValue;

			var aFilter = new Filter({
						filters: [
								new Filter("value",FilterOperator.Contains,sQuery)
						//    					new Filter("Description", FilterOperator.Contains, sQuery)
						],
						and: false
					});
			_SemObjDialog.getSource().getBinding("items").filter([aFilter]);
		}
	});

});