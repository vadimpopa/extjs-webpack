const path = require('path');
const settings = require('./settings.js');

module.exports = {
    mode: 'production',
    devServer: {
        host: settings.devServerConfig.host(),
        static: [
            // Simple example
            path.resolve(__dirname, settings.paths.dist.base),
        ],
        port: 9000,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        // Use it for proxy
        // proxy: {
        //     '/path/api': {
        //         target: '',
        //         ws: true,
        //         secure: false,
        //         cookieDomainRewrite: 'localhost',
        //         debug: true,
        //     },
        // },
    },
};
