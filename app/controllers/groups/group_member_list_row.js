var args = arguments[0] || {};

var user = args.user;
var private = args.group_private;
var group_id = args.group_id;


if (user) {

	$.avatar.image = user.avatar_medium.image;
	$.fullname.text = user.firstname + ' ' + user.lastname;

		
		Alloy.Globals.API.promoteGroupMember(group_id, user.id, function(result){
		// check for initial state of user and set button visibility accordingly
		if (result.data.caption == "Promote") {

			showDemoteButton();

		} else if (result.data.caption == "Demote") {

			showPromoteButton();

		}
		// since in order to check initial state, we had to change the state, now we change it back to original
			Alloy.Globals.API.promoteGroupMember(group_id, user.id, function(result){}, function(error) {});

		}, function(error){

		});

		Alloy.Globals.API.banGroupMember(group_id, user.id, function(result){

			if (result.data.caption_ban == "Ban") {

				showUnbanButton();


			} else if (user.enabled && result.data.caption_ban == "Unban") {

				showBanButton();

			} else {

				acceptDeclineButtons();
			}

			Alloy.Globals.API.banGroupMember(group_id, user.id, function(result){}, function(error){});


		}, function(error){ 

		});

}

function acceptDeclineButtons() {
	$.accept.show();
	$.decline.show();
	$.unban.hide();
	$.ban.hide();
	$.promote.hide();
	$.demote.hide();
}

function showBanButton() {
	$.ban.show();
	$.unban.hide();
	$.decline.hide();
}

function showUnbanButton() {
	$.unban.show();
	$.ban.hide();
	$.decline.hide();
}

function showDemoteButton(){
	$.demote.show();
	$.promote.hide();
	$.accept.hide();
}

function showPromoteButton() {
	$.promote.show();
	$.demote.hide();
	$.accept.hide();
}

$.row.addEventListener('click', function() {

});

$.promote.addEventListener('click', function() {

	Alloy.Globals.API.promoteGroupMember(args.group_id, args.user.id, function(result){

		showDemoteButton();

	}, function(error){

	});

});

$.demote.addEventListener('click', function() {

	Alloy.Globals.API.promoteGroupMember(args.group_id, args.user.id, function(result){

		showPromoteButton();

	}, function(error){

	});

});

$.ban.addEventListener('click', function() {

	Alloy.Globals.API.banGroupMember(args.group_id, args.user.id, function(result){

		showUnbanButton();

	}, function(error){

	});

});

$.unban.addEventListener('click', function() {

	Alloy.Globals.API.banGroupMember(args.group_id, args.user.id, function(result){

		showBanButton();

	}, function(error){

	});

});

$.accept.addEventListener('click', function() {
	// console.log('Accept click: ' + user.firstname);
	
	Alloy.Globals.API.addUserToGroup(args.group_id, args.user.id, "accept", function(result){

		showBanButton();
		showPromoteButton();

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
