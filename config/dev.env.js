var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"'
})

//merge 对比合并
//这里 prodEnv = {NODE_ENV: '"production"'}
//这里最后输出的是{NODE_ENV: '"development"'}
