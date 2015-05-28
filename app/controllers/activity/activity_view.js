var args = arguments[0] || {};

Alloy.Globals.loading.show();

Alloy.Globals.API.getActivity(function(results) {

	var activityArray = [];

	for (var i in results) {

		activityArray.push(Alloy.createController('activity/activityRow', results[i]).getView());
	}
	
	$.activityTable.setData(activityArray);
	
	Alloy.Globals.loading.hide();
}, function(error) {
	
	Alloy.Globals.loading.hide();
}); 