var args = arguments[0] || {};

if (args) {
	
	$.pinImage.image = args.image_big.image;
	$.avatar.image = args.user.avatar_medium.image;
	$.title.text = args.title;
	$.description.text = args.description.replace('\r', '').replace('\n', '');
	//stripping new lines
	$.price.text = Alloy.Globals.Utils.codeToCurrency(args.currency_code) + args.price;

	$.avatar.addEventListener('click', function() {

		Alloy.Globals.openWindow('profile/profile_view', {
			user_id : args.user_id
		}, true);
	});

	$.pinImage.addEventListener('click', function() {

		Alloy.Globals.openWindow('product/pin_view', args, true);
	});
}
