var args = arguments[0] || {};

$.addressFilter.addEventListener('click', function() {

	Alloy.Globals.API.getAllCategories(function(results) {

		var popupDialog = Alloy.createWidget('ti.ux.popup.list', 'widget', {
			closeButton : true,
			selectable : true,
			options : results,
		});

		popupDialog.getView('table').addEventListener('click', function(e) {

			$.addressLabel.text = e.row.data.title;
			popupDialog.hide();
		});

		popupDialog.getView().show();
	}, function(error) {

	});
}); 

Ti.API.error(args);

$.orderFromName.text = args.maindata.orderFrom;

$.orderItemTotal.text = "Item total";
$.orderItemTotalPrice.text = "$84.40";

$.orderShipping.text = "Shipping";
$.orderShippingPrice.text = "$3.20";

$.orderTax.text = "Tax";
$.orderTaxPrice.text = "$0.00";

$.orderTotal.text = "Order Total";
$.orderTotalPrice.text = "$87.60";
