var args = arguments[0] || {};

// Mark the checkbox if the user clicks the label
$.disclaimer.addEventListener('click', function() {
	
	$.checkbox.value = !$.checkbox.value;
});

$.login_to.addEventListener('click', function() {
	
	$.registerWindow.close();
});
