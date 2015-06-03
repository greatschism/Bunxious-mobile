var args = arguments[0] || {};

$.addressFilter.addEventListener('click', function() {
	
	var addressesArray = [];
	
	for (var i in args.addresses) {
		
		addressesArray.push(args.addresses[i].alias);
	}

	var popupDialog = Alloy.createWidget('ti.ux.popup.list', 'widget', {
		closeButton : true,
		selectable : true,
		options : addressesArray,
	});

	popupDialog.getView('table').addEventListener('click', function(e) {

		$.addressLabel.text = e.row.data.title;
		popupDialog.hide();
	});

	popupDialog.getView().show();
});

for (var i in args.maindata) {

	$.container.add(Alloy.createController('cart/item', args.maindata[i]).getView());
}

Ti.API.error(args);

$.orderFromName.text = args.maindata[0].orderFrom;

$.orderItemTotal.text = "Item total";
$.orderItemTotalPrice.text = "$" + parseFloat(args.sub_total).toFixed(2);

$.orderShipping.text = "Shipping";
$.orderShippingPrice.text = "$" + parseFloat(args.shipping).toFixed(2);

$.orderTax.text = "Tax";
$.orderTaxPrice.text = "$0.00";

$.orderTotal.text = "Order Total";
$.orderTotalPrice.text = "$" + parseFloat(args.total).toFixed(2);
