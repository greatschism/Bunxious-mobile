var args = arguments[0] || {};

$.closet_small_image.setImage(args.image);

$.closet_small_image.addEventListener('click', function(){
	
	args.callback({
		pin_id: args.pinId,
		user_id: args.user_id
	});
});
