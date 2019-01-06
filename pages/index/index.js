// const Page = require('../../utils/ald-stat.js').Page;
const app = getApp()

Page({
  data: {
    myCards:[],
    searched: true,
  },

  onLoad: function () {
    let thisPage = this
    wx.showLoading()
    if (!wx.getStorageSync("token")){
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
              }
            })
          }
        }
      })
    }else{
      thisPage.getMyCards()
    }
  },
  getMyCards(){
    let thisPage = this
    wx.request({
      url: app.globalData.apiUrl + 'card',
      header:app.globalData.header,
      success:res=>{
        if (res.data.meta.code == 20400){
          wx.hideLoading()
          wx.showToast({
            title: '请先添加会员卡',
            icon: 'none'
          })
          return;
        }
        if (!app.checkResult(res, thisPage.getMyCards)){
          return false
        }
        thisPage.setData({myCards: res.data.data})
        wx.hideLoading()
      }
    })
  },
  searchCard(event){
    var reg = new RegExp(event.detail.value, 'i')
    var shSucs = false
    var myCards = this.data.myCards
    if (!event.detail.value) {
      for (var i = 0; i < myCards.length; i++) {
        myCards[i].hide = false
      }
      this.setData({ myCards: myCards })
      this.setData({ searched: true })
      return;
    }

    for (var i = 0; i < myCards.length; i++){
      if (reg.test(myCards[i].card_info.name)){
        console.log(myCards[i].card_info.name)
        myCards[i].hide = false
        shSucs = true;
        continue;
      }
      if (reg.test(myCards[i].card_info.code)) {
        console.log(myCards[i].card_info.code)
        myCards[i].hide = false
        shSucs = true;
        continue;
      }
      myCards[i].hide = true
    }
    this.setData({ myCards: myCards})
    this.setData({ searched: shSucs})
  },
  addCard(event){
    app.goTo('addCard')
  },
  showCard(event){
    var key = event.currentTarget.dataset.index;
    var myCards = this.data.myCards
    if(key !== 0){
      var rank = myCards[0].rank + 1
      myCards[key].rank = rank
      this.requestCardClick(myCards[key].card_id, rank)
      myCards.unshift(myCards.splice(key, 1)[0])
      console.log(myCards)
      this.setData({myCards: myCards})
    }
    app.goTo('showCard', 'name=' + myCards[0].card_info.name + '&color=' + myCards[0].card_info.color + '&code=' + myCards[0].card_info.code + '&avatar=' + myCards[0].card_info.avatar + '&type=' + myCards[0].code_type + '&info=' + myCards[0].card_info.info)
  },
  requestCardClick(id, rank){
    wx.request({
      url: app.globalData.apiUrl + 'card/click',
      header: app.globalData.header,
      method: 'post',
      data:{
        card_id: id,
        rank: rank
      },
    })
  }
})
