
var args = arguments[0];
var originalHeight = args.height;

var isExpanded = false;

if(args.text) $.label.text = args.text;
if(originalHeight) $.view.height = originalHeight;


function expandText(e){
	if(isExpanded){
		$.view.height = originalHeight;
		if (OS_ANDROID) {
			$.row.height = originalHeight;
		}
	}else{
		$.view.height = Ti.UI.SIZE;
		if (OS_ANDROID) {
			$.row.height = $.view.toImage().height;
		}
	}
	
	isExpanded = !isExpanded;
}

$.setText = function(str){
	$.label.text = str || '';
};
