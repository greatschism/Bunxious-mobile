var args = arguments[0] || {};

Alloy.Globals.loading.show();

function postLayout() {
	$.scrollview.setHeight($.scrollview.rect.height - 25);
	$.scrollview.removeEventListener('postlayout', postLayout);
}

if (Titanium.Platform.osname == "android") {
	$.scrollview.addEventListener('postlayout', postLayout);
}

function loadData() {
	
	$.container.removeAllChildren();

	Alloy.Globals.API.getCart(function(result) {

		if (result.message && result.message == "Cart Empty") {

			$.container.add(Ti.UI.createLabel({
				text : L('cart_empty'),
				top : '25dp',
				center : {
					x : '50%'
				}
			}));
		} else {

			if (result.data.length > 0) {

				for (var i in result.data) {

					// passing along cartId
					result.data[i].cartId = result.cartId;
					
					// passing along the loadData function to avoid events
					result.data[i].parentUpdate = loadData;

					$.container.add(Alloy.createController('cart/order', result.data[i]).getView());
				}
			}
		}

		Alloy.Globals.loading.hide();
	}, function(error) {

		Alloy.Globals.loading.hide();
	});
}

loadData();
