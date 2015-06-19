var args = arguments[0] || {};

$.avatar.image = args.user_avatar;
$.user.text = args.user_name;
$.title.text = args.article;

function createRow(avatar, name, text) {

	var row = Ti.UI.createTableViewRow({
		height : Ti.UI.SIZE,
		selectionStyle : Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE,
		backgroundColor : 'transparent',
		title : text,
		font : {
			fontSize : '13dp'
		}
	});

	//var avatar = Ti.UI.createImageView({
	//	left : '10dp',
	//	top : '10dp',
	//	width : '30dp',
	//	height : '30dp',
	//	borderRadius : '2dp',
	//	image : avatar
	//});

	//row.add(avatar);

	//var name = Ti.UI.createLabel({
	//color : "#f26b1d",
	//left : '50dp',
	//top : '10dp',
	//font : {
	//	fontSize : '13dp'
	//},
	//text : name
	//});

	//row.add(name);

	//var text = Ti.UI.createLabel({
	//left : '50dp',
	//top : '25dp',
	//font : {
	//	fontSize : '13dp'
	//}
	///});

	///row.add(text);
	return row;
}

var tableData = [];

for (var i in args.comments) {

	tableData.push(createRow(null, null, args.comments[i].comment));
}

$.commentsTable.setData(tableData);
