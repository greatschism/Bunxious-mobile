var args = arguments[0] || {};

Alloy.Globals.API.getMessages(function(results) {
	
	var tableData = [];
	
	for (var i in results.data) {
		
		tableData.push(Alloy.createController('profile/messageRow', results.data[i]).getView());
	}
	
	$.conversationTable.setData(tableData);
	
}, function(error) {
	
});

// hack for avoiding the separators when the table is empty or has fewer rows
var tblFooterView = Ti.UI.createView({
  width: 300,
  height: 1,
  backgroundColor: '#FFF'
});
 
$.conversationTable.footerView = tblFooterView;