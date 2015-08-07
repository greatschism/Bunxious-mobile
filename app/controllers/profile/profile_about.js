var args = arguments[0] || {};

$.aboutText.text = Alloy.Globals.Utils.Encoder.htmlDecode(args.about);
$.favLabel.text = args.firstname + "'s Closet";

$.favWrapper.addEventListener('click', function(e){
	Alloy.Globals.openWindow('profile/closet_view', {
		user_id : args.id
	}, true);
});
