var args = arguments[0] || {};

Alloy.Globals.API.getActivity(function(results) {

	var activityArray = [];

	for (var i in results) {

		activityArray.push(Alloy.createController('activity/activityRow', results[i]).getView());
	}
	
	$.activityTable.setData(activityArray);
}, function(error) {

}); 