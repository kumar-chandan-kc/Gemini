sap.ui.define([ 
		"s4/cfnd/geminiobjectpage/controller/BaseController"
	], function (BaseController) {
		"use strict";
 
		return BaseController.extend("s4.cfnd.geminiobjectpage.controller.NotFound", {

			/**
			 * Navigates to the worklist when the link is pressed
			 * @public
			 */
			onLinkPressed : function () {
				this.getRouter().navTo("worklist");
			}

		});

	}
);