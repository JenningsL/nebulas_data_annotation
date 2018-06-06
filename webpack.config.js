var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var autoprefixer = require('autoprefixer');
var pxtorem = require('postcss-pxtorem');
var debug = process.env.NODE_ENV !== 'production';
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

var plugins, entry, publicPath = '/';

module.exports = {
  stats: {
    warnings: false
  },
  entry: {
    index: './src/index.js',
    vendor: ['react', 'react-dom', 'react-router']
  },
  devServer: {
    inline: true,
    open: true,
    port: 8000,
    compress: true,
    host: '127.0.0.1',
    progress: true,
    historyApiFallback: true,
    contentBase: "./",
    https: false,
    proxy: false
  },
  // devtool: 'source-map',
  output: {
    path: __dirname + '/build/',
    publicPath,
    filename: '[name].[hash].js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: "[name].css",
        chunkFilename: "[id].css"
    }),
    new HtmlWebpackPlugin({
      template: __dirname + '/src/index.html',
      filename: 'index.html',
      inject: 'body',
      minify: {collapseWhitespace: true},
      chunks: ['vendor', 'index', 'manifest'],
    }),
    new CopyWebpackPlugin([
      {from: 'thirdparty/*', to: './[name].[ext]'},
      {from: 'static/images/*.ico', to: './[name].[ext]'},
    ])
  ],
  optimization: {
    runtimeChunk: {
        name: "manifest"
    },
    splitChunks: {
        cacheGroups: {
            commons: {
                test: /[\\/]node_modules[\\/]/,
                name: "vendor",
                chunks: "all"
            }
        }
    }
  },
  resolveLoader: {
      moduleExtensions: ['-loader']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        exclude: /(node_modules|bower_components)/
      },
      { test: /\.(jpg|png|gif)$/, loader: 'url-loader?limit=10000&publicPath='+publicPath }, // 小于10kb的图片以base64编码加载
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      },
      // { test: /\.less|\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'], include: path.resolve(__dirname, 'src') },
      {
        test: /\.less$/,
        use: [{
            loader: "style-loader" // creates style nodes from JS strings
        }, {
            loader: "css-loader" // translates CSS into CommonJS
        }, {
            loader: "less-loader", // compiles Less to CSS
            options: { javascriptEnabled: true }
        }],
        // include: path.resolve(__dirname, 'node_modules'),
      },
      { test: /\.(ttf|eot|woff(2)?)(\?[a-z0-9=&.]+)?$/, loader : 'file-loader' }
    ]
  },
  mode: process.env.NODE_ENV // production, development
};
