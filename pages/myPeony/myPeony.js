// pages/myPeony/myPeony.js


var utils = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    judgeNetWork:true, //判断有无网络状态
    scrollHeight:'', //识别纪录的宽度
    wechartImg: '../../images/NouserImg.png', //头像照片
    wechartNickName: '未登录', //微信昵称
    identificationRecordNum: '0', //查询记录条数
    peonyList: [], //纪录的数据
    // 由于第一次加载的时候就要自增1，所以默认值设置为0
    pageIndex: 0,
    pageSize: 10,
    total: 0,
    // 2.1用于记录是否还有更多的数据
    hasMore: true,
    startX: 0, //开始坐标
    startY: 0,
    deleteNum: 0,
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
      url: app.globalData.url + '/record_user',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        userId: app.globalData.userInfo.nickName,
        pageNum: ++that.data.pageIndex,
        pageSize: that.data.pageSize,
        deleteNum: that.data.deleteNum,
      },
      success: (res) => {
        //console.log(res);
        if (res.data.code == "1000") {
          var count = res.data.data.total;
          //格式化时间
          res.data.data.list.map((el, index) => {
            el.createTime = utils.getTime(el.createTime);
            el.text = this.matchReg(el.content);
          })
          //还要设置是否获取到所有数据
          var newList = this.data.peonyList.concat(res.data.data.list);
          newList.forEach(function (v, i) {

            if (!v["isTouchMove"])//只操作为true的
              v["isTouchMove"] = false;
          })
          //console.log(newList.length,count)
          var flag = newList.length < count;
          that.setData({
            identificationRecordNum: res.data.data.total,
            peonyList: newList,
            hasMore: flag,
            total: count,
          })
        }
      },
      fail:function(err){
        wx.showToast({
          title: '服务器错误',
          duration:1000,
          image:'../../images/shiban.png'
        })
        setTimeout(function(){wx.hideToast()},1000)
      }
    })

  },

  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.peonyList.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      peonyList: this.data.peonyList
    })
  },

  //滑动事件处理
  touchmove: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;//当前索引
    var startX = that.data.startX;//开始X坐标
    var startY = that.data.startY;//开始Y坐标
    var touchMoveX = e.changedTouches[0].clientX;//滑动变化坐标
    var touchMoveY = e.changedTouches[0].clientY;//滑动变化坐标
    //获取滑动角度
    var angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.peonyList.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据

    that.setData({
      peonyList: that.data.peonyList
    })
  },

  /**
  * 计算滑动角度
  * @param {Object} start 起点坐标
  * @param {Object} end 终点坐标
  */

  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },

  //删除事件
  del: function (e) {
    this.data.peonyList.splice(e.currentTarget.dataset.index, 1);
    this.deletefromDB(e.currentTarget.dataset.index);
    console.log(e.currentTarget.dataset.index)
    this.setData({
      identificationRecordNum: this.data.total - 1,
      peonyList: this.data.peonyList,
      total: this.data.total - 1,
      deleteNum: this.data.deleteNum + 1,
    })
  },

  //请求数据
  deletefromDB(index) {
    var that = this;
    wx.request({
      url: app.globalData.url + '/deleteItem',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        userId: app.globalData.userInfo.nickName,
        deleteId: index,
      },
      success: function (res) {
        //console.log(res);
        if (res.data.code == "1000") {
          wx.showToast({
            title: '删除成功',
            duration: 1000
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
          image: '../../images/shiban.png'
        })
        setTimeout(function () { wx.hideToast() }, 1000)
      }
    })
  },

  //跳转页面
  selHistorical(e) {
    // console.log(this.data, e.currentTarget.dataset)
    var item = this.data.identificationRecordNum - e.currentTarget.dataset.item - 1;
    console.log('jump to', item);
    console.log('debug', e.currentTarget);
    wx.navigateTo({
      url: '../peonyInfo/peonyInfo?item=' + item
    })
  },
  // 滑倒顶部 bindscrolltoupper 滚动到顶部/左边时触发
  topLoad() {
    // this.setData({
    //   peonyList: [],
    //   pageIndex: 0,
    //   hasMore: true,
    // });
    // this.loadMore();
    // console.log('topLoad')
  },
  //滑倒底部   滚动到底部/右边时触发
  bindDownLoad() {
    this.loadMore();
    console.log('bindDownLoad')
  },
  // 滑动事件
  bindscroll(e) {
    // if (e.detail.scrollTop < 150) {
    //   this.setData({
    //     peonyList: [],
    //     pageIndex: 0,
    //     hasMore: true,
    //   });
    //   this.loadMore();
    // }
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
          that.setData({
            judgeNetWork: true
          })
          that.onShow();
        }
      },
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
    var _this = this;
    wx.getNetworkType({
      success: function (res) {
        if (res.networkType == "none") {
          _this.setData({
            judgeNetWork: false
          })
        } else {
          // _this.refreshBtn();
          _this.setData({
            judgeNetWork: true
          })
          _this.loadMore();
          wx.getSystemInfo({
            success: function (res) {
              //console.log('height=' + res.windowHeight);
              // console.log('width=' + res.windowWidth);
              _this.setData({
                scrollHeight: res.windowHeight - res.windowWidth / 750 * 450
              })
            },
          });
          app.userInfoReadyCallback = function () {
            _this.setData({
              wechartImg: app.globalData.userInfo.avatarUrl,
              wechartNickName: app.globalData.userInfo.nickName,
              userInfo: app.globalData.userInfo
            })
          };
          if (app.globalData.userInfo) {
            _this.setData({
              wechartImg: app.globalData.userInfo.avatarUrl,
              wechartNickName: app.globalData.userInfo.nickName,
              userInfo: app.globalData.userInfo
            })
          };
        }
      },
    })
  
    //console.log(wx.getSystemInfoSync().windowHeight)
 
   
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
  // onPullDownRefresh: function() {
  //   console.log('下拉刷新')
  // },
  referash:function(){
    this.setData({
      pageIndex : 0,
      identificationRecordNum: 0,
      peonyList: [],
      hasMore: true,
      deleteNum: 0,
    });
    this.loadMore();
    console.log('刷新ing')
    // wx.stopPullDownRefresh();
  },
  onPullDownRefresh: function () {
    
  },
  
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  onPageScroll: function(e) { // 获取滚动条当前位置
    //console.log(e)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '浑水摸鱼-最西安'
    }
  }
})