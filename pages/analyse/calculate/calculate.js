// pages/analyse/analyse.js
var wxCharts = require('../../../utils/wxcharts.js');
const app = getApp()
var lineChart1 = null;
var lineChart2 = null;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hiddenfeedback_user: true,
    hiddenfeedback_time: true,
    hidden_statistic: true,
    during_time: '1',
    user_feedback_txt: '',
    time_feedback_txt: '',
    user_name: '',
    user_name_save: '',
    feedback_todaynum: 0,
    feedback_allnum: 0,
    date_cate: [],
    date_times: [],
    user_cate: [],
    user_times: [],
    searchList_user: [],
    searchList_time: [],
  },
  touchHandler_1: function (e) {
    // console.log(lineChart1.getCurrentDataIndex(e));
    lineChart1.showToolTip(e, {
      // background: '#7cb5ec',
      format: function (item, category) {
        return category + ' 反馈' + ':' + item.data
      }
    });
  },

  onLoad: function () {

  },
  onShow: function () {
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onReady: function () {
    wx.request({
      url: app.globalData.url + '/admin_guest_by_time',
      data: {
        userId: app.globalData.userInfo.nickName,
        during_time : this.data.during_time,
      },
      success: (res) => {
        if (res.data.code == "1000") {
          this.setData({
            date_cate: res.data.detail_cate,
            date_times: res.data.detail_value,
            user_cate: res.data.user_cate,
            user_times: res.data.user_value,
            hidden_statistic: false,
            feedback_todaynum: res.data.total, //访客
            feedback_allnum: res.data.today,  //请求
          })
          var windowWidth = 320;
          try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth / 375;
          } catch (e) {
            console.error('getSystemInfoSync failed!');
          }
          var canvas_height = 250;

          if (this.data.date_cate.length!= 0){
            var date_times = this.data.date_times;
            var cate = this.data.date_cate;

            lineChart1 = new wxCharts({
              canvasId: 'lineCanvas_date',
              type: 'column',
              categories: cate,
              animation: true,
              // background: '#f5f5f5',
              series: [{
                name: '请求类型',
                data: date_times,
                format: function (val, name) {
                  return val.toFixed(0) + ' ';
                }
              }],
              yAxis: {
                format: function (val) {
                  return val + '次';
                },
                title: '请求次数',
                min: 0
              },
              xAxis: {
                disableGrid: false,
                type: 'calibration'
              },
              extra: {
                column: {
                  width: 15
                }
              },
              width: windowWidth * 375,
              height: canvas_height,
            });
          }
          if (this.data.user_cate.length != 0){
            var user_times = this.data.user_times;
            var user_cate = this.data.user_cate;
            lineChart2 = new wxCharts({
              canvasId: 'lineCanvas_user',
              type: 'column',
              animation: true,
              categories: user_cate,
              series: [{
                name: '用户名',
                data: user_times,
                format: function (val, name) {
                  return val.toFixed(0) + ' ';
                }
              }],
              yAxis: {
                format: function (val) {
                  return val + '次';
                },
                title: '请求次数',
                min: 0
              },
              xAxis: {
                disableGrid: false,
                type: 'calibration'
              },
              extra: {
                column: {
                  width: 15
                }
              },
              width: windowWidth * 375,
              height: canvas_height,
            });
          }
        } else {
          wx.showToast({
            title: '获取失败',
            image: '../../../images/donotfind.png',
            duration: 1000
          })
        }
      },
      fail: function (err) {
        wx.showToast({
          title: '服务器错误',
          duration: 1000,
          image: '../../../images/donotfind.png'
        })
        setTimeout(function () {
          wx.hideToast()
        }, 1000)
      }
    })

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
  bind_feedback_time: function () {
    this.setData({
      hidden_statistic: true,
      hiddenfeedback_time: !this.data.hiddenfeedback_time,
    })
  },
  bind_feedback_user: function () {
    this.setData({
      hidden_statistic: true,
      hiddenfeedback_user: !this.data.hiddenfeedback_user,
    })
  },
  //取消按钮
  cancel_user: function () {
    this.setData({
      user_feedback_txt: '',
      hiddenfeedback_user: true,
    });
  },
  cancel_time: function () {
    this.setData({
      time_feedback_txt: '',
      hiddenfeedback_time: true,
    });
  },
  user_feedback_txt: function (e) {
    var that = this
    that.setData({
      user_name: e.detail.value
    })
  },
  time_feedback_txt: function (e) {
    var that = this
    that.setData({
      during_time: e.detail.value
    })
  },
  //确认
  confirm_user: function () {
    var that = this
    wx.request({
      url: app.globalData.url + '/admin_guest_by_username',
      data: {
        userId: app.globalData.userInfo.nickName,
        user_name: this.data.user_name,
      },
      success: (res) => {
        if (res.data.code == "1000") {
          this.setData({
            date_cate: res.data.detail_cate, //请求
            date_times: res.data.detail_value ,
            user_cate: res.data.time_cate, //用户
            user_times: res.data.time_value,
            hidden_statistic: false,
            feedback_todaynum: res.data.total, //访客
            feedback_allnum: res.data.today,  //请求
          })
          var windowWidth = 320;
          try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth / 375;
          } catch (e) {
            console.error('getSystemInfoSync failed!');
          }
          var canvas_height = 250;
          if (that.data.date_cate.length != 0){
            var date_times = this.data.date_times;
            var cate = this.data.date_cate;

            lineChart1 = new wxCharts({
              canvasId: 'lineCanvas_date',
              type: 'column',
              categories: cate,
              animation: true,
              // background: '#f5f5f5',
              series: [{
                name: '请求类型',
                data: date_times,
                format: function (val, name) {
                  return val.toFixed(0) + ' ';
                }
              }],
              yAxis: {
                format: function (val) {
                  return val + '次';
                },
                title: '请求次数',
                min: 0
              },
              xAxis: {
                disableGrid: false,
                type: 'calibration'
              },
              extra: {
                column: {
                  width: 15
                }
              },
              width: windowWidth * 375,
              height: canvas_height,
            });
          }
          if (that.data.user_cate.length != 0){
            var user_times = this.data.user_times;
            var user_cate = this.data.user_cate;
            lineChart2 = new wxCharts({
              canvasId: 'lineCanvas_user',
              type: 'column',
              animation: true,
              categories: user_cate,
              series: [{
                name: '日期',
                data: user_times,
                format: function (val, name) {
                  return val.toFixed(0) + ' ';
                }
              }],
              yAxis: {
                format: function (val) {
                  return val + '次';
                },
                title: '请求次数',
                min: 0
              },
              xAxis: {
                disableGrid: false,
                type: 'calibration'
              },
              extra: {
                column: {
                  width: 15
                }
              },
              width: windowWidth * 375,
              height: canvas_height,
            });
          }
          
        } else {
          wx.showToast({
            title: '获取失败',
            image: '../../../images/donotfind.png',
            duration: 1000
          })
        }
      },
      fail: function (err) {
        wx.showToast({
          title: '服务器错误',
          duration: 1000,
          image: '../../../images/donotfind.png'
        })
        setTimeout(function () {
          wx.hideToast()
        }, 1000)
      }
    })
    this.setData({
      user_feedback_txt: '',
      hiddenfeedback_user: true,
      user_name_save: that.data.user_name,
      user_name: '',
    })
  },
  //确认
  confirm_time: function () {
    var that = this
    wx.request({
      url: app.globalData.url + '/admin_guest_by_time',
      data: {
        userId: app.globalData.userInfo.nickName,
        during_time: this.data.during_time,
      },
      success: (res) => {
        if (res.data.code == "1000") {
          this.setData({
            date_cate: res.data.detail_cate, //请求
            date_times: res.data.detail_value,
            user_cate: res.data.user_cate, //用户
            user_times: res.data.user_value,
            hidden_statistic: false,
            feedback_todaynum: res.data.total, //访客
            feedback_allnum: res.data.today,  //请求
          })
          var windowWidth = 320;
          try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth / 375;
          } catch (e) {
            console.error('getSystemInfoSync failed!');
          }
          var canvas_height = 250;

          if (that.data.date_cate.length != 0){
            var date_times = this.data.date_times;
            var cate = this.data.date_cate;

            lineChart1 = new wxCharts({
              canvasId: 'lineCanvas_date',
              type: 'column',
              categories: cate,
              animation: true,
              // background: '#f5f5f5',
              series: [{
                name: '请求类型',
                data: date_times,
                format: function (val, name) {
                  return val.toFixed(0) + ' ';
                }
              }],
              yAxis: {
                format: function (val) {
                  return val + '次';
                },
                title: '请求次数',
                min: 0
              },
              xAxis: {
                disableGrid: false,
                type: 'calibration'
              },
              extra: {
                column: {
                  width: 15
                }
              },
              width: windowWidth * 375,
              height: canvas_height,
            });
          }
          if (that.data.user_cate.length != 0){
            var user_times = this.data.user_times;
            var user_cate = this.data.user_cate;
            lineChart2 = new wxCharts({
              canvasId: 'lineCanvas_user',
              type: 'column',
              animation: true,
              categories: user_cate,
              series: [{
                name: '用户名',
                data: user_times,
                format: function (val, name) {
                  return val.toFixed(0) + ' ';
                }
              }],
              yAxis: {
                format: function (val) {
                  return val + '次';
                },
                title: '请求次数',
                min: 0
              },
              xAxis: {
                disableGrid: false,
                type: 'calibration'
              },
              extra: {
                column: {
                  width: 15
                }
              },
              width: windowWidth * 375,
              height: canvas_height,
            });
          }
          
        } else {
          wx.showToast({
            title: '获取失败',
            image: '../../../images/donotfind.png',
            duration: 1000
          })
        }
      },
      fail: function (err) {
        wx.showToast({
          title: '服务器错误',
          duration: 1000,
          image: '../../../images/donotfind.png'
        })
        setTimeout(function () {
          wx.hideToast()
        }, 1000)
      }
    })
    this.setData({
      time_feedback_txt: '',
      hiddenfeedback_time: true,
      during_time: '',
    })
  },

  errorFunction_user(e) {
    if (e.type == "error") {
      var errorImgIndex = e.target.dataset.errorimg //获取错误图片循环的下标
      var imgList = this.data.searchList_user                 //将图片列表数据绑定到变量
      imgList[errorImgIndex].coverImageUrl = '../../../images/defult.png' //错误图片替换为默认图片
      this.setData({
        searchList_user: imgList
      })
    }
  },
  errorFunction_time(e) {
    if (e.type == "error") {
      var errorImgIndex = e.target.dataset.errorimg //获取错误图片循环的下标
      var imgList = this.data.searchList_time                 //将图片列表数据绑定到变量
      imgList[errorImgIndex].coverImageUrl = '../../../images/defult.png' //错误图片替换为默认图片
      this.setData({
        searchList_time: imgList
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