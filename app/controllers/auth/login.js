var args = arguments[0] || {};

$.request_invite.addEventListener('click', function() {

	Alloy.createController('auth/request_invitation').getView().open();
});

$.create_account.addEventListener('click', function() {

	// sending the loginWindow as a parameter to be able to close it when the user creates an account
	var registerWindow = Alloy.createController('auth/register', {
		loginWindow : $.loginWindow
	}).getView();

	// We now have to create a facebook proxy for Android (FB module > 4.0)
	if (OS_ANDROID) {

		registerWindow.fbProxy = Alloy.Globals.Facebook.createActivityWorker({
			lifecycleContainer : registerWindow
		});
	}

	registerWindow.open();
});

$.login_button.addEventListener('click', function() {

	Alloy.Globals.loading.show();

	Alloy.Globals.API.login($.user.getValue(), $.pass.getValue(), function(currentUser) {

		Alloy.Globals.currentUser = currentUser;

		//Also saving the token, for autologin
		Ti.App.Properties.setString('token', currentUser.token);

		Alloy.Globals.API.getBoards(null, function(result) {

			if (!result.error) {

				//storing the user's boards
				Alloy.Globals.currentUser.boards = result;
			}
		}, function(error) {

		});

		// Updating the main menu
		Ti.App.fireEvent('loggedIn');
		Alloy.createController('main/home_view', {
			fromAnotherController : true
		}).populateTable();
		$.loginWindow.close();
	}, function(error) {

		Alloy.Globals.loading.hide();
	});
});

$.closeButton.addEventListener('click', function() {

	$.loginWindow.close();
});
