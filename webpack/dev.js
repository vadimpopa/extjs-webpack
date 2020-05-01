// webpack.dev.js - developmental builds

// node modules
const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// webpack plugins
const DashboardPlugin = require('webpack-dashboard/plugin');

// config files
const common = require('./common.js');
const pkg = require('../package.json');
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
        overlay: true,
        watchContentBase: true,
        watchOptions: {
            poll: !!parseInt(settings.devServerConfig.poll()),
            ignored: /node_modules/,
        },
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
    };
};

// Configure Image loader
const configureImageLoader = () => {
    return {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        use: [
            {
                loader: 'file-loader',
                options: {
                    name: 'img/[name].[hash].[ext]'
                }
            }
        ]
    };
};

// Configure the Postcss loader
const configurePostcssLoader = () => {
    return {
        test: /\.(pcss|css)$/,
        use: [
            {
                loader: 'style-loader',
            },
            {
                loader: 'css-loader',
                options: {
                    url: false,
                    importLoaders: 2,
                    sourceMap: true,
                    modules: {
                        mode: 'local',
                        exportGlobals: true,
                        localIdentName: '[path][name]__[local]--[hash:base64:5]',
                        context: path.resolve(__dirname, settings.paths.src.css),
                        hashPrefix: 'cara',
                    },
                },
            },
            {
                loader: 'resolve-url-loader'
            },
            {
                loader: 'postcss-loader',
                options: {
                    sourceMap: true,
                    config: {
                        path: path.resolve(__dirname, './postcss.config.js'),
                    },
                },
            }
        ]
    };
};

// Development module exports
module.exports = merge(
    common.modernConfig,
    {
        output: {
            filename: path.join('./js', '[name].bundle.js'),
            publicPath: settings.devServerConfig.public() + '/',
        },
        mode: 'development',
        devtool: 'inline-source-map',
        devServer: configureDevServer(),
        module: {
            rules: [
                configurePostcssLoader(),
                configureImageLoader(),
            ],
        },
        plugins: [
            new HtmlWebpackPlugin(
                {
                    template: 'index.html',
                    filename: 'index.html',
                    inject: true,
                }
            ),
            new webpack.HotModuleReplacementPlugin(),
            new DashboardPlugin(),
        ],
    }
);