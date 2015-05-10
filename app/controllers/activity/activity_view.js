var args = arguments[0] || {};

Alloy.Globals.API.getActivity(function(results) {

	var productArray = [];

	for (var i in results) {

		productArray.push(Alloy.createController('product/productRow', results[i]).getView());
	}
	
	$.activityTable.setData(productArray);
}, function(error) {

}); 