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

		Alloy.Globals.openWindow('product/pin_view', {
			pin_id : args.id,
			user_id : args.user_id
		}, true);
	});

	if (args.liked) {

		$.heartButton.backgroundColor = '#27ae60';
	}

	$.heartButton.addEventListener('click', function() {

		Alloy.Globals.API.togglePinLike(args.id, function(result) {

			if (result.status == 'success' && result.action == "like") {

				$.heartButton.backgroundColor = '#27ae60';
			} else if (result.status == 'success' && result.action == "unlike") {

				$.heartButton.backgroundColor = '#f26b1d';
			}
		});
	});

	$.boxButton.addEventListener('click', function() {

		if (Alloy.Globals.currentUser.boards && Alloy.Globals.currentUser.boards.length > 0) {

			Alloy.Globals.openWindow('product/pin_repin', args, true);
		} else {

			alert('You don\'t have any boards');
		}
	});
}
