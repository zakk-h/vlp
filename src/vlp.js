import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon-2x.png';
import * as L from 'leaflet';
import './vlp-icon.js';
import {vlpConfig,vlpTrails,vlpOrienteering} from './parkmaps.js';
import * as yahMarkerSVG from './img/yah.svg';
import * as blankTile from './img/blankTile.png';
import * as fvr_logo from './img/fvrlogopng.png';
import * as img_parkplan from './img/dbd-parkplan.png';
import * as img_parkboundary from './img/park-boundary.png';
import * as img_photo from './img/park-satellite.jpg';
import * as img_terrain from './img/park-contour.png';
import zakklab from './zakklab.json';

const burkeGISMap = 'http://gis.burkenc.org/default.htm?PIN=2744445905';
const addZakklab = (location.href.indexOf('zakklab')>=0);
var vlpDebug = function() {};
if (location.href.indexOf('debug')>0) {
	vlpDebug = console.log;
	vlpDebug('Debug mode is activated for vlp app',location.href);
	if (addZakklab) vlpDebug('zakklab extension has been enabled');
}

function sprintf(s,...a) {
	var i=0;
	return s.replace(/%[%dfos]/g, function (m) { return m=="%%" ? "%" : a[i++].toString(); });
}

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
		gauge.style.width = '28px';
		gauge.style.overflow = 'hidden';
		gauge.style.background = 'rgba(250,248,245,0.6)';
		gauge.style.textAlign = 'center';
		map.on('zoomstart zoom zoomend', function(ev){
			gauge.innerHTML = map.getZoom();
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

		vlpDebug('blank tile for ',coords);
		return blankTile;
	}
});

function vlpMap() {
	var useHighAccuracy = true;
	
	var pixels = {w:1630,h:908};
	var map_bounds = new L.LatLngBounds(vlpConfig.gpsBoundsParkPlan);
	var valdese_area = vlpConfig.gpsBoundsValdese;
	var gpsCenter = map_bounds.getCenter();
	var map = L.map('image-map',{center: gpsCenter, minZoom: vlpConfig.osmZoomRange[0], zoom: vlpConfig.osmZoomRange[1], maxBounds:valdese_area});
	var mapTiles = new ValdeseTileLayer(vlpConfig.urlTileServer, {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		errorTileUrl: blankTile,
		crossOrigin: true,
		minZoom: vlpConfig.osmZoomRange[0],
		maxNativeZoom: vlpConfig.osmZoomRange[1]
		});
	map.addLayer(mapTiles);
	function gps(latitude,longitude) { return new L.LatLng(latitude,longitude); }
	map.attributionControl.setPrefix('');
	
	new WatermarkControl({position:'bottomleft'}).addTo(map);
	new ZoomViewer({position:'topleft'}).addTo(map);

	var parkboundaryLayer = L.imageOverlay(img_parkboundary, vlpConfig.gpsBoundsParkPlan);
	var parkplanLayer = L.imageOverlay(img_parkplan, vlpConfig.gpsBoundsParkPlan,{attribution:'<a href="https://dbdplanning.com/">Destination by Design</a>'});
	var photoLayer = L.imageOverlay(img_photo, [[35.760604, -81.570219],[35.778307, -81.534993]],{attribution:`<a href="${burkeGISMap}">gis.burkenc</a>`});
	var terrainLayer =L.imageOverlay(img_terrain, [[35.763224, -81.566366],[35.778292, -81.534960]],{attribution:`<a href="${burkeGISMap}">gis.burkenc</a>`,opacity:0.6});
	var baseMaps = {"Park Boundary":parkboundaryLayer,"Park Plan":parkplanLayer,"Photo": photoLayer,"Terrain": terrainLayer};
	var overlayMaps = {};
	
	map.addLayer(parkplanLayer);
	
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
	
	var yahIcon = L.divIcon({
		className: 'yah-divicon',
		html: sprintf('<img style="background:rgba(255,255,0,0.75); border:0; padding: 6px; border-radius:50%;" src="%s">',yahMarkerSVG),
		iconSize: [36, 36],
		iconAnchor: [18, 30]
    });
	var yahMarker = L.marker(gps(35.75640,-81.58016),{icon:yahIcon}).bindTooltip('You are here');
	map.addLayer(yahMarker);

	L.control.layers(baseMaps, overlayMaps, {position:'topright'}).addTo(map);
	map.attributionControl.addAttribution('<a href="https://friendsofthevaldeserec.org">FVR</a>');
	
	map.on('locationfound', function(e) {
		var yahLatLng = e.latlng;
		var firstLocationNotify = !map.hasLayer(yahMarker);
		vlpDebug('locate',yahLatLng);

		if (firstLocationNotify) {
			map.addLayer(yahMarker);
		}

		yahMarker.setLatLng(yahLatLng);
		if (map_bounds.contains(yahLatLng)) {
			vlpDebug('flying to parkplan location');
			map.flyTo(yahLatLng);
		}
	});
	map.on('locationerror', function(e) {
		if (map.hasLayer(yahMarker)) {
			map.removeLayer(yahMarker);
			alert(e.message);
		}
	});
	
	map.on('click',function(e){
		vlpDebug(e.latlng);
	});

	map.fitBounds(vlpConfig.gpsBoundsParkPlan);

	vlpDebug((useHighAccuracy ? 'U' : 'Not u')+'sing high accuracy location');
	map.locate({watch: true, enableHighAccuracy:useHighAccuracy});
}

export {vlpMap};
