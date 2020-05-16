const {vlpConfig} = require('../src/parkmaps.js');
const path = require('path');
const fs = require('fs');
const smartstring = require('./smartstring.js');

function base64_encode(f) {
	return fs.readFileSync(f,{encoding:'base64'}); 
}

for (var z=vlpConfig.osmZoomRange[0]; z<=vlpConfig.osmZoomRange[1];z++) {
	var za = vlpConfig.osmTileRanges[z];
	var s = 0;
	var data = {'z': z, 'x': 0, 'y': 0};
	var xtiles = [];

	for (var x=za[0][0]; x<=za[1][0];x++) {
		var ytiles = [];
		data.x = x;

		for (var y=za[0][1]; y<=za[1][1];y++) {
			data.y = y;
			var imgFile = smartstring('./tiles/{z}/{x}_{y}.png',data);
			ytiles.push(base64_encode(imgFile));
		}
		xtiles.push(ytiles);
	}

	console.log('writing  file for zoom level',z);
	fs.writeFileSync(smartstring('./tiles/zoom_{z}.json',data),JSON.stringify(xtiles));
}

console.log('Done.');
