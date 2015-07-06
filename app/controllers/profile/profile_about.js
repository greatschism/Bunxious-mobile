var args = arguments[0] || {};

$.aboutText.text = Alloy.Globals.Utils.Encoder.htmlDecode(args.about);
$.favLabel.text = args.firstname.toUpperCase() + "'S CLOSET";

