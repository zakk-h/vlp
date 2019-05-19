const path = require('path');

module.exports = {
	entry: './src/vlp.js',
    output: {
		path: path.resolve(__dirname, 'www'),
		filename: 'vlp.js'
    },
    module: {
        rules: [
            { test: /\.css$/, use: ["style-loader","css-loader"] },
            { test: /\.(png|svg|jpe?g|gif|woff2?|ttf|eot)$/, use: [ 'file-loader' ] },
        ]
    }
}