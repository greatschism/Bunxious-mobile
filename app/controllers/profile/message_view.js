var args = arguments[0] || {};

$.avatar.image = args.with.avatar;
$.username.text = args.with.name;

var tableData = [];

for (var i in args.data) {

	tableData.push(Alloy.createController('profile/individualMessageRow', args.data[i]).getView());
}

$.messageTable.setData(tableData);

$.textSend.addEventListener('click', function() {
	
	Alloy.Globals.loading.show();
	
	Alloy.Globals.API.sendMessage(args.conversation_id, args.data[0].to_user_id, $.textInput.value, function(result) {

		if (result.result == true) {

			if (OS_IOS) {

				$.messageTable.appendRow(Alloy.createController('profile/individualMessageRow', result.conversations).getView(), {
					animated : true,
					animationStyle : Titanium.UI.iPhone.RowAnimationStyle.RIGHT
				});
			} else {

				$.messageTable.appendRow(Alloy.createController('profile/individualMessageRow', result.conversations).getView());
			}

			if (OS_IOS) {

				$.messageTable.scrollToIndex($.messageTable.data[0].rows.length - 1, {
					animated : true,
				});
			} else {

				$.messageTable.scrollToIndex($.messageTable.data[0].rows.length - 1);
			}

			$.textInput.value = "";
			Alloy.Globals.loading.hide();
		}
		else {
			
			Alloy.Globals.loading.hide();
			alert('Message was not sent');
		}
	}, function(error) {
		
		Alloy.Globals.loading.hide();
		alert('Message was not sent');
	});
});
