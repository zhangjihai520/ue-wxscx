var util = require('../../../utils/util.js');
const app = getApp()
Page({
  // mixins: [require('../../mixin/themeChanged')],
  data: {
    files: [],
    flieArr: [],
    min: 0,
    max: 200,
    currentWordNumber: 200,
    uploaderNum: 0,
    contant: "",
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        let tempFilePaths = res.tempFilePaths;
        let uploaderList = that.data.files.concat(tempFilePaths);
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res1 => { //成功的回调
            let base64 = 'data:image/jpeg;base64,' + res1.data;
            let arr = that.data.flieArr.concat(base64)
            that.setData({
              flieArr: arr
            })
            console.log(that.data.flieArr)
          }
        });
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片

        that.urlTobase64(res.tempFilePaths[0]);
        if (uploaderList.length > 5) {
          wx.showModal({
            title: '提示',
            content: '您输入的图片数已达上限',
          })
        } else {
          that.setData({
            files: uploaderList,
            uploaderNum: uploaderList.length,
          });
        }
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  //获取字数
  fontnNum: function (e) {
    var num = 200;
    var value = e.detail.value;
    var len = parseInt(value.length);
    if (len > this.data.max) return;
    var fontNum = num - len
    this.setData({
      currentWordNumber: fontNum,
      contant: value
    });
    if (this.data.currentWordNumber == 0) {
      wx.showModal({
        title: '提示',
        content: '您输入的次数已达上限',
      })
    }
  },
  // 删除图片
  clearImg: function (e) {
    var nowList = []; //新数据
    var uploaderList = this.data.flieArr; //原数据
    var locaList = this.data.files;
    var local = [];
    for (let i = 0; i < uploaderList.length; i++) {
      if (i == e.currentTarget.dataset.index) {
        continue;
      } else {
        nowList.push(uploaderList[i]);
      }
    }
    for (let i = 0; i < locaList.length; i++) {
      if (i == e.currentTarget.dataset.index) {
        continue;
      } else {
        local.push(locaList[i]);
      }
    }
    this.setData({
      uploaderNum: this.data.uploaderNum - 1,
      flieArr: nowList,
      files: local
    });
    console.log(this.data.flieArr)
  },
  upImgs: function (e) {
    let that = this;
    if (wx.showLoading) {
      // 基础库 1.1.0 微信6.5.6版本开始支持，低版本需做兼容处理
      wx.showLoading({
        title: "上传中...",
        mask: true
      });
    } else {
      // 低版本采用Toast兼容处理并将时间设为20秒以免自动消失
      wx.showToast({
        title: "上传中...",
        icon: 'loading',
        mask: true,
        duration: 20000
      });
    }
    if (that.data.contant == "" || that.data.flieArr.length == 0) {
      if (wx.hideLoading) {
        wx.hideLoading();
      } else {
        wx.hideToast();
      }
      util.toast("信息不完整")
      return;
    }
    wx.request({
      url: app.globalData.csUrl + '/t/ds/mood/addDsMood',
      header: {
        "Content-Type": "application/json",
        "token": wx.getStorageSync("token")
      },
      method: "POST",
      data: {
        content: that.data.contant,
        paramImages: that.data.flieArr
      },
      success(res) {
        if (res.data.code == 402 || res.data.code == 406 || res.data.code == 403) {
          wx.showModal({
            title: '提示',
            content: res.data.message,
            success: function (res) {
              wx.removeStorageSync("token");
              if (res.confirm) {
                wx.reLaunch({
                  url: '../../login/login'
                })
              } else {
                wx.navigateBack({
                  changed: true
                });
              }
            }
          })
        } else if (res.data.code == 200) {
          wx.showModal({
            title: '提示',
            content: '上传成功',
            success: res => {
              if (res.confirm) {
                that.clearData();
              } else {
                that.clearData();
              }
            }
          })
        }
        if (wx.hideLoading) {
          wx.hideLoading();
        } else {
          wx.hideToast();
        }
      },
      fail(res) {
        if (wx.hideLoading) {
          wx.hideLoading();
        } else {
          wx.hideToast();
        }
        util.showModal(that)
      }
    })
  },
  clearData: function (e) {
    var that = this;
    that.setData({
      files: [],
      flieArr: [],
      min: 0,
      max: 200,
      currentWordNumber: 200,
      uploaderNum: 0,
      contant: "",
    })
  },
  onLoad: function (e) {},

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
  },
});