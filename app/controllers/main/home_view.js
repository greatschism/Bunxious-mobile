var args = arguments[0] || {};
var filters = {};
var priceFilterOptions;

function postLayout() {
	$.home_view.setHeight($.home_view.rect.height - 25);
	$.home_view.removeEventListener('postlayout', postLayout);
}

if (Titanium.Platform.osname == "android") {
	$.home_view.addEventListener('postlayout', postLayout);
}

function resetFilterSelection() {
	filters = {};
	$.categoryLabel.text = L('all_items');
	$.brandLabel.text = L('brand');
	$.genderLabel.text = L('gender');
	$.sizeLabel.text = L('size');
	$.priceLabel.text = L('price');
}

function populateTable() {

	Alloy.Globals.loading.show();

	Alloy.Globals.API.getHomePins(function(results) {

		var productArray = [];

		for (var i in results) {

			var rowResult = results[i];
			rowResult.showTitle = true;

			productArray.push(Alloy.createController('product/productRow', rowResult).getView());
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

	Ti.App.addEventListener("loggedIn", function(arg) {
		
		if (arg.dontPopulate !== true) {
			
			populateTable();
		}
	});

	if (Ti.App.Properties.getString('token', null) != null && !Alloy.Globals.currentUser) {

		Alloy.Globals.API.verifyToken(function(currentUser) {

			if (currentUser && !currentUser.error) {

				// saving the current user
				Alloy.Globals.currentUser = {
					token : Ti.App.Properties.getString('token', null),
					user_info : currentUser
				};

				Alloy.Globals.API.getBoards(null, function(result) {

					if (!result.error) {

						//storing the user's boards
						Alloy.Globals.currentUser.boards = result;
						populateTable();
					}
				}, function(error) {
					
					populateTable();
				});

				// Updating the main menu
				Ti.App.fireEvent('loggedIn', {
					dontPopulate : true
				});
			}
			else {
				
				populateTable();
			}
		});
	}
	else {
		
		populateTable();
	}
}

function createFilter(list, label, filterType) {

	var items = [],
	    min = [],
	    max = [];

	for (i in list) {
		items.push(list[i].title);
		min.push(list[i].min);
		max.push(list[i].max);
	}

	var popupDialog = Alloy.createWidget('ti.ux.popup.list', 'widget', {
		closeButton : true,
		selectable : true,
		options : items,
		min : min,
		max : max
	});

	popupDialog.getView('table').addEventListener('click', function(e) {

		label.text = e.row.data.title;
		var min = e.row.data.min;
		var max = e.row.data.max;
		popupDialog.hide();

		// Update filters []
		var keyArray = [];

		// Getting array of keys
		for (var key in filters) {
			keyArray.push(key);
		}

		// Checking the filter type
		if (filterType === "category") {

			filters['filters[category_id]'] = Alloy.Globals.getIDByItem(list, e.row.data.title);

		} else if (filterType === "brand") {

			filters['filters[brand_id]'] = Alloy.Globals.getIDByItem(list, e.row.data.title);

		} else if (filterType === "gender") {

			filters['filters[gender_id]'] = Alloy.Globals.getIDByItem(list, e.row.data.title);

		} else if (filterType === "size") {

			filters['filters[size_id]'] = Alloy.Globals.getIDByItem(list, e.row.data.title);

		} else if (filterType === "price") {

			filters['filters[price]'] = min + '&filters[price]=' + max;
		}

		// Call the service
		Alloy.Globals.loading.show();
		var productArray = [];
		Alloy.Globals.API.getFilteredPins(filters, function(results) {

			for (var i in results) {
				var rowResult = results[i];
				rowResult.showTitle = true;

				productArray.push(Alloy.createController('product/productRow', rowResult).getView());
			}

			if (results.length == 0) {
				productArray.push(Ti.UI.createTableViewRow({
					title : 'No results.'
				}));
			}
			$.homeTable.setData(productArray);
			Alloy.Globals.loading.hide();

		}, function(error) {

			alert('No Data Found');
			var productArray = [];
			$.homeTable.setData(productArray);
			Alloy.Globals.loading.hide();
		});

	});

	popupDialog.getView().show();
}

$.categoryFilter.addEventListener('click', function() {

	if (Alloy.Globals.categoryFilters) {

		createFilter(Alloy.Globals.categoryFilters, $.categoryLabel, "category");

	} else {

		Alloy.Globals.API.getAllCategories(function(results) {

			Alloy.Globals.categoryFilters = JSON.parse(JSON.stringify(results));
			createFilter(Alloy.Globals.categoryFilters, $.categoryLabel, "category");

		}, function(error) {

		});
	}
});

$.brandFilter.addEventListener('click', function() {

	if (Alloy.Globals.brandFilters) {

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

	if (Alloy.Globals.genderFilters) {

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

	if (Alloy.Globals.sizeFilters) {

		createFilter(Alloy.Globals.sizeFilters, $.sizeLabel, "size");

	} else {
		Alloy.Globals.API.getSize(function(results) {

			Alloy.Globals.sizeFilters = JSON.parse(JSON.stringify(results));
			createFilter(Alloy.Globals.sizeFilters, $.sizeLabel, "size");

		}, function(error) {

		});
	}
});

$.priceFilter.addEventListener('click', function() {

	var items = [],
	    min = [],
	    max = [];

	for (i in Alloy.Globals.priceListOptions) {
		items.push(Alloy.Globals.priceListOptions[i].title);
		min.push(Alloy.Globals.priceListOptions[i].min);
		max.push(Alloy.Globals.priceListOptions[i].max);
	}

	var popupDialog = Alloy.createWidget('ti.ux.popup.list', 'widget', {
		closeButton : true,
		doneButton : true,
		selectedOptions : priceFilterOptions,
		doneFunction : function(options) {

			priceFilterOptions = options;

			if (options.length == 0) {

				if (filters['filters[price]']) {
					delete filters['filters[price]'];
					populateTable();
				}

				return;
			}

			var min = 9999,
			    max = 0;

			for (var i in options) {

				if (options[i].min < min) {

					min = options[i].min;
				}

				if (options[i].max > max) {

					max = options[i].max;
				}
			}

			filters['filters[price]'] = min + '&filters[price]=' + max;

			// Call the service
			Alloy.Globals.loading.show();
			var productArray = [];
			Alloy.Globals.API.getFilteredPins(filters, function(results) {

				for (var i in results) {
					var rowResult = results[i];
					rowResult.showTitle = true;

					productArray.push(Alloy.createController('product/productRow', rowResult).getView());
				}

				if (results.length == 0) {
					productArray.push(Ti.UI.createTableViewRow({
						title : 'No results.'
					}));
				}
				$.homeTable.setData(productArray);
				Alloy.Globals.loading.hide();

			}, function(error) {

				alert('No Data Found');
				var productArray = [];
				$.homeTable.setData(productArray);
				Alloy.Globals.loading.hide();
			});
		},
		selectable : true,
		min : min,
		max : max,
		options : items,
	});

	popupDialog.getView().show();
});

$.resetButton.addEventListener('click', function() {
	resetFilterSelection();
	populateTable();
	priceFilterOptions = null;
});

