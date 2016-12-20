var webpack = require('webpack');
var generateConfig = require("./webpack.config.base");
var exec = require("child_process").execSync;
var path = require("path");
var ExtractTextPlugin = require('extract-text-webpack-plugin');
global.WEBPACK_ENV = "production";

c = function() {
    var conf = generateConfig();

    conf
        .module
        .loaders
        .push({
            test: [/\.scss$/, /\.css$/],
            loader: ExtractTextPlugin.extract('style', 'css-loader!sass-loader')
        });

    conf.devtool = 'source-map';

    conf
        .plugins
        .push(new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            'process.env.REVISION': JSON.stringify(
                exec('git log --pretty=format:"%h%n%ad%n%f" -1').toString()),
        }));

    conf
        .plugins
        .push(new webpack.optimize.UglifyJsPlugin({
            compressor: { warnings: false },
        }));

    conf
        .plugins
        .push(new ExtractTextPlugin("app-resources/styles.css"));
    return conf;
}

module.exports = c();