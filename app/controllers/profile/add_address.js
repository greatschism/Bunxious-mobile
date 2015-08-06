var args = arguments[0] || {};



$.save_address.addEventListener('click', function() {

	var recipient = $.recipient_name.value;
	var city = $.city.value;
	var address = $.address.value;
	var state = $.stateTitle.idValue;
	
	Alloy.Globals.API.addAddress(recipient, address, 223, city, state, function(results) {

		$.recipient_name.value = "";
		$.city.value = "";
		$.address.value = "";
		$.country.value = "";
		$.zip.value = "";
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