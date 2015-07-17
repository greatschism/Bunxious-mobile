var args = arguments[0] || {};
var moment = require('alloy/moment');
var group_id = args.group.id;
var group_name = args.group.name;

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
for (var i in args.posts.Comments) {

	for (var j in args.posts.Comments[i]) {

		args.posts.Comments[i][j].user_avatar = args.posts.CommentAvatarImg[i][j];
		args.posts.Comments[i][j].user_name = args.posts.CommentAvatarName[i][j];
	}
}

// adding avatars, comments and names to posts

for (var i in args.posts.Post) {

	args.posts.Post[i].user_name = args.posts.PostAvatarName[i];
	args.posts.Post[i].user_avatar = args.posts.PostAvtrImg[i];
	args.posts.Post[i].comments = args.posts.Comments[i];
	args.posts.Post[i].pin_image = args.posts.myPinImg[i];

}

Ti.API.info(args.posts);
var tableData = [];

for (var i in args.posts.Post) {

	tableData.push(Alloy.createController('profile/groupPostRow', args.posts.Post[i]).getView());
}

$.search.addEventListener('return', function(term){
	// Perform group view search
});

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

if(args.group.private != 1 ){
	$.groupTypeTxt.text = "Public";
	$.lockIcon.image ="/images/public.png";
}else{
	$.groupTypeTxt.text = "Private";
	$.lockIcon.image ="/images/private.png";
}

$.groupTitle.text = args.group.name;
$.description.text = args.group.description;


$.members.addEventListener('click', function() {
	Alloy.Globals.openWindow('groups/group_members_list', {group_id:group_id, group_name:group_name}, true);
});

$.postsTable.setData(tableData);

