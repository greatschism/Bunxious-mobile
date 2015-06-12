var args = arguments[0] || {};
var moment = require('alloy/moment');

switch(args.status) {
    case 'canceled':
		$.status.image = '/images/order_canceled.png';
        break;
    case 'shipped':
		$.status.image = '/images/order_shipped.png';
        break;
    case 'paid':
    	$.status.image = '/images/order_paid.png';
        break;
}

$.id.text = args.id;
$.ago.text = moment(new Date(args.date)).fromNow();
$.amount.text = args.amount;
$.from.text = args.from;