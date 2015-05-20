var args = arguments[0] || {};

if (Alloy.Globals.currentUser != null) {
	
	$.firstname.getField().value = Alloy.Globals.currentUser.user_info.firstname;
	$.lastname.getField().value = Alloy.Globals.currentUser.user_info.lastname;
	$.username.getField().value = Alloy.Globals.currentUser.user_info.username;
	$.email.getField().value = Alloy.Globals.currentUser.user_info.email;
	$.about.getField().value = Alloy.Globals.currentUser.user_info.about;
	$.website.getField().value = Alloy.Globals.currentUser.user_info.website;
	$.search_engines.setValue(Alloy.Globals.currentUser.user_info.search_engines);
	$.notification_group_board.setValue(Alloy.Globals.currentUser.user_info.notification_group_board);
	$.notification_comment_pin.setValue(Alloy.Globals.currentUser.user_info.notification_comment_pin && Alloy.Globals.currentUser.user_info.notification_mentioned ? true : false);
	$.notification_like_pin.setValue(Alloy.Globals.currentUser.user_info.notification_like_pin);
	$.notification_repin_pin.setValue(Alloy.Globals.currentUser.user_info.notification_repin_pin);
	$.notification_follow_user.setValue(Alloy.Globals.currentUser.user_info.notification_follow_user);
	
	
	$.saveButton.addEventListener('click', function() {
		
		Alloy.Globals.currentUser.user_info.firstname = $.firstname.getField().value;
		Alloy.Globals.currentUser.user_info.lastname = $.lastname.getField().value;
		Alloy.Globals.currentUser.user_info.username = $.username.getField().value;
		Alloy.Globals.currentUser.user_info.email = $.email.getField().value;
		Alloy.Globals.currentUser.user_info.about = $.about.getField().value;
		Alloy.Globals.currentUser.user_info.website = $.website.getField().value;
		Alloy.Globals.currentUser.user_info.search_engines = $.search_engines.getValue();
		Alloy.Globals.currentUser.user_info.notification_group_board = $.notification_group_board.getValue();
		Alloy.Globals.currentUser.user_info.notification_comment_pin = Alloy.Globals.currentUser.user_info.notification_mentioned = $.notification_comment_pin.getValue();
		Alloy.Globals.currentUser.user_info.notification_like_pin = $.notification_like_pin.getValue();
		Alloy.Globals.currentUser.user_info.notification_repin_pin = $.notification_repin_pin.getValue();
		Alloy.Globals.currentUser.user_info.notification_follow_user = $.notification_follow_user.getValue();
		
		Alloy.Globals.API.updateUser(Alloy.Globals.currentUser.user_info, function() {
			
			alert('Data succesfully saved.');
		}, function() {
			
			alert('Data save failed.');
		});
	});
}
