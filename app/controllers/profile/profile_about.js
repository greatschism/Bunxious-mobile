var args = arguments[0] || {};

$.aboutText.text = Alloy.Globals.Utils.Encoder.htmlDecode(args.about);
$.favLabel.text = args.firstname + "'s Closet";

$.favWrapper.addEventListener('click', function(e) {
	Alloy.Globals.openWindow('profile/closet_view', {
		user_id : args.id
	}, true);
});

Alloy.Globals.API.getCloset(args.id, function(result) {

	for (i in result.MyPins.pinImg) {

		$.pins.add(Alloy.createController('product/pinview_closet_item_image', {
			image : result.MyPins.pinImg[i].image,
			pinId : result.MyPins.pin[i].id,
			user_id : args.id,
			callback : function(callbackPin) {

				Alloy.Globals.openWindow('product/pin_view', callbackPin, true);
			}
		}).getView());
	}

}, function(error) {

	//TBD
});