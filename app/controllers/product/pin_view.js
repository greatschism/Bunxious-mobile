var args = arguments[0] || {};

var pinObj = null,
    username = '',
    avatarImage = '',
    closetID,
    pinToEdit;

if (!Alloy.Globals.currentUser) {
	$.boxButton.hide();
	$.heartButton.hide();
	$.cart.hide();
}

Ti.App.addEventListener("loggedOut", function() {
	$.boxButton.hide();
	$.heartButton.hide();
	$.cart.hide();
});

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

$.editButton.addEventListener('click', function() {

	Alloy.Globals.openWindow('product/add_view', {
		pin : pinToEdit
	}, true);
});

function displayPin() {

	Alloy.Globals.API.getPin(args.pin_id, function(result) {
		
		pinToEdit = result;

		if (Alloy.Globals.currentUser && result.user.id == Alloy.Globals.currentUser.user_info.id) {

			$.editButton.visible = true;
			$.heartButton.right = '40dp';
			$.boxButton.right = '75dp';
		}

		pinObj = JSON.parse(JSON.stringify(result));

		if (pinObj.board_id) {

			$.boxButton.backgroundColor = '#27ae60';
		}

		$.pinImage.image = pinObj.image_big.image + '?t=' + new Date().getTime();
		$.title.text = pinObj.title;

		if (pinObj.currency_code) {
			$.price.text = Alloy.Globals.Utils.codeToCurrency(pinObj.currency_code) + pinObj.price + ' ' + pinObj.currency_code.toUpperCase();
		} else {
			$.price.text = '$' + pinObj.price + ' ' + 'USD';
		}

		Alloy.Globals.API.getSizesForPin(pinObj.id, function(result) {

			$.size.text = 'Size: ' + result.SizeIfo[0].name;
		}, function(error) {

		});

		var brand = Alloy.Globals.findBrandById(pinObj.brand_id);
		//var size = Alloy.Globals.findSizeById(pinObj.size_id);
		var condition = Alloy.Globals.findConditionById(pinObj.condition_id);

		$.brand.text = 'Brand: ' + brand.title;
		//$.size.text = 'SIZE: ' + size.title;
		$.condition.text = 'Condition: ' + condition.title;
		$.description.value = 'Description: ' + pinObj.description;
		$.shipping.text = 'Shipping From United States';
		// + pinObj.from;

		for (i in pinObj.shipping) {// When shipping info is available

			var item = Ti.UI.createView({
				width : '100%',
				height : '30dp'
			});

			var shipToLabel = Ti.UI.createLabel({
				left : 0,
				font : {
					fontWeight : 'bold',
					fontSize : '12dp'
				},
				color : '#636363'
			});

			item.add(shipToLabel);

			var shipCostLabel = Ti.UI.createLabel({
				left : '100dp',
				font : {
					fontWeight : 'bold',
					fontSize : '12dp'
				},
				color : '#636363'
			});

			item.add(shipCostLabel);

			var shipCombinedLabel = Ti.UI.createLabel({
				left : '200dp',
				font : {
					fontWeight : 'bold',
					fontSize : '12dp'
				},
				color : '#636363'
			});

			item.add(shipCombinedLabel);

			var separator = Ti.UI.createView({
				height : '2px',
				width : '300dp',
				backgroundColor : "#DADADA",
				bottom : 0
			});

			item.add(separator);

			shipCostLabel.text = '$' + parseFloat(pinObj.shipping[i].price).toFixed(2) + ' USD';
			shipCombinedLabel.text = '$' + parseFloat(pinObj.shipping[i].multiple_price).toFixed(2) + ' USD';

			if (pinObj.shipping[i].country_id === 223) {// For United States

				shipToLabel.text = 'United States';
			} else if (pinObj.shipping[i].country_id == null) {

				shipToLabel.text = 'Everywhere else';
			}

			$.shippingValues.add(item);
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

			$.userName.addEventListener('click', function() {
				Alloy.Globals.openWindow('profile/profile_view', {
					user_id : result.id
				}, true);
			});

			if (!Alloy.Globals.currentUser || Alloy.Globals.currentUser.user_info.id != result.id) {
				$.followButton.visible = true;
				$.contactButton.visible = true;

				if (result.following_user) {

					$.followIcon.image = '/images/minuswhite.png';
					$.follow.setText(L('unfollow'));
				}
			}
		});

		if (pinObj.liked) {

			$.heartButton.backgroundColor = '#27ae60';
		}
	});
}

Ti.App.addEventListener('reloadPin', function() {

	displayPin();
});

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

if (!Alloy.Globals.currentUser || Alloy.Globals.currentUser.user_info.id != args.user_id) {

	$.followButton.addEventListener('click', function(e) {

		if (Alloy.Globals.currentUser) {
			Alloy.Globals.API.follow(args.user_id, function(response) {

				if (response.isFollow) {

					$.followIcon.image = '/images/minuswhite.png';
					$.follow.setText(L('unfollow'));
				} else {

					$.followIcon.image = '/images/pluswhite.png';
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

$.cart.addEventListener('click', function() {

	Alloy.Globals.loading.show();

	Alloy.Globals.API.addToCart(args.pin_id, function(result) {

		Alloy.Globals.loading.hide();

		var dialog = Ti.UI.createAlertDialog({
			cancel : 1,
			buttonNames : ['Go to cart', 'Continue shopping'],
			message : 'Product successfully added to your cart.',
			title : 'Bunxious'
		});

		dialog.addEventListener('click', function(e) {

			if (e.index === 0) {

				Alloy.Globals.pageflow.back();
				Alloy.Globals.openWindow('profile/cart_view');
			}
		});

		dialog.show();
	}, function(error) {

		alert('There was an error while adding the product to your cart.');
		Alloy.Globals.loading.hide();
	});
});

Alloy.Globals.API.getCloset(args.user_id, function(result) {

	closetID = result.Shop.id;
	Ti.API.info(result);
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

	//TBD
});

$.closetAdd.addEventListener('click', function() {

	if (!Alloy.Globals.currentUser) {

		alert('Please login first.');
		return;
	}

	if (Alloy.Globals.currentUser.user_info.id == args.user_id) {

		alert('You can\'t like your own closet');
		return;
	}

	Alloy.Globals.loading.show();

	Alloy.Globals.API.toggleClosetLike(closetID, function(result) {

		if (result.message == "Store Liked") {

			$.closetAdd.text = 'Remove closet from favorites';
		} else if (result.message == "Store Unliked") {

			$.closetAdd.text = 'Add closet to favorites';
		}
		Alloy.Globals.loading.hide();
	}, function(error) {

		Alloy.Globals.loading.hide();
	});
});

$.closetSee.addEventListener('click', function() {

	if (!Alloy.Globals.currentUser) {

		alert('Please login first.');
		return;
	}

	Alloy.Globals.loading.show();

	Alloy.Globals.API.getClosetLikes(closetID, function(result) {

		Ti.API.info(result);
		Alloy.Globals.loading.hide();
	}, function(error) {

		Alloy.Globals.loading.hide();
	});
});
