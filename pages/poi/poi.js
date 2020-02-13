var amapFile = require('../../libs/amap-wx.js');
const app = getApp()
var markersData = [];
var choosenLatitude = '';
var choosenLongitude = '';
Page({
  data: {
    markers: [],
    latitude: '',
    longitude: '',
    textData: {},
    city: '',
    currentLatitude : '',
    currentLongitude : '',
  },
  makertap: function(e) {
    // console.log('Call', e)
    // console.log(markersData)
    var id = e.markerId;
    choosenLatitude = markersData[id].latitude
    choosenLongitude = markersData[id].longitude
    var that = this;
    that.showMarkerInfo(markersData,id);
    that.changeMarkerColor(markersData,id);
  },
  onLoad: function(e) {
    var that = this;
    var myAmapFun = new amapFile.AMapWX({ key: 'ac7e6cc898cc92807d794cfeee0d2335'});
    var params = {
      iconPathSelected: '../../images/marker_checked.png',
      iconPath: '../../images/marker.png',
      success: function(data){
        console.log('Successful', data)
        markersData = data.markers;
        var poisData = data.poisData;
        var markers_new = [];
        that.setData({
          currentLatitude: app.globalData.latitude,
          currentLongitude : app.globalData.longitude
        });
        markersData.forEach(function(item,index){
          // console.log(item)
          // console.log(index)
          markers_new.push({
            id: item.id,
            latitude: item.latitude,
            longitude: item.longitude,
            iconPath: item.iconPath,
            width: item.width,
            height: item.height
          })

        })
        //初始化
        if (markersData.length > 0){
          that.showMarkerInfo(markersData, 0);
          that.changeMarkerColor(markersData, 0);
          choosenLatitude = markersData[0].latitude
          choosenLongitude = markersData[0].longitude
        }else{
          wx.showToast({
            title: '未找到相关信息',
            duration: 1000
          })
        }
        
        if(markersData.length > 0){
          that.setData({
            markers: markers_new
          });
          that.setData({
            city: poisData[0].cityname || ''
          });
          that.setData({
            latitude: markersData[0].latitude
          });
          that.setData({
            longitude: markersData[0].longitude
          });
          that.showMarkerInfo(markersData,0);
        }else{
          wx.getLocation({
            type: 'gcj02',
            success: function(res) {
              that.setData({
                latitude: res.latitude
              });
              that.setData({
                longitude: res.longitude
              });
              that.setData({
                city: '北京市'
              });
            },
            fail: function(){
              that.setData({
                latitude: 39.909729
              });
              that.setData({
                longitude: 116.398419
              });
              that.setData({
                city: '北京市'
              });
            }
          })
          
          that.setData({
            textData: {
              name: '抱歉，未找到结果',
              desc: ''
            }
          });
        }
        
      },
      fail: function(info){
        console.log('Unseccessful')
        wx.showModal({title:info.errMsg})
      }
    }
    if(e && e.keywords){
      params.querykeywords = e.keywords;
    }
    myAmapFun.getPoiAround(params)
  },

  go2distination: function(e){
    // console.log(this.data.currentLatitude, this.data.currentLongitude, choosenLatitude, choosenLongitude);
    var url = '../goto/navigation_car/navigation';
    url = url + '?startlonlat=' + this.data.currentLongitude + ',' + this.data.currentLatitude; 
    url = url + '&endlonlat=' + choosenLongitude + ',' + choosenLatitude;
    url = url + '&city=' + this.data.city
    console.log(url)
    wx.redirectTo({
      url: url
    })
  },

  bindInput: function(e){
    var that = this;
    var url = '../inputtips/input';
    if(e.target.dataset.latitude && e.target.dataset.longitude && e.target.dataset.city){
      var dataset = e.target.dataset;
      url = url + '?lonlat=' + dataset.longitude + ',' + dataset.latitude + '&city=' + dataset.city;
    }
    console.log(url)
    wx.redirectTo({
      url: url
    })
  },
  showMarkerInfo: function(data,i){
    var that = this;
    that.setData({
      textData: {
        name: data[i].name,
        desc: data[i].address
      }
    });
  },
  changeMarkerColor: function(data,i){
    var that = this;
    var markers = [];
    for(var j = 0; j < data.length; j++){
      if(j==i){
        data[j].iconPath = "../../images/marker_checked.png";
      }else{
        data[j].iconPath = "../../images/marker.png";
      }
      markers.push({
        id: data[j].id,
        latitude: data[j].latitude,
        longitude: data[j].longitude,
        iconPath: data[j].iconPath,
        width: data[j].width,
        height: data[j].height
      })
    }
    that.setData({
      markers: markers
    });
  }

})