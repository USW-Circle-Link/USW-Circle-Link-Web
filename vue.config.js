const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  publicPath: process.env.NODE_ENV === 'production' 
    ? '/USW-Circle-Link-Web/' // ⬅️ 프로덕션 환경에서는 저장소 경로를 사용
    : '/'
})
