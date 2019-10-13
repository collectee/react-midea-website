let webpack = require ('webpack');
let path = require ('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode: 'production',
    entry: {
        media:path.resolve(__dirname,'../src/index.jsx'),
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
    optimization: {
        runtimeChunk: true,
        splitChunks: {
            cacheGroups: {
                vendor: {
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    maxAsyncRequests: 5,
                    priority: 10,
                    enforce: true
                }
            }
        }
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
            // {
            //     test:/\.(svg)$/i,
            //     use:[{
            //         loader: "file-loader",
            //         options: {
            //             outputPath:'dist/image/'
            //         }
            //     }]
            // },
            {
                test:/\.(jpg|png|jpeg|svg)$/i,
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
            filename:'index.html',
            chunks:['media']
        }),
        // new HtmlWebpackPlugin({
        //     template:path.resolve(__dirname,'../template/playVideo.html'),
        //     filename:'playVideo.html',
        //     chunks:['video']
        // })
    ]
    //插件
};