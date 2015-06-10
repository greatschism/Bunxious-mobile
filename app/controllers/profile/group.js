var args = arguments[0] || {};

Alloy.Globals.API.findGroups(function(results) {
	
	var tableData = [];
	
	for (var i in results.Group) {
		
		tableData.push(Alloy.createController('profile/groupRow', results.Group[i]).getView());
	}
	
	$.groupTable.setData(tableData);
	
}, function(error) {
	
});

// hack for avoiding the separators when the table is empty or has fewer rows
var tblFooterView = Ti.UI.createView({
  width: 300,
  height: 1,
  backgroundColor: '#FFF'
});
 
$.groupTable.footerView = tblFooterView;