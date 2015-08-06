/*
 api.js
 Bunxious

 Created by Lego on 2015-05-08.
 Copyright 2015 Lego. All rights reserved.

 */

var config = require('config');
var moment = require('alloy/moment');

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

function httpRequest(endpoint, method, data, successFunction, errorFunction, fileType) {

	if (!Ti.Network.online) {

		alert('No internet connection');

		if (errorFunction) {

			errorFunction();
		}
		return;
	}

	var url = config.baseURL + endpoint;

	if (data && method == 'GET') {

		url = url + '?' + queryString(data);

	}

	var xhr = Ti.Network.createHTTPClient();

	var retries = 0;

	xhr.onload = function() {

		if (this.status == '200') {

			try {

				var responseJSON = JSON.parse(this.responseText);

				Ti.API.info(endpoint, this.responseText);

				if (responseJSON && !responseJSON.error) {

					if (successFunction) {

						successFunction(responseJSON);
					}
				} else if (errorFunction && responseJSON && responseJSON.error) {

					errorFunction(responseJSON.error);
				}
			} catch (e) {

				if (errorFunction) {

					errorFunction(e);
				}
				Ti.API.error(endpoint, e);
			}
		} else {

			if (errorFunction) {

				errorFunction(this.response);
			}
			Ti.API.error(this.response);
		}
	};

	xhr.onerror = function(e) {

		if (retries < 3) {
			
			retries++;
			doRequest();
		} else {

			Ti.API.info('Transmission error: ' + endpoint + ' ' + JSON.stringify(this) + this.responseText);

			alert('There was a communication error. Please check your internet connection and try again.');

			if (errorFunction && this.responseText) {

				errorFunction(this.responseText);

			} else if (errorFunction) {

				errorFunction(e);
			}
		}
	};

	xhr.timeout = 20000;

	function doRequest() {

		xhr.open(method, url);

		if (fileType !== "media") {
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		}
		xhr.setRequestHeader('Authorization', 'Basic ' + Ti.Utils.base64encode(config.httpUser + ':' + config.httpPass));

		if (fileType === "media") {
			xhr.setRequestHeader("enctype", "multipart/form-data");
			Ti.API.info('gonna hit ' + url + ' and gonna send ' + JSON.stringify(data));
			xhr.send(data);

		} else if (data && method == 'POST') {

			Ti.API.info('gonna hit ' + url + ' and gonna send ' + JSON.stringify(queryString(data)));
			xhr.send(queryString(data));
		} else {

			Ti.API.info('gonna hit ' + url);
			xhr.send();
		}
	}
	
	doRequest();

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

	/*if (Alloy.Globals.currentUser) {

	 data.token = Alloy.Globals.currentUser.token;
	 }*/

	httpRequest('pin/home', 'GET', data, success, fail);
};

api.getFilteredPins = function(filters, success, fail, offset) {
	var data = {
		limit : 20
	};

	for (var key in filters) {
		data[key] = filters[key];
	}

	if (offset) {

		data.offset = offset;
	}

	if (Alloy.Globals.currentUser) {

		data.token = Alloy.Globals.currentUser.token;
	}

	httpRequest('pin/find-by', 'GET', data, success, fail);
};

api.getAllCategories = function(success, fail) {

	// Cleaning the response and returning just an array of strings
	function onSuccess(results) {

		var items = [];

		for (var i in results) {

			// items.push(results[i].title);
			items.push({
				"title" : results[i].title,
				"id" : results[i].id
			});
		}

		items.sort(function(a, b) {
			if (a['title'] < b['title'])
				return -1;
			if (a['title'] > b['title'])
				return 1;
			return 0;
		});

		success(items);
	}

	httpRequest('category/find-all', 'GET', null, onSuccess, fail);
};

api.getActivity = function(success, fail) {

	var data = {
		token : Alloy.Globals.currentUser.token
	};

	httpRequest('activity/find', 'GET', data, success, fail);
};

api.getPin = function(id, success, fail) {

	var data = {
		id : id
	};

	if (Alloy.Globals.currentUser) {
		data.token = Alloy.Globals.currentUser.token;
	}

	httpRequest('pin/find', 'GET', data, success, fail);
};

api.getEditPin = function(id, success, fail){
		var data = {
		id : id,
		token : Alloy.Globals.currentUser.token
	};

	httpRequest('editpin/getEditPin', 'POST', data, success, fail);
};

api.editPinUpdate = function(data, success, fail){

	httpRequest('editpin/update', 'POST', data, success, fail);
};

