var args = arguments[0] || {};

var moment = require('alloy/moment');

$.avatar.image = args.avatar_medium.image;
$.userName.text = args.firstname + ' ' + args.lastname;
$.gender.text = args.gender ? args.gender : '';

if (args.following_user == "1") {
	
	$.follow.text = L('unfollow');
	$.followButton.width = '90dp';
	$.contactButton.left = '177dp';
} else {
	
	$.follow.text = L('follow');
}

$.followButton.addEventListener('click', function(e) {
	// console.debug("User view - args ", JSON.stringify(args));
	
	Alloy.Globals.API.follow(args.id, function(response) {
		// console.debug("follow-unfollow response ", JSON.stringify(response));

		if (response.isFollow) {
			$.follow.setText(L('unfollow'));
		} else {
			$.follow.setText(L('follow'));
		}
	});
});

var date = moment(args.date_added);
$.joined.text = 'Joined ' + date.format("MMMM D, YYYY");

$.avatar.addEventListener('click', function() {

	Alloy.Globals.openWindow('profile/profile_view', {
		user_id : args.id
	}, true);
});
