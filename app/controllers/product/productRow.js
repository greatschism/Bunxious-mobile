var args = arguments[0] || {};

$.pinImage.image = args.image_big.image;
$.avatar.image = args.user.avatar_medium.image;
$.title.text = args.title;
$.description.text = args.description.replace('\r', '').replace('\n', ''); //stripping new lines
$.price.text = Alloy.Globals.Utils.codeToCurrency(args.currency_code) + args.price;

