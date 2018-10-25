sap.ui.define([ 
	"s4/cfnd/geminiobjectpage/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"s4/cfnd/geminiobjectpage/model/formatter"
], function(
	BaseController,
	JSONModel,
	History,
	formatter
) {
	"use strict";
 
	return BaseController.extend("s4.cfnd.geminiobjectpage.controller.Object1", {
		formatter: formatter,
		oTable: [],
		oModel: [],
		objArray: [],
		badiArray: [],
		odataArray: [],
		cdsViewArray: [],

		onInit: function() {
			this.getRouter().getRoute("object1").attachPatternMatched(this._onObjectMatched, this);

		},

		fnClick: function(oEvent) {
			var oItem = oEvent.getSource().getAggregation("cells")[0].getProperty("text");
			this.getRouter().navTo("object", {
				objectId: oItem,
				sectionId: "Default"
			});
		},

		fnContains: function(v, objArr) {
			for (var i = 0; i < objArr.length; i++) {
				if (objArr[i].value === v) {
					return true;
				}
			}
			return false;
		},

		fnUnique: function(objArr) {
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

		_onObjectMatched: function(oEvent) {
			var sbusinessContext = oEvent.getParameter("arguments").businessContext;
			var sObjectId = oEvent.getParameter("arguments").businessObject;

			//BusyIndicator 
			this.getView().byId("busyObj").setVisible(true);
			this.getView().byId("idTable4").setVisible(false);
			this.getView().byId("busyBadi").setVisible(true);
			this.getView().byId("idTable2").setVisible(false);
			this.getView().byId("busyOData").setVisible(true);
			this.getView().byId("idTable3").setVisible(false);
			this.getView().byId("busyCDS").setVisible(true);
			this.getView().byId("idTable").setVisible(false);

			var oView = {
				sbusinessContext: sbusinessContext,
				obj: [],
				badi: [],
				odata: [],
				cdsView: []
			};
			this.oTable = new sap.ui.model.json.JSONModel(oView);
			this.getView().setModel(this.oTable, "Extensibility");

			var sUriMgr = "/I_SBRFINALOBJECTPAGE";
			// this.oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/SAP/CA_BUSINESS_REPOSITORY_SRV", {useBatch:true});
			this.oModel = this.getOwnerComponent().getModel();
			var aFiltersMgr = [];
			aFiltersMgr.push(new sap.ui.model.Filter("BusinessContext", sap.ui.model.FilterOperator.EQ, sbusinessContext));
			var that = this;
			that.sRes = null;
			this.oModel.read(sUriMgr, {
				filters: aFiltersMgr,

				success: function(oResponse) {
					that.sRes = oResponse.results;
					//Reading the result 
					//Function call to build Lane Position 
					//console.log("Success"); 
					var i;
					that.badiArray = [];

					that.odataArray = [];
					that.cdsViewArray = [];

					for (i = 0; i < that.sRes.length; i++) {
						that.objArray[i] = that.sRes[i].ObjectName;
						that.badiArray[i] = that.sRes[i].badi_name;
						that.odataArray[i] = that.sRes[i].model_name;
						that.cdsViewArray[i] = that.sRes[i].CDS_Ext;
					}

					that.objArray = that.fnUnique(that.objArray);
					that.badiArray = that.fnUnique(that.badiArray);
					that.odataArray = that.fnUnique(that.odataArray);
					that.cdsViewArray = that.fnUnique(that.cdsViewArray);

					that.oTable.setProperty("/obj", that.objArray);
					that.getView().byId("busyObj").setVisible(false);
					that.getView().byId("idTable4").setVisible(true);

					that.oTable.setProperty("/badi", that.badiArray);
					that.getView().byId("busyBadi").setVisible(false);
					that.getView().byId("idTable2").setVisible(true);

					that.oTable.setProperty("/odata", that.odataArray);
					that.getView().byId("busyOData").setVisible(false);
					that.getView().byId("idTable3").setVisible(true);

					that.oTable.setProperty("/cdsView", that.cdsViewArray);
					that.getView().byId("busyCDS").setVisible(false);
					that.getView().byId("idTable").setVisible(true);

				},
				error: function() {

				}
			});

			this.oTable.setProperty("/businessContext", sbusinessContext);

		}

	});

});