var util = require("../../../utils/util.js");
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 1,
    pagesize: 15,
    state: 1,
    userName: "",
    timeIconUrl: "/imgs/timeIcon.png",
    tradingRecord: []
  },
  getTradingRecord: function (pageNum, pagesize) {
    var that = this;
    wx.hideToast();
    util.send_post(app.globalData.csUrl + "/t/ac/prob/log/getProbLogList",
      wx.getStorageSync("token"), 
      {
        page: pageNum,
        size: pagesize
      },
      function(res){
        if(res.data.code==200){
          let datas = res.data.data;
          if (datas.list.lengt < 1) {
            that.setData({
              state: 0
            });
          }else{
            var state1 = 1;
              if (datas.list.length < that.data.pagesize) {
                var state1 = 0;
              }
              if (datas.list.length == 0) {
                wx.showModal({
                  title: '提示',
                  content: '您暂时还没有交易记录,是否返回上一页',
                  success: function (res) {
                    if (res.confirm) {
                      wx.navigateBack({ changed: true });
                    }
                  }
                })
              }
              for (var i = 0; i < datas.list.length; i++) {
                let obj =new Object;
                obj.createTime =util.timestampDay(datas.list[i].createTime);
                obj.eventInfo =datas.list[i].eventInfo;
                obj.step =util.operation.numMultiply(datas.list[i].step,100)
                that.data.tradingRecord.push(obj);
              };
              that.setData({
                tradingRecord: that.data.tradingRecord,
                state: state1
              });
          }
          
        }else{
          util.toast(res.data.message)
        }
      },
      function(res){
        util.showModel(that);
      }
    )
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let name =options.name;
    this.setData({
      userName:name
    })
    util.toast_load();
    this.getTradingRecord(this.data.pageNum,this.data.pagesize)
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
    var that = this;
    if (this.data.state == 0) {
      util.toast_null()
      return;
    } else {
      util.toast_load();
      that.data.pageNum = this.data.pageNum + 1;
      that.collectList(that.data.pageNum, that.data.pagesize)
    }
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

})