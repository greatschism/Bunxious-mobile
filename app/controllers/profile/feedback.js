var args = arguments[0] || {};

$.feedbackLabel.text = L("feedback");

Alloy.Globals.API.feedback(args.id, function(results) {

	var feedbackArray = [];

	for (var i in results) {

		feedbackArray.push(Alloy.createController('activity/activity_commented', results[i]).getView());
	}
	
	$.feedbackTable.setData(feedbackArray);
}, function(results) {
	
	var feedbackArray = [];
	
	feedbackArray.push(Ti.UI.createTableViewRow({
		title : 'No results.',
	}));
	
	$.feedbackTable.setData(feedbackArray);
});
