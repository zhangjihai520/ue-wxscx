// pages/post_detail/post_detail.js
const app = getApp();
var util = require("../../utils/util.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    swiperHeight: "",
    inputShow: false,
    min: 0,
    max: 200,
    currentWordNumber: 200,
    moodDetailsTop: {
      authorImageUrl: "",
      authorName: "",
      collectCount: "",
      commentCount: "",
      likeCount: "",
      isLike: "",
      content: "",
      createTime: "",
      dsMoodId: "",
    },
    moodDetailsComment: [],
    writeBack: [],
    moodIconLike: "../../imgs/icon_like.png",
    moodIconEnshrine: "../../imgs/icon_star2.png",
    dsMoodId: "",
    replyContent: "",
    addDsMoodId: "",
    page: 1,
    state: 1, //下拉状态
    //轮播
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    imgUrls: [], //轮播图
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const _this = this;
    // var platform = this.data.systemInfo.platform;
    /* 使用全局 request 请求方法 */
    app.request({
      "url": '/t/ds/mood/getMoodDetailsTop', // 请求地址，必需的
      "method": "POST", // 提交方式，默认POST,默认时可省略
      "data": {
        "dsMoodId": options.dsMoodId
      } // 提交数据，默认undefined,不需要提交数据时可省略
    }, (res) => {
      //请求成功的回调函数
      if (res.code == 200) {
        var moodDetailsTop = res.data;
        _this.setData({
          imgUrls: moodDetailsTop.tDsMoodImages
        })
        var moodIconLike = "";
        if (moodDetailsTop.isLike == 1) {
          moodIconLike = "../../imgs/icon_like_checked.png";
        } else {
          moodIconLike = "../../imgs/icon_like.png";
        }
        var moodIconEnshrine = "";
        if (moodDetailsTop.isCollect == 1) {
          moodIconEnshrine = "../../imgs/collect.png";
        } else {
          moodIconEnshrine = "../../imgs/icon_star2.png";
        }
        _this.setData({
          moodIconEnshrine: moodIconEnshrine,
          moodIconLike: moodIconLike,
          moodDetailsTop: {
            authorImageUrl: moodDetailsTop.authorImageUrl,
            authorName: moodDetailsTop.authorName,
            collectCount: moodDetailsTop.collectCount,
            commentCount: moodDetailsTop.commentCount,
            likeCount: moodDetailsTop.likeCount,
            isLike: moodDetailsTop.isLike,
            content: moodDetailsTop.content,
            dsMoodId: moodDetailsTop.dsMoodId,
            createTime: util.timestampDay(moodDetailsTop.createTime)
          },
          "dsMoodId": options.dsMoodId
        })
        getMoodDetailsComment(options.dsMoodId, 1, 3, _this, 0);
      }else if(res.code==403 ||res.code==402 ||res.code==406){
        wx.showModal({
          title: '提示',
          content: res.message,
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../login/login',
              })
            }else{
              wx.reLaunch({
                url: '../index/index',
              })
            }
          }
        })
      }
    }, () => {
      //请求失败的回调函数，不需要时可省略
    });
    
  },
  //动态设置swiper高度
  autoHeight(_this, platform) {
    var obj = wx.createSelectorQuery();
    var height;
    obj.selectAll('.boxTop,.itemTitle,').boundingClientRect(function(rect) {
      height = wx.getSystemInfoSync().windowHeight - rect[0].height - rect[1].height + "px";
      // console.log(wx.getSystemInfoSync().windowHeight);
      _this.setData({
        swiperHeight: height
      })
    })
    obj.exec();
  },
  //获取字数
  fontnNum: function(e) {
    //获取文本内容
    this.setData({
      replyContent: e.detail.value
    })
    var num = 200;
    var value = e.detail.value;
    var len = parseInt(value.length);
    if (len > this.data.max) return;
    var fontNum = num - len
    this.setData({
      currentWordNumber: fontNum
    });
    if (this.data.currentWordNumber == 0) {
      wx.showModal({
        title: '提示',
        content: '您输入的字数已达上限',
      })
    }
  },
  //显示输入域
  showInput: function(e) {
    var that = this;
    that.setData({
      inputShow: true,
      addDsMoodId: e.currentTarget.dataset.id
    })
  },
  hideShow: function(e) {
    var that = this;
    that.setData({
      inputShow: false,
    })
  },
  sendInfo: function(e) {
    var that = this;
    var content = that.data.replyContent;
    if (null == content || content == '') {
      wx.showModal({
        title: '提示',
        content: '请输入内容！！！',
      })
    } else {
      app.request({
        "url": '/t/ds/mood/addComment', // 请求地址，必需的
        "method": "POST", // 提交方式，默认POST,默认时可省略
        "data": {
          "dsMoodId": that.data.addDsMoodId,
          "content": content
        } // 提交数据，默认undefined,不需要提交数据时可省略
      }, (res) => {
        //请求成功的回调函数
        if (res.code == 200) {
          if (that.data.addDsMoodId == that.data.dsMoodId) {
            var commentCount = that.data.moodDetailsTop.commentCount + 1;
            var up = "moodDetailsTop.commentCount"
            that.setData({
              inputShow: false,
              [up]: commentCount
            });
          } else {
            that.setData({
              inputShow: false
            });
          }
          getMoodDetailsComment(that.data.dsMoodId, 1, 10, that, 0);
        } else {
          wx.showModal({
            title: '提示',
            content: res.message,
            success: function(res) {
              if (res.confirm) {
                wx.navigateBack({ changed: true });
              }
            }
          })
        }
      }, () => {
        //请求失败的回调函数，不需要时可省略
      })
    }
  },
  //收藏
  enshrine: function(e) {
    var that = this;
    app.request({
      "url": '/t/ds/mood/addCollectDsMood', // 请求地址，必需的
      "method": "POST", // 提交方式，默认POST,默认时可省略
      "data": {
        "dsMoodId": e.currentTarget.dataset.id
      } // 提交数据，默认undefined,不需要提交数据时可省略
    }, (res) => {
      //请求成功的回调函数
      if (res.code == 200) {
        var collectCount = that.data.moodDetailsTop.collectCount + 1;
        var up = "moodDetailsTop.collectCount"
        that.setData({
          [up]: collectCount,
          moodIconEnshrine: "../../imgs/collect.png"
        });
      } else {
        wx.showModal({
          title: '提示',
          content: res.message,
        })
      }
    }, () => {
      //请求失败的回调函数，不需要时可省略
    })
  },
  //点赞
  likeDsMood: function(e) {
    var that = this;
    app.request({
      "url": '/t/ds/mood/addLikeDsMood', // 请求地址，必需的
      "method": "POST", // 提交方式，默认POST,默认时可省略
      "data": {
        "dsMoodId": e.currentTarget.dataset.id
      } // 提交数据，默认undefined,不需要提交数据时可省略
    }, (res) => {
      //请求成功的回调函数
      if (res.code == 200) {
        var moodIconLike = "";
        var likeCount = 0;
        if (e.currentTarget.dataset.id == that.data.dsMoodId) {
          if (res.data.likeType == 1) {
            likeCount = that.data.moodDetailsTop.likeCount + 1;
            moodIconLike = "../../imgs/icon_like_checked.png";
          } else {
            likeCount = that.data.moodDetailsTop.likeCount - 1;
            moodIconLike = "../../imgs/icon_like.png";
          }
          var up = "moodDetailsTop.likeCount"
          that.setData({
            [up]: likeCount,
            moodIconLike: moodIconLike
          });
        } else {
          var index = e.target.dataset.index;
          if (res.data.likeType == 1) {
            likeCount = that.data.moodDetailsComment[index].likeCount + 1;
            moodIconLike = "../../imgs/icon_like_checked.png";
          } else {
            likeCount = that.data.moodDetailsComment[index].likeCount - 1;
            moodIconLike = "../../imgs/icon_like.png";
          }
          var up = "moodDetailsComment[" + index + "].moodIconLike"
          var upLikeCount = "moodDetailsComment[" + index + "].likeCount"
          that.setData({
            [up]: moodIconLike,
            [upLikeCount]: likeCount
          });
        }
      } else {
        wx.showModal({
          title: '提示',
          content: res.message,
         
        })
      }
    }, () => {
      //请求失败的回调函数，不需要时可省略
    })

  },
  //查看回复
  seeTheReply: function(e) {
    var that = this;
    getMoodDetailsComment(e.target.dataset.id, 1, 10, that, e.target.dataset.index);
    // var index = e.target.dataset.index;
    // var seeTheReply = "moodDetailsComment[" + index + "].seeTheReply";
    // var packUp = "moodDetailsComment[" + index + "].packUp";
    // this.setData({
    //   [seeTheReply]: false,
    //   [packUp]: true,
    // })
  },
  packUp: function(e) {
    var index = e.target.dataset.index;
    var seeTheReply = "moodDetailsComment[" + index + "].seeTheReply";
    var packUp = "moodDetailsComment[" + index + "].packUp";
    this.setData({
      [seeTheReply]: true,
      [packUp]: false,
    })
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
    this.autoHeight(this);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

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
    var that = this;
    if (this.data.state == 0) {
      util.toast("已经没有更多拉...")
      return;
    } else {
      that.data.page = this.data.page + 1;
      console.log(that.data.page)
      getMoodDetailsComment(that.data.dsMoodId, that.data.page, 3, that, 0);
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

//获取评价和回复
function getMoodDetailsComment(dsMoodId, page, size, _this, index) {
  util.toast_load();
  app.request({
    "url": '/t/ds/mood/getMoodDetailsComment', // 请求地址，必需的
    "method": "POST", // 提交方式，默认POST,默认时可省略
    "data": {
      "dsMoodId": dsMoodId,
      "page": page,
      "size": size,
    } // 提交数据，默认undefined,不需要提交数据时可省略
  }, (res) => {
    wx.hideToast();
    //请求成功的回调函数
    if (res.code == 200) {
      var moodDetailsTop = res.data;
      if (res.data.list.length < 1) {
        _this.setData({
          state: 0
        })
        return;
      }
      if (dsMoodId == _this.data.dsMoodId) {
        _this.setData({
          moodDetailsComment: _this.data.moodDetailsComment.concat(res.data.list)
        })
      } else {
        var seeTheReply = "moodDetailsComment[" + index + "].seeTheReply";
        var packUp = "moodDetailsComment[" + index + "].packUp";
        _this.setData({
          [seeTheReply]: false,
          [packUp]: true,
          writeBack: res.data.list
        })
      }
     
    }else if(res.data.code == 402 ||res.data.code == 406 || res.data.code == 403){
      wx.showModal({
        title: '提示',
        content: res.message,
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login',
            })
          }else{
            wx.reLaunch({
              url: '../index/index',
            })
          }
        }
      })
    }
    
  }, () => {
    wx.hideToast();
    //请求失败的回调函数，不需要时可省略
  })
};