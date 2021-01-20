const settings = require('./settings.js');

module.exports = {
    configureBabelLoader(browserList) {
        return {
            test: /\.js$/,
            exclude: settings.babelLoaderConfig.exclude,
            use: {
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    sourceType: 'unambiguous',
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                modules: false,
                                corejs: {
                                    version: 3,
                                    proposals: true,
                                },
                                useBuiltIns: 'usage',
                                targets: {
                                    browsers: browserList,
                                },
                            },
                        ],
                    ],
                    plugins: [
                        '@babel/plugin-syntax-dynamic-import',
                        '@babel/plugin-transform-runtime',
                    ],
                },
            },
        };
    },
};
