// pages/oil_detail/oil_detail.js
var util = require("../../utils/util.js");
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    detail_top: {
      name: "",
      adress: "",
      distance: "",
      img: "",
      arrMark: [],
      businessStatus:0,
    },
    onSiteId: "",
    // arrMark: ["油枪14个", "有空闲", "24小时", "对外开放"],
    currentData: 0,
    oilList: [],
    priceList: [],
    imgList: [],
    oilGun: 0
  },
  //头部信息
  detailTop: function (oilId) {
    util.toast_load();
    var that = this;
    util.send_post(app.globalData.csUrl + "/t/on/site/getOnSiteDetailTop",
      wx.getStorageSync("token"), {
        onSiteId: oilId,
        longitude: wx.getStorageSync("longitude"),
        latitude: wx.getStorageSync("latitude")
      },
      function (res) {
        if (util.success == res.data.code) {
          let datas = res.data.data;
          // console.log(datas)
          var imgs = "";
          if (datas.tOnSiteImages == "") {
            imgs = "";
          } else {
            imgs = datas.tOnSiteImages[0].imageUrl
          }
          that.setData({
            detail_top: {
              name: datas.name,
              adress: datas.address,
              distance: datas.distance,
              img: imgs,
              arrMark: datas.tOnLabels,
              businessStatus:datas.businessStatus
            }
          });
          wx.setNavigationBarTitle({
            title: datas.name,
          });
          that.detailBottom(oilId, 0, 0);
        }
        wx.hideToast()
      },
      function (res) {
        wx.hideToast();
        util.showModal(that)
      }
    )
  },
  //底部信息
  detailBottom: function (oilId, type, tab) {
    util.toast_load();
    var that = this;
    util.send_post(app.globalData.csUrl + "/t/on/site/getOnSiteDetailBottom",
      wx.getStorageSync("token"), {
        onSiteId: oilId,
        type: type
      },
      function (res) {
        if (util.success == res.data.code) {
          let datas = res.data.data;
          if (tab == 0) {
            for (let i = 0; i < datas.length; i++) {
              that.data.oilList.push(datas[i].gunNo + "号枪")
            }
            that.setData({
              oilList: that.data.oilList,
              oilGun: datas.length
            })
          } else if (tab == 1) {
            for (let i = 0; i < datas.length; i++) {
              that.data.priceList.push(datas[i])
            }
            that.setData({
              priceList: that.data.priceList
            })
          } else if (tab == 2) {
            for (let i = 0; i < datas.length; i++) {
              that.data.imgList.push(datas[i].imageUrl)
            }
            that.setData({
              imgList: that.data.imgList
            })
          }
        }
        wx.hideToast();
      },
      function (res) {
        wx.hideToast()
        util.showModal(that)
      }
    )
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var onSiteId = options.data;
    that.setData({
      onSiteId: onSiteId
    });
    this.detailTop(onSiteId);
  },
  //获取当前滑块的index
  bindchange: function (e) {
    const that = this;
    util.toast_load();
    that.clearnData();
    if (e.detail.source === 'touch') {
      that.setData({
        currentData: e.detail.current
      })
      that.detailBottom(that.data.onSiteId, that.data.currentData, that.data.currentData)
    }

  },
  //点击切换，滑块index赋值
  checkCurrent: function (e) {
    const that = this;
    that.clearnData();
    // console.log(that.data.onSiteId)
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentData: e.target.dataset.current
      })
      that.detailBottom(that.data.onSiteId, that.data.currentData, that.data.currentData)
    }
  },
  //清楚数据
  clearnData: function () {
    const that = this;
    that.setData({
      oilList: [],
      priceList: [],
      imgList: []
    });
  },
  //收藏

  //获取详情
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
  onShareAppMessage: function (e) {
    let that = this;
    if (e.from === 'button' || e.from ==='menu') {
      // 来自页面内转发按钮
      util.send_post(app.globalData.csUrl + "/t/ds/mood/share",
        wx.getStorageSync("token"), {},
        function (res) {},
        function (res) {}
      )
    }
    return {
      title: 'UE油网小程序',
      path: 'pages/index/index',
    }
  }

})