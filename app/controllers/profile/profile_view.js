var args = arguments[0] || {};

if (args.user_id) {
	
	Alloy.Globals.API.getUser(args.user_id, function(result) {
		
		$.avatar.image = result.avatar_medium.image;
		$.userName.text = result.firstname + ' ' + result.lastname;
		
		if (result.city && result.country_iso_code_3) {
			
			$.userLocation.text = result.city + ', ' + result.country_iso_code_3;
		}
		else if (result.city || result.country_iso_code_3) {
			
			$.userLocation.text = result.city || result.country_iso_code_3;
		}
	}, function(error) {
		
	});
}
