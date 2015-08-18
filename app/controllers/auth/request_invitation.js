var args = arguments[0] || {};
var validator = require('validators');

$.login_to.addEventListener('click', function() {
	
	$.requestWindow.close();
});

$.closeButton.addEventListener('click', function() {
	
	$.requestWindow.close();
});

$.request_button.addEventListener('click', function() {
	
	if (!validator.email($.email.getValue())) {

		alert('Please enter a valid email');
		return;
	}
	
	Alloy.Globals.API.requestInvite($.firstname.getValue(), $.lastname.getValue(), $.email.getValue(), function(result) {
		if (result && result.success) {
			
			alert(result.success);
		}
		else if (result && result.error) {
			
			alert(result.error);
		}
		else if (result && result.Error) {
			
			alert(result.Error);
		}
	}, function(error) {

		if (error && typeof error == 'string') {
			
			alert(error);
		}
	});
});
