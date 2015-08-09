var args = arguments[0] || {};
var Paypal = require('ti.paypal');

var shippingValue = 0.00;
var totalValue = 0.00;

// preparing the paypal items list
for (var i in args.paypal.items) {
	//name : 'Shoes',
	//			totalPrice : 8,
	//			itemPrice : 2,
	//			itemCount : 4
	args.paypal.items[i].name = args.paypal.items[i].item_name;
	args.paypal.items[i].totalPrice = args.paypal.items[i].amount * args.paypal.items[i].quantity;
	args.paypal.items[i].itemPrice = args.paypal.items[i].amount;
	args.paypal.items[i].itemCount = args.paypal.items[i].quantity;
	delete args.paypal.items[i].item_name;
	delete args.paypal.items[i].item_number;
	delete args.paypal.items[i].amount;
	delete args.paypal.items[i].quantity;
	delete args.paypal.items[i].shipping;
}

function txtField_Change(){
	$.lblHint.visible = ($.orderOptional.value.trim() == "");
}

// used for checkout prevent if there is no address selected

function updatePriceValues(dontAddButton) {

	totalValue = (parseFloat(args.sub_total) + parseFloat(shippingValue)).toFixed(2);
	Ti.API.info(totalValue);
	$.orderShippingPrice.text = "$" + parseFloat(shippingValue).toFixed(2);
	$.orderTotalPrice.text = "$" + parseFloat(totalValue).toFixed(2);

	// reinitialize paypal button because we changed the values
	// also, since there is no option to disable the button if we don't select an address we'll just add it after the user selects one

	if (!dontAddButton) {

		addButtonToWindow();
	}
}

var checkoutButton;

function addButtonToWindow() {

	Ti.API.info("shipping :" + shippingValue, "invoiceItems :" + JSON.stringify(args.paypal.items), "subtotal :" + parseFloat(args.sub_total).toFixed(2), typeof args.sub_total);

	if (checkoutButton) {

		$.checkoutWrapper.remove(checkoutButton);
		checkoutButton = null;
	}

	checkoutButton = Paypal.createPaypalButton({
		// NOTE: height/width only determine the size of the view that the button is embedded in - the actual button size
		// is determined by the buttonStyle property!
		buttonStyle : Paypal.BUTTON_152x33, // The style & size of the button
		top : '10dp',
		width : '150dp',
		height : '40dp',
		font : {
			fontWeight : 'bold',
			fontSize : '14dp'
		},
		right : '10dp',

		language : 'en_US',
		textStyle : Paypal.PAYPAL_TEXT_PAY, // Causes the button's text to change from "Pay" to "Donate"

		appID : 'APP-80W284485P519543T', // The appID issued by Paypal for your application; for testing, feel free to delete this property entirely.
		paypalEnvironment : Paypal.PAYPAL_ENV_NONE, // Sandbox, None or Live

		feePaidByReceiver : false,
		enableShipping : false, // Whether or not to select/send shipping information

		payment : {// The payment itself
			paymentType : Paypal.PAYMENT_TYPE_GOODS, // The type of payment
			subtotal : Number(parseFloat(args.sub_total).toFixed(2)), // The total cost of the order, excluding tax and shipping
			tax : 0,
			shipping : shippingValue,
			currency : args.paypal.currency,
			recipient : args.paypal.email,
			customID : 'anythingYouWant',
			invoiceItems : args.paypal.items,
			ipnUrl : 'http://www.appcelerator.com/',
			merchantName : 'Bunxious Mobile',
			memo : 'For the orphans and widows in the world!'
		}
	});

	// Events available
	checkoutButton.addEventListener('paymentCancelled', function(e) {
		// The button should only be used once; so after a payment is cancelled, succeeds, or errors, we must redisplay it.
		addButtonToWindow();
	});
	checkoutButton.addEventListener('paymentSuccess', function(e) {
		alert('Thank you for your purchase');
		Alloy.Globals.pageflow.back();
	});
	checkoutButton.addEventListener('paymentError', function(e) {
		alert('Payment Error,  errorCode: ' + e.errorCode + ', errorMessage: ' + e.errorMessage);
		// The button should only be used once; so after a payment is cancelled, succeeds, or errors, we must redisplay it.
		addButtonToWindow();
	});

	$.checkoutWrapper.add(checkoutButton);
}

Ti.API.info(args);

$.add_address.addEventListener('click', function() {
	var data = {};
	Alloy.Globals.openWindow('profile/add_address', data, true);

	Ti.App.addEventListener("newAddress", function(e) {
		args.parentUpdate();
	});
	
});

$.addressFilter.addEventListener('click', function() {

	var addressesArray = [];
	var addressesIds = [];

	for (var i in args.addresses) {

		addressesArray.push(args.addresses[i].alias);
		addressesIds.push(args.addresses[i].address_id);
	}

	var popupDialog = Alloy.createWidget('ti.ux.popup.list', 'widget', {
		closeButton : true,
		selectable : true,
		options : addressesArray,
	});

	popupDialog.getView('table').addEventListener('click', function(e) {

		$.addressLabel.text = e.row.data.title;

		// change the shipping value

		for (var i in args.item_shipping) {

			if (args.item_shipping[i].addressId == addressesIds[e.index]) {

				shippingValue = args.item_shipping[i].ShippingAmt;
			}
		}

		updatePriceValues();
		popupDialog.hide();
	});

	popupDialog.getView().show();
});

for (var i in args.maindata) {

	args.maindata[i].cartId = args.cartId;

	// passing along the loadData function to avoid events
	args.maindata[i].parentUpdate = args.parentUpdate;

	$.container.add(Alloy.createController('cart/item', args.maindata[i]).getView());
}

$.contactButton.addEventListener('click', function(e) {

	Alloy.Globals.loading.show();

	Alloy.Globals.API.getUser(args.maindata[0].user.user_id, function(user) {

		var data = {
			to_user_id : user.id,
			name : user.firstname + " " + user.lastname,
			avatar : user.avatar_small.image
		};

		Alloy.Globals.openWindow('profile/message_view', data, true);
	}, function() {

		Alloy.Globals.loading.hide();
	});
});

$.orderFromName.text = args.maindata[0].orderFrom;

$.orderItemTotal.text = "Item total";
$.orderItemTotalPrice.text = "$" + parseFloat(args.sub_total).toFixed(2);

$.orderShipping.text = "Shipping";

$.orderTax.text = "Tax";
$.orderTaxPrice.text = "$0.00";

$.orderTotal.text = "Order Total";

updatePriceValues(true);
