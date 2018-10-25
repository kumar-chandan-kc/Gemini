sap.ui.controller("GeminiSmartTemplate.ext.controller.ListReportExt", {

	oModel: [],
	currentObj: null,
	onInit: function() {
		sap.ui.namespace("sap.ui.gem");
		sap.ui.gem.sObj = "";
		var that = this;
		sap.ui.gem.pointer = this;
		sap.ui.gem.sPresentRelease = 9999;
		sap.ui.gem.sNextRelease = 9999;
		var oView = this.getView();
		var oSmartTable = oView.byId('listReport');
		// oSmartTable.setProperty('Enable Auto Binding', true, []);
		var oTable = oSmartTable.getTable();
		oTable.onItemPress = function(oEvent) {
			that.yourFunction(oEvent);
		};

		this.oPopover = new sap.m.ResponsivePopover();
		this.oPopover.setProperty("placement", "Top");
		this.oPopover.setProperty("showHeader", false);
		
		var oNavigationPopoverList = new sap.m.List();
			
	
		var	oNavPopoverItemSearch = new sap.m.StandardListItem({
				title: "Search Completion Report",
				type:"Active"
			});
		var	oNavPopoverItemCDS = new sap.m.StandardListItem({
				title: "CDS Release Completion Report",
				type:"Active"
			});
		var	oNavPopoverItemMigration = new sap.m.StandardListItem( {
				title: "Migration Completion Report",
				type:"Active"
			});
		var	oNavPopoverItemExtensibility = new sap.m.StandardListItem( {
				title: "Extensibility Completion Report",
				type:"Active"
			});
		var	oNavPopoverItemOutput = new sap.m.StandardListItem({
				title: "Output Completion Report",
				type:"Active"
			});
	
		oNavigationPopoverList.addItem(oNavPopoverItemSearch);
		oNavigationPopoverList.addItem(oNavPopoverItemCDS);
		oNavigationPopoverList.addItem(oNavPopoverItemMigration);
		oNavigationPopoverList.addItem(oNavPopoverItemExtensibility);
		oNavigationPopoverList.addItem(oNavPopoverItemOutput);
			
			oNavPopoverItemSearch.attachPress( function() {

				var semanticobject = "Search";
				var action = "analyze";
//				var evaluationid = ".GEMINI.SEARCHCALCULATIONS";
				var evaluationid = ".SEARCH.COMPLETION";
				var navigationService = sap.ushell.Container.getService('CrossApplicationNavigation');

				// Step 2: Navigate using your semantic object

				var hash = navigationService.hrefForExternal({

					target: {
						semanticObject: semanticobject,
						action: action
					},

					params: {
						"EvaluationId": evaluationid
					}

				});

				var url = window.location.href.split('#')[0] + hash;

				sap.m.URLHelper.redirect(url, true);
			}, {});

			oNavPopoverItemCDS.attachPress( function() {

				var semanticobject = "CDSRelease";
				var action = "analyze";
//				var evaluationid = ".GEMINI.CDSCALCULATION";
				var evaluationid = ".CDS.RELEASECOMPLETION";
				var navigationService = sap.ushell.Container.getService('CrossApplicationNavigation');

				// Step 2: Navigate using your semantic object

				var hash = navigationService.hrefForExternal({

					target: {
						semanticObject: semanticobject,
						action: action
					},

					params: {
						"EvaluationId": evaluationid
					}

				});

				var url = window.location.href.split('#')[0] + hash;

				sap.m.URLHelper.redirect(url, true);
			}, {});

			oNavPopoverItemMigration.attachPress( function() {

				var semanticobject = "Migration";
				var action = "analyze";
//				var evaluationid = ".GEMINI.MIGRATIONCOMPLETION";
				var evaluationid = ".MIGRATION.COMPLETION";
				var navigationService = sap.ushell.Container.getService('CrossApplicationNavigation');

				// Step 2: Navigate using your semantic object

				var hash = navigationService.hrefForExternal({

					target: {
						semanticObject: semanticobject,
						action: action
					},

					params: {
						"EvaluationId": evaluationid
					}

				});

				var url = window.location.href.split('#')[0] + hash;

				sap.m.URLHelper.redirect(url, true);
			}, {});

			oNavPopoverItemExtensibility.attachPress( function() {

				var semanticobject = "Extensibility";
				var action = "analyze";
//				var evaluationid = ".GEMINI.EXTENSIBILITY";
				var evaluationid = ".EXTENSIBILITY.COMPLETION";
				var navigationService = sap.ushell.Container.getService('CrossApplicationNavigation');

				// Step 2: Navigate using your semantic object

				var hash = navigationService.hrefForExternal({

					target: {
						semanticObject: semanticobject,
						action: action
					},

					params: {
						"EvaluationId": evaluationid
					}

				});

				var url = window.location.href.split('#')[0] + hash;

				sap.m.URLHelper.redirect(url, true);
			}, {});

			oNavPopoverItemOutput.attachPress( function() {

				var semanticobject = "Output";
				var action = "analyze";
				var evaluationid = ".OUTPUT.COMPLETION";
				var navigationService = sap.ushell.Container.getService('CrossApplicationNavigation');

				// Step 2: Navigate using your semantic object

				var hash = navigationService.hrefForExternal({

					target: {
						semanticObject: semanticobject,
						action: action
					},

					params: {
						"EvaluationId": evaluationid
					}

				});

				var url = window.location.href.split('#')[0] + hash;

				sap.m.URLHelper.redirect(url, true);
			}, {});

			
			this.oPopover.addContent(oNavigationPopoverList);
		
		var oViewModel = new sap.ui.model.json.JSONModel({
			BOTable: []
		});
		// sap.ui.getCore().byId(
		// 	"GeminiSmartTemplate::sap.suite.ui.generic.template.ListReport.view.ListReport::C_SBRBACKUP--ActionC_SBRBACKUP5button").setTooltip(
		// 	"Assign To a SAP Object Type");
		this.oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/CA_BUSINESS_REPOSITORY_SMART_SRV", true);
		// this.oModel1 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/CA_BUSINESS_REPOSITORY_SRV", true);
		// this.oModelOld = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZSAMPLETEST_GEMINI_SRV", true);
		var sUriNode = "/C_SBRBACKUP"; //URI to read the Node entity set
		this.oModel.read(sUriNode, {
			async: false,
			success: function(oData, oResponse) {
				oViewModel.setProperty("/BOTable", oData.results);

			}.bind(this),
			error: function() {}
		});
		this.getView().setModel(oViewModel, "geminiold");
		sUriNode = "/I_SBRTargetRelease"; //URI to read the Node entity set
		this.oModel.read(sUriNode, {
			async: false,
			success: function(oData, oResponse) {
				var aTargetRelease = oData.results;
				var currDateTime = new Date();
				for (var i = 0; i < aTargetRelease.length; i++) {
					if (currDateTime < aTargetRelease[i].ecc) {
						if (aTargetRelease[i].release_id < sap.ui.gem.sPresentRelease) {
							sap.ui.gem.sNextRelease = sap.ui.gem.sPresentRelease;
							sap.ui.gem.sPresentRelease = aTargetRelease[i].release_id;
						} else if (aTargetRelease[i].release_id < sap.ui.gem.sNextRelease && aTargetRelease[i].release_id !== sap.ui.gem.sPresentRelease) {
							sap.ui.gem.sNextRelease = aTargetRelease[i].release_id;
						}
					}
				}
				oViewModel.setProperty("/target_release", oData.results);

			}.bind(this),
			error: function() {}
		});
		oTable.attachEvent("selectionChange", null, this.fSelect);

		//Remove filter from table personalisation
		this.getView().byId("GeminiSmartTemplate::sap.suite.ui.generic.template.ListReport.view.ListReport::C_SBRBACKUP--listReport").setIgnoreFromPersonalisation(
			"Filter");

		var oReportButton = sap.ui.getCore().byId(
			"GeminiSmartTemplate::sap.suite.ui.generic.template.ListReport.view.ListReport::C_SBRBACKUP--ActionC_SBRBACKUP6button");
		//this._oDialog25.openBy(oReportButton);
		oReportButton.setTooltip("Completion Reports");
		oReportButton.setIcon("sap-icon://business-objects-experience");
		// var oDownloadButton = sap.ui.getCore().byId(
		// 	"GeminiSmartTemplate::sap.suite.ui.generic.template.ListReport.view.ListReport::C_SBRBACKUP--ActionC_SBRBACKUP1button");
		// oDownloadButton.setVisible(true);
		// oDownloadButton.setEnabled(
		// 	true);
		// oDownloadButton.setTooltip("Download On Boarding Report");
		//// oDownloadButton.setIcon("sap-icon://download");

	},
	onExit: function() {
		
	},
	fSelect: function() {

		var oTable = sap.ui.getCore().byId(
			"GeminiSmartTemplate::sap.suite.ui.generic.template.ListReport.view.ListReport::C_SBRBACKUP--responsiveTable");
		sap.ui.gem.sObj = oTable.getSelectedContexts()[0].getProperty("ObjectName");
		sap.ui.getCore().byId(
			"GeminiSmartTemplate::sap.suite.ui.generic.template.ListReport.view.ListReport::C_SBRBACKUP--ActionC_SBRBACKUP5button").setEnabled(
			true);

	},

	onClickActionC_SBRBACKUP5: function(oEvent) {
		// if (!this._oDialog24) {
		// 	this._oDialog24 = sap.ui.xmlfragment("GeminiSmartTemplate.ext.fragment.Assign", this);
		// }
		// this.getView().addDependent(this._oDialog24);

		// jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog1);
		// this._oDialog24.open();

		var oUser = new sap.ushell.services.UserInfo();
		var userId = oUser.getUser().getFullName();

		var data_bo = this.getView().getModel("geminiold").getData().BOTable;
		var currObjName = this.getView().byId(
				"GeminiSmartTemplate::sap.suite.ui.generic.template.ListReport.view.ListReport::C_SBRBACKUP--responsiveTable").getSelectedItem()
			.getBindingContextPath().split("'")[1];
		var objResult = data_bo;
		objResult = objResult.filter(function(data) {
			return (data.ObjectName === currObjName);
		});

		if (objResult.length === 1) {
			this.currentObj = objResult;
			// if(objResult[0].Status === "rejected") {

			// } else
			if (objResult[0].PersonResponsible === userId) {
				if (!this._oDialog25) {
					this._oDialog25 = sap.ui.xmlfragment("GeminiSmartTemplate.ext.fragment.Assign", this);
				}
				// toggle compact style
				this.getView().addDependent(this._oDialog25);
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog25);
				this._oDialog25.open();
			} else {
				var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
				sap.m.MessageBox.error(
					"You do not have authorization to perform this operation", {
						styleClass: bCompact ? "sapUiSizeCompact" : ""
					}
				);
			}
		}
	},
	handleAssignConfirm: function(oEvent) {

		var aTemp = {};
		aTemp.sapobjecttypeold = this.currentObj[0].ObjectName;
		aTemp.sapobjecttypenew = sap.ui.getCore().byId("Assign1").getValue();
		aTemp.comment = sap.ui.getCore().byId("TypeHere").getValue();
		aTemp.createdate = this.getDateTime();

		if (sap.ui.getCore().byId("Assign1").getValue() !== "") {
			var sUriNew = "/I_SBRCombinedObjectView";
			var aFilters = [];
			// Filter Conditions
			aFilters.push(new sap.ui.model.Filter("ObjectName", sap.ui.model.FilterOperator.EQ, aTemp.sapobjecttypenew));
			this.oModel.read(sUriNew, {
				filters: aFilters,
				success: function(oResponse) {
					var sRes = oResponse.results;
					var oUser = new sap.ushell.services.UserInfo();
					var userId = oUser.getUser().getFullName();
					var sEventsObjectName;
					if (sRes[0].borObject !== "") {
						var a = sRes[0].borObject;
						sEventsObjectName = a;
						sEventsObjectName = sRes[0].borObject;
					} else if (sRes[0].clObject !== "") {
						sEventsObjectName = sRes[0].clObject;
					} else {
						sEventsObjectName = "";
					}

					if (this.currentObj[0].PersonResponsible === sRes[0].PersonResponsible && sRes[0].PersonResponsible === userId) {
						if ((sRes[0].borObject === "" && sRes[0].clObject === "") || ((sRes[0].borObject === sEventsObjectName && this.sRes[0].clObject ===
								"") || (sRes[0].borObject === sEventsObjectName && this.sRes[0].borObject === ""))) {
							this.oModel.create('/AssignSet', aTemp, null, function() {
								// console.log("Success");

							}, function() {
								// console.log("Error");
							});
							//	console.log("Success");
						} else {
							sap.m.MessageBox.error(
								"The SAP Object Type Representations of " + this.currentObj[0].ObjectName + " and " + sap.ui.getCore().byId("Assign1").getValue() +
								" are not compatible to perform this operation", {
							}
							);
						}
					} else {
						var	bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
						sap.m.MessageBox.error(
							"You do not have authorization to assign to " + sap.ui.getCore().byId("Assign1").getValue(), {
								styleClass: bCompact ? "sapUiSizeCompact" : ""
							}
						);
					}

				}.bind(this),
				error: function() {

				}
			});
		} else {
			sap.m.MessageBox.error(
				"Please select a SAP Object Type", {
				}
			);
		}

	},
	handlecancel: function() {
		sap.ui.getCore().byId("Assign1").setValue("");
		sap.ui.getCore().byId("TypeHere").setValue("");
	},
	getDateTime: function() {
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
	handleObjSearch: function(oDialog) {
		var sQuery = oDialog.getSource()._sSearchFieldValue;
		
		var aFilter = new sap.ui.model.Filter({
			filters: [
				new sap.ui.model.Filter("ObjectName", sap.ui.model.FilterOperator.Contains, sQuery)
			],
			and: false
		});
		oDialog.getSource().getBinding("items").filter([aFilter]);
	},
	handleObjClose: function(oEvent) {
		var aTemp = oEvent.getParameter("selectedItems");
		var oSelectedItem = aTemp[0].getProperty("title");
		var x = sap.ui.getCore().byId("Assign1");
		x.setValue(oSelectedItem);
	},
	onObjValueHelpRequest: function(oEvent) {
		if (!this._oDialog2) {
			this._oDialog2 = sap.ui.xmlfragment("GeminiSmartTemplate.ext.fragment.ObjectName", this);
			// this._oDialog2.setModel(this.getView().getModel());
		}
		this.getView().addDependent(this._oDialog2);

		this._oDialog2.open();
	},
	yourFunction: function(oEvent) {
		var x = oEvent.getCells()[0].getText();
		x += "#Default";
		var str = "Gemini-manage&/" + x;

		var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
		oCrossAppNavigator.toExternal({
			target: {
				shellHash: str
			}

		});

	},

	onClickActionC_SBRBACKUP6: function(oEvent) {
		var oReportButton = sap.ui.getCore().byId(
			"GeminiSmartTemplate::sap.suite.ui.generic.template.ListReport.view.ListReport::C_SBRBACKUP--ActionC_SBRBACKUP6button");
		this.oPopover.openBy(oReportButton);
	},
	onClickActionC_SBRBACKUP1: function(oEvent) {
		if (!this._dialog) {
			this._dialog = sap.ui.xmlfragment("GeminiSmartTemplate.ext.fragment.ExcelDownloadBusyDialog", this);
			this.getView().addDependent(this._dialog);

		}
		this._dialog.open();
		var sSearch = sap.ui.getCore().byId(
			"GeminiSmartTemplate::sap.suite.ui.generic.template.ListReport.view.ListReport::C_SBRBACKUP--listReportFilter-btnBasicSearch").getValue();
		var aFilter = [];

		aFilter.push(new sap.ui.model.Filter("API", sap.ui.model.FilterOperator.EQ, true));
		aFilter.push(new sap.ui.model.Filter("Migration", sap.ui.model.FilterOperator.EQ, true));
		aFilter.push(new sap.ui.model.Filter("Events", sap.ui.model.FilterOperator.EQ, true));
		aFilter.push(new sap.ui.model.Filter("Output", sap.ui.model.FilterOperator.EQ, true));
		aFilter.push(new sap.ui.model.Filter("Extension", sap.ui.model.FilterOperator.EQ, true));
		aFilter.push(new sap.ui.model.Filter("Search", sap.ui.model.FilterOperator.EQ, true));
		aFilter.push(new sap.ui.model.Filter("Search_field", sap.ui.model.FilterOperator.EQ, sSearch));
		var sTargetRelease = sap.ui.gem.sNextRelease;
		aFilter.push(new sap.ui.model.Filter("Target_Release", sap.ui.model.FilterOperator.EQ, sTargetRelease));
		var sf = sap.ui.getCore().byId(
			"GeminiSmartTemplate::sap.suite.ui.generic.template.ListReport.view.ListReport::C_SBRBACKUP--listReport")._oSmartFilter;

		var aSmartFilters = sf.getFilters();
		aFilter = aSmartFilters.concat(aFilter);
		var sUriNode =
			"/Download('Plan')/$value";
		// var aFilter = [];
		this.oModel.read(sUriNode, {
			urlParameters: "$value",
			async: false,
			filters: aFilter,
			success: function(oData, oResponse) {
				var json = oResponse.body;
				var a = document.createElement("a");
				// document.body.appendChild(a);
				a.style = "display: none";
				var blob = new Blob([json], {
					type: "application/vnd.ms-excel"
				});
				a.download = "Onboarding Report " + sTargetRelease;
				var url = window.URL.createObjectURL(blob);
				a.href = url;

				if (sap.ui.Device.browser.msie || sap.ui.Device.browser.edge) {
					window.navigator.msSaveBlob(blob, a.download + '.xls');
				} else {
					document.body.appendChild(a);
					a.click();
					document.body.removeChild(a);
					window.URL.revokeObjectURL(url);
				}

				this._dialog.close();
			}.bind(this),
			error: function() {
				//	this._dialog.close();
			}
		});
	}
});