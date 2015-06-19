var args = arguments[0] || {};
var moment = require('alloy/moment');


var posts = [];

// adding comments to posts
for (var i in args.Comments) {
	
	for (var j in args.Comments[i]) {
		
		for (var k in args.Post) {
			
			if (args.Post[k].id == args.Comments[i][j].group_post_id) {
				
				args.Post[k].comments = args.Post[k].comments || [];
				args.Post[k].comments.push(args.Comments[i][j]);
			}
		}
	}
}

// adding avatars and names to posts

for (var i in args.Post) {
	
	args.Post[i].user_name = args.PostAvatarName[i];
	args.Post[i].user_avatar = args.PostAvtrImg[i];
}

Ti.API.info(args);
var tableData = [];

for (var i in args.Post) {
	
	tableData.push(Alloy.createController('profile/groupPostRow', args.Post[i]).getView());
}

$.postsTable.setData(tableData);

