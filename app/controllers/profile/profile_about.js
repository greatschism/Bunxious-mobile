var args = arguments[0] || {};

$.aboutText.text = Alloy.Globals.Utils.Encoder.htmlDecode(args.about);
$.favLabel.text = args.firstname.toUpperCase() + "'S CLOSET";

Alloy.Globals.API.findBoard(args.id,function(e){Ti.API.info(e)});
