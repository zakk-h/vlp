import * as g from './globals.js';
import { vlpConfig } from './config.js';
import * as L from 'leaflet';
import 'leaflet-draw/dist/leaflet.draw.js';
import 'leaflet.markercluster/dist/leaflet.markercluster.js';
import 'leaflet.featuregroup.subgroup';
import 'leaflet-measure';
// marker-shadow and marker-icon-2x have to be manually loaded
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon-2x.png';

import {createSVGIcon} from './vlp-mdi-icons';
import parkParcel from './park-parcel.json';
import {vlpTrails,vlpMarkers,zakklabTrails} from './parkmaps.js';

import {GroupedLayersControl} from './leaflet/GroupedLayersControl.js';
import {ValdeseTileLayer} from './leaflet/ValdeseTileLayer.js';
import {YAHControl} from './leaflet/yahControl.js';
import {RotateImageLayer} from './leaflet/RotateImageLayer.js';
import {FVRWatermarkControl} from './leaflet/FVRWatermarkControl.js';
import {ZoomViewer} from './leaflet/ZoomViewer.js';

import './vlp-manifest-icons.js';
import * as blankTile from './img/blankTile.png';
import * as img_parkplan from './img/dbd-parkplan.png';
import * as img_photo from './img/park-satellite.png';
import * as img_parkcontours from './img/park-contour.png';

const vlpDebug = g.vlpDebug;

