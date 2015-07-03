var args = arguments[0] || {};
var Paypal = require('ti.paypal');

$.addressFilter.addEventListener('click', function() {

	var addressesArray = [];

	for (var i in args.addresses) {

		addressesArray.push(args.addresses[i].alias);
	}

	var popupDialog = Alloy.createWidget('ti.ux.popup.list', 'widget', {
		closeButton : true,
		selectable : true,
		options : addressesArray,
	});

	popupDialog.getView('table').addEventListener('click', function(e) {

		$.addressLabel.text = e.row.data.title;
		popupDialog.hide();
	});

	popupDialog.getView().show();
});

for (var i in args.maindata) {

	$.container.add(Alloy.createController('cart/item', args.maindata[i]).getView());
}

Ti.API.error(args);

$.orderFromName.text = args.maindata[0].orderFrom;

$.orderItemTotal.text = "Item total";
$.orderItemTotalPrice.text = "$" + parseFloat(args.sub_total).toFixed(2);

$.orderShipping.text = "Shipping";
$.orderShippingPrice.text = "$" + parseFloat(args.shipping).toFixed(2);

$.orderTax.text = "Tax";
$.orderTaxPrice.text = "$0.00";

$.orderTotal.text = "Order Total";
$.orderTotalPrice.text = "$" + parseFloat(args.total).toFixed(2);

var checkoutButton;

function addButtonToWindow() {
	
	if (checkoutButton) {
		
		$.checkoutWrapper.remove(checkoutButton);
		checkoutButton = null;
	}

	checkoutButton = Paypal.createPaypalButton({
		// NOTE: height/width only determine the size of the view that the button is embedded in - the actual button size
		// is determined by the buttonStyle property!
		buttonStyle : Paypal.BUTTON_152x33, // The style & size of the button
		top: '10dp',
	width: '150dp',
	height: '40dp',
	font: {
		fontWeight: 'bold',
		fontSize: '14dp'
	},
	right: '10dp',

		language : 'en_US',
		textStyle : Paypal.PAYPAL_TEXT_PAY, // Causes the button's text to change from "Pay" to "Donate"

		//appID : '<<<YOUR APP ID HERE>>>', // The appID issued by Paypal for your application; for testing, feel free to delete this property entirely.
		paypalEnvironment : Paypal.PAYPAL_ENV_SANDBOX, // Sandbox, None or Live

		feePaidByReceiver : false,
		enableShipping : false, // Whether or not to select/send shipping information

		payment : {// The payment itself
			paymentType : Paypal.PAYMENT_TYPE_HARD_GOODS, // The type of payment
			subtotal : 10, // The total cost of the order, excluding tax and shipping
			tax : 0,
			shipping : 0,
			currency : 'USD',
			recipient : 'legolas8911@gmail.com',
			customID : 'anythingYouWant',
			invoiceItems : [{
				name : 'Shoes',
				totalPrice : 8,
				itemPrice : 2,
				itemCount : 4
			}, {
				name : 'Hats',
				totalPrice : 2,
				itemPrice : 0.5,
				itemCount : 4
			}],
			ipnUrl : 'http://www.appcelerator.com/',
			merchantName : 'Dev Tools',
			memo : 'For the orphans and widows in the world!'
		}
	});

	// Events available
	checkoutButton.addEventListener('paymentCancelled', function(e) {
		alert('Payment Cancelled.');
		// The button should only be used once; so after a payment is cancelled, succeeds, or errors, we must redisplay it.
		addButtonToWindow();
	});
	checkoutButton.addEventListener('paymentSuccess', function(e) {
		alert('Payment Success.  TransactionID: ' + e.transactionID + ', Reloading...');
		// The button should only be used once; so after a payment is cancelled, succeeds, or errors, we must redisplay it.
		addButtonToWindow();
	});
	checkoutButton.addEventListener('paymentError', function(e) {
		alert('Payment Error,  errorCode: ' + e.errorCode + ', errorMessage: ' + e.errorMessage);
		// The button should only be used once; so after a payment is cancelled, succeeds, or errors, we must redisplay it.
		addButtonToWindow();
	});

	$.checkoutWrapper.add(checkoutButton);
}

addButtonToWindow();
