//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js');
Page({
  data: {
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, // 是否显示左上角图标   1表示显示    0表示不显示
      title: '登录', // 导航栏 中间的标题
      textColor: '#fff', // 标题颜色
      bgColor: '#3281ff', // 导航栏背景颜色
      btnBgColor: '#2B6ED9', // 胶囊按钮背景颜色
      iconColor: 'white', // icon颜色 black/white
      borderColor: 'rgba(255, 255, 255, 0.3)' // 边框颜色 格式为 rgba()，透明度为0.3
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.systeminfo.statusBarHeight * 2 + 20,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    getPhone: false,
    showModel: false,
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    if (e.detail.errMsg == "getUserInfo:fail auth deny") {
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: false
      });
    } else {
      app.globalData.userInfo = e.detail.userInfo;
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      });
    }
  },
  //登录
  appLogin: function (e) {
    
    var that = this;
    if (that.data.userInfo.nickName == undefined) {
      util.toast("请先获取用户信息");
      return;
    }
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          var code = res.code; //返回code
          util.send_post(app.globalData.csUrl + "/t/ac/user/userAuth", "", {
            code: code,
            thirdType: 0
          }, function (res) {
            if (res.data.code == 200) {
              that.setData({
                showModel: false,
                getPhone: false
              })
              const datas = res.data.data;
              wx.setStorageSync("token", datas.token);
              wx.reLaunch({
                url: '../index/index',
              });
            } else if (res.data.code == 407) { //注册
              that.setData({
                getPhone: true,
                showModel: true,
              })
            } else {
              util.toast(res.data.message);
            }
          }, function (res) {
            util.showModal(that)
          })
        }
      },
      function (res) {
        util.showModal(that)
      }
    });
  },

  //获取手机号码并注册
  getPhoneNumber: function (e) {
    var that = this;
    that.setData({
      getPhone: false,
      showModel: false,
    })
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      wx.login({
        success: res => {
          if (res.code) {
            wx.request({
              url: app.globalData.csUrl + '/t/ac/user/register',
              header: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              data: {
                code: res.code,
                vi: e.detail.iv,
                encryptedData: e.detail.encryptedData,
                sex: Number(that.data.userInfo.gender),
                nickname: that.data.userInfo.nickName,
                thirdType: 0
              },
              method: "post",
              success: function (res) {
                if (res.data.code == 200) {
                  const datas = res.data.data;
                  wx.setStorageSync("token", datas.token);
                  wx.reLaunch({
                    url: '../index/index',
                  });
                } else {
                  util.toast(res.data.message);
                }

              },
              fail: function (res) {
                util.showModal(that)
              }
            })
          }
        }
      })

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