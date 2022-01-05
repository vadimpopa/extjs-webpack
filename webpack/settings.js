// webpack.settings.js - webpack settings config

require('dotenv').config();

// Webpack settings exports
// noinspection WebpackConfigHighlighting
module.exports = {
    name: 'App',
    copyright: 'Add copyright here',
    paths: {
        resources: '../resources',
        src: '../src/',
        Ext: '../ext/build/',
        dist: {
            base: '../build/',
            clean: ['**/*'],
        },
    },
    urls: {
        publicPath: './',
    },
    entries: {
        bootstrap: 'bootstrap.js',
    },
    copyFiles: [
        {
            from: 'resources',
            to: 'resources',
        },

        // Add your assets. Example:
        // {
        //     from: './node_modules/@arcgis/core/assets',
        //     to: 'resources/@arcgis/assets',
        // },
        // {
        //     from: './node_modules/monaco-editor/min/vs/base/browser/ui/codicons/codicon/',
        //     to: 'resources/fonts/',
        // },
        // {
        //     from: './node_modules/@pdftron/webviewer/public',
        //     to: './libs/pdftron',
        // },
    ],
    devServerConfig: {
        host: () => process.env.DEVSERVER_HOST || 'localhost',
        poll: () => process.env.DEVSERVER_POLL || false,
        port: () => process.env.DEVSERVER_PORT || 8080,
        https: () => process.env.DEVSERVER_HTTPS || false,
        //remoteServerUrl: '',
    },
};
