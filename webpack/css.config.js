const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    configureCssLoaders() {
        return [
            {
                test: /\.((c|sa|sc)ss)$/i,
                exclude: [/ext\/build/],
                use: [
                    // fallback to style-loader in development
                    process.env.NODE_ENV !== 'production'
                        ? 'style-loader'
                        : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                            importLoaders: 1,
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
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
            {
                test: /\.(css)$/,
                include: [/ext/],
                use: [
                    // fallback to style-loader in development
                    process.env.NODE_ENV !== 'production'
                        ? 'style-loader'
                        : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            url: true,
                        },
                    },
                ],
            },
            {
                test: /\.(woff|woff2|svg|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'resources/fonts/[name].[contenthash][ext]',
                    publicPath: '../../',
                },
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'resources/images/[name].[contenthash][ext]',
                    publicPath: '../../',
                },
            },
        ];
    },
};
