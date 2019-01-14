const Page = require('../../utils/ald-stat.js').Page;

Page({

  data: {
  },

  copy: function(event){
    wx.setClipboardData({
      data: event.currentTarget.dataset.value,
      success(){
        wx.showToast({
          title: '复制成功',
        })
      }
    })
  }
})