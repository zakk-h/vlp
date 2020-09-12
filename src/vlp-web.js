import * as g from './globals.js';
import Navigo from 'navigo';
import {format,formatDistance,formatRelative} from 'date-fns';
import './app.manifest';
import { vlpMap } from './vlp.js';
import whatsnew from './whatsnew.json';

function toggleWindow(w) {w.style.display = (w.style.display == 'block') ? 'none' : 'block';}

function buildWhatsNew() {
	var whatnewHtml = '<p>The Lakeside Park app update history:</p><ul>';
	var now = new Date();
	const whatsnew4zakklab = /^zakklab:/;
	const tdfmt = {addSuffix:true};

	for (var i=0; i<whatsnew.length; i++) {
		var t =  whatsnew[i][0];
		var d2 = new Date(t*1000);
		var txt =  whatsnew[i][1];
		if (!whatsnew4zakklab.test(txt)  || g.addZakklab) {
			whatnewHtml += g.sprintf('<li>%s (%s)</li>',txt,formatDistance(d2,now,tdfmt));
		}
	}
	whatnewHtml += '</ul>';
	return whatnewHtml;
}

function initLakesideParkApp() {
	var router = new Navigo('', true);
	var currentPageID = 'id-mainmap';
	var menuDiv = document.getElementById('win-mainmenu');

	function closeOpenMenu() { menuDiv.style.display = 'none'; }
	function setCurrentPage(id) {
		let curpage = document.getElementById(currentPageID);
		let newpage = document.getElementById(id);

		if (newpage) {
			curpage.classList.remove('active');
			newpage.classList.add('active');
			currentPageID = id;
		}
	}

	document.getElementById('appMenuBtn').addEventListener("click",(e) => toggleWindow(menuDiv));
	menuDiv.addEventListener("click",() => closeOpenMenu());
	document.addEventListener('keydown', (e) => {
		if (e.keyCode == 27) {
			closeOpenMenu();
		}
	});

	vlpMap();

	router.on({
		'show-:id': (params) => setCurrentPage('idmarkdown-'+params.id),
		'*': () => setCurrentPage('id-mainmap')
	}).resolve();
}

initLakesideParkApp();
