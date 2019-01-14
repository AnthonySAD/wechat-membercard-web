const Page = require('../../utils/ald-stat.js').Page;

const app = getApp()
Page({
  data:{
    bgColor: '#FF4500',
    cardId: '',
    cardShowType: '0',
    cardName: '',
    cardCode: '',
    cardTypeId: '0',
    cardInfo: '',
    cardAvatar: '',
    colorList:[
      '#FF4500',
      '#8470FF',
      '#9400D3',
      '#32CD32',
      '#FFA500',
      '#1C1C1C',
    ],
    isLoading: false,
  },
  onLoad: function(option){
    if(option.id){
      this.setData({
        cardIndex: option.index,
        bgColor: option.color,
        cardId: option.id,
        cardName: option.name,
        cardCode: option.code,
        cardShowType: option.type,
        cardAvatar: option.avatar,
        cardInfo: option.info,
      })
      wx.setNavigationBarTitle({ title: '编辑' })
      wx.setNavigationBarColor({ frontColor: '#ffffff', backgroundColor: option.color })
    }else{
      wx.setNavigationBarTitle({ title: '添加' })
      wx.setNavigationBarColor({ frontColor: '#ffffff', backgroundColor: '#FF4500' })
    }
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
  saveCard: function(){
    if(this.data.isLoading == true){
      wx.showToast({
        title: '正在拼命加载中,请稍后...',
        icon: 'none',
      })
      return;
    }
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
    this.data.isLoading = true;
    if(this.data.cardId === ''){
      this.addCard()
    }else{
      this.updateCard()
    }
  },
  addCard(){
    let thisPage = this
    wx.showLoading({
      title: '正在加载中...'
    })
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
      success: function (res) {
        app.checkResult(res, thisPage.addCard)
        wx.hideLoading()
        if (res.data.meta.code == 20000) {
          let homePage = getCurrentPages()[0];
          let myCards = homePage.data.myCards
          myCards.unshift(res.data.data)
          homePage.setData({
            myCards: myCards
          })
          thisPage.data.isLoading = false
          wx.navigateBack()
          wx.showToast({
            title: '添加成功',
          })
        } else {
          thisPage.data.isLoading = false
          wx.showToast({
            title: '数据填写错误,添加失败',
            icon: 'none',
          })
        }
      }
    })
  },
  updateCard(){
    let thisPage = this
    wx.showLoading({
      title: '正在加载中...'
    })
    let cardInfo = {
      'card_id': this.data.cardId,
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
      method: 'put',
      data: cardInfo,
      success: function (res) {
        app.checkResult(res, thisPage.updateCard)
        wx.hideLoading()
        if (res.data.meta.code == 20000) {
          let homePage = getCurrentPages()[0];
          let myCards = homePage.data.myCards
          myCards[thisPage.data.cardIndex].card_info.code = res.data.data.code
          myCards[thisPage.data.cardIndex].card_info.code_type = res.data.data.code_type
          myCards[thisPage.data.cardIndex].card_info.color = res.data.data.color
          myCards[thisPage.data.cardIndex].card_info.info = res.data.data.info
          myCards[thisPage.data.cardIndex].card_info.name = res.data.data.name
          homePage.setData({
            myCards: myCards
          })
          thisPage.data.isLoading = false
          wx.navigateBack()
          wx.showToast({
            title: '修改成功',
          })
        } else {
          thisPage.data.isLoading = false
          wx.showToast({
            title: '数据填写错误,修改失败',
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
          title: '扫码失败,请先授权',
          icon: 'none',
        })
      }
    })
  }
})