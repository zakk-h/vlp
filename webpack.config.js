const
    webpack = require('webpack'),
    path = require('path'),
    workboxPlugin = require('workbox-webpack-plugin');

module.exports = {
    entry: './src/vlp-web.js',
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
            { test: /app\.manifest$/, use: [{loader:'file-loader',options: {name:'manifest.json'}}] },
            { test: /\.html$/, use: [{loader:"file-loader",options:{name:'[name].html'}}] },
            { test: /\.css$/, use: ["style-loader","css-loader"] },
            { test: /\.(png|svg|jpe?g|gif|woff2?|ttf|eot)$/, use: [{loader:'file-loader',options: {name:'[name].[ext]'}}] },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'ADD_ZAKKLAB': false
          }),
        new workboxPlugin.GenerateSW({
            swDest: 'sw.js',
            //globPatterns: ['**/*.{html,js,css}'],
            clientsClaim: true,
            skipWaiting: true,
            runtimeCaching: [{
				urlPattern: new RegExp('https://static.valdese.net/osm/.+'),
                handler: 'StaleWhileRevalidate'
              }]
        })
    ]
}