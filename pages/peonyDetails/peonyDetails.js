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
    detailsShow: true, //控制页面显示
    detailsId:-1,
    article_content: '',
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
      //console.log(rect.width)
      //console.log(rect.height);
      wx.getSystemInfo({
        success: function(res) {
          //console.log(height)
          //console.log("height:" + res.screenHeight);
         // console.log('width:' + res.screenWidth);
          that.setData({
            height: res.screenHeight,
            scrollHeight: height - res.screenWidth / 750 * 500
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
      url: app.globalData.url + '/query_by_category',
      data: {
        templateId: parseInt(that.data.detailsId),
        userName: app.globalData.userInfo.nickName,
      },
      success: function (res) {
        //console.log(res);
        if (res.data.code == "1000") {
          var article_content = res.data.data.content
          article_content.replace(/<img/gi, '<img style="max-width:100%;height:auto;display:block" ');
          that.setData({
            peonyDetailsImg: res.data.data.coverImageUrl,
            peonyDetailsname: res.data.data.name,
            peonyDetailscate: res.data.data.cate,
            userName: app.globalData.userInfo.nickName,
            article_content: article_content,
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
      title: '浑水摸鱼-西安瞰点'
    }
  }
})