const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const fs = require('fs');
const config = require('./webpack.config.js');

// add hot-reload related code to entry chunks
Object.keys(webpackBaseConfig.entry).forEach(function (name) {
  webpackBaseConfig.entry[name] = ['./dev-client'].concat(webpackBaseConfig.entry[name])
});

// fs.open('./src/config/env.js', 'w', function (err, fd) {
//   const buf = 'export default "development";';
//   fs.write(fd, buf, 0, buf.length, 0, function (err, written, buffer) {
//   });
// });

module.exports = merge(webpackBaseConfig, {
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  output: {
    publicPath: '/',
    filename: `${config.assetsPath}/js/[name].js`,
    chunkFilename: `${config.assetsPath}/js/[name].chunk.js`
  },
  plugins: [
    new ExtractTextPlugin({
      filename: `${config.assetsPath}/css/[name].css`,
      allChunks: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      filename: `${config.assetsPath}/js/vendors.js`
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/templates/index.ejs',
      inject: false
    }),
    new FriendlyErrorsPlugin()
  ]
});
