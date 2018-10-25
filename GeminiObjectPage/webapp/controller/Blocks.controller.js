sap.ui.define([
	"s4/cfnd/geminiobjectpage/controller/BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox"
], function (BaseController, Filter, FilterOperator, MessageBox) {
	"use strict";

	return BaseController.extend("s4.cfnd.geminiobjectpage.controller.Blocks", {

		onInit: function () {
			sap.ui.namespace("sap.ui.Gemini.Blocks");
			sap.ui.Gemini.Blocks = this;

		},
		
		fnPriorityChange: function () {
			sap.ui.view.Gemini.headerModel.setProperty("/sPriority", this.getView().byId("sPrioritySelect").getSelectedItem().getText());
		},
		
		fnReleaseStatusChange: function () {

			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			this.getView().byId("sReleaseStatus").setValueState("None");
			if (sap.ui.view.Gemini.headerModelInitial.sReleaseState === "1" &&
				this.getView().byId("sReleaseStatus").getSelectedItem().getKey() === "0") {

				if (this.fnCloudQualityActualExists()) {
					this.getView().byId("sReleaseStatus").setSelectedKey("1");
					MessageBox.error(oBundle.getText("releaseStateCheck"));
				}
				else{
					sap.ui.view.Gemini.headerModel.setProperty("/sReleaseStateText", this.getView().byId("sReleaseStatus").getSelectedItem().getText());
					sap.ui.view.Gemini.headerModel.setProperty("/sReleaseState", this.getView().byId("sReleaseStatus").getSelectedItem().getKey());
				}

			} else {
				sap.ui.view.Gemini.headerModel.setProperty("/sReleaseStateText", this.getView().byId("sReleaseStatus").getSelectedItem().getText());
				sap.ui.view.Gemini.headerModel.setProperty("/sReleaseState", this.getView().byId("sReleaseStatus").getSelectedItem().getKey());
			}
		},

		fnCloudQualityActualExists: function () {
			if (sap.ui.view.Gemini.model.getData().api.length === 0 && sap.ui.view.Gemini.model.getData().cds.length === 0 &&
				sap.ui.view.Gemini.model.getData().businessContext.length === 0 && sap.ui.view.Gemini.model.getData().output.length === 0 &&
				sap.ui.view.Gemini.search.getData().searchactual.length === 0 && sap.ui.view.Gemini.model.getData().migr.length === 0 &&
				sap.ui.view.Gemini.model.getData().events.length === 0 && sap.ui.view.Gemini.model.getData().fiori.length === 0) {
				return false;
			} else {
				return true;
			}
		},

		handleValueHelpSearchArea: function (oEvent) {
			var sQuery = oEvent.getSource()._sSearchFieldValue;

			var aFilter = new Filter({
				filters: [
					new Filter("Area", FilterOperator.Contains, sQuery),
					new Filter("Description", FilterOperator.Contains, sQuery)
				],
				and: false
			});
			oEvent.getSource().getBinding("items").filter([aFilter]);
		},
		fnCDSValueHelp: function (oEvent) {

			if (!this._CDSDialog) {
				this._CDSDialog = sap.ui.xmlfragment("s4.cfnd.geminiobjectpage.view.CDSvalueHelp", this);
				this.getView().addDependent(this._CDSDialog);
			}

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

		handleValueHelpPackage: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				sap.ui.view.Gemini.headerModel.setProperty("/sPackage", oSelectedItem.getTitle());
			}
			oEvent.getSource().getBinding("items").filter([]);
		},

		fnOnCDSChange: function () {
			sap.ui.view.Gemini.EventsView.byId("AddCDSKeyFields").setEnabled(true);
		},

		fnCDSEditable: function () {

			if (sap.ui.view.Gemini.model === undefined) {
				return false;
			} else {
				var sCurrentRelease = sap.ui.view.Gemini.model.getProperty("/currentRelease");
				var aEventsactual = sap.ui.view.Gemini.model.getProperty("/events");
				if (aEventsactual.length === 0)
					return true;
				else
					return !aEventsactual.some(function (object) {
						return object.ActualRelease < sCurrentRelease;
					});
			}

		},

		handleValueHelpCDS: function (oEvent) {

			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				if (sap.ui.view.Gemini.headerModel.getProperty("/sCDSObj") !== oSelectedItem.getTitle()) //skip if unchanged
				{
					sap.ui.view.Gemini.headerModel.setProperty("/sCDSObj", oSelectedItem.getTitle());
					this.fnOnCDSChange();
				}
			}
			oEvent.getSource().getBinding("items").filter([]);
		},
		handleValueHelpArea: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				sap.ui.view.Gemini.headerModel.setProperty("/sArea", oSelectedItem.getTitle());
			}
			oEvent.getSource().getBinding("items").filter([]);

		},

		onValueHelpRequestPackage: function () {
			if (!this._PackageDialog) {
				this._PackageDialog = sap.ui.xmlfragment("s4.cfnd.geminiobjectpage.ValueHelpFragments.PackageValueHelp", this);
				this.getView().addDependent(this._PackageDialog);
			}
			// toggle compact style
			// this._oDialog.setModel(this.oTable, "Gemini");
			this._PackageDialog.open();
			if (this._PackageDialog) {
				var searchField = sap.ui.getCore().byId("PackageDialog-list");
				searchField.addEventDelegate({
					onfocusin: function () {
						sap.ui.getCore().byId("PackageDialog-searchField").focus();
					}
				}, this);
			}

		},

		onValueHelpRequestArea: function (oEvent) {
			if (!this._AreaDialog) {
				this._AreaDialog = sap.ui.xmlfragment("s4.cfnd.geminiobjectpage.view.AreaValueHelp", this);
				this.getView().addDependent(this._AreaDialog);
			}
			// toggle compact style
			// this._oDialog.setModel(this.oTable, "Gemini");

			this._AreaDialog.open();
			if (this._AreaDialog) {
				var searchField = sap.ui.getCore().byId("AreaDialog-list");
				searchField.addEventDelegate({
					onfocusin: function () {
						sap.ui.getCore().byId("AreaDialog-searchField").focus();
					}
				}, this);
			}
		}
	});
});