import {vlpDebug} from '../globals.js';

var YAHControl = L.Control.extend({
	options: {
		maxBounds: null,
		flyToInterval: 20000
	},
	initialize: function(options) {
        L.setOptions(this, options);
    },

	bindTo: function(map) {
		const options = this.options;
		const flyToInterval = options.flyToInterval;
		let lastVisibleLocationTime = 0;
		let btn = document.getElementById('btnid-yah');
		let yahIcon = L.divIcon({
			className: 'yah-divicon',
			html: '<i class="fvricon fvricon-walk" style="font-size:32px;background:rgba(255,255,0,0.70); border:0; padding: 6px; border-radius:50%;"></i>',
			iconSize: [36, 36],
			iconAnchor: [18, 30]
		});
		let yahMarker = L.marker([35.75640,-81.58016],{icon:yahIcon}).bindTooltip('You are here');

		function yahActive() {return btn.classList.contains('active');}
		function yahActivate(b) {
			let b_c = yahActive();
			vlpDebug('yahActivate '+b);

			if (b == b_c) return;

			btn.classList.toggle('active');
			if (b) {
				lastVisibleLocationTime = 0;
				map.locate({watch: true, enableHighAccuracy:true, timeout:60000, maximumAge:5000});
			} else {
				map.removeLayer(yahMarker);
				map.stopLocate();
			}

			if (localStorage) {
				if (b) localStorage.yah = 1;
				else localStorage.removeItem('yah');
			}
		}

		btn.addEventListener('click', (e) => {
			e.stopPropagation();
			yahActivate(!yahActive());
		});

		map.on('locationfound', function(e) {
			let map_bounds = options.maxBounds || map.options.maxBounds;
			let yahLatLng = e.latlng;
			let yahTime = e.timestamp;
			let firstLocationNotify = !map.hasLayer(yahMarker);
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
						vlpDebug('yah flying to location');
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

		if (localStorage && localStorage.yah) yahActivate(true);
	},
});

export {YAHControl};