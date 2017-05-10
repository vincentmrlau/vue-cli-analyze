//merge 对比合并
var merge = require('webpack-merge')
var devEnv = require('./dev.env')


module.exports = merge(devEnv, {
  NODE_ENV: '"testing"'
})
