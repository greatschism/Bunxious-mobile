var args = arguments[0] || {};

$.request_invite.addEventListener('click', function() {

	Alloy.createController('auth/request_invitation').getView().open();
});

$.create_account.addEventListener('click', function() {

	var registerWindow = Alloy.createController('auth/register').getView();

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
