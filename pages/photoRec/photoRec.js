// pages/photoRec/photoRec.js
const app =getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadImg:'../../images/camera.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      uploadImg: app.globalData.uploadImg
    })
    setTimeout(function(){
      wx.uploadFile({
        url: app.globalData.url + 'record/addRecord',
        filePath: app.globalData.uploadImg,
        header: {
          "Content-Type": "multipart/form-data",
        },
        name: 'image',
        formData: {
          "Content-Type": "multipart/form-data",
          userId: '111',
          userName: '4165',
          image: app.globalData.uploadImg
        },
        success: function (res) {
          app.globalData.peonyResultInfo = res.data;
          //初始化数据页面跳转时
          // wx.navigateTo({
          //   url: '../peonyResult/peonyResult'
          // })
        }
      })
    },2000)
 
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
   this.setData({

   })
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