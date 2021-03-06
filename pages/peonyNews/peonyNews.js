// pages/peonyDetails/peonyDetails.js
const app = getApp();
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
    peonyDetailscate: '',
    peonyDetailsweb:'',
    detailsShow: true, //控制页面显示
    detailsId:-1,
    article_content:'',
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
      wx.getSystemInfo({
        success: function(res) {
          that.setData({
            height: res.screenHeight,
            scrollHeight: height - res.screenWidth / 750 * 100
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
      url: app.globalData.url + '/query_news_by_id',
      data: {
        templateId: parseInt(that.data.detailsId),
        userName: app.globalData.userInfo.nickName,
      },
      success: function (res) {
        //console.log(res);
        if (res.data.code == "1000") {
          var article_content = res.data.data.content
          // article_content.replace(/<img/gi, '<img style="max-width:100%;height:auto;display:block" ');
          // article_content.replace(/\<img/gi, '<img style="width:100%;height:auto" ')
          that.setData({
            peonyDetailsImg: res.data.data.coverImageUrl,
            peonyDetailsname: res.data.data.name,
            peonyDetailscate: res.data.data.time,
            peonyDetailsweb: res.data.data.webpage,
            article_content:article_content,
          })
          
        }
      },
      fail: function (err) {
        this.setData({
          detailsShow: false
        })
        wx.showToast({
          title: '服务器错误',
          duration: 1000,
          image: '../../images/donotfind.png'
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
  onShareAppMessage: function () {
    return {
      title: '浑水摸鱼-识秦通'
    }
  }
})