import Vue from 'vue';

module.exports = {
  httpURL: Vue.prototype.$api_url,
  // httpURL: "http://114.115.217.252:8001/HighMallServer",
  testURL: "http://114.115.217.252:8001/HighMallServer",
  // testURL: "https://api.holdsoft.cn/mall",
  
  // 临时测试token和guid,发行的时候记得注释
  // token:'cPNZscDDUdulXKiw',
  // guid:'9125ce8d751f465aac9d555bdb305dcf',
  token:uni.getStorageSync('userInfo').token,
  guid:uni.getStorageSync('userInfo').guid,
  // guid:'',
}