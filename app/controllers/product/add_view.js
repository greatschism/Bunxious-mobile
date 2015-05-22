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