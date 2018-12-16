// const Page = require('../../utils/ald-stat.js').Page;
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    test: [
            {
              name : '会员卡',
              code : 123456,
            },
            {
              name: '会员卡',
              code: 123456,
            }
          ],
    myCards:[],
  },

  onLoad: function () {
    let thisPage = this
    wx.showLoading()
    if (!wx.getStorageSync("token")){
      console.log('弄token')
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
                thisPage.getMyCards()
                wx.hideLoading()
              }
            })
          }
        }
      })
    }else{
      this.getMyCards()
    }
  },
  getMyCards(){
    wx.request({
      url: app.globalData.apiUrl + 'card',
      header:app.globalData.header,
      success:res=>{
        if(!app.checkResult(res)){
          return false
        }
        console.log(res.data.data)
        wx.setdata
        wx.hideLoading()
      }
    })
  }
})
