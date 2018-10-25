jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false; 


sap.ui.require([
	"sap/ui/test/Opa5",
	"s4/cfnd/geminiobjectpage/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"s4/cfnd/geminiobjectpage/test/integration/pages/Worklist",
	"s4/cfnd/geminiobjectpage/test/integration/pages/Object",
	"s4/cfnd/geminiobjectpage/test/integration/pages/NotFound",
	"s4/cfnd/geminiobjectpage/test/integration/pages/Browser",
	"s4/cfnd/geminiobjectpage/test/integration/pages/App",
	"s4/cfnd/geminiobjectpage/test/integration/pages/Main",
	"s4/cfnd/geminiobjectpage/test/integration/pages/API",
	"s4/cfnd/geminiobjectpage/test/integration/pages/Output"
], function(Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "s4.cfnd.geminiobjectpage.view."
	});

	sap.ui.require([
		
		"s4/cfnd/geminiobjectpage/test/integration/WorklistJourney",
		"s4/cfnd/geminiobjectpage/test/integration/APIJourney",
		"s4/cfnd/geminiobjectpage/test/integration/MigrationJourney",
		"s4/cfnd/geminiobjectpage/test/integration/FioriJourney",
		"s4/cfnd/geminiobjectpage/test/integration/EventsJourney",
		"s4/cfnd/geminiobjectpage/test/integration/SearchJourney",
		"s4/cfnd/geminiobjectpage/test/integration/OutputObjectJourney",
		"s4/cfnd/geminiobjectpage/test/integration/ExtensionsJourney"
		// "s4/cfnd/geminiobjectpage/test/integration/NodeTypeJourney"
		// "s4/cfnd/geminiobjectpage/test/integration/NavigationJourney"
		// //s4/cfnd/geminiobjectpage/test/integration/CDSJourney"
		// //"s4/cfnd/geminiobjectpage/test/integration/ObjectJourney",
		// //"s4/cfnd/geminiobjectpage/test/integration/NotFoundJourney"
		// //"s4/cfnd/geminiobjectpage/test/integration/FLPIntegrationJourney"

	], function() {
		QUnit.start();
	});
});