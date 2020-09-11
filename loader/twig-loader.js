const fs = require('fs');
const path = require('path');
const { forEach } = require('p-iteration');
const loaderUtils = require("loader-utils");
const {TwingEnvironment, TwingLoaderArray} = require('twing');
const init_twigenv = require('./init_twigenv.js');
const markdownRender = require('./markdown.js');
const { type } = require('os');
const defaultOptions = {infofiles:false, zakklab:false};

async function twigIt(data, context) {
	let loader = new TwingLoaderArray({'data.twig': data});
	let twing = new TwingEnvironment(loader);
	const response = await twing.render('data.twig', context);
	return response;
}

async function buildMarkdownPage(ifolder,fname,context) {
	let md = fs.readFileSync(path.resolve(ifolder,fname)).toString();
	let mdp = await twigIt(md,context);
	let html = markdownRender(mdp);
	let match = null;
	let pgid = (match = /^([^.]+)\.md$/.exec(fname)) ? match[1] : fname;
	let title = (match = /^#\s*(.+)$/m.exec(mdp)) ? match[1] : 'untitled';

	return {
		id: pgid,
		title: title,
		html: html,
		src: md
	};
}

async function doLoader(twigSource, options) {
	let c = init_twigenv(options.zakklab);

	if (options.infofiles) {
		let ifolder = path.resolve('src/info');
		let info = [];
		c.whatsnew = JSON.parse(fs.readFileSync(path.resolve('src/whatsnew.json')));

		let flist = fs.readdirSync(ifolder,{withFileTypes:true});
		await forEach(flist, async (file) => { 
			if (file.isFile && /\.md$/.test(file.name)) {
				let md_r = await buildMarkdownPage(ifolder,file.name,c);
				info.push(md_r);
			}
		});

		info.sort((a,b) => (a.id < b.id) ? -1 : 1);
		c.info = info;
	}

	return await twigIt(twigSource,c);
}

module.exports.raw = true;
module.exports = function(twigSource) {
	let callback = this.async();
	const options = loaderUtils.getOptions(this) || defaultOptions;

	doLoader(twigSource, options).then((output) => {
		callback(null,output);
	});
};