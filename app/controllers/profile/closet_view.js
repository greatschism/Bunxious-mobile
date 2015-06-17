var args=arguments[0]|| {};
Alloy.Globals.loading.show();
var tableData=[];
for(var i=0;i<4;i++) {
	
tableData.push(Alloy.createController('product/closetRow').getView());
}
$.closetTable.setData(tableData);
Alloy.Globals.loading.hide();
