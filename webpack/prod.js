// webpack.prod.js - production builds
const LEGACY_CONFIG = 'legacy';
const MODERN_CONFIG = 'modern';

// node modules
const webpack = require('webpack');
const glob = require('glob-all');
const git = require('git-rev-sync');
const merge = require('webpack-merge');
const moment = require('moment');
const path = require('path');

// webpack plugins
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin;
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const zopfli = require('@gfx/zopfli');

// //const PurgecssPlugin = require('purgecss-webpack-plugin');
// const CreateSymlinkPlugin = require('create-symlink-webpack-plugin');
// const CompressionPlugin = require('compression-webpack-plugin');
// const SaveRemoteFilePlugin = require('save-remote-file-webpack-plugin');
// //const WebappWebpackPlugin = require('webapp-webpack-plugin');
// //const WhitelisterPlugin = require('purgecss-whitelister');
// //const WorkboxPlugin = require('workbox-webpack-plugin');

// config files
const commonConfig = require('./common.js');
const settings = require('./settings.js');
const pkg = require('../package.json');

// Configure file banner
const configureBanner = () => {
    return {
        banner: [
            '/*!',
            ' * @project        ' + settings.name,
            ' * @name           ' + '[filebase]',
            ' * @author         ' + pkg.author.name,
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

// Configure terser
const configureTerser = () => {
    return {
        cache: true,
        parallel: true,
        sourceMap: true,
    };
};

// Configure Webapp webpack
const configureWebapp = () => {
    return {
        logo: settings.webappConfig.logo,
        prefix: settings.webappConfig.prefix,
        cache: false,
        inject: 'force',
        favicons: {
            appName: pkg.name,
            appDescription: pkg.description,
            developerName: pkg.author.name,
            developerURL: pkg.author.url,
            path: settings.paths.dist.base,
        },
    };
};

const distPath = path.resolve(__dirname, settings.paths.dist.base);

// Production module exports
module.exports = [
    merge(commonConfig(true), {
        mode: 'production',
        output: {
            path: distPath,
            filename: path.join('./js', '[name].[chunkhash].js'),
        },
        //optimization: {
        // 			minimizer: [new TerserPlugin(configureTerser())],
        // 		}
        module: {
            rules: [
                {
                    test: /\.((c|sa|sc)ss)$/i,
                    exclude: [/ext/],
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                url: false,
                                importLoaders: 2,
                                sourceMap: true,
                                modules: {
                                    auto: true,
                                    mode: 'local',
                                    exportGlobals: true,
                                    localIdentName:
                                        '[name]__[local]--[hash:base64:5]',
                                },
                            },
                        },
                        'resolve-url-loader',
                        'sass-loader',
                    ],
                },
                {
                    test: /\.(css)$/,
                    include: [/ext/],
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                url: true,
                            },
                        },
                    ],
                },
                {
                    test: /\.(ttf|svg|eot|woff2?)$/i,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[contenthash].[ext]',
                                outputPath: './resources/fonts',
                                publicPath(url) {
                                    const fileName = path.basename(url);
                                    return `/resources/fonts/${fileName}`;
                                },
                            },
                        },
                    ],
                },
                {
                    test: /\.(png|jpe?g|gif|webp)$/i,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[contenthash].[ext]',
                                outputPath: './resources/images',
                                publicPath(url) {
                                    const fileName = path.basename(url);
                                    return `/resources/images/${fileName}`;
                                },
                            },
                        },
                        {
                            loader: 'img-loader',
                            options: {
                                plugins: [
                                    require('imagemin-gifsicle')({
                                        interlaced: true,
                                    }),
                                    require('imagemin-mozjpeg')({
                                        progressive: true,
                                        arithmetic: false,
                                    }),
                                    require('imagemin-optipng')({
                                        optimizationLevel: 5,
                                    }),
                                    require('imagemin-svgo')({
                                        plugins: [{ convertPathData: false }],
                                    }),
                                ],
                            },
                        },
                    ],
                },
            ],
        },
        plugins: [
            new CleanWebpackPlugin(configureCleanWebpack()),
            new MiniCssExtractPlugin({
                path: distPath,
                filename: path.join(
                    './resources/css',
                    '[name].[contenthash].css'
                ),
            }),
            new HtmlWebpackPlugin({
                template: 'templates/index.html',
                filename: 'index.html',
                inject: true,
            }),
            //new ImageminWebpWebpackPlugin(),
            // new WorkboxPlugin.GenerateSW(
            //     configureWorkbox()
            // ),
            new webpack.SourceMapDevToolPlugin({
                filename: '[name].js.map',
                exclude: [/(Ext)/],
            }),
            //new CompressionPlugin(configureCompression()),
            new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                reportFilename: 'report-modern.html',
            }),
        ],
    }),
];
