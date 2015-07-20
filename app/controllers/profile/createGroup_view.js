var args = arguments[0] || {};
var moment = require('alloy/moment');
var uploadedImage = null;

if(args.update){
	$.groupNameTxtField.value = args.name;
	$.groupDescTxtField.value = args.description;
}

$.uploadImage.addEventListener('click', function(e){
	var image = Alloy.Globals.uploadImage(function(image){
		Alloy.Globals.API.uploadGroupImage(image, function(result){
			console.debug(result.file);
			uploadedImage = result.file;
			$.uploadImage.title = "Image uploaded";
			Alloy.Globals.loading.hide();
		},function(error){
			Alloy.Globals.loading.hide();
		});
	});
});

$.saveBtn.addEventListener("click", function(e) {
	if($.groupNameTxtField.value != null && $.groupDescTxtField.value != null && $.groupNameTxtField.value.trim() !== "" && $.groupDescTxtField.value.trim() !== ""){
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
	
	if(uploadedImage === null){
		alert(L('add_image_error'));
		return;
	}
	
	Alloy.Globals.loading.show();
	var data = {
		name : $.groupNameTxtField.value,
		description : $.groupDescTxtField.value,
		image: uploadedImage
	};
	
	Alloy.Globals.API.createGroup(data,  function(result){
		Ti.API.info("success result-->"+ JSON.stringify(result));
		
		$.groupNameTxtField.value ="";
		$.groupDescTxtField.value = "";
		uploadedImage = null;

		Ti.App.fireEvent("updateGroup");
		$.uploadImage.title = "Upload Image";
		alert("Group succesfully created.");
		
	},function(result){
		Ti.API.info("fail result-->"+JSON.stringify(result));
	});
	
	Alloy.Globals.loading.hide();
}

function updateGroup(){
	if(uploadedImage === null){
		alert(L('add_image_error'));
		return;
	}
	
	Alloy.Globals.loading.show();
	var data = {
		id : args.id,
		name : $.groupNameTxtField.value,
		description : $.groupDescTxtField.value,
		image: uploadedImage
	};
	
	Alloy.Globals.API.editGroup(data,  function(result){
		Ti.API.info("success result-->"+ JSON.stringify(result));
		var data = {
			name : $.groupNameTxtField.value,
			description : $.groupDescTxtField.value,
			image: uploadedImage
		};
		
		Ti.App.fireEvent("updateGroup_groupView",data);
		Ti.App.fireEvent("updateGroup");

		$.groupNameTxtField.value ="";
		$.groupDescTxtField.value = "";
		uploadedImage = null;
		$.uploadImage.title = "Upload Image";
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
