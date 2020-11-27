//index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    propArray: {
      type: Array,
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    isKeyboard: !1,
    isNumberKB: !1,
    tapNum: !1,
    disableKey: "1234567890港澳学",
    keyboardNumber: "1234567890ABCDEFGHJKLMNPQRSTUVWXYZ港澳学",
    keyboard1: "京沪粤津冀晋蒙辽吉黑苏浙皖闽赣鲁豫鄂湘桂琼渝川贵云藏陕甘青宁新",
    inputPlates: {
      index0: "",
      index1: "",
      index2: "",
      index3: "",
      index4: "",
      index5: "",
      index6: "",
      index7: ""
    },
    inputOnFocusIndex: "",
    flag: true
  },
  ready: function () {
    console.log(111);
    var _this = this;
    console.log(_this.properties.propArray[0]);
    _this.setData({
      inputPlates: _this.properties.propArray[0]
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //切换车牌
    changeplate: function () {
      var that = this;
      that.setData({
        flag: false,
        inputPlates: {
          index0: "",
          index1: "",
          index2: "",
          index3: "",
          index4: "",
          index5: "",
          index6: "",
          index7: ""
        },
      })
    },
    //切换车牌
    changeplate1: function () {
      var that = this;
      that.setData({
        flag: true,
        inputPlates: {
          index0: "",
          index1: "",
          index2: "",
          index3: "",
          index4: "",
          index5: "",
          index6: "",
          index7: ""
        },
      })
    },

    inputClick: function (t) {
      var that = this;
      // console.log('输入框:', t)
      that.setData({
        inputOnFocusIndex: t.target.dataset.id,
        isKeyboard: !0
      })
      "0" == this.data.inputOnFocusIndex ? that.setData({
        tapNum: !1,
        isNumberKB: !1
      }) : "1" == this.data.inputOnFocusIndex ? that.setData({
        tapNum: !1,
        isNumberKB: !0
      }) : that.setData({
        tapNum: !0,
        isNumberKB: !0
      });

    },

    //键盘点击事件
    tapKeyboard: function (t) {
      var that = this;
      console.log(that.data.inputPlates)
      t.target.dataset.index;
      var a = t.target.dataset.val;
      // console.log('键盘:', a)
      switch (this.data.inputOnFocusIndex) {
        case "0":
          this.setData({
            "inputPlates.index0": a,
            inputOnFocusIndex: "1"
          });
          break;

        case "1":
          this.setData({
            "inputPlates.index1": a,
            inputOnFocusIndex: "2"
          });
          break;

        case "2":
          this.setData({
            "inputPlates.index2": a,
            inputOnFocusIndex: "3"
          });
          break;

        case "3":
          this.setData({
            "inputPlates.index3": a,
            inputOnFocusIndex: "4"
          });
          break;

        case "4":
          this.setData({
            "inputPlates.index4": a,
            inputOnFocusIndex: "5"
          });
          break;

        case "5":
          this.setData({
            "inputPlates.index5": a,
            inputOnFocusIndex: "6"
          });
          break;

        case "6":
          this.setData({
            "inputPlates.index6": a,
            inputOnFocusIndex: "7"
          });
          break;

        case "7":
          this.setData({
            "inputPlates.index7": a,
            inputOnFocusIndex: "7"
          });

      }
      var n = this.data.inputPlates.index0 + this.data.inputPlates.index1 + this.data.inputPlates.index2 + this.data.inputPlates.index3 + this.data.inputPlates.index4 + this.data.inputPlates.index5 + this.data.inputPlates.index6 + this.data.inputPlates.index7
      console.log('车牌号:', n)
      this.triggerEvent('myget', n);
      this.checkedSubmitButtonEnabled();
    },
    //键盘关闭按钮点击事件
    tapSpecBtn: function (t) {
      var a = this, e = t.target.dataset.index;
      if (0 == e) {
        switch (parseInt(this.data.inputOnFocusIndex)) {
          case 0:
            this.setData({
              "inputPlates.index0": "",
              inputOnFocusIndex: "0"
            });
            break;

          case 1:
            this.setData({
              "inputPlates.index1": "",
              inputOnFocusIndex: "0"
            });
            break;

          case 2:
            this.setData({
              "inputPlates.index2": "",
              inputOnFocusIndex: "1"
            });
            break;

          case 3:
            this.setData({
              "inputPlates.index3": "",
              inputOnFocusIndex: "2"
            });
            break;

          case 4:
            this.setData({
              "inputPlates.index4": "",
              inputOnFocusIndex: "3"
            });
            break;

          case 5:
            this.setData({
              "inputPlates.index5": "",
              inputOnFocusIndex: "4"
            });
            break;

          case 6:
            this.setData({
              "inputPlates.index6": "",
              inputOnFocusIndex: "5"
            });
            break;

          case 7:
            this.setData({
              "inputPlates.index7": "",
              inputOnFocusIndex: "6"
            });
        }
        this.checkedSubmitButtonEnabled();
      } else 1 == e && a.setData({
        isKeyboard: !1,
        isNumberKB: !1,
        inputOnFocusIndex: ""
      });
    },
    //键盘切换
    checkedKeyboard: function () {
      var t = this;
      "0" == this.data.inputOnFocusIndex ? t.setData({
        tapNum: !1,
        isNumberKB: !1
      }) : "1" == this.data.inputOnFocusIndex ? t.setData({
        tapNum: !1,
        isNumberKB: !0
      }) : this.data.inputOnFocusIndex.length > 0 && t.setData({
        tapNum: !0,
        isNumberKB: !0
      });
    },

    checkedSubmitButtonEnabled: function () {
      this.checkedKeyboard();
      var t = !0;
      for (var a in this.data.inputPlates) if ("index7" != a && this.data.inputPlates[a].length < 1) {
        t = !1;
        break;
      }
    },
  },
})
