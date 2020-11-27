// pages/setting/srtting.js
var util = require('../../utils/util.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    img: ["../../imgs/01.jpg"],
    name: "未登录",
    level: "非会员",
    creatTime: "",
    phoneNumber:"手机号"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.globalData.csUrl + "/t/ac/user/getUserInfo",
      header: {
        'token': wx.getStorageSync("token")
      },
      method: "POST",
      data: {},
      success: function (res) {
        console.log(res.data.data);
        var datas = res.data.data;
        var imgArr = [];
        imgArr.push(datas.headImageUrl);
        that.setData({
          img: imgArr,
          name: datas.nickname,
          level: datas.level + "级会员",
          creatTime: util.timestampDay(datas.createTime),
          phoneNumber:(datas.phoneNumber).replace(datas.phoneNumber.substring(3,7), "****")
        })
      }
    });
    that.storageNum()
  },

  storageNum: function (e) {
    wx.getStorageInfo({
      success(res) {
        console.log(res.keys)
        console.log(res.currentSize)
        console.log(res.limitSize)
      }
    })
  },
  changeImg: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        if (tempFilePaths.length == 0) {
          util.toast("上传失败")
          return;
        } else {
          that.setData({
            img: tempFilePaths,
          });
          console.log(that.data.img)
          wx.uploadFile({
            method: "POST",
            header: {
              'content-type': 'multipart/form-data',
              "token": wx.getStorageSync("token")
            },
            url: app.globalData.csUrl + '/t/ac/user/updateUserInfo',
            name: 'userImage',
            filePath: that.data.img[0],
            success: function (res) {
              var data = JSON.parse(res.data);
              util.toast("上传成功")
            },
            fail: function (e) {
              console.log(e)
            }
          })
        }
      }
    })
  },
  changeName: function (name) {
    var that = this;
    util.send_post(app.globalData.csUrl + '/t/ac/user/updateUserInfo',
      wx.getStorageSync("token"), {
        nickname: name,
        isUpdateName: 1
      },
      function (res) {
        console.log(res.data.code)
        //请求成功的回调函数
        if (res.data.code == 200) {
          that.setData({
            name: name
          });
          util.toast("修改成功")
          console.log(name)
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.message,
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({
                  changed: true
                });
              }
            }
          })
        }
      },
      function (res) {
        util.showModel(that)
      }
    )
  },
  //显示
  showPopup() {
    this.popup.showPopup();
  },
  //取消事件
  _error() {
    console.log('你点击了取消');
    this.popup.hidePopup();
    
  },
  //确认事件
  _success() {
    console.log('你点击了确定');
    this.popup.hidePopup();
    wx.removeStorageSync('token');
    wx.reLaunch({
      url:'../index/index',
    })
  },

  //显示
  showInput() {
    this.inputmodel.showPopup();
  },
  //取消事件
  input_error() {
    console.log('你点击了取消');
    this.inputmodel.hidePopup();
  },
  //确认事件
  input_success(e) {
    let that =this;
    that.inputmodel.hidePopup();
    var nickname = that.inputmodel.data.content;
    if (nickname == "") {
      util.toast("昵称不能为空！")
    } else {
      that.changeName(nickname)
    }
    console.log(this.inputmodel.data.content)
  },
  //跳转信息通知
  goInfoList: function (e) {
    wx.navigateTo({
      url: '../info_list/info_list'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //获得popup组件
    this.popup = this.selectComponent("#showmodel");
    this.inputmodel = this.selectComponent("#inputmodel");
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