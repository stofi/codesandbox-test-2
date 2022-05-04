const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    context: resolve('./'),
    entry: {
        home: resolve('./src/main.ts')
    },
    output: {
        filename: 'static/[name].[contenthash].js',
        path: resolve('dist')
    },
    module: {
        rules: [
            // TS
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },

            // JS
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },

            // CSS
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader'
                ]
            },

            // Shaders
            {
                test: /\.(glsl|frag|vert)$/,
                exclude: /node_modules/,
                use: ['raw-loader']
            }
        ]
    },
    // resolve: {
    //   src: resolve("./src")
    // },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'webpack playground',
            filename: 'index.html',
            template: 'src/index.html',
            chunks: 'all'
        }),
        new MiniCssExtractPlugin()
    ]
}
