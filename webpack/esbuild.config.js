module.exports = {
    configureESBuildLoader() {
        return {
            test: /\.js$/,
            exclude: [
                /(ext-)/,
                // \\ for Windows, / for macOS and Linux
                /node_modules[\\/]core-js/,
                /node_modules[\\/]webpack/,
            ],
            loader: 'esbuild-loader',
            options: {
                target: 'es2020',
            },
        };
    },
};