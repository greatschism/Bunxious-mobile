var args = arguments[0] || {};

var moment = require('alloy/moment');

if (args.fromWhoFav) {
	
	$.avatar.image = args.avatar ? args.avatar : '/images/placeholder.png';	
}
else {
	
	$.avatar.image = args.avatar_medium == null ? '/images/placeholder.png' : args.avatar_medium.image;
}

$.userName.text = args.firstname + ' ' + args.lastname;
$.gender.text = args.gender ? Alloy.Globals.toTitleCase(args.gender) : '';

if (args.following_user == "1") {
	
	$.followIcon.image = '/images/minuswhite.png';
	$.follow.text = L('unfollow');
	$.followButton.width = '90dp';
	$.contactButton.left = '177dp';
} else {
	
	$.follow.text = L('follow');
}

$.followButton.addEventListener('click', function(e) {
	
	Alloy.Globals.API.follow(args.id, function(response) {

		if (response.isFollow) {
			
			$.followIcon.image = '/images/minuswhite.png';
			$.follow.setText(L('unfollow'));
		} else {
			
			$.followIcon.image = '/images/pluswhite.png';
			$.follow.setText(L('follow'));
		}
	});
});

$.contactButton.addEventListener('click', function(e){
	
	Alloy.Globals.loading.show();
	var data = {
		to_user_id : args.id,
		name: args.firstname + " "+ args.lastname,
		avatar: args.avatar_small ? args.avatar_small.image : args.avatar
	};
	
	Alloy.Globals.openWindow('profile/message_view', data, true);
});

var date = moment(args.date_added);
$.joined.text = 'Joined ' + date.format("MMMM D, YYYY");

$.avatar.addEventListener('click', function() {

	Alloy.Globals.openWindow('profile/profile_view', {
		user_id : args.id
	}, true);
});

$.userName.addEventListener('click', function() {

	Alloy.Globals.openWindow('profile/profile_view', {
		user_id : args.id
	}, true);
});
