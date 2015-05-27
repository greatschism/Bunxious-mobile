var args = arguments[0] || {};

// Alloy.createController('cart/orderItem').getView().open();

Alloy.Globals.API.getCart(function(result) {
	
	 Ti.API.info(result);
	 
	 if (result.message && result.message == "Cart Empty") {
	 	
	 	$.container.add(Ti.UI.createLabel({
	 		text : L('cart_empty'),
	 		top : '25dp',
	 		center : {
	 			x : '50%'
	 		}
	 	}));
	 }
	 else {
	 	
	 	if (result.data.length > 0) {
	 		
	 		for (var i in result.data) {
	 			
		 		$.container.add(Alloy.createController('cart/order', result.data[i]).getView());
	 		}
	 	}
	 }
}, function(error) {
	
	Ti.API.error(error);
});