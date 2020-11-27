// pages/serves_info/serves_info.js
var util = require("../../utils/util.js");
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serviceInfo: {
      name: '',
      address: '',
      phoneNumber: '',
      img: '',
      serviceInfo:''
    }
  },

  getService: function(id) {
    util.toast_load();
    var that = this;
    util.send_post(app.globalData.csUrl + "/t/cs/service/getCarServiceStationDetail",
      wx.getStorageSync("token"), {
        csServiceId: id,
        longitude: wx.getStorageSync("longitude"),
        latitude: wx.getStorageSync("latitude")
      },
      function(res) {
        console.log(res)
        if (util.success == res.data.code) {
          let datas = res.data.data;
          var imgs = "";
          if (datas.tCsSvcImages == "") {
            imgs = "";
          } else {
            imgs = datas.tCsSvcImages[0].imageUrl
          }
          that.setData({
            serviceInfo: {
              name: datas.storeName,
              address: datas.provinceName + datas.cityName + datas.districtName + datas.storeAddress,
              phoneNumber: datas.storeTel,
              img: imgs,
              serviceInfo: datas.serviceDesc
            }
          })
          
        }
        wx.hideToast();
      },
      function(res) {

      }
    )
  },
//拨打电话
callPhone:function (e) {
  let phone =e.currentTarget.id
  wx.makePhoneCall({
    phoneNumber: phone,
    success(res){},
      fail(res){}
  })
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var serveId = options.data;
    that.getService(serveId)
    console.log(serveId)
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