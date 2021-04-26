import {mdiTableFurniture, mdiFlagTriangle, mdiCamera, mdiCarMultiple, mdiParking, 
	mdiSailBoat, mdiBridge, mdiNature, mdiInformationOutline, mdiWaves,
	mdiBike, mdiFish, mdiShipWheel, mdiImageFilterHdr, mdiBeach, mdiCctv, mdiSofaSingle,
	mdiMapMarker, mdiGasStation, mdiSilverwareForkKnife, 
	mdiFood, mdiBeer, mdiGlassWine, mdiDelete, mdiLadder, mdiHelp, mdiDumpTruck, mdiMower, mdiBarley, mdiFireHydrant} from '@mdi/js';

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
	info:    mdiInformationOutline,
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
	info:	{path: mdiSVGPaths.info,fill:'#0000AA'},
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
	construction: {path: mdiSVGPaths.construction, fill: '#E1A911', stroke: '#000000', strokeWidth: 1.0, size: 175},
	mower: {path: mdiSVGPaths.mower, fill: '#45050F', stroke: '#FFFFFF', size: 42},
	weed: {path: mdiSVGPaths.weed, fill: '#A3A113', stroke: '#FFFFFF', size: 40},
	hydrant: {path: mdiSVGPaths.hydrant, fill: '#DD2E2E', size: 32},
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
