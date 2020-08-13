var util = require('./bridge.js');

function findAgent() {
  return window.navigator.userAgent.toLowerCase();
}

function jumpMethod(productId) {
  var ua = findAgent();
  if (ua.match(/holdmall/i) == 'holdmall') {
    // 初始化bridge
    util.mcallHandler('CallNative', {
      'key': 'neteasegoodsdetail',
      'productid': productId
    }, function(responseData) {
      console.log("JS received response:", responseData)
    });
  } else {
    uni.navigateTo({
      url: '/pages/product/product?productid=' + productId
    });
  }
}

function jumpApp(type, id) {
  var ua = findAgent();
  console.log(ua.match(/holdmall/i) == 'holdmall')
  if (ua.match(/holdmall/i) == 'holdmall') {
    // 初始化bridge
    var data;
    if (type == 1) {
      data = {
        'code': 'ACTIVITY',
        'activityid': id
      }
    } else if (type == 2) {
      data = {
        'code': 'PRODUCT',
        'productid': id
      }
    } else {
      data = {
        'code': 'H5',
        'jumpLink': id
      }
    }
    util.mcallHandler('CallNative', {
      'key': 'jumpbycode',
      'jumpdata': data
    }, function(responseData) {
      console.log("JS received response:", responseData)
    });
  } else {
    if (type == 1) {
      uni.navigateTo({
        url: '/pages/product/catelist?id=' + id
      });
    } else if (type == 2) {
      uni.navigateTo({
        url: '/pages/product/product?productid=' + id
      });
    } else if (type == 3) {
      location.href = id;
    }
  }
}

function jumpApps(type, id) {
  var data = {
    'code': type,
    'activityid': id
  }
  util.mcallHandler('CallNative', {
    'key': 'jumpbycode',
    'jumpdata': data
  }, function(responseData) {
    console.log("JS received response:", responseData)
  });
}

function gotoLogin(productId) {
  var ua = findAgent();
  if (ua.match(/holdmall/i) == 'holdmall') {
    // 初始化bridge
    util.mcallHandler('CallNative', {
      'key': 'gotoLogin'
    }, function(responseData) {
      console.log("JS received response:", responseData)
    });
  } else {
    var rul = location.href;
    if (rul.indexOf("/pages/") < 0 || rul.indexOf("/home/home") > 0 || rul.indexOf("draw/draw") > 0) {
      uni.navigateTo({
        url: '/pages/public/login'
      });
    } else {
      uni.redirectTo({
        url: '/pages/public/login'
      });
    }
  }
}

function back() {
  var ua = findAgent();
  if (ua.match(/holdmall/i) == 'holdmall') {
    // 初始化bridge
    util.mcallHandler('CallNative', {
      'key': 'back'
    }, function(responseData) {
      console.log("JS received response:", responseData)
      // uni.showToast({
      // 	title: responseData,
      // })
    });
  } else {
    uni.navigateBack()
  }
}

const jump = {
  findAgent: () => {
    return findAgent();
  },
  jumpMethod: (productId) => {
    return jumpMethod(productId);
  },
  back: () => {
    return back();
  },
  gotoLogin: () => {
    return gotoLogin();
  },
  jumpApp: (type, id) => {
    return jumpApp(type, id);
  },
  jumpApps: (type, id) => {
    return jumpApps(type, id);
  }  
}

export default jump
