import * as fvr_logo from '../img/fvrlogopng.png';

var FVRWatermarkControl = L.Control.extend({
	onAdd: function(map) {
		var link = L.DomUtil.create('a','fvrlink');
		var img = L.DomUtil.create('img','fvrlogo',link);

		img.src = fvr_logo;

		return link;
	},

	onRemove: function(map) { }
});

export {FVRWatermarkControl};