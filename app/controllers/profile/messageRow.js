var args = arguments[0] || {};
var moment = require('alloy/moment');

$.avatar.image = args.image;
$.username.text = args.fullName;
$.ago.text = moment(args.date, 'DD.MM.YYYY HH:mm:ss').fromNow();
$.text.text = args.title;

Ti.API.error(args);
$.row.addEventListener('click', function() {

	Alloy.Globals.loading.show();
	
	var data = {
		conversation_id : args.conversation
	};

	Alloy.Globals.API.getMessages(data, function(result) {

		// passing them along to know who we are talking to
		result = {
			conversation_id : args.conversation,
			name : args.fullName,
			avatar : args.image,
			to_user_id : args.user_id
		};

		Alloy.Globals.openWindow('profile/message_view', result, true);
		Alloy.Globals.loading.hide();
	}, function(error) {

		Alloy.Globals.loading.hide();
	});
});

$.row.addEventListener('longpress', function() {

	var dialog = Ti.UI.createOptionDialog({
		cancel : 2,
		options : ['Delete', 'Cancel'],
		selectedIndex : 1,
		destructive : 0,
	});

	dialog.addEventListener('click', function(event) {

		if (event.index == 0) {

			Alloy.Globals.API.deleteConversation(args.conversation, function(result) {

				$.row.animate({
					height : 0
				});
			}, function(error) {
				//TBD
			});
		}
	});

	dialog.show();
});