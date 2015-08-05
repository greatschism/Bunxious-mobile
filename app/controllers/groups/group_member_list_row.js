var args = arguments[0] || {};

var user = args.user;
var private = args.group_private;
var group_id = args.group_id;

if (user) {
	console.log(user);
	$.avatar.image = user.avatar_medium.image;
	$.fullname.text = user.firstname + ' ' + user.lastname;

	if (user.enabled === true) {
		$.accept.hide();
		$.decline.hide();
		$.unban.hide();
		$.promote.show();
		$.ban.show();
	} else if (user.enabled === false && !private) {
		$.promote.show();
		$.unban.show();
	} else {
		$.promote.hide();
		$.unban.hide();
		$.ban.hide();
		$.accept.show();
		$.decline.show();
	}
}

$.row.addEventListener('click', function() {

});

$.promote.addEventListener('click', function() {
	alert("promote");
});

$.ban.addEventListener('click', function() {

	Alloy.Globals.API.banGroupMember(args.group_id, args.user.id, function(result){

		$.ban.hide();
		$.unban.show();

	}, function(error){

	});

});

$.unban.addEventListener('click', function() {

	Alloy.Globals.API.banGroupMember(args.group_id, args.user.id, function(result){

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
		$.ban.show();
		$.promote.show();
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
