var args = arguments[0] || {};
$.pinImage.image = args.img.image;
$.avatar.image = args.avatar;
$.title.text = args.pin.title.trim();
$.description.text = args.pin.description.trim();
$.price.text = String.formatCurrency(args.pin.price);


$.pinImage.addEventListener('click', function(e) {
	
	Alloy.Globals.openWindow('product/pin_view', {
		pin_id : args.pin.id,
		user_id : args.pin.user_id
	}, true);

});

if (args.pin.liked) {
	$.heartButton.backgroundColor = '#27ae60';
}

if (Alloy.Globals.currentUser && Alloy.Globals.currentUser.user_info.id == args.pin.user_id) {
	
	$.heartButton.visible = false;
	$.boxButton.visible = false;
}

$.heartButton.addEventListener('click', function() {

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