api.togglePinLike = function(id, success, fail) {

	var data = {
		pin_id : id,
		token : Alloy.Globals.currentUser.token
	};

	httpRequest('pin/like', 'POST', data, success, fail);
};

api.verifyToken = function(success, fail) {

	var token = Ti.App.Properties.getString('token', null);

	if (token == null) {

		fail();
		return;
	}

	var data = {
		token : token
	};

	httpRequest('user/verify', 'GET', data, success, fail);
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

api.requestInvite = function(firstname, lastname, email, success, fail) {

	var data = {
		firstname : firstname,
		lastname : lastname,
		email : email
	};

	httpRequest('request/invite', 'POST', data, success, fail);
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
	Ti.API.info('USERDATA: ' + JSON.stringify(userData));
	httpRequest('user/update', 'POST', data, success, fail);
};

api.findLikes = function(user_id, success, fail) {

	var data = {
		user_id : user_id
	};

	if (Alloy.Globals.currentUser) {

		data.token = Alloy.Globals.currentUser.token;
	}

	httpRequest('pin/find-likes', 'GET', data, success, fail);
};

api.feedback = function(user_id, success, fail) {

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

api.findFollowers = function(user_id, success, fail) {

	var data = {
		user_id : user_id,
		limit : 20,
	};

	if (Alloy.Globals.currentUser) {

		data.token = Alloy.Globals.currentUser.token;
	}

	httpRequest('user/get-followers', 'GET', data, success, fail);
};

api.findGroups = function(success, fail) {

	var data = {
		user_id : Alloy.Globals.currentUser.user_info.id,
		token : Alloy.Globals.currentUser.token
	};

	httpRequest('group/grouplist', 'POST', data, success, fail);
};

api.searchUsers = function(query, success, fail) {
	var data = {
		token: Alloy.Globals.currentUser.token,
		query: query
	};

	httpRequest('user/search', 'GET', data, success, fail);

}

api.getGroup = function(id, success, fail) {

	var data = {
		group_id : id,
		user_id : Alloy.Globals.currentUser.user_info.id,
		token : Alloy.Globals.currentUser.token
	};

	httpRequest('post', 'POST', data, success, fail);
};

api.uploadGroupImage = function(image, success, fail) {
	var data = {
		token : Alloy.Globals.currentUser.token,
		file : image
	};

	httpRequest('group/upload', 'POST', data, success, fail, "media");
};

api.createGroup = function(data, success, fail) {
	var group = {
		token : Alloy.Globals.currentUser.token,
		name : data.name,
		description : data.description,
		image : data.image
	};
	// Private flag is optional.
	if (data.private === true) {
		group.private = 'on';
	}
	httpRequest('group/create', 'POST', group, success, fail);
};

api.editGroup = function(data, success, fail) {
	var group = {
		token : Alloy.Globals.currentUser.token,
		id : data.id,
		name : data.name,
		description : data.description
	};

	if (data.image) {
		group.image = data.image;
	}

	// Private flag is optional.
	if (data.private === true) {
		group.private = 'on';
	}

	httpRequest('group/update', 'POST', group, success, fail);
};

api.getGroupMembers = function(id, success, fail) {
	var data = {
		group_id : id,
		token : Alloy.Globals.currentUser.token
	};
	httpRequest('group/members', 'POST', data, success, fail);
};

api.banGroupMember = function(group_id, user_id, success, fail) {
	
	var data = {
		group_id: group_id,
		user_id: user_id,
		token: Alloy.Globals.currentUser.token
	};

	httpRequest('group/ban', 'POST', data, success, fail);

};

api.promoteGroupMember = function(group_id, user_id, success, fail) {

	var data = {
		group_id: group_id,
		user_id: user_id,
		token: Alloy.Globals.currentUser.token
	};

	httpRequest('group/role', 'POST', data, success, fail);

};

api.inviteUserToGroup = function(group_id, name, success, fail) {

	var data = {
		group : group_id,
		invitation : [name],
		token : Alloy.Globals.currentUser.token
	};

	httpRequest('group/invite', 'POST', data, success, fail);
};

api.addUserToGroup = function(group_id, user_id, decision, success, fail) {
	var data = {
		group_id : group_id,
		user_id : user_id,
		decision : decision,
		token : Alloy.Globals.currentUser.token
	};

	httpRequest('group/request', 'POST', data, success, fail);
};



api.feedUploadImage = function(image, success, fail) {

	data = {
		token : Alloy.Globals.currentUser.token,
		file : image
	};

	httpRequest('upload-img/upload', 'POST', data, success, fail, "media");

};

api.addPost = function(message, id, image, success, fail) {

	var data = {
		group_id : id,
		post_text : message,
		token : Alloy.Globals.currentUser.token
	};

	if (image) {
		data.attachment = image;
	}

	httpRequest('feed/post', 'POST', data, success, fail);
};

api.addPostComment = function(message, postid, success, fail) {

	var data = {
		post_id : postid,
		comment_text : message,
		token : Alloy.Globals.currentUser.token
	};

	httpRequest('feed/comment', 'POST', data, success, fail);
};

api.findFollowers = function(user_id, success, fail) {

	var data = {
		user_id : user_id,
		limit : 20,
	};

	if (Alloy.Globals.currentUser) {

		data.token = Alloy.Globals.currentUser.token;
	}

	httpRequest('user/get-followers', 'GET', data, success, fail);
};

api.follow = function(follow_id, success, fail) {

	var data = {
		follow_id : follow_id
	};

	if (Alloy.Globals.currentUser) {

		data.token = Alloy.Globals.currentUser.token;
	}

	httpRequest('user/follow', 'POST', data, success, fail);
};

api.getCart = function(success, fail) {

	var data = {
		token : Alloy.Globals.currentUser.token
	};

	httpRequest('store/cart', 'POST', data, success, fail);
};

api.addToCart = function(pinID, success, fail) {

	var data = {
		pinId : pinID,
		token : Alloy.Globals.currentUser.token
	};

	httpRequest('store/add', 'POST', data, success, fail);
};

api.deleteFromCart = function(pinID, cartID, success, fail) {

	var data = {
		id : pinID,
		cartId : cartID,
		token : Alloy.Globals.currentUser.token
	};

	httpRequest('store/delete', 'POST', data, success, fail);
};

api.getCloset = function(user_id, success, fail) {

	var data = {
		user_id : user_id
	};

	httpRequest('StoreSettings/mycloset', 'POST', data, success, fail);

};

api.addPinComment = function(message, pinId, success, fail) {
	var data = {
		pin_id : pinId,
		comment : message,
		token : Alloy.Globals.currentUser.token
	};

	httpRequest('storesettings/addcomment', 'POST', data, success, fail);
};

api.getAllCountries = function(success, fail) {

	var data = {};

	if (Alloy.Globals.currentUser) {

		data.token = Alloy.Globals.currentUser.token;
	}

	function onSuccess(results) {

		var items = [];

		if (success) {
			for (var i in results) {
				items.push({
					"title" : results[i].name,
					"id" : results[i].id,
					"iso_code_3" : results[i].iso_code_3
				});
			}
			success(items);
		}
	}

	httpRequest('country/find-all', 'GET', data, onSuccess, fail);
};

api.getStates = function(success, fail) {
	var data = {};

	if (Alloy.Globals.currentUser) {
		data.token = Alloy.Globals.currentUser.token;
	}
	httpRequest('State/get-states', 'GET', data, success, fail);
};

api.getOrders = function(success, fail) {

	var orders = [{
		from : 'Matt Doe',
		id : '451d823',
		amount : '$235',
		date : '06-Jun-2015 11:16:29',
		status : 'shipped'
	}, {
		from : 'Johnny Silverwings',
		id : '441d8h3',
		amount : '$85',
		date : '07-Jun-2015 01:08:08',
		status : 'paid'
	}, {
		from : 'Mark Doe Johnson',
		id : '9451d823',
		amount : '$265',
		date : '07-Jun-2015 04:11:32',
		status : 'shipped'
	}, {
		from : 'Jane Doe',
		id : '451dw23',
		amount : '$413',
		date : '06-Jun-2015 08:39:05',
		status : 'canceled'
	}, {
		from : 'John Doe',
		id : '521d823',
		amount : '$56',
		date : '02-Jun-2015 02:21:45',
		status : 'shipped'
	}, {
		from : 'Doe Jimmy',
		id : 'g353f23',
		amount : '$35',
		date : '11-Jun-2015 04:40:42',
		status : 'shipped'
	}, {
		from : 'Robert Doe',
		id : '94i17fa',
		amount : '$245',
		date : '08-Jun-2015 18:20:57',
		status : 'paid'
	}];

	function compareMilli(a, b) {
		if (moment(new Date(a.date)).unix() < moment(new Date(b.date)).unix())
			return 1;
		if (moment(new Date(a.date)).unix() > moment(new Date(b.date)).unix())
			return -1;
		return 0;
	}


	orders.sort(compareMilli);

	success(orders);
};

api.getMessageList = function(success, fail) {

	var data = {
		token : Alloy.Globals.currentUser.token
	};

	httpRequest('conversation/getlist', 'GET', data, success, fail);
};

api.getMessages = function(data, success, fail) {

	if (!Alloy.Globals.currentUser || Alloy.Globals.currentUser.token == null) {

		alert('Please login first.');
		fail();
		return;
	}

	data.getnew = 1;
	data.token = Alloy.Globals.currentUser.token;

	httpRequest('conversation/getconversation', 'POST', data, success, fail);
};

api.sendMessage = function(conversation_id, to_user_id, message, success, fail) {

	var data = {
		conversation_id : conversation_id,
		to_user_id : to_user_id,
		conversation : message,
		token : Alloy.Globals.currentUser.token,
		title : message
	};

	httpRequest('conversation/send', 'POST', data, success, fail);
};

api.deleteConversation = function(conversation_id, success, fail) {

	var data = {
		conversation_id : conversation_id,
		token : Alloy.Globals.currentUser.token
	};

	httpRequest('conversation/delete', 'POST', data, success, fail);
};

api.getBrands = function(success, fail) {
	var data = {};

	if (Alloy.Globals.currentUser) {
		data = {
			token : Alloy.Globals.currentUser.token
		};
	}

	function onSuccess(results) {

		// console.debug("Brands result ", JSON.parse(results));

		var items = [];

		for (var i in results.Brands) {
			items.push({
				"title" : results.Brands[i].name,
				"id" : results.Brands[i].id
			});
		}
		success(items);
	}

	httpRequest('option/brand', 'GET', data, onSuccess, fail);
};

api.getCondition = function(success, fail) {
	var data = {};

	if (Alloy.Globals.currentUser) {
		data = {
			token : Alloy.Globals.currentUser.token
		};
	}

	function onSuccess(results) {
		var items = [];

		for (var i in results.Condition) {
			items.push({
				"title" : results.Condition[i].name,
				"id" : results.Condition[i].id
			});
		}
		success(items);
	}

	httpRequest('option/condition', 'GET', data, onSuccess, fail);
};

api.getGender = function(success, fail) {
	var data = {};

	if (Alloy.Globals.currentUser) {
		data = {
			token : Alloy.Globals.currentUser.token
		};
	}

	httpRequest('option/gender', 'GET', data, success, fail);
};

api.getSize = function(success, fail) {

	var data = {};

	if (Alloy.Globals.currentUser) {
		data = {
			token : Alloy.Globals.currentUser.token
		};
	}

	function onSuccess(results) {
		var items = [];

		for (var i in results.Size) {
			items.push({
				"title" : results.Size[i].name,
				"id" : results.Size[i].id
			});
		}
		success(items);
	}

	httpRequest('option/size', 'GET', data, onSuccess, fail);
};

api.getSizesForPin = function(pin_id, success, fail) {
	var data = {
		'id' : pin_id
	};

	if (Alloy.Globals.currentUser) {
		data.token = Alloy.Globals.currentUser.token;
	}
	httpRequest('pin/find-pin-sizes', 'GET', data, success, fail);
};

api.uploadImage = function(image, success, fail) {

	data = {
		token : Alloy.Globals.currentUser.token,
		file : image
	};

	httpRequest('upload', 'POST', data, success, fail, "media");

};

api.addNewItem = function(data, success, fail) {

	httpRequest('uploadpin', 'POST', data, success, fail);
};

api.getBoards = function(userID, success, fail) {

	data = {
		token : Alloy.Globals.currentUser.token,
		filters : {
			user_id : userID || Alloy.Globals.currentUser.user_info.id,
		}
	};

	httpRequest('board/find-by', 'GET', data, success, fail);
};

api.pinToBoard = function(pinID, boardID, description, success, fail) {

	data = {
		token : Alloy.Globals.currentUser.token,
		parent_id : pinID,
		description : description,
		board_id : boardID
	};

	httpRequest('pin/repin', 'POST', data, success, fail);
};

api.getPurchases = function(success, fail) {

	data = {
		token : Alloy.Globals.currentUser.token,
	};

	httpRequest('storesettings/mypurchase', 'POST', data, success, fail);
};

api.getBoardPins = function(board_id, success, fail) {

	data = {
		filters : {
			board_id : board_id
		},
		token : Alloy.Globals.currentUser.token,
	};

	httpRequest('pin/find-by', 'GET', data, success, fail);
};

api.addAddress = function(recipient, address, country, city, state, success, fail) {

	var data = {
		token: Alloy.Globals.currentUser.token,
		alias: address,
		recipient: recipient,
		country: country,
		city: city,
		address: address,
		state_id: state
	};

	httpRequest('address/address', 'POST', data, success, fail);
};

module.exports = api;
