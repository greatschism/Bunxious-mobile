var args = arguments[0] || {};

var user = args.user;

if(user) {
	$.avatar.image = user.avatar_medium.image;
	$.fullname.text = user.firstname+ ' ' + user.lastname;
	if(parseInt(user.status)>0) {
		$.accept.hide();
		$.decline.hide();
	} else {
		$.accept.show();
		$.decline.show();
	}
}

$.row.addEventListener('click', function(){
	
});
