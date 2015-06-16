var args = arguments[0] || {};

if (Alloy.Globals.currentUser.user_info.id) {
	
	Alloy.Globals.loading.show();

	Alloy.Globals.API.findFollowers(/*Alloy.Globals.currentUser.user_info.id #added for testing purposes, my account does not have any followers. Forever alone :(#*/ 2190, function(result) {

		var tableData = [];

		for (var i in result) {

			tableData.push(Alloy.createController('profile/user_view', result[i]).getView());
		}

		$.followersTable.setData(tableData);
		
		Alloy.Globals.loading.hide();
	}, function(error) {
		
		Alloy.Globals.loading.hide();
	});
}