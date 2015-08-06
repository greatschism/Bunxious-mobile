var args = arguments[0] || {};

Alloy.Globals.API.searchUsers(args.searchTerm, function(results){

	console.debug("user-search-result ", JSON.stringify(results));

	var tableData = [];

		for (var i in results) {

			//Use user list view 
			tableData.push(Alloy.createController('profile/user_view', results[i]).getView());
		}

		$.searchTable.setData(tableData);

}, function(error){

});