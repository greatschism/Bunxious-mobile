var args = arguments[0] || {};

$.category.addEventListener('click', function() {

	Alloy.Globals.API.getAllCategories(function(results) {

		var popupDialog = Alloy.createWidget('ti.ux.popup.list', 'widget', {
			closeButton : true,
			selectable : true,
			options : results,
		});

		popupDialog.getView('table').addEventListener('click', function(e) {

			$.category_tabTitle.text = e.row.data.title;
			popupDialog.hide();
		});

		popupDialog.getView().show();
	}, function(error) {

	});
});

// we'll need to calculate the tableview's height because the Ti.UI.SIZE is not working in this case.
var rows = 1;

$.addVariation.addEventListener('click', function() {
	
	rows++;
	var height = 90 * rows + 45 +'dp';
	
	$.itemVariationTable.appendRow(Alloy.createController('product/variationRow').getView());
	
	$.itemVariationTable.animate({
		height : height
	});
});
