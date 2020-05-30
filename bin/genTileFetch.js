const {vlpConfig} = require('../src/config.js');
const path = require('path');
const fs = require('fs');
const smartstring = require('./smartstring.js');

// a tool for calculating gps area:
// https://tools.geofabrik.de/calc/

// tile image sizes can be reduced by running:
// pngquant --quality 10-50 --ext=.png --force *.png
//
// can be optimized further using zopflipng:
// find . -name '*.png' -print0 | xargs -0 -n1 -I{} sh -c 'zopflipng {} output.png; [ -f output.png ] && mv output.png {};'

const sleepEvery = 9;

console.log('#!/usr/bin/bash');
console.log('# Generate curl statements');
for (var z=vlpConfig.osmZoomRange[0]; z<=vlpConfig.osmZoomRange[1];z++) {
	var za = vlpConfig.osmTileRanges[z];
	var s = 0;
	var data = {'s': 'a', 'z': z, 'x': 0, 'y': 0};
	var filename = smartstring('tiles/{z}',data);

	if (!fs.existsSync(filename)) {
		console.log(smartstring('mkdir -p '+filename));
	}

	for (var x=za[0][0]; x<=za[1][0];x++) {
		data.x = x;

		for (var y=za[0][1]; y<=za[1][1];y++) {
			data.y = y;
			if (!fs.existsSync(smartstring('tiles/{z}/{x}_{y}.png',data))) {
				data.s = 'abc'[(s++ % 3)];
				console.log(smartstring('curl https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png -o tiles/{z}/{x}_{y}.png',data));
				if ((s%sleepEvery) == 0) { console.log('sleep 1s'); }
			}
		}
	}
}
