var args = arguments[0];
var WTools = require('WidgetTools');
var selectedOptions = [];

//WTools.setTiProps(args, $.bgView);

function initUI(){

	var children;
	var rows = [];
	$.value = args.value;
	
	if (args.selectedOptions) {
		
		for (var i in args.selectedOptions) {
			
			if (args.selectedOptions[i] != null) {
				
				selectedOptions.push(args.selectedOptions[i]);
			}
		}
	}
	
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
			
			var row = Alloy.createWidget('ti.ux.rowitem', 'widget', {title:options[i], min : min && min[i] ? min[i] : null, max : max && max[i] ? max[i] : null, icon:icon}).getView(); 
			
			if (args.selectedOptions) {
				
				for (var k in args.selectedOptions) {
					
					if (args.selectedOptions[k] && args.selectedOptions[k].title && args.selectedOptions[k].title == options[i]) {
						
						row.hasCheck = true;
						break;
					}
				}	
			}
			
			rows.push(row);
		}
		
		if (args.doneButton) {
			
			var doneRow = Ti.UI.createTableViewRow({
				height : '35dp'
			});
			
			var doneButton = Ti.UI.createButton({
				backgroundColor : '#62949b',
				height : Ti.UI.FILL,
				width : Ti.UI.FILL,
				borderRadius : 8,
				font: {
					fontWeight: 'bold',
					fontSize: '14dp'
				},
				title : 'Filter',
				color : '#fff'
			});
			
			doneButton.addEventListener('click', function() {
				
				$.popup.hide();

				if (args.doneFunction) {
					
					args.doneFunction(selectedOptions);
				}
			});
			
			doneRow.add(doneButton);
			
			rows.push(doneRow);
		}
		
	}
	
	$.table.data = rows;
	
	// hack for avoiding the separators when the table is empty or has fewer rows
	var tblFooterView = Ti.UI.createView({
		width : 300,
		height : 1,
		backgroundColor : '#FFF'
	});
	
	$.table.footerView = tblFooterView;
	
	if(args.selectable == "true" || args.selectable === true){
		
		$.table.addEventListener('click', function(e) {
			
			if (e.row.hasCheck) {
				
				e.row.hasCheck = false;
				
				for (var i in selectedOptions) {
					
					if (selectedOptions[i].title == e.row.data.title) {
						
						selectedOptions.splice(i, 1);
					}
				}
			}
			else {
				
				e.row.hasCheck = true;
				selectedOptions.push(e.row.data);
			}
		});
		
		$.table.allowsSelection = true;
	}
	
	if (args.closeButton) {
		
		$.popup.enableCloseButton();
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





