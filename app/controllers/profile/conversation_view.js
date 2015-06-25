var args = arguments[0] || {};

Alloy.Globals.loading.show();

Alloy.Globals.API.getMessageList(function(results) {

	var tableData = [];

	for (var i in results) {
	
		tableData.push(Alloy.createController('profile/messageRow', results[i]).getView());
	}

	$.conversationTable.setData(tableData);
	Alloy.Globals.loading.hide();
}, function(error) {

	Alloy.Globals.loading.hide();
});

// hack for avoiding the separators when the table is empty or has fewer rows
var tblFooterView = Ti.UI.createView({
	width : 300,
	height : 1,
	backgroundColor : '#FFF'
});

$.conversationTable.footerView = tblFooterView;

