const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

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
                test: /\.css$/i,
                use: [
                    // 2. style tag add the js style in html head
                    'style-loader',
                    // 1. css -> commonjs module load in js
                    'css-loader'
                ]
            },
            {
                test: /\.png$/,
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
        new FaviconsWebpackPlugin('./src/images/favicon.ico')
    ],
    mode: 'development',
    // mode: 'production'

    // devServer
    // npx webpack-dev-server
    devServer: {
        static: resolve(__dirname, 'build'),
        compress: true,
        port: 50000,
        open: true
    }
}