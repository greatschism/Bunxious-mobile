var args = arguments[0] || {};

if (args.icon != null) $.icon.image = args.icon;
if (args.title != null) $.title.text = args.title;

function setActive() {
	
	$.container.backgroundColor = '#55888f';
	$.title.color = '#fff';
	
	$.icon.image = $.icon.image.split('.')[0] + 'white.png';
}

function setNormal() {
	
	$.container.backgroundColor = '#62949b';
	$.title.color = '#89b1b7';
	
	$.icon.image = $.icon.image.split('white')[0] + '.png';
}

$.container.addEventListener('touchstart', function() {
	
	setActive();
});

$.container.addEventListener('touchend', function() {
	
	setNormal();
});

// Also adding for touchcancel to prevent active freeze
$.container.addEventListener('touchcancel', function() {
	
	setNormal();
});

// Exposing it to be able to dynamically change the title
exports.setTitle = function(title) {
	
	$.title.text = title;
};

// Exposing it to be able to dynamically change the icon
exports.setIcon = function(icon) {
	
	$.icon.image = icon;
};

exports.button = $.container;