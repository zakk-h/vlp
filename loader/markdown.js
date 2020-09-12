const marked = require("marked");
const {cleanUrl,escape} = require('marked/src/helpers.js');

marked.use({ renderer: {
	link(href, title, text) {
		href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
		if (href === null) {
			return text;
		}
		let out = '<a href="' + escape(href) + '"';
		if (title) {
			out += ' title="' + title + '"';
		}
		if (/^http/.test(href)) {
			out += ' target="_blank"';
		} else {
			out += ' data-navigo';
		}
		out += '>' + text + '</a>';
		return out;
	}
}});

module.exports = function (markdown) {
    return marked(markdown);
};