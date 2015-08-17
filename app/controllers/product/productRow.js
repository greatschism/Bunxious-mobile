var args = arguments[0] || {};

if (!Alloy.Globals.currentUser) {
	$.boxButton.hide();
	$.heartButton.hide();
}

Ti.App.addEventListener("loggedOut", function() {
	$.boxButton.hide();
	$.heartButton.hide();
});

if (args) {


	if (args.showTitle) {
		
		if (args.brand_id) {
			$.brand.text = Alloy.Globals.findBrandById(args.brand_id).title;
		}

		if (args.condition_id) {
			$.condition.text = Alloy.Globals.findConditionById(args.condition_id).title;
		}

		if (args.size) {
			$.size.text = "";
			var sizeArray = args.size.SizeIfo;
			for(var i = 0, len = sizeArray.length; i < len; i++){
				
				$.size.text += Alloy.Globals.findSizeById(sizeArray[i].size_id).title;
				
				if(i !== len-1){
					$.size.text += ', ';
				}
			}
		}
		
		$.title.hide();
		$.description.hide();
	} else {
		$.brand.hide();
		$.condition.hide();
		$.size.hide();
	}

	$.pinImage.image = args.image_big.image || 'placeholder.png';
	$.avatar.image = args.user.avatar_medium == null ? 'placeholder.png' : args.user.avatar_medium.image;
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

	if (args.board_id) {
		$.boxButton.backgroundColor = '#27ae60';
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
