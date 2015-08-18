var args = arguments[0] || {};
$.pinImage.image = args.img.image;
$.avatar.image = args.avatar;
$.title.text = args.pin.title.trim();
$.description.text = args.pin.description.trim();
$.price.text = String.formatCurrency(args.pin.price);


$.pinImage.addEventListener('click', function(e) {
	// console.debug('closet row product/pin_view args ', JSON.stringify(args));
	
	// var data = args.pin;
	// data.image_big = args.img;
	
	Alloy.Globals.openWindow('product/pin_view', {
		pin_id : args.pin.id,
		user_id : args.pin.user_id
	}, true);

});

if (args.pin.liked) {
	$.heartButton.backgroundColor = '#27ae60';
}

$.heartButton.addEventListener('click', function() {
	// console.debug('closet row product/pin_view args.pin ', JSON.stringify(args.pin));

	Alloy.Globals.API.togglePinLike(args.pin.id, function(result) {

		if (result.status == 'success' && result.action == "like") {
			$.heartButton.backgroundColor = '#27ae60';
		} else if (result.status == 'success' && result.action == "unlike") {
			$.heartButton.setBackgroundColor('#f26b1d');
		}
	});
}); 

$.editButton.addEventListener('click', function() {
	Alloy.Globals.openWindow('product/add_view', args, true);
});
