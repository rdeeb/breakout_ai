var path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: "development",
    entry: "./src/js/game.js",
    output: {
        path: path.resolve(__dirname, './dist/js'),
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.es6']
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    },
    plugins: [
        new HtmlWebpackPlugin({
            path: path.resolve(__dirname, './dist'),
            filename: 'index.html',
            template: './src/index.html',
            appMountId: 'breakout-example'
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
};
