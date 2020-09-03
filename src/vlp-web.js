import * as g from './globals.js';
import { mdiInformation } from '@mdi/js';
import './index.html';
import './app.manifest';
import { vlpMap } from './vlp.js';
import { showModal } from './modal.js';
import parkIntro from './info/parkintro.md';
import zakklabParkIntro from './info/zakklabintro.md';

function initLakesideParkApp() {
	var menuKey = document.getElementById('appMenuBtn');

	menuKey.innerHTML = `<svg style="width:22px;height:22px" viewBox="0 0 24 24"><path fill="white" d="${mdiInformation}"></svg>`;

	menuKey.addEventListener("click", function (e) {
		showModal('Info', g.addZakklab ? (parkIntro + zakklabParkIntro) : parkIntro, function () {
		});
	});

	vlpMap();
}

initLakesideParkApp();
