const { defineConfig } = require('@vue/cli-service')
const { VantResolver } = require('unplugin-vue-components/resolvers')
const ComponentsPlugin = require('unplugin-vue-components/webpack')
const NodePolyfillWebpackPlugin = require('node-polyfill-webpack-plugin')
console.log(ComponentsPlugin);
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new NodePolyfillWebpackPlugin(),
      ComponentsPlugin.default({
        resolvers: [VantResolver()]
      })
    ]
  }
})
