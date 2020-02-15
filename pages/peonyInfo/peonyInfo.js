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
    itemid:0,
    hiddenfeedback: true,
    feedback_txt: '',
    feedback: '',
    article_content: '',
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
            scrollHeight: height - res.screenWidth / 750 * 565 + 50,
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
        var article_content = res.data.data.content
        article_content.replace(/<img/gi, '<img style="max-width:100%;height:auto;display:block" ');
        if (res.data.code == '1000') {
          that.setData({
            peonyname: res.data.data.softmax_prob[0].label, //查询的结果名称
            coverImg: res.data.data.cam, //查询图片的的cam图
            uploadImg: res.data.data.sourceImage, //上传图片的缩略图
            peonyTimes: utils.getTime(res.data.data.createTime), //查询时间
            location: (res.data.data.location ? res.data.data.location:'暂无地址'), //查询的位置
            softmax: res.data.data.softmax_prob,
            matrix: res.data.data.match_images,
            cosine: res.data.data.match_times,
            article_content: article_content,
          })
        }
      },
      fail: function (err) {
        console.log(err);
        this.setData({
          isShow: false
        })
        wx.showToast({
          title: '服务器繁忙',
          image: '../../images/donotfind.png',
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
    var currentImg = this.data.matrix[detailsId];
    var arr = [];
    arr.push(currentImg);
    arr.push(this.data.uploadImg);
    wx.previewImage({
      urls: arr,
      current: currentImg
    })
  },

  bind_feedback(e) {
    var that = this;
    that.setData({
      // feedback_item: e.currentTarget.dataset.template,
      hiddenfeedback: !that.data.hiddenfeedback,
    }
    )
  },
  //取消按钮
  cancel: function () {
    this.setData({
      "feedback_txt": '',
      hiddenfeedback: true,
    });
  },
  feedback_txt: function (e) {
    var that = this
    that.setData({
      feedback: e.detail.value
    })
  },
  //确认
  confirm: function () {
    var that = this

    wx.request({
      url: app.globalData.url + '/feedback',
      data: {
        userId: app.globalData.userInfo.nickName,
        prediction: that.data.peonyname,
        name: that.data.uploadImg,
        user_feedback: that.data.feedback,
      },
      success: function (res) {
        if (res.data.code == "1000") {
          wx.showToast({
            title: '感谢反馈',
            duration: 1000
          })
        } else {
          wx.showToast({
            title: '反馈失败',
            image: '../../images/donotfind.png',
            duration: 1000
          })
        }
      },
      fail: function (err) {
        wx.showToast({
          title: '服务器错误',
          duration: 1000,
          image: '../../images/donotfind.png'
        })
        setTimeout(function () {
          wx.hideToast()
        }, 1000)
      }
    })
    this.setData({
      "feedback_txt": '',
      hiddenfeedback: true
    })
  },
  // 产看周边
  searchNeighbor(e) {
    var refer = {
      "工艺品/仿唐三彩":"唐三彩",
      "工艺品/仿宋木叶盏":"陕西省文物局",
      "工艺品/布贴绣":"绣花",
      "工艺品/景泰蓝":"景泰蓝",
      "工艺品/木马勺脸谱":"脸谱",
      "工艺品/柳编":"编织小屋",
      "工艺品/葡萄花鸟纹银香囊":"陕西历史博物馆",
      "工艺品/西安剪纸":"西安剪纸",
      "工艺品/陕历博唐妞系列":"唐妞",
      "景点/关中书院":"关中书院",
      "景点/兵马俑":"兵马俑",
      "景点/南五台":"南五台",
      "景点/大兴善寺":"大兴善寺",
      "景点/大观楼":"大观楼",
      "景点/大雁塔":"大雁塔",
      "景点/小雁塔":"小雁塔",
      "景点/未央宫城墙遗址":"未央宫遗址",
      "景点/水陆庵壁塑":"水陆庵壁塑",
      "景点/汉长安城遗址":"汉长安城遗址",
      "景点/西安城墙":"西安城墙",
      "景点/钟楼":"钟楼",
      "景点/鼓楼":"鼓楼",
      "景点/长安华严寺":"长安华严寺",
      "景点/阿房宫遗址":"阿房宫遗址",
      "民俗/唢呐":"唢呐",
      "民俗/皮影":"皮影",
      "特产/临潼火晶柿子":"火晶柿子",
      "特产/山茱萸":"秦岭森林公园",
      "特产/玉器":"玉器",
      "特产/阎良甜瓜":"阎良",
      "特产/陕北红小豆":"红豆饼",
      "特产/高陵冬枣":"高陵冬枣",
      "美食/八宝玫瑰镜糕":"镜糕",
      "美食/凉皮":"凉皮",
      "美食/凉鱼":"凉鱼豆腐脑",
      "美食/德懋恭水晶饼":"德懋恭水晶饼",
      "美食/搅团":"搅团",
      "美食/枸杞炖银耳":"银耳甜汤",
      "美食/柿子饼":"柿子饼",
      "美食/浆水面":"浆水面",
      "美食/灌汤包":"灌汤包",
      "美食/烧肘子":"肘子",
      "美食/石子饼":"石子饼",
      "美食/神仙粉":"神仙粉",
      "美食/粉汤羊血":"粉汤羊血",
      "美食/羊肉泡馍":"羊肉泡馍",
      "美食/肉夹馍":"肉夹馍",
      "美食/荞面饸饹":"荞面饸饹",
      "美食/菠菜面":"菠菜面",
      "美食/蜂蜜凉粽子":"蜂蜜凉粽子",
      "美食/蜜饯张口酥饺":"酥饺",
      "美食/西安油茶":"西安油茶",
      "美食/贵妃鸡翅":"鸡翅",
      "美食/醪糟":"醪糟",
      "美食/金线油塔":"金线油塔",
      "美食/葫芦头泡馍":"葫芦头泡馍",
      "美食/小炒泡馍": "小炒泡馍",
    }
    var tips = e.currentTarget.dataset.template;
    wx.navigateTo({
      url: '../poi/poi?keywords=' + refer[tips]
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
  errorFunction_source(e) {
    if (e.type == "error") {
      defult_image = '../../images/defult.png' //错误图片替换为默认图片
      this.setData({
        uploadImg: defult_image,
      })
    }
  },
  errorFunction_cam(e) {
    if (e.type == "error") {
      defult_image = '../../images/defult.png' //错误图片替换为默认图片
      this.setData({
        coverImg: defult_image,
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '浑水摸鱼-西安瞰点'
    }
  }
})