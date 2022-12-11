const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')
const AppManifestPlugin = require('webpack-web-app-manifest-plugin')

module.exports = {
    entry: {
        app: './src/js/index.js'
    },
    output: {
        filename: 'js/built.js',
        path: resolve(__dirname, 'build')
    },
    // loader config
    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: "pre",
                use: ["source-map-loader"],
            },
            {
                test: /\.css$/i,
                use: [
                    // 2. style tag add the js style in html head
                    'style-loader',
                    // 1. css -> commonjs module load in js
                    'css-loader'
                ]
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    },
    // plugin config
    plugins: [
        // html-webpack-plugin
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new FaviconsWebpackPlugin({
            logo: './src/images/favicon.ico',
            cache: true
        }),
        new WorkboxPlugin.GenerateSW({
            clientsClaim: true,
            skipWaiting: true,
            maximumFileSizeToCacheInBytes: 4194304
        })
    ],
    mode: 'development',
    // mode: 'production',

    // devServer
    // npx webpack-dev-server
    devServer: {
        static: resolve(__dirname, 'build'),
        compress: true,
        port: 50000,
        open: true
    }
}