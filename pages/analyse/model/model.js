// pages/analyse/analyse.js
var wxCharts = require('../../../utils/wxcharts.js');
const app = getApp()
var lineChart1 = null;
var lineChart2 = null;
var lineChart3 = null;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    lr:[0.1],
    train_loss:[0.1],
    eval_loss:[0.1],
    train_acc:[1],
    eval_acc:[1],
    epoch:['1'],
    flag:false,
    hiddenLr:true,
    hiddenLoss:true,
    hiddenAcc:false,
  },
  touchHandler_1: function (e) {
    // console.log(lineChart1.getCurrentDataIndex(e));
    lineChart1.showToolTip(e, {
      // background: '#7cb5ec',
      format: function (item, category) {
        return 'epoch:' + category + ' ' + item.name + ':' + item.data
      }
    });
  },
  touchHandler_2: function (e) {
    // console.log(lineChart1.getCurrentDataIndex(e));
    lineChart2.showToolTip(e, {
      // background: '#7cb5ec',
      format: function (item, category) {
        return 'epoch:' + category + ' ' + item.name + ':' + item.data
      }
    });
  },
  touchHandler_3: function (e) {
    console.log(lineChart1.getCurrentDataIndex(e));
    lineChart3.showToolTip(e, {
      // background: '#7cb5ec',
      format: function (item, category) {
        return 'epoch:' + category + ' ' + item.name + ':' + item.data
      }
    });
  },
  hidden_loss: function () {
    var that = this
    that.setData({
      hiddenLoss:!that.data.hiddenLoss,
      hiddenLr: true,
      hiddenAcc: true,
    })
  },
  hidden_acc: function () {
    var that = this
    that.setData({
      hiddenAcc: !that.data.hiddenAcc,
      hiddenLoss: true,
      hiddenLr: true,
    })
  },
  hidden_lr: function () {
    var that = this
    that.setData({
      hiddenLr: !that.data.hiddenLr,
      hiddenAcc: true,
      hiddenLoss:true,
    })
  },
  onLoad: function (e) {
    // this.load_data()
  },
  onShow: function(){
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onReady: function () {
    // setTimeout((onLoad) => {
    // }, 10000)
    // this.onLoad()
    wx.request({
      url: app.globalData.url + '/get_chart',
      data: {
        // userId: app.globalData.userInfo.nickName,
        mode: '',
      },
      success: (res) => {

        if (res.data.code == "1000") {
          this.setData({
            lr: res.data.lr,
            train_loss: res.data.train_loss,
            eval_loss: res.data.eval_loss,
            train_acc: res.data.train_acc,
            eval_acc: res.data.eval_acc,
            epoch: res.data.epoch,
          })
          var windowWidth = 320;
          try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth / 375;
          } catch (e) {
            console.error('getSystemInfoSync failed!');
          }
          var canvas_height = 250;
          if (this.data.train_acc.length != 0){
            var train_acc = this.data.train_acc;
            var eval_acc = this.data.eval_acc;
            var epoch = this.data.epoch;

            lineChart1 = new wxCharts({
              canvasId: 'lineCanvas_acc',
              type: 'line',
              categories: epoch,
              animation: true,
              // background: '#f5f5f5',
              series: [{
                name: '训练集',
                data: train_acc,
                format: function (val, name) {
                  return val.toFixed(2) + ' ';
                }
              }, {
                name: '验证集',
                data: eval_acc,
                format: function (val, name) {
                  return val.toFixed(2) + ' ';
                }
              }],
              xAxis: {
                disableGrid: true
              },
              yAxis: {
                title: '正确率',
                format: function (val) {
                  return val.toFixed(2);
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
          }
          if (this.data.train_loss.length != 0){
            var train_loss = this.data.train_loss;
            var eval_loss = this.data.eval_loss;
            lineChart2 = new wxCharts({
              canvasId: 'lineCanvas_loss',
              type: 'line',
              categories: epoch,
              animation: true,
              // background: '#f5f5f5',
              series: [{
                name: '训练集',
                data: train_loss,
                format: function (val, name) {
                  return val.toFixed(2) + ' ';
                }
              }, {
                name: '验证集',
                data: eval_loss,
                format: function (val, name) {
                  return val.toFixed(2) + ' ';
                }
              }],
              xAxis: {
                disableGrid: true
              },
              yAxis: {
                title: '损失',
                format: function (val) {
                  return val.toFixed(2);
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
          }
          if (this.data.lr.length != 0){
            var lr = this.data.lr;
            lineChart3 = new wxCharts({
              canvasId: 'lineCanvas_lr',
              type: 'line',
              categories: epoch,
              animation: true,
              // background: '#f5f5f5',
              series: [{
                name: '学习率',
                data: lr,
                format: function (val, name) {
                  return val.toFixed(2) + ' ';
                }
              }],
              xAxis: {
                disableGrid: true
              },
              yAxis: {
                title: '学习率',
                format: function (val) {
                  return val.toFixed(2);
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '浑水摸鱼-西安瞰点'
    }
  }
})