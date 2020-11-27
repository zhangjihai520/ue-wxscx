// pages/info_list/info_list.js
var util = require("../../utils/util.js");
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 1,
    pagesize: 15,
    state: 1,
    info_list: [],
  },
  //消息列表
  info_list: function (pageNum, pagesize) {
    var that = this;
    util.send_post(app.globalData.csUrl + "/t/mg/body/getNewsList",
      wx.getStorageSync("token"), {
        page: pageNum,
        size: pagesize
      },
      function (res) {
        if (res.data.code == 200) {
          wx.hideToast();
          var datas = res.data.data;
          if (datas.list.lengt < 1) {
            that.setData({
              state: 0
            });
          } else {
            var state1 = 1;
            if (datas.list.length < that.data.pagesize) {
              var state1 = 0;
            }
            if (datas.list.length == 0) {
              wx.showModal({
                title: '提示',
                content: '您暂时还没有消息通知,是否返回上一页',
                success: function (res) {
                  if (res.confirm) {
                    wx.navigateBack({
                      changed: true
                    });
                  }
                }
              })
            }
            for (let i = 0; i < datas.list.length; i++) {
              let obj = new Object;
              obj.createTime = util.timestampToTime(datas.list[i].createTime);
              obj.title = datas.list[i].title;
              obj.content = datas.list[i].content;
              obj.isRead = datas.list[i].isRead;
              obj.mgTargetId = datas.list[i].mgTargetId;
              that.data.info_list.push(obj);
            };
            that.setData({
              info_list: that.data.info_list,
              state: state1
            });
          }

        } else {
          util.toast(res.data.message)
        }

      },
      function (res) {
        util.showModel(that)
      }
    )
  },
  //消息已读
  infoRed: function (e) {
    var that = this;
    let content = e.currentTarget.dataset.content;
    util.send_post(app.globalData.csUrl + "/t/mg/body/newsIsRead",
      wx.getStorageSync("token"), {
        mgTargetId: e.currentTarget.dataset.id
      },
      function (res) {
        if (res.data.code == 200) {

          // that.onLoad()
          wx.showModal({
            title: '消息详情',
            content: content,
            showCancel:false,//隐藏取消按钮
            confirmText:"确认",//只保留确定更新按钮
            success: function (res) {
              that.setData({
                info_list: []
              })
              that.onLoad()
            }
          })
        }
      },
      function (res) {
        util.showModel(that)
      }
    )
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.toast_load();
    this.info_list(this.data.pageNum, this.data.pagesize)
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
      that.info_list(that.data.pageNum, that.data.pagesize)
    }

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