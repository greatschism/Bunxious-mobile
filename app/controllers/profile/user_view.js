var args = arguments[0] || {};

var moment = require('alloy/moment');

$.avatar.image = args.avatar_medium.image;
$.userName.text = args.firstname + ' ' + args.lastname;
$.gender.text = args.gender ? args.gender : '';

var date = moment(args.date_added);
$.joined.text = 'Joined ' + date.format("MMMM D, YYYY");