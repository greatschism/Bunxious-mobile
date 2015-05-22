var args = arguments[0] || {};

$.gender.addEventListener('click', function() {

	var popupDialog = Alloy.createWidget('ti.ux.popup.list', 'widget', {
		closeButton : true,
		selectable : true,
		options : ['Girls', 'Boys']
	});

	popupDialog.getView('table').addEventListener('click', function(e) {
		
		$.genderTitle.text = e.row.data.title;
		popupDialog.hide();
	});

	popupDialog.getView().show();
});
