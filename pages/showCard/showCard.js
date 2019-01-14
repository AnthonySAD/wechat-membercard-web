const Page = require('../../utils/ald-stat.js').Page;

import codeImage from '../../utils/code/index.js'
const app = getApp()
Page({
  data:{
    bgColor:'#000000',
    type: '',
    code: '',
    info: '',
  },
  onLoad: function(option){
    let thisPage = this
    this.showCard(option)
    wx.getScreenBrightness({
      success: function(res){
        thisPage.data.originBrightness = res.value
        thisPage.data.currentBrightness = res.value
      }
    })
  },
  onUnload: function(){
    wx.setScreenBrightness({
      value: this.data.originBrightness
    })
  },
  showCard: function(card){
    this.setData({ 
      bgColor: card.color, 
      code: card.code, 
      info: card.info,
      type: card.type,
    })
    wx.setNavigationBarColor({ frontColor: '#ffffff', backgroundColor: card.color })
    wx.setNavigationBarTitle({ title: card.name})
    if(card.type == 0){
      codeImage.barcode('code-image', card.code, 680, 200);
    }else{
      codeImage.qrcode('code-image', card.code, 580, 580);
    }
  },
  moreDark: function(){
    var bright = Number(this.data.currentBrightness)
    if(bright <= 0.15 ){
      bright = 0
      wx.showToast({
        title: '已经最暗了',
        icon: 'none'
      })
    }else{
      bright -= 0.15
    }
    this.data.currentBrightness = bright
    wx.setScreenBrightness({
      value: bright
    })
  },
  moreBright: function () {
    var bright = Number(this.data.currentBrightness)
    if (bright >= 0.85) {
      bright = 1
      wx.showToast({
        title: '已经最亮了',
        icon: 'none'
      })
    } else {
      bright += 0.15
    }
    this.data.currentBrightness = bright
    wx.setScreenBrightness({
      value: bright
    })
  },
})