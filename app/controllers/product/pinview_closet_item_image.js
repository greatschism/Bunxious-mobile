var args = arguments[0] || {};

$.closet_small_image.setImage(args.image);

$.closet_small_image.addEventListener('click', function(){
	Alloy.Globals.API.getPin(args.pinId, function(result) {

		args.callback(result);

	}, function(error){
		
	});
});
