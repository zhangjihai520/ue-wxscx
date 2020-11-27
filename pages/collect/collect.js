// pages/collect/collect.js
var util =require("../../utils/util.js");
const app =getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 1,
    pagesize: 15,
    collect_list: [],
    state: 1,
  },
  
  collectList: function (pageNum, pagesize){ 
    var that =this;
    util.send_post(app.globalData.csUrl + "/t/ds/mood/getDsCollectList",
        wx.getStorageSync("token"), 
        {
          page: pageNum,
          size: pagesize
        },
        function(res){ 
          wx.hideToast();
          if(res.data.code==200){
            var datas = res.data.data;
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
                  content: '您暂时还没有收藏信息,是否返回上一页',
                  success: function (res) {
                    if (res.confirm) {
                      wx.navigateBack({ changed: true });
                    }
                  }
                })
              }
              for (var i = 0; i < datas.list.length; i++) {
                that.data.collect_list.push(datas.list[i]);
              };
              that.setData({
                collect_list: that.data.collect_list,
                state: state1
              });
            }
           
          }else{
            util.toast(res.data.message)
          }
          
        },
      function (res) {
        util.showModel(that)
      }
    )
  },
  
  goPostDetail: function (e) {
    let dsMoodId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../post_detail/post_detail?dsMoodId=' + dsMoodId
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.toast_load();
    var that =this;
    that.collectList(that.data.pageNum, that.data.pagesize)
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
  }
})