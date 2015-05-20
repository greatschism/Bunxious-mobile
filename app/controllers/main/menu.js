var args = arguments[0] || {};

function updateMenu() {

	if (Alloy.Globals.currentUser) {

		$.login_logout.setTitle(L('sign_out'));
		$.login_logout.setIcon('/images/logout.png');
		$.userName.text = Alloy.Globals.currentUser.user_info.firstname + ' ' + Alloy.Globals.currentUser.user_info.lastname;
		$.userPicture.image = Alloy.Globals.currentUser.user_info.avatar_medium.image;
		$.userInfo.height = '60dp';
		$.firstLoginDependant.height = Ti.UI.SIZE;
		$.secondLoginDependant.height = Ti.UI.SIZE;

		// Setting a flag for eventListener
		$.login_logout.action = 'logout';
	} else {

		$.login_logout.setTitle(L('login'));
		$.login_logout.setIcon('/images/login.png');
		$.userInfo.height = '0dp';
		$.firstLoginDependant.height = '0dp';
		$.secondLoginDependant.height = '0dp';

		// Setting a flag for eventListener
		$.login_logout.action = 'login';
	}
}

$.login_logout.button.addEventListener('click', function() {

	Ti.App.fireEvent('toggleMenu');

	if ($.login_logout.action == 'login') {

		Alloy.createController('auth/login').getView().open();
	} else if ($.login_logout.action == 'logout') {

		Alloy.Globals.API.logout(function() {

			Alloy.Globals.currentUser = null;
			updateMenu();
		});
	}
});

updateMenu();

$.homeButton.button.addEventListener('click', function() {

	Ti.App.fireEvent('toggleMenu');

	Alloy.Globals.openWindow('main/home_view');
});

$.activityButton.button.addEventListener('click', function() {

	Ti.App.fireEvent('toggleMenu');

	Alloy.Globals.openWindow('activity/activity_view');
});

$.favoriteButton.button.addEventListener('click', function() {

	Ti.App.fireEvent('toggleMenu');

	Alloy.Globals.openWindow('profile/favorite_view');
});

$.closetButton.button.addEventListener('click', function() {

	Ti.App.fireEvent('toggleMenu');

	Alloy.Globals.openWindow('profile/closet_view');
});

$.conversationButton.button.addEventListener('click', function() {

	Ti.App.fireEvent('toggleMenu');

	Alloy.Globals.openWindow('profile/conversation_view');
});

$.followersButton.button.addEventListener('click', function() {

	Ti.App.fireEvent('toggleMenu');

	Alloy.Globals.openWindow('profile/followers_view');
});

$.treasureButton.button.addEventListener('click', function() {

	Ti.App.fireEvent('toggleMenu');

	Alloy.Globals.openWindow('profile/treasure_view');
});

$.cartButton.button.addEventListener('click', function() {

	Ti.App.fireEvent('toggleMenu');

	Alloy.Globals.openWindow('profile/cart_view');
});

$.ordersButton.button.addEventListener('click', function() {

	Ti.App.fireEvent('toggleMenu');

	Alloy.Globals.openWindow('profile/orders_view');
});

$.addButton.button.addEventListener('click', function() {

	Ti.App.fireEvent('toggleMenu');

	Alloy.Globals.openWindow('product/add_view');
});

$.settingsButton.button.addEventListener('click', function() {

	Ti.App.fireEvent('toggleMenu');

	Alloy.Globals.openWindow('misc/settings_view');
});

$.userInfo.addEventListener('click', function() {
	
	Ti.App.fireEvent('toggleMenu');

	Alloy.Globals.openWindow('profile/profile_view', {
		user_id : Alloy.Globals.currentUser.user_info.id
	}, true);
});


// Will be triggered from login, to update the menu
Ti.App.addEventListener('loggedIn', function() {

	updateMenu();
});
