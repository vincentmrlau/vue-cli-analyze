//check-versions,npm 和node 的版本检查
//node >4.0.0 ; npm >3.0.0
require('./check-versions')()

var config = require('../config')
//process.env: 指向当前shell的环境变量，我的shell操作没有设置这个，应该没有NODE_ENV
console.log(process.env.NODE_ENV);
if (!process.env.NODE_ENV) {
  //设置process.env.NODE_ENV = "development"
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

//opn: node 打开应用的，这里应该是打开浏览器并跳转到指定指定路径
var opn = require('opn')
//path: 管理路径的东东
var path = require('path')
//express: 答案：略（我也不知道怎么解释）
var express = require('express')
//webpack: 略
var webpack = require('webpack')
//http-proxy-middleware: 代理中间件
var proxyMiddleware = require('http-proxy-middleware')
//这里的process.env.NODE_ENV 是 "development",所以用的应该是webpack.dev.conf
var webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf')

// 如果没有指定端口，就使用：config.dev 设置的是 8080
// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
//是否自动打开浏览器  已经设置为 true
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser

//proxyTable ：请求配置
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

//启用一个express
var app = express()
//启用 webpack,使用设定的配置
var compiler = webpack(webpackConfig)

//这个是个中间件，把编译好的文件放到内存中
//http://webpack.github.io/docs/webpack-dev-middleware.html
var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,//绑定中间件路径到服务器中
  quiet: true //显示console.log
})

//热重载中间件
//https://www.npmjs.com/package/webpack-hot-middleware
var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})

//html-webpack-plugin-after-emit : html-webpack-plugin生产文件之后发生的事件
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

//把proxyTable中的配置挂到express上
// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

//处理html5 history API,
// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

//从配置表中看是：/static
// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
//额，这个 waitUntilValid 方法我找不到，求大神指导，应该是可用的时候调用吧
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

//开启一起
var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
