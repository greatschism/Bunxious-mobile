var args = arguments[0] || {};
var moment = require('alloy/moment');

$.name.text = args.name;
$.created.text = "Created " + moment(args.created_at).fromNow();
$.description.text = args.description;

$.row.addEventListener('click', function() {
	
	Alloy.Globals.loading.show();
	
	Alloy.Globals.API.getGroup(args.id, function(result) {
		
		Alloy.Globals.openWindow('profile/group_view', result, true);
		Alloy.Globals.loading.hide();
	}, function(error) {
		//TBD
	});
});
