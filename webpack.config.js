
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanPlugin = require('clean-webpack-plugin')
const webpack = require('webpack');
const path = require('path');
const glob = require('glob');

const files = glob.sync('./_src/*.@(sass)').concat(['./_src/app.js', './_src/article.js']);
console.log('Entry files detected: %s', files.map(f => '\n  ' + f).join('') + '\n');

const fileNames = {};

files.forEach(it => {
    const basename = path.basename(it);
    fileNames[basename.substring(0, basename.indexOf('.'))] = it;
});

const config = {

    devServer: {
        contentBase: __dirname,
        publicPath: '/dist/',
        port: 8080,
    },

    entry: fileNames,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(txt|html|json)$/,
                use: 'raw-loader'
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            },
            {
                test: /\.sass$/,
                use: ExtractTextPlugin.extract({
                    // fallbackLoader: 'style-loader',
                    use: 'css-loader?url=false!sass-loader'
                }),
            }
        ]
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin(),
        new ExtractTextPlugin('styles.css'),
        new CleanPlugin(['dist']),
    ]
};

module.exports = config;