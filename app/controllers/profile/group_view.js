var args = arguments[0] || {};
var moment = require('alloy/moment');
var group_id = args.group.id;
var group_name = args.group.name;
var filters = {};

$.title.addOnReturn(function(event) {

	Alloy.Globals.API.addPost(event.value, group_id, function(result) {

		if (result.result) {
			$.postsTable.insertRowBefore(0, Alloy.createController('profile/groupPostRow', {
				article : event.value,
				user_avatar : Alloy.Globals.currentUser.user_info.avatar_medium.image,
				user_name : Alloy.Globals.currentUser.user_info.firstname + ' ' + Alloy.Globals.currentUser.user_info.lastname
			}).getView());
			$.title.setValue('');
		} else {

			if (result.message) {

				alert(result.message);
			}
		}
	}, function(error) {
		//TBD
		alert('There was a communication problem, please check your intenet connection and try again.');
	});
});

var posts = [];

// adding names and avatars to comments
for (var i in args.posts.Comments) {

	for (var j in args.posts.Comments[i]) {

		args.posts.Comments[i][j].user_avatar = args.posts.CommentAvatarImg[i][j];
		args.posts.Comments[i][j].user_name = args.posts.CommentAvatarName[i][j];
	}
}

// adding avatars, comments and names to posts

for (var i in args.posts.Post) {

	args.posts.Post[i].user_name = args.posts.PostAvatarName[i];
	args.posts.Post[i].user_avatar = args.posts.PostAvtrImg[i];
	args.posts.Post[i].comments = args.posts.Comments[i];
	args.posts.Post[i].pin_image = args.posts.myPinImg[i];

}

Ti.API.info(args.posts);
var tableData = [];

for (var i in args.posts.Post) {

	tableData.push(Alloy.createController('profile/groupPostRow', args.posts.Post[i]).getView());
}

$.editGroup.addEventListener('click', function() {
	Alloy.Globals.openWindow('profile/createGroup_view', { update : true, id : args.group.id, name : args.group.name, description : args.group.description}, true);
});

$.invite.addEventListener('click', function() {

	var dialog = Ti.UI.createAlertDialog({
		title : 'Enter the name of the user',
		style : Ti.UI.iPhone.AlertDialogStyle.PLAIN_TEXT_INPUT,
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

if(args.group.private != 1 ){
	$.groupTypeTxt.text = "Public";
	$.lockIcon.image ="/images/public.png";
}else{
	$.groupTypeTxt.text = "Private";
	$.lockIcon.image ="/images/private.png";
}

$.groupTitle.text = args.group.name;
$.description.text = args.group.description;

$.members.addEventListener('click', function() {
	Alloy.Globals.openWindow('groups/group_members_list', {group_id:group_id, group_name:group_name}, true);
});

Ti.App.addEventListener("updateGroup_groupView",function(data){
	$.groupTitle.text = data.name;
	$.description.text = data.description;
});

$.postsTable.setData(tableData);

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
			// console.log("key ", key); // shows key
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