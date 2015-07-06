var args = arguments[0] || {};

$.boards.addEventListener('click', function() {
	
	var boardsTitles = [];
	var boardsIds = [];
	
	for (var i in Alloy.Globals.currentUser.boards) {
		
		boardsTitles.push(Alloy.Globals.currentUser.boards[i].title);
		boardsIds.push(Alloy.Globals.currentUser.boards[i].id);
	}

	var popupDialog = Alloy.createWidget('ti.ux.popup.list', 'widget', {
		closeButton : true,
		selectable : true,
		options : boardsTitles,
	});

	popupDialog.getView('table').addEventListener('click', function(e) {

		$.boardsTitle.text = e.row.data.title;
		$.boardsTitle.selectedID = boardsIds[e.index];
		popupDialog.hide();
	});

	popupDialog.getView().show();
}); 

$.repin.addEventListener('click', function() {
	
	if ($.description.getField().value.length != 0 && $.boardsTitle.selectedID) {
		
		Alloy.Globals.API.pinToBoard(args.id, $.boardsTitle.selectedID, $.description.getField().value, function() {
			
		}, function() {
			
		});
	}
});
