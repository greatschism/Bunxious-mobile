var args = arguments[0] || {};
var moment = require('alloy/moment');

$.avatar.image = args.with.avatar; 
$.username.text = args.with.name;
$.ago.text = moment(args.updated_time).fromNow();
$.text.text = args.comments.data[0].message;

$.row.addEventListener('click', function() {
	
	Alloy.Globals.openWindow('profile/message_view', args, true);
});
