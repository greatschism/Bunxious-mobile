var args = arguments[0] || {};

var pinObj = null,
    username = '',
    avatarImage = '';

function createRow(avatar, name, text) {

	var view = Ti.UI.createView({
		height : Ti.UI.SIZE,
		backgroundColor : 'transparent'
	});

	var avatar = Ti.UI.createImageView({
		left : '10dp',
		top : '10dp',
		width : '30dp',
		height : '30dp',
		borderRadius : '2dp',
		image : avatar
	});

	view.add(avatar);

	var name = Ti.UI.createLabel({
		color : "#f26b1d",
		left : '50dp',
		top : '10dp',
		font : {
			fontSize : '13dp'
		},
		text : name
	});

	view.add(name);

	var text = Ti.UI.createLabel({
		left : '50dp',
		top : '25dp',
		font : {
			fontSize : '13dp'
		},
		text : text,
		color : '#34495e'
	});

	view.add(text);
	return view;
}

function displayPin() {

	Ti.API.info('args: ' + JSON.stringify(args));

	Alloy.Globals.API.getPin(args.pin_id, function(result) {

		pinObj = JSON.parse(JSON.stringify(result));

		$.pinImage.image = pinObj.image_big.image;
		$.title.text = pinObj.title;

		if (pinObj.currency_code) {
			$.price.text = Alloy.Globals.Utils.codeToCurrency(pinObj.currency_code) + pinObj.price + ' ' + pinObj.currency_code.toUpperCase();
		} else {
			$.price.text = '$' + pinObj.price + ' ' + 'USD';
		}

		Alloy.Globals.API.getSizesForPin(pinObj.id, function(result) {

			$.size.text = 'SIZE: ' + result.SizeIfo[0].name;
		}, function(error) {

		});

		var brand = Alloy.Globals.findBrandById(pinObj.brand_id);
		//var size = Alloy.Globals.findSizeById(pinObj.size_id);
		var condition = Alloy.Globals.findConditionById(pinObj.condition_id);

		$.brand.text = 'BRAND: ' + brand.title;
		//$.size.text = 'SIZE: ' + size.title;
		$.condition.text = 'CONDITION: ' + condition.title;
		$.description.value = 'Description: ' + pinObj.description;
		$.shipping.text = 'SHIPPING FROM United States';
		// + pinObj.from;

		// When shipping info isn't available
		$.shipToOut.text = '';
		$.shipCostOut.text = '';
		$.shipWithOut.text = '';

		for (i in pinObj.shipping) {// When shipping info is available
			if (pinObj.shipping[i].country_id === 223) {// For United States
				$.shipToOut.text = 'United States';
				$.shipCostOut.text = '$' + pinObj.shipping[i].price + ' USD';
				$.shipWithOut.text = '$' + pinObj.shipping[i].multiple_price + ' USD';
			}
		}

		if (pinObj.comments.Comments) {
			var userComments = pinObj.comments.Comments;
			for (var i = 0,
			    commentLen = userComments.length; i < commentLen; i++) {
				$.commentsView.add(createRow(pinObj.user.avatar_medium.image, userComments[i].firstname + ' ' + userComments[i].lastname, userComments[i].comment));
			}
		}

		Alloy.Globals.API.getUser(pinObj.user.id, function(result) {

			username = result.firstname + ' ' + result.lastname;
			avatarImage = result.avatar_small.image;

			$.avatar.image = result.avatar_medium.image;
			$.userName.text = result.firstname + ' ' + result.lastname;

			if (result.city && result.country_iso_code_3) {

				$.userLocation.text = result.city + ', ' + result.country_iso_code_3;
			} else if (result.city || result.country_iso_code_3) {

				$.userLocation.text = result.city || result.country_iso_code_3;
			}

			if (!Alloy.Globals.currentUser || Alloy.Globals.currentUser.user_info.id != result.id) {
				$.followButton.visible = true;
				$.contactButton.visible = true;

				if (result.following_user) {
					$.follow.setText(L('unfollow'));
				}
			}
		});

		if (pinObj.liked) {

			$.heartButton.backgroundColor = '#27ae60';
		}
	});
}

displayPin();

$.boxButton.addEventListener('click', function() {

	if (Alloy.Globals.currentUser) {

		if (pinObj && Alloy.Globals.currentUser.boards && Alloy.Globals.currentUser.boards.length > 0) {

			Alloy.Globals.openWindow('product/pin_repin', pinObj, true);
		} else {

			alert('You don\'t have any boards');
		}
	} else {
		alert('Please login first.');
	}
});

$.heartButton.addEventListener('click', function() {

	if (Alloy.Globals.currentUser) {
		if (pinObj) {
			Alloy.Globals.API.togglePinLike(pinObj.id, function(result) {

				if (result.status == 'success' && result.action == "like") {

					$.heartButton.backgroundColor = '#27ae60';
				} else if (result.status == 'success' && result.action == "unlike") {

					$.heartButton.backgroundColor = '#f26b1d';
				}
			});
		}
	} else {
		alert('Please login first.');
	}
});

$.commentTxt.addOnReturn(function(event) {

	if ($.commentTxt.getValue().trim() !== "") {

		Alloy.Globals.API.addPinComment(event.value, pinObj.id, function(result) {

			if (result.result) {

				$.commentsView.add(createRow(Alloy.Globals.currentUser.user_info.avatar_medium.image, Alloy.Globals.currentUser.user_info.firstname + ' ' + Alloy.Globals.currentUser.user_info.lastname, event.value));
				$.commentsView.animate({
					height : Ti.UI.SIZE
				});
				$.commentTxt.setValue('');
			} else {

				if (result.message) {

					alert(result.message);
				}
			}
		}, function() {
			//TBD
		});
	}
});

//function afterPinResponse (){

if (!Alloy.Globals.currentUser || Alloy.Globals.currentUser.user_info.id != args.user_id) {
	$.followButton.addEventListener('click', function(e) {

		if (Alloy.Globals.currentUser) {
			Alloy.Globals.API.follow(args.user_id, function(response) {
				// console.debug("follow-unfollow response ", JSON.stringify(response));

				if (response.isFollow) {
					$.follow.setText(L('unfollow'));
				} else {
					$.follow.setText(L('follow'));
				}
			});
		} else {
			alert('Please login first.');
		}
	});

	$.contactButton.addEventListener('click', function(e) {

		if (Alloy.Globals.currentUser) {
			var data = {
				to_user_id : args.user_id,
				name : username,
				avatar : avatarImage
			};

			Alloy.Globals.openWindow('profile/message_view', data, true);
		} else {
			alert('Please login first.');
		}
	});
}

Alloy.Globals.API.getCloset(args.user_id, function(result) {

	$.closetAvatar.setImage(result.cover.image);
	$.closetTitle.setText(result.Shop.title);
	$.closetDescription.setValue(result.Shop.description);

	for (i in result.MyPins.pinImg) {

		$.imageSlideshow.add(Alloy.createController('product/pinview_closet_item_image', {
			image : result.MyPins.pinImg[i].image,
			pinId : result.MyPins.pin[i].id,
			user_id : args.user_id,
			callback : function(callbackPin) {
				args = JSON.parse(JSON.stringify(callbackPin));
				$.commentsView.removeAllChildren();
				displayPin();
			}
		}).getView());
	}

}, function(error) {

});
