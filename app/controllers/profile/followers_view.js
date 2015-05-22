var args = arguments[0] || {};

Ti.API.info('Current User: ' + JSON.stringify(Alloy.Globals.currentUser));

if (Alloy.Globals.currentUser.user_info.id) {

	Alloy.Globals.API.findFollowers(2190, function(result) {

		Ti.API.info('result: ' + JSON.stringify(result));

		var tableData = [];

		for (var i in result) {

			tableData.push(Alloy.createController('profile/user_view', result[i]).getView());
		}

		$.followersTable.setData(tableData);

	}, function(error) {

	});
}