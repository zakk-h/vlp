import './index.html';
import './app.manifest';
import {vlpMap} from './vlp.js';
//import {precacheAndRoute} from 'workbox-precaching';

function ready(callback){
    // in case the document is already rendered
    if (document.readyState!='loading') callback();
    // modern browsers
    else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
    // IE <= 8
    else document.attachEvent('onreadystatechange', function(){
        if (document.readyState=='complete') callback();
    });
}

ready(function(){
    vlpMap();
});
