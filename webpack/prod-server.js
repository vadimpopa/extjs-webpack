const path = require('path');
const settings = require('./settings.js');

module.exports = {
    mode: 'production',
    devServer: {
        contentBase: path.resolve(__dirname, settings.paths.dist.base),
        compress: true,
        port: 9000,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        // proxy: {
        //     'api': {
        //         // Add your proxy here in case you need
        //         target: '',
        //         ws: true,
        //         secure: false,
        //         cookieDomainRewrite: 'localhost',
        //         debug: true,
        //     },
        // },
    },
};
