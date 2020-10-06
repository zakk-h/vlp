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
const {TwingEnvironment,TwingLoaderArray,TwingLoaderFilesystem,TwingLoaderChain,TwingFilter} = require('twing');
const markdownRender = require('./markdown.js');
const YAML = require('yaml');
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
			let newp2 = (p2.charAt(0) == '~') ? path.join('../node_modules',p2.slice(1)) : path.join(ifolder,p2);
			fixups.push(newp2);
			return p1+newp2;
		})
	});
	return fixups;
}

const mdYAMLHeader = /^(-{3}(?:\n|\r)([\w\W]+?)(?:\n|\r)-{3}\s+)?([\w\W]*)*/;
const htmYAMLHeader = /^(<!--YAML--(?:\n|\r)([\w\W]+?)(?:\n|\r)-{2}>\s+)?([\w\W]*)*/;
function parseFrontMatter(text, re=mdYAMLHeader) {
	let results = re.exec(text)
		, out = [{},results[3] || '']
		, yamlOrJson;

	if ((yamlOrJson = results[2])) {
		// yaml does not allow tabs, but we do, thus this is needed
		yamlOrJson = yamlOrJson.replace(/\t/g,'   ');
		if (yamlOrJson.charAt(0) === '{') {
			out[0] = JSON.parse(yamlOrJson);
		} else {
			out[0] = YAML.parse(yamlOrJson);
		}
	}

	return out;
}

async function buildMarkupPage(loaderObj,ifolder,pgid,context) {
	let htmraw = fs.readFileSync(path.resolve('./src',ifolder,pgid+'.twig')).toString();
	let iSplit = parseFrontMatter(htmraw,htmYAMLHeader);
	let c2 = Object.assign({},context,{page:iSplit[0]});
	let html = await twigIt(iSplit[1],c2);
	let match = null;
	let title = (match = /<h1>(.+)<\/h1>/m.exec(html)) ? match[1] : pgid;

	const infoObj = Object.assign({class:'info',title:title},iSplit[0],{id: pgid, html: html, _src: htmraw});
	const linkedFiles = fixupHtmlResources(infoObj,ifolder,loaderObj);

	return infoObj;
}

async function buildMarkdownPage(loaderObj,ifolder,pgid,context) {
	let md = fs.readFileSync(path.resolve('./src',ifolder,pgid+'.md')).toString();
	let mdSplit = parseFrontMatter(md);
	let c2 = Object.assign({},context,{page:mdSplit[0]});
	let mdp = await twigIt(mdSplit[1],c2);
	let html = markdownRender(mdp);
	let match = null;
	let title = (match = /^#\s*(.+)$/m.exec(mdp)) ? match[1] : pgid;

	const infoObj = Object.assign({class:'info',title:title},mdSplit[0],{id: pgid, html: html, _src: md});
	const linkedFiles = fixupHtmlResources(infoObj,ifolder,loaderObj);

	return infoObj;
}

function genSortKey(a) {
	// empty setting triggers tildes, which are highest character code < 127, forcing those
	// pages to the end of the sort
	let nav = a.nav || '~~~~~';
	return `${nav}:${a.id}`;
}

function loadYamlFile(f) {
	if (!fs.existsSync(f)) return {};
	let rawd = fs.readFileSync(f,'utf8');
	let yd = YAML.parse(rawd.replace(/\t/g,'   '));
	return yd;
}

async function doLoader(loaderObj, twigSource, options) {
	let c = {};
	let appd = loadYamlFile(path.resolve('./src/appd.yaml'));

	if (options.zakklab) {
		let zappd = loadYamlFile(path.resolve('./src/zakklab/appd.yaml'));
		appd = Object.assign(appd,zappd);
	}

	c.appd = appd;

	let icons = {};
	appd.fvricons.forEach(k => icons[k] = `<i class="fvricon fvricon-${k}"></i>`);
	c.icon = icons;

	if (options.loadpages) {
		let pageFolders = ['pages'];
		let pages = [];
		let ids = [];

		if (options.zakklab) pageFolders.unshift('zakklab/pages');

		// We load all `md` and `twig` files in the first folder. We then iterate over
		// other folders, but only include those files with a new unique id. This gives
		// zakklab priority over the main, when it is enabled.
		await forEach(pageFolders, async (folder) => {
			let flist = fs.readdirSync(path.resolve(`./src/${folder}`),{withFileTypes:true});

			// wait while we asynchronously process all of the pages
			await forEach(flist, async (file) => { 
				if (!file.isFile) return;

				let match = /^([^.]+)\.(map|md|twig)/.exec(file.name);
				if (!(match && match[2])) return;
				
				let pgid = match[1];
				let pgtype = match[2];

				// this hook and its matching push must be kept together and called synchronously
				if (ids.includes(pgid)) return;
				ids.push(pgid);

				let pg_r = {ignore: true};
				if (pgtype == 'map') {
					let mapdata = loadYamlFile(path.resolve(`./src/${folder}/${file.name}`));
					pg_r = Object.assign({class:'map',title:pgid},mapdata,{id: pgid});
				} else if (pgtype == 'md') {
					pg_r = await buildMarkdownPage(loaderObj,folder,pgid,c);
				} else {
					pg_r = await buildMarkupPage(loaderObj,folder,pgid,c);
				}

				if (!pg_r.ignore) {
					pg_r.sortkey = genSortKey(pg_r);
					pages.push(pg_r);
				}
			});
		});

		pages.sort((a,b) => (a.sortkey < b.sortkey) ? -1 : 1);

		c.pages = pages;
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