// webpack.settings.js - webpack settings config

// node modules
require('dotenv').config();

// Webpack settings exports
// noinspection WebpackConfigHighlighting
module.exports = {
    name: "Example Project",
    copyright: "Example Company, Inc.",
    paths: {
        src: {
            base: "../src/",
            css: "../src/",
            js: "../src/"
        },
        dist: {
            base: "../build/",
            clean: [
                '**/*',
            ]
        }
    },
    urls: {
        publicPath: () => process.env.PUBLIC_PATH || "./",
    },
    vars: {
        cssName: "styles"
    },
    entries: {
        "app": "app.js"
    },
    babelLoaderConfig: {
        exclude: [
            /(node_modules)/
        ],
    },
    // copyWebpackConfig: [
    //     {
    //         from: "../src/js/workbox-catch-handler.js",
    //         to: "js/[name].[ext]"
    //     }
    // ],
    copyExt: [
        {
            from: "ext/build/ext-modern-all.js",
            to: "ext/ext-modern-all.js",
            toType: 'file',
        },
        {
            from: "ext/build/modern/theme-triton/theme-triton.js",
            to: "ext/theme-triton.js",
            toType: 'file',
        },
        {
            from: "ext/build/modern/theme-triton/resources/theme-triton-all.css",
            to: "ext/resources/theme-triton-all.css",
            toType: 'file',
        },
        {
            from: "ext/build/modern/theme-triton/resources/theme-triton-all_1.css",
            to: "ext/resources/theme-triton-all_1.css",
            toType: 'file',
        },
        {
            from: "ext/build/modern/theme-triton/resources/theme-triton-all_2.css",
            to: "ext/resources/theme-triton-all_2.css",
            toType: 'file',
        }
    ],
    devServerConfig: {
        public: () => process.env.DEVSERVER_PUBLIC || "http://localhost:8080",
        host: () => process.env.DEVSERVER_HOST || "localhost",
        poll: () => process.env.DEVSERVER_POLL || false,
        port: () => process.env.DEVSERVER_PORT || 8080,
        https: () => process.env.DEVSERVER_HTTPS || false,
    },
    manifestConfig: {
        basePath: ""
    },
    purgeCssConfig: {
        whitelist: [
            "./src/css/components/**/*.{css}"
        ],
        whitelistPatterns: [],
        extensions: [
            "html",
            "js"
        ]
    },
    saveRemoteFileConfig: [
        {
            url: "https://www.google-analytics.com/analytics.js",
            filepath: "js/analytics.js"
        }
    ],
    webappConfig: {
        logo: "./resources/img/favicon-src.png",
        prefix: "img/favicons/"
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