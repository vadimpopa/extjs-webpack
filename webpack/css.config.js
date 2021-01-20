const path = require('path');

module.exports = {
    configureAppCssLoaders() {
        return [
            {
                test: /\.((c|sa|sc)ss)$/i,
                exclude: [/ext/],
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
                test: /\.(png|jpe?g|gif|webp)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[contenthash].[ext]',
                            publicPath(url) {
                                const fileName = path.basename(url);
                                return `/resources/images/${fileName}`;
                            },
                        },
                    },
                ],
            },
        ];
    },
    configureExtCssLoaders() {
        return [
            {
                test: /\.(css)$/,
                include: [/ext/],
                use: [
                    'style-loader',
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
                            name: '[name].[ext]',
                            publicPath: (url, resourcePath, context) => {
                                // `resourcePath` is original absolute path to asset,
                                // /Users/{user}}/Documents/App/ext/....

                                // `context` is directory where stored asset (`rootContext`) or `context` option,
                                // /Users/{user}/Documents/App
                                const relativePath = path.relative(
                                    context,
                                    resourcePath
                                );
                                return `/${relativePath}`;
                            },
                        },
                    },
                ],
            },
        ];
    },
};
