var args = arguments[0] || {};



$.close.addEventListener('click', function(){
	$.add_address_win.close();
});

$.save_address.addEventListener('click', function() {

	var recipient = $.recipient_name.value;
	var city = $.city.value;
	var address = $.address.value;
	var alias = $.address.value;
	
	Alloy.Globals.API.addAddress(alias, recipient, 223, city, address, function(results) {

		console.log(results);
		// Close this window on save success.
		$.add_address_win.close();

	}, function(error) {


	});
	
	
});
