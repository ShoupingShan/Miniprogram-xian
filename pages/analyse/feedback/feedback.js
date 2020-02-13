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
    hiddenfeedback_time:true,
    hidden_statistic:true,
    hidden_user_info:true,
    hidden_time_info:true,
    time_txt: '',
    during_time: '',
    user_feedback_txt: '',
    time_feedback_txt: '',
    user_name:'',
    user_name_save:'',
    feedback_todaynum:0,
    feedback_allnum:0,
    date_cate:[],
    date_times:[],
    user_cate:[],
    user_times :[],
    searchList_user:[],
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
      url: app.globalData.url + '/admin_feedback_statistic',
      data: {
        userId: app.globalData.userInfo.nickName,
      },
      success: (res) => {

        if (res.data.code == "1000") {
          this.setData({
            date_cate: res.data.data.date_category,
            date_times: res.data.data.date_times,
            user_cate: res.data.data.user_category,
            user_times: res.data.data.user_times,
            hidden_statistic:false,
            feedback_todaynum: res.data.today,
            feedback_allnum: res.data.total,
          })
          var windowWidth = 320;
          try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth / 375;
          } catch (e) {
            console.error('getSystemInfoSync failed!');
          }
          var canvas_height = 200;
          var date_times = this.data.date_times;
          var cate = this.data.date_cate;

          lineChart1 = new wxCharts({
            canvasId: 'lineCanvas_date',
            type: 'line',
            categories: cate,
            animation: true,
            // background: '#f5f5f5',
            series: [{
              name: '反馈次数',
              data: date_times,
              format: function (val, name) {
                return val.toFixed(0) + '次';
              }
            }],
            xAxis: {
              disableGrid: true
            },
            yAxis: {
              title: '反馈次数',
              format: function (val) {
                return val.toFixed(0);
              },
              min: 0
            },
            width: windowWidth * 375,
            height: canvas_height,
            dataLabel: false,
            dataPointShape: false,
            extra: {
              lineStyle: 'curve'
            }
          });
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
              title: '反馈次数',
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
        } else {
          wx.showToast({
            title: '获取失败',
            image: '../../images/shiban.png',
            duration: 1000
          })
        }
      },
      fail: function (err) {
        wx.showToast({
          title: '服务器错误',
          duration: 1000,
          image: '../../images/shiban.png'
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
  bind_feedback_time: function(){
    this.setData({
      hidden_statistic: true,
      hiddenfeedback_time: !this.data.hiddenfeedback_time,
    })
  },
  bind_feedback_user: function(){
    this.setData({
      hidden_statistic: true,
      hiddenfeedback_user:!this.data.hiddenfeedback_user,
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
      time_txt: '',
      time_feedback_txt:'',
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
      url: app.globalData.url + '/admin_feedback_by_username',
      data: {
        userId: app.globalData.userInfo.nickName,
        user_name: that.data.user_name,
      },
      success: function (res) {
        if (res.data.code == "1000") {
          that.setData({
            searchList_user:res.data.data,
            hidden_statistic: true,
            hidden_user_info: false,
            hidden_time_info: true,
          })
        } else if (res.data.code == "-2000"){
          wx.showToast({
            title: '未查询到信息',
            image: '../../../images/shiban.png',
            duration: 1500
          })
        }
        else {
          wx.showToast({
            title: '查询不合法',
            image: '../../../images/shiban.png',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        wx.showToast({
          title: '服务器错误',
          duration: 1000,
          image: '../../images/shiban.png'
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
      url: app.globalData.url + '/admin_feedback_by_time',
      data: {
        userId: app.globalData.userInfo.nickName,
        during_time: that.data.during_time,
      },
      success: function (res) {
        if (res.data.code == "1000") {
          that.setData({
            hidden_statistic:true,
            hidden_user_info:true,
            hidden_time_info: false, 
            searchList_time: res.data.data,
          })
        } else if (res.data.code == "-1000") {
          wx.showToast({
            title: '查询不合法',
            image: '../../../images/shiban.png',
            duration: 1500
          })
        }
        else {
          wx.showToast({
            title: '未查询到信息',
            image: '../../../images/shiban.png',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        wx.showToast({
          title: '服务器错误',
          duration: 1000,
          image: '../../images/shiban.png'
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
  bind_feedback_all: function(){
    var that = this
    wx.request({
      url: app.globalData.url + '/admin_feedback_statistic',
      data: {
        userId: app.globalData.userInfo.nickName,
      },
      success: function (res) {
        if (res.data.code == "1000") {
          that.setData({
            date_cate: res.data.data.date_category,
            date_times: res.data.data.date_times,
            user_cate: res.data.data.user_category,
            user_times: res.data.data.user_times,
            hidden_statistic: !that.data.hidden_statistic,
            hidden_user_info: true,
            hidden_time_info: true,
            feedback_todaynum: res.data.today,
            feedback_allnum: res.data.total,
          })
          var windowWidth = 320;
          try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth / 375;
          } catch (e) {
            console.error('getSystemInfoSync failed!');
          }
          var canvas_height = 200;
          var date_times = that.data.date_times;
          var cate = that.data.date_cate;

          lineChart1 = new wxCharts({
            canvasId: 'lineCanvas_date',
            type: 'line',
            categories: cate,
            animation: true,
            // background: '#f5f5f5',
            series: [{
              name: '反馈日期变化',
              data: date_times,
              format: function (val, name) {
                return val.toFixed(0) + ' ';
              }
            }],
            xAxis: {
              disableGrid: true
            },
            yAxis: {
              title: '反馈次数',
              format: function (val) {
                return val.toFixed(0);
              },
              min: 0
            },
            width: windowWidth * 375,
            height: canvas_height,
            dataLabel: false,
            dataPointShape: false,
            extra: {
              lineStyle: 'curve'
            }
          });

          var user_times = that.data.user_times;
          var user_cate = that.data.user_cate;
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
              title: '反馈次数',
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
        }else {
          wx.showToast({
            title: '未查询到信息',
            image: '../../../images/shiban.png',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        wx.showToast({
          title: '服务器错误',
          duration: 1000,
          image: '../../images/shiban.png'
        })
        setTimeout(function () {
          wx.hideToast()
        }, 1000)
      }
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
})