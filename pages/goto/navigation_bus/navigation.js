var amapFile = require('../../../libs/amap-wx.js');
var origin = ''
var destination = ''
Page({
  data: {
    markers: [],
    distance: '',
    cost: '',
    transits: [],
    polyline: [],
    currentLat: '',
    currentLon: '',
    city:''
  },
  onLoad: function(e) {
    var that = this;
    var markers = []
    if (e && e.startlonlat && e.endlonlat) {
      console.log(e)
      origin = e.startlonlat;
      destination = e.endlonlat;
      markers = [{
        iconPath: "/images/mapicon_navi_s.png",
        id: 0,
        latitude: origin.split(',')[1],
        longitude: origin.split(',')[0],
        width: 23,
        height: 33
      }, {
        iconPath: "/images/mapicon_navi_e.png",
        id: 0,
        latitude: destination.split(',')[1],
        longitude: destination.split(',')[0],
        width: 24,
        height: 34
      }];
      that.setData({
        currentLat: origin.split(',')[1],
        currentLon: origin.split(',')[0],
        markers: markers,
        city: e.city
      });
    }else{
      wx.showToast({
        title: '暂无公交路线',
        duration: 1000
      })
    }
    var myAmapFun = new amapFile.AMapWX({ key: 'ac7e6cc898cc92807d794cfeee0d2335'});
    myAmapFun.getTransitRoute({
      origin: origin,
      destination: destination,
      city: this.data.city,
      success: function(data){
        console.log(data)
        if(data && data.transits.length > 0){
          var transits = data.transits;
          for(var i = 0; i < transits.length; i++){
            var segments = transits[i].segments;
            transits[i].transport = [];
            for(var j = 0; j < segments.length; j++){
              if(segments[j].bus && segments[j].bus.buslines && segments[j].bus.buslines[0] && segments[j].bus.buslines[0].name){
                var name = segments[j].bus.buslines[0].name
                if(j!==0){
                  name = '\n换乘：' + name;
                }
                transits[i].transport.push(name);
              }
            }
          }
        }else{
          wx.showToast({
            title: '暂无公交路线',
            image: '../../../images/donotfind.png',
            duration: 1000
          })
        }
        that.setData({
          transits: transits
        });
          
      },
      fail: function(info){

      }
    })
  },
  goToCar: function (e) {
    var url = '../navigation_car/navigation' + '?startlonlat=' + origin
    url = url + '&endlonlat=' + destination
    url = url + '&city=' + this.data.city
    wx.redirectTo({
      url: url
    })
  },
  goToBus: function (e) {
    var url = '../navigation_bus/navigation' + '?startlonlat=' + origin
    url = url + '&endlonlat=' + destination
    url = url + '&city=' + this.data.city
    wx.redirectTo({
      url: url
    })
  },
  goToRide: function (e) {
    var url = '../navigation_ride/navigation' + '?startlonlat=' + origin
    url = url + '&endlonlat=' + destination
    url = url + '&city=' + this.data.city
    wx.redirectTo({
      url: url
    })
  },
  goToWalk: function (e) {
    var url = '../navigation_walk/navigation' + '?startlonlat=' + origin
    url = url + '&endlonlat=' + destination
    url = url + '&city=' + this.data.city
    wx.redirectTo({
      url: url
    })
  }
})