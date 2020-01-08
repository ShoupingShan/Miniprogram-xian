// pages/text/text.js
var utils = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    peonyList: [],
    // 由于第一次加载的时候就要自增1，所以默认值设置为0
    pageIndex: 0,
    pageSize: 10,
    catId: 1,
    // 2.1用于记录是否还有更多的数据
    hasMore: true,
    isShow: false, //有无数据的判断
  },
  //利用正则截取字符串
  matchReg: function matchReg(str) {
    let reg = /<\/?.+?\/?>/g;
    var a = str.replace(reg, '')
    return a.replace(/&nbsp;/ig, "");
  },
  // 1.3 自己定义的函数，用来加载数据
  loadMore: function() {
    var that = this;
    if (!this.data.hasMore) return;
    wx.request({
      url: app.globalData.url+'record/queryAll',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        userId: '111',
        pageNum: ++that.data.pageIndex,
        pageSize: that.data.pageSize
      },
      success: (res) => {
        console.log(res);
        if (res.data.code == "1000") {
          var count = res.data.data.total;
          var flag = that.data.pageIndex * that.data.pageSize < count;
          //格式化时间
          res.data.data.list.map((el, index) => {
            el.createTime = utils.getTime(el.createTime);
            el.text = this.matchReg(el.content);
          })
          //还要设置是否获取到所有数据
          var newList = this.data.peonyList.concat(res.data.data.list);
          that.setData({
            peonyList: newList,
            hasMore: flag
          })
          console.log()
          //文本格式化编辑器数据
          // let artilesA = this.data.peonyList;
          // for (let i = 0; i < artilesA.length; i++) {
          //   WxParse.wxParse('content' + i, 'html', artilesA[i]['content'], that);
          //   if (i === artilesA.length - 1) {
          //     WxParse.wxParseTemArray("artileList", 'content', artilesA.length, that)
          //   }
          // }
        }

      },
      fail: function(err) {
        // wx.showLoading({
        //   title: '正在加载数据',
        // })
        // setTimeout(function(){
        //   wx.hideLoading();
        // },2000)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    this.loadMore();
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
    this.setData({
      peonyList: [],
      pageIndex: 0,
      hasMore: true,
    });
    // 3.2 再重新请求数据
    this.loadMore();
    // 3.3 记得停止，否则在手机端一直存在
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    // 1.5. 触底再调用加载数据的函数
    this.loadMore();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})