var args = arguments[0] || {};

var tableData = [];

if (Alloy.Globals.currentUser.boards && Alloy.Globals.currentUser.boards.length > 0) {

	for (var i in Alloy.Globals.currentUser.boards) {
		
		tableData.push(Alloy.createController('profile/boardRow', Alloy.Globals.currentUser.boards[i]).getView());
	}
} else {

	tableData.push(Ti.UI.createTableViewRow({
		title : 'You have no treasure chests',
	}));
}

$.treasureTable.setData(tableData);

// hack for avoiding the separators when the table is empty or has fewer rows
var tblFooterView = Ti.UI.createView({
	width : 300,
	height : 1,
	backgroundColor : '#FFF'
});

$.treasureTable.footerView = tblFooterView;
