var args = arguments[0] || {};

$.pinImage.image = args.image_big.image;
$.title.text = args.title;
$.price.text = Alloy.Globals.Utils.codeToCurrency(args.currency_code) + args.price + ' ' + args.currency_code.toUpperCase();