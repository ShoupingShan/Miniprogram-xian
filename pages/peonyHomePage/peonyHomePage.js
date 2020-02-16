// pages/peonyIndex/peonyIndex.js
//获取应用实例
const app = getApp();
var amapFile = require('../../libs/amap-wx.js');
// var qqmap = require('../../utils/qqmap-wx-jssdk.min.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    judgeNetWork: true, //判断有误网络
    userInfo: {},
    isShow: true,
    hasUserInfo: false,
    tempFilePath: '../../images/camera.png',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  //获取相机功能 上传图片
  chooseimage() {
    var _this = this;
    var requestTask;
    var timeId;
    var uploadId;
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], // 可以指定时原图还是压缩图,默认两者都有
      sourceTYpe: ['album', 'camera'], //可以指定来源是相册还是相机，默认两者都有
      success: function(res) {
        // 将生成的本地图片路径保存先保存起来，取数组的第一个
        var tempFilePath = res.tempFilePaths[0];
        // 将生成的本地图片路径保存在全局的变量uploadImg中
        app.globalData.uploadImg = tempFilePath;
        _this.setData({
          // 存入data里面
          tempFilePath: tempFilePath,
          isShow: false,
        })
        wx.getNetworkType({
          success: function(res) {
            if (res.networkType == "none") {
              _this.setData({
                tempFilePath: '../../images/camera.png',
                isShow: true,
                judgeNetWork: false,
              })
            } else {
              _this.setData({
                judgeNetWork: true,
                // isShow: false,
                tempFilePath: tempFilePath,
              })
              //上传服务器地址进行识别   
              timeId = setTimeout(function(){
                requestTask = wx.uploadFile({
                  url: app.globalData.url + '/classification',
                  filePath: tempFilePath,
                  header: {
                    "Content-Type": "multipart/form-data",
                  },
                  name: 'image',
                  formData: {
                    "Content-Type": "multipart/form-data",
                    userId: '111',
                    userName: app.globalData.userInfo.nickName,
                    image: tempFilePath,
                    location: (app.globalData.peonyLocation ? app.globalData.peonyLocation:'')
                  },
                  success: function(res) {
                    if (JSON.parse(res.data).code == "1000") {
                      app.globalData.peonyResultInfo = res.data;
                      
                      //初始化数据页面跳转时
                      wx.navigateTo({
                        url: '../peonyResult/peonyResult'
                      })
                      setTimeout(function () {
                        _this.setData({
                          isShow: true,
                          tempFilePath: '../../images/camera.png',
                        })
                      }, 1000);
                      
                    } else {
                      if (JSON.parse(res.data).code == "1100") {
                        _this.setData({
                          tempFilePath: '../../images/camera.png',
                          isShow: true
                        })
                        wx.showToast({
                          title: '识别失败',
                          image: '../../images/donotfind.png',
                          duration: 1000
                        })
                        setTimeout(function() {
                          wx.hideToast()
                        }, 1000);
                      }
                    }
                  },
                  fail: function(err) {
                    wx.showToast({
                      title: '服务器繁忙',
                      image: '../../images/donotfind.png',
                      duration: 1000
                    })
                    setTimeout(function() {
                      _this.setData({
                        isShow: true,
                        tempFilePath: '../../images/camera.png'
                      })
                      wx.hideToast();
                    }, 1000)
                  }
                })
              }, 100)
              //30s 未能识别该种类 就返回首页
              uploadId = setTimeout(function() {
                requestTask.abort();
                _this.setData({
                  tempFilePath: '../../images/camera.png',
                  isShow: true,
                  judgeNetWork: true
                })
                clearTimeout(timeId);
                clearTimeout(uploadId);
              }, 30000);
            }
          },
        })
      }
    })
  },
  // 判断网络状态
  refreshBtn() {
    var that = this;
    wx.getNetworkType({
      success: function(res) {
        if (res.networkType == "none") {
          that.setData({
            judgeNetWork: false
          })
        } else {
          that.setData({
            judgeNetWork: true
          })
        }
      },
    })
  },
  // // 获取请求服务器照片
  // requestUploadImg(){

  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // var demo = new qqmap({
    //   key: 'XM4BZ-KM3CP-WAPDP-V5BPU-7B4PZ-CUB6Z',
    // });
    var that = this;
    // 判断有无网络状态
    wx.getNetworkType({
      success: function(res) {
        if (res.networkType == "none") {
          that.setData({
            judgeNetWork: false
          })
        } else {
          that.setData({
            judgeNetWork: true
          })
        }
      },
    })
  
    var myAmapFun = new amapFile.AMapWX({ key: 'ac7e6cc898cc92807d794cfeee0d2335' });
    myAmapFun.getRegeo({
      success: function (data) {
        app.globalData.peonyLocation = data[0].desc
        app.globalData.desciption = data[0].name
        app.globalData.latitude = data[0].latitude
        app.globalData.longitude = data[0].longitude
      },
      fail: function (info) {
        wx.showModal({
          title: '温馨提示',
          content: '如需开启定位服务，您可以在设置中开启位置信息',
          success: function (res) {
            if (res.confirm) {
              // console.log('用户点击确定')
            } else if (res.cancel) {
              // console.log('用户点击取消')
            }
          }
        })
      }
    })

    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (that.data.canIUse) {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    wx.showModal({
      title: '温馨提示',
      content: '小程序目前仅支持比赛中规定的西安热门景点、美食、特产、民俗、工艺品等图片识别，详情参见探索页面',
      success: function (res) {
        if (res.confirm) {
          // console.log('用户点击确定')
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // var that = this;
    // if (that.data.isShow == false){
    //    that.setData({
    //   tempFilePath: '../../images/camera.png',
    //   isShow: true
    // })
    // }
  },
  
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

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