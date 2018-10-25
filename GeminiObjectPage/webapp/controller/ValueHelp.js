/*global s4:true*/

jQuery.sap.declare("s4.cfnd.geminiobjectpage.controller.ValueHelp");
s4.cfnd.geminiobjectpage.controller.ValueHelp = {
	onValueHelpRequestPackage: function() {
		if (!this._PackageDialog) {
			this._PackageDialog = sap.ui.xmlfragment("s4.cfnd.geminiobjectpage.ValueHelpFragments.PackageValueHelp", this);
			this.getView().addDependent(this._PackageDialog);
		} 
		//// toggle compact style
		// this._oDialog.setModel(this.oTable, "Gemini");
		jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._PackageDialog);
		this._PackageDialog.open();
		if (this._PackageDialog) {
			var searchField = sap.ui.getCore().byId("PackageDialog-list");
			searchField.addEventDelegate({
				onfocusin: function() {
					sap.ui.getCore().byId("PackageDialog-searchField").focus();
				}
			}, this);
		}

	},
	handleValueHelpSearchPackage: function(_PackageDialog) {
		var sQuery = _PackageDialog.getSource()._sSearchFieldValue;

		var aFilter = new sap.ui.model.Filter({
			filters: [
				new sap.ui.model.Filter("devclass", sap.ui.model.FilterOperator.Contains, sQuery),
			],
			and: false
		});
		_PackageDialog.getSource().getBinding("items").filter([aFilter]);
	}
};