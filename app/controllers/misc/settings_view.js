var args = arguments[0] || {};

var genders = ['male','female','unsigned'];

var countryList = [];
for(var c in Alloy.Globals.countryFilters) {
	countryList.push(Alloy.Globals.countryFilters[c].title);
}
$.country.setOptions(countryList);

var stateList = [];
for(var s in Alloy.Globals.StateFilters) {
	stateList.push(Alloy.Globals.StateFilters[s].title);
}
$.state.setOptions(stateList);

if (Alloy.Globals.currentUser != null) {

	$.firstname.getField().value = Alloy.Globals.currentUser.user_info.firstname;
	$.lastname.getField().value = Alloy.Globals.currentUser.user_info.lastname;
	$.username.getField().value = Alloy.Globals.currentUser.user_info.username;
	$.email.getField().value = Alloy.Globals.currentUser.user_info.email;
	$.city.getField().value = Alloy.Globals.currentUser.user_info.city;
	var index = Alloy.Globals.findIndexWithAttribute(Alloy.Globals.countryFilters,'iso_code_3',Alloy.Globals.currentUser.user_info.country_iso_code_3);
	$.country.setSelectedIndex(index);
	
	 var stateIndex = Alloy.Globals.findIndexWithAttribute(Alloy.Globals.StateFilters,'code',Alloy.Globals.currentUser.user_info.state);
	 $.state.setSelectedIndex(stateIndex);
 		
	$.gender.setSelectedIndex(genders.indexOf(Alloy.Globals.currentUser.user_info.gender));
	$.about.getField().value = Alloy.Globals.currentUser.user_info.about;
	$.website.getField().value = Alloy.Globals.currentUser.user_info.website;
	$.search_engines.setValue(Alloy.Globals.currentUser.user_info.search_engines);
	$.notification_group_board.setValue(Alloy.Globals.currentUser.user_info.notification_group_board);
	$.notification_comment_pin.setValue(Alloy.Globals.currentUser.user_info.notification_comment_pin && Alloy.Globals.currentUser.user_info.notification_mentioned ? true : false);
	$.notification_like_pin.setValue(Alloy.Globals.currentUser.user_info.notification_like_pin);
	$.notification_repin_pin.setValue(Alloy.Globals.currentUser.user_info.notification_repin_pin);
	$.notification_follow_user.setValue(Alloy.Globals.currentUser.user_info.notification_follow_user);

	$.saveButton.addEventListener('click', function() {
		
		Alloy.Globals.loading.show();

		Alloy.Globals.currentUser.user_info.firstname = $.firstname.getField().value;
		Alloy.Globals.currentUser.user_info.lastname = $.lastname.getField().value;
		Alloy.Globals.currentUser.user_info.username = $.username.getField().value;
		Alloy.Globals.currentUser.user_info.email = $.email.getField().value;
		Alloy.Globals.currentUser.user_info.city = $.city.getField().value;
		Alloy.Globals.currentUser.user_info.about = $.about.getField().value;
		Alloy.Globals.currentUser.user_info.website = $.website.getField().value;
		Alloy.Globals.currentUser.user_info.search_engines = $.search_engines.getValue();
		Alloy.Globals.currentUser.user_info.notification_group_board = $.notification_group_board.getValue();
		Alloy.Globals.currentUser.user_info.notification_comment_pin = Alloy.Globals.currentUser.user_info.notification_mentioned = $.notification_comment_pin.getValue();
		Alloy.Globals.currentUser.user_info.notification_like_pin = $.notification_like_pin.getValue();
		Alloy.Globals.currentUser.user_info.notification_repin_pin = $.notification_repin_pin.getValue();
		Alloy.Globals.currentUser.user_info.notification_follow_user = $.notification_follow_user.getValue();
		var country = Alloy.Globals.getCountryByName($.country.getValue());
		Alloy.Globals.currentUser.user_info.country_iso_code_3 = country[0].iso_code_3;
		var state = Alloy.Globals.getStateByTitle($.state.getValue());
		Alloy.Globals.currentUser.user_info.state = state[0].code;
		
		var gender = $.gender.getValue();
		Alloy.Globals.currentUser.user_info.gender = genders[$.gender.getOptions().indexOf(gender)];
		
		Alloy.Globals.API.updateUser(Alloy.Globals.currentUser.user_info, function() {

			Alloy.Globals.loading.hide();
			alert('Settings saved');
		}, function() {

			Alloy.Globals.loading.hide();
			alert('There was a problem saving your settings, please check and try again.');
		});
	});
}
