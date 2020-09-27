import './app.scss';
import './app.manifest';
import './index.twig';
import {closeModal} from './modal.js';

import * as g from './globals.js';
import Navigo from 'navigo';
import { vlpMap } from './vlp.js';

function toggleWindow(w) {w.style.display = (w.style.display == 'block') ? 'none' : 'block';}

function initLakesideParkApp() {
	var router = new Navigo('', true);
	var ctrl_PageTitle = document.getElementById('id_AppPageTitle');
	var currentPageID = 'id-mainmap';
	var menuDiv = document.getElementById('win-mainmenu');

	function closeOpenMenu() { menuDiv.style.display = 'none'; }
	function setCurrentPage(id) {
		let curpage = document.getElementById(currentPageID);
		let newpage = document.getElementById(id);

		if (newpage) {
			let newt = ctrl_PageTitle.querySelector('span:nth-of-type(2)');
			let newh1 = newpage.querySelector('h1');

			closeModal();

			newt.innerHTML = newh1 ? newh1.innerHTML : 'Map';

			curpage.classList.remove('active');
			newpage.classList.add('active');
			currentPageID = id;
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
		'show-:id': (params) => setCurrentPage(`pgid-${params.id}`),
		'*': () => setCurrentPage('id-mainmap')
	}).resolve();

	vlpMap();
}

initLakesideParkApp();