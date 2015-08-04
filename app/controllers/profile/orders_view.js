var args = arguments[0] || {};

Alloy.Globals.API.getPurchases(function(results) {
	
	var tableData = [];

	console.log(results);

	var results = results.Data[0];
	
	for (var i in results) {
		tableData.push(Alloy.createController('profile/orderRow', results[i]).getView());
	}
	
	$.ordersTable.setData(tableData);
	
}, function(error) {
	
});

// hack for avoiding the separators when the table is empty or has fewer rows
var tblFooterView = Ti.UI.createView({
  width: 300,
  height: 1,
  backgroundColor: '#FFF'
});
 
$.ordersTable.footerView = tblFooterView;