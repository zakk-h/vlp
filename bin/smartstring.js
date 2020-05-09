var smartstringRe = /\{ *([\w_-]+) *\}/g;
function smartstring(str, data) {
	return str.replace(smartstringRe, function (str, key) {
		var value = data[key];

		if (value === undefined) {
			throw new Error('No value for variable ' + str);

		} else if (typeof value === 'function') {
			value = value(data);
		}
		return value;
	});
}

module.exports = smartstring;