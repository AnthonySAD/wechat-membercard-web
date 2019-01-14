// const Page = require('../../utils/ald-stat.js').Page;
const app = getApp()

Page({
  data: {
    myCards:[],
    searched: true,
    hideShareModalWrapper: true,
    hideShareModal: true,
    gotShareCard: '',
  },

  onLoad: function (option) {
    if(option.share_card){
      this.setData({ gotShareCard: option.share_card})
    }
    let thisPage = this
    wx.showLoading({
      title: '正在加载中...'
    })
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
  onShareAppMessage(res) {
    if (res.from === 'button') {
      this.setData({
        hideShareModalWrapper: true,
        hideShareModal: true,
        imageUrl: '/images/share_card.png'
      })
      return {
        title: '送你一张' + this.data.shareCardName + '会员卡，快来领取吧！',
        path: '/pages/index/index?share_card=' + this.data.shareCardToken,
        imageUrl: '/images/share_card.png'
      }
    }
    return {
      title: '快来使用这个小程序吧，太好用了！',
      path: '/pages/index/index',
    }
  },
  getMyCards(){
    let thisPage = this
    wx.request({
      url: app.globalData.apiUrl + 'card',
      header:app.globalData.header,
      success:res=>{
        if (res.data.meta.code == 20400 && !thisPage.data.gotShareCard){
          wx.hideLoading()
          wx.showModal({
            title: '点击右上角+号添加会员卡',
            content: '是否现在添加?',
            success(res) {
              if (res.confirm) {
                app.goTo('addCard')
              }
            }
          })
          return;
        }
        if (!app.checkResult(res, thisPage.getMyCards)){
          return false
        }
        thisPage.setData({myCards: res.data.data})
        if(thisPage.data.gotShareCard){
          thisPage.getShareCard()
          return;
        }
        wx.hideLoading()
      }
    })
  },

  getShareCard(){
    let thisPage = this
    wx.request({
      url: app.globalData.apiUrl + 'card/share',
      header: app.globalData.header,
      method: 'get',
      data:{
        card_token: this.data.gotShareCard
      },
      success(res){
        wx.hideLoading()
        thisPage.setData({gotShareCard: ''})
        if (res.data.meta.code == 20000){
          wx.showModal({
            title: '成功领取会员卡!',
            content: res.data.data.card_info.name,
            showCancel: false
          })
          let myCards = thisPage.data.myCards
          myCards.unshift(res.data.data)
          thisPage.setData({
            myCards: myCards
          })
          return;
        }
        if(res.data.meta.code == 20002){
          wx.showModal({
            title: '你已经拥有该会员卡了',
            content: '不要重复领取',
            showCancel: false
          })
          return;
        }
        if (res.data.meta.code == 40000) {
          wx.showModal({
            title: '该链接已失效',
            content: '无法领取该会员卡',
            showCancel: false
          })
          return;
        }
        if (res.data.meta.code == 20001) {
          wx.showModal({
            title: '会员卡已被用户删除',
            content: '无法领取该会员卡',
            showCancel: false
          })
          return;
        }
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
        myCards[i].hide = false
        shSucs = true;
        continue;
      }
      if (reg.test(myCards[i].card_info.code)) {
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
      this.setData({myCards: myCards})
    }
    app.goTo('showCard', 'name=' + myCards[0].card_info.name + '&color=' + myCards[0].card_info.color + '&code=' + myCards[0].card_info.code + '&avatar=' + myCards[0].card_info.avatar + '&type=' + myCards[0].card_info.code_type + '&info=' + myCards[0].card_info.info)
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
  },
  showCardOptions(event){
    this.data.selectedCard = this.data.myCards[event.currentTarget.dataset.index]
    this.data.selectedCard.index = event.currentTarget.dataset.index
    if (this.data.selectedCard.type == 0){
      this.showMyCardOption()
    }else{
    }
  },
  showMyCardOption(){
    let thisPage = this
    wx.showActionSheet({
      itemList: ['编辑', '删除'],
      success: function (res) {
        switch (res.tapIndex) {
          case 0:
            if (thisPage.data.selectedCard.type != 0){
              wx.showToast({
                title: '您不是这张会员卡的主人，无法编辑',
                icon: 'none'
              })
              return
            }
            var params = 'index=' + thisPage.data.selectedCard.index 
            + '&id=' + thisPage.data.selectedCard.card_id 
            + '&name=' + thisPage.data.selectedCard.card_info.name 
            + '&color=' + thisPage.data.selectedCard.card_info.color 
            + '&code=' + thisPage.data.selectedCard.card_info.code 
            + '&avatar=' + thisPage.data.selectedCard.card_info.avatar 
            + '&type=' + thisPage.data.selectedCard.card_info.code_type 
            + '&info=' + thisPage.data.selectedCard.card_info.info
            app.goTo('addCard', params)
            break;
          case 1:
            wx.showModal({
              title: '请确认是否删除卡片',
              content: thisPage.data.selectedCard.card_info.name,
              success(res){
                if(res.confirm){
                  thisPage.deleteSelectedCard()
                }
              }
            })
            break;
        }
      }
    })
  },

  deleteSelectedCard(){
    let thisPage = this
    wx.request({
      url: app.globalData.apiUrl + 'card',
      header: app.globalData.header,
      method: 'delete',
      data:{
        card_id: this.data.selectedCard.card_id
      },
      success: function(res){
        thisPage.data.myCards.splice(thisPage.data.selectedCard.index, 1)
        thisPage.setData({ myCards: thisPage.data.myCards})
        wx.showToast({
            title: '删除成功',
        })
      }
    })
  },
  showShareModal(event){
    let thisPage = this
    wx.showLoading({
      title: '正在加载中...'
    })
    let card = this.data.myCards[event.currentTarget.dataset.index]
    this.setData({
      hideShareModalWrapper: false,
      shareCardName: card.card_info.name,
    })
    wx.request({
      url: app.globalData.apiUrl + 'card/share',
      header: app.globalData.header,
      method: 'post',
      data: {
        card_id: card.card_id
      },
      success(res){
        wx.hideLoading()
        if(res.data.meta.code == 20000){
          thisPage.setData({
            hideShareModal: false,
            shareCardToken: res.data.data.card_token,
          })
        }else{
          thisPage.setData({ hideShareModalWrapper: true })
          wx.showToast({
            title: '无法分享该会员卡',
            icon: 'none'
          })
        }
      }
    })

  },

  hideShareModal(){
    this.setData({ hideShareModal: true, hideShareModalWrapper: true})
  }
})
