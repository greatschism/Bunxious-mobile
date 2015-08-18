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

	if ($.boardsTitle.selectedID) {

		Alloy.Globals.API.pinToBoard(args.id, $.boardsTitle.selectedID, $.boardsTitle.text, function(result) {

			if (result.affected_row_id) {

				alert('Pin reposted successfully.');
			} else if (result.error) {

				alert(result.error[0] || result.error);
			}
		}, function(error) {

			alert(error.uploadError || error);
		});
	} else {

		alert('Please select a treasure chest');
	}
});
