import {formatDistance} from 'date-fns';
import {showModal} from './modal.js';

export function showWhatsNew() {
	let LatestWhatsNewEntry = vlpApp.appd.history[0][0];
	let lastSeen = localStorage.vintage;

	if (!lastSeen) {
		localStorage.vintage = LatestWhatsNewEntry;
		return;
	}

	if (LatestWhatsNewEntry <= lastSeen) return;

	let html = '';
	vlpApp.appd.history.forEach(v => {
		if (v[0] > lastSeen) {
			let d = formatDistance(1000*Number(v[0]),Date.now(),{addSuffix:true});
			html += `<li>${v[1]} <em>${d}</em></li>`;
		}
	});

	html = `<p>The Lakeside Park app has been updated. Recent changes to the app include:</p><ul class="whatsnew">${html}</ul>`;
	showModal('What&#039;s New',html, () => localStorage.vintage = LatestWhatsNewEntry);
}