function vlpMapStartup(targetDiv,pagedata) {
	const burkeGISMap = 'http://gis.burkenc.org/default.htm?PIN=2744445905';
	let pageopts = pagedata.opts || {};
	let parkplan_bounds = new L.LatLngBounds(vlpConfig.gpsBoundsParkPlan);
	let valdese_area = new L.LatLngBounds(vlpConfig.gpsBoundsValdese);
	let gpsCenter = parkplan_bounds.getCenter();
	if (pageopts.maxBounds) {
		valdese_area = new L.LatLngBounds(pageopts.maxBounds);
		gpsCenter = valdese_area.getCenter();
	}
	let map = L.map(targetDiv,{
		zoomControl: !L.Browser.mobile,
		center: gpsCenter,
		minZoom: vlpConfig.osmZoomRange[0],
		zoom: vlpConfig.osmZoomRange[1],
		maxBounds: valdese_area
	});
	let mapTiles = new ValdeseTileLayer(vlpConfig.urlTileServer, {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		errorTileUrl: blankTile,
		crossOrigin: true,
		minZoom: vlpConfig.osmZoomRange[0],
		maxNativeZoom: vlpConfig.osmZoomRange[1]
		});
	let fvrMark = new FVRWatermarkControl({position:'bottomleft'});
	let yahBtn = new YAHControl({
		position:'topleft',
		maxBounds: parkplan_bounds
	});
	map.addLayer(mapTiles);
	function gps(latitude, longitude) { return new L.LatLng(latitude, longitude); }
	map.attributionControl.setPrefix('');

	fvrMark.addTo(map);

	let contourLayer = new RotateImageLayer(img_parkcontours, vlpConfig.gpsBoundsParkContour,{rotation:vlpConfig.gpsBoundsLayerRotate,attribution:`<a href="${burkeGISMap}">gis.burkenc</a>`});
	let photoLayer = new RotateImageLayer(img_photo,vlpConfig.gpsBoundsSatellite,{rotation:vlpConfig.gpsBoundsLayerRotate,attribution:`<a href="${burkeGISMap}">gis.burkenc</a>`,opacity:0.7});
	let parkplanLayer = new RotateImageLayer(img_parkplan,vlpConfig.gpsBoundsParkPlan,{rotation:vlpConfig.gpsBoundsLayerRotate,attribution:'<a href="https://dbdplanning.com/">Destination by Design</a>'});
	let baseMaps = {"Contour": contourLayer,"Photo": photoLayer,"Projected Park Plan":parkplanLayer};
	let groupedOverlays = {};
	
	map.addLayer(contourLayer);
	
	function vlpAddTrail(grp,opacity,weight,v,i) {
		var nlo = {color:v.color,opacity:opacity,weight:weight};
		if (v.secret) return;
		if (!groupedOverlays[grp]) {
			groupedOverlays[grp] = {};
		}

		if (v.dash) {
			nlo['dashArray'] = "10";
			nlo['weight'] = Math.min(5, weight);
		}
		var newLayer = L.polyline(v.trail, nlo);
		var tt = `<span style="color:${v.color}">${v.name} </span>`;
		if (v.miles) { tt += `<span class="mileage">(${v.miles} miles)</span>`; }

		if (!v.dash) {
			// could also test for blue:  /^#[012345678].[012345678].[9abcdef]/.test(v.color);
			var newLayer1 = newLayer;
			var newLayer2 = L.polyline(v.trail, { color: '#2C3050', weight: 1 });
			newLayer = L.featureGroup([newLayer1, newLayer2]);
		}
		newLayer.bindTooltip(tt, { 'sticky': true });
		groupedOverlays[grp][tt] = newLayer;
		
		if (!v.optional) {
			map.addLayer(newLayer);
		}
		if (g.vlpDebugMode) {
		if (v.optional) {
			map.addLayer(newLayer);
		}
	}
	}
	
	let clusterGroup = L.markerClusterGroup({maxClusterRadius:10});
	let poiData = {};

	vlpMarkers.forEach(function(markData) {
		let markerPts = [];
	
		markData.markers.forEach(function(v,i) {
			markerPts.push(
				L.marker(v[0], {
					icon: createSVGIcon(v[1])
				}).bindPopup(v[2]))
		}
		);

		poiData[markData.name] = L.featureGroup.subGroup(clusterGroup, markerPts);
	});

	poiData['Landmarks & Sightseeing'].addTo(map);
	// Parcel GeoJSON has LngLat that needs to be reversed
	let gpsParkBoundary = [];
	parkParcel.geometry.coordinates.forEach(function(v) {gpsParkBoundary.push(gps(v[1],v[0]));});
	
	poiData['Park Parcel Boundary'] = L.polyline(gpsParkBoundary,{
		color:'#D8B908',
		opacity:0.75,
		weight:8}
		).bindTooltip('Parcel boundary for the park property',{sticky:true});

	groupedOverlays['Points of Interest'] = poiData;
	clusterGroup.addTo(map);
	
	if (g.addZakklab) {
		zakklabTrails.forEach(function(v,i) {vlpAddTrail('Trails by Zakklab',0.75,8,v,i);});
	}

	vlpTrails.forEach(function (v, i) { vlpAddTrail('Primary Trails', 0.85, 9, v, i); });


	new GroupedLayersControl(baseMaps, groupedOverlays).addTo(map);
	map.attributionControl.addAttribution('<a href="https://friendsofthevaldeserec.org">FVR</a>');
	yahBtn.addTo(map);

	let measureControl = L.control.measure({
		position:'bottomright',
		primaryLengthUnit: 'miles',
		secondaryLengthUnit: 'feet',
		primaryAreaUnit: 'acres',
		activeColor: '#000000',
		completedColor: '#000000'
	});
	measureControl.addTo(map);

	if (g.vlpDebugMode) {
		new ZoomViewer({position:'topleft'}).addTo(map);
		map.on('click',e => vlpDebug(e.latlng));
	}
	map.fitBounds(vlpConfig.gpsBoundsParkPlan);
}

function vlpMap(hostDiv,pagedata) {
	let targetDiv = hostDiv.querySelector('div');
	if (!targetDiv) {
		targetDiv = document.createElement('div');   
		hostDiv.appendChild(targetDiv);
		vlpMapStartup(targetDiv,pagedata);
	}
}


export { vlpMap };