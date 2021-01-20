// webpack.common.js - common webpack config
// node modules
const path = require('path');

// webpack plugins
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

// config files
const pkg = require('../package.json');
const settings = require('./settings.js');
const { paths } = settings;
const { configureBabelLoader } = require('./babel.config.js');

// Configure Entries
const configureEntries = () => {
    let entries = {};
    for (const [key, value] of Object.entries(settings.entries)) {
        entries[key] = path.resolve(__dirname, settings.paths.src + value);
    }

    return entries;
};
// Configure Manifest
const configureManifest = (fileName) => {
    return {
        fileName: fileName,
        basePath: settings.manifestConfig.basePath,
        map: (file) => {
            file.name = file.name.replace(/(\.[a-f0-9]{32})(\..*)$/, '$2');
            return file;
        },
    };
};

// Common module exports
// noinspection WebpackConfigHighlighting
module.exports = (isProd) => {
    return {
        name: pkg.name,
        entry: configureEntries(),
        output: {
            path: path.resolve(__dirname, paths.dist.base),
            publicPath: settings.urls.publicPath(),
        },
        plugins: [
            new ManifestPlugin(configureManifest('manifest.json')),
            new WebpackNotifierPlugin({
                title: 'Webpack',
                excludeWarnings: true,
                alwaysNotify: true,
            }),
            //new CopyWebpackPlugin(settings.copyExt)
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, settings.paths.src),
                libs: path.resolve(__dirname, '../libs'),
                Ext: path.resolve(
                    __dirname,
                    `${paths.Ext}ext-modern-all${isProd ? '' : '-debug'}.js`
                ),
                ExtTheme: path.resolve(
                    __dirname,
                    paths.ExtTheme + `/${settings.ExtTheme}.js`
                ),
                ExtThemeCSS: path.resolve(
                    __dirname,
                    `${paths.ExtTheme}/resources/${settings.ExtTheme}-all${
                        isProd ? '' : '-debug'
                    }.css`
                ),
            },
        },
        module: {
            rules: [
                configureBabelLoader(
                    Object.values(pkg.browserslist.modernBrowsers)
                ),
            ],
        },
    };
};
