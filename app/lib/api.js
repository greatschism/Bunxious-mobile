/*
 api.js
 Bunxious

 Created by Lego on 2015-05-08.
 Copyright 2015 Lego. All rights reserved.

 */

var config = require('config');

var api = {};

/*
 * Function for converting objects to structured querystring (email=example@example.com&password=AdAdw2)
 */
function queryString(data) {
	var self = this;
	for (var key in data) {
		if ( typeof data[key] === 'object' && data[key] !== null) {
			var o = data[key];
			delete data[key];
			for (var k in o) {
				var new_key = key + "[" + k + "]";
				var value = o[k];
				
				if (value === true) {
					value = 1;
				}
				
				if (value === false) {
					value = 0;
				}
				data[new_key] = value;
			}
		}
	}
	var arr = [];
	for (key in data)
	arr.push(key + '=' + data[key]);
	return arr.join("&");
};

function httpRequest(endpoint, method, data, successFunction, errorFunction) {
	
	if (!Ti.Network.online) {
		
		alert('No internet connection');
		
		if (errorFunction) {
			
			errorFunction();
		}
		return;
	}
	
	var url = config.baseURL + endpoint;

	if (data && method == 'GET')  {
		
		url = url + '?' + queryString(data);
	}

	var xhr = Ti.Network.createHTTPClient();

	xhr.onload = function() {

		if (this.status == '200') {

			try {

				var responseJSON = JSON.parse(this.responseText);

				Ti.API.info(endpoint, JSON.stringify(responseJSON));

				if (!responseJSON.error) {

					if (successFunction) {

						successFunction(responseJSON);
					}
				} else if (errorFunction) {

					errorFunction(responseJSON.error);
				}
			} catch (e) {

				if (errorFunction) {

					errorFunction(e);
				}
				Ti.API.error(e);
			}
		} else {

			if (errorFunction) {

				errorFunction(this.response);
			}
			Ti.API.error(this.response);
		}
	};

	xhr.onerror = function(e) {

		Ti.API.info('Transmission error: ' + endpoint + ' ' + JSON.stringify(this) + this.responseText);

		if (errorFunction && this.responseText) {

			errorFunction(this.responseText);

		} else if (errorFunction) {

			errorFunction(e);
		}
	};

	xhr.timeout = 20000;
	
	xhr.open(method, url);

	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.setRequestHeader('Authorization', 'Basic ' + Ti.Utils.base64encode(config.httpUser + ':' + config.httpPass));

	if (data && method == 'POST') {

		Ti.API.info('gonna hit ' + url + ' and gonna send ' + JSON.stringify(queryString(data)));
		xhr.send(queryString(data));
	} else {

		Ti.API.info('gonna hit ' + url);
		xhr.send();
	}
}

api.createAccount = function(user, pass, email, firstname, lastname, success, fail) {

	httpRequest('user/create', 'POST', {
		data : {
			username : user,
			email : email,
			password : pass,
			firstname : firstname,
			lastname : lastname
		}
	}, success, fail);
};

api.login = function(email, pass, success, fail) {

	httpRequest('user/login', 'POST', {
		email : email,
		password : pass,
	}, success, fail);
};

api.logout = function(success, fail) {

	httpRequest('user/logout', 'POST', {
		token : Alloy.Globals.currentUser.token
	}, success, fail);
};

api.getHomePins = function(success, fail, offset) {
	
	var data = {
		limit : 20,
	};
	
	if (offset) {
		
		data.offset = offset;
	}
	
	if (Alloy.Globals.currentUser) {
		
		data.token = Alloy.Globals.currentUser.token;
	}

	httpRequest('pin/home', 'GET', data, success, fail);
};

api.getAllCategories = function(success, fail) {

	// Cleaning the response and returning just an array of strings
	function onSuccess(results) {

		var items = [];

		for (var i in results) {

			items.push(results[i].title);
		}

		if (success) {

			success(items);
		}
	}

	httpRequest('category/find-all', 'GET', null, onSuccess, fail);
};

api.getActivity = function(success, fail) {
	
	var data = {
		token : Alloy.Globals.currentUser.token
	};
	
	httpRequest('activity/find', 'GET', data, success, fail);
};

api.getUser = function(user_id, success, fail) {
	
	var data = {
		user_id : user_id,
	};
		
	if (Alloy.Globals.currentUser) {
		
		data.token = Alloy.Globals.currentUser.token;
	}
	
	httpRequest('user/find', 'GET', data, success, fail);
};

api.updateUser = function(userData, success, fail) {
	
	var data = {
		token : Alloy.Globals.currentUser.token,
		data : userData
	};
	
	//deleting unnecessary data
	delete userData.id;
	delete userData.password;
	delete userData.password_new;
	delete userData.password_key;
	delete userData.pins;
	delete userData.likes;
	delete userData.comments;
	delete userData.boards;
	delete userData.followers;
	delete userData.following;
	delete userData.language_id;
	delete userData.status;
	delete userData.country_iso_code_3;
	delete userData.activate_url;
	delete userData.avatar_width;
	delete userData.avatar_height;
	delete userData.avatar;
	delete userData.avatar_store_host;
	delete userData.avatar_store;
	delete userData.date_added;
	delete userData.date_modified;
	delete userData.cover_width;
	delete userData.cover_height;
	delete userData.cover_top;
	delete userData.cover;
	delete userData.cover_store_host;
	delete userData.cover_store;
	delete userData.is_admin;
	delete userData.status_send;
	delete userData.first_login;
	delete userData.send_daily;
	delete userData.repins;
	delete userData.last_online;
	delete userData.activity_open;
	delete userData.rating_votes;
	delete userData.rating_average;
	delete userData.rating_sums;
	delete userData.following_user;
	delete userData.avatar_small;
	delete userData.avatar_medium;
	delete userData.cover_image;
	
	
	httpRequest('user/update', 'POST', data, success, fail);
};

api.findBoard = function(user_id, success, fail) {
	
	var data = {
		filters : {
			user_id : user_id
		}
	};
		
	if (Alloy.Globals.currentUser) {
		
		data.token = Alloy.Globals.currentUser.token;
	}
	
	httpRequest('board/find-by', 'GET', data, success, fail);
};

api.findLikes = function(user_id, success, fail){
	
	var data = {
		user_id : user_id
	};
	
	if (Alloy.Globals.currentUser) {
		
		data.token = Alloy.Globals.currentUser.token;
	}
	
	httpRequest('pin/find-likes', 'GET', data, success, fail);
};

api.feedback = function(user_id, success, fail){
	
	var data = {
		filters : {
			user_id : user_id
		}
	};
		
	if (Alloy.Globals.currentUser) {
		
		data.token = Alloy.Globals.currentUser.token;
	}
	
	httpRequest('comments/find-by', 'GET', data, success, fail);
	
};

module.exports = api;