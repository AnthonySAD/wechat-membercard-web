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
    this.showCard(option)
  },
  showCard: function(card){
    this.setData({ 
      bgColor: card.color, 
      code: card.code, 
      info: card.info ? '备注: ' + card.info : '',
      type: card.type,
    })
    wx.setNavigationBarColor({ frontColor: '#ffffff', backgroundColor: card.color })
    wx.setNavigationBarTitle({ title: card.name})
    if(card.type == 0){
      codeImage.barcode('code-image', card.code, 680, 200);
    }else{
      codeImage.qrcode('code-image', card.code, 580, 580);
    }
  }
})