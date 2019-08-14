const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: './src/vlp-cordova.js',
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },    
    output: {
		path: path.resolve(__dirname, 'www'),
		filename: 'vlp.js'
    },
    module: {
        rules: [
            { test: /cordova\.html$/, use: [{loader:"file-loader",options:{name:"index.html"}}] },
            { test: /\.htm$/, use: [{loader:"file-loader",options:{name:'[name].html'}}] },
            { test: /\.css$/, use: ["style-loader","css-loader"] },
            { test: /\.(png|svg|jpe?g|gif|woff2?|ttf|eot)$/, use: [{loader:'file-loader',options: {name:'[name].[ext]'}}] },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'USING_CORDOVA': true,
            'USING_WEB': false
          })
    ]
}