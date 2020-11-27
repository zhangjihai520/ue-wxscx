function send_post(url, token, data, success, fail) {
  wx.request({
    url: url,
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      "token": token
    },
    method: "POST",
    data: data,
    success(res) {
      if (res.data.code == 402 ||res.data.code == 406 || res.data.code == 403) {
        wx.hideToast();
        wx.showModal({
          title: '提示',
          content: res.data.message,
          success: function (res) {
            wx.removeStorageSync("token");
            if(res.confirm){
              wx.navigateTo({
                url: '../../pages/login/login'
              })
            }else{
              wx.reLaunch({
                url: '../../pages/index/index'
              })
            }
          }
        })
      }else {
        success(res);
      }
    },
    fail(res) {
      console.log(res)
      fail(res);
    }
  })
}

function list_post(url, data, success, fail) {
  wx.request({
    url: url,
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
    data: data,
    success(res) {
      if (res.data.code == 402 || res.data.code == 406) {
        wx.showModal({
          title: '提示',
          content: res.data.message,
          success: function (res) {
            wx.removeStorageSync("token");
            if(res.confirm){
              wx.navigateTo({
                url: '../../pages/login/login'
              })
            }else{
              wx.reLaunch({
                url: '../../pages/index/index'
              })
            }
              
          }
        })
      }else {
        success(res);
      }
    },
    fail(res) {
      console.log(res)
      fail(res);
    }
  })
}




function timestampDay(timestamp) { //精确到天
  var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + '';
  return Y + M + D;
}

function timestampToTime(timestamp) { //精确到分
  let date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear() + '-';
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + "  ";
  let h = date.getHours() + ':';
  let m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + '';
  return Y + M + D + h + m
};

var operation = {
  /*加法函数，返回值：arg1加上arg2的精确结果*/
  numAdd: function (arg1, arg2) {
    var r1, r2, m;
    try {
      r1 = arg1.toString().split(".")[1].length
    } catch (e) {
      r1 = 0
    }
    try {
      r2 = arg2.toString().split(".")[1].length
    } catch (e) {
      r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2))
    return (arg1 * m + arg2 * m) / m
  },
  /*减法函数, 返回值：arg1减去arg2的精确结果*/
  numSubtract: function (arg1, arg2) {
    var r1, r2, m, n;
    try {
      r1 = arg1.toString().split(".")[1].length
    } catch (e) {
      r1 = 0
    }
    try {
      r2 = arg2.toString().split(".")[1].length
    } catch (e) {
      r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2));
    //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
  },
  /*乘法函数 返回值：arg1乘以arg2的精确结果*/
  numMultiply: function (arg1, arg2) {
    var m = 0,
      s1 = arg1.toString(),
      s2 = arg2.toString();
    try {
      m += s1.split(".")[1].length
    } catch (e) {}
    try {
      m += s2.split(".")[1].length
    } catch (e) {}
    return (Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)).toFixed(2);
  },
  /*除法函数, 返回值：arg1除以arg2的精确结果*/
  numDivide: function (arg1, arg2) {
    var t1 = 0,
      t2 = 0,
      r1, r2;
    try {
      t1 = arg1.toString().split(".")[1].length
    } catch (e) {}
    try {
      t2 = arg2.toString().split(".")[1].length
    } catch (e) {}
    // with(Math) {
    //   r1 = Number(arg1.toString().replace(".", ""));
    //   r2 = Number(arg2.toString().replace(".", ""));
    //   return (r1 / r2) * pow(10, t2 - t1);
    // }
  }
}

function toast_load() {
  wx.showToast({
    title: '加载中',
    icon: 'loading',
    duration: 8000,
  });
}

function toast_null() {
  wx.showToast({
    title: '已经没有更多拉...',
    icon: 'none',
    duration: 1000,
  });
}

function toast(obj) {
  wx.showToast({
    title: obj,
    icon: 'none',
    duration: 1500,
  });
}

function loading(text) {
  wx.showToast({
    title: text,
    icon: 'loading',
    duration: 1000,
  });
}

function showModel(that) {
  wx.showModal({
    title: '提示',
    content: '网络异常，请重新连接',
    success: function (res) {
      if (res.confirm) {
        that.onLoad()
      }
    }
  })
}
//多张图片上传
function uploadimg(data, contant) {
  var that = this,
    i = data.i ? data.i : 0, //当前上传的哪张图片
    success = data.success ? data.success : 0, //上传成功的个数
    fail = data.fail ? data.fail : 0; //上传失败的个数
  wx.uploadFile({
    url: data.url,
    header: {
      'content-type': 'multipart/form-data',
      "token": wx.getStorageSync("token")
    },
    filePath: data.path[i],
    name: 'dsMoodImages', //这里根据自己的实际情况改
    formData: contant, //这里是上传图片时一起上传的数据
    success: (resp) => {
      success++; //图片上传成功，图片上传成功的变量+1
      console.log(resp)
      console.log(i);
      //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
    },
    fail: (res) => {
      fail++; //图片上传失败，图片上传失败的变量+1
      console.log('fail:' + i + "fail:" + fail);
    },
    complete: () => {
      console.log(i);
      i++; //这个图片执行完上传后，开始上传下一张
      if (i == data.path.length) { //当图片传完时，停止调用          
        console.log('执行完毕');
        console.log('成功：' + success + " 失败：" + fail);

      } else { //若图片还没有传完，则继续调用函数
        console.log(i);
        data.i = i;
        data.success = success;
        data.fail = fail;
        that.uploadimg(data, contant);
      }

    }
  });
}

function Numbers(obj) {
  var num = parseInt(obj);
  return num
}
var success = 200;
module.exports = {
  send_post: send_post,
  timestampDay: timestampDay,
  timestampToTime: timestampToTime,
  success: success,
  operation: operation,
  toast_load: toast_load,
  toast_null: toast_null,
  toast: toast,
  loading: loading,
  showModel: showModel,
  list_post: list_post,
  uploadimg: uploadimg
}