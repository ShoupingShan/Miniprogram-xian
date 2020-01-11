// pages/peonyResult/peonyResult.js
const app = getApp();
var utils = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:'', //屏幕高度
    scrollHeight:'',//富文本编辑器
    peonyResultname: '',
    coverResultImg: '', //模板图片
    uploadResultImg: '',// 用户上传的图片
    peonyResultTimes: '',
    peonyLocation:'', //拍摄地点
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this; 
    var query = wx.createSelectorQuery();
    query.select('#peonyResult').boundingClientRect(function (rect) {
      var height = rect.height;
      //console.log(rect.width)
      //console.log(rect.height);
      wx.getSystemInfo({
        success: function (res) {
         // console.log("height:"+res.screenHeight);
          //console.log('width:' + res.screenWidth);
          that.setData({
            height: res.screenHeight,
            scrollHeight: height - res.screenWidth / 750 * 575,
          })
        },
      })
    }).exec();
    // wx.getSystemInfo({
    //   success: function (res) {
    //     console.log("height:" + res.screenHeight);
    //     console.log('width:' + res.screenWidth);
    //     that.setData({
    //       height: res.screenHeight,
    //       scrollHeight: res.screenHeight - res.screenWidth / 750 * 581,
    //     })
    //   },
    // })
    var infoAll = JSON.parse(app.globalData.peonyResultInfo);
    console.log(infoAll.cam)
    console.log(app.globalData.uploadImg);
    that.setData({
      peonyResultname: infoAll.state ? infoAll.predictions[0].label:"暂无数据",
      peonyResultScore: infoAll.state ? infoAll.predictions[0].probability : "暂无数据",
      coverResultImg: infoAll.cam,
      uploadResultImg: app.globalData.uploadImg,
      peonyResultTimes: infoAll.createTime ? utils.getTime(infoAll.createTime) : utils.getTime(new Date),
      peonyLocation: app.globalData.peonyLocation ? app.globalData.peonyLocation:"暂无数据"
    });
    var temp = WxParse.wxParse('article', 'html', infoAll.content, that)
  },
  // 点击长传的图片
  clickUpload() {
    var currentImg = this.data.uploadResultImg;
    var arr = [];
    arr.push(currentImg);
    arr.push(this.data.coverResultImg);
    wx.previewImage({
      urls: arr,
      current: currentImg
    })
  },
  // 点击封面图片
  clickCover() {
    var currentImg = this.data.coverResultImg;
    var arr = [];
    arr.push(currentImg);
    arr.push(this.data.uploadResultImg);
    wx.previewImage({
      urls: arr,
      current: currentImg
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})