import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon-2x.png';
import * as L from 'leaflet';
import {vlpTrails,vlpOrienteering} from './parkmaps.js';
import * as fvr_logo from './img/fvrlogopng.png';
import * as img_parkplan from './img/parkplan.jpg';
import * as img_parkplanhybrid from './img/parkplanhybrid.jpg';
import * as img_photo from './img/photo.jpg';
import * as img_terrain from './img/terrain.jpg';

L.Control.Watermark = L.Control.extend({
    onAdd: function(map) {
        var img = L.DomUtil.create('img');

        img.src = fvr_logo;
        img.style.width = '50px';
        img.style.opacity = 0.5;

        return img;
    },

    onRemove: function(map) { }
});

function vlpMap(debugMode) {
    var useHighAccuracy = true;
    var vlpDebug = debugMode ? console.warn : function() {return;};
    
    var w = 1630,
        h = 908;
    var gpsP = [[35.7782,-81.5718],[35.7607,-81.5347]];
    var gpsD = [gpsP[1][0]-gpsP[0][0],gpsP[1][1]-gpsP[0][1]];
    
    var map = L.map('image-map', {
        minZoom: 1,
        maxZoom: 5,
        center: [0, 0],
        zoom: 3,
        crs: L.CRS.Simple
    });
    
    if (USING_CORDOVA) {
        map.attributionControl.setPrefix('Leaflet');
    }
    
    //L.control.watermark = function(opts) {
    //    return new L.Control.Watermark(opts);
    //}

    //L.control.watermark({ position: 'bottomleft' }).addTo(map);
    new L.Control.Watermark({position:'bottomleft'}).addTo(map);

    var cz = map.getMaxZoom()-2;
    function gps(latitude,longitude)
    {
        var x = ((longitude - gpsP[0][1])*w)/gpsD[1];
        var y = ((latitude  - gpsP[0][0])*h)/gpsD[0];
        x = Math.min(w+150,Math.max(x,-150));
        y = Math.min(h+150,Math.max(y,-150));
        return map.unproject([x,y], cz);
    }
    
    function gpsList(coords)
    {
        var xlc = [];
        coords.forEach(function(v,i){xlc[i]=gps(v[0],v[1]);});
        return xlc;
    }
    
    var map_bounds = new L.LatLngBounds(map.unproject([0, h], cz), map.unproject([w, 0], cz));
    var parkplanLayer,parkplanHybridLayer,photoLayer,terrainLayer;

    if (USING_CORDOVA) {
        parkplanLayer = L.imageOverlay(img_parkplan, map_bounds,{attribution:'Destination by Design'});
        parkplanHybridLayer = L.imageOverlay(img_parkplanhybrid, map_bounds);
        photoLayer = L.imageOverlay(img_photo, map_bounds,{attribution:'gis.burkenc'});
        terrainLayer =L.imageOverlay(img_terrain, map_bounds,{attribution:'gis.burkenc'});
    } else {
        var burkeGISMap = 'http://gis.burkenc.org/default.htm?PIN=2744445905';
        parkplanLayer = L.imageOverlay(img_parkplan, map_bounds,{attribution:'<a href="https://dbdplanning.com/">Destination by Design</a>'});
        parkplanHybridLayer = L.imageOverlay(img_parkplanhybrid, map_bounds);
        photoLayer = L.imageOverlay(img_photo, map_bounds,{attribution:`<a href="${burkeGISMap}">gis.burkenc</a>`});
        terrainLayer =L.imageOverlay(img_terrain, map_bounds,{attribution:`<a href="${burkeGISMap}">gis.burkenc</a>`});
    }

    var baseMaps = {"Hybrid Park Plan":parkplanHybridLayer,"Park Plan":parkplanLayer,"Photo": photoLayer,"Terrain": terrainLayer};
    var overlayMaps = {};
    
    map.addLayer(parkplanHybridLayer);
    
    vlpTrails.forEach(
        function(v,i) {
            var nlo = {color:v.color,opacity:1.0,weight:9};
            if (v.secret) return;
            if (v.dash) {
                nlo['dashArray'] = "10";
                nlo['weight'] = 5;
            }
            var newLayer = L.polyline(gpsList(v.trail), nlo);
            var tt = `<span style="color:${v.color}">${v.name} </span><span class="mileage">(${v.miles} miles)</span>`;
            newLayer.bindTooltip(tt,{ 'sticky': true });
            overlayMaps[tt] = newLayer;
            if (!v.optional) {
                map.addLayer(newLayer);
            }
        }
    );
    
    var markerPts = [];
    vlpOrienteering.markers.forEach(
        function(v,i) {
            markerPts.push(L.marker(gps(v[0],v[1])).bindPopup(v[2]));
        }
    );
    var orienteeringTrail = L.polyline(gpsList(vlpOrienteering.trail), {color: '#000',fillOpacity:0.5,weight:4});
    markerPts.push(orienteeringTrail);
    overlayMaps['Orienteering (6 miles)'] = L.layerGroup(markerPts);
    
    var yahIcon = L.divIcon({className: 'yah-divicon',iconAnchor:[0,24],labelAnchor:[-6, 0],popupAnchor:[0, -36],html:'<span/>'});
    var yahMarker = L.marker(gps(35.75640,-81.58016),{icon:yahIcon}).bindTooltip('you are here');
    var yahText = 'You Are Here';
    overlayMaps[yahText] = yahMarker;
    
    L.control.layers(baseMaps, overlayMaps, {position:'topright'}).addTo(map);
    map.setMaxBounds(map_bounds);
    if (USING_CORDOVA) {
        map.attributionControl.addAttribution('Friends of the Valdese Rec');
        //map.attributionControl.addAttribution('<a href="about.html">About FVR</a>');
    } else {
        map.attributionControl.addAttribution('<a href="https://friendsofthevaldeserec.org">Friends of the Valdese Rec</a>');
    }
    
    map.on('locationfound', function(e) {yahMarker.setLatLng(gps(e.latlng.lat,e.latlng.lng));vlpDebug('locate',e.latlng);});
    map.on('locationerror', function(e) {alert(e.message);});
    
    //map.locate({watch: true, enableHighAccuracy:useHighAccuracy});
    
    map.on('overlayadd',function(e) {
        if (e.name == yahText) {
            vlpDebug((useHighAccuracy ? 'U' : 'Not u')+'sing high accuracy location');
            map.locate({watch: true, enableHighAccuracy:useHighAccuracy});
            map.setZoom(2);
        }
    });
    
    map.on('overlayremove',function(e) {
        if (e.name == yahText) {
            vlpDebug('no longer tracking location');
            map.stopLocate();
        }
    });
    
    map.addLayer(overlayMaps[yahText]);
}

//window.vlpMap = vlpMap;

export {vlpMap};
