var path = require('path')
var utils = require('./utils')

var projectRoot = path.resolve(__dirname, '../')
const vuxLoader = require('vux-loader')

var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

let webpackConfig = {
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      // {
      //   test: /\.(js|es6|vue)$/,
      //   loader: 'eslint-loader',
      //   enforce: 'pre',
      //   include: [resolve('src'), resolve('test')],
      //   options: {
      //     formatter: require('eslint-friendly-formatter')
      //   }
      // },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.(js|es6)$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_moudules/vux/src')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      // 配置webfonts-loader
      {
        test: /\.font\.(js|json)$/,
        loader: 'vue-style-loader!css-loader!webfonts-loader'
      }
    ]
  }
}

module.exports = vuxLoader.merge(webpackConfig, {
  plugins: [
    'vux-ui',
    'progress-bar',
    'duplicate-style',
    {
      name: 'less-theme',
      path: 'src/styles/theme.less'
    },
    // 统一引入less变量
    {
      name: 'style-parser',
      fn: function (source) {
        let filePath = this.resourcePath.replace(projectRoot, '')
        switch (true) {
          // 仅在pages和components中的vue中引入_variables.scss
          case /^\\src\\(pages|components)\\/.test(filePath):
            return '@import "~vux/../../src/styles/_variables.scss";\n' + source
            break
          default:
            return source
        }
      }
    }
  ]
})
