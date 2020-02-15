//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    tempFilePaths: '', //显示上传的图片
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    user_name:'',
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad: function () {
    if (app.globalData.userInfo != 'None') {
      // console.log('HHH0')
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        // setTimeout(function () {
        //   console.log(res.userInfo)
          
        //   wx.reLaunch({
        //     url: '../peonyHomePage/peonyHomePage'
        //   })
        // }, 100) //自动跳转延时设置
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShow(){
    if(this.data.hasUserInfo){
      // setTimeout(function () {
      //   wx.reLaunch({
      //     url: '../peonyHomePage/peonyHomePage'
      //   })
      // }, 100) //自动跳转延时设置
    }

  },
  getUserInfo: function (e) {
    // console.log(e.detail)
    if (e.detail.userInfo){
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true,
      })
    }else{
      wx.showModal({
        title: '温馨提示',
        content: '为了您的更好体验，请登录您的昵称信息',
        success: function (res) {
          if (res.confirm) {
            // console.log('用户点击确定')
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })  
      app.globalData.userInfo == 'None'
    }
  },
  jumpPage:function(){
    if (app.globalData.userInfo == 'None'){
      wx.reLaunch({
        url: '../index/index'
      })
    }else{
      wx.reLaunch({
        url: '../peonyHomePage/peonyHomePage'
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '浑水摸鱼-西安瞰点'
    }
  }
})

