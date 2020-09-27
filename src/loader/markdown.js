const marked = require("marked");
const {cleanUrl,escape} = require('marked/src/helpers.js');

marked.use({ renderer: {
	link(href, title, text) {
		let match = null;
		let target = '';
		let tail = '';

		href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
		if (href === null) {
			return text;
		}

		if (/^http/.test(href)) {
			target = ' target="_blank"';
		} else if (match = /^([\S]+)\.md$/.exec(href)) {
			href = `#!show-${match[1]}`;
			tail = ' data-navigo';
		}

		title = title ? ` title="${title}"` : '';
		href = escape(href);

		return `<a ${target}href="${href}"${tail}>${text}</a>`;
	}
}});

module.exports = function (markdown) {
    return marked(markdown);
};