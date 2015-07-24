var args = arguments[0] || {};

$.orderPhoto.image = args.image;
$.orderTitle.text = args.product;
$.orderQuantity.text = args.quantity + ' ' + args.qty;
$.orderSubPrice.text = $.orderPrice.text = args.price + ' ' + args.currency;
$.orderBrand.text = args.brand;
$.orderCondition.text = args.condition;
$.orderSize.text = "Size: " + args.size;

$.orderEdit.addEventListener('click', function() {

	var opts = {
		cancel : 1,
		options : ['Delete', 'Cancel'],
		selectedIndex : 2,
		destructive : 0,
	};

	var dialog = Ti.UI.createOptionDialog(opts);
	
	dialog.addEventListener('click', function(e) {
		
		if (e.index == 0) {
			
			Alloy.Globals.loading.show();
			
			Alloy.Globals.API.deleteFromCart(args.contentId, args.cartId, function(result) {
				
				args.parentUpdate();
				
				Alloy.Globals.loading.hide();
			}, function(error) {
				
				Alloy.Globals.loading.hide();
				alert('There was an error removing the item from your cart.');
			});
		}
	});
	
	dialog.show();
});
