var amapFile = require('../../../libs/amap-wx.js');
var origin = ''
var destination = ''
Page({
  data: {
    markers: [],
    distance: '',
    cost: '',
    polyline: [],
    currentLat: '',
    currentLon: '',
    city : ''
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
    }
    var myAmapFun = new amapFile.AMapWX({ key: 'ac7e6cc898cc92807d794cfeee0d2335'});
    myAmapFun.getRidingRoute({
      origin: origin,
      destination: destination,
      success: function(data){
        var points = [];
        if(data.paths && data.paths[0] && data.paths[0].steps){
          var steps = data.paths[0].steps;
          for(var i = 0; i < steps.length; i++){
            var poLen = steps[i].polyline.split(';');
            for(var j = 0;j < poLen.length; j++){
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            } 
          }
        }
        that.setData({
          polyline: [{
            points: points,
            color: "#0091ff",
            width: 6
          }]
        });
        if(data.paths[0] && data.paths[0].distance){
          that.setData({
            distance: '相距' + data.paths[0].distance + '米'
          });
        }
        console.log(data)
        if(data.taxi_cost){
          that.setData({
            cost: '打车约' + parseInt(data.taxi_cost) + '元'
          });
        }
        if (data.paths[0] && data.paths[0].duration) {
          that.setData({
            cost: '预计耗时' + parseInt(data.paths[0].duration / 60) + '分钟' 
          });
        }
          
      },
      fail: function(info){

      }
    })
  },
  goDetail: function(){
    var url = '../navigation_ride_detail/navigation' + '?startlonlat=' + origin
    url = url + '&endlonlat=' + destination
    url = url + '&city=' + this.data.city
    wx.navigateTo({
      url: url
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
    wx.redirectTo({
      url: url
    })
  }
})