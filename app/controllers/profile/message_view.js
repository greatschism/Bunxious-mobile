var args = arguments[0] || {};

$.avatar.image = args.with.avatar;
$.username.text = args.with.name;

var tableData = [];

Ti.API.error(args);

for (var i in args.comments.data) {

	//keeping track on who's who to be able to align the messages
	args.comments.data[i].me = args.to;

	tableData.push(Alloy.createController('profile/individualMessageRow', args.comments.data[i]).getView());
}

$.messageTable.setData(tableData);

$.textSend.addEventListener('click', function() {

	var messageDetails = {
		me : args.to,
		from : args.to,
		to : args.with,
		message : $.textInput.value
	};

	if (OS_IOS) {

		$.messageTable.appendRow(Alloy.createController('profile/individualMessageRow', messageDetails).getView(), {
			animated : true,
			animationStyle : Titanium.UI.iPhone.RowAnimationStyle.RIGHT
		});
	} else {

		$.messageTable.appendRow(Alloy.createController('profile/individualMessageRow', messageDetails).getView());
	}

	if (OS_IOS) {

		$.messageTable.scrollToIndex($.messageTable.data[0].rows.length - 1, {animated : true, });
	} else {
		
		$.messageTable.scrollToIndex($.messageTable.data[0].rows.length - 1);
	}
	
	$.textInput.value = "";
});
