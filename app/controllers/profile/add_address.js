var args = arguments[0] || {};



$.saveButton.addEventListener('click', function() {

	var recipient = $.recipientName.getField().value;
	var city = $.city.getField().value;
	var address = $.address.getField().value;
	var state = $.stateTitle.idValue;
	
	Alloy.Globals.API.addAddress(recipient, address, 223, city, state, function(results) {

		$.recipientName.getField().value = "";
		$.city.getField().value = "";
		$.address.getField().value = "";
		$.country.getField().value = "";
		$.zip.getField().value = "";
		$.stateTitle.idValue = "";
		$.stateTitle.setText("");

		Ti.App.fireEvent("newAddress");

		alert("Address successfully added.");

	}, function(error) {


	});
	
	
});

$.state.addEventListener('click', function() {

	var stateTitle = $.stateTitle.idValue;
	console.log(stateTitle);

	if (Alloy.Globals.StateFilters) {

		Alloy.Globals.createFilter(Alloy.Globals.StateFilters, $.stateTitle);
		

	} else {

		Alloy.Globals.API.getStates(function(results) {	
		var items = [];
		if(results.Data.length){
		for(var i in results.Data){
			items.push({
				"title" : results.Data[i].name,
				"id" : results.Data[i].id,
				"code" : results.Data[i].code
			});
		}
	}

	Alloy.Globals.StateFilters = JSON.parse(JSON.stringify(items));

	Alloy.Globals.createFilter(Alloy.Globals.StateFilters, $.stateTitle);

}, function(error) {

});
		
}
});