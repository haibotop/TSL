const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const ReplacePlugin = require('replace-bundle-webpack-plugin');
const fs = require('fs');
const config = require('./webpack.config.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');


// fs.open('./src/config/env.js', 'w', function (err, fd) {
//   const buf = 'export default "production";';
//   fs.write(fd, buf, 0, buf.length, 0, function (err, written, buffer) {
//   });
// });

module.exports = merge(webpackBaseConfig, {
  output: {
    // 使用相对路径
    publicPath: '',
    filename: `${config.assetsPath}/js/[name].[hash:7].js`,
    chunkFilename: `${config.assetsPath}/js/[name].[hash:7].chunk.js`
  },
  module: {
    rules: [
      // 配置webpack-strip-block，用以去掉开发代码块
      {
        test: /\.(js|es6|vue)$/,
        enforce: 'pre',
        exclude: /node_modules|bower_components|\.spec\.js/,
        use: [{
          loader: 'webpack-strip-block'
        }]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    // 使用相对路径
    new ReplacePlugin([
      // 在打包后替换css中url()的static/目录到../相对目录
      {
        partten: /url\(\/?static\//g,
        replacement: () => {
          return 'url(../'
        }
      },
      // 在打包后替换/static/目录到static/相对目录（for webfonts-loader）
      {
        partten: /\/static\//g,
        replacement: () => {
          return 'static/'
        }
      }
    ]),
    new ExtractTextPlugin({
      filename: `${config.assetsPath}/css/[name].[hash:7].css`,
      allChunks: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      filename: `${config.assetsPath}/js/vendors.[hash:7].js`
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        // 移除console.*
        drop_console: true
      },
      sourceMap: true
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/templates/index.ejs',
      inject: false
    }),
    // 把静态文件的static文件夹除了.js文件全部原封复制过去static
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'static'),
        to: 'static',
      }
    ])
  ]
});
