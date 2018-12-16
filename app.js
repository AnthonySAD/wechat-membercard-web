// const App = require('./utils/ald-stat.js').App;

App({
  globalData: {
    userInfo: null,
    apiUrl: 'http://card.test/api/',
    userInfo: wx.getStorageSync("userInfo"),
    header: {
      'content-type': 'application/json',
      'X-AUTH-TOKEN': wx.getStorageSync("token")
    },
  },
  onLaunch: function () {

  },
  
  checkResult: function(res){
    if (res.data.meta.code == 40102){
      this.login(function(){
        wx.switchTab({
          url: 'index',
        })
      })
      
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
              callback()
            }
          })
        }
      }
    })
  }

})