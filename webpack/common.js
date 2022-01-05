// webpack.common.js - common webpack config
// node modules
const path = require('path');

// webpack plugins
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

// config files
const pkg = require('../package.json');
const settings = require('./settings.js');
const { configureESBuildLoader } = require('./esbuild.config.js');
const { paths } = settings;

// Configure Entries
const configureEntries = () => {
    let entries = {};
    for (const [key, value] of Object.entries(settings.entries)) {
        entries[key] = path.resolve(__dirname, settings.paths.src + value);
    }

    return entries;
};

const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin');

// Common module exports
// noinspection WebpackConfigHighlighting
module.exports = (isProd) => {
    return {
        name: pkg.name,
        entry: configureEntries(),
        target: 'web',
        output: {
            path: path.resolve(__dirname, paths.dist.base),
            publicPath: './',
        },
        plugins: [
            new PreloadWebpackPlugin({
                rel: 'preload',
                as: 'font',
                include: 'allAssets',
                fileWhitelist: [
                    /resources\/fonts(\/.*).(woff2?|ttf|woff)(\?.*)?$/i,
                ],
                fileBlacklist: [/codicon.ttf/],
            }),
            new WebpackNotifierPlugin({
                title: 'Webpack',
                excludeWarnings: true,
                alwaysNotify: true,
            }),
            new CopyWebpackPlugin({
                patterns: settings.copyFiles,
            }),
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, settings.paths.src),
                Ext: path.resolve(
                    __dirname,
                    `${paths.Ext}ext-modern-all${isProd ? '' : '-debug'}.js`
                ),
            },
            fallback: {
                fs: false,
            },
        },
        module: {
            rules: [configureESBuildLoader()],
        },
    };
};
