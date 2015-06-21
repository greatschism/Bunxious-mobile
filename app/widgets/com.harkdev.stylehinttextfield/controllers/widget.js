var args = arguments[0] || {};

/***
 * Common arguments
 */
args.height = args.height || Ti.UI.SIZE;
args.width = args.width || Ti.UI.FILL;
args.left = args.left || null;
args.right = args.right || null;
args.top = args.top || null;
args.bottom = args.bottom || null;

/***
 * TextField arguments
 */
args.color = args.color || null;
args.font = args.font || null;
args.value = args.value || "";
args.passwordMask = args.passwordMask || false;
args.textarea = args.textarea ? true : false;
args.borderRadius = args.borderRadius || null;
args.borderWidth = args.borderWidth || null;
args.borderColor = args.borderColor || null;
args.backgroundColor = args.backgroundColor || null;
args.tfTop = args.tfTop || null;
args.tfWidth = args.tfWidth || null;

/***
 * Hint Label arguments
 */
// Color of the Hint Font
args.hintColor = args.hintColor || null;
// Font object for the hint
args.hintFont = args.hintFont || null;
// Hint text
args.hintText = args.hintText || null;
// Left value for the hint text
args.hintLeft = args.hintLeft || 10;
// Right value for the hint text
args.hintRight = args.hintRight || null;
// Top value for the hint text
args.hintTop = args.hintTop || null;
// Bottom value for the hint text
args.hintBottom = args.hintBottom || null;

/***
 * Initialized the Container View
 */
function initView() {
	if (args.height != null)
		$.vwContainer.height = args.height;
	if (args.width != null)
		$.vwContainer.width = args.width;
	if (args.left != null)
		$.vwContainer.left = args.left;
	if (args.right != null)
		$.vwContainer.right = args.right;
	if (args.top != null)
		$.vwContainer.top = args.top;
	if (args.bottom != null)
		$.vwContainer.bottom = args.bottom;
	if (args.backgroundColor != null)
		$.vwContainer.backgroundColor = args.backgroundColor;
	if (args.borderRadius != null)
		$.vwContainer.borderRadius = args.borderRadius;
	if (args.borderWidth != null)
		$.vwContainer.borderWidth = args.borderWidth;
	if (args.borderColor != null)
		$.vwContainer.borderColor = args.borderColor;
}

/***
 * Initialize the TextField
 */
function initTextField() {
	if (args.color != null)
		$.txtField.color = args.color;
	if (args.font != null)
		$.txtField.font = args.font;
	if (args.tffontsize != null)
		$.txtField.font = {
			fontSize : args.tffontsize
		};
	$.txtField.passwordMask = args.passwordMask;
	$.txtField.value = args.value;
	if (args.height != null)
		$.txtField.height = args.height;
	//if (args.tfTop != null) $.txtField.top = args.tfTop;
	if (args.tfWidth != null)
		$.txtField.width = args.tfWidth;
	if (args.backgroundColor != null)
		$.txtField.backgroundColor = args.backgroundColor;

	$.txtField.center = {
		x : '50%',
		y : '50%'
	};

	if (OS_ANDROID) {

		$.txtField.top = '5dp';
	}

	if (args.textarea) {

		$.txtField.addEventListener('focus', function() {//show a modal window to input data to the textarea
			Ti.API.info('focus');
			$.txtField.blur();
			var win = Alloy.createWidget('com.harkdev.stylehinttextfield', 'TextAreaWin', {
				value : $.txtField.value
			}).getView();

			win.open({
				modal : true
			});

			win.addEventListener('save', function(e) {

				$.txtField.value = e.value;
				showHideHint();
			});
		});
	}
}

/***
 * Initialize the label (as hint text)
 */
function initLabel() {
	if (args.hintColor != null)
		$.lblHint.color = args.hintColor;
	if (args.hintFont != null)
		$.lblHint.font = args.font;
	if (args.hintText != null)
		$.lblHint.text = args.hintText;
	if (args.hintLeft != null)
		$.lblHint.left = args.hintLeft;
	if (args.hintRight != null)
		$.lblHint.right = args.hintRight;
	if (args.hintTop != null)
		$.lblHint.top = args.hintTop;
	if (args.hintBottom != null)
		$.lblHint.bottom = args.hintBottom;

	$.lblHint.addEventListener('click', function() {

		$.txtField.focus();
	});
}

/***
 * Raised on text field value change.
 * @param {Object} e
 */
function txtField_Change(e) {
	showHideHint();
}

/***
 * Processes the hiding or showing of the hint label.
 */
function showHideHint() {
	$.lblHint.visible = ($.txtField.value.trim() == "");
}

// EXPORTS
// Value
function getValue() {
	return $.txtField.value;
};
function setValue(val) {
	$.txtField.value = val;
	showHideHint();
};
exports.getValue = getValue;
exports.setValue = setValue;

Object.defineProperty($, "value", {
	get : getValue,
	set : setValue
});

// Touch enabled
function getTouchEnabled() {
	return $.txtField.touchEnabled;
};
function setTouchEnabled(val) {
	$.txtField.touchEnabled = val;
};
exports.getTouchEnabled = getTouchEnabled;
exports.setTouchEnabled = setTouchEnabled;

Object.defineProperty($, "touchEnabled", {
	get : getTouchEnabled,
	set : setTouchEnabled
});

// Focus
exports.focus = function() {
	$.txtField.focus();
};

initView();
initTextField();
initLabel();

exports.addOnReturn = function(callback) {
	
	$.txtField.addEventListener('return', callback);
};
