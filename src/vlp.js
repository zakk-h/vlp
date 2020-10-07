import * as g from './globals.js';
import {vlpConfig} from './config.js';

import * as L from 'leaflet';
import 'leaflet.markercluster/dist/leaflet.markercluster.js';
import 'leaflet.featuregroup.subgroup';
import 'leaflet-measure';
// marker-shadow and marker-icon-2x have to be manually loaded
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon-2x.png';

import {createSVGIcon} from './vlp-mdi-icons';

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
	function gps(latitude,longitude) { return new L.LatLng(latitude,longitude); }
	map.attributionControl.setPrefix('');
	
	fvrMark.addTo(map);

	let contourLayer = new RotateImageLayer(img_parkcontours, vlpConfig.gpsBoundsParkContour,{rotation:vlpConfig.gpsBoundsLayerRotate,attribution:`<a href="${burkeGISMap}">gis.burkenc</a>`});
	let photoLayer = new RotateImageLayer(img_photo,vlpConfig.gpsBoundsSatellite,{rotation:vlpConfig.gpsBoundsLayerRotate,attribution:`<a href="${burkeGISMap}">gis.burkenc</a>`,opacity:0.7});
	let parkplanLayer = new RotateImageLayer(img_parkplan,vlpConfig.gpsBoundsParkPlan,{rotation:vlpConfig.gpsBoundsLayerRotate,attribution:'<a href="https://dbdplanning.com/">Destination by Design</a>'});
	let baseMaps = {"Contour": contourLayer,"Photo": photoLayer,"Projected Park Plan":parkplanLayer};
	let groupedOverlays = {};
	let clusterGroup = null;
	
	map.addLayer(contourLayer);
	
	function vlpAddTrail(grp,opacity,weight,v) {
		var nlo = {color:v.color,opacity:opacity,weight:weight};

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
	
	if (pagedata.layers) pagedata.layers.forEach(layer => {
		let l_opacity = layer.opacity || 0.85;
		let l_weight = layer.weight || 9;

		groupedOverlays[layer.group] = {};
		
		layer.list.forEach(resname => {
			let ext = /[^.]+$/.exec(resname);
			let yamlData = vlpApp.layers[resname];

			if (!yamlData) return;

			if (ext == 'trail') {
				vlpAddTrail(layer.group,l_opacity,l_weight,yamlData);
			} else if (ext == 'mapmarks') {
				let markerPts = [];

				if (!yamlData.markers) return;

				yamlData.markers.forEach(v => {
					markerPts.push(L.marker(v[0],{icon:createSVGIcon(v[1])}).bindPopup(v[2]));
				});

				if (!clusterGroup) clusterGroup = L.markerClusterGroup({maxClusterRadius:20});
				groupedOverlays[layer.group][yamlData.name] = L.featureGroup.subGroup(clusterGroup, markerPts);
			}
		});
	});

	if (clusterGroup) clusterGroup.addTo(map);

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

	//L.rectangle(vlpConfig.gpsBoundsSatellite, {color: "#ff7800", weight: 1}).addTo(map);

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

export {vlpMap};