// webpack.settings.js - webpack settings config

// node modules
require('dotenv').config();

const ExtTheme = 'theme-triton';

// Webpack settings exports
// noinspection WebpackConfigHighlighting
module.exports = {
    name: 'App',
    copyright: '',
    ExtTheme,
    paths: {
        src: '../src/',
        Ext: '../ext/build/',
        ExtTheme: `../ext/build/modern/${ExtTheme}/`,
        dist: {
            base: '../build/',
            clean: ['**/*'],
        },
    },
    urls: {
        publicPath: () => process.env.PUBLIC_PATH || './',
    },
    vars: {
        cssName: 'styles',
    },
    entries: {
        Ext: 'ext.js',
        overrides: 'overrides/index.js',
        app: 'app.js',
    },
    babelLoaderConfig: {
        exclude: [/(node_modules)/, /(ext-)/],
    },
    copyExt: {
        patterns: [
            {
                from: 'resources',
                to: 'resources',
            },
        ],
    },
    devServerConfig: {
        public: () => process.env.DEVSERVER_PUBLIC || 'http://localhost:8080',
        host: () => process.env.DEVSERVER_HOST || 'localhost',
        poll: () => process.env.DEVSERVER_POLL || false,
        port: () => process.env.DEVSERVER_PORT || 8080,
        https: () => process.env.DEVSERVER_HTTPS || false,
    },
    manifestConfig: {
        basePath: '',
    },
    purgeCssConfig: {
        whitelist: ['./src/css/components/**/*.{css}'],
        whitelistPatterns: [],
        extensions: ['html', 'js'],
    },
    saveRemoteFileConfig: [
        {
            url: 'https://www.google-analytics.com/analytics.js',
            filepath: 'js/analytics.js',
        },
    ],
    webappConfig: {
        logo: './resources/img/favicon-src.png',
        prefix: 'img/favicons/',
    },
    // workboxConfig: {
    //     swDest: "../sw.js",
    //     importScripts: [
    //         "/dist/js/workbox-catch-handler.js"
    //     ],
    //     exclude: [
    //         /\.(png|jpe?g|gif|svg|webp)$/i,
    //         /\.map$/,
    //         /^manifest.*\\.js(?:on)?$/,
    //     ],
    //     globDirectory: "./web/",
    //     globPatterns: [
    //         "offline.html",
    //         "offline.svg"
    //     ],
    //     offlineGoogleAnalytics: true,
    //     runtimeCaching: [
    //         {
    //             urlPattern: /\.(?:png|jpg|jpeg|svg|webp)$/,
    //             handler: "CacheFirst",
    //             options: {
    //                 cacheName: "images",
    //                 expiration: {
    //                     maxEntries: 20
    //                 }
    //             }
    //         }
    //     ]
    // }
};
