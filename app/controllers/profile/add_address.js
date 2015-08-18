var args = arguments[0] || {};



$.saveButton.addEventListener('click', function() {

	var recipient = $.recipientName.getField().value;
	var alias = $.addressAlias.getField().value;
	var address = $.address.getField().value;
	var city = $.city.getField().value;
	var state = $.stateTitle.idValue;
	
	Alloy.Globals.API.addAddress(recipient, alias, address, city, state, 223, function(results) {

		
		if (results.success) {

			$.recipientName.getField().value = "";
			$.addressAlias.getField().value = "";
			$.address.getField().value = "";
			$.city.getField().value = "";
			$.stateTitle.idValue = "";
			$.stateTitle.setText("");
			$.zip.getField().value = "";
			$.country.getField().value = "";

			Ti.App.fireEvent("newAddress");

			alert("Address successfully added.");

			Alloy.Globals.pageflow.back(); 

		} else {

			alert("Please enter address info.")

		}

	}, function(error) {


	});
	
	
});

$.state.addEventListener('click', function() {

	var stateTitle = $.stateTitle.idValue;

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