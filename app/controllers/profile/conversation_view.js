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

// $.row.addEventListener('longpress', function() {
// 
	// var dialog = Ti.UI.createOptionDialog({
		// cancel : 2,
		// options : ['Delete', 'Cancel'],
		// selectedIndex : 1,
		// destructive : 0,
	// });
// 
	// dialog.addEventListener('click', function(event) {
// 
		// if (event.index == 0) {
// 
			// Alloy.Globals.API.deleteConversation(args.conversation, function(result) {
// 
// 				
			// }, function(error) {
				// //TBD
			// });
		// }
	// });
// 
	// dialog.show();
// });

// hack for avoiding the separators when the table is empty or has fewer rows
var tblFooterView = Ti.UI.createView({
  width: 300,
  height: 1,
  backgroundColor: '#FFF'
});
 
$.conversationTable.footerView = tblFooterView;