// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

Alloy.Globals.Facebook = require('facebook');

Alloy.Globals.jolicode = {};
Alloy.Globals.jolicode.pageflow = {};
Alloy.Globals.jolicode.pageflow.height = Ti.Platform.displayCaps.platformHeight;
Alloy.Globals.jolicode.pageflow.width = Ti.Platform.displayCaps.platformWidth;

if (OS_ANDROID) {
	Alloy.Globals.jolicode.pageflow.height = Ti.Platform.displayCaps.platformHeight / Ti.Platform.displayCaps.logicalDensityFactor;
	Alloy.Globals.jolicode.pageflow.width = Ti.Platform.displayCaps.platformWidth / Ti.Platform.displayCaps.logicalDensityFactor;
}

Alloy.Globals.API = require('api');
Alloy.Globals.Utils = require('utils');

// Storing the currentUser here for global access
Alloy.Globals.currentUser = null;

// Storing pageflow here for global access
Alloy.Globals.pageflow = null;

var currentPage = null;

Alloy.Globals.openWindow = function(controller, arguments, newOne) {

	if (Alloy.Globals.pageflow.getCurrentPage() == null || newOne === true) {

		Alloy.Globals.pageflow.addChild({
			arguments : arguments,
			controller : controller,
			backButton : {
				image : '/images/undowhite.png',
				width : '30dp',
				height : '30dp',
				left : 10,
				hidden : newOne === true ? false : true
			},
			navBar : {
				backgroundColor : '#62949b',
				left : 'misc/openMenu'
			},
			direction : {
				top : 0,
				left : 1
			}
		});

		if (!newOne) {

			currentPage = controller;
		}
	} else if (currentPage != controller) {

		Alloy.Globals.pageflow.replacePage(0, {
			arguments : arguments,
			controller : controller,
			backButton : {
				hidden : true
			},
			navBar : {
				backgroundColor : '#62949b',
				left : 'misc/openMenu'
			},
			direction : {
				top : 0,
				left : 1
			}
		});
		currentPage = controller;
	}
};

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

Alloy.Globals.findBrandById = function(id) {
	var index = Alloy.Globals.findIndexWithAttribute(Alloy.Globals.brandFilters,'id',id.toString());
	return Alloy.Globals.brandFilters[index];
};

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

Alloy.Globals.findSizeById = function(id) {
	var index = Alloy.Globals.findIndexWithAttribute(Alloy.Globals.sizeFilters,'id',id.toString());
	return Alloy.Globals.sizeFilters[index];
};

// Get States
Alloy.Globals.API.getStates(function(results) {
	
	Ti.API.info("States Result-------->"+results.Result);
	Ti.API.info("States Result.Data--->"+JSON.stringify(results.Data));
	Ti.API.info("states results------->"+ results.length);
	
	var items = [];
	if(results.length){
		for(var i in results.Data){
			items.push({
				"title" : results.Data[i].name,
				"id" : results.Data[i].id,
				"iso_code_3" : results.Data[i].iso_code_3
			});
		}
	}

	Alloy.Globals.StateFilters = JSON.parse(JSON.stringify(items));

}, function(error) {

});


// Get Condition
Alloy.Globals.API.getCondition(function(results) {

	Alloy.Globals.conditionFilters = JSON.parse(JSON.stringify(results));

}, function(error) {

});

Alloy.Globals.findConditionById = function(id) {
	var index = Alloy.Globals.findIndexWithAttribute(Alloy.Globals.conditionFilters,'id',id.toString());
	return Alloy.Globals.conditionFilters[index];
};

// Get Countries
Alloy.Globals.API.getAllCountries(function(results) {

	Alloy.Globals.countryFilters = JSON.parse(JSON.stringify(results));

}, function(error) {

});

Alloy.Globals.getCountryByCode = function(code) {
	return Alloy.Globals.countryFilters.filter(function(obj){return obj.iso_code_3 == code;});
};

Alloy.Globals.getCountryByName = function(country) {
	return Alloy.Globals.countryFilters.filter(function(obj){return obj.title == country;});
};

Alloy.Globals.findIndexWithAttribute = function(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
};

Alloy.Globals.getIDByItem = function(list, item) {
	var id;
	
	for (i in list){
		if(list[i].title === item){
			id = list[i].id;
			break;
		}
	}
	return id;
};

Alloy.Globals.createFilter = function(list, label){
	
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
			label.idValue = Alloy.Globals.getIDByItem(list, e.row.data.title);
			
		});

		popupDialog.getView().show();
};

Alloy.Globals.uploadImage = function(callback){
	var dialog = Ti.UI.createOptionDialog({
		options: ['Camera', 'Gallery', 'Cancel'],
		title: 'Upload image using?'
	});
	
	dialog.show();
	
	dialog.addEventListener('click', function(e){
		
		if(e.index === 0){
			//Open Camera
			Ti.Media.showCamera({
				saveToPhotoGallery : true,

				success : function(event) {
					var image = event.media;
					Alloy.Globals.loading.show();
					callback(image);
				},

				cancel : function(e) {
				},

				error : function(e) {
				},

				showControls : true,
				mediaTypes : Ti.Media.MEDIA_TYPE_PHOTO,
				autohide : false
			});
		} else if(e.index === 1){
			//Open gallery
			Ti.Media.openPhotoGallery({
				success : function(event) {
					var image = event.media;
					Alloy.Globals.loading.show();
					callback(image);
				},

				cancel : function(e) {
				},

				error : function(e) {
				},
			}); 
		} else {
			// Do nothing
		}
		dialog.hide();
	});
	
};

Alloy.Globals.loading = Alloy.createWidget("nl.fokkezb.loading");

Alloy.Globals.priceList = [{
 title : '$0 - $10',
 cost : '$10'
 }, {
 title : '$10 - $20',
 cost : '$20'
 }, {
 title : '$20 - $50',
 cost : '$50'
 }, {
 title : '$50 - $100',
 cost : '$50'
 },{
 title : '$100 or more',
 cost : '$50'
 }];
