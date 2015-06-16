var args = arguments[0] || {};
var validator = require('validators');

// Mark the checkbox if the user clicks the label
$.disclaimer.addEventListener('click', function() {

	$.checkbox.value = !$.checkbox.value;
});

$.login_to.addEventListener('click', function() {

	$.registerWindow.close();
});

$.register_button.addEventListener('click', function() {

	if ($.pass.getValue() != $.pass2.getValue()) {

		alert('Passwords don\'t match');
		return;
	}

	if (!validator.email($.email.getValue())) {

		alert('Please enter a valid email');
		return;
	}

	Alloy.Globals.API.createAccount($.username.getValue(), $.pass.getValue(), $.email.getValue(), $.firstname.getValue(), $.lastname.getValue(), function(currentUser) {

		$.registerWindow.close();
		
		// saving the current user
		Alloy.Globals.currentUser = currentUser;
		
		//Also saving the token, for autologin
		Ti.App.Properties.setString('token', currentUser.token);

		// Updating the main menu
		Ti.App.fireEvent('loggedIn');
		Alloy.createController('main/home_view', {
			fromAnotherController : true
		}).populateTable();
		
		args.loginWindow.close();

	}, function(error) {

		alert('Error creating your account');
	});
});
