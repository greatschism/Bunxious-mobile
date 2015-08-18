var args = arguments[0] || {};

$.pinImage.image = args.image_small.image;
$.who.text = args.who;
$.whom.text = args.whom;
$.productDescription.text = args.productDescription.replace('\r', '').replace('\n', '');

