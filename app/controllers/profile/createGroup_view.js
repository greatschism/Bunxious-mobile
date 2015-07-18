var args = arguments[0] || {};
var moment = require('alloy/moment');


if(args.update){
	$.groupNameTxtField.value = args.name;
	$.groupDescTxtField.value = args.description;
}

$.saveBtn.addEventListener("click", function(e) {
	if($.groupNameTxtField.value != null && $.groupDescTxtField.value != null){
		if(!args.update){
			createNewGroup();
		}else{
			updateGroup();
		}
		
	}else{
		alert("Please type the group name and description.");
	}
});

function createNewGroup(){
	Alloy.Globals.loading.show();
	var data = {
		name : $.groupNameTxtField.value,
		description : $.groupDescTxtField.value
	};
	
	Alloy.Globals.API.createGroup(data,  function(result){
		Ti.API.info("success result-->"+ JSON.stringify(result));
		
		$.groupNameTxtField.value ="";
		$.groupDescTxtField.value = "";

		Ti.App.fireEvent("updateGroup");
		
		alert("Group succesfully created.");
		
	},function(result){
		Ti.API.info("fail result-->"+JSON.stringify(result));
	});
	
	Alloy.Globals.loading.hide();
}

function updateGroup(){
	Alloy.Globals.loading.show();
	var data = {
		id : args.id,
		name : $.groupNameTxtField.value,
		description : $.groupDescTxtField.value
	};
	
	Alloy.Globals.API.editGroup(data,  function(result){
		Ti.API.info("success result-->"+ JSON.stringify(result));
		var data = {
			name : $.groupNameTxtField.value,
			description : $.groupDescTxtField.value
		};
		
		Ti.App.fireEvent("updateGroup_groupView",data);
		Ti.App.fireEvent("updateGroup");

		$.groupNameTxtField.value ="";
		$.groupDescTxtField.value = "";
		
		alert("Update succesfully.");
		
	},function(result){
		Ti.API.info("fail result-->"+JSON.stringify(result));
	});

	Alloy.Globals.loading.hide();
}



$.cancelBtn.addEventListener("click",function(){
	$.groupNameTxtField.value = "";
	$.groupDescTxtField.value = "";
});
