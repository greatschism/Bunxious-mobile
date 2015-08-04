var args = arguments[0] || {};

$.close.addEventListener('click', function(){
	$.add_address_win.close();
});

$.save_address.addEventListener('click', function() {
	// Call save address API here.
	
	// Close this window on save success.
	$.add_address_win.close();
});
