var args = arguments[0] || {};
console.log('ARGS:'+JSON.stringify(args));
$.pinImage.image = args.img.image;
$.avatar.image = args.pin.avatar;
$.title.text = args.pin.title;
$.description.text = args.pin.description;
$.price.text = String.formatCurrency(args.pin.price);


$.pinImage.addEventListener('click', function(e) {
	// console.debug('closet row product/pin_view args ', JSON.stringify(args));
	
	var data = args.pin;
	data.image_big = args.img;
	
	Alloy.Globals.openWindow('product/pin_view', data, true);
}); 