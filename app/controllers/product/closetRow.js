var args = arguments[0] || {};
console.log('ARGS:'+JSON.stringify(args));
$.pinImage.image = args.img.image;
$.avatar.image = args.pin.avatar;
$.title.text = args.pin.title;
$.description.text = args.pin.description;
$.price.text = args.pin.price;
