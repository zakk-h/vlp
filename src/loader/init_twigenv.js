module.exports = function(zakklab) {
	var o = {
		apptitle: 'Lakeside Park',
		appfulltitle: 'Valdese Lakeside Park',
		manifest_themecolor: '#000000',
		manifest_bgcolor: '#2196f3',
		zakklab: zakklab
	};
	
	if (zakklab) {
		Object.assign(o, {
			apptitle: 'Lakeside by Zakklab',
			appfulltitle: 'Zakklab Valdese Lakeside Park',
			manifest_themecolor: '#AA0000',
			manifest_bgcolor: '#AA0000'
		});
	}

	let iconList = 'backburger,city,cog,directions,home,information,link,menu,github,facebook,instagram,twitter,donate,ishare,natureman,together,voice,walk'.split(',');
	let icons = {};
	iconList.forEach(k => icons[k] = `<i class="fvricon fvricon-${k}"></i>`);
	o.icon = icons;

	return o;
}