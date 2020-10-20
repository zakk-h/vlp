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
	const INFOSCREENID = 'id_AppInfoScreen';
	var currentInfoPageID = false;
	var map_elem = document.getElementById('id_Map');
	var infoscreen_elem = document.getElementById(INFOSCREENID);
	var map = new vlpAppMap(map_elem);
	var router = new Navigo(getSiteRootURL(), true);
	var ctrl_PageTitle = document.getElementById('id_AppPageTitle');
	var ctrl_CloseBtn = document.getElementById('id_CloseAppInfoBtn');
	var menuscreen_elem = document.getElementById('win-mainmenu');
	var firstTime = true;

	function isBlock(e) {return e.style.display == 'block';}
	function hideElem(e,doHide) {e.style.display = doHide ? 'none' : 'block';}
	function isMenuOpen() {return isBlock(menuscreen_elem);}
	function openTheMenu(b) {
		hideElem(menuscreen_elem, !b);
		if (b) ctrl_PageTitle.classList.add('menu-active');
		else ctrl_PageTitle.classList.remove('menu-active');
	}
	function toggleMenu() { openTheMenu(menuscreen_elem.style.display == 'none'); }

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
			hideElem(infoscreen_elem, true);

			if (vlpApp.activeMap != rid) {
				if (vlpApp.activeMap) map.clearConfig(vlpApp.pages[vlpApp.activeMap]);
				vlpApp.activeMap = rid;
				map.showConfig(thisPageData);
			}
		} else {
			let id = `pgid-${rid}`;
			let newpage = document.getElementById(id);
			
			hideElem(infoscreen_elem,false);
			
			if (currentInfoPageID != id) {
				if (currentInfoPageID) {
					hideElem(document.getElementById(currentInfoPageID),true);
				}
				hideElem(newpage, false);
				currentInfoPageID = id;
			}
		}

		if (doAppInit) {
			showWhatsNew();
		}
	}

	ctrl_PageTitle.addEventListener("click",(e) => toggleMenu());
	menuscreen_elem.addEventListener("click",() => openTheMenu(false));
	document.addEventListener('keydown', (e) => {
		if (e.keyCode == 27) {
			if (isMenuOpen()) openTheMenu(false);
			else if (isBlock(ctrl_CloseBtn)) router.navigate(vlpApp.activeMap || vlpApp.pageids[0]);
		}
	});
	infoscreen_elem.addEventListener("click",(e) => {
		if (e.target == infoscreen_elem) {
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
