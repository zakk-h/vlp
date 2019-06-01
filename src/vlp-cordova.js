import './cordova.html';
import {vlpMap} from './vlp.js';

var app = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        //document.addEventListener('pause', this.onPause.bind(this), false);
        //document.addEventListener('resume', this.onResume.bind(this), false);
    },

    onDeviceReady: function() {
        //StatusBar.overlaysWebView(false);
        vlpMap(false);
    },
    onPause: function() {
        //console.warn('-----------------PAUSE----------------');
    },
    onResume: function() {
        //console.warn('-----------------RESUME---------------');
    },
};

app.initialize();
