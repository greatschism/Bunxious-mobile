var args = arguments[0] || {};
var moment = require('alloy/moment');

var tabMapping = {
	about : {
		title : L('profile'),
		controller : 'profile/profile_about',
	},
	favorite : {
		title : L('favorite_items'),
		controller : 'profile/profile_favorite',
	},
	shops : {
		title : L('favorite_shops'),
		controller : 'profile/profile_shops',
	},
	feedback : {
		title : L('feedback'),
		controller : 'profile/feedback',
	},
};

function openTab(tab, data) {

	$.tabTitle.text = tabMapping[tab].title;

	$.tabContent.removeAllChildren();
	$.tabContent.add(Alloy.createController(tabMapping[tab].controller, data).getView());
}

if (args.user_id) {
	
	Alloy.Globals.loading.show();
	Alloy.Globals.API.getUser(args.user_id, function(result) {

		if (!Alloy.Globals.currentUser || Alloy.Globals.currentUser.user_info.id != args.user_id) {

			$.followButton.visible = true;
			$.contactButton.visible = true;

			// console.log("Profile View result ", JSON.stringify(result));

			if (result.following_user) {
				
				$.followIcon.image = '/images/minuswhite.png';
				$.follow.setText(L('unfollow'));
			}

			$.followButton.addEventListener('click', function(e) {

				if (!Alloy.Globals.currentUser || Alloy.Globals.currentUser.token == null) {

					alert('Please login first.');
				} else {

					Alloy.Globals.API.follow(args.user_id, function(response) {
						// console.debug("follow-unfollow response ", JSON.stringify(response));

						if (response.isFollow) {
							
							$.followIcon.image = '/images/minuswhite.png';
							$.follow.setText(L('unfollow'));
						} else {
							
							$.followIcon.image = '/images/pluswhite.png';
							$.follow.setText(L('follow'));
						}
					}, function(error) {

						alert('Please login first.');
					});
				}
			});

			$.contactButton.addEventListener('click', function(e) {

				if (!Alloy.Globals.currentUser || Alloy.Globals.currentUser.token == null) {

					alert('Please login first.');
				} else {

					var data = {
						to_user_id : result.id,
						name : result.firstname + " " + result.lastname,
						avatar : result.avatar_small.image
					};

					Alloy.Globals.openWindow('profile/message_view', data, true);
				}
			});
		}

		$.avatar.image = result.avatar_medium.image;
		$.userName.text = result.firstname + ' ' + result.lastname;
		$.gender.text = result.gender ? Alloy.Globals.toTitleCase(result.gender) : '';

		var date = moment(result.date_added);

		$.joined.text = 'Joined ' + date.format("MMMM D, YYYY");

		if (result.city && result.country_iso_code_3) {

			$.userLocation.text = result.city + ', ' + result.country_iso_code_3;
		} else if (result.city || result.country_iso_code_3) {

			$.userLocation.text = result.city || result.country_iso_code_3;
		}

		openTab('about', result);

		$.tabChange.addEventListener("click", function() {

			var selectList = [];

			for (var i in tabMapping) {

				selectList.push(tabMapping[i].title);
			}

			var popupDialog = Alloy.createWidget('ti.ux.popup.list', 'widget', {
				closeButton : true,
				selectable : true,
				options : selectList,
			});

			popupDialog.getView('table').addEventListener('click', function(e) {
				var tabId;
				switch(e.row.data.title) {
				case L("profile") :
					tabId = "about";
					break;
				case L("favorite_items") :
					tabId = "favorite";
					break;
				case L("favorite_shops") :
					tabId = "shops";
					break;
				case L("feedback") :
					tabId = "feedback";
					break;
				}

				openTab(tabId, result);
				popupDialog.hide();
			});

			popupDialog.getView().show();

		});
		Alloy.Globals.loading.hide();

	}, function(error) {
		Alloy.Globals.loading.hide();
	});
}

