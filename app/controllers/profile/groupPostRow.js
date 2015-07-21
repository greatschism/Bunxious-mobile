var args = arguments[0] || {};

$.avatar.image = args.user_avatar;
$.user.text = args.user_name;

if(args.pin_image.length>0) {
	// Has a Pin image
	$.post_title.hide();
	$.pin_img.show();
	$.pin_img.image = args.pin_image;
} else {
	// No Pin image
	$.post_title.show();
	$.pin_img.hide();
	// setting the fontFamily in html 
	$.post_title.html = '<style>a, span {font-family : HelveticaNeue; word-wrap : break-word;}</style><span>' + args.article + '</span>';
}

$.title.addOnReturn(function(event) {

	Ti.API.info(args, event);

	Alloy.Globals.API.addPostComment(event.value, args.id, function(result) {

		if (result.result) {

			$.commentsTable.appendRow(createRow(Alloy.Globals.currentUser.user_info.avatar_medium.image, Alloy.Globals.currentUser.user_info.firstname + ' ' + Alloy.Globals.currentUser.user_info.lastname, event.value));
			$.commentsTable.animate({
				height : Ti.UI.SIZE
			});
			$.title.setValue('');
		} else {

			if (result.message) {

				alert(result.message);
			}
		}
	}, function() {
		//TBD
	});
});

function createRow(avatar, name, text) {

	var row = Ti.UI.createTableViewRow({
		height : Ti.UI.SIZE,
		selectionStyle : Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
		backgroundColor : 'transparent',
	});

	var avatar = Ti.UI.createImageView({
		left : '10dp',
		top : '10dp',
		width : '30dp',
		height : '30dp',
		borderRadius : '2dp',
		image : avatar
	});

	row.add(avatar);

	var name = Ti.UI.createLabel({
		color : "#f26b1d",
		left : '50dp',
		top : '10dp',
		font : {
			fontSize : '13dp'
		},
		text : name
	});

	row.add(name);

	var text = Ti.UI.createLabel({
		left : '50dp',
		top : '25dp',
		font : {
			fontSize : '13dp'
		},
		text : text,
		color : '#34495e'
	});

	row.add(text);
	return row;
}

var tableData = [];

for (var i in args.comments) {

	tableData.push(createRow(args.comments[i].user_avatar, args.comments[i].user_name, args.comments[i].comment));
}

$.commentsTable.setData(tableData);
