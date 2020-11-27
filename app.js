//app.js
var util = require("./utils/util.js");
App({
  onLaunch: function() {
    this.autoUpdate();
    var that = this;
    // 展示本地存储能力
    // that.getCurrentLocal();
    // 隐藏原生的tabbar
    wx.hideTabBar()
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {

        }
        // console.log(res)
      }
    });
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    });
    // 获取设备信息
    wx.getSystemInfo({
      success: (res) => {
        // console.log(res);
        this.globalData.systeminfo = res
      },
    })
    // 获得胶囊按钮位置信息
    this.globalData.headerBtnPosi = wx.getMenuButtonBoundingClientRect();


  },
  autoUpdate: function() {
    var self = this
    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
     const updateManager = wx.getUpdateManager()
     //1. 检查小程序是否有新版本发布
     updateManager.onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调
      if (res.hasUpdate) {
       //检测到新版本，需要更新，给出提示
       wx.showModal({
        title: '更新提示',
        content: '检测到新版本，是否下载新版本并重启小程序？',
        success: function(res) {
         if (res.confirm) {
          //2. 用户确定下载更新小程序，小程序下载及更新静默进行
          self.downLoadAndUpdate(updateManager);
          
         } else if (res.cancel) {
          //用户点击取消按钮的处理，如果需要强制更新，则给出二次弹窗，如果不需要，则这里的代码都可以删掉了
          wx.showModal({
           title: '温馨提示~',
           content: '本次版本更新涉及到新的功能添加，旧版本无法正常访问的哦~',
           showCancel:false,//隐藏取消按钮
           confirmText:"确定更新",//只保留确定更新按钮
           success: function(res) {
            if (res.confirm) {
             //下载新版本，并重新应用
             self.downLoadAndUpdate(updateManager)
            }
           }
          })
         }
        }
       })
      }
     })
    } else {
     // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
     wx.showModal({
      title: '提示',
      content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
     })
    }
   },
   /**
    * 下载小程序新版本并重启应用
    */
   downLoadAndUpdate: function (updateManager){
    var self=this
    // wx.showLoading();
    //静默下载更新小程序新版本
    updateManager.onUpdateReady(function () {
     //新的版本已经下载好，调用 applyUpdate 应用新版本并重启
     updateManager.applyUpdate()
    })
    updateManager.onUpdateFailed(function () {
     // 新的版本下载失败
     wx.showModal({
      title: '已经有新版本了哟~',
      content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
     })
    })
   },
  globalData: {
    userInfo: null,
    longitude: 0,
    latitude: 0,
    // csUrl: "http://dev.youone.cn/wxscx-api",
    // csUrl: "http://192.168.0.88:8084/wxscx-api",
    csUrl: "https://www.youone.cn/wxscx-api",
    openid: "",
    systeminfo: {}, // 系统信息
    headerBtnPosi: {} // 胶囊按钮位置信息
  },
  /*发送请求 */
  request(param = {}, successFn, failFn) {
    wx.request({
      "url": this.globalData.csUrl + param.url,
      "method": param.method || "POST",
      "data": param.data || {},
      header: {
        "Content-Type": "application/x-www-form-urlencoded", //POST方式是这个
        "token": wx.getStorageSync("token")
      },
      "success": (res) => {
        if (res.statusCode == 200) {
          successFn && successFn(res.data);
        } else {
          wx.hideLoading();
          this.showToast("请求失败，请重试！");
        }
      },
      "fail": () => {
        wx.hideLoading();
        if (failFn) {
          failFn();
        } else {
          this.showToast("网络错误！请重试！");
        }
      }
    });
  },

})