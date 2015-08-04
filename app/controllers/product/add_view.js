var args = arguments[0] || {};

var gallery = [],
    uploadedImages = 1,
    rows = 1,
    x_form = '';

if (args.pin) {
	$.favLbl.text = L('edit_item');
	$.saveBtn.title = L('edit_item');
	Alloy.Globals.loading.show();
	Alloy.Globals.API.getEditPin(args.pin.id, function(result) {

		x_form = result['X-form-cmd'];

		$.tfTitle.setValue(result.Pin.title);
		$.tfDesc.setValue(result.Pin.description);

		if (result.Pin.category_id) {
			$.categoryTitle.text = Alloy.Globals.findCategoryById(args.pin.category_id).title;
			$.categoryTitle.idValue = args.pin.category_id;
		}

		if (result.Pin.brand_id) {
			$.brandTitle.text = Alloy.Globals.findBrandById(args.pin.brand_id).title;
			$.brandTitle.idValue = args.pin.brand_id;
		}

		if (result.Pin.condition_id) {
			$.conditionTitle.text = Alloy.Globals.findConditionById(args.pin.condition_id).title;
			$.conditionTitle.idValue = args.pin.condition_id;
		}

		if (result.Pin.gender_id) {
			$.genderTitle.text = Alloy.Globals.findGenderById(args.pin.gender_id).title;
			$.genderTitle.idValue = args.pin.gender_id;
		}

		if (result.Gallery) {

			gallery = JSON.parse(JSON.stringify(result.Gallery));

			for (var i = 0; i < gallery.length; i++) {
				var height = 45 * uploadedImages + 45 + 'dp';

				$.uploadImageTable.appendRow(Alloy.createController('product/upload_image', {
					image : gallery[i]
				}).getView());

				$.uploadImageTable.animate({
					height : height
				});

				uploadedImages++;
			}
		}

		if (result.LocationInfo.options) {

			for (var i = 0; i < result.LocationInfo.options.length; i++) {
				if (result.LocationInfo.options[i].country_id === null) {
					$.shipToElsewhere.value = result.LocationInfo.options[i].price;
				} else if (result.LocationInfo.options[i].country_id === 223) {
					$.shipToUS.value = result.LocationInfo.options[i].price;
				}
			}
		}

		if (result.SizeIfo) {

			for (var i = 0; i < result.SizeIfo.length; i++) {

				if (i === 0) {// Adding values to already created row for the first set
					var firstVariationRow = $.itemVariationTable.data[0].rows;

					firstVariationRow[i].children[0].children[0].field_id = result.SizeIfo[i].id;
					firstVariationRow[i].children[0].children[0].idValue = result.SizeIfo[i].size_id;
					firstVariationRow[i].children[0].children[0].text = Alloy.Globals.findSizeById(result.SizeIfo[i].size_id).title;
					firstVariationRow[i].children[1].children[0].children[0].value = result.SizeIfo[i].quantity;
					firstVariationRow[i].children[1].children[1].children[0].value = result.SizeIfo[i].price;

				} else {// creating rows for the rest of the set

					rows++;
					var height = 90 * rows + 45 + 'dp';

					// Collecting the variation row data and checking if it is empty
					var itemVariationTableRows = $.itemVariationTable.data[0].rows;

					$.itemVariationTable.appendRow(Alloy.createController('product/variationRow').getView());

					itemVariationTableRows[i].children[0].children[0].field_id = result.SizeIfo[i].id;
					itemVariationTableRows[i].children[0].children[0].idValue = result.SizeIfo[i].size_id;
					itemVariationTableRows[i].children[0].children[0].text = Alloy.Globals.findSizeById(result.SizeIfo[i].size_id).title;
					itemVariationTableRows[i].children[1].children[0].children[0].value = result.SizeIfo[i].quantity;
					itemVariationTableRows[i].children[1].children[1].children[0].value = result.SizeIfo[i].price;

					$.itemVariationTable.animate({
						height : height
					});
				}
			}

		}

		if (result.Tags.tagsString) {
			var tagsArray = result.Tags.tagsString.split(',');
			$.tfStyle.value = tagsArray[0];
			$.tfTags.value = tagsArray[1];
			$.tfMaterials.value = tagsArray[2];
		}

		Alloy.Globals.loading.hide();

	}, function(error) {
		console.debug(JSON.stringify(error));
	});
}

