var args = arguments[0] || {};
var moment = require('alloy/moment');

$.name.text = args.group.name;
$.created.text = "Created " + moment(args.group.created_at).fromNow();
$.description.text = args.group.description;
$.avatar.image = args.img.image;

$.row.addEventListener('click', function() {
	
	Alloy.Globals.loading.show();
	
	Alloy.Globals.API.getGroup(args.group.id, function(result) {
		
		Alloy.Globals.openWindow('profile/group_view', result, true);
		Alloy.Globals.loading.hide();
	}, function(error) {
		//TBD
	});
});
