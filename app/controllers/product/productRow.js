var args = arguments[0] || {};
var utils = require('utils');

$.pinImage.image = args.image_big.image;
$.avatar.image = args.user.avatar_medium.image;
$.title.text = args.title;
$.description.text = args.description.replace('\r', '').replace('\n', ''); //stripping new lines
$.price.text = utils.codeToCurrency(args.currency_code) + args.price;

