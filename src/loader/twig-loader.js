// This load is used to pipe a file through the twing/twig templating engine.
// By default, a limited set of context variables are established, mainly 
// app title text and color settings. Extra context can be requested using
// the `loadpages` option, which will scan through all of the info pages
// and build an array of their content. This is used to embed the pages
// into a single bundled index.html file.
//
const fs = require('fs');
const path = require('path');
const { forEach } = require('p-iteration');
const loaderUtils = require("loader-utils");
const {TwingEnvironment,TwingLoaderArray,TwingLoaderFilesystem,TwingLoaderChain} = require('twing');
const init_twigenv = require('./init_twigenv.js');
const markdownRender = require('./markdown.js');
const { type } = require('os');
const defaultOptions = {loadpages:false, zakklab:false};

async function twigIt(data, context) {
	let loader1 = new TwingLoaderArray({'twig.main': data});
	let loader2 = new TwingLoaderFilesystem(path.resolve(__dirname,'..'));
	let loader = new TwingLoaderChain([loader1, loader2]);	
	let twing = new TwingEnvironment(loader, {autoescape:false});

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

async function buildMarkdownPage(loaderObj,ifolder,fname,context) {
	let md = fs.readFileSync(path.resolve('./src',ifolder,fname)).toString();
	let mdp = await twigIt(md,context);
	let html = markdownRender(mdp);
	let match = null;
	let pgid = (match = /^([^.]+)\.md$/.exec(fname)) ? match[1] : fname;
	let title = (match = /^#\s*(.+)$/m.exec(mdp)) ? match[1] : 'untitled';

	const infoObj = {id: pgid, title: title, html: html, src: md};
	const linkedFiles = fixupHtmlResources(infoObj,ifolder,loaderObj);
	//console.log('linked files '+linkedFiles);

	return infoObj;
}

async function doLoader(loaderObj, twigSource, options) {
	let c = init_twigenv(options.zakklab);

	if (options.loadpages) {
		let info = [];
		c.whatsnew = JSON.parse(fs.readFileSync(path.resolve('src/whatsnew.json')));

		let flist = fs.readdirSync(path.resolve('./src/info'),{withFileTypes:true});
		// wait while we asynchronously process all of the pages
		await forEach(flist, async (file) => { 
			if (file.isFile && /\.md$/.test(file.name)) {
				let md_r = await buildMarkdownPage(loaderObj,'info',file.name,c);
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

	doLoader(this, twigSource, options).then((output) => {
		callback(null,output);
	});
};