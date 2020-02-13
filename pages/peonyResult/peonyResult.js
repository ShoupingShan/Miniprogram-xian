// pages/peonyResult/peonyResult.js
const app = getApp();
var utils = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:'', //屏幕高度
    scrollHeight:'',//富文本编辑器
    peonyResultname: '',
    coverResultImg: '', //模板图片
    uploadResultImg: '',// 用户上传的图片
    peonyResultTimes: '',
    peonyLocation:'', //拍摄地点
    hiddenfeedback: true,
    feedback_txt:'',
    feedback:'',
    feedback_item: -1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this; 
    var query = wx.createSelectorQuery();
    query.select('#peonyResult').boundingClientRect(function (rect) {
      var height = rect.height;
      //console.log(rect.width)
      //console.log(rect.height);
      wx.getSystemInfo({
        success: function (res) {
         // console.log("height:"+res.screenHeight);
          //console.log('width:' + res.screenWidth);
          that.setData({
            height: res.screenHeight,
            scrollHeight: height - res.screenWidth / 750 * 575,
          })
        },
      })
    }).exec();
    // wx.getSystemInfo({
    //   success: function (res) {
    //     console.log("height:" + res.screenHeight);
    //     console.log('width:' + res.screenWidth);
    //     that.setData({
    //       height: res.screenHeight,
    //       scrollHeight: res.screenHeight - res.screenWidth / 750 * 581,
    //     })
    //   },
    // })
    var infoAll = JSON.parse(app.globalData.peonyResultInfo);
    console.log(infoAll.cam)
    console.log(app.globalData.uploadImg);
    that.setData({
      peonyResultname: infoAll.state ? infoAll.predictions[0].label:"暂无数据",
      peonyResultScore: infoAll.state ? infoAll.predictions[0].probability : "暂无数据",
      coverResultImg: infoAll.cam,
      uploadResultImg: app.globalData.uploadImg,
      peonyResultTimes: infoAll.createTime ? utils.getTime(infoAll.createTime) : utils.getTime(new Date),
      peonyLocation: app.globalData.peonyLocation ? app.globalData.peonyLocation:"暂无数据"
    });
    var temp = WxParse.wxParse('article', 'html', infoAll.content, that)
  },
  // 点击长传的图片
  clickUpload() {
    var currentImg = this.data.uploadResultImg;
    var arr = [];
    arr.push(currentImg);
    arr.push(this.data.coverResultImg);
    wx.previewImage({
      urls: arr,
      current: currentImg
    })
  },
  // 点击封面图片
  clickCover() {
    var currentImg = this.data.coverResultImg;
    var arr = [];
    arr.push(currentImg);
    arr.push(this.data.uploadResultImg);
    wx.previewImage({
      urls: arr,
      current: currentImg
    })
  },

  bind_feedback(e) {
    var that = this;
    that.setData({
      feedback_item: e.currentTarget.dataset.template,
      hiddenfeedback: !that.data.hiddenfeedback,
    }
    )
  },
  //取消按钮
  cancel: function () {
    this.setData({
      "feedback_txt": '请输入正确类别',
      hiddenfeedback: true,
    });
  },
  feedback_txt: function(e){
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
        prediction: that.data.peonyResultname,
        name: that.data.feedback_item,
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
            image: '../../images/shiban.png',
            duration: 1000
          })
        }
      },
      fail: function (err) {
        wx.showToast({
          title: '服务器错误',
          duration: 1000,
          image: '../../images/shiban.png'
        })
        setTimeout(function () {
          wx.hideToast()
        }, 1000)
      }
    })
    this.setData({
      "feedback_txt": '请输入正确类别',
      hiddenfeedback: true
    })
  },
  // 产看周边
  searchNeighbor(e) {
    var refer = {
      "工艺品/仿唐三彩": "唐三彩",
      "工艺品/仿宋木叶盏": "陕西省文物局",
      "工艺品/布贴绣": "绣花",
      "工艺品/景泰蓝": "景泰蓝",
      "工艺品/木马勺脸谱": "脸谱",
      "工艺品/柳编": "编织小屋",
      "工艺品/葡萄花鸟纹银香囊": "陕西历史博物馆",
      "工艺品/西安剪纸": "西安剪纸",
      "工艺品/陕历博唐妞系列": "唐妞",
      "景点/关中书院": "关中书院",
      "景点/兵马俑": "兵马俑",
      "景点/南五台": "南五台",
      "景点/大兴善寺": "大兴善寺",
      "景点/大观楼": "大观楼",
      "景点/大雁塔": "大雁塔",
      "景点/小雁塔": "小雁塔",
      "景点/未央宫城墙遗址": "未央宫遗址",
      "景点/水陆庵壁塑": "水陆庵壁塑",
      "景点/汉长安城遗址": "汉长安城遗址",
      "景点/西安城墙": "西安城墙",
      "景点/钟楼": "钟楼",
      "景点/鼓楼": "鼓楼",
      "景点/长安华严寺": "长安华严寺",
      "景点/阿房宫遗址": "阿房宫遗址",
      "民俗/唢呐": "唢呐",
      "民俗/皮影": "皮影",
      "特产/临潼火晶柿子": "火晶柿子",
      "特产/山茱萸": "秦岭森林公园",
      "特产/玉器": "玉器",
      "特产/阎良甜瓜": "阎良",
      "特产/陕北红小豆": "红豆饼",
      "特产/高陵冬枣": "高陵冬枣",
      "美食/八宝玫瑰镜糕": "镜糕",
      "美食/凉皮": "凉皮",
      "美食/凉鱼": "凉鱼豆腐脑",
      "美食/德懋恭水晶饼": "德懋恭水晶饼",
      "美食/搅团": "搅团",
      "美食/枸杞炖银耳": "银耳甜汤",
      "美食/柿子饼": "柿子饼",
      "美食/浆水面": "浆水面",
      "美食/灌汤包": "灌汤包",
      "美食/烧肘子": "肘子",
      "美食/石子饼": "石子饼",
      "美食/神仙粉": "神仙粉",
      "美食/粉汤羊血": "粉汤羊血",
      "美食/羊肉泡馍": "羊肉泡馍",
      "美食/肉夹馍": "肉夹馍",
      "美食/荞面饸饹": "荞面饸饹",
      "美食/菠菜面": "菠菜面",
      "美食/蜂蜜凉粽子": "蜂蜜凉粽子",
      "美食/蜜饯张口酥饺": "酥饺",
      "美食/西安油茶": "西安油茶",
      "美食/贵妃鸡翅": "鸡翅",
      "美食/醪糟": "醪糟",
      "美食/金线油塔": "金线油塔",
      "美食/葫芦头泡馍": "葫芦头泡馍",
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
    return {
      title: '浑水摸鱼-最西安'
    }
  }
})