import * as g from './globals.js';
import * as L from 'leaflet';
import {format,formatDistance,formatRelative} from 'date-fns';
import * as mdiIcons from './vlp-mdi-icons';
import {vlpConfig,vlpTrails,vlpOrienteering, vlpLandmarks} from './parkmaps.js';
import 'leaflet/dist/leaflet.css';
import './leaflet/grpLayerControl.css';
import './leaflet/yahControl.css';
import './vlpStyles.css';
import './modal.css';
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon-2x.png';
import './leaflet/grpLayerControl.js';
import {YAHControl} from './leaflet/yahControl.js';
import './vlp-manifest-icons.js';
import {showModal} from './modal.js';
import * as blankTile from './img/blankTile.png';
import * as fvr_logo from './img/fvrlogopng.png';
import * as img_parkplan from './img/dbd-parkplan.png';
import * as img_parkboundary from './img/park-boundary.png';
import * as img_photo from './img/park-satellite.jpg';
import * as img_terrain from './img/park-contour.png';
import zakklab from './zakklab.json';
import whatsnew from './whatsnew.json';

const vlpDebug = g.vlpDebug;

function showWhatsNew(map) {
	var lastseen = localStorage.vintage;
	var t_newest = whatsnew[0][0];

	if (!lastseen) { localStorage.vintage = t_newest; return; }
	if (t_newest <= lastseen) { return; }

	var whatnewHtml = '<p>The Lakeside Park app has been updated. Recent changes to the app include:</p><ul>';
	var now = new Date();
	const tdfmt = {addSuffix:true};

	vlpDebug('Showing whatsnew modal');

	for (var i=0; i<whatsnew.length; i++) {
		var t =  whatsnew[i][0];
		if (t <= lastseen) break;
		var d2 = new Date(t*1000);
		whatnewHtml += g.sprintf('<li>%s (%s)</li>',whatsnew[i][1],formatDistance(d2,now,tdfmt));
	}
	whatnewHtml += '</ul>';

	showModal('App Update',whatnewHtml,function() {
		vlpDebug('whatsnew has been closed');
		localStorage.vintage = t_newest;
	});
}

