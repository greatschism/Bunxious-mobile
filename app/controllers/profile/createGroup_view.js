var args = arguments[0] || {};
var moment = require('alloy/moment');

$.saveBtn.addEventListener("click", function(e) {
	if($.groupNameTxtField.value != null && $.groupDescTxtField.value != null){
		Alloy.Globals.loading.show();
			var data = {
				name : $.groupNameTxtField.value,
				description : $.groupDescTxtField.value
			};
			
			Alloy.Globals.API.createGroup(data,  function(result){
				Ti.API.info("success result-->"+ JSON.stringify(result));
				
				$.groupNameTxtField.value ="";
				$.groupDescTxtField.value = "";
				
				alert("Group succesfully created.");
				
				Ti.App.fireEvent("updateGroup");
			},function(result){
				Ti.API.info("fail result-->"+JSON.stringify(result));
			});
			
			Alloy.Globals.loading.hide();
	}else{
		alert("Please type the group name and description.");
	}
});

$.cancelBtn.addEventListener("click",function(){
	$.groupNameTxtField.value = "";
	$.groupDescTxtField.value = "";
});
