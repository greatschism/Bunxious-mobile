var args = arguments[0] || {};

var pinUserId = '',
    username = '',
    avatarImage = '';

function displayPin() {

	Ti.API.info('args: ' + JSON.stringify(args));

	$.pinImage.image = args.image_big.image;
	$.title.text = args.title;
	
	if (args.currency_code){
		$.price.text = Alloy.Globals.Utils.codeToCurrency(args.currency_code) + args.price + ' ' + args.currency_code.toUpperCase();
	} else {
		$.price.text = '$' + args.price + ' ' + 'USD';
	}

	$.brand.text = 'BRAND: ' + args.brand_id;
	$.size.text = 'SIZE: Not yet defined';
	$.condition.text = 'CONDITION: ' + args.condition_id;
	$.description.value = 'Description: ' + args.description;
	$.shipping.text = '    SHIPPING FROM ' + args.from;

	$.shipToOut.text = 'United States';
	$.shipCostOut.text = '$6.50 USD';
	$.shipWithOut.text = '$1.00 USD';

	Alloy.Globals.API.getUser(args.user_id, function(result) {

		username = result.firstname + ' ' + result.lastname;
		avatarImage = result.avatar_small.image;

		$.avatar.image = result.avatar_medium.image;
		$.userName.text = result.firstname + ' ' + result.lastname;

		if (result.city && result.country_iso_code_3) {

			$.userLocation.text = result.city + ', ' + result.country_iso_code_3;
		} else if (result.city || result.country_iso_code_3) {

			$.userLocation.text = result.city || result.country_iso_code_3;
		}

		pinUserId = result.id;

		if (!Alloy.Globals.currentUser || Alloy.Globals.currentUser.user_info.id != result.id) {
			$.followButton.visible = true;
			$.contactButton.visible = true;

			if (result.following_user) {
				$.follow.setText(L('unfollow'));
			}
		}
	});

	if (args.liked) {

		$.heartButton.backgroundColor = '#27ae60';
	}

}

displayPin();

$.boxButton.addEventListener('click', function() {

	if (Alloy.Globals.currentUser) {
		if (Alloy.Globals.currentUser.boards || Alloy.Globals.currentUser.boards.length > 0) {

			Alloy.Globals.openWindow('product/pin_repin', args, true);
		} else {

			alert('You don\'t have any boards');
		}
	} else {
		alert('Please login first.');
	}
});

$.heartButton.addEventListener('click', function() {

	if (Alloy.Globals.currentUser) {
		Alloy.Globals.API.togglePinLike(args.id, function(result) {

			if (result.status == 'success' && result.action == "like") {

				$.heartButton.backgroundColor = '#27ae60';
			} else if (result.status == 'success' && result.action == "unlike") {

				$.heartButton.backgroundColor = '#f26b1d';
			}
		});
	} else {
		alert('Please login first.');
	}
});

if (!Alloy.Globals.currentUser || Alloy.Globals.currentUser.user_info.id != pinUserId) {
	$.followButton.addEventListener('click', function(e) {

		if (Alloy.Globals.currentUser) {
			Alloy.Globals.API.follow(pinUserId, function(response) {
				// console.debug("follow-unfollow response ", JSON.stringify(response));

				if (response.isFollow) {
					$.follow.setText(L('unfollow'));
				} else {
					$.follow.setText(L('follow'));
				}
			});
		} else {
			alert('Please login first.');
		}
	});

	$.contactButton.addEventListener('click', function(e) {

		if (Alloy.Globals.currentUser) {
			var data = {
				to_user_id : pinUserId,
				name : username,
				avatar : avatarImage
			};

			Alloy.Globals.openWindow('profile/message_view', data, true);
		} else {
			alert('Please login first.');
		}
	});
}

Alloy.Globals.API.getCloset(args.user_id, function(result) {

	$.closetAvatar.setImage(result.cover.image);
	$.closetTitle.setText(result.Shop.title);
	$.closetDescription.setValue(result.Shop.description);

	for (i in result.MyPins.pinImgSmall) {

		$.imageSlideshow.add(Alloy.createController('product/pinview_closet_item_image', {
			image : result.MyPins.pinImgSmall[i].image,
			pinId : result.MyPins.pin[i].id,
			callback : function(callbackPin) {
				args = JSON.parse(JSON.stringify(callbackPin));
				displayPin();
			}
		}).getView());
	}

}, function(error) {

});
