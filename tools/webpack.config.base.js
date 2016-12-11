var path = require('path'),
    exec = require('child_process').exec,
    execSync = require('child_process').execSync,
    webpack = require('webpack');

var StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');

var revisionPlugin = new webpack.DefinePlugin({
    'process.env.REVISION': JSON.stringify(execSync(
        'git log --pretty=format:"%h%n%ad%n%f" -1').toString())
});

var shortRevisionPlugin = new webpack.DefinePlugin({
    'process.env.SHORT_REVISION': JSON.stringify(execSync(
        'git log --pretty=format:"%h" -1').toString())
});

var npmAddons = new webpack.DefinePlugin({
    'process.env.NPM_ADDON': JSON.stringify(process.env.NPM_ADDON || false).toString()
});

module.exports = function() {
    return {
        module: {
            loaders: [{
                    test: /\.tsx?$/,
                    exclude: /(node_modules)/,
                    loader: 'ts'
                },
                {
                    test: /\.hbs$/,
                    loader: 'handlebars'
                },
                {
                    test: /\.json$/,
                    loader: 'json'
                }
            ],
        },
        entry: {
            'app-resources/bundle': './src/entry.tsx',
            // Preprocesses an HTML file to figure out if we need to load
            // style.css or not.
            'app-index': './src/static/app_index.ts',
            'front_page': './src/front_page/index.tsx',
            'password-reset': './src/static/password_reset.ts',
            'verify': './src/static/verify.ts',
            'password_reset': './src/password_reset/index.tsx'
        },
        output: {
            path: "public",
            filename: "[name].js",
            libraryTarget: 'umd',
        },
        ts: {
            configFileName: "tsconfig.json"
        },
        plugins: [
            revisionPlugin,
            shortRevisionPlugin,
            npmAddons,
            new StaticSiteGeneratorPlugin("app-index", "/app/", {
                templateName: "app_index"
            }),
            new StaticSiteGeneratorPlugin("password-reset", "/app/", {
                templateName: "password_reset"
            })
        ],
        resolve: {
            extensions: ['', '.js', '.ts', '.tsx', '.hbs'],
            fallback: path.join(__dirname, 'node_modules'),
            alias: {
                // Satisfies Handlebars requirement for 'fs' module.
                'handlebars': 'handlebars/runtime.js'
            }
        },
        node: {
            // Satisfies Handlebars requirement for 'fs' module.
            fs: "empty"
        },
        devServer: {
            historyApiFallback: {
                index: '/index.html',
                rewrites: [
                    { from: /\/app\//, to: '/app/index.html' },
                    { from: /password_reset/, to: 'password_reset.html' }
                ]
            },
        }
    };
};