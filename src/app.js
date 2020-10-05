import './app.scss';
import './app.manifest';
import './index.twig';

import * as g from './globals.js';
import {closeModal} from './modal.js';
import Navigo from 'navigo';
import { vlpMap } from './vlp.js';
import {showWhatsNew} from './whatsnew.js';

function toggleWindow(w) {w.style.display = (w.style.display == 'block') ? 'none' : 'block';}

function initLakesideParkApp() {
	var router = new Navigo('', true, '#!');
	var ctrl_PageTitle = document.getElementById('id_AppPageTitle');
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

			// if we want to have the current map in the background of info pages, then
			// we always need to have one loaded first
			if (doAppInit && !isMapPage) {
				setCurrentPage(vlpApp.maps[0]);
			}

			if (currentPageID) {
				let curpage = document.getElementById(currentPageID);
				curpage.classList.remove('active');
			}

			ctrl_PageTitle.querySelector('span:nth-of-type(2)').innerHTML = thisPageData.title;
			newpage.classList.add('active');
			currentPageID = id;

			if (isMapPage) {
				vlpMap(newpage,thisPageData);
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

	router.on({
		':id': (params) => setCurrentPage(params.id),
		'*': () => setCurrentPage(vlpApp.maps[0])
	}).resolve();
}

initLakesideParkApp();
