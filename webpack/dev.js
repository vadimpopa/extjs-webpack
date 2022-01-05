// webpack.dev.js - developmental builds

// node modules
const { merge } = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// config files
const commonConfig = require('./common.js');
const { devServerConfig } = require('./settings.js');

// Configure the webpack-dev-server
const configureDevServer = () => {
    return {
        host: devServerConfig.host(),
        port: devServerConfig.port(),
        https: !!parseInt(devServerConfig.https()),
        hot: false,
        client: {
            overlay: {
                warnings: true,
                errors: true,
            },
        },
        liveReload: true,
        static: {
            directory: path.resolve(__dirname, '../'),
            publicPath: './',
        },
        headers: {
            'Access-Control-Allow-Origin': '*',
        },

        // Use it to run a proxy
        // proxy: {
        //     '/api': {
        //         target: devServerConfig.remoteServerUrl,
        //         ws: true,
        //         secure: false,
        //         cookieDomainRewrite: false,
        //         cookiePathRewrite: {
        //             '/path/': '/',
        //             '/path': '/',
        //         },
        //         debug: true,
        //         changeOrigin: true,
        //         onProxyRes: (proxyRes, request, response) => {
        //             const setCookieHeader = proxyRes.headers['set-cookie'];
        //
        //             //remove "Secure" option as such cookie will not be accepted when locally using HTTP
        //             if (setCookieHeader && setCookieHeader.length > 0) {
        //                 let sessionCookie = setCookieHeader[0];
        //
        //                 if (/secure/i.test(sessionCookie)) {
        //                     sessionCookie = sessionCookie.replace(
        //                         /\s*Secure;/i,
        //                         ''
        //                     );
        //                     console.log(
        //                         `Rewriting set-cookie header to: ${sessionCookie}`
        //                     );
        //                     proxyRes.headers['set-cookie'] = [sessionCookie];
        //                 }
        //             }
        //         },
        //     }
        // },
    };
};

const { configureCssLoaders } = require('./css.config.js');

console.log(process.env.NODE_ENV);

// Development module exports
module.exports = merge(commonConfig(false), {
    output: {
        filename: '[name].bundle.js',
        publicPath: 'auto',
        clean: true,
    },
    mode: 'development',
    devtool: false,
    devServer: configureDevServer(),
    module: {
        rules: [...configureCssLoaders()],
    },
    plugins: [
        new webpack.DefinePlugin({
            WEBPACK_APP_VERSION: JSON.stringify(
                require('../package.json').version
            ),
        }),
        new HtmlWebpackPlugin({
            template: 'index.html',
            filename: 'index.html',
            inject: true,
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
});