$.category.addEventListener('click', function() {

	if (Alloy.Globals.categoryFilters) {

		Alloy.Globals.createFilter(Alloy.Globals.categoryFilters, $.categoryTitle);
		if (args.pin) {
			var index = Alloy.Globals.findIndexWithAttribute(Alloy.Globals.categoryFilters, 'id', args.pin.category_id);
			$.categoryTitle.setSelectedIndex(index);
		}

	} else {
		Alloy.Globals.API.getAllCategories(function(results) {

			Alloy.Globals.categoryFilters = JSON.parse(JSON.stringify(results));
			Alloy.Globals.createFilter(Alloy.Globals.categoryFilters, $.categoryTitle);
			if (args.pin) {
				var index = Alloy.Globals.findIndexWithAttribute(Alloy.Globals.categoryFilters, 'id', args.pin.category_id);
				$.categoryTitle.setSelectedIndex(index);
			}

		}, function(error) {

		});
	}
});

$.groups.addEventListener('click', function() {
	Alloy.Globals.API.findGroups(function(results) {

		var groups = [],
		    items = [];

		for (var i in results.Group) {
			groups.push({
				"title" : results.Group[i].name,
				"id" : results.Group[i].id
			});
		}

		Alloy.Globals.createFilter(groups, $.groupsTitle);

	});
});

$.brand.addEventListener('click', function() {

	if (Alloy.Globals.brandFilters) {

		Alloy.Globals.createFilter(Alloy.Globals.brandFilters, $.brandTitle);

	} else {
		Alloy.Globals.API.getBrands(function(results) {

			Alloy.Globals.brandFilters = JSON.parse(JSON.stringify(results));

			Alloy.Globals.createFilter(Alloy.Globals.brandFilters, $.brandTitle);

		}, function(error) {

		});
	}
});

$.gender.addEventListener('click', function() {

	if (Alloy.Globals.genderFilters) {

		Alloy.Globals.createFilter(Alloy.Globals.genderFilters, $.genderTitle);

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
			Alloy.Globals.createFilter(Alloy.Globals.genderFilters, $.genderTitle);

		}, function(error) {

		});
	}
});

$.condition.addEventListener('click', function() {

	if (Alloy.Globals.conditionFilters) {

		Alloy.Globals.createFilter(Alloy.Globals.conditionFilters, $.conditionTitle);

	} else {
		Alloy.Globals.API.getCondition(function(results) {

			Alloy.Globals.conditionFilters = JSON.parse(JSON.stringify(results));
			Alloy.Globals.createFilter(Alloy.Globals.conditionFilters, $.conditionTitle);

		}, function(error) {

		});
	}
});

