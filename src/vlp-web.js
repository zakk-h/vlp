import './img/btn-menu.png';
import './index.html';
import './app.manifest';
import {vlpMap} from './vlp.js';
import {showModal} from './modal.js';
import parkIntro from './info/parkintro.md';

function initLakesideParkApp() {
	var menuKey = document.getElementById('appMenuBtn');

	menuKey.addEventListener("click",function(e) {
		showModal('Info',parkIntro,function() {
		});
	});

	vlpMap();
}

initLakesideParkApp();
