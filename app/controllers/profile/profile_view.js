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

	$.tabTitle.text = tabMapping[tab].title.toUpperCase();

	$.tabContent.removeAllChildren();
	$.tabContent.add(Alloy.createController(tabMapping[tab].controller, data).getView());
}

if (args.user_id) {

	Alloy.Globals.API.getUser(args.user_id, function(result) {
		
		if (!Alloy.Globals.currentUser || Alloy.Globals.currentUser.user_info.id != args.user_id) {
			
			$.followButton.visible = true;
			$.contactButton.visible = true;
			
			// console.log("Profile View result ", JSON.stringify(result));
			
			if(result.following_user){
				$.follow.setText(L('unfollow'));
			}
			
			$.followButton.addEventListener('click', function(e){
				Alloy.Globals.API.follow(args.user_id, function(response) {
					// console.debug("follow-unfollow response ", JSON.stringify(response));
					
					if(response.isFollow){
						$.follow.setText(L('unfollow'));
					} else {
						$.follow.setText(L('follow'));
					}
				});
			});
		}

		$.avatar.image = result.avatar_medium.image;
		$.userName.text = result.firstname + ' ' + result.lastname;
		$.gender.text = result.gender ? result.gender : '';

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
				switch(e.row.data.title){
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

	}, function(error) {

	});
}

