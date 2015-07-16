var args = arguments[0] || {};
var moment = require('alloy/moment');

if (args) {

	var text;

	switch (args.action) {
	case 'LIKEPIN':
		text = args.firstname + ' ' + args.lastname + ' liked your pin(' + args.pin + ')';
		break;
	case 'FOLLOW':
		text = args.firstname + ' ' + args.lastname + ' follows you';
		break;
	case 'REPIN':
		text = args.firstname + ' ' + args.lastname + ' repinned ' + args.pin;
		break;
	}
		
	var ago = moment(args.date_added).fromNow();
	
	$.text.text = text;
	$.ago.text = ago;
}
