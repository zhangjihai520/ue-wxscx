// pages/myself/myself.js
var wxCharts = require('../../utils/wxcharts.js');
var util = require('../../utils/util.js');
var app = getApp();
var ringChart = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIdx: 2,
    user: {
      img: "../../imgs/01.jpg",
      name: "未登录",
      level: "非会员",
      carStatus: "",
    }
  },
  //页面跳转
  go_setting: function (e) {
    wx.navigateTo({
      url: '../setting/setting'
    })
  },
  go_collect: function (e) {
    wx.navigateTo({
      url: '../collect/collect'
    })
  },
  go_record: function (e) {
    let name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: './trading_record/trading_record?name=' + name
    })
  },
  go_mycar: function (e) {
    var carCode = e.currentTarget.dataset.status;
    wx.navigateTo({
      url: './add_licence_plate/licence_plate?data=' + carCode
    })
  },
  goAgree:function(){
    wx.navigateTo({
      url: './user_agree/user_agree'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  make_echarts: function (datas) {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    var subNum = util.operation.numSubtract(1, datas);
    var data1 = util.operation.numMultiply(datas, 100);
    var data2 = util.operation.numMultiply(subNum, 100);
    ringChart = new wxCharts({
      animation: true,
      canvasId: 'ringCanvas',
      type: 'ring',
      extra: {
        ringWidth: 10,
        pie: {
          offsetAngle: -45
        }
      },
      title: {
        name: util.operation.numMultiply(datas, 100) + "%",
        color: '#fff',
        fontSize: 22
      },
      series: [{
        name: '成交量1',
        data: Number(data1),
        stroke: false
      }, {
        name: '成交量2',
        data: Number(data2),
        stroke: false
      }],
      disablePieStroke: true,
      width: windowWidth,
      height: 135,
      dataLabel: false,
      legend: false,
      background: '#5FA3E3',
      padding: 0
    });
  },

  getUserInfo: function (e) {
    var that = this;
    wx.request({
      url: app.globalData.csUrl + "/t/ac/user/getUserInfo",
      header: {
        'token': wx.getStorageSync("token")
      },
      method: "POST",
      data: {},
      success: function (res) {
        // console.log(res);
        var datas = res.data.data;
        if (res.data.code == 402 || res.data.code == 406 || res.data.code == 403) {
          wx.showModal({
            title: '提示',
            content: res.data.message,
            success: function (res) {
              wx.removeStorageSync("token");
              if (res.confirm) {
                wx.navigateTo({
                  url: '../login/login',
                })
              } else {
                wx.reLaunch({
                  url: '../index/index'
                })
              }
            }
          })
        } else if (res.data.code == 200) {
          that.setData({
            user: {
              img: datas.headImageUrl,
              name: datas.nickname,
              level: datas.level + "级会员",
              carStatus: datas.carCode
            }
          })
          that.make_echarts(datas.freeProb);
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (datas) {
    console.log(app.globalData.benUrl)

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.getUserInfo()
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
    if (e.from === 'button' || e.from === 'menu') {
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