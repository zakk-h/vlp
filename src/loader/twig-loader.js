// This load is used to pipe a file through the twing/twig templating engine.
// By default, a limited set of context variables are established, mainly 
// app title text and color settings. Extra context can be requested using
// the `loadpages` option, which will scan through all of the pages and
// build an array of their content. This is used to embed the pages
// into a single bundled index.html file.
//
const fs = require('fs');
const path = require('path');
const { forEach } = require('p-iteration');
const loaderUtils = require('loader-utils');
const {format,formatDistance,formatRelative} = require('date-fns');
const {TwingEnvironment,TwingLoaderArray,TwingLoaderFilesystem,TwingLoaderChain,TwingFilter} = require('twing');
const init_twigenv = require('./init_twigenv.js');
const markdownRender = require('./markdown.js');
const YAML = require('yaml');
const { type } = require('os');
const defaultOptions = {loadpages:false, zakklab:false};

const timeAgoFilter = new TwingFilter('timeAgo', (d) => Promise.resolve(formatDistance(1000*Number(d),Date.now(),{addSuffix:true})));

async function twigIt(data, context) {
	let loader1 = new TwingLoaderArray({'twig.main': data});
	let loader2 = new TwingLoaderFilesystem(path.resolve(__dirname,'..'));
	let loader = new TwingLoaderChain([loader1, loader2]);	
	let twing = new TwingEnvironment(loader, {autoescape:false});
	twing.addFilter(timeAgoFilter);

	const response = await twing.render('twig.main', context);
	return response;
}

function fixupHtmlResources(infoObj,ifolder,loaderObj) {
	let fixups = [];
	infoObj.html = infoObj.html.replace(/<img [^>]+>/g, img => {
		return img.replace(/(src=["'])([^"']+)/,(match,p1,p2) => {
			if (p2.indexOf('http') === 0) { return match; }
			let newp2 = path.join(ifolder,p2);
			fixups.push(newp2);
			return p1+newp2;
		})
	});
	return fixups;
}

function parseFrontMatter(text) {
	let re = /^([<!]{0,2}-{3}(?:\n|\r)([\w\W]+?)(?:\n|\r)-{3}>?\s+)?([\w\W]*)*/
		, results = re.exec(text)
		, out = [{},results[3] || '']
		, yamlOrJson;

	if ((yamlOrJson = results[2])) {
		if (yamlOrJson.charAt(0) === '{') {
			out[0] = JSON.parse(yamlOrJson);
		} else {
			out[0] = YAML.parse(yamlOrJson);
		}
	}

	return out;
}

async function buildMarkupPage(loaderObj,ifolder,fname,context) {
	let htmraw = fs.readFileSync(path.resolve('./src',ifolder,fname)).toString();
	let iSplit = parseFrontMatter(htmraw);
	let c2 = Object.assign({},context,{page:iSplit[0]});
	let html = await twigIt(iSplit[1],c2);
	let match = null;
	let pgid = (match = /^([^.]+)\./.exec(fname)) ? match[1] : fname;
	let title = (match = /<h1>(.+)<\/h1>/m.exec(html)) ? match[1] : 'untitled';

	const infoObj = Object.assign({title: title},iSplit[0],{id: pgid, html: html, src: htmraw});
	const linkedFiles = fixupHtmlResources(infoObj,ifolder,loaderObj);

	return infoObj;
}

async function buildMarkdownPage(loaderObj,ifolder,fname,context) {
	let md = fs.readFileSync(path.resolve('./src',ifolder,fname)).toString();
	let mdSplit = parseFrontMatter(md);
	let c2 = Object.assign({},context,{page:mdSplit[0]});
	let mdp = await twigIt(mdSplit[1],c2);
	let html = markdownRender(mdp);
	let match = null;
	let pgid = (match = /^([^.]+)\.md$/.exec(fname)) ? match[1] : fname;
	let title = (match = /^#\s*(.+)$/m.exec(mdp)) ? match[1] : 'untitled';

	const infoObj = Object.assign({title: title},mdSplit[0],{id: pgid, html: html, src: md});
	const linkedFiles = fixupHtmlResources(infoObj,ifolder,loaderObj);

	return infoObj;
}

async function doLoader(loaderObj, twigSource, options) {
	let c = init_twigenv(options.zakklab);

	if (options.loadpages) {
		let info = [];

		let flist = fs.readdirSync(path.resolve('./src/pages'),{withFileTypes:true});
		// wait while we asynchronously process all of the pages
		await forEach(flist, async (file) => { 
			if (!file.isFile) return;

			if (/\.md$/.test(file.name)) {
				let md_r = await buildMarkdownPage(loaderObj,'pages',file.name,c);
				info.push(md_r);
			} else if (/\.twig$/.test(file.name)) {
				let pg_r = await buildMarkupPage(loaderObj,'pages',file.name,c);
				info.push(pg_r);
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

	doLoader(this, twigSource, options).then((output) => {
		callback(null,output);
	});
};