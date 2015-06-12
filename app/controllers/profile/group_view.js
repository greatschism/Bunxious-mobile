var args = arguments[0] || {};
var moment = require('alloy/moment');

$.name.text = args.name;
$.createdAt.text = "Created " + moment(args.created_at).fromNow();
$.description.text = args.description;
