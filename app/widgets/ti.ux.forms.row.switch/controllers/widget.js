var args = arguments[0];


var CUSTOM_PROPS = [
	"title",
	"value",	//true|false
];

$.id = args.id || 'switch';

initUI();
initValues();

function initUI(){

	//not icon? move the title to the left
	if(!args.icon){
		$.titleLbl.left = $.icon.getView().left;
	}else{
		$.icon.setIcon(args.icon);
		if(args.iconColor) $.icon.getView().color = args.iconColor;
	}
	
	$.titleLbl.text = args.title || '';
	
}


function initValues(){
	
	var value = args.value === "true" || args.value == true;
	$.switchControl.value = value;
	$.value = value;

}

$.getValue = function(){
	return $.switchControl.value;
};

$.setValue = function(value) {
	$.switchControl.value = value == true ? true : false; 
};

require('WidgetTools').cleanArgs(args);








