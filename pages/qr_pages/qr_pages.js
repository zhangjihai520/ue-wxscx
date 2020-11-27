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
      arrMark: []
    },
    onSiteId: "",
    currentData: 0,
    oilList: [],
    priceList: [],
    imgList: [],
    oilGun: 0,
    lot:"",
    lat:""
  },

  //头部信息
  detailTop: function(lot,lat,tab) {
    util.toast_load();
    var that = this;
    util.send_post(app.globalData.csUrl + "/t/on/site/scanCodeOnSiteDetail",
      wx.getStorageSync("token"), {
        longitude: lot,
        latitude: lat
      },
      function(res) {
        console.log(res)
        if (res.data.code == 200) {
          let datas = res.data.data;
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
              arrMark: datas.tOnLabels
            }
          });
          wx.setNavigationBarTitle({
            title: datas.name,
          });
          if (tab == 0) {
            for (let i = 0; i < datas.tOnSiteGuns.length; i++) {
              that.data.oilList.push(datas.tOnSiteGuns[i].gunNo + "号枪")
            }
            that.setData({
              oilList: that.data.oilList,
              oilGun: datas.length
            })
          } else if (tab == 1) {
            for (let i = 0; i < datas.tOiRealPrices.length; i++) {
              that.data.priceList.push(datas.tOiRealPrices[i])
            }
            that.setData({
              priceList: that.data.priceList
            })
          } else if (tab == 2) {
            for (let i = 0; i < datas.tOnSiteImages.length; i++) {
              that.data.imgList.push(datas.tOnSiteImages[i].imageUrl)
            }
            that.setData({
              imgList: that.data.imgList
            })
          }
         
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.message,
            success: function(res) {
              if (res.confirm) {
                wx.navigateBack({
                  changed: true
                });
              }
            }
          })
        }
        wx.hideToast();
      },
      function(res) {
        util.showModal(that)
      }
    )
  },
  // 获取当前地理位置
  getMyLocation: function(e) {
    let that = this
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        let latitude = res.latitude;
        let longitude = res.longitude;
        that.setData({
          lot: longitude,
          lat: latitude
        });
        that.detailTop(that.data.lot,that.data.lat,0)
      },
      fail(res) {
        util.showModal(that)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    
    this.getMyLocation();
  },
  //获取当前滑块的index
  bindchange: function(e) {
    const that = this;
    util.toast_load();
    that.clearnData();
    if (e.detail.source === 'touch') {
      that.setData({
        currentData: e.detail.current
      })
      that.detailTop(that.data.lot, that.data.lat,that.data.currentData)
    }

  },
  //点击切换，滑块index赋值
  checkCurrent: function(e) {
    const that = this;
    that.clearnData();
    // console.log(that.data.onSiteId)
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentData: e.target.dataset.current
      })
      that.detailTop(that.data.lot, that.data.lat,that.data.currentData)
    }
  },
  //清楚数据
  clearnData: function() {
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
    console.log("aaaaaaaaaaaaaaa")
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