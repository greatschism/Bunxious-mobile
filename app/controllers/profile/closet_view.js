var args = arguments[0] || {};
var filters = {};

Alloy.Globals.loading.show();
var tableData = [];

var user_id = args.user_id || Alloy.Globals.currentUser.user_info.id;

/*var orders = [{
 id : '451d823',
 name : 'Matt Doe',
 cost : '10 $',
 description : 'My babys shirt'
 }, {
 id : '441d8h3',
 name : 'Johnny Silverwings',
 cost : '20 $',
 description : 'New one dress'
 }, {
 id : '441d8h3',
 name : 'Mark Doe Johnson',
 cost : '50 $',
 description : 'Description for that data'
 }];
 for (var i = 0; i < orders.length; i++) {

 tableData.push(Alloy.createController('product/closetRow', orders[i]).getView());
 }
 $.closetTable.setData(tableData);*/

function createFilter(list, label, filterType) {

	var items = [];

	for (i in list) {
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
			keyArray.push(key);
		}

		filters['filters[user_id]'] = user_id;

		// Checking the filter type
		if (filterType === "category") {

			filters['filters[category_id]'] = Alloy.Globals.getIDByItem(list, e.row.data.title);

		} else if (filterType === "brand") {

			filters['filters[brand_id]'] = Alloy.Globals.getIDByItem(list, e.row.data.title);

		} else if (filterType === "gender") {

			filters['filters[gender_id]'] = Alloy.Globals.getIDByItem(list, e.row.data.title);

		} else if (filterType === "size") {

			filters['filters[size_id]'] = Alloy.Globals.getIDByItem(list, e.row.data.title);

		}
		else if (filterType === "price") {

			filters['filters[price_id]'] = Alloy.Globals.getIDByItem(list, e.row.data.title);

		}

		// Call the service
		Alloy.Globals.loading.show();
		var productArray = [];
		Alloy.Globals.API.getFilteredPins(filters, function(results) {

			for (var i in results) {
				productArray.push(Alloy.createController('product/productRow', results[i]).getView());
			}

			if (results.length == 0) {
				productArray.push(Ti.UI.createTableViewRow({
					title : 'No results.'
				}));
			}
			$.closetTable.setData(productArray);
			Alloy.Globals.loading.hide();

		}, function(error) {

			Alloy.Globals.loading.hide();
		});

	});

	popupDialog.getView().show();
}

// if (Alloy.Globals.currentUser.user_info.id) {

	Alloy.Globals.loading.show();
	Alloy.Globals.API.getCloset(user_id, function(result) {

		var tableData = [];

		for (var i in result.MyPins.pin) {
			Ti.API.info('PIN: ' + JSON.stringify(result.MyPins.pin[i]));
			tableData.push(Alloy.createController('product/closetRow', {
				pin : result.MyPins.pin[i],
				img : result.MyPins.pinImg[i]
			}).getView());
		}
		$.closetTable.setData(tableData);
		$.cover.image = result.cover.image;
		$.store_title.text = result.Shop.title;

		if (Alloy.Globals.currentUser) {
			if (Alloy.Globals.currentUser.user_info.id === user_id){ 
				$.addNewItem.setHeight('60dp');
				$.addNewItem.setVisible(true);
			}
			$.addNewItem.addEventListener('click', function(e) {
				Alloy.Globals.openWindow('product/add_view', args, true);
			});
		}

		Alloy.Globals.loading.hide();
	}, function(error) {

		Alloy.Globals.loading.hide();
	});

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

		
				Alloy.Globals.priceFilters = JSON.parse(JSON.stringify(Alloy.Globals.priceList));
				createFilter(Alloy.Globals.priceFilters, $.priceLabel, "price");
	});
// }

//Alloy.Globals.loading.hide();

// if (Alloy.Globals.currentUser.user_info.id) {
//
// Alloy.Globals.loading.show();
// Alloy.Globals.API.getCloset(Alloy.Globals.currentUser.user_info.id, function(result) {
//
// var tableData = [];
//
// for (var i in result) {
//
// //Use user list view
// //tableData.push(Alloy.createController('profile/user_view', result[i]).getView());
// }
//
// //$.followersTable.setData(tableData);
//
// Alloy.Globals.loading.hide();
// }, function(error) {
//
// Alloy.Globals.loading.hide();
// });
// }