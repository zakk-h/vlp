import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {showModal} from './modal.js';

dayjs.extend(relativeTime);

export function showWhatsNew() {
	let LatestWhatsNewEntry = vlpApp.appd.history[0][0];
	let lastSeen = localStorage.vintage;

	if (!lastSeen) {
		localStorage.vintage = LatestWhatsNewEntry;
		return false;
	}

	if (LatestWhatsNewEntry <= lastSeen) return false;

	let ul = document.createElement('ul');
	ul.className = 'whatsnew';
	vlpApp.appd.history.forEach(v => {
		if (v[0] > lastSeen) {
			let tstamp = 1000*Number(v[0]);
			let d = dayjs(tstamp).fromNow();
			let de = document.createElement('em');
			let li = document.createElement('li');
			de.innerText = d;
			li.innerText = v[1];
			li.appendChild(de);
			ul.appendChild(li);
		}
	});

	let html = document.createElement('div');
	html.innerText = 'The Lakeside Park app has been updated. Recent changes to the app include:';
	html.appendChild(ul);

	showModal('What&#039;s New',html, () => localStorage.vintage = LatestWhatsNewEntry);
	return true;
}
