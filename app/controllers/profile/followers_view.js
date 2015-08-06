var args = arguments[0] || {};

function postLayout() {
	$.followersView.setHeight($.followersView.rect.height - 25);
	$.followersView.removeEventListener('postlayout', postLayout);
}

if (Titanium.Platform.osname == "android") {
	$.followersView.addEventListener('postlayout', postLayout);
}

if (Alloy.Globals.currentUser.user_info.id) {

	Alloy.Globals.loading.show();
	/*Alloy.Globals.currentUser.user_info.id #added for testing purposes, my account does not have any followers. Forever alone :(#*/
	/*For Testing purpose if you want to check that statically please use this number 2190 */
	
	Alloy.Globals.API.findFollowers(Alloy.Globals.currentUser.user_info.id, function(result) {
		
		console.debug("My-Followers-result ", JSON.stringify(result));
		
		if(result.length === 0){
			// No followers
			$.noFollowers.setHeight('30dp');
			$.noFollowers.setVisible(true);
		}
		
		var tableData = [];

		for (var i in result) {

			//Use user list view 
			tableData.push(Alloy.createController('profile/user_view', result[i]).getView());
		}

		$.followersTable.setData(tableData);

		Alloy.Globals.loading.hide();
	}, function(error) {

		Alloy.Globals.loading.hide();
	});
}