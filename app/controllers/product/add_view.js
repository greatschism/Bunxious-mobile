var args = arguments[0] || {};

function getIDByItem(list, item) {
	var id;
	
	for (i in list){
		if(list[i].title === item){
			console.debug("list[i] ", JSON.stringify(list[i]));
			id = list[i].id;
			break;
		}
	}
	return id;
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
			
			label.idValue = getIDByItem(list, e.row.data.title);
			
		});

		popupDialog.getView().show();
}

$.category.addEventListener('click', function() {
	
	var addPopUp = function(results){
		
		var items = [];
		for(i in results){
			items.push(results[i].title);
		}

		var popupDialog = Alloy.createWidget('ti.ux.popup.list', 'widget', {
			closeButton : true,
			selectable : true,
			options : items,
		});

		popupDialog.getView('table').addEventListener('click', function(e) {

			$.categoryTitle.text = e.row.data.title;
			popupDialog.hide();
		});

		popupDialog.getView().show();
	};

	if(Alloy.Globals.categoryFilters) {
		
		// addPopUp(Alloy.Globals.categoryFilters);
		createFilter(Alloy.Globals.categoryFilters, $.categoryTitle);
		
	} else {
		Alloy.Globals.API.getAllCategories(function(results) {

			Alloy.Globals.categoryFilters = JSON.parse(JSON.stringify(results));
			// addPopUp(Alloy.Globals.categoryFilters);
			createFilter(Alloy.Globals.categoryFilters, $.categoryTitle);

		}, function(error) {

		});
	}
});

$.groups.addEventListener('click', function() {
	Alloy.Globals.API.findGroups(function(results) {
		
		var items = [];

		for (var i in results.Group) {
			items.push(results.Group[i].name);
		}
		
		var popupDialog = Alloy.createWidget('ti.ux.popup.list', 'widget', {
			closeButton : true,
			selectable : true,
			options : items,
		});
		
		popupDialog.getView('table').addEventListener('click', function(e) {

			$.groupsTitle.text = e.row.data.title;
			popupDialog.hide();
		});
		
		popupDialog.getView().show();
	});
});

$.brand.addEventListener('click', function() {
	
	if(Alloy.Globals.brandFilters) {

		createFilter(Alloy.Globals.brandFilters, $.brandTitle);

	} else {
		Alloy.Globals.API.getBrands(function(results) {
			
			Alloy.Globals.brandFilters = JSON.parse(JSON.stringify(results));

			createFilter(Alloy.Globals.brandFilters, $.brandTitle);
	
		}, function(error) {
	
		});
	}
});

$.gender.addEventListener('click', function() {
	
	if(Alloy.Globals.genderFilters) {

		createFilter(Alloy.Globals.genderFilters, $.genderTitle);

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
			createFilter(Alloy.Globals.genderFilters, $.genderTitle);
	
		}, function(error) {
	
		});
	}
});

$.condition.addEventListener('click', function() {
	
	if(Alloy.Globals.conditionFilters) {

		createFilter(Alloy.Globals.conditionFilters, $.conditionTitle);

	} else {
		Alloy.Globals.API.getCondition(function(results) {
			
			Alloy.Globals.conditionFilters = JSON.parse(JSON.stringify(results));
			createFilter(Alloy.Globals.conditionFilters, $.conditionTitle);
	
		}, function(error) {
	
		});
	}
});

$.uploadImage.addEventListener('click', function(e){
	
});

// we'll need to calculate the tableview's height because the Ti.UI.SIZE is not working in this case.
var rows = 1;

$.addVariation.addEventListener('click', function() {

	rows++;
	var height = 90 * rows + 45 + 'dp';

	$.itemVariationTable.appendRow(Alloy.createController('product/variationRow').getView());

	$.itemVariationTable.animate({
		height : height
	});
});

// var country_list = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua & Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia & Herzegovina", "Botswana", "Brazil", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Cape Verde", "Cayman Islands", "Chad", "Chile", "China", "Colombia", "Congo", "Cook Islands", "Costa Rica", "Cote D Ivoire", "Croatia", "Cruise Ship", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Estonia", "Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Polynesia", "French West Indies", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Kyrgyz Republic", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mauritania", "Mauritius", "Mexico", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Namibia", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda", "Saint Pierre & Miquelon", "Samoa", "San Marino", "Satellite", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka", "St Kitts & Nevis", "St Lucia", "St Vincent", "St. Lucia", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor L'Este", "Togo", "Tonga", "Trinidad & Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks &amp; Caicos", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "Virgin Islands (US)", "Yemen", "Zambia", "Zimbabwe"];
/*
$.shipsFrom.addEventListener('click', function() {

	var popupDialog = Alloy.createWidget('ti.ux.popup.list', 'widget', {
		closeButton : true,
		selectable : true,
		options : country_list,
	});

	popupDialog.getView('table').addEventListener('click', function(e) {

		$.shipsFromTitle.text = e.row.data.title;
		popupDialog.hide();
	});

	popupDialog.getView().show();
});
*/
$.shipsTo.addEventListener('click', function() {
	
	if(Alloy.Globals.countryFilters){
		
		createFilter(Alloy.Globals.countryFilters, $.shipsToTitle);
		
	} else {
		Alloy.Globals.API.getAllCountries(function(results) {

			Alloy.Globals.countryFilters = JSON.parse(JSON.stringify(results));
			createFilter(Alloy.Globals.countryFilters, $.shipsToTitle);
			
		}, function(error) {
	
		});
	}
});

$.addItem.addEventListener('click', function() {
	var data = {
		"token" : Alloy.Globals.currentUser.token,
		"X-form-cmd" : "",
		"gallery" : ["cache/tmp/ef013a2557536e0dc6141be618431a33.png", "cache/tmp/480eb0b5c8d83bf617c525d270433d17.png"],
		"category_id" : $.categoryTitle.idValue,
		"title" : $.tfTitle.getValue(),
		"description" : $.tfDesc.getValue(),
		"extended" : {
			"tags" : $.tfStyle.getValue() + ", " + $.tfTags.getValue() + ", " + $.tfMaterials.getValue()
		},
		"itemshipping" : {
			"country_id" : [$.shipsToTitle.idValue, "4", "7"],
			"state_id" : ["", "", ""],
			"city_id" : ["", "", ""],
			"price" : [$.tfPrice.getValue(), "60", "60"]
		},
		"shipping" : "1",
		"sell" : "1",
		"pinquantity" : {
			"size_id" : ["3", "32"],
			"quantity" : ["6", "25"],
			"price" : ["50", "500"]
		},
		"brand_id" : $.brandTitle.idValue,
		"condition_id" : $.conditionTitle.idValue,
		"gender_id" : $.genderTitle.idValue,
		"group" : $.groupsTitle.idValue
	};

	// console.debug("variationRow ", $.variationRow.sizeTitle.idValue);
	
	// console.debug("data to add ", JSON.stringify(data));

	// Alloy.Globals.API.addItem(function(results) {});
});
