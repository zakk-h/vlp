import * as g from './globals.js';
import Navigo from 'navigo';
import './img/ios-share.svg';
import './index.html';
import './app.manifest';
import { vlpMap } from './vlp.js';
import { showModal } from './modal.js';
import welcome from './info/welcome.md';
import parkIntro from './info/parkintro.md';
import zakklabParkIntro from './info/zakklabintro.md';

function toggleWindow(w) {w.style.display = (w.style.display == 'block') ? 'none' : 'block';}

function initLakesideParkApp() {
	var router = new Navigo('', true);
	var page_map = document.getElementById('id-mainmap');
	var page_info = document.getElementById('id-maininfo');
	var menuDiv = document.getElementById('win-mainmenu');

	function closeOpenMenu() { menuDiv.style.display = 'none'; }
	function setMarkdownContent(md) {
		if (!md) {
			page_info.classList.remove('active');
			page_map.classList.add('active');
		} else {
			page_info.innerHTML = `<div class="markdown-page">${md}</div>`;
			page_map.classList.remove('active');
			page_info.classList.add('active');
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
		about:   () => setMarkdownContent(parkIntro),
		credits: () => setMarkdownContent(welcome),
		'*':     () => setMarkdownContent(false)
	}).resolve();	
}

initLakesideParkApp();