$.uploadImage.addEventListener('click', function(e) {

	var image = Alloy.Globals.uploadImage(function(image) {

		Alloy.Globals.API.uploadImage(image, function(result) {

			if (result.success) {

				var height = 45 * uploadedImages + 45 + 'dp';

				$.uploadImageTable.appendRow(Alloy.createController('product/upload_image', {
					image : image
				}).getView());

				$.uploadImageTable.animate({
					height : height
				});

				gallery.push(result.file);

				uploadedImages++;
				$.noImage.text = '';
				Alloy.Globals.loading.hide();
			} else {

				Alloy.Globals.loading.hide();
				alert('Upload failed. Please try again');
			}

		}, function(error) {
			Alloy.Globals.loading.hide();
		});

	});
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

// $.itemVariationTable.addEventListener('click', function(e){
//
// console.debug('itemVariationTable row ', JSON.stringify(e));
//
// });

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

 $.shipsTo.addEventListener('click', function() {

 if(Alloy.Globals.countryFilters){

 Alloy.Globals.createFilter(Alloy.Globals.countryFilters, $.shipsToTitle);

 } else {
 Alloy.Globals.API.getAllCountries(function(results) {

 Alloy.Globals.countryFilters = JSON.parse(JSON.stringify(results));
 Alloy.Globals.createFilter(Alloy.Globals.countryFilters, $.shipsToTitle);

 }, function(error) {

 });
 }
 });
 */
$.addItem.addEventListener('click', function() {
	// Checking if image is uploaded
	if (gallery.length === 0) {
		alert(L("add_image_error"));
		return;
	}

	// Checking if all fields are filled
	if ($.tfTitle.getValue().trim() === "" || $.tfDesc.getValue().trim() === "" || $.categoryTitle.idValue === "" || $.brandTitle.idValue === "" || $.genderTitle.idValue === "" || $.conditionTitle.idValue === "" || $.tfStyle.getValue().trim() === "" || $.tfTags.getValue().trim() === "" || $.tfMaterials.getValue() === "" || $.tfProcessingTime.getValue().trim() === "" || $.shipToUS.getValue().trim() === "" || $.shipToElsewhere.getValue().trim() === "") {
		alert(L("missing_field_error"));
		return;
	}

	// Collecting the variation row data and checking if it is empty
	var itemVariationTableRows = $.itemVariationTable.data[0].rows;
	var pinQuantity = {
		"size_id" : [],
		"quantity" : [],
		"price" : []
	};

	for (i in itemVariationTableRows) {

		pinQuantity.size_id.push(itemVariationTableRows[i].children[0].children[0].idValue);
		pinQuantity.quantity.push(itemVariationTableRows[i].children[1].children[0].children[0].getValue());
		pinQuantity.price.push(itemVariationTableRows[i].children[1].children[1].children[0].getValue());
	}

	if (pinQuantity.size_id.length === 0 || pinQuantity.quantity.length === 0 || pinQuantity.price.length === 0) {
		alert(L("missing_field_error"));
		return;
	}

	// Service call uploadpin
	Alloy.Globals.loading.show();
	var data = {
		"token" : Alloy.Globals.currentUser.token,
		"X-form-cmd" : "",
		"gallery" : gallery,
		"category_id" : $.categoryTitle.idValue,
		"title" : $.tfTitle.getValue(),
		"description" : $.tfDesc.getValue(),
		"extended" : {
			"tags" : $.tfStyle.getValue() + ", " + $.tfTags.getValue() + ", " + $.tfMaterials.getValue()
		},
		"itemshipping" : {
			//223 - id for United States
			"country_id" : [223, ""],
			"state_id" : ["", ""],
			"city_id" : ["", ""],
			"price" : [$.shipToUS.getValue(), $.shipToElsewhere.getValue()]
		},
		"shipping" : 1,
		"sell" : 1,
		"pinquantity" : pinQuantity,
		"brand_id" : $.brandTitle.idValue,
		"condition_id" : $.conditionTitle.idValue,
		"gender_id" : $.genderTitle.idValue,
		"group" : $.groupsTitle.idValue
	};

	// Edit pin post request
	if (args.pin) {
		data.id = args.pin.id;
		data['X-form-cmd'] = x_form;
		
		console.debug('Edit item mode');

		Alloy.Globals.API.editPinUpdate(data, function(result) {

			if (result.Error || result.errors) {
				alert('enter_valid_details');
			} else {
				// clear all fields
				gallery.length = 0;
				$.tfTitle.setValue("");
				$.tfDesc.setValue("");
				$.categoryTitle.idValue = "";
				$.categoryTitle.setText("");
				$.groupsTitle.idValue = "";
				$.groupsTitle.setText("");
				$.brandTitle.idValue = "";
				$.brandTitle.setText("");
				$.genderTitle.idValue = "";
				$.genderTitle.setText("");
				$.conditionTitle.idValue = "";
				$.conditionTitle.setText("");
				$.tfStyle.setValue("");
				$.tfTags.setValue("");
				$.tfMaterials.setValue("");
				$.tfProcessingTime.setValue("");
				$.shipToUS.setValue("");
				$.shipToElsewhere.setValue("");
			}
			
			alert("Product Successfully Updated");
			Alloy.Globals.loading.hide();
			Alloy.Globals.pageflow.back();
		}, function(error) {

			alert(L('pin_upload_error'));
			Alloy.Globals.loading.hide();
		});
	} else {
		// Upload pin post request
		Alloy.Globals.API.addNewItem(data, function(result) {

			if (result.Error || result.errors) {
				alert('enter_valid_details');
			} else {
				// clear all fields
				gallery.length = 0;
				$.tfTitle.setValue("");
				$.tfDesc.setValue("");
				$.categoryTitle.idValue = "";
				$.categoryTitle.setText("");
				$.groupsTitle.idValue = "";
				$.groupsTitle.setText("");
				$.brandTitle.idValue = "";
				$.brandTitle.setText("");
				$.genderTitle.idValue = "";
				$.genderTitle.setText("");
				$.conditionTitle.idValue = "";
				$.conditionTitle.setText("");
				$.tfStyle.setValue("");
				$.tfTags.setValue("");
				$.tfMaterials.setValue("");
				$.tfProcessingTime.setValue("");
				$.shipToUS.setValue("");
				$.shipToElsewhere.setValue("");
			}
			
			alert("Product Successfully Added");

			Alloy.Globals.loading.hide();
			Alloy.Globals.pageflow.back();
		}, function(error) {

			alert(L('pin_upload_error'));
			Alloy.Globals.loading.hide();
		});
	}
});
