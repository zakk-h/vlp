import * as g from './globals.js';
import { mdiInformation } from '@mdi/js';
import './index.html';
import './app.manifest';
import {vlpMap} from './vlp.js';
import {showModal} from './modal.js';
import parkIntro from './info/parkintro.md';
import zakklabParkIntro from './info/zakklabintro.md';
import welcome from './info/welcome.md';
import zakklabwelcome from './info/zakklabwelcome.md';

function initLakesideParkApp() {
	var menuKey = document.getElementById('appMenuBtn');
	
	menuKey.innerHTML = `<svg style="width:22px;height:22px" viewBox="0 0 24 24"><path fill="white" d="${mdiInformation}"></svg>`;

	menuKey.addEventListener("click",function(e) {
		showModal('Info',g.addZakklab ? (parkIntro + zakklabParkIntro) : parkIntro,function() {
		});
	});

	vlpMap();
}
function setCookie(c_name,value,exdays){var exdate=new Date();exdate.setDate(exdate.getDate() + exdays);var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());document.cookie=c_name + "=" + c_value;}

function getCookie(c_name){var c_value = document.cookie;var c_start = c_value.indexOf(" " + c_name + "=");if (c_start == -1){c_start = c_value.indexOf(c_name + "=");}if (c_start == -1){c_value = null;}else{c_start = c_value.indexOf("=", c_start) + 1;var c_end = c_value.indexOf(";", c_start);if (c_end == -1){c_end = c_value.length;}c_value = unescape(c_value.substring(c_start,c_end));}return c_value;}

checkSession();

function checkSession(){
   var c = getCookie("visited");
   if (c === "yes") {
	   
	} else {
		showModal('Info',g.addZakklab ? (welcome + zakklabwelcome) : welcome,function() {});
	}
   setCookie("visited", "yes", null);  
}

initLakesideParkApp();
