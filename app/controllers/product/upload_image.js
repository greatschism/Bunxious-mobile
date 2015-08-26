var args = arguments[0] || {};

$.image.image = args.image;

$.rotate.addEventListener('click', function() {
	
	Alloy.Globals.loading.show();

	Alloy.Globals.API.rotateImage(args.imgPath, function(result) {
		
		Alloy.Globals.loading.hide();
		
		if (result.success && result.image) {
			
			$.image.image = Ti.Utils.base64decode(result.image);
		}
	}, function(error) {

		//TBD
		Alloy.Globals.loading.hide();
	});
});
