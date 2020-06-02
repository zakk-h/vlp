module.exports.raw = true;

var mainReplText = [
	[/__title__/g,'Lakeside Park'],
	[/__fulltitle__/g,'Valdese Lakeside Park'],
	[/__manifest_themecolor__/g,'#000000'],
	[/__manifest_background_color__/g,'#2196f3']
];

var zakklabReplText = [
	[/__title__/g,'Lakeside by Zakklab'],
	[/__fulltitle__/g,'Zakklab Valdese Lakeside Park'],
	[/__manifest_themecolor__/g,'#AA0000'],
	[/__manifest_background_color__/g, '#AA0000']
];

module.exports = function(s) {
	var replText = this.query.ZAKKLAB ? zakklabReplText : mainReplText;

	replText.forEach((v) =>	{s = s.replace(v[0],v[1]);});

	return s;
};