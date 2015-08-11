var args = arguments[0];

function init() {
	$.textarea.value = args.value || '';
	$.textarea.focus();
}

function save() {
	$.win.close();
	$.win.fireEvent('save', {
		value : $.textarea.value
	});
}

function cancel() {
	$.textarea.blur();
	$.win.close();
	$.win.fireEvent('cancel', {
		value : $.textarea.value
	});
}

if (OS_IOS) {

	$.textarea.addEventListener('postlayout', function() {

		$.textarea.focus();
	});
}

if (OS_ANDROID) {

	$.textarea.softKeyboardOnFocus = Titanium.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
}
