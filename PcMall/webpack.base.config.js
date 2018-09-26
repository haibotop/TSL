const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const config = require('./webpack.config.js');

const webpackConfig = {
  entry: {
    main: './src/main',
  },
  output: {
    path: path.join(__dirname, './dist')
  },
  module: {
    rules: [
      // {
      //   test: /\.(js|es6|vue)$/,
      //   loader: 'eslint-loader',
      //   enforce: 'pre',
      //   options: {
      //     formatter: require('eslint-friendly-formatter')
      //   }
      // },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {

            less: ExtractTextPlugin.extract({
              use: ['css-loader?minimize', 'autoprefixer-loader', 'less-loader'],
              fallback: 'vue-style-loader'
            }),

            sass: ExtractTextPlugin.extract({
              use: ['css-loader?minimize', 'autoprefixer-loader', 'sass-loader'],
              fallback: 'vue-style-loader'
            }),

            // 配置sass-loader支持Compass（需要compass-mixins提供支持）
            scss: ExtractTextPlugin.extract({
              use: [
                'css-loader?minimize',
                'autoprefixer-loader',
                {
                  loader: 'sass-loader',
                  options: {
                    includePaths: [path.resolve('./node_modules', 'compass-mixins/lib')]
                  }
                }
              ],
              fallback: 'vue-style-loader'
            }),

            css: ExtractTextPlugin.extract({
              use: ['css-loader', 'autoprefixer-loader'],
              fallback: 'vue-style-loader'
            })
          }
        }
      },
      {
        test: /iview\/.*?js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.js|es6$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader?minimize', 'autoprefixer-loader'],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.less/,
        use: ExtractTextPlugin.extract({
          use: ['autoprefixer-loader', 'less-loader'],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.sass/,
        use: ExtractTextPlugin.extract({
          use: ['autoprefixer-loader', 'sass-loader'],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 100,
          name: `${config.assetsPath}/fonts/[name].[hash:7].[ext]`
        },
        exclude: /images?|img/
      },
      {
        test: /\.(gif|jpe?g|png|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: `${config.assetsPath}/img/[name].[hash:7].[ext]`
        },
        exclude: /fonts?/
      },
      {
        test: /\.(html|tpl)$/,
        loader: 'html-loader'
      },
      // 配置webfonts-loader
      {
        test: /\.font\.(js|json)$/,
        loader: 'vue-style-loader!css-loader!webfonts-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      'vue': 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, 'src'),
      'styles': path.resolve(__dirname, 'src/styles')
    }
  }
}
const vuxLoader = require('vux-loader')
module.exports = vuxLoader.merge(webpackConfig, {
  plugins: ['vux-ui']
})
