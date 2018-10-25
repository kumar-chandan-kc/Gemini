sap.ui.define([
	"s4/cfnd/geminiobjectpage/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"s4/cfnd/geminiobjectpage/controller/Handler",
	"sap/ui/core/routing/History",
	"s4/cfnd/geminiobjectpage/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/Sorter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV",
	"sap/m/MessageBox"
], function(BaseController, JSONModel, Handler, History, formatter, Filter, Sorter, FilterOperator, Export, ExportTypeCSV, MessageBox) {
	"use strict";
 
	return BaseController.extend("s4.cfnd.geminiobjectpage.controller.Worklist", {

		formatter: formatter,
		oR: {},
		oR1: {},
		oModel: [],
		defaultKey: "",

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function() {

			var oViewModel,
				iOriginalBusyDelay,
				oTable = this.byId("table");
			this.oSelectCloud = this.getSelect("cloud");

			this.getView().byId("page").setShowFooter(!(this.getView().byId("page").getShowFooter()));
			// taken care of by the table itself.
			iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
			// keeps the search state
			this._oTableSearchState = [];

			// Model used to manipulate control states
			oViewModel = new JSONModel({
				worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
				saveAsTileTitle: this.getResourceBundle().getText("saveAsTileTitle", this.getResourceBundle().getText("worklistViewTitle")),
				shareOnJamTitle: this.getResourceBundle().getText("worklistTitle"),
				tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
				tableBusyDelay: 0,
				BOTable: [],
				BOFields: [],
				cloudv: [],
				reports: [],
				Person: [],
				CDSViewname: []
			});

			var acloud = [];
			var tempx = {};
			tempx.value = "All";
			acloud[0] = $.extend({}, tempx);
			tempx.value = "Yes";
			acloud[1] = $.extend({}, tempx);
			tempx.value = "No";
			acloud[2] = $.extend({}, tempx);
			oViewModel.setProperty("/cloudv", acloud);

			var acloud2 = [];
			var x2 = {};
			x2.value = "Migration Completion Report";
			acloud2[0] = $.extend({}, x2);
			x2.value = "Search Completion Report";
			acloud2[1] = $.extend({}, x2);
			x2.value = "CDS Release Completion Report";
			acloud2[2] = $.extend({}, x2);
			x2.value = "Output Completion Report";
			acloud2[3] = $.extend({}, x2);
			x2.value = "Extensibility Completion Report";
			acloud2[4] = $.extend({}, x2);
			oViewModel.setProperty("/reports", acloud2);

			this.oModel = this.getOwnerComponent().getModel();
			var that = this;


			var sUriNode = "/I_SBRCloudQuality"; //URI to read the Node entity set
			this.oModel.read(sUriNode, {
				async: false,
				success: function(oResponse) {
					this.oR = oResponse;
					oViewModel.setProperty("/BOTable", this.oR.results);
				}.bind(this),
				error: function() {}
			});

			this.setModel(oViewModel, "worklistView");

			// Make sure, busy indication is showing immediately so there is no
			// break after the busy indication for loading the view's meta data is
			// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
			oTable.attachEventOnce("updateFinished", function() {
				// Restore original busy indicator delay for worklist's table
				oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
			});

		},
		onOK: function(oEvent) {
			oEvent.getSource().close();
		},
		onChangeColumnsItems: function(oEvent) {
			// var aMColumnsItems = oEvent.getParameter("items").map(function(oMChangedColumnsItem) {
			//            return oMChangedColumnsItem;
			// });
			// this.oJSONModel.setProperty("/ColumnsItems", aMColumnsItems);
			var sColumn = oEvent.getParameters().newItems[0].getColumnKey();
			var sStatus = this.getView().byId(sColumn).getVisible();
			if (sStatus === true)
				this.getView().byId(sColumn).setVisible(false);
			else if (sStatus === false)
				this.getView().byId(sColumn).setVisible(true);
		},

		getSelect: function(sId) {
			return this.getView().byId(sId);
		},
		getSelectedItemText: function(oSelect) {
			return oSelect.getSelectedItem() ? oSelect.getSelectedItem().getKey() : "";
		},
		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onUpdateFinished: function(oEvent) {
			// update the worklist's object counter after the table update
			var sTitle,
				oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");
			// only update the counter if the length is final and
			// the table is not empty
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
			} else {
				sTitle = this.getResourceBundle().getText("worklistTableTitle");
			}
			this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onPress: function(oEvent) {
			// The source is the list item that got pressed
			this._showObject(oEvent.getSource().getAggregation("cells")[0].getProperty("title"));
		},

		/**
		 * Event handler when the share in JAM button has been clicked
		 * @public
		 */
		onShareInJamPress: function() {
			var oViewModel = this.getModel("worklistView"),
				oShareDialog = sap.ui.getCore().createComponent({
					name: "sap.collaboration.components.fiori.sharing.dialog",
					settings: {
						object: {
							id: location.href,
							share: oViewModel.getProperty("/shareOnJamTitle")
						}
					}
				});
			oShareDialog.open();
		},

		onSearch: function(oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
			} else {
				var oTableSearchState = [];

				//            var sQuery = oEvent.getParameter("query");
				var sQuery = oEvent.getSource().getProperty("value");
				var aFilter = new Filter({
					filters: [
						new Filter("ObjectName", FilterOperator.Contains, sQuery),
						new Filter("area", FilterOperator.Contains, sQuery),
						new Filter("applicationcomponent", FilterOperator.Contains, sQuery),
						new Filter("contactperson", FilterOperator.Contains, sQuery)
					],
					and: false
				});

				if (sQuery && sQuery.length > 0) {
					oTableSearchState = aFilter;
				}
				this._applySearch(oTableSearchState);
			}

		},

		handleViewSettingsDialogButtonPressed: function(oEvent) {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("s4.cfnd.geminiobjectpage.view.dialog", this);
			}
			// toggle compact style
			this.getView().addDependent(this._oDialog);
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oDialog.open();
		},
		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefresh: function() {
			var oTable = this.byId("table");
			oTable.getBinding("items").refresh();
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Shows the selected item on the object page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */

		_showObject: function(oItem) {
			//	Handler.setPointer(this);
			this.getRouter().navTo("object", {
				objectId: oItem,
				sectionId: "Default"
			});

		},

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {object} oTableSearchState an array of filters for the search
		 * @private
		 */
		_applySearch: function(oTableSearchState) {
			var oTable = this.byId("table"),
				oViewModel = this.getModel("worklistView");
			oTable.getBinding("items").filter(oTableSearchState, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (oTableSearchState.length !== 0) {
				oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
			}
		},

		getParametersValue: function() {
			var parametersValue = Object.create(null);
			parametersValue.area = this.getView().byId("farea").getTokens();
			parametersValue.cloudRelevant = this.getSelectedItemText(this.oSelectCloud);
			parametersValue.applicationComponent = this.getView().byId("Appv").getTokens();

			return parametersValue;
		},

		onSelect: function(oEvent) {
			"use strict";
			var params = oEvent.getParameters();
			var sMessage = "New Variant Selected: " + params.key;
			sap.m.MessageToast.show(sMessage);
			var oTableSearchState = [];
			var selectedKey = oEvent.getSource().getSelectionKey();
			var modelData;
			if (selectedKey === "*standard*") {
				modelData = {};
				oTableSearchState = [];
				this.getView().byId("farea").setSelectedKey("");
				this.getView().byId("cloud").setSelectedKey("");
				this.getView().byId("Appv").removeAllTokens();
				var model = this.getView().byId("page").getModel("worklistView");
				oTableSearchState.push(new Filter("Area", FilterOperator.Contains, ""));
				oTableSearchState.push(new Filter("isCloudRelevant", FilterOperator.Contains, ""));
				this._applySearch(oTableSearchState);

			} else {
				var bindingPath = oEvent.getSource().getItemByKey(selectedKey).getBindingContext().getPath();
				modelData = this.getView().getModel().getProperty(bindingPath);
				//            var model = this.getView().getModel("worklistView");
				oTableSearchState = [];

				if (modelData.area === "All") {
					modelData.area = "";
				}
				if (modelData.iscloudrelevant === "All") {

					modelData.iscloudrelevant = "";

				}
				//            this.getView().byId("farea").setSelectedKey(modelData.area);
				this.getView().byId("cloud").setSelectedKey(modelData.iscloudrelevant);
				switch (modelData.iscloudrelevant) {
					case "Yes":
						modelData.iscloudrelevant = 'sap-icon://accept';
						break;
					case "No":
						modelData.iscloudrelevant = 'sap-icon://decline';
						break;
				}
				var aTokens = [],
					aTokensArea = [],
					i;

				aTokensArea = modelData.area.slice(1, -1).split("|");
				aTokens = modelData.appcomponent.slice(1, -1).split("|");

				if (aTokensArea[0] !== "") {
					for (i = 0; i < aTokensArea.length; i++) {
						oTableSearchState.push(new Filter("Area", FilterOperator.EQ, aTokensArea[i]));
					}

				} else {
					oTableSearchState.push(new Filter("Area", FilterOperator.Contains, ''));
				}

				//            oTableSearchState.push(new Filter("Area", FilterOperator.Contains, modelData.area));
				oTableSearchState.push(new Filter("isCloudRelevant", FilterOperator.Contains, modelData.iscloudrelevant));
				if (aTokens[0] !== "") {
					for (i = 0; i < aTokens.length; i++) {
						oTableSearchState.push(new Filter("ApplicationComponent", FilterOperator.EQ, aTokens[i]));
					}

				} else {
					oTableSearchState.push(new Filter("ApplicationComponent", FilterOperator.Contains, ''));
				}
				for (i = 0; i < aTokens.length; i++) {
					this.getView().byId("Appv").insertToken(new sap.m.Token({
						key: aTokens[i],
						text: aTokens[i]
					}));
				}

				for (i = 0; i < aTokensArea.length; i++) {
					this.getView().byId("farea").insertToken(new sap.m.Token({
						key: aTokensArea[i],
						text: aTokensArea[i]
					}));
				}

				this._applySearch(oTableSearchState);
				//model.refresh();

				var sMessage = "New Variant Selected:" + selectedKey;
				sap.m.MessageToast.show(sMessage);
			}
		}

	});
});