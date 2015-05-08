var args = arguments[0] || {};

if (Alloy.Globals.currentUser) {
	
	$.userName.text = Alloy.Globals.currentUser.user_info.firstname + ' ' +  Alloy.Globals.currentUser.user_info.lastname;
	$.userPicture.image = Alloy.Globals.currentUser.user_info.avatar_medium.image;
}