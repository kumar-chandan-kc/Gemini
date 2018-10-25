/*global s4:true*/

jQuery.sap.declare("s4.cfnd.geminiobjectpage.controller.Handler");

s4.cfnd.geminiobjectpage.controller.Handler =
 
	{
	  pointer: null,

		setPointer: function(pointerOfWorklist) {
			this.pointer = pointerOfWorklist;
		},
		onRefresh: function() {
			var oTable = this.pointer.byId("table");
			oTable.getBinding("items").refresh();
		}

	};