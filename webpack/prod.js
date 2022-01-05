// webpack.prod.js - production builds
const webpack = require('webpack');
const git = require('git-rev-sync');
const { merge } = require('webpack-merge');
const moment = require('moment');
const path = require('path');

// webpack plugins
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
//const PurgecssPlugin = require('purgecss-webpack-plugin');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const zopfli = require('@gfx/zopfli');
//const CompressionPlugin = require('compression-webpack-plugin');

// config files
const commonConfig = require('./common.js');
const settings = require('./settings.js');

// Configure file banner
const configureBanner = () => {
    return {
        banner: [
            '/*!',
            ' * @project        ' + settings.name,
            ' * @name           ' + '[base]',
            ' * @author         ' + settings.copyright,
            ' * @build          ' + moment().format('llll') + ' ET',
            ' * @release        ' + git.long() + ' [' + git.branch() + ']',
            ' * @copyright      Copyright (c) ' +
            moment().format('YYYY') +
            ' ' +
            settings.copyright,
            ' *',
            ' */',
            '',
        ].join('\n'),
        raw: true,
        include: [/bootstrap/],
    };
};

// Configure Compression webpack plugin
const configureCompression = () => {
    return {
        filename: '[path].gz[query]',
        test: /\.(js|css|html|svg)$/,
        threshold: 10240,
        minRatio: 0.8,
        deleteOriginalAssets: false,
        compressionOptions: {
            numiterations: 15,
            level: 9,
        },
        algorithm(input, compressionOptions, callback) {
            return zopfli.gzip(input, compressionOptions, callback);
        },
    };
};

// Configure Clean webpack
const configureCleanWebpack = () => {
    return {
        cleanOnceBeforeBuildPatterns: settings.paths.dist.clean,
        verbose: false,
        dry: false,
    };
};

const distPath = path.resolve(__dirname, settings.paths.dist.base);

const { configureCssLoaders } = require('./css.config.js');

// Production module exports
module.exports = [
    merge(commonConfig(true), {
        mode: 'production',
        output: {
            path: distPath,
            filename: 'js/[name].[chunkhash].js',
        },
        module: {
            rules: [
                ...configureCssLoaders(),
                {
                    test: /\.js$/,
                    enforce: 'pre',
                    exclude: /(node_modules|\.spec\.js)/,
                    use: [
                        {
                            loader: 'webpack-strip-block',
                            options: {
                                start: '<debug>',
                                end: '</debug>',
                            },
                        },
                    ],
                },
            ],
        },
        plugins: [
            new webpack.BannerPlugin(configureBanner()),
            new webpack.DefinePlugin({
                WEBPACK_APP_VERSION: JSON.stringify(
                    require('../package.json').version
                ),
            }),
            new CleanWebpackPlugin(configureCleanWebpack()),
            new MiniCssExtractPlugin({
                filename: 'resources/css/[name].[contenthash].css',
                experimentalUseImportModule: false,
            }),
            new HtmlWebpackPlugin({
                template: 'templates/index.html',
                filename: 'server-index.html',
                inject: true,
            }),
            new HtmlWebpackPlugin({
                template: 'index.html',
                filename: 'index.html',
                inject: true,
            }),
            // new webpack.SourceMapDevToolPlugin({
            // 	filename: '[file].map[query]',
            // 	exclude: [/(Ext)/],
            // }),
            //new CompressionPlugin(configureCompression()),
            // new BundleAnalyzerPlugin({
            // 	analyzerMode: 'static',
            // 	reportFilename: 'report-modern.html',
            // }),
        ],
    }),
];
