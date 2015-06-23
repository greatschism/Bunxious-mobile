var args = arguments[0] || {};
var moment = require('alloy/moment');

$.avatar.image = args.image;
$.username.text = args.fullName;
$.ago.text = moment(args.date).fromNow();
$.text.text = args.title;

$.row.addEventListener('click', function() {

	Alloy.Globals.loading.show();

	Alloy.Globals.API.getMessages(args.conversation, function(result) {

		// passing them along to know who we are talking to
		result.with = {
			name : args.fullName,
			avatar : args.image
		};

		Alloy.Globals.openWindow('profile/message_view', result, true);
		Alloy.Globals.loading.hide();
	}, function(error) {

		Alloy.Globals.loading.hide();
	});
});

