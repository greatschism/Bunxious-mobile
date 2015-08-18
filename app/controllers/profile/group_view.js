var args = arguments[0] || {};
var moment = require('alloy/moment');
var group_id = args.group.id;
var group_name = args.group.name;
var group_private = args.group.private;
var filters = {},
    uploadedImage = null;

function postLayout() {
	$.postsTable.setHeight($.postsTable.rect.height - 25);
	$.postsTable.removeEventListener('postlayout', postLayout);
}

if (Titanium.Platform.osname == "android") {
	$.postsTable.addEventListener('postlayout', postLayout);
}

function resetFilterSelection() {
	filters = {};
	$.categoryLabel.text = L('all_items');
	$.brandLabel.text = L('brand');
	$.genderLabel.text = L('gender');
	$.sizeLabel.text = L('size');
	$.priceLabel.text = L('price');
}

function processPosts(data) {
	// adding names and avatars to comments
	console.log('DATA:' + JSON.stringify(data));
	for (var i in data.posts.Comments) {

		for (var j in data.posts.Comments[i]) {

			data.posts.Comments[i][j].user_avatar = data.posts.CommentAvatarImg[i][j];
			data.posts.Comments[i][j].user_name = data.posts.CommentAvatarName[i][j];
		}
	}

	// adding avatars, comments and names to posts

	for (var i in data.posts.Post) {

		data.posts.Post[i].user_name = data.posts.PostAvatarName[i];
		data.posts.Post[i].user_avatar = data.posts.PostAvtrImg[i];
		data.posts.Post[i].comments = data.posts.Comments[i];
		data.posts.Post[i].pin_image = data.posts.myPinImg[i];
		data.posts.Post[i].title = data.posts.myPin[i].title;
		data.posts.Post[i].description = data.posts.myPin[i].description;

	}

	var tableData = [];

	for (var i in data.posts.Post) {

		tableData.push(Alloy.createController('profile/groupPostRow', data.posts.Post[i]).getView());
	}

	$.postsTable.setData(tableData);
}

function loadGroupPosts() {
	Alloy.Globals.loading.show();
	Alloy.Globals.API.getGroup(group_id, function(result) {
		processPosts({
			posts : result
		});
		Alloy.Globals.loading.hide();
	}, function(error) {
		//TBD
		Alloy.Globals.loading.hide();
	});
}

function postInGroup() {
	Alloy.Globals.loading.show();
	Alloy.Globals.API.addPost($.title.getValue().trim(), group_id, uploadedImage, function(result) {
		if (result.result) {
			loadGroupPosts();
			$.title.setValue('');
			uploadedImage = null;
			$.postImage.image = null;
			$.postImage.visible = false;

			Ti.App.fireEvent("updateGroup");
		} else {
			if (result.message) {
				alert(result.message);
				Alloy.Globals.loading.hide();
			}
		}
	}, function(error) {
		//TBD
		alert('There was a communication problem, please check your intenet connection and try again.');
		Alloy.Globals.loading.hide();
	});
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
			// console.log("key ", key); // shows key
			keyArray.push(key);
		}

		// Checking the filter type
		if (filterType === "category") {

			filters['pin_filter[category.widget.filter][category_id]'] = Alloy.Globals.getIDByItem(list, e.row.data.title);

		} else if (filterType === "brand") {

			filters['pin_filter[brand.widget.filter][brand_id]'] = Alloy.Globals.getIDByItem(list, e.row.data.title);

		} else if (filterType === "gender") {

			filters['pin_filter[gender.widget.filter][gender_id]'] = Alloy.Globals.getIDByItem(list, e.row.data.title);

		} else if (filterType === "size") {

			filters['pin_filter[size.widget.filter][size_id]'] = Alloy.Globals.getIDByItem(list, e.row.data.title);

		} else if (filterType === "price") {

			filters['pin_filter[pricefilter.widget.filter][from]'] = min;
			// + '&filters[price]=' + max;
			filters['pin_filter[pricefilter.widget.filter][to]'] = max;
		}

		// Call the service
		Alloy.Globals.loading.show();
		var productArray = [];
		Alloy.Globals.API.getGroupPins(group_id, filters, function(results) {

			if (results.result) {
				for (var i in results.Pins) {
					var pin = {};
					pin = JSON.parse(JSON.stringify(results.Pins[i]));
					pin.image_big = {}, pin.user = {}, pin.user.avatar_medium = {};
					pin.image_big.image = results.PinImg[i].image;
					pin.user.avatar_medium.image = results.Avatar[i];
					productArray.push(Alloy.createController('product/productRow', pin).getView());
				}
			} else {
				productArray.push(Ti.UI.createTableViewRow({
					title : 'No results.'
				}));
			}

			$.postsTable.setData(productArray);
			Alloy.Globals.loading.hide();

		}, function(error) {
			alert('No Data Found');
			productArray = [];
			$.postsTable.setData(productArray);
			Alloy.Globals.loading.hide();
		});

	});

	popupDialog.getView().show();
}

