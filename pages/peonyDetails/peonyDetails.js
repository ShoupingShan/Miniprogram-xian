// pages/peonyDetails/peonyDetails.js
const app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    judgeNetWork: true, //判断有无网络状态
    height: '', //屏幕高度
    scrollHeight: '', //富文本编辑器高度
    peonyDetailsImg: '',
    peonyDetailsname: '',
    detailsShow: true, //控制页面显示
    detailsId:-1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var detailsId = options.id;
    var that = this;
    that.setData({
      detailsId: detailsId
    })
    var query = wx.createSelectorQuery();
    query.select('#peonyDetails').boundingClientRect(function(rect) {
      var height = rect.height;
      //console.log(rect.width)
      //console.log(rect.height);
      wx.getSystemInfo({
        success: function(res) {
          //console.log(height)
          //console.log("height:" + res.screenHeight);
         // console.log('width:' + res.screenWidth);
          that.setData({
            height: res.screenHeight,
            scrollHeight: height - res.screenWidth / 750 * 600
          })
        },
      })
    }).exec();
    //console.log(options.id);
    wx.getNetworkType({
      success: function(res) {
        if (res.networkType == "none") {
          that.setData({
            judgeNetWork: false
          })
        } else {
          that.setData({
            judgeNetWork:true
          })
          that.requestDetails();
        }
      },
    })

  },

  // 判断网络状态
  refreshBtn() {
    var that = this;
    wx.getNetworkType({
      success: function (res) {
        //console.log(res);
        if (res.networkType == "none") {
          that.setData({
            judgeNetWork: false
          })
        } else {
          that.requestDetails();
          console.log(that.data.detailsId);
          that.setData({
            judgeNetWork: true
          })
        
        }
      },
    })

  },
  //请求数据
  requestDetails(){
    var that = this;
    wx.request({
      url: app.globalData.url + 'template/queryTemplate',
      data: {
        templateId: parseInt(that.data.detailsId)
      },
      success: function (res) {
        //console.log(res);
        if (res.data.code == "1000") {
          that.setData({
            peonyDetailsImg: res.data.data.coverImageUrl,
            peonyDetailsname: res.data.data.name
          })
          var temp = WxParse.wxParse('article', 'html', res.data.data.content, that)
        }
      },
      fail: function (err) {
        this.setData({
          detailsShow: false
        })
        wx.showToast({
          title: '服务器错误',
          duration: 1000,
          image: '../../images/shiban.png'
        })
        setTimeout(function () { wx.hideToast() }, 1000)
      }
    })
  },
  // 回显图片
  echoDisplay() {
    var arr = [];
    arr.push(this.data.peonyDetailsImg);
    wx.previewImage({
      urls: arr,
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
  onShareAppMessage: function() {

  }
})