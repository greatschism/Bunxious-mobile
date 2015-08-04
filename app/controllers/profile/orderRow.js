var args = arguments[0] || {};
var moment = require('alloy/moment');

switch(args.status) {
    case 0:
		$.status.image = '/images/order_canceled.png';
        break;
    case 1:
		$.status.image = '/images/order_shipped.png';
        break;
    case 2:
    	$.status.image = '/images/order_paid.png';
        break;
}

$.id.text = args.uid;
$.ago.text = moment(new Date(args.date_modified)).fromNow();
$.amount.text = "$" + args.amount.toFixed(2);
$.from.text = args.from_user;