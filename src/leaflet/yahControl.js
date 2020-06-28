import {vlpDebug} from '../globals.js';
import * as yahMarkerSVG from '../img/yah.svg';

var YAHControl = L.Control.extend({
	options: {
		// defaults to map maxBounds
		maxBounds: null,

		// millisec interval where flyto location will NOT be repeated
		flyToInterval: 20000
	},
	initialize: function(options) {
        L.setOptions(this, options);
    },

	onAdd: function(map) {
		const flyToInterval = this.options.flyToInterval;
		var lastVisibleLocationTime = 0;
		var map_bounds = this.options.maxBounds || map.options.maxBounds;
		var btn = L.DomUtil.create('a','yahBtn');
		btn.title = 'You are here';
		btn.style.opacity = 0.8;
		L.DomUtil.create('i','yahSVG',btn);

		var yahIcon = L.divIcon({
			className: 'yah-divicon',
			html: `<img style="background:rgba(255,255,0,0.75); border:0; padding: 6px; border-radius:50%;" src="${yahMarkerSVG}">`,
			iconSize: [36, 36],
			iconAnchor: [18, 30]
		});
		var yahMarker = L.marker([35.75640,-81.58016],{icon:yahIcon}).bindTooltip('You are here');

		function yahToggle() {
			// great tool for svg filter color is at:
			// https://codepen.io/sosuke/pen/Pjoqqp
			vlpDebug('toggle yah');
			if (L.DomUtil.hasClass(btn,'yahActive')) {
				L.DomUtil.removeClass(btn,'yahActive');
				map.removeLayer(yahMarker);
				map.stopLocate();
			} else {
				L.DomUtil.addClass(btn,'yahActive');
				lastVisibleLocationTime = 0;
				map.locate({watch: true, enableHighAccuracy:true, timeout:60000, maximumAge:5000});
			}
		}

		L.DomEvent.on(btn,'click', yahToggle);
		L.DomEvent.disableClickPropagation(btn);

		map.on('locationfound', function(e) {
			var yahLatLng = e.latlng;
			var yahTime = e.timestamp;
			var firstLocationNotify = !map.hasLayer(yahMarker);
			vlpDebug('locate',yahLatLng);
		
			if (firstLocationNotify) {
				map.addLayer(yahMarker);
			}

			yahMarker.setLatLng(yahLatLng);

			// if user is in the park, flyTo their location if the map has not shown their location for more than
			// FLYTO_LOCATION_INTERVAL milliseconds
			if (!map_bounds || map_bounds.contains(yahLatLng)) {
				if (map.getBounds().contains(yahLatLng)) {
					// user is in the park, and location is shown on-screen
					lastVisibleLocationTime = yahTime;
				} else {
					// user is in the park, but location is currently off-screen
					if ((yahTime - lastVisibleLocationTime) >= flyToInterval) {
						vlpDebug('flying to location in park');
						lastVisibleLocationTime = yahTime;
						map.flyTo(yahLatLng);
					}
				}
			}
		});
		map.on('locationerror', function(e) {
			if (map.hasLayer(yahMarker)) {
				yahToggle();
				alert(e.message);
			}
		});

		// We could auto-start location using code like this
		//
		//if (window.matchMedia('(display-mode: standalone)').matches) {
		//	yahToggle();
		//}

		return btn;
	},

	onRemove: function(map) { },
});

export {YAHControl};