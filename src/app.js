import './app.scss';
import './app.manifest';
import './index.twig';

import * as g from './globals.js';
import {showModal,closeModal} from './modal.js';
import Navigo from 'navigo';
import { vlpMap } from './vlp.js';

const vlpDebug = g.vlpDebug;

function toggleWindow(w) {w.style.display = (w.style.display == 'block') ? 'none' : 'block';}

function initLakesideParkApp() {
	var router = new Navigo('', true, '#!');
	var ctrl_PageTitle = document.getElementById('id_AppPageTitle');
	var currentPageID = false;
	var menuDiv = document.getElementById('win-mainmenu');
	var firstTime = true;

	function closeOpenMenu() { menuDiv.style.display = 'none'; }
	function setCurrentPage(rid) {
		let id = `pgid-${rid}`;
		let newpage = document.getElementById(id);

		closeModal();

		if (newpage) {
			let newt = ctrl_PageTitle.querySelector('span:nth-of-type(2)');
			let newh1 = newpage.querySelector('h1');

			if (currentPageID) {
				let curpage = document.getElementById(currentPageID);
				curpage.classList.remove('active');
			}

			newt.innerHTML = newh1 ? newh1.innerHTML : 'Map';
			newpage.classList.add('active');
			currentPageID = id;

			if (vlpApp.maps.includes(rid)) {
				vlpMap(newpage);
			}

		}

		if (firstTime) {
			firstTime = false;
			
			if (!localStorage.vintage || (rid == 'whatsnew')) {
				localStorage.vintage = LatestWhatsNewEntry;
			} else if (LatestWhatsNewEntry > localStorage.vintage) {
				showModal(
					'App Update',
					'<p>The Lakeside Park app has been updated.</p><p><a href="#!whatsnew">Show App History</a></p>',
					() => localStorage.vintage = LatestWhatsNewEntry
				);
			}
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