// webpack.dev.js - developmental builds

// node modules
const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// config files
const commonConfig = require('./common.js');
const settings = require('./settings.js');

// Configure the webpack-dev-server
const configureDevServer = () => {
    return {
        public: settings.devServerConfig.public(),
        host: settings.devServerConfig.host(),
        port: settings.devServerConfig.port(),
        https: !!parseInt(settings.devServerConfig.https()),
        disableHostCheck: true,
        hot: true,
        overlay: {
            warnings: true,
            errors: true,
        },
        watchContentBase: true,
        watchOptions: {
            aggregateTimeout: 200,
            poll: 1000,
            ignored: ['cypress/**', 'node_modules/**'],
        },
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        // Add your proxy here in case you need
        // proxy: {
        //     'api': {
        //         target: '',
        //         ws: true,
        //         secure: false,
        //         cookieDomainRewrite: 'localhost',
        //         debug: true,
        //     },
        // },
    };
};

const {
    configureAppCssLoaders,
    configureExtCssLoaders,
} = require('./css.config.js');

// Development module exports
module.exports = merge(commonConfig(false), {
    output: {
        filename: path.join('./js', '[name].bundle.js'),
        publicPath: settings.devServerConfig.public() + '/',
    },
    mode: 'development',
    devtool: '(none)',
    devServer: configureDevServer(),
    module: {
        rules: [...configureAppCssLoaders(), ...configureExtCssLoaders()],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
            filename: 'index.html',
            inject: true,
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
});
