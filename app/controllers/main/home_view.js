var args = arguments[0] || {};

Alloy.Globals.API.getHomePins(function(results) {
	
	var productArray = [];
	
	for (var i in results) {
		
		productArray.push(Alloy.createController('product/productRow', results[i]).getView());
	}
	
	$.homeTable.setData(productArray);
	
}, function(error) {
	
});
