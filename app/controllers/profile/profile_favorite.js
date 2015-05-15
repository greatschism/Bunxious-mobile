var args = arguments[0] || {};

$.favLabel.text = L("favorite_items");

Alloy.Globals.API.findLikes(args.id, function(results) {

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
}); 