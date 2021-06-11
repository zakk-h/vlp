import {mdiTableFurniture, mdiFlagTriangle, mdiCamera, mdiCarMultiple, mdiParking, 
	mdiSailBoat, mdiBridge, mdiNature, mdiInformation, mdiWaves,
	mdiBike, mdiFish, mdiShipWheel, mdiImageFilterHdr, mdiBeach, mdiCctv, mdiSofaSingle,
	mdiMapMarker, mdiGasStation, mdiSilverwareForkKnife, 
	mdiFood, mdiBeer, mdiGlassWine, mdiDelete, mdiLadder, mdiHelp, mdiDumpTruck, mdiMower, mdiBarley, mdiFireHydrant, mdiPaw} from '@mdi/js';

// https://materialdesignicons.com

const mdiSVGPaths = {
	beach:   mdiBeach,
	bike:    mdiBike,
	boat:    mdiSailBoat,
	bridge:  mdiBridge,
	camera:  mdiCamera,
	cars:    mdiCarMultiple,
	fish:    mdiFish,
	flag:    mdiFlagTriangle,
	info:    mdiInformation,
	nature:  mdiNature,
	parking: mdiParking,
	picnic:  mdiTableFurniture,
	rock:    mdiImageFilterHdr,
	cctv: 	 mdiCctv,
	waves:   mdiWaves,
	wheel:   mdiShipWheel,
	sofa:	 mdiSofaSingle,
	beer:		mdiBeer,
	food:		mdiSilverwareForkKnife,
	ffood:		mdiFood,
	food:		mdiSilverwareForkKnife,
	gas:		mdiGasStation,
	marker:		mdiMapMarker,
	wine:		mdiGlassWine,
	trash:		mdiDelete,
	ladder:		mdiLadder,
	question:	mdiHelp,
	construction: mdiDumpTruck,
	mower: mdiMower,
	weed: mdiBarley,
	hydrant: mdiFireHydrant,
	wildlife: mdiPaw,
}