var fvrWatermarkControl = L.Control.extend({
	onAdd: function(map) {
		var link = L.DomUtil.create('a','fvrlink');
		var img = L.DomUtil.create('img','fvrlogo',link);

		link.href = 'https://friendsofthevaldeserec.org/valdese-lakeside-park-2';
		link.target = '_blank';
		img.src = fvr_logo;

		return link;
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
	const burkeGISMap = 'http://gis.burkenc.org/default.htm?PIN=2744445905';
	var parkplan_bounds = new L.LatLngBounds(vlpConfig.gpsBoundsParkPlan);
	var valdese_area = vlpConfig.gpsBoundsValdese;
	var gpsCenter = parkplan_bounds.getCenter();
	var map = L.map('image-map',{center: gpsCenter, minZoom: vlpConfig.osmZoomRange[0], zoom: vlpConfig.osmZoomRange[1], maxBounds:valdese_area});
	var mapTiles = new ValdeseTileLayer(vlpConfig.urlTileServer, {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		errorTileUrl: blankTile,
		crossOrigin: true,
		minZoom: vlpConfig.osmZoomRange[0],
		maxNativeZoom: vlpConfig.osmZoomRange[1]
		});
	var fvrMark = new fvrWatermarkControl({position:'bottomleft'});
	var yahBtn = new YAHControl({
		position:'topright',
		//for testing,
		//maxBounds:new L.LatLngBounds(valdese_area).pad(2)
		maxBounds:parkplan_bounds
	});
	map.addLayer(mapTiles);
	function gps(latitude,longitude) { return new L.LatLng(latitude,longitude); }
	map.attributionControl.setPrefix('');
	
	fvrMark.addTo(map);

	var parkplanLayer = L.imageOverlay(img_parkplan, vlpConfig.gpsBoundsParkPlan,{attribution:'<a href="https://dbdplanning.com/">Destination by Design</a>'});
	var photoLayer = L.imageOverlay(img_photo, [[35.760604, -81.570219],[35.778307, -81.534993]],{attribution:`<a href="${burkeGISMap}">gis.burkenc</a>`});
	var terrainLayer =L.imageOverlay(img_terrain, [[35.763224, -81.566366],[35.778292, -81.534960]],{attribution:`<a href="${burkeGISMap}">gis.burkenc</a>`,opacity:0.6});
	var baseMaps = {"Park Plan":parkplanLayer,"Photo": photoLayer,"Terrain": terrainLayer};
	var groupedOverlays = {};
	
	map.addLayer(parkplanLayer);
	
	function vlpAddTrail(grp,opacity,weight,v,i) {
		var nlo = {'color':v.color,'opacity':opacity,'weight':weight};
		if (v.secret) return;
		if (!groupedOverlays[grp]) {
			groupedOverlays[grp] = {};
		}

		if (v.dash) {
			nlo['dashArray'] = "10";
			nlo['weight'] = Math.min(5,weight);
		}
		var newLayer = L.polyline(v.trail, nlo);
		if (!v.dash) {
			// could also test for bluw:  /^#[012345678].[012345678].[9abcdef]/.test(v.color);
			var newLayer2 = L.polyline(v.trail, {color:'#006600',weight:1});
			newLayer = L.layerGroup([newLayer,newLayer2]);
		}
		var tt = `<span style="color:${v.color}">${v.name} </span><span class="mileage">(${v.miles} miles)</span>`;
		newLayer.bindTooltip(tt,{ 'sticky': true });
		groupedOverlays[grp][tt] = newLayer;
		if (!v.optional) {
			map.addLayer(newLayer);
		}
	}
	vlpTrails.forEach(function(v,i) {vlpAddTrail("Primary Trails",0.85,9,v,i);});
	if (g.addZakklab) {
		zakklab.forEach(function(v,i) {vlpAddTrail("Trails by Zakklab",0.7,7,v,i);});
	}
	
	var markerPts = [];
	var orienteeringSVG = L.divIcon({
		className: 'icon-mdi',
		html: `<svg style="width:44px;height:44px" viewBox="0 0 24 24"><path stroke="#FFFFFF" stroke-width="1.0" fill="#EF6C00" d="${mdiIcons.mdi_Orienteering}"></svg>`,
		iconSize: [32, 32],
		iconAnchor: [15, 31],
		popupAnchor: [0, -18]
	});
	vlpOrienteering.forEach(function(v,i) {markerPts.push(L.marker(gps(v[0],v[1]),{icon:orienteeringSVG}).bindPopup('Orienteering Marker - Find all 10 of these Orange and White Markers.<br><br>'+v[2]))});
	var picnicSVG = L.divIcon({
		className: 'icon-mdi',
		html: `<svg style="width:44px;height:44px" viewBox="0 0 24 24"><path stroke="#FFFFFF" stroke-width="1.0" fill="#5C2F00" d="${mdiIcons.mdi_Picnic}"></svg>`,
		iconSize: [32, 32],
		iconAnchor: [15, 31],
		popupAnchor: [0, -18]
	});
	var landmarkPts = [];
	vlpLandmarks.forEach(function(v,i) {landmarkPts.push(L.marker(gps(v[0],v[1]),{icon:picnicSVG}).bindPopup(v[2]))});
	
	groupedOverlays['Points of Interest'] = {"Orienteering Markers":L.layerGroup(markerPts), "Landmarks & Sightseeing":L.layerGroup(landmarkPts)};
	
	L.control.groupedLayers(baseMaps, groupedOverlays).addTo(map);
	map.attributionControl.addAttribution('<a href="https://friendsofthevaldeserec.org">FVR</a>');
	yahBtn.addTo(map);

	if (g.vlpDebugMode) {
		new ZoomViewer({position:'topleft'}).addTo(map);
		map.on('click',function(e){
			vlpDebug(e.latlng);
		});
	}

	map.fitBounds(vlpConfig.gpsBoundsParkPlan);

	showWhatsNew(map);
}

export {vlpMap};