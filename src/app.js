import './app.scss';
import './app.manifest';
import './index.twig';

import * as g from './globals.js';
import {closeModal} from './modal.js';
import Navigo from 'navigo';
import { vlpAppMap } from './appmap.js';
import {showWhatsNew} from './whatsnew.js';

function getSiteRootURL() {
	var r = window.location.href;
	var hi = r.search(/[#?]/);
	return (hi > 0) ? r.slice(0,hi) : r;
}

function initLakesideParkApp() {
	//const MAPPAGEID = 'id_AppMapPage';
	//var map_page = document.getElementById(MAPPAGEID);
	const INFOPAGEID = 'id_AppInfoPage';
	var currentInfoPageID = false;
	var map_elem = document.getElementById('id_Map');
	var info_elem = document.getElementById(INFOPAGEID);
	var map = new vlpAppMap(map_elem);
	var router = new Navigo(getSiteRootURL(), true);
	var ctrl_PageTitle = document.getElementById('id_AppPageTitle');
	var ctrl_CloseBtn = document.getElementById('id_CloseAppInfoBtn');
	var menu_elem = document.getElementById('win-mainmenu');
	var firstTime = true;

	function openTheMenu(b) {
		if (b) {
			// clear the html style set in index.html; now use only classes
			//menu_elem.removeAttribute('style');
			menu_elem.style.display = 'block';
			// in order for the transition to fire, we need to use a timeout
			setTimeout(function() {
				menu_elem.classList.add('menu-active');
				ctrl_PageTitle.classList.add('menu-active');
			},20);
		} else {
			menu_elem.style.display = 'none';
			ctrl_PageTitle.classList.remove('menu-active');
			menu_elem.classList.remove('menu-active');
		}
	}
	function toggleMenu() { openTheMenu(menu_elem.style.display == 'none'); }

	function setCurrentPage(rid) {
		let doAppInit = firstTime;
		let thisPageData = vlpApp.pages[rid];

		if (!thisPageData) return;

		let isMapPage = vlpApp.maps.includes(rid);
		let newTitle = thisPageData.title;
		
		firstTime = false;
		closeModal();
		openTheMenu(false);

		document.title = newTitle;
		ctrl_PageTitle.innerHTML = newTitle;
		
		if (isMapPage) {
			info_elem.style.display = 'none';
			ctrl_CloseBtn.style.display = 'none';

			if (vlpApp.activeMap != rid) {
				if (vlpApp.activeMap) map.clearConfig(vlpApp.pages[vlpApp.activeMap]);
				vlpApp.activeMap = rid;
				map.showConfig(thisPageData);
			}
		} else {
			let id = `pgid-${rid}`;
			let newpage = document.getElementById(id);
			
			info_elem.style.display = 'block';
			ctrl_CloseBtn.style.display = 'block';
			
			if (currentInfoPageID != id) {
				if (currentInfoPageID) {
					document.getElementById(currentInfoPageID).classList.remove('active');
				}
				newpage.classList.add('active');
				currentInfoPageID = id;
			}
		}

		if (doAppInit) {
			showWhatsNew();
		}
	}

	ctrl_PageTitle.addEventListener("click",(e) => toggleMenu());
	menu_elem.addEventListener("click",() => openTheMenu(false));
	document.addEventListener('keydown', (e) => {
		if (e.keyCode == 27) {
			openTheMenu(false);
		}
	});
	info_elem.addEventListener("click",(e) => {
		if (e.target == info_elem) {
			router.navigate(vlpApp.activeMap || vlpApp.pageids[0]);
		}
	});
	ctrl_CloseBtn.addEventListener("click",(e) => { router.navigate(vlpApp.activeMap || vlpApp.pageids[0]);});

	vlpApp.pageids.forEach(pgid => router.on(pgid,() => setCurrentPage(pgid)).resolve());
	router.on('*',() => {
		setCurrentPage(vlpApp.pageids[0]);
	}).resolve();
}

initLakesideParkApp();