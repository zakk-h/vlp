const {vlpConfig} = require('../src/parkmaps.js');

// a tool for calculating gps area:
// https://tools.geofabrik.de/calc/

// tile image sizes can be reduced by running
// `pngquant --quality 10-50 --ext=.png --force *.png`
//
// can be optimized further using zopflipng:
// find . -name '*.png' -print0 | xargs -0 -n1 -I{} sh -c 'zopflipng {} output.png; [ -f output.png ] && mv output.png {};'

const sleepEvery = 9;

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

console.log('#!/usr/bin/bash');
console.log('# Generate curl statements');
for (var z=vlpConfig.osmZoomRange[0]; z<=vlpConfig.osmZoomRange[1];z++) {
	var za = vlpConfig.osmTileRanges[z];
	var s = 0;
	var data = {'s': 'a', 'z': z, 'x': 0, 'y': 0};

	console.log(smartstring('mkdir -p tiles/{z}',data));
	for (var x=za[0][0]; x<=za[1][0];x++) {
		data.x = x;

		for (var y=za[0][1]; y<=za[1][1];y++) {
			data.s = 'abc'[(s++ % 3)];
			data.y = y;

			console.log(smartstring('curl '+vlpConfig.urlOSMTileServer+' -o tiles/{z}/{x}_{y}.png',data));
			if ((s%sleepEvery) == 0) { console.log('sleep 1s'); }
		}
	}
}

// zopflipng -m
//  ZopfliPNG and pngquant