const mdiSVGIcons = {
	_default: {
		path: mdiSVGPaths.marker,
		size: 32,
		stroke: '#FFFFFF',
		strokeWidth: 0.5,
		fill: '#000000',
		anchor: [0.5,0.5]
	},
	beach: {path: mdiSVGPaths.beach,fill:'#EEAB04',stroke:'#000000', size: 29},
	bike: {path: mdiSVGPaths.bike},
	boat: {path: mdiSVGPaths.boat,fill:'#A52A2A'},
	beer:	{path: mdiSVGPaths.beer,fill:'#d3c934',stroke:'#FFFFFF',strokeWidth: 1.2},
	bridge:	{path: mdiSVGPaths.bridge,strokeWidth:0,size:48},
	camera:	{path: mdiSVGPaths.camera,fill:'#040421'},
	cars:	{path: mdiSVGPaths.cars,fill:'#A88C8C',stroke:'#000000'},
	food:	{path: mdiSVGPaths.food,fill:'#ffffff',stroke:'#000000',size:28},
	ffood:	{path: mdiSVGPaths.ffood,fill:'#f2eeb3',stroke:'#000000'},
	fish:	{path: mdiSVGPaths.fish,fill:'#F6E35B',stroke:'#000000',strokeWidth:1},
	flag:	{path: mdiSVGPaths.flag,fill:'#EF6C00',anchor:[0,1.0]},
	gas:	{path: mdiSVGPaths.gas,fill:'#400559',stroke:'#FFFFFF',strokeWidth:1.0,size:28},
	info:	{path: mdiSVGPaths.info,fill:'#0000AA', size: 40},
	ladder: {path: mdiSVGPaths.ladder,fill:'#3F2812', size: 35, stroke: '#FFFFFF'},
	marker: {path: mdiSVGPaths.marker,stroke:'#0000AA',fill:'#FFFFFF'},
	nature:	{path: mdiSVGPaths.nature,fill:'#00AA00',anchor:[0.5,1.0]},
	parking: {path: mdiSVGPaths.parking,fill:'#0000AA'},
	picnic:	{path: mdiSVGPaths.picnic,fill:'#5C2F00'},
	cctv:   {path: mdiSVGPaths.cctv,strokeWidth:1,size:24,fill:'#7C8216'},
	rock:	{path: mdiSVGPaths.rock,fill:'#70BB0A',stroke:'#000000', size: 31}, 
	waves:	{path: mdiSVGPaths.waves,fill:'#000066'},
	wheel:	{path: mdiSVGPaths.wheel,fill:'#5C2F00'},
	sofa:	{path: mdiSVGPaths.sofa,fill:'#260D4E', size: 28},
	wine:	{path: mdiSVGPaths.wheel,fill:'#9e0c35'},
	trash: {path: mdiSVGPaths.trash,fill:'#000000', size:30},
	ladder: {path: mdiSVGPaths.ladder,fill:'#3F2812', size: 35, stroke: '#FFFFFF'},
	question: {path: mdiSVGPaths.question,fill:'#6D0E0E', stroke: '#B0891E'},
	construction: {path: mdiSVGPaths.construction, fill: '#E1A911', stroke: '#000000', strokeWidth: 1.0, size: 120},
	mower: {path: mdiSVGPaths.mower, fill: '#45050F', stroke: '#FFFFFF', size: 42},
	weed: {path: mdiSVGPaths.weed, fill: '#A3A113', stroke: '#FFFFFF', size: 40},
	hydrant: {path: mdiSVGPaths.hydrant, fill: '#DD2E2E', size: 32},
	blackw: {path: mdiSVGPaths.wildlife, fill: '#000000', size: 33},
	yelloww: {path: mdiSVGPaths.wildlife, fill: '#DFF007', size: 33},
	cyanw: {path: mdiSVGPaths.wildlife, fill: '#00F7D6', size: 33},
	orangew: {path: mdiSVGPaths.wildlife, fill: '#FFAA00', size: 33},
	tanw: {path: mdiSVGPaths.wildlife, fill: '#B6783F', size: 33},
	whitew: {path: mdiSVGPaths.wildlife, fill: '#FFFFFF', size: 33},
	redw: {path: mdiSVGPaths.wildlife, fill: '#FF0000', size: 33},
	grayw: {path: mdiSVGPaths.wildlife, fill: '#8E908B', size: 33},
	bluew: {path: mdiSVGPaths.wildlife, fill: '#20A2C6', size: 33},
	brownw: {path: mdiSVGPaths.wildlife, fill: '#775541', size: 28},
	pinkw: {path: mdiSVGPaths.wildlife, fill: '#FF0093', size: 33},
	greenw: {path: mdiSVGPaths.wildlife, fill: '#228A13', size: 33},
	purplew: {path: mdiSVGPaths.wildlife, fill: '#960A96', size: 33},
	limew: {path: mdiSVGPaths.wildlife, fill: '#3FE114', size: 33},
}

function buildIcon(icoName) {
	// make a duplicate of the mdiSVGIcons default object, then augment it
	// with values from the true mdiSVGIcons data
	var icon = Object.assign({},mdiSVGIcons._default);
	var i2 = mdiSVGIcons[icoName];
	if (i2) {
		for (var attrname in i2) { icon[attrname] = i2[attrname]; }
	}

	var sz = [icon.size,icon.size];
	var anchor = sz.map((v,i) => Math.round(icon.anchor[i]*v));
	var popAnchor = [0,-anchor[1]];

	var path = '<path';
	if (icon.strokeWidth > 0) {
		path += ` stroke="${icon.stroke}" stroke-width="${icon.strokeWidth}"`;
	}
	path += ` fill="${icon.fill}" d="${icon.path}">`;

	return L.divIcon({
		className: 'icon-mdi',
		html: `<svg style="width:${sz[0]}px;height:${sz[1]}px" viewBox="0 0 24 24">${path}></svg>`,
		iconSize: sz,
		iconAnchor: anchor,
		popupAnchor: popAnchor
	});
}

var svgIconCache = {};
function createSVGIcon(i) {
	return svgIconCache[i] || (svgIconCache[i] = buildIcon(i));
}

export {createSVGIcon, mdiSVGPaths, mdiSVGIcons};
