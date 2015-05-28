var args = arguments[0] || {};

if (Alloy.Globals.currentUser && Alloy.Globals.currentUser.user_info.id) {

	Alloy.Globals.loading.show();
	
	Alloy.Globals.API.findLikes(Alloy.Globals.currentUser.user_info.id, function(results) {

		var productArray = [];

		for (var i in results) {

			productArray.push(Alloy.createController('product/productRow', results[i]).getView());
		}

		if (results.length == 0) {

			productArray.push(Ti.UI.createTableViewRow({
				title : 'No results.'
			}));
		}
		
		$.itemLikesTable.setData(productArray);
		
		Alloy.Globals.loading.hide();
	}, function(error) {
		
		Alloy.Globals.loading.hide();
	});
} 