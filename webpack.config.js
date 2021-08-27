//////////////////////////////////////////////////////////////////////
// webpack config to bundle js
// single bundle.js essentially necessary for IPFS
const path = require('path')

module.exports = {
    entry: './assets/scripts/dist/index.js',
    mode: 'production',
    output: {
        path: path.resolve(__dirname, './assets/scripts/dist'),
        filename: 'bundle.js',
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './assets/scripts/dist'),
            '@serverless': path.resolve(__dirname, './functions/lib'),
        },
    },
    devtool: 'source-map',
}
