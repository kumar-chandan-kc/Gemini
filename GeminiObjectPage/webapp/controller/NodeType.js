/*global s4:true*/

jQuery.sap.declare("s4.cfnd.geminiobjectpage.controller.NodeType");
sap.ui.define(["sap/m/MessageBox"], function(MessageBox) {
	"use strict";

	s4.cfnd.geminiobjectpage.controller.NodeType = {
			onCheckNodeTypeSave: function(pointer) {
				pointer.aUpdateNodeType = [];
				var aNodeTypeTemp = pointer.oTable.getProperty("/NodeTypeTemp");
				var aNodeType = $.extend(true,[],pointer.oTable.getProperty("/nodetype"));
				for (var iIndex=0; iIndex < aNodeType.length ; iIndex++ ){
					if (JSON.stringify( aNodeType[iIndex] ) !== JSON.stringify ( aNodeTypeTemp[iIndex] ) ) {
						if(aNodeType[iIndex].RepresentativeView !== aNodeTypeTemp[iIndex].RepresentativeView)
						{	
							aNodeType[iIndex].RepresentativeViewRelease = pointer.final;
						}
						
						if(aNodeType[iIndex].ValueHelpView !== aNodeTypeTemp[iIndex].ValueHelpView)
						{
							aNodeType[iIndex].ValueHelpViewRelease = pointer.final;
						}
							
						pointer.aUpdateNodeType.push(aNodeType[iIndex]);
					}
				}
				
				
			},
	fnOnSaveNodeType: function(pointer)
	{
		for (var iIndex=0; iIndex < pointer.aUpdateNodeType.length ; iIndex++ ){
		pointer.oModel.update("/ I_SBRSAPOBJECTNODETYPE('" + pointer.aUpdateNodeType[iIndex].object_node_type + "')", pointer.aUpdateNodeType[iIndex], {
			groupId: pointer.sDeferredGroup,
			success: function() {

				// console.log("Success");

			},
			error: function() {
				// console.log("Error");
			}
		});
		}
	},			
			
	
	fnNodeTypeCDSEditable : function(NodeTypeCDSRelease){
		
		 if (sap.ui.view.Gemini.model === undefined ) {
             return false;
      }
		 else{
		var sCurrentRelease = sap.ui.view.Gemini.model.getProperty("/currentRelease");
		
		if ( ( NodeTypeCDSRelease === '' ) ||  ( NodeTypeCDSRelease === sCurrentRelease ) ){
		 return true ;		
		} else {
			return false ;
		}
		 }
		
	},
	
	onValueHelpRequestNodeTypeCDS: function(oEvent) {
		this.ipIdNodeTypeCDS = oEvent.getSource().getId();
		if (!this.NodeTypeCDSValueHelp) {
			this.NodeTypeCDSValueHelp = sap.ui.xmlfragment("s4.cfnd.geminiobjectpage.view.NodeTypeCDSValueHelp", this);
			this.getView().addDependent(this.NodeTypeCDSValueHelp);
		}
		jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this.NodeTypeCDSValueHelp);
		this.NodeTypeCDSValueHelp.open();
		if (this.NodeTypeCDSValueHelp) {
			var searchField = sap.ui.getCore().byId("NodeTypeCDSValueHelp-list");
			searchField.addEventDelegate({
				onfocusin: function() {
					sap.ui.getCore().byId("NodeTypeCDSValueHelp-searchField").focus();
				}
			}, this);

		}

	},
	fnHandleValueHelpSearchNodeTypeCDS: function(oEvent) {
		var sQuery = oEvent.getSource()._sSearchFieldValue;

		var aFilter = new sap.ui.model.Filter({
			filters: [
				new sap.ui.model.Filter("sub_key", sap.ui.model.FilterOperator.Contains, sQuery)
			],
			and: true
		});
		oEvent.getSource().getBinding("items").filter([aFilter]);

	}
	

		
	};
	return s4.cfnd.geminiobjectpage.controller.NodeType;

});