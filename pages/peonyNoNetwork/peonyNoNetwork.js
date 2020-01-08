// pages/peonyNoNetwork/peonyNoNetwork.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
 
  },
  // 有网络的话跳转到别的页面
  // refreshBtn(){
  //  var that=this;
  //   wx.getNetworkType({
  //     success: function (res) {
  //       if (res.networkType == "none") {
           
  //       }else{
  //         if (that.data.judgeIndex=="1"){
  //           wx.redirectTo({
  //             url: '../peonyHomePage/peonyHomePage',
  //           })
  //         }
        
  //       }

  //     },
  //   })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.index == "1"){
      this.setData({
        judgeIndex: options.index
      })
    }
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