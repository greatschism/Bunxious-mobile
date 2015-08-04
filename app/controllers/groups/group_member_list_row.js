var args = arguments[0] || {};

var user = args.user;

if (user) {
	$.avatar.image = user.avatar_medium.image;
	$.fullname.text = user.firstname + ' ' + user.lastname;
	if (user.enabled === true) {
		$.accept.hide();
		$.decline.hide();
		$.unban.hide();
		$.promote.show();
		$.ban.show();
	} else {
		$.accept.show();
		$.decline.show();
		$.promote.hide();
		$.ban.hide();
		$.unban.hide();
	}
}

$.row.addEventListener('click', function() {

});

$.promote.addEventListener('click', function() {
	alert("promote");
});

$.ban.addEventListener('click', function() {

	Alloy.Globals.API.banGroupMember(args.group_id, args.user.id, true, function(result){

		$.ban.hide();
		$.unban.show();


	}, function(error){

	});

});

$.unban.addEventListener('click', function() {

	Alloy.Globals.API.banGroupMember(args.group_id, args.user.id, false, function(result){

		$.ban.show();
		$.unban.hide();

	}, function(error){

	});

});

$.accept.addEventListener('click', function() {
	// console.log('Accept click: ' + user.firstname);
	
	Alloy.Globals.API.addUserToGroup(args.group_id, args.user.id, "accept", function(result){
		$.accept.hide();
		$.decline.hide();
	}, function(error){
		
	});
	
});

$.decline.addEventListener('click', function() {
	// console.log('Decline click: ' + user.firstname);
	
	Alloy.Globals.API.addUserToGroup(args.group_id, args.user.id, "decline", function(result){
		
		Alloy.Globals.API.getGroupMembers(args.group_id, function(result) {
			var tableData = [];
			for (i in result.data) {
				if (result.data[i].id != Alloy.Globals.currentUser.user_info.id) {
					tableData.push(Alloy.createController('groups/group_member_list_row', {
						user : result.data[i],
						group_id: group_id,
						tableView: args.tableView
					}).getView());
				}
			}
			args.tableView.setData(tableData);
		}, function(error) {
			alert('Could not retrieve members list, please try again later');
		});

	}, function(error){
		
	});
});
