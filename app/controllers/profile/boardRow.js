var args = arguments[0] || {};
var moment = require('alloy/moment');

$.title.text = args.title;
$.ago.text = moment(args.date_added).fromNow();
$.text.text = args.description;

Ti.API.error(args);
$.row.addEventListener('click', function() {

	Alloy.Globals.loading.show();

	Alloy.Globals.API.getBoardPins(args.id, function(result) {

		Alloy.Globals.openWindow('profile/board_view', {
			pins : result
		}, true);
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