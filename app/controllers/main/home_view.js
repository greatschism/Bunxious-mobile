var args = arguments[0] || {};
var filters = {};

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

function createFilter(list, label, filterType){
	
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
			
			// Update filters []
			var keyArray = [];
			
			// Getting array of keys
			for (var key in filters) {
				// console.log("key ", key); // shows key
				keyArray.push(key);
			}
			
			// Checking the filter type
			if(filterType === "category"){
				
				filters['filters[category_id]'] = Alloy.Globals.getIDByItem(list, e.row.data.title);
				
			} else if(filterType === "brand"){

				filters['filters[brand_id]'] = Alloy.Globals.getIDByItem(list, e.row.data.title);
				
			} else if(filterType === "gender"){
				
				filters['filters[gender_id]'] = Alloy.Globals.getIDByItem(list, e.row.data.title);
				
			} else if(filterType === "size"){
				
				filters['filters[size_id]'] = Alloy.Globals.getIDByItem(list, e.row.data.title);
				
			}
			
			// Call the service
			Alloy.Globals.loading.show();
			var productArray = [];
			Alloy.Globals.API.getFilteredPins(filters, function(results) {
		
				console.debug("Alloy.Globals.API.getFilteredPins", JSON.stringify(results));
				
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
			
		});

		popupDialog.getView().show();
}

$.categoryFilter.addEventListener('click', function() {
	
	if(Alloy.Globals.categoryFilters) {
		
		createFilter(Alloy.Globals.categoryFilters, $.categoryLabel, "category");
		
	} else {

		Alloy.Globals.API.getAllCategories(function(results) {
			
			Alloy.Globals.categoryFilters = JSON.parse(JSON.stringify(results));
			createFilter(Alloy.Globals.categoryFilters, $.categoryLabel, "category");
	
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

		createFilter(Alloy.Globals.brandFilters, $.brandLabel, "brand");

	} else {
		Alloy.Globals.API.getBrands(function(results) {
			
			Alloy.Globals.brandFilters = JSON.parse(JSON.stringify(results));

			createFilter(Alloy.Globals.brandFilters, $.brandLabel, "brand");
	
		}, function(error) {
	
		});
	}
});

$.genderFilter.addEventListener('click', function() {
	
	if(Alloy.Globals.genderFilters) {

		createFilter(Alloy.Globals.genderFilters, $.genderLabel, "gender");

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
			createFilter(Alloy.Globals.genderFilters, $.genderLabel, "gender");
	
		}, function(error) {
	
		});
	}
});

$.sizeFilter.addEventListener('click', function() {
	
	if(Alloy.Globals.sizeFilters) {

		createFilter(Alloy.Globals.sizeFilters, $.sizeLabel, "size");

	} else {
		Alloy.Globals.API.getSize(function(results) {
			
			Alloy.Globals.sizeFilters = JSON.parse(JSON.stringify(results));
			createFilter(Alloy.Globals.sizeFilters, $.sizeLabel, "size");
	
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
	
	// Get Condition
	Alloy.Globals.API.getCondition(function(results) {

		Alloy.Globals.conditionFilters = JSON.parse(JSON.stringify(results));
		
	}, function(error) {

	});
	
	// Get Countries
	Alloy.Globals.API.getAllCountries(function(results) {

		Alloy.Globals.countryFilters = JSON.parse(JSON.stringify(results));
		
	}, function(error) {

	});
}

// Will be triggered from login, to update the data after a user logs in
exports.populateTable = populateTable;
