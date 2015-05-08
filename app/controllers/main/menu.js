var args = arguments[0] || {};

function updateMenu() {
	
	if (Alloy.Globals.currentUser) {

		$.login_logout.setTitle(L('sign_out'));
		$.login_logout.setIcon('/images/logout.png');
		$.userName.text = Alloy.Globals.currentUser.user_info.firstname + ' ' + Alloy.Globals.currentUser.user_info.lastname;
		$.userPicture.image = Alloy.Globals.currentUser.user_info.avatar_medium.image;
		$.userInfo.height = '60dp';
		
		// Setting a flag for eventListener
		$.login_logout.action = 'logout';
	} else {

		$.login_logout.setTitle(L('login'));
		$.login_logout.setIcon('/images/login.png');
		$.userInfo.height = '0dp';
		
		// Setting a flag for eventListener
		$.login_logout.action = 'login';
	}
}

updateMenu();

$.login_logout.button.addEventListener('click', function() {
	
	if ($.login_logout.action == 'login') {
		
		 Alloy.createController('auth/login').getView().open();
	}
	else if ($.login_logout.action == 'logout') {
		
		Alloy.Globals.API.logout(function() { 
			
			Alloy.Globals.currentUser = null;
			updateMenu();
		});
	}
});

// Will be triggered from login, to update the menu
Ti.App.addEventListener('loggedIn', function() {
	
	updateMenu();
});
