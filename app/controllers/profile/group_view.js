var args = arguments[0] || {};
var moment = require('alloy/moment');

$.title.addOnReturn(function(event) {
	
	$.postsTable.insertRowBefore(0, Alloy.createController('profile/groupPostRow', {
		article : event.value,
		user_avatar : Alloy.Globals.currentUser.user_info.avatar_medium.image,
		user_name : Alloy.Globals.currentUser.user_info.firstname + ' ' + Alloy.Globals.currentUser.user_info.lastname
	}).getView());
	
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
	Ti.API.error(args.Post[i]);
	tableData.push(Alloy.createController('profile/groupPostRow', args.Post[i]).getView());
}

$.postsTable.setData(tableData);

