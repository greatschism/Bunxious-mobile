var args = arguments[0] || {};

function populateTable() {

	Alloy.Globals.loading.show();

	Alloy.Globals.API.getHomePins(function(results) {

		var productArray = [];

		for (var i in results) {

			productArray.push(Alloy.createController('product/productRow', results[i]).getView());
		}

		if (results.length == 0) {

			productArray.push(Ti.UI.createTableViewRow({
				title : 'No results.'
			}));
		}

		$.homeTable.setData(productArray);

		Alloy.Globals.loading.hide();
	}, function(error) {

		Alloy.Globals.loading.hide();
	});
};

// Prevent the update when the controller is created in another one to use the methods
if (!args.fromAnotherController) {

	populateTable();

	if (Ti.App.Properties.getString('token', null) != null && !Alloy.Globals.currentUser) {

		Alloy.Globals.API.verifyToken(function(currentUser) {

			// saving the current user
			Alloy.Globals.currentUser = {
				token : Ti.App.Properties.getString('token', null),
				user_info : currentUser
			};

			// Updating the main menu
			Ti.App.fireEvent('loggedIn');
			populateTable();
		});
	}
}

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

// Will be triggered from login, to update the data after a user logs in
exports.populateTable = populateTable;
