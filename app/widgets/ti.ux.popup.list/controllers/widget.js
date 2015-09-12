var args = arguments[0];
var WTools = require('WidgetTools');
var selectedOptions = [];

//WTools.setTiProps(args, $.bgView);

function initUI(){

	var children;
	var rows = [];
	$.value = args.value;
	
	if (args.children) {
		
		children = args.children || [];
		
		for(var i = 0, j = children.length; i < j; i++){
			rows.push(children[i]);
		}
		
	}else if(args.options){
		var selectedValue = args.value || null;
		var options = args.options;
		var min = args.min || null;
		var max = args.max || null;
		var selectable = args.selectable || false;
		var value = $.value;
		var icon;
		
		for(var i = 0, j = options.length; i < j; i++){
			icon = selectable && value == i ? 'fa-check-circle' : undefined;
			rows.push(Alloy.createWidget('ti.ux.rowitem', 'widget', {title:options[i], min : min && min[i] ? min[i] : null, max : max && max[i] ? max[i] : null, icon:icon}).getView()); 
		}
		
	}
	
	$.table.data = rows;
	
	if(args.selectable == "true" || args.selectable === true){
		
		$.table.addEventListener('click', function(e) {
			
			if (e.row.hasCheck) {
				
				e.row.hasCheck = false;
				
				for (var i in selectedOptions) {
					
					if (selectedOptions[i].title == e.row.data.title) {
						
						selectedOptions.splice(i, 1);
					}
				}
				Ti.API.info(selectedOptions);
			}
			else {
				
				e.row.hasCheck = true;
				selectedOptions.push(e.row.data);
				Ti.API.info(selectedOptions);
			}
		});
		
		$.table.allowsSelection = true;
	}
	
	if (args.closeButton) {
		
		if (args.closeFunction) {
			
			$.popup.enableCloseButton(function () {
				
				args.closeFunction(selectedOptions);
			});
		}
		else {
			
			$.popup.enableCloseButton();
		}
		
	}
}

initUI();

$.show = function(){
	$.popup.show();
};

$.hide = function(){
	$.popup.hide();
};


$.addEventListener = function(event, fn){
	if (event === 'optionSelected') $.table.optionSelectedCallback = fn;
	else{
		$.popup.addEventListener(event, fn);
	}
};

$.off = function(event, fn){
	if (event === 'optionSelected') $.table.optionSelectedCallback = undefined;
	else{
		$.popup.addEventListener(event, fn);
	}
};


//WTools.cleanArgs(args);





