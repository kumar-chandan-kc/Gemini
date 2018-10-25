jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
jQuery.sap.require("sap.ui.qunit.qunit-coverage");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"GeminiSmartTemplate/test/integration/pages/Common",
	"GeminiSmartTemplate/test/integration/pages/ListReport",
	"sap/ui/test/opaQunit"
], function(Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "sap.suite.ui.generic.template.ListReport.view."
	});
sap.ui.require([
		"GeminiSmartTemplate/test/integration/ListReportJourney"
		], function() {
		QUnit.start();
	});
	
});