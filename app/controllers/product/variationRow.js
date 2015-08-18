var args = arguments[0] || {};

$.size.addEventListener('click', function() {

	if (Alloy.Globals.sizeFilters) {

		Alloy.Globals.createFilter(Alloy.Globals.sizeFilters, $.sizeTitle);

	} else {
		Alloy.Globals.API.getSize(function(results) {

			Alloy.Globals.sizeFilters = JSON.parse(JSON.stringify(results));
			Alloy.Globals.createFilter(Alloy.Globals.sizeFilters, $.sizeTitle);

		}, function(error) {

		});
	}
});
