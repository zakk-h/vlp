import {vlpConfig} from '../config.js';

var ValdeseTileLayer = L.TileLayer.extend({
	getTileUrl: function(coords) {
		var zBox = vlpConfig.osmTileRanges[coords.z];
		if (zBox) {
			var x = coords.x, y = coords.y;
			if ((x >= zBox[0][0]) && (x <= zBox[1][0]) && (y >= zBox[0][1]) && (y <= zBox[1][1])) {
				return L.TileLayer.prototype.getTileUrl.call(this,coords);
			}
		}

		return blankTile;
	}
});

export {ValdeseTileLayer};