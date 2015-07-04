var args = arguments[0] || {};
var moment = require('alloy/moment');
var group_id = args.id;

$.title.addOnReturn(function(event) {

	Alloy.Globals.API.addPost(event.value, group_id, function(result) {

		if (result.result) {
			$.postsTable.insertRowBefore(0, Alloy.createController('profile/groupPostRow', {
				article : event.value,
				user_avatar : Alloy.Globals.currentUser.user_info.avatar_medium.image,
				user_name : Alloy.Globals.currentUser.user_info.firstname + ' ' + Alloy.Globals.currentUser.user_info.lastname
			}).getView());
			$.title.setValue('');
		} else {

			if (result.message) {

				alert(result.message);
			}
		}
	}, function(error) {
		//TBD
		alert('There was a communication problem, please check your intenet connection and try again.');
	});
});

var posts = [];

// adding names and avatars to comments
for (var i in args.Comments) {

	for (var j in args.Comments[i]) {

		args.Comments[i][j].user_avatar = args.CommentAvatarImg[i][j];
		args.Comments[i][j].user_name = args.CommentAvatarName[i][j];
	}
}

// adding avatars, comments and names to posts

for (var i in args.Post) {

	args.Post[i].user_name = args.PostAvatarName[i];
	args.Post[i].user_avatar = args.PostAvtrImg[i];
	args.Post[i].comments = args.Comments[i];

}

Ti.API.info(args);
var tableData = [];

for (var i in args.Post) {

	tableData.push(Alloy.createController('profile/groupPostRow', args.Post[i]).getView());
}

$.invite.addEventListener('click', function() {

	var dialog = Ti.UI.createAlertDialog({
		title : 'Enter the name of the user',
		style : Ti.UI.iPhone.AlertDialogStyle.PLAIN_TEXT_INPUT,
		buttonNames : ['Invite', 'Cancel'],
		cancel : 1
	});

	dialog.addEventListener('click', function(e) {

		if (e.index == 0) {

			Alloy.Globals.API.inviteUserToGroup(group_id, e.text, function(result) {

				if (result && result.message) {

					alert(result.message);
				}
			}, function(error) {
				//TBD
			});
		}
	});
	dialog.show();
});

$.description.text = args.description;

$.members.addEventListener('click', function() {

	Alloy.Globals.openWindow('groups/group_members_list', {
		group_id : group_id
	}, true);
});

$.postsTable.setData(tableData);

