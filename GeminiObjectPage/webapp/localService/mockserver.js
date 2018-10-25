sap.ui
		.define(
				[

				"sap/ui/core/util/MockServer" ],
				function(MockServer) {
					"use strict";
					var oMockServer, _sAppModulePath = "s4/cfnd/geminiobjectpage/", _sJsonFilesModulePath = _sAppModulePath
							+ "localService/mockdata";

					return {

						/**
						 * Initializes the mock server. You can configure the
						 * delay with the URL parameter "serverDelay". The local
						 * mock data in this folder is returned instead of the
						 * real data for testing.
						 * 
						 * @public
						 */
						init : function() {
							var oUriParameters = jQuery.sap.getUriParameters(), sJsonFilesUrl = jQuery.sap
									.getModulePath(_sJsonFilesModulePath), sManifestUrl = jQuery.sap
									.getModulePath(
											_sAppModulePath + "manifest",
											".json"), sEntity = "I_SBRCloudQuality", sErrorParam = oUriParameters
									.get("errorType"), iErrorCode = sErrorParam === "badRequest" ? 400
									: 500, oManifest = jQuery.sap
									.syncGetJSON(sManifestUrl).data, oMainDataSource = oManifest["sap.app"].dataSources.mainService, sMetadataUrl = jQuery.sap
									.getModulePath(_sAppModulePath
											+ oMainDataSource.settings.localUri
													.replace(".xml", ""),
											".xml"),
							// ensure there is a trailing slash
							sMockServerUrl = /.*\/$/.test(oMainDataSource.uri) ? oMainDataSource.uri
									: oMainDataSource.uri + "/";

							oMockServer = new MockServer({
								rootUri : sMockServerUrl
							});

							// configure mock server with a delay of 1s
							MockServer.config({
								autoRespond : true,
								autoRespondAfter : (oUriParameters
										.get("serverDelay") || 1000)
							});

							// load local mock data
							oMockServer.simulate(sMetadataUrl, {
								sMockdataBaseUrl : sJsonFilesUrl,
								bGenerateMissingMockData : true
							});

							var aRequests = oMockServer.getRequests(), fnResponse = function(
									iErrCode, sMessage, aRequest) {
								aRequest.response = function(oXhr) {
									oXhr
											.respond(
													iErrCode,
													{
														"Content-Type" : "text/plain;charset=utf-8"
													}, sMessage);
								};
							};

							aRequests
									.push({
										method : "GET",
										path : new RegExp("JiraValidation\?JiraBacklogId='CFNDGEMINI-xyz'"),
										response : function(oXhr) {
											jQuery.sap.log
													.debug("JIRA Backlog");
											var oResponse = jQuery.sap
													.sjax({
														url : "../localService/mockdata/JiraValidationFalse.json"
													});
											oXhr.respondJSON(200, {}, JSON
													.stringify(oResponse.data));
											return true;
										}
									});
							aRequests.push({
		                        method : "GET",
		                        path : new RegExp("TRCheckLockedObject(.*)"),
		                        response : function(oXhr) {
		                              jQuery.sap.log.debug("Get KPI Count");
		                              var oResponse = jQuery.sap.sjax({
		                                    url : "../localService/mockdata/TRCheckLockedObjectResponseCollection.json"
		                              });
		                              oXhr.respondJSON(200, {}, JSON.stringify(oResponse.data[0]));
		                              return true;
		                        }
		                  });
							aRequests
									.push({
										method : "GET",
										path : new RegExp("JiraValidation\?JiraBacklogId='CFNDGEMINI-119'"),
										response : function(oXhr) {
											jQuery.sap.log.debug("JIRA Backlog");
											var oResponse = jQuery.sap
													.sjax({
														url : "../localService/mockdata/JiraValidationTrue.json"
													});
											
											oXhr.respondJSON(200, {}, JSON
													.stringify(oResponse.data));
											return true;
										}
									});

							aRequests
									.push({
										method : "GET",
										path : new RegExp(
												"JiraValidation\?JiraBacklogId='APIREQ-369'"),
										response : function(oXhr) {
											jQuery.sap.log
													.debug("JIRA Backlog");
											var oResponse = jQuery.sap
													.sjax({
														url : "../localService/mockdata/APIJiraValidationTrue.json"
													});
											oXhr.respondJSON(200, {}, JSON
													.stringify(oResponse.data));
											return true;
										}
									});
							oMockServer.setRequests(aRequests);

							// handling the metadata error test
							if (oUriParameters.get("metadataError")) {
								aRequests.forEach(function(aEntry) {
									if (aEntry.path.toString().indexOf(
											"$metadata") > -1) {
										fnResponse(500, "metadata Error",
												aEntry);
									}
								});
							}

							// Handling request errors
							if (sErrorParam) {
								aRequests
										.forEach(function(aEntry) {
											if (aEntry.path.toString().indexOf(
													sEntity) > -1) {
												fnResponse(iErrorCode,
														sErrorParam, aEntry);
											}
										});
							}

							oMockServer.start();

							jQuery.sap.log
									.info("Running the app with mock data");
						},

						/**
						 * @public returns the mockserver of the app, should be
						 *         used in integration tests
						 * @returns {sap.ui.core.util.MockServer} the mockserver
						 *          instance
						 */
						getMockServer : function() {
							return oMockServer;
						}
					};

				});