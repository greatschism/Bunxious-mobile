var args = arguments[0] || {};
var moment = require('alloy/moment');

function compareMilli(a, b) {
		if (moment(a.date_modified).unix() < moment(b.date_modified).unix())
			return 1;
		if (moment(a.date_modified).unix() > moment(b.date_modified).unix())
			return -1;
		return 0;
	}

Alloy.Globals.API.getPurchases(function(results) {
	
	var tableData = [];

	var results = results.Data[0];

	if (_.isObject(results)) {

	results.sort(compareMilli);
	
	for (var i in results) {
		tableData.push(Alloy.createController('profile/orderRow', results[i]).getView());
	}
	
	$.ordersTable.setData(tableData);

	} else {

		tableData.push(Alloy.createController('profile/orderRow', {}).getView());
		$.ordersTable.setData(tableData);

	}
	
}, function(error) {
	
});

// hack for avoiding the separators when the table is empty or has fewer rows
var tblFooterView = Ti.UI.createView({
  width: 300,
  height: 1,
  backgroundColor: '#FFF'
});
 
$.ordersTable.footerView = tblFooterView;