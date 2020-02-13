//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '进入',
    userInfo: {},
    tempFilePaths: '', //显示上传的图片
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // //获取相机功能 上传图片
  // chooseimage: function() {
  //   var _this = this;
  //   wx.chooseImage({
  //     count: 1, // 默认9
  //     sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
  //     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
  //     success: function(res) {
  //       // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
  //       console.log(res.tempFilePaths);
  //       _this.setData({
  //         tempFilePaths: res.tempFilePaths
  //       })
  //     }
  //   })
  // },
  onLoad: function () {
    if (app.globalData.userInfo) {
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
        setTimeout(function () {
          console.log(res.userInfo)
          
          wx.reLaunch({
            url: '../peonyHomePage/peonyHomePage'
          })
        }, 100) //自动跳转延时设置
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
      setTimeout(function () {
        wx.reLaunch({
          url: '../peonyHomePage/peonyHomePage'
        })
      }, 100) //自动跳转延时设置
    }

  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })

  },
  jumpPage:function(){
    console.log('跳转成功')
    wx.reLaunch({
      url: '../peonyHomePage/peonyHomePage'
      // url: '../analyse/analyse'
    })
  }
  
})

