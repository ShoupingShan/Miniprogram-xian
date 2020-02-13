// pages/analyse/analyse.js
var wxCharts = require('../../../utils/wxcharts.js');
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
  },

  onLoad: function () {

  },
  onShow: function () {
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onReady: function () {
  },

  goToModel: function (e) {
    var url = '../model/model'
    wx.redirectTo({
      url: url
    })
  },
  goToGuest: function (e) {
    var url = '../calculate/calculate'
    wx.redirectTo({
      url: url
    })
  },
  goToFeedback: function (e) {
    var url = '../feedback/feedback'
    wx.redirectTo({
      url: url
    })
  },


})