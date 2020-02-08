//app.js
App({
  onLaunch: function() {
    var that = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  
    // 登录
    wx.login({
      success: res => {
        // console.log(res)
        that.globalData.codeId = res.code;
        // console.log('登录')
        // console.log(that.globalData)
        //console.log(res);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    //正常登陆
    // 获取用户信息
    wx.getSetting({
      success: res => {
        // console.debug('验证')
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // console.log(res.userInfo)
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    //获取设备信息
    wx.getSystemInfo({
      success(res){
        // console.log(res);
      }
    })
  },
  globalData: {
    userInfo: null,
    codeId: '',
    // url: 'http://127.0.0.1:5000',
    url: 'https://hunshuimoyu.picp.vip',//服务器地址
    peonyResultInfo: {},//从服务器获取的牡丹花信息
    uploadImg:'',
    peonyLocation:'', //存储用户地理位置信息
    desciption:"", //用户地理信息简短描述
    latitude:'', //用户所在经纬度
    longitude:'',
  }
})