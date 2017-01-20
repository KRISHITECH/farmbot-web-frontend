var path = require("path");
var webpack = require("webpack");
var exec = require("child_process").exec;
var execSync = require("child_process").execSync;
var webpack = require("webpack");
var fs = require("fs");
var FarmBotRenderer = require("./farmBotRenderer");

// Bootstrapping
// Ensure index.html is built for dev
/** WEBPACK BASE CONFIG */
exec("mkdir -p public/app");
exec("echo -n > public/app/index.html");
exec("touch public/app/index.html");
exec("touch public/app/index.html");
exec("rm -rf public/dist/*.js");

var isProd = !!(global.WEBPACK_ENV === "production");
module.exports = function() {
    return {
        entry: {
            "bundle": path.resolve(__dirname, "../src/entry.tsx"),
            "front_page": "./src/front_page/index.tsx",
            "verification": "./src/verification.ts",
            "password_reset": "./src/password_reset/index.tsx"
        },
        output: {
            path: path.resolve(__dirname, "../public"),
            filename: "dist/[name].[chunkhash].js",
            libraryTarget: "umd",
            publicPath: "/",
            devtoolLineToLine: true
        },
        devtool: "source-map",
        /** Allows imports without file extensions. */
        resolve: {
            extensions: [".js", ".ts", ".tsx", ".css", ".scss", ".json", ".hbs"]
        },

        /** Shared loaders for prod and dev. */
        module: {
            rules: [
                { test: /\.tsx?$/, use: "ts-loader" },
                {
                    test: [/\.woff$/, /\.woff2$/, /\.ttf$/],
                    use: "url-loader"
                },
                {
                    test: [/\.eot$/, /\.svg(\?v=\d+\.\d+\.\d+)?$/],
                    use: "file-loader"
                }
            ]
        },

        /** Shared plugins for prod and dev. */
        plugins: [
            new webpack.DefinePlugin({
                "process.env.REVISION": JSON.stringify(execSync(
                    'git log --pretty=format:"%h%n%ad%n%f" -1').toString())
            }),
            new webpack.DefinePlugin({
                "process.env.SHORT_REVISION": JSON.stringify(execSync(
                    'git log --pretty=format:"%h" -1').toString())
            }),
            // FarmBot Inc related.
            new webpack.DefinePlugin({
                "process.env.NPM_ADDON": JSON.stringify(
                    process.env.NPM_ADDON || false).toString()
            }),
            new FarmBotRenderer({
                isProd: isProd,
                path: path.resolve(__dirname, "../src/static/app_index.hbs"),
                filename: "index.html",
                outputPath: path.resolve(__dirname, "../public/app/")
            }),
            new FarmBotRenderer({
                isProd: isProd,
                path: path.resolve(__dirname, "../src/static/front_page.hbs"),
                filename: "index.html",
                outputPath: path.resolve(__dirname, "../public/"),
                include: "front_page"
            }),
            new FarmBotRenderer({
                isProd: isProd,
                path: path.resolve(__dirname, "../src/static/verification.hbs"),
                filename: "verify.html",
                outputPath: path.resolve(__dirname, "../public/"),
                include: "verification"
            }),
            new FarmBotRenderer({
                isProd: isProd,
                path: path.resolve(__dirname, "../src/static/password_reset.hbs"),
                filename: "password_reset.html",
                outputPath: path.resolve(__dirname, "../public/"),
                include: "password_reset"
            })
        ],

        /** Webpack Dev Server. */
        devServer: {
            historyApiFallback: {
                rewrites: [
                    { from: /\/app\//, to: "/app/index.html" },
                    { from: /password_reset/, to: "password_reset.html" },
                ]
            }
        }
    }
}