const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  publicPath: '/',
  outputDir: 'docs',
   chainWebpack: config => {
    config.plugins.delete('prefetch');
    config.plugins.delete('preload');
  }
})