const Page = require('../../utils/ald-stat.js').Page;

const app = getApp()
Page({
  data:{
    bgColor: '#FF4500',
    cardShowType: '0',
    cardName: '',
    cardCode: '',
    cardTypeId: '0',
    cardInfo: '0',
    cardAvatar: '',
    colorList:[
      '#FF4500',
      '#8470FF',
      '#9400D3',
      '#32CD32',
      '#FFA500',
      '#1C1C1C',
    ],
  },
  onLoad: function(){
    wx.setNavigationBarColor({ frontColor: '#ffffff', backgroundColor: '#FF4500'})
  },
  cardName: function (event) {
    this.setData({cardName: event.detail.value})
  },
  cardCode: function (event) {
    if (/[^0-9a-zA-Z]/.test(event.detail.value)){
      wx.showToast({
        title: '卡号只能输入字母或数字',
        icon: 'none',
      })
      this.setData({ cardCode: ''})
      return
    }
    this.setData({cardCode: event.detail.value})
  },
  cardInfo: function (event) {
    this.setData({ cardInfo: event.detail.value })
  },
  cardShowType: function(event){
    this.setData({cardShowType:event.detail.value})
  },
  changeColor: function(event){
    wx.setNavigationBarColor({ frontColor: '#ffffff', backgroundColor: event.target.dataset.color})
    this.setData({ bgColor: event.target.dataset.color})
  },
  addCard: function(){
    if (this.data.cardName.length < 2){
      wx.showToast({
        title: '会员卡名称不能少于2个字符',
        icon: 'none',
      })
      return;
    }
    if (this.data.cardCode.length < 4) {
      wx.showToast({
        title: '卡号不能少于4个字符',
        icon: 'none',
      })
      return;
    }
    let thisPage = this
    wx.showLoading()
    let cardInfo = {
      'name': this.data.cardName,
      'code': this.data.cardCode,
      'info': this.data.cardInfo,
      'color': this.data.bgColor,
      'type_id': this.data.cardTypeId,
      'code_type': this.data.cardShowType,
    }
    wx.request({
      header: app.globalData.header,
      url: app.globalData.apiUrl + 'card',
      method: 'post',
      data: cardInfo,
      success: function(res){
        app.checkResult(res, thisPage.addCard)
        wx.hideLoading()
        if(res.data.meta.code == 20000){
          let homePage = getCurrentPages()[0];
          let myCards = homePage.data.myCards
          myCards.unshift(res.data.data)
          homePage.setData({
            myCards: myCards
          })
          wx.navigateBack()
        }else{
          wx.showToast({
            title: '数据填写错误,添加失败',
            icon: 'none',
          })
        }
      }
    })
  },
  scanCode :function(){
    let thisPage = this
    wx.scanCode({
      scanType: ['barCode', 'qrCode', 'datamatrix'],
      success: function (res) {
        thisPage.setData({cardCode: res.result})
      },
      fail: function(){
        wx.showToast({
          title: '扫码失败',
          icon: 'none',
        })
      }
    })
  }
})