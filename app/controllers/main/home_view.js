var args = arguments[0] || {};

function populateTable() {

	Alloy.Globals.API.getHomePins(function(results) {

		var productArray = [];

		for (var i in results) {

			productArray.push(Alloy.createController('product/productRow', results[i]).getView());
		}

		$.homeTable.setData(productArray);

	}, function(error) {

	});
};

populateTable();

// Will be triggered from login, to update the data after a user logs in
Ti.App.addEventListener('loggedIn', function() {

	populateTable();
});

$.categoryFilter.addEventListener('click', function() {

	Alloy.Globals.API.getAllCategories(function(results) {
		
		Ti.API.info('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%' + JSON.stringify(results));
		var popupDialog = Alloy.createWidget('ti.ux.popup.list', 'widget', {
			closeButton : true,
			selectable : true,
			options : results,
		});

		popupDialog.getView('table').addEventListener('click', function(e) {
			
			$.categoryLabel.text = e.row.data.title;
			popupDialog.hide();
		});

		popupDialog.getView().show();
	}, function(error) {

	});
});
