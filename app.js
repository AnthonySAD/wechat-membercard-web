const App = require('./utils/ald-stat.js').App;

App({
  globalData: {
    userInfo: null,
    apiUrl: 'https://membercard.adshen.top/api/',
    userInfo: wx.getStorageSync("userInfo"),
    header: {
      'content-type': 'application/json',
      'X-AUTH-TOKEN': wx.getStorageSync('token'),
    },
  },
  shortPath:{
    index: '/pages/index/index',
    addCard: '/pages/addCard/addCard',
    showCard: '/pages/showCard/showCard',
  },

  goTo: function(path, param){
    path = this.shortPath[path]
    if(param){
      path += '?' + param
    }
    wx.navigateTo({
      url: path,
    })
  },

  onLaunch: function () {
  },
  
  checkResult: function(res,callback){
    if (res.data.meta.code == 40102){
      this.login(callback)
    }
    return true
  },

  login: function(callback){
    let app = this
    wx.login({
      success(res) {
        if (res.code) {
          wx.request({
            method: 'post',
            url: app.globalData.apiUrl + 'login',
            data: {
              code: res.code
            },
            success: res => {
              wx.setStorageSync("token", res.data.data.auth_token)
              app.globalData.header['X-AUTH-TOKEN'] = res.data.data.auth_token
              callback()
            }
          })
        }
      }
    })
  }

})