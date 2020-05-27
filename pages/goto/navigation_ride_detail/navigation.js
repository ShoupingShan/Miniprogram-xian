var amapFile = require('../../../libs/amap-wx.js');

Page({
  data: {
    steps: {}
  },
  onLoad: function(e) {
    var that = this;
    var origin = ''
    var destination = ''
    if (e && e.startlonlat && e.endlonlat) {
      origin = e.startlonlat;
      destination = e.endlonlat;
    }
    var myAmapFun = new amapFile.AMapWX({ key: 'ac7e6cc898cc92807d794cfeee0d2335'});
    myAmapFun.getRidingRoute({
      origin: origin,
      destination: destination,
      success: function(data){
        if(data.paths && data.paths[0] && data.paths[0].steps){
          that.setData({
            steps: data.paths[0].steps
          });
        }
          
      },
      fail: function(info){

      }
    })
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