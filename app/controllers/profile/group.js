var args = arguments[0] || {};
var tableData = [];

Alloy.Globals.API.findGroups(function(results) {
	
	for (var i in results.Group) {
		results.Group[i].image = results.GroupImgMedium[i].image;
		tableData.push(Alloy.createController('profile/groupRow', results.Group[i]).getView());
	}
	$.groupTable.setData(tableData);
}, function(error) {
	
});


$.createGroupBtn.addEventListener("click", function(e) {
	Alloy.Globals.openWindow('profile/createGroup_view', args, true);
});

Ti.App.addEventListener("updateGroup", function(e){
	Alloy.Globals.API.findGroups(function(results) {
		tableData = [];
		$.groupTable.setData(tableData);
		for (var i in results.Group) {
			results.Group[i].image = results.GroupImgMedium[i].image;
			
			tableData.push(Alloy.createController('profile/groupRow', results.Group[i]).getView());
		}
		$.groupTable.setData(tableData);
	}, function(error) {
		
	});
});

// hack for avoiding the separators when the table is empty or has fewer rows
var tblFooterView = Ti.UI.createView({
  width: 300,
  height: 1,
  backgroundColor: '#FFF'
});
 
$.groupTable.footerView = tblFooterView;