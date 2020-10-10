import './app.scss';
import './app.manifest';
import './index.twig';

import * as g from './globals.js';
import {closeModal} from './modal.js';
import Navigo from 'navigo';
import { vlpMap } from './vlp.js';
import {showWhatsNew} from './whatsnew.js';

function toggleWindow(w) {w.style.display = (w.style.display == 'block') ? 'none' : 'block';}

function getSiteRootURL() {
	var r = window.location.href;
	var hi = r.search(/[#?]/);
	return (hi > 0) ? r.slice(0,hi) : r;
}

function initLakesideParkApp() {
	var router = new Navigo(getSiteRootURL(), true);
	var ctrl_PageTitle = document.getElementById('id_AppPageTitle');
	var ctrl_PageBack = document.getElementById('id_AppPageBackBtn');
	var currentPageID = false;
	var menuDiv = document.getElementById('win-mainmenu');
	var firstTime = true;

	function closeOpenMenu() { menuDiv.style.display = 'none'; }
	function setCurrentPage(rid) {
		let doAppInit = firstTime;
		let id = `pgid-${rid}`;
		let newpage = document.getElementById(id);

		firstTime = false;
		closeModal();

		if (newpage) {
			let isMapPage = vlpApp.maps.includes(rid);
			let thisPageData = vlpApp.pages[rid];
			let newTitle = thisPageData.title;

			if (currentPageID) {
				let curpage = document.getElementById(currentPageID);
				curpage.classList.remove('active');
			}

			document.title = newTitle;
			ctrl_PageTitle.querySelector('span:nth-of-type(2)').innerHTML = newTitle;
			newpage.classList.add('active');
			currentPageID = id;

			if (isMapPage) {
				vlpMap(newpage,thisPageData);
				vlpApp.activeMap = rid;
				ctrl_PageBack.style.display = 'none';
			} else {
				ctrl_PageBack.style.display = 'block';
			}

		}

		if (doAppInit) {
			showWhatsNew();
		}
	}

	ctrl_PageTitle.addEventListener("click",(e) => toggleWindow(menuDiv));
	document.getElementById('id_AppPageMenuBtn').addEventListener("click",(e) => toggleWindow(menuDiv));
	menuDiv.addEventListener("click",() => closeOpenMenu());
	document.addEventListener('keydown', (e) => {
		if (e.keyCode == 27) {
			closeOpenMenu();
		}
	});
	ctrl_PageBack.addEventListener("click",(e) => {
		closeOpenMenu();
		router.navigate(vlpApp.activeMap || vlpApp.pageids[0]);
	});

	vlpApp.pageids.forEach(pgid => router.on(pgid,() => setCurrentPage(pgid)).resolve());
	router.on('*',() => {
		setCurrentPage(vlpApp.pageids[0]);
	}).resolve();
}

initLakesideParkApp();
