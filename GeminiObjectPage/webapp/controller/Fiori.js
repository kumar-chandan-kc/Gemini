/*global s4:true*/
jQuery.sap.declare("s4.cfnd.geminiobjectpage.controller.Fiori");
sap.ui
	.define(
		["sap/m/MessageBox", "sap/ui/model/Filter",
			"sap/ui/model/FilterOperator"
		],
		function (MessageBox) {
			"use strict";

			s4.cfnd.geminiobjectpage.controller.Fiori = {

				handleFioriEdit: function (oEvent) {
					oEvent.getView().byId("TableFioriDisplay")
						.setVisible(false);
					oEvent.getView().byId("TableFioriEdit").setVisible(
						true);
					oEvent.getView().byId("addFioriApp").setVisible(
						true);
					oEvent.getView().byId("TableFioriEdit").setMode(
						sap.m.ListMode.Delete);
					oEvent.ofioriTempModel = $.extend(true, [],
						oEvent.getView().getModel("Gemini")
						.getData().fiori);
				},
				deleteFioriApp: function (oEvent) {
					var oBundle = this.getView().getModel("i18n")
						.getResourceBundle();
					var deleteConfirmationMessage = oBundle
						.getText("deleteConfirmationMessage");
					var index = oEvent.getParameter('listItem')
						.getBindingContextPath().split("/")[2];

					MessageBox
						.confirm(
							deleteConfirmationMessage, {
								actions: [
									sap.m.MessageBox.Action.YES,
									sap.m.MessageBox.Action.CANCEL
								],
								onClose: function (sAction) {
									if (sAction === "YES") {

										var oModel = this
											.getView()
											.getModel(
												"Gemini");
										oModel.getData().fiori
											.splice(index,
												1);
										oModel.refresh(true);
									}
								}.bind(this)
							});
				},

				onFioriAdd: function (oEvent) {
					s4.cfnd.geminiobjectpage.controller.Fiori
						.readSemanticObjects(this);
					if (!this.SemanticObjectVH) {
						this.SemanticObjectVH = sap.ui
							.xmlfragment(
								"s4.cfnd.geminiobjectpage.view.SemanticObjectValueHelp",
								this);
						this.getView().addDependent(
							this.SemanticObjectVH);
					}
					this.SemanticObjectVH.open();
				},
				readSemanticObjects: function (thisObj) {
					var sUriSemObj = "/FioriActualSet";
					var oModel = thisObj.getView().getModel("Gemini");
					var aSemObj = [];
					var aFioriActuals = [];
					thisObj.oModel
						.read(
							sUriSemObj, {
								success: function (oResponse) {
									aFioriActuals = oResponse.results;
									for (var i = 0; i < aFioriActuals.length; i++) {
										aSemObj[i] = aFioriActuals[i].SemanticObject;
									}
									aSemObj = thisObj
										.fnUnique(aSemObj);
									thisObj.oTable
										.setProperty(
											"/fioriSemanticObjVH",
											aSemObj);
									thisObj.oTable
										.setProperty(
											"/fioriActualsData",
											oResponse.results);

								},
								error: function () {

								}
							});

				},

				semanticObjectValueHelpClose: function (oEvent) {

					var oSelectedObject = oEvent.getParameter(
						"selectedItem").getTitle();
					var oModel = this.getView().getModel("Gemini");
					var aFiori = oModel.getProperty("/fiori");
					var aFioriActuals1 = oModel
						.getProperty("/fioriActualsData");

					var newFioriItems = [];
					var currentFioriItems = [];
					newFioriItems = aFioriActuals1
						.filter(function (data) {
							return (data.SemanticObject === oSelectedObject);
						});
					currentFioriItems = aFiori
						.filter(function (data) {
							return (data.SemanticObject == oSelectedObject);
						});

					for (var i = 0; i < newFioriItems.length; i++) {
						var found = false;
						for (var j = 0; j < currentFioriItems.length; j++) {
							if ((newFioriItems[i].FioriID === currentFioriItems[j].FioriID && newFioriItems[i].SemanticObject === currentFioriItems[j].SemanticObject)) {
								found = true;
							}
						}
						if (!found) {
							var a = {};
							a.AppName = newFioriItems[i].AppName;
							a.AppType = newFioriItems[i].AppType;
							a.FioriID = newFioriItems[i].FioriID;
							a.SapObjectType = this.sObj;
							a.SemanticAction = newFioriItems[i].SemanticAction;
							a.SemanticObject = newFioriItems[i].SemanticObject;
							a.UITechnology = newFioriItems[i].UITechnology;
							aFiori.unshift(a);
						}
					}

					oModel.refresh(true);
					if (currentFioriItems.length === newFioriItems.length) {
						var oBundle = this.getView().getModel("i18n")
							.getResourceBundle();
						MessageBox.error(oBundle.getText("noFioriApp"));
					}

				},
				handleFioriSave: function (oEvent) {

					var intialForiModel = oEvent.ofioriTempModel;
					var oModel = oEvent.getView().getModel("Gemini");
					var fioriModelTemp = oModel.getProperty("/fiori");
					// For creation of entries
					for (var i = 0; i < oEvent.oTable
						.getProperty("/fiori").length; i++) {
						var atemp = intialForiModel
							.filter(function (x) {
								return (fioriModelTemp[i].FioriID === x.FioriID && fioriModelTemp[i].SemanticObject === x.SemanticObject);
							});
						if (atemp.length === 0) {
							oEvent.oModel
								.create(
									"/I_SBRFIORIACTLS",
									fioriModelTemp[i], {
										groupId: oEvent.sDeferredGroup,
										success: function () {

										},
										error: function () {

										}
									});
						}
					}
					for (var i = 0; i < intialForiModel.length; i++) {
						var atemp = fioriModelTemp
							.filter(function (x) {
								return (intialForiModel[i].FioriID === x.FioriID && intialForiModel[i].SemanticObject === x.SemanticObject);
							});
						if (atemp.length === 0) {
							oEvent.oModel
								.remove(
									"/I_SBRFIORIACTLS(SapObjectType='" + oEvent.sObj + "',FioriID='" + encodeURIComponent(intialForiModel[i].FioriID) +
									"',SemanticObject='" + encodeURIComponent(intialForiModel[i].SemanticObject) + "')", {
										groupId: oEvent.sDeferredGroup,
										success: function () {

										},
										error: function () {

										}
									});
						}
					}

				},
				fnFioriDisplayMode: function (oEvent) {
					oEvent.getView().byId("TableFioriDisplay")
						.setVisible(true);
					oEvent.getView().byId("TableFioriEdit").setVisible(
						false);
					oEvent.getView().byId("addFioriApp").setVisible(
						false);
					oEvent.getView().byId("TableFioriEdit").setMode(
						sap.m.ListMode.none);

				},
				handleFioriCancel: function (oEvent) {
					oEvent.getView().byId("TableFioriDisplay")
						.setVisible(true);
					oEvent.getView().byId("TableFioriEdit").setVisible(
						false);
					oEvent.getView().byId("addFioriApp").setVisible(
						false);
					oEvent.getView().byId("TableFioriEdit").setMode(
						sap.m.ListMode.none);
					oEvent.oTable.setProperty("/fiori",
						oEvent.ofioriTempModel);
					oEvent.getView().getModel("Gemini").refresh(true);
				}

			};
			return s4.cfnd.geminiobjectpage.controller.Fiori;

		});