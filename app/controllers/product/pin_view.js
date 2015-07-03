var args = arguments[0] || {};

Ti.API.info('args: ' + JSON.stringify(args));

$.pinImage.image = args.image_big.image;
$.title.text = args.title;
$.price.text = Alloy.Globals.Utils.codeToCurrency(args.currency_code) + args.price + ' ' + args.currency_code.toUpperCase();

$.brand.text = 'BRAND: ' + args.brand_id;
$.size.text = 'SIZE: Not yet defined';
$.condition.text = 'CONDITION: ' + args.condition_id;
$.description.value = 'Description: ' + args.description;
$.shipping.text = '    SHIPPING FROM ' + args.from;

$.shipToOut.text = 'United States';
$.shipCostOut.text = '$6.50 USD';
$.shipWithOut.text = '$1.00 USD';

Alloy.Globals.API.getUser(args.user_id, function(result) {

	$.avatar.image = result.avatar_medium.image;
	$.userName.text = result.firstname + ' ' + result.lastname;

	if (result.city && result.country_iso_code_3) {

		$.userLocation.text = result.city + ', ' + result.country_iso_code_3;
	} else if (result.city || result.country_iso_code_3) {

		$.userLocation.text = result.city || result.country_iso_code_3;
	}
	
	if (!Alloy.Globals.currentUser || Alloy.Globals.currentUser.user_info.id != result.id){
		$.followButton.visible = true;
		$.contactButton.visible = true;
		
		if(result.following_user){
			$.follow.setText(L('unfollow'));
		}
		
		$.followButton.addEventListener('click', function(e){
			Alloy.Globals.API.follow(result.id, function(response) {
				// console.debug("follow-unfollow response ", JSON.stringify(response));
				
				if(response.isFollow){
					$.follow.setText(L('unfollow'));
				} else {
					$.follow.setText(L('follow'));
				}
			});
		});
		
		$.contactButton.addEventListener('click', function(e){
				
			var data = {
				to_user_id : result.id,
				name: result.firstname + " "+ result.lastname,
				avatar: result.avatar_small.image
			};
			
			Alloy.Globals.openWindow('profile/message_view', data, true);
		});
	}
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