var args = arguments[0] || {};

if (args.icon != null) $.icon.image = args.icon;
if (args.title != null) $.title.text = args.title;

$.container.addEventListener('touchstart', function() {
	
	$.container.backgroundColor = '#55888f';
	$.title.color = '#fff';
});

$.container.addEventListener('touchend', function() {
	
	$.container.backgroundColor = '#62949b';
	$.title.color = '#89b1b7';
});

// Also adding for touchcancel to prevent active freeze
$.container.addEventListener('touchcancel', function() {
	
	$.container.backgroundColor = '#62949b';
	$.title.color = '#89b1b7';
});

