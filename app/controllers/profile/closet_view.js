var args = arguments[0] || {};

Alloy.Globals.loading.show();
var tableData = [];

/*var orders = [{
 id : '451d823',
 name : 'Matt Doe',
 cost : '10 $',
 description : 'My babys shirt'
 }, {
 id : '441d8h3',
 name : 'Johnny Silverwings',
 cost : '20 $',
 description : 'New one dress'
 }, {
 id : '441d8h3',
 name : 'Mark Doe Johnson',
 cost : '50 $',
 description : 'Description for that data'
 }];
 for (var i = 0; i < orders.length; i++) {

 tableData.push(Alloy.createController('product/closetRow', orders[i]).getView());
 }
 $.closetTable.setData(tableData);*/

if (Alloy.Globals.currentUser.user_info.id) {

	Alloy.Globals.loading.show();
	Alloy.Globals.API.getCloset(function(result) {

		var tableData = [];

		for (var i in result.MyPins.pin) {
			console.log('PIN: '+JSON.stringify(result.MyPins.pin[i]));
			tableData.push(Alloy.createController('product/closetRow', {pin:result.MyPins.pin[i],img:result.MyPins.pinImg[i]}).getView());
		}
		$.closetTable.setData(tableData);
		$.cover.image = result.cover.image;
		$.store_title.text = result.Shop.title;
		
		Alloy.Globals.loading.hide();
	}, function(error) {

		Alloy.Globals.loading.hide();
	});
}

//Alloy.Globals.loading.hide();

// if (Alloy.Globals.currentUser.user_info.id) {
//
// Alloy.Globals.loading.show();
// Alloy.Globals.API.getCloset(Alloy.Globals.currentUser.user_info.id, function(result) {
//
// var tableData = [];
//
// for (var i in result) {
//
// //Use user list view
// //tableData.push(Alloy.createController('profile/user_view', result[i]).getView());
// }
//
// //$.followersTable.setData(tableData);
//
// Alloy.Globals.loading.hide();
// }, function(error) {
//
// Alloy.Globals.loading.hide();
// });
// }

