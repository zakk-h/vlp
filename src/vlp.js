import * as g from './globals.js';
import {vlpConfig} from './config.js';

import * as L from 'leaflet';
import 'leaflet.markercluster/dist/leaflet.markercluster.js';
import "leaflet.featuregroup.subgroup";

import {format,formatDistance,formatRelative} from 'date-fns';
import {createSVGIcon} from './vlp-mdi-icons';
import parkParcel from './park-parcel.json';
import {vlpTrails,vlpMarkers} from './parkmaps.js';
import 'leaflet/dist/leaflet.css';
import './leaflet/grpLayerControl.css';
import './leaflet/yahControl.css';
import './vlpStyles.css';
import './modal.css';

import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon-2x.png';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import './leaflet/grpLayerControl.js';
import {YAHControl} from './leaflet/yahControl.js';
import './vlp-manifest-icons.js';
import {showModal} from './modal.js';
import * as blankTile from './img/blankTile.png';
import * as fvr_logo from './img/fvrlogopng.png';
import * as img_parkplan from './img/dbd-parkplan.png';
import * as img_parkboundary from './img/park-boundary.png';
import * as img_photo from './img/park-satellite.png';
import * as img_parkcontours from './img/park-contour.png';
import zakklab from './zakklab.json';
import whatsnew from './whatsnew.json';
import welcome from './info/welcome.md';
import zakklabwelcome from './info/zakklabwelcome.md';

const vlpDebug = g.vlpDebug;

function showWhatsNew(map) {
	var lastseen = localStorage.vintage;
	var t_newest = whatsnew[0][0];
	var whatsnew4zakklab = /^zakklab:/;

	if (!lastseen) {
		showModal('Info', g.addZakklab ? (welcome + zakklabwelcome) : welcome, function () { });
		localStorage.vintage = t_newest; return;
	}
	if (t_newest <= lastseen) { return; }

	var whatnewHtml = '<p>The Lakeside Park app has been updated. Recent changes to the app include:</p><ul>';
	var now = new Date();
	const tdfmt = {addSuffix:true};

	vlpDebug('Showing whatsnew modal');

	for (var i=0; i<whatsnew.length; i++) {
		var t =  whatsnew[i][0];
		if (t <= lastseen) break;
		var d2 = new Date(t*1000);
		var txt =  whatsnew[i][1];
		if (!whatsnew4zakklab.test(txt)  || g.addZakklab) {
			whatnewHtml += g.sprintf('<li>%s (%s)</li>',txt,formatDistance(d2,now,tdfmt));
		}
	}
	whatnewHtml += '</ul>';

	showModal('App Update',whatnewHtml,function() {
		vlpDebug('whatsnew has been closed');
		localStorage.vintage = t_newest;
	});
}



//transform: skewY(-5deg);
var vlpRotateImageLayer = L.ImageOverlay.extend({
	options: {rotation: -1.5},
	initialize: function(url,bounds,options) {
		L.setOptions(this,options);
		L.ImageOverlay.prototype.initialize.call(this,url,bounds,options);
    },
    _animateZoom: function(e){
		L.ImageOverlay.prototype._animateZoom.call(this, e);
        var img = this._image;
        img.style[L.DomUtil.TRANSFORM] += ' rotate(' + this.options.rotation + 'deg)';
    },
    _reset: function(){
        L.ImageOverlay.prototype._reset.call(this);
        var img = this._image;
        img.style[L.DomUtil.TRANSFORM] += ' rotate(' + this.options.rotation + 'deg)';
    }
});

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

	var contourLayer = new vlpRotateImageLayer(img_parkcontours, vlpConfig.gpsBoundsParkContour,{rotation:vlpConfig.gpsBoundsLayerRotate,attribution:`<a href="${burkeGISMap}">gis.burkenc</a>`});
	var photoLayer = new vlpRotateImageLayer(img_photo,vlpConfig.gpsBoundsSatellite,{rotation:vlpConfig.gpsBoundsLayerRotate,attribution:`<a href="${burkeGISMap}">gis.burkenc</a>`,opacity:0.7});
	var parkplanLayer = new vlpRotateImageLayer(img_parkplan,vlpConfig.gpsBoundsParkPlan,{rotation:vlpConfig.gpsBoundsLayerRotate,attribution:'<a href="https://dbdplanning.com/">Destination by Design</a>'});
	var baseMaps = {"Contour": contourLayer,"Photo": photoLayer,"Projected Park Plan":parkplanLayer};
	var groupedOverlays = {};
	
	map.addLayer(contourLayer);
	
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
		var tt = `<span style="color:${v.color}">${v.name} </span>`;
		if (v.miles) {tt += `<span class="mileage">(${v.miles} miles)</span>`; }

		if (!v.dash) {
			// could also test for blue:  /^#[012345678].[012345678].[9abcdef]/.test(v.color);
			var newLayer1 = newLayer;
			var newLayer2 = L.polyline(v.trail, {color:'#2C3050',weight:1});
			newLayer = L.featureGroup([newLayer1,newLayer2]);
		}
		newLayer.bindTooltip(tt,{ 'sticky': true });
		groupedOverlays[grp][tt] = newLayer;
		if (!v.optional) {
			map.addLayer(newLayer);
		}
	}
	
	vlpTrails.forEach(function(v,i) {vlpAddTrail('Primary Trails',0.85,9,v,i);});

	if (g.addZakklab) {
		zakklab.forEach(function(v,i) {vlpAddTrail('Trails by Zakklab',0.75,8,v,i);});
	}
	
	var clusterGroup = L.markerClusterGroup({maxClusterRadius:20});
	var poiData = {};

	vlpMarkers.forEach(function(markData) {
		var markerPts = [];
	
		markData.markers.forEach(function(v,i) {
			markerPts.push(
				L.marker(v[0],{
					icon:createSVGIcon(v[1])
				}).bindPopup(v[2]))}
			);

		poiData[markData.name] = L.featureGroup.subGroup(clusterGroup, markerPts);
	});

	poiData['Landmarks & Sightseeing'].addTo(map);
	// Parcel GeoJSON has LngLat that needs to be reversed
	var gpsParkBoundary = [];
	parkParcel.geometry.coordinates[0].forEach(function(v) {gpsParkBoundary.push(gps(v[1],v[0]));});
	
	poiData['Park Parcel Boundary'] = L.polyline(gpsParkBoundary,{
		color:'#D8B908',
		opacity:0.75,
		weight:8}
		).bindTooltip('Parcel boundary for the park property',{sticky:true});

	groupedOverlays['Points of Interest'] = poiData;
	
	clusterGroup.addTo(map);
	L.control.groupedLayers(baseMaps, groupedOverlays).addTo(map);
	map.attributionControl.addAttribution('<a href="https://friendsofthevaldeserec.org">FVR</a>');
	yahBtn.addTo(map);

	if (g.vlpDebugMode) {
		new ZoomViewer({position:'topleft'}).addTo(map);
		map.on('click',function(e){
			vlpDebug(e.latlng);
		});
	}

	//L.rectangle(vlpConfig.gpsBoundsSatellite, {color: "#ff7800", weight: 1}).addTo(map);

	map.fitBounds(vlpConfig.gpsBoundsParkPlan);

	showWhatsNew(map);
}

export {vlpMap};