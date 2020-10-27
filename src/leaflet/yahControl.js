import {vlpDebug} from '../globals.js';

var YAHControl = L.Control.extend({
	options: {
		maxBounds: null,
		flyToInterval: 20000
	},
	initialize: function(options) {
        L.setOptions(this, options);
    },

	bindTo: function(map ) {
		const flyToInterval = this.options.flyToInterval;
		var lastVisibleLocationTime = 0;
		var map_bounds = this.options.maxBounds || map.options.maxBounds;
		var btn = document.getElementById('btnid-yah');
		var yahIcon = L.divIcon({
			className: 'yah-divicon',
			html: '<i class="fvricon fvricon-walk" style="font-size:32px;background:rgba(255,255,0,0.70); border:0; padding: 6px; border-radius:50%;"></i>',
			iconSize: [36, 36],
			iconAnchor: [18, 30]
		});
		var yahMarker = L.marker([35.75640,-81.58016],{icon:yahIcon}).bindTooltip('You are here');

		function yahActive() {return btn.classList.contains('active');}
		function yahActivate(b) {
			let b_c = yahActive();
			vlpDebug('toggle yah');

			if (b == b_c) return;

			if (b) {
				btn.classList.add('active');
				lastVisibleLocationTime = 0;
				map.locate({watch: true, enableHighAccuracy:true, timeout:60000, maximumAge:5000});
			} else {
				btn.classList.remove('active');
				map.removeLayer(yahMarker);
				map.stopLocate();
			}

			localStorage.yah = b;
		}

		btn.addEventListener('click', (e) => {
			e.stopPropagation();
			e.preventDefault();
			yahActivate(!yahActive());
		});

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
			if (yahActive()) {
				yahActivate(false);
				alert(e.message);
			}
		});

		if (localStorage.yah) yahActivate(true);
	},
});

export {YAHControl};