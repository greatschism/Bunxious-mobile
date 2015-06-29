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
	getFilters();

	if (Ti.App.Properties.getString('token', null) != null && !Alloy.Globals.currentUser) {

		Alloy.Globals.API.verifyToken(function(currentUser) {

			if (currentUser && !currentUser.error) {
				
				// saving the current user
				Alloy.Globals.currentUser = {
					token : Ti.App.Properties.getString('token', null),
					user_info : currentUser
				};
				
				// Updating the main menu
				Ti.App.fireEvent('loggedIn');
				populateTable();
				
			}
		});
	}
}

function createFilter(list, label){
	
	var items = [];
	
	for(i in list){
		items.push(list[i].title);
	}
	
	var popupDialog = Alloy.createWidget('ti.ux.popup.list', 'widget', {
			closeButton : true,
			selectable : true,
			options : items,
		});

		popupDialog.getView('table').addEventListener('click', function(e) {

			label.text = e.row.data.title;
			popupDialog.hide();
		});

		popupDialog.getView().show();
}

$.categoryFilter.addEventListener('click', function() {
	
	if(Alloy.Globals.categoryFilters) {
		
		createFilter(Alloy.Globals.categoryFilters, $.categoryLabel);
		
	} else {

		Alloy.Globals.API.getAllCategories(function(results) {
			
			Alloy.Globals.categoryFilters = JSON.parse(JSON.stringify(results));
			createFilter(Alloy.Globals.categoryFilters, $.categoryLabel);
	
		}, function(error) {
	
		});
	}

/*	Alloy.Globals.API.getAllCategories(function(results) {

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
*/
});

$.brandFilter.addEventListener('click', function() {
	
	if(Alloy.Globals.brandFilters) {

		createFilter(Alloy.Globals.brandFilters, $.brandLabel);

	} else {
		Alloy.Globals.API.getBrands(function(results) {
			
			Alloy.Globals.brandFilters = JSON.parse(JSON.stringify(results));

			createFilter(Alloy.Globals.brandFilters, $.brandLabel);
	
		}, function(error) {
	
		});
	}
});

$.genderFilter.addEventListener('click', function() {
	
	if(Alloy.Globals.genderFilters) {

		createFilter(Alloy.Globals.genderFilters, $.genderLabel);

	} else {
		Alloy.Globals.API.getGender(function(results) {
			
			var items = [];
			for (var i in results.Gender) {
				items.push({
					"title" : results.Gender[i].name,
					"id" : results.Gender[i].id
				});
			}
			Alloy.Globals.genderFilters = JSON.parse(JSON.stringify(items));
			createFilter(Alloy.Globals.genderFilters, $.genderLabel);
	
		}, function(error) {
	
		});
	}
});

$.sizeFilter.addEventListener('click', function() {
	
	if(Alloy.Globals.sizeFilters) {

		createFilter(Alloy.Globals.sizeFilters, $.sizeLabel);

	} else {
		Alloy.Globals.API.getSize(function(results) {
			
			Alloy.Globals.sizeFilters = JSON.parse(JSON.stringify(results));
			createFilter(Alloy.Globals.sizeFilters, $.sizeLabel);
	
		}, function(error) {
	
		});
	}
});

function getFilters() {
	
	// Get Categories
	Alloy.Globals.API.getAllCategories(function(results) {

		Alloy.Globals.categoryFilters = JSON.parse(JSON.stringify(results));
				
	}, function(error) {

	});
	
	// Get Brands
	Alloy.Globals.API.getBrands(function(results) {
		
		Alloy.Globals.brandFilters = JSON.parse(JSON.stringify(results));
		
	}, function(error) {

	});
	
	// Get Gender
	Alloy.Globals.API.getGender(function(results) {
		
		var items = [];
		for (var i in results.Gender) {
			items.push({
				"title" : results.Gender[i].name,
				"id" : results.Gender[i].id
			});
		}

		Alloy.Globals.genderFilters = JSON.parse(JSON.stringify(items));
		
	}, function(error) {

	});
	
	// Get Size
	Alloy.Globals.API.getSize(function(results) {

		Alloy.Globals.sizeFilters = JSON.parse(JSON.stringify(results));
		
	}, function(error) {

	});
}

// Will be triggered from login, to update the data after a user logs in
exports.populateTable = populateTable;
