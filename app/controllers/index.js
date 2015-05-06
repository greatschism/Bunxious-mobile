
function goToLogin() {
	
	var loginWindow = Alloy.createController('auth/login').getView();
	
	// We now have to create a facebook proxy for Android (FB module > 4.0) 
	if (OS_ANDROID) {
	
		loginWindow.fbProxy = Alloy.Globals.Facebook.createActivityWorker({lifecycleContainer: loginWindow});
	}
	
	loginWindow.open();
}


// Check if user is already logged in
if (false) {
	
	//proceed to main
}
else {
	
	goToLogin();
}
