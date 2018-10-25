sap.ui.define([
		"s4/cfnd/geminiobjectpage/controller/Object.controller",
		//            "s4/cfnd/geminiobjectpage/controller/API",
		"sap/ui/base/ManagedObject",
		"sap/ui/core/Control",
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/json/JSONModel",
		"sap/ui/model/odata/ODataModel",
		"sap/ui/thirdparty/sinon",
		"sap/ui/thirdparty/sinon-qunit"

	],

	function(ObjectController, ManagedObject, Control, Controller, JSONModel) {
		QUnit.module("ObjectController - test methods", {
			beforeEach: function() {

			},
			afterEach: function() {

			}
		});
		QUnit.test("fnComment", function(assert) {
			var oAppController = new ObjectController();
			var expectedResult = [{
				"createdat": "25.10.2017 18:30:53",
				"createdby": "JAYANNAGOWDA",
				"statuscomments": "test1"
			}, {
				"createdat": "25.10.2017 18:31:09",
				"createdby": "JAYANNAGOWDA",
				"statuscomments": "test2"
			}];

			var comment = "|test1^JAYANNAGOWDA^25.10.2017 18:30:53|test2^JAYANNAGOWDA^25.10.2017 18:31:09";
			var oControllerStub = {};
			var fn = oAppController.fnComment.bind(oControllerStub);
			var result = fn(comment);

			assert.equal(JSON.stringify(result), JSON.stringify(expectedResult), "comment");

		});
		QUnit.test("fnContains", function(assert) {
			var oAppController = new ObjectController();
			var value = "Hello";
			var objarr1 = [{
				value: "Hello",
				v2: "world"
			}];
			var objarr2 = [{
				value: "abc",
				v2: "world"
			}];
			var oControllerStub = {};
			var fn = oAppController.fnContains.bind(oControllerStub);
			var result1 = fn(value, objarr1);
			var result2 = fn(value, objarr2);
			assert.equal(result1, true, "Passed");
			assert.equal(result2, false, "Passed");

		});
		// QUnit.test("fnUnique", function(assert)
		// {
		//            var oAppController = new ObjectController();
		//            var objArr = {
		//                            value: "Hello",
		//                            v1: "Hello",
		//                            v2: "World"
		//            };
		//            var oControllerStub = {};
		//            var fn = oAppController.fnUnique.bind(oControllerStub);
		//            var result = fn(objArr);
		//            var expectedRes = {
		//                            value: "Hello",
		//                            v2: "World"
		//            };
		//   assert.equal(result, expectedRes, "Contains Work");
		// });
		QUnit.test("fnEventEditable", function(assert) {
			var oAppController = new ObjectController();
			var status = "1";
			var aStatus = "0";
			var changeType = 'Not Relevant';
			var sEvent = "CHANGED";

			var oView = {
				events: [],
				eventIdHelp: ["CHANGED", "ASSIGNED"]
			};
			var oControllerStub = {
				oTable: new sap.ui.model.json.JSONModel(oView),
			};
			var fn = oAppController.fnEventEditable.bind(oControllerStub);
			var result = fn(status, changeType, sEvent);
			var result1 = fn(aStatus, changeType, sEvent);
			assert.equal(result, false, "event value help working");
			assert.equal(result1, false, "event value help working");

		});
		QUnit.test("fnOutputActualsEditable", function(assert) {
			var oAppController = new ObjectController();
			var oViewOut = {
				aOutObjs: [{
					sap_bo_type: "GeminiDemo2",
					area: this.sArea,
					application_object: "",
					output_type: "",
					target_release: "",
					actual_release: "",
					description: "",
					status: "",
					mapped_output_object: "",
					mapped_application_object: "Qunit",
					changeType: "New",
					status_colour: "",
					status_icon: "",
					tool_tip: "",
					omid: "40f2e9af-be89-2ee7-abb0-00b7d3146c56",
					jira_backlog: "",
					jira_backlog_link: "",
					jira_valid: '1'
				}],
				aChangeType: []
			};
			var outObj = "";
			var outObj1 = "Qunit";
			var getmodel = {
				getModel: function(sName) {
					if (sName === "geminioutput") {
						return new sap.ui.model.json.JSONModel(oViewOut);
					}
				}
			};
			var oControllerStub = {
				getView: function() {
					return getmodel;
				}
			};
			var fn = oAppController.fnOutputActualsEditable.bind(oControllerStub);
			var result = fn(outObj);
			var result1 = fn(outObj1);
			assert.equal(result, true, "Output");
			assert.equal(result1, false, "Output");
		});

	});