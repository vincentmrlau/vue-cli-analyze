//utils 里面配置上了loader等
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

//入口文件中加入 热加载依赖代码
// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      //设置全局变量
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    // 只重载当前模块
    new webpack.HotModuleReplacementPlugin(),
    // 页面报错不阻塞
    new webpack.NoEmitOnErrorsPlugin(),
    //把生成后的代码注入index.html中
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',// 生成的文件名
      template: 'index.html',// 入口模板
      inject: true // 注入到body的尾部
    }),
    //友好的错误提示
    new FriendlyErrorsPlugin()
  ]
})
