global.WEBPACK_ENV = "production";

var webpack = require("webpack");
var generateConfig = require("./webpack.config.base");
var exec = require("child_process").execSync;
var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var FarmBotRenderer = require("./farmBotRenderer");
var glob = require("glob");
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var webpackUglifyJsPlugin = require('webpack-uglify-js-plugin');

c = function() {

    var conf = generateConfig();
    conf.module.rules.push({
        test: [/\.scss$/, /\.css$/],
        loader: ExtractTextPlugin.extract("css-loader!sass-loader")
    });

    // PLUGINS:
    [
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("production"),
            "process.env.REVISION": JSON.stringify(
                exec('git log --pretty=format:"%h%n%ad%n%f" -1').toString()),
        }),
        new ExtractTextPlugin({
            filename: "dist/styles.css",
            disable: false,
            allChunks: true
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require("cssnano"),
            cssProcessorOptions: { discardComments: { removeAll: true } },
            canPrint: true
        }),
        new webpackUglifyJsPlugin({
            cacheFolder: path.resolve(__dirname, 'public/cached_uglify/'),
            debug: true,
            minimize: true,
            sourceMap: true,
            screw_ie8: true,
            output: {
                comments: false
            },
            compressor: {
                warnings: false
            }
        })
    ].forEach(function(x) { conf.plugins.push(x) })

    return conf;
}

module.exports = c();