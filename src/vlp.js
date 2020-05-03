import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon-2x.png';
import * as L from 'leaflet';
import './vlp-icon.js';
import {vlpConfig,vlpTrails,vlpOrienteering} from './parkmaps.js';
import * as blankTile from './img/blankTile.png';
import * as fvr_logo from './img/fvrlogopng.png';
import * as img_parkplan from './img/parkplan.jpg';
import * as img_parkplanhybrid from './img/parkplanhybrid.jpg';
import * as img_photo from './img/photo.jpg';
import * as img_terrain from './img/terrain.jpg';
import zakklab from './zakklab.json';

const burkeGISMap = 'http://gis.burkenc.org/default.htm?PIN=2744445905';
const addZakklab = location.href.search('zakklab');

var WatermarkControl = L.Control.extend({
	onAdd: function(map) {
		var img = L.DomUtil.create('img');

		img.src = fvr_logo;
		img.style.width = '50px';
		img.style.opacity = 0.5;

		return img;
	},

	onRemove: function(map) { }
});

var ZoomViewer = L.Control.extend({
	onAdd: function(map){
		var gauge = L.DomUtil.create('div');
		gauge.style.width = '160px';
		gauge.style.background = 'rgba(255,255,255,0.5)';
		gauge.style.textAlign = 'left';
		map.on('zoomstart zoom zoomend', function(ev){
			gauge.innerHTML = 'Zoom: ' + map.getZoom();
		})
		return gauge;
	}
});

var ValdeseTileLayer = L.TileLayer.extend({
	getTileUrl: function(coords) {
		var zBox = vlpConfig.osmTileRanges[coords.z];
		if (zBox) {
			var x = coords.x, y = coords.y;
			if ((x >= zBox[0][0]) && (x <= zBox[1][0]) && (y >= zBox[0][1]) && (y <= zBox[1][1])) {
				return L.TileLayer.prototype.getTileUrl.call(this,coords);
			}
		}

		console.log('blank tile for ',coords);
		return blankTile;
	}
});

function vlpMap(debugMode) {
	var useHighAccuracy = true;
	var vlpDebug = debugMode ? console.warn : function() {return;};
	
	var pixels = {w:1630,h:908};
	var gpsP = [[35.7782,-81.5347],[35.7607,-81.5718]];
	var map_bounds = new L.LatLngBounds(gpsP);
	var valdese_area = vlpConfig.gpsBoundsValdese;
	var gpsCenter = map_bounds.getCenter();
	var map = L.map('image-map',{center: gpsCenter, minZoom: vlpConfig.osmZoomRange[0], zoom: 13, maxBounds:valdese_area});
	var mapTiles = new ValdeseTileLayer(vlpConfig.urlTileServer, {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		minZoom: vlpConfig.osmZoomRange[0],
		maxNativeZoom: vlpConfig.osmZoomRange[1]
		});
	map.addLayer(mapTiles);
	function gps(latitude,longitude) { return new L.LatLng(latitude,longitude); }
	//map.attributionControl.setPrefix('Leaflet');
	
	new WatermarkControl({position:'bottomleft'}).addTo(map);
	new ZoomViewer({position:'topleft'}).addTo(map);

	var parkplanLayer = L.imageOverlay(img_parkplan, map_bounds,{interactive:true,attribution:'<a href="https://dbdplanning.com/">Destination by Design</a>',opacity:0.8});
	var parkplanHybridLayer = L.imageOverlay(img_parkplanhybrid, map_bounds,{interactive:true});
	var photoLayer = L.imageOverlay(img_photo, map_bounds,{interactive:true,attribution:`<a href="${burkeGISMap}">gis.burkenc</a>`});
	var terrainLayer =L.imageOverlay(img_terrain, map_bounds,{interactive:true,attribution:`<a href="${burkeGISMap}">gis.burkenc</a>`});
	var baseMaps = {"Hybrid Park Plan":parkplanHybridLayer,"Park Plan":parkplanLayer,"Photo": photoLayer,"Terrain": terrainLayer};
	var overlayMaps = {};
	
	map.addLayer(parkplanHybridLayer);
	
	function vlpAddTrail(v,i) {
		var nlo = {color:v.color,opacity:1.0,weight:9};
		if (v.secret) return;
		if (v.dash) {
			nlo['dashArray'] = "10";
			nlo['weight'] = 5;
		}
		var newLayer = L.polyline(v.trail, nlo);
		var tt = `<span style="color:${v.color}">${v.name} </span><span class="mileage">(${v.miles} miles)</span>`;
		newLayer.bindTooltip(tt,{ 'sticky': true });
		overlayMaps[tt] = newLayer;
		if (!v.optional) {
			map.addLayer(newLayer);
		}
	}
	vlpTrails.forEach(vlpAddTrail);
	if (addZakklab) {
		zakklab.forEach(vlpAddTrail);
	}
	
	var markerPts = [];
	vlpOrienteering.forEach(
		function(v,i) {
			markerPts.push(L.marker(gps(v[0],v[1])).bindPopup(v[2]));
		}
	);
	overlayMaps['Landmarks & Sightseeing'] = L.layerGroup(markerPts);
	
	var yahIcon = L.divIcon({className: 'yah-divicon',iconAnchor:[0,24],labelAnchor:[-6, 0],popupAnchor:[0, -36],html:'<span/>'});
	var yahMarker = L.marker(gps(35.75640,-81.58016),{icon:yahIcon}).bindTooltip('You are here');
	var yahPopup = L.popup();
	var yahText = 'You Are Here';
	var yahLatLng = false;
	overlayMaps[yahText] = yahMarker;
	
	yahPopup.setContent('no location');
	yahMarker.bindPopup(yahPopup);
	
	L.control.layers(baseMaps, overlayMaps, {position:'topright'}).addTo(map);
	map.attributionControl.addAttribution('<a href="https://friendsofthevaldeserec.org">Friends of the Valdese Rec</a>');
	
	map.on('locationfound', function(e) {
		yahLatLng = e.latlng;
		yahMarker.setLatLng(gps(yahLatLng.lat,yahLatLng.lng));
		yahPopup.setContent('('+yahLatLng.lat+','+yahLatLng.lng+')');
		vlpDebug('locate',e.latlng);}
		);
	map.on('locationerror', function(e) {alert(e.message);});
	
	map.on('overlayadd',function(e) {
		if (e.name == yahText) {
			vlpDebug((useHighAccuracy ? 'U' : 'Not u')+'sing high accuracy location');
			map.locate({watch: true, enableHighAccuracy:useHighAccuracy});
			map.setZoom(1);
		}
	});
	
	map.on('overlayremove',function(e) {
		if (e.name == yahText) {
			vlpDebug('no longer tracking location');
			map.stopLocate();
		}
	});
	
	map.addLayer(overlayMaps[yahText]);
	
	map.fitBounds(valdese_area);
}

export {vlpMap};
