let webpack = require ('webpack');
let path = require ('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode: 'development',
    entry: {
        main:path.resolve(__dirname,'../src/index.jsx'),
        // video:path.resolve(__dirname,'../template/video.js')
    }, //入口文件
    output: {
        // path: './dist',
        path: path.resolve(__dirname,'../dist'), //输出位置
        filename: '[name]-build.js' //输入文件
    },
    devServer: {
        contentBase: path.resolve(__dirname, "../dist"),
        compress: true,
        port: 9000
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel-loader",
                options: { presets: ["@babel/env"] }
            },
            {
                test:/\.(scss|css)/i,
                use:['style-loader','css-loader','sass-loader']
            },
            {
                test:/\.(svg)$/i,
                use:[{
                    loader: "file-loader",
                    options: {
                        outputPath:'dist/image/'
                    }
                }]
            },
            {
                test:/\.(jpg|png|jpeg)/i,
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            },
            {
                test:/\.(woff|woff2|eot|ttf|otf)$/,
                use: ['file-loader']
            }
        ]
    },
    resolve: { extensions: ["*", ".js", ".jsx"] },
    plugins: [
        new HtmlWebpackPlugin({
            template:path.resolve(__dirname,'../src/index.html'),
            chunks:['main']
        }),
        // new HtmlWebpackPlugin({
        //     template:path.resolve(__dirname,'../template/playVideo.html'),
        //     filename:'playVideo.html',
        //     chunks:['video']
        // })
    ]
    //插件
};