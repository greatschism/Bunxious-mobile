var dataFile = 'country_names_and_code_elements_txt',
    fromCode = {},
    fromName = {};

// Read data from ISO's file
var f = Ti.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory + '/c2c', dataFile);
var csv = f.read();

var lines = csv.toString().split("\r\n");


for (var i in lines) {

	var row = lines[i].split(';');
	var code = row.pop();
	var nameParts = row.pop();
	var name = '';
	
	var n = nameParts.toString().split(/,\s+/);

	for (var j in n) {

		name += n[j];
		fromCode[code.toUpperCase()] = name;
		fromName[name.toUpperCase()] = code;
		name += ', ';
	}
}

// Register a number of name variants and special cases
fromName['KOSOVO'] = fromName['REPUBLIC OF KOSOVO'] = fromName['KOSOVO AND METOHIJA'] = 'XK';
fromName['MACEDONIA (FYROM)'] = fromName['MACEDONIA'];
fromName['SYRIA'] = fromName['SYRIAN ARAB REPUBLIC'];
fromName['REPUBLIC OF THE PHILIPPINES'] = fromName['PHILIPPINES'];
fromName['UNITED STATES OF AMERICA'] = fromName['UNITED STATES'];
fromName['RUSSIA'] = fromName['RUSSIAN FEDERATION'];
fromName['SOUTH KOREA'] = fromName['KOREA, REPUBLIC OF'];
fromName['THE NETHERLANDS'] = fromName['NETHERLANDS'];
fromName['SÃO TOMÉ AND PRÍNCIPE'] = fromName['SAO TOME AND PRINCIPE'];

/**
 * Get a country code for a country name. Case-insensitive.
 *
 * Examples:
 *
 *   // Returns 'CH'
 *   countrynames.getCode('Switzerland')
 *   // Returns 'BB'
 *   countrynames.getCode('BarbaDOS')
 *
 * @param {String} English country name as of the ISO standard
 * @return {String} Two-letter country code as of the ISO standard, uppercase
 * @api public
 */
exports.getCode = function(name) {
	return fromName[name.toUpperCase()];
};

/**
 * Get a country name for a country code. Case-insensitive.
 *
 * Examples:
 *
 *   // Returns 'TONGA'
 *   countrynames.getCode('TO')
 *   // Returns 'RÉUNION'
 *   countrynames.getCode('re')
 *
 * @param {String} Two-letter country code as of the ISO standard
 * @return {String} English country name as of the ISO standard, uppercase
 * @api public
 */
exports.getName = function(code) {
	return fromCode[code.toUpperCase()];
};

/**
 * Get a country name for a country code. Case-insensitive.
 *
 * Example:
 *
 *   // Returns an array ["AD", ... "ZW"]
 *   countrynames.getAllCodes();
 *
 * @return {Array} All two-letter country codes defined in the ISO standard
 * @api public
 */
exports.getAllCodes = function() {
	return Object.keys(fromCode).slice(1).sort();
};

/**
 * Get a country name for a country code. Case-insensitive.
 *
 * Example:
 *
 *   // Returns an array ["AFGHANISTAN", ... "ZIMBABWE", "ÅLAND ISLANDS"]
 *   countrynames.getAllCodes();
 *
 * @return {Array} All country names in the ISO standard, sorted alphabetically in your locale, if available
 * @api public
 */
exports.getAllNames = function() {
	return Object.keys(fromName).slice(1).sort(function(a, b) {
		return a.localeCompare(b);
	});
};
