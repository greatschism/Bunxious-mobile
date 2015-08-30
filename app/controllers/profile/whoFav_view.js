var args = arguments[0] || {};

function postLayout() {
	$.followersView.setHeight($.followersView.rect.height - 25);
	$.followersView.removeEventListener('postlayout', postLayout);
}

if (Titanium.Platform.osname == "android") {
	$.followersView.addEventListener('postlayout', postLayout);
}

if (args.Data === "No data Found") {

	// No favs
	$.noFollowers.setHeight('30dp');
	$.noFollowers.setVisible(true);
} else {
	var tableData = [];

	// merging the userAvatar and userInfo objects
	for (var i in args.Data.userAvatar) {

		args.Data.userInfo[i].avatar = args.Data.userAvatar[i];

		// some properties are different than the usual ones, marking it so we can deal with that
		args.Data.userInfo[i].fromWhoFav = true;

		tableData.push(Alloy.createController('profile/user_view', args.Data.userInfo[i]).getView());
	}

	$.followersTable.setData(tableData);
}
