var args = arguments[0] || {};

var user = args.user;

if (user) {
	$.avatar.image = user.avatar_medium.image;
	$.fullname.text = user.firstname + ' ' + user.lastname;
	if (user.enabled === true) {
		$.accept.hide();
		$.decline.hide();
	} else {
		$.accept.show();
		$.decline.show();
	}
}

$.row.addEventListener('click', function() {

});

$.accept.addEventListener('click', function() {
	console.log('Accept click: ' + user.firstname);
});

$.decline.addEventListener('click', function() {
	console.log('Decline click: ' + user.firstname);
	;
});
