var args = arguments[0] || {};

Alloy.Globals.loading.show();

var productArray = [];

for (var i in args.pins) {

	Ti.API.info(args[i]);
	productArray.push(Alloy.createController('product/productRow', args.pins[i]).getView());
}

if (productArray.length == 0) {

	productArray.push(Ti.UI.createTableViewRow({
		title : 'No results.'
	}));
}

$.boardPinsTable.setData(productArray);

Alloy.Globals.loading.hide();
