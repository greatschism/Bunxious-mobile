var args = arguments[0] || {};
var moment = require('alloy/moment');
var uploadedImage = null;

$.checkbox.on = function() {
	this.title = '\u2713';
	this.value = true;
	
	$.checkbox.backgroundColor = '#3497FF';
};

$.checkbox.off = function() {
	this.title = '';
	this.value = false;
	
	$.checkbox.backgroundColor = '#ffffff';
};

if(args.update){
	$.groupNameTxtField.value = args.name;
	$.groupDescTxtField.value = args.description;
	
	if (args.private == 1) {
		$.checkbox.on();
	}
}

$.checkbox.addEventListener('click', function(e) {
	if (false == e.source.value) {
		e.source.on();
	} else {
		e.source.off();
	}
});

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
	
	if($.checkbox.value){
		data.private = true;
	}
	
	Alloy.Globals.API.createGroup(data,  function(result){
		Ti.API.info("success result-->"+ JSON.stringify(result));
		
		$.groupNameTxtField.value ="";
		$.groupDescTxtField.value = "";
		uploadedImage = null;
		$.checkbox.off();

		Ti.App.fireEvent("updateGroup");
		$.uploadImage.title = "Upload Image";
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
		description : $.groupDescTxtField.value,
		image: uploadedImage
	};
	
	if($.checkbox.value){
		data.private = true;
	}

	Alloy.Globals.API.editGroup(data,  function(result){
		Ti.API.info("success result-->"+ JSON.stringify(result));
		var data = {
			name : $.groupNameTxtField.value,
			description : $.groupDescTxtField.value,
			private: $.checkbox.value
		};
		
		if(uploadedImage !== null){
			data.image = uploadedImage;
		}
		
		Ti.App.fireEvent("updateGroup_groupView",data);
		Ti.App.fireEvent("updateGroup");

		$.groupNameTxtField.value ="";
		$.groupDescTxtField.value = "";
		uploadedImage = null;
		$.checkbox.off();
		$.uploadImage.title = "Upload Image";
		alert("Update succesfully.");
		
	},function(result){
		Ti.API.info("fail result-->"+JSON.stringify(result));
	});

	Alloy.Globals.loading.hide();
}

