var args = arguments[0] || {};

$.avatar.image = args.avatar;
$.username.text = args.name;

var tableData = [];

if(args.to_user_id || args.conversation_id){
	
	var data = {};
	
	if(args.to_user_id){
		data.to_user_id = args.to_user_id;
	} else if(args.conversation_id){
		data.conversation_id = args.conversation_id;
	}
	
	Alloy.Globals.API.getMessages(data, function(result) {
		
		for (var i in result.data) {
			tableData.push(Alloy.createController('profile/individualMessageRow', result.data[i]).getView());
		}
		
		$.messageTable.setData(tableData);
			
		Alloy.Globals.loading.hide();
	}, function(error) {

		Alloy.Globals.loading.hide();
	});
}

$.textInput.addEventListener('return', function(e){
	$.textInput.blur();
	$.messageView.scrollTo(0, 0);
	$.messageView.setBottom(20);
});

$.textSend.addEventListener('click', function() {
	
	Alloy.Globals.loading.show();
	
	Alloy.Globals.API.sendMessage(args.conversation_id, args.to_user_id, $.textInput.value, function(result) {

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