$.cameraIcon.addEventListener('click', function() {

	var image = Alloy.Globals.uploadImage(function(image) {
		Alloy.Globals.loading.show();

		Alloy.Globals.API.feedUploadImage(image, function(result) {
			uploadedImage = result.file;
			$.postImage.image = image;
			$.postImage.visible = true;

			Alloy.Globals.loading.hide();
		}, function(error) {
			Alloy.Globals.loading.hide();
		});
	});
});

$.postInGroup.addEventListener('click', function() {

	if ($.title.getValue().trim() === "") {
		return;
	}

	postInGroup();
});

$.title.addOnReturn(function() {

	if ($.title.getValue().trim() === "") {
		return;
	}

	postInGroup();
});

$.editGroup.addEventListener('click', function() {
	Alloy.Globals.openWindow('profile/createGroup_view', {
		update : true,
		id : args.group.id,
		name : args.group.name,
		description : args.group.description,
		private : args.group.private
	}, true);
});

$.invite.addEventListener('click', function() {

	var dialog = Ti.UI.createAlertDialog({
		title : 'Enter the name of the user',
		style : OS_IOS ? Ti.UI.iPhone.AlertDialogStyle.PLAIN_TEXT_INPUT : null,
		buttonNames : ['Invite', 'Cancel'],
		cancel : 1
	});

	dialog.addEventListener('click', function(e) {

		if (e.index == 0) {

			Alloy.Globals.API.inviteUserToGroup(group_id, e.text, function(result) {

				if (result && result.message) {

					alert(result.message);
				}
			}, function(error) {
				//TBD
			});
		}
	});
	dialog.show();
});

if (args.group.private != 1) {
	$.groupTypeTxt.text = "Public";
	$.lockIcon.image = "/images/public.png";
} else {
	$.groupTypeTxt.text = "Private";
	$.lockIcon.image = "/images/private.png";
}

$.groupTitle.text = args.group.name;
$.description.text = args.group.description;

$.members.addEventListener('click', function() {

	Alloy.Globals.openWindow('groups/group_members_list', {
		group_id : group_id,
		group_name : group_name,
		group_private : group_private
	}, true);
});

Ti.App.addEventListener("updateGroup_groupView", function(data) {
	$.groupTitle.text = data.name;
	$.description.text = data.description;
	if (data.private != 1) {
		$.groupTypeTxt.text = "Public";
		$.lockIcon.image = "/images/public.png";
		args.group.private = 0;
	} else {
		$.groupTypeTxt.text = "Private";
		$.lockIcon.image = "/images/private.png";
		args.group.private = 1;
	}
});

//================== Group items Filter==============

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
	Alloy.Globals.priceFilters = JSON.parse(JSON.stringify(Alloy.Globals.priceListOptions));
	createFilter(Alloy.Globals.priceListOptions, $.priceLabel, "price");
});

$.resetButton.addEventListener('click', function() {
	resetFilterSelection();
	processPosts(args);
});

processPosts(args);
