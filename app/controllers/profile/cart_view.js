var args = arguments[0] || {};

Alloy.Globals.loading.show();

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
	 
	 Alloy.Globals.loading.hide();
}, function(error) {
	
	Alloy.Globals.loading.hide();
});