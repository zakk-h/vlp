module.exports = function(zakklab) {
	var o = {
		apptitle: 'Lakeside Park',
		appfulltitle: 'Valdese Lakeside Park',
		manifest_themecolor: '#000000',
		manifest_bgcolor: '#2196f3',
		zakklab: zakklab
	};
	
	if (zakklab) {
		o = Object.assign(o, {
			apptitle: 'Lakeside by Zakklab',
			appfulltitle: 'Zakklab Valdese Lakeside Park',
			manifest_themecolor: '#AA0000',
			manifest_bgcolor: '#AA0000'
		});
	}

	return o;
}