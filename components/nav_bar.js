// zh_tcwq/pubcoms/navbar/navbar.js
import tabbarList from "../utils/nav_comm.js"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    activeIdx: {
      type: Number,
      value: 0,
      observer: "change_index"
    },
    auth: {
      type: Number,
      value: 0,
      observer: 'onAuthChanged'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tabbarList: tabbarList,
    _auth: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleItemTap(e) {
      const {
        idx,
        path
      } = e.currentTarget.dataset;
      wx.setStorageSync('idx', idx);
      if (path == "") {
        var that = this;
        var show;
        wx.scanCode({
          success: (res) => {
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000
            });
            wx.navigateTo({
                url: res.result,
            });
          },
          fail: (res) => {
            wx.showToast({
              title: '失败',
              icon: 'success',
              duration: 2000
            });
           
            console.log(res)
          },
          complete: (res) => {}
        });
        return;
      } else {
        wx.switchTab({
          url: `../${path}`,
        });
      }

    },
    onAuthChanged(newVal) {
      wx.setStorageSync('__com-tabbar-auth', newVal)
      this.setData({
        _auth: newVal
      })
      console.log(newVal)
    },
    change_index() {
      this.setData({
        activeIdx: wx.getStorageSync('idx')
      });
    },
  },
  /** 权限显示 */
  pageLifetimes: {
    show: function() {
      console.log('show')
      this.setData({
        _auth: wx.getStorageSync('__com-tabbar-auth')
      })
    }
  }
})