import {vlpConfig} from '../config.js';
import * as blankTile from '../img/blankTile.png';

var ValdeseTileLayer = L.TileLayer.extend({
	options: {
		// default is to crop outside of Burke County area
		cropTo: [[35.816, -81.833], [35.697, -81.406]]
	},

	initialize: function (tileServer, options) {
		options = options || {};
		L.Util.setOptions(this, options);
		L.TileLayer.prototype.initialize.call(this,tileServer,options);
		this._crop = null;
	},

	getTileUrl: function(coords) {
		let doCall = true;

		if (this._crop && (coords.z >= 1)) {
			let pz = this._crop[coords.z];

			// only allow tile retrieval within the crop boundary
			doCall = false;

			if (pz) {
				let x = coords.x, y = coords.y;
				if ((x >= pz[0]) && (x <= pz[2]) && (y >= pz[1]) && (y <= pz[3])) {
					doCall = true;
				}
			}
		}

		return doCall ? L.TileLayer.prototype.getTileUrl.call(this,coords) : blankTile;
	}
});

function BuildCropArray(cropTo, minZoom, maxZoom) {
	let crop = [];
	let b = L.latLngBounds(cropTo);

	// use the screen size to determine extra tiles that should border the target area
	const x_blocks = Math.max(2, Math.ceil((screen.width || 1800)/256));
	const y_blocks = Math.max(2, Math.ceil((screen.height || 1800)/256));

	function convToTileNum(v,o) {
		let f = (o > 0) ? Math.ceil : Math.floor;
		return f((v/256) + o);
	}

	for (let i=maxZoom; i>=minZoom; i--) {
		// loop through the zoom levels, constructing a tile number boundary
		let p1 = L.CRS.EPSG3857.latLngToPoint(b.getNorthWest(),i);
		let p2 = L.CRS.EPSG3857.latLngToPoint(b.getSouthEast(),i);
		crop[i] = [convToTileNum(p1.x,-x_blocks),convToTileNum(p1.y,-y_blocks),convToTileNum(p2.x,x_blocks),convToTileNum(p2.y,y_blocks)];
	}

	return crop;
}

ValdeseTileLayer.addInitHook(function() {
	if (this.options.cropTo) this._crop = BuildCropArray(this.options.cropTo, this.options.minNativeZoom || this.options.minZoom, this.options.maxNativeZoom || this.options.maxZoom);
});

export {ValdeseTileLayer};
