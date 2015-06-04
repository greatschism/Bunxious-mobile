var args = arguments[0] || {};

$.messageText.text = args.message;

if (args.me.id == args.from.id) {
	
	$.messageWrapper.right = '25dp';
	$.messageWrapper.backgroundColor = '#fff';
	$.messageText.textAlign = Ti.UI.TEXT_ALIGNMENT_RIGHT;
}
else {
	
	$.messageWrapper.left = '25dp';
	$.messageWrapper.borderColor = '#cfd1d8';
	$.messageWrapper.borderWidth = 0.5;
}
