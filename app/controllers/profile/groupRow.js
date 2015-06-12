var args = arguments[0] || {};
var moment = require('alloy/moment');

$.name.text = args.name;
$.created.text = "Created " + moment(args.created_at).fromNow();
$.description.text = args.description;

$.row.addEventListener('click', function() {
	
	Alloy.Globals.openWindow('profile/group_view', args, true);
});
