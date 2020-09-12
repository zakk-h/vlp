const
	webpack = require('webpack'),
	path = require('path'),
	CompressionPlugin = require('compression-webpack-plugin'),
	workboxPlugin = require('workbox-webpack-plugin');

module.exports = env => {
	var use_zakklab = (env && env.ZAKKLAB) ? 1 : 0;

	return {
		entry: ['./src/vlp-web.js','./src/index.twig'],
		performance: {
			hints: false,
			maxEntrypointSize: 512000,
			maxAssetSize: 512000
		},
		output: {
			path: path.resolve(__dirname, 'build'),
			filename: 'vlp.js'
		},
		module: {
			rules: [
				{
					test: /app\.manifest$/,
					use: [
						{ loader: 'file-loader', options: { name: 'manifest.json' } },
						{ loader: path.resolve('./src/loader/twig-loader.js'), options: { zakklab:use_zakklab } }
					]
				},
				{
					test: /\.twig$/,
					use: [
						{ loader: 'file-loader', options: { name: '[name].html' } },
						{ loader: 'extract-loader' },
						{ loader: 'html-loader', options: { attributes: {list: [{tag:'img',attribute:'src',type:'src'}] } } },
						{ loader: path.resolve('./src/loader/twig-loader.js'), options: { zakklab:use_zakklab, loadpages:true  } }
					]
				},
				{
					test: /\.css$/,
					use: ["style-loader", "css-loader"]
				},
				{
					test: /\.(png|svg|jpe?g|gif|woff2?|ttf|eot)$/,
					use: [
						{ loader: 'file-loader', options: { name: '[name].[ext]' } }
					]
				}
			]
		},
		plugins: [
			new webpack.DefinePlugin({
				'ADD_ZAKKLAB': use_zakklab
			}),
			new CompressionPlugin({
				test: /\.(js|html)$/i,
			}),
			new workboxPlugin.GenerateSW({
				swDest: 'sw.js',
				maximumFileSizeToCacheInBytes: 3000000,
				//globPatterns: ['**/*.{html,js,css}'],
				cleanupOutdatedCaches: true,
				exclude: [/\.(js|html)\.gz/],
				clientsClaim: true,
				skipWaiting: true,
				runtimeCaching: [{
					urlPattern: new RegExp('https://[a-c].tile.openstreetmap.org/[0-9]+/[0-9]+/[0-9]+.png'),
					handler: 'StaleWhileRevalidate'
				}]
			})
		]
	}
}
