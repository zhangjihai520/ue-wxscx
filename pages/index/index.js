//index.js
//获取应用实例
var util = require('../../utils/util.js');
const app = getApp()
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: {},
    imgUrls: [],
    currentTab: 0,
    pageNum: 1,
    pagesize: 5,
    //加载更多状态
    state: 1,
    itemList: ["推荐", "车生活", "广场"],
    listData: [],
    cssArr: [0, 1, 2, 3, 4],
    activeIdx: 0,
    serveList: [],
    carsInfo_list: [],
    swiperHeight: 0,
    systemInfo: "",
    inputValue: "",
    infoNum: 0,
    lot: 0,
    lat: 0
  },
  //滑动切换
  swiperTab: function (e) {
    const that = this;
    if (e.detail.source === 'touch') {
      that.setData({
        currentTab: e.detail.current
      });
      var value = "";
      that.clearnData(value);
      util.toast_load();
      if (that.data.currentTab == 0) {
        that.getOnSiteList(that.data.pagesize, that.data.pageNum, this.data.inputValue, wx.getStorageSync("token"))
      } else if (that.data.currentTab == 1) {
        that.getCarServiceList(that.data.pagesize, that.data.pageNum, this.data.inputValue);
      } else if (that.data.currentTab == 2) {
        that.getMoodList(that.data.pagesize, that.data.pageNum, this.data.inputValue)
      }
    }
  },

  //点击切换
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
      var value = "";
      that.clearnData(value);
      util.toast_load();
      if (that.data.currentTab == 0) {
        that.getOnSiteList(that.data.pagesize, that.data.pageNum, this.data.inputValue)
      } else if (that.data.currentTab == 1) {
        that.getCarServiceList(that.data.pagesize, that.data.pageNum, this.data.inputValue);
      } else if (that.data.currentTab == 2) {
        that.getMoodList(that.data.pagesize, that.data.pageNum, this.data.inputValue)
      }
    }
  },
  //输入搜索
  getInput: function (e) {
    var that = this;
    var value = e.detail.value;
    that.clearnData(value);
    if (that.data.currentTab == 0) {
      that.getOnSiteList(that.data.pagesize, that.data.pageNum, this.data.inputValue)
    } else if (that.data.currentTab == 1) {
      that.getCarServiceList(that.data.pagesize, that.data.pageNum, this.data.inputValue);
    } else if (that.data.currentTab == 2) {
      that.getMoodList(that.data.pagesize, that.data.pageNum, this.data.inputValue)
    }
  },
  //清楚数据
  clearnData: function (value) {
    const that = this;
    that.setData({
      pageNum: 1,
      state: 0,
      listData: [],
      serveList: [],
      carsInfo_list: [],
      inputValue: value
    });
  },
  // 页面跳转
  change_page: function (e) {
    let onSiteId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../oil_detail/oil_detail?data=' + onSiteId
    })
  },
  goServes: function (e) {
    let csServiceId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../serves_info/serves_info?data=' + csServiceId
    })
  },
  goInfoList: function (e) {
    wx.navigateTo({
      url: '../info_list/info_list'
    })
  },
  goAddPost: function (e) {
    wx.navigateTo({
      url: '../post_detail/send_post/send_post'
    })
  },
  goPostDetail: function (e) {
    let dsMoodId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../post_detail/post_detail?dsMoodId=' + dsMoodId
    })
  },
  // 清除输入框
  clearnInput(e) {
    const that = this;
    var current = e.detail.current;
    var value = "";
    that.clearnData(value);
    if (that.data.currentTab == 0) {
      that.getOnSiteList(that.data.pagesize, that.data.pageNum, this.data.inputValue)
    } else if (that.data.currentTab == 1) {
      that.getCarServiceList(that.data.pagesize, that.data.pageNum, this.data.inputValue);
    } else if (that.data.currentTab == 2) {
      that.getMoodList(that.data.pagesize, that.data.pageNum, this.data.inputValue)
    }
  },


  //页面加载
  onLoad: function () {
    wx.hideTabBar();
    var that = this;
    that.getSystemInfo(that);
    var platform = that.data.systemInfo.platform;
    that.autoHeight(that, platform);
    that.getCurrentLocal();
  },
  onShow: function () {
   
  },
  //动态设置swiper高度
  autoHeight(_this, platform) {
    var obj = wx.createSelectorQuery();
    var height;
    obj.selectAll('.tab_box,.input_box,').boundingClientRect(function (rect) {
      if (platform == "android") {
        height = wx.getSystemInfoSync().windowHeight - rect[0].height - rect[1].height - 50 + "px";
      } else {
        height = wx.getSystemInfoSync().windowHeight - rect[0].height - rect[1].height - 15 + "px";
      }
      _this.setData({
        swiperHeight: height
      })
    })
    obj.exec();
  },

  // 获取机型
  getSystemInfo(_this) {
    wx.getSystemInfo({
      success: function (res) {
        var that = _this;
        that.setData({
          systemInfo: res,
        })
      }
    })
  },
  //获取消息数量
  infoNum: function (e) {
    var that = this;
    wx.request({
      url: app.globalData.csUrl + "/t/mg/body/getNewsCount",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "token":wx.getStorageSync("token")
      },
      method: "POST",
      data: {},
      success(res){
        if (res.data.code == 402 ||res.data.code == 406){
          wx.showModal({
            title: '提示',
            content: res.data.message,
            success: function (res) {
              wx.removeStorageSync("token");
              if (res.confirm) {
                wx.reLaunch({
                  url: '../login/login'
                })
              } else {
                console.log('点击取消回调')
              }
            }
          })
        }else if (res.data.code == 200) {
          that.setData({
            infoNum: res.data.data.count
          });
        }else{
          console.log(res)
        }
      },
      fail(res) {
        util.showModal(that)
      }
    })
  },
  //推荐
  getOnSiteList: function (pagesize, pageNum, value) {
    util.toast_load();
    var that = this;
    util.list_post(app.globalData.csUrl + "/t/on/site/getOnSiteList", {
        longitude: that.data.lot,
        latitude: that.data.lat,
        size: pagesize,
        page: pageNum,
        searchName: value
      },
      function (res) {
        let code = res.data.code;
        if (util.success == code) {
          var datas = res.data.data;
          // console.log(datas)
          if (datas.list.lengt < 1) {
            that.setData({
              state: 0
            });
          } else {
            var state1 = 1;
            if (datas.list.length < that.data.pagesize) {
              var state1 = 0;
            }
            for (var i = 0; i < datas.list.length; i++) {
              that.data.listData.push(datas.list[i]);
            };
            that.setData({
              listData: that.data.listData,
              state: state1
            });

          };
        }
        wx.hideToast();
      },
      function (res) {
        util.showModel(that)
      }
    )
  },

  //车生活
  getCarServiceList: function (pagesize, pageNum, value) {
    var that = this;
    util.list_post(app.globalData.csUrl + "/t/cs/service/getCarServiceStationList", {
        longitude: that.data.lot,
        latitude: that.data.lat,
        size: pagesize,
        page: pageNum,
        searchName: value
      },
      function (res) {
        let code = res.data.code;
        if (util.success == code) {
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
            for (var i = 0; i < datas.list.length; i++) {
              that.data.serveList.push(datas.list[i]);
            };
            that.setData({
              serveList: that.data.serveList,
              state: state1
            });

          };
        }
        wx.hideToast();
      },
      function (res) {
        util.showModel(that)
      }
    )
  },
  //广场
  getMoodList: function (pagesize, pageNum, value) {
    var that = this;
    util.list_post(app.globalData.csUrl + "/t/ds/mood/getMoodList", {
        size: pagesize,
        page: pageNum,
        searchName: value
      },
      function (res) {
        let code = res.data.code;
        if (util.success == code) {
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
            for (var i = 0; i < datas.list.length; i++) {
              that.data.carsInfo_list.push(datas.list[i]);
            };
            that.setData({
              carsInfo_list: that.data.carsInfo_list,
              state: state1
            });

          };
        } else {
          wx.showModal({
            title: '提示',
            content: res.message,
            success: function (res) {
              if (res.confirm) {
                that.onLoad()
              }
            }
          })
        }
        wx.hideToast();
      },
      function (res) {
        util.showModel(that)
      }
    )
  },

  /**
   * 页面上拉触底事件的处理函数，与点击加载更多做同样的操作
   */
  onReachBottom: function () {
    var that = this;
    if (this.data.state == 0) {
      util.toast("已经没有更多拉...")
      return;
    } else {
      util.toast_load();
      that.data.pageNum = this.data.pageNum + 1;
      if (that.data.currentTab == 0) {
        that.getOnSiteList(that.data.pagesize, that.data.pageNum, this.data.inputValue)
      } else if (that.data.currentTab == 1) {
        that.getCarServiceList(that.data.pagesize, that.data.pageNum, this.data.inputValue);
      } else if (that.data.currentTab == 2) {
        that.getMoodList(that.data.pagesize, that.data.pageNum, this.data.inputValue)
      }
    }
  },

  

  // 获取当前地理位置 授权验证
  getCurrentLocal: function (e) {
    let that = this;
    wx.getSetting({
      success: (res) => {
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                util.toast('授权失败')
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      that.onLoad();
                      //再次授权，调用wx.getLocation的API
                    } else {
                      that.onLoad();
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          that.getMyLocation();
          //调用wx.getLocation的API
        } else {
          //调用wx.getLocation的API
          that.getMyLocation();
        }
      },
      fail: function (e) {
        util.showModel(that)
      }
    })
  },
  // 获取当前地理位置
  getMyLocation: function (e) {
    let that = this
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        let latitude = res.latitude;
        let longitude = res.longitude;
        wx.setStorageSync("latitude", latitude);
        wx.setStorageSync("longitude", longitude);
        that.setData({
          lot: longitude,
          lat: latitude
        });
        that.getOnSiteList(that.data.pagesize, that.data.pageNum, that.data.inputValue);
        that.infoNum();
      },
      fail(res) {
        util.showModel(that)
      }
    })
  },
  //拨打电话
  callPhone:function (e) {
    let phone =e.currentTarget.id
    wx.makePhoneCall({
      phoneNumber: phone,
      success(res){},
      fail(res){}
    })
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
  //接口执行fail
})