// pages/myself/myself.js
var util = require("../../../utils/util.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIdx: 2,
    plateNumber: "赣A11111",
    plateNumberArray: [{
      index0: "赣", 
      index1: "A", 
      index2: "1",
      index3: "1",
      index4: "1",
      index5: "1",
      index6: "1",
      index7:""
      }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    var carCode = options.data;
    if(carCode==""){
      wx.showModal({
        cancelColor: '提示',
        content: '获取车辆失败',
          success:function(res){
            if (res.confirm) {
              wx.navigateBack({ changed: true });
            }
          } 
      })
    }
    var codes = carCode.split('');
    _this.setData({
      plateNumber: carCode,
      plateNumberArray: [{
        index0: codes[0],
        index1: codes[1],
        index2: codes[2],
        index3: codes[3],
        index4: codes[4],
        index5: codes[5],
        index6: codes[6],
        index7: ""
      }]
    });
  },
  //添加或修改车牌号
  addCars: function (code){
  var that =this;
    util.send_post(app.globalData.csUrl + "/t/ac/user/addCarCard",
    wx.getStorageSync("token"), {
      carCode: code
    },
    function (res) {
      if (res.data.code == 200) {
        wx.showModal({
          title: '提示',
          content: '车牌号修改成功',
          success:function(res){
            if (res.confirm) {
              wx.navigateBack({ changed: true });
            }
          } 
        })
      } 
    },
    function (res) {
      util.showModel(that);
    }
  )
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
  },

  saveBtnClick: function() {
    var plateNumber = this.data.plateNumber;
    this.addCars(plateNumber);
  },

  plateNumberInput: function(e) {
    console.log(e.detail);
    this.setData({
      plateNumber: e.detail
    })
  }

})