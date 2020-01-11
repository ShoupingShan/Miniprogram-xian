// pages/peonyIndex/peonyIndex.js
const app = getApp();
var utils = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    judgeNetWork: true, //判断有误网络
    height: '', // 可视化屏幕高度
    scrollHeight: '', //富文本编辑容器的高度
    peonyname: '', //查询结果
    location:'未记录地址',// 拍照地址
    coverImg: '', //模板图片
    uploadImg: '', // 用户上传的图片
    peonyTimes: '',
    isShow: true, //控制页面显示
    itemid:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      itemid: options.item
    })
    var item = options.item;
    // 设置容器盒子
    var query = wx.createSelectorQuery();
    query.select('#peonyRecord').boundingClientRect(function (rect) {
      var height = rect.height;
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            height: res.screenHeight,
            scrollHeight: height - res.screenWidth / 750 * 565,
          })
        },
      })
    }).exec();
    wx.getNetworkType({
      success: function(res) {
        if(res.networkType == "none"){
           that.setData({
             judgeNetWork:false
           })
        }else{
          that.requestData();
          that.setData({
            judgeNetWork:true
          })
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
          that.requestData();
          console.log(that.data.detailsId);
          that.setData({
            judgeNetWork: true
          })
        }
      },
    })

  },
  //发送请求
  requestData(){
    var that = this;
    wx.request({
      url: app.globalData.url + '/queryDetail',
      data: {
        id: parseInt(that.data.itemid),
        userName: app.globalData.userInfo.nickName
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == '1000') {
          that.setData({
            peonyname: res.data.data.pred_result, //查询的结果名称
            coverImg: res.data.data.cam, //查询图片的的cam图
            uploadImg: res.data.data.shotImage, //上传图片的缩略图
            peonyTimes: utils.getTime(res.data.data.createTime), //查询时间
            location: (res.data.data.location ? res.data.data.location:'暂无地址'), //查询的位置
            softmax: res.data.data.softmax_prob,
            matrix: res.data.data.match_images,
            cosine: res.data.data.match_times
          })
          var temp = WxParse.wxParse('article', 'html', res.data.data.content, that)
        }
      },
      fail: function (err) {
        console.log(err);
        this.setData({
          isShow: false
        })
        wx.showToast({
          title: '服务器繁忙',
          image: '../../images/shiban.png',
          duration: 1000
        })
        setTimeout(function(){wx.hideToast()},1000);
      }
    })
  },
  // 点击上传的图片
  clickUpload() {
    var currentImg = this.data.uploadImg;
    var arr = [];
    arr.push(currentImg);
    arr.push(this.data.coverImg);
    wx.previewImage({
      urls: arr,
      current: currentImg
    })
  },
  // 点击封面图片
  clickCover() {
    var currentImg = this.data.coverImg;
    var arr = [];
    arr.push(currentImg);
    arr.push(this.data.uploadImg);
    wx.previewImage({
      urls: arr,
      current: currentImg
    })
  },
  // 点击图片
  detailsShow(e) {
    var detailsId = e.currentTarget.dataset.template;
    var currentImg = this.data.matrix[detailsId].similar;
    var arr = [];
    arr.push(currentImg);
    arr.push(this.data.uploadImg);
    wx.previewImage({
      urls: arr,
      current: currentImg
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