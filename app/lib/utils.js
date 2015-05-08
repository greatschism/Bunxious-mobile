/*
 utils.js
 Bunxious

 Created by Lego on 2015-05-08.
 Copyright 2015 Lego. All rights reserved.

 */

var utils = {};

/*
 * Helper function for mapping the currency code to symbol
 */
utils.codeToCurrency = function(code) {

	var currency_symbols = {
		'USD' : '$', // US Dollar
		'EUR' : '€', // Euro
		'CRC' : '₡', // Costa Rican Colón
		'GBP' : '£', // British Pound Sterling
		'ILS' : '₪', // Israeli New Sheqel
		'INR' : '₹', // Indian Rupee
		'JPY' : '¥', // Japanese Yen
		'KRW' : '₩', // South Korean Won
		'NGN' : '₦', // Nigerian Naira
		'PHP' : '₱', // Philippine Peso
		'PLN' : 'zł', // Polish Zloty
		'PYG' : '₲', // Paraguayan Guarani
		'THB' : '฿', // Thai Baht
		'UAH' : '₴', // Ukrainian Hryvnia
		'VND' : '₫', // Vietnamese Dong
	};
	
	return currency_symbols[code] ? currency_symbols[code] : code;
};

module.exports = utils;