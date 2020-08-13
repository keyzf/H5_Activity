import Vue from 'vue'
const CONFIG = require('./config.js');
const MD5 = require('./md5.min.js');
var atoken = '';
var ua = window.navigator.userAgent.toLowerCase();
var api_BASE_URL;
api_BASE_URL = CONFIG.httpURL;

function getToken() {
  Vue.prototype.callHandlerBack('JsGetToken', '', function(responseData) {
    switch (uni.getSystemInfoSync().platform) {
      case 'android':
        Vue.prototype.globaldata = {
          guid: JSON.parse(responseData).guid,
          statusBarHeight: Number.parseInt(JSON.parse(responseData).statusBarHeight),
          token: JSON.parse(responseData).token,
          orderNumber: JSON.parse(responseData).orderNumber,
          MVer: JSON.parse(responseData).MVer,
          AppCode: JSON.parse(responseData).AppCode
        };
        break;
      case 'ios':
        Vue.prototype.globaldata = {
          guid: responseData.guid,
          statusBarHeight: Number.parseInt(responseData.statusBarHeight),
          token: responseData.token,
          orderNumber: responseData.orderNumber,
          MVer: responseData.MVer,
          AppCode: responseData.AppCode
        };
      default:
        console.log('运行在开发者工具上')
        break;
    }
  });
}

//加密
function sign(url, data) {
  let timestamp = new Date().getTime();
  data.nonce = timestamp;
  data.apitoken = timestamp;
  let jm;
  let keys = Object.keys(data).sort();
  let beforeSign = '';
  for (let k in keys) {
    if (data[keys[k]] != undefined || data[keys[k]] != null) {
      beforeSign += '&' + keys[k] + '=' + data[keys[k]]
    }
  }
  jm = "/" + url + "?token=" + atoken + beforeSign;
  data.sign = MD5(jm);
  return data;
}

//令牌错误 去登录
function gotoLogin() {
  if (ua.match(/holdmall/i) == 'holdmall') {
    // 初始化bridge
    Vue.prototype.callHandler('CallNative', {
      'key': 'gotoLogin'
    });
  } else {
    var rul = location.href;
    if (rul.indexOf("/pages/") < 0 || rul.indexOf("/home/home") > 0) {
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

const MyAPI = (url, needSubDomain, method, data) => {
  let mypath = url;
  let _url = api_BASE_URL + url;

  // h5单独测试的时候,用临时的token和guid

  if ((Vue.prototype.globaldata.guid || uni.getStorageSync('userInfo').guid || '').length == 0) {
    getToken();
  }
  
  let guid = Vue.prototype.globaldata.guid || uni.getStorageSync('userInfo').guid||'';//9125ce8d751f465aac9d555bdb305dcf
  atoken = Vue.prototype.globaldata.token || uni.getStorageSync('userInfo').token;
  let welfareid = Vue.prototype.globaldata.welfareid || "";
  let AppCode = Vue.prototype.globaldata.AppCode || "WXMall";
  let MVer = Vue.prototype.globaldata.MVer || "20061801";
  
  data['guid'] = guid;
  data['welfareid'] = welfareid;
  data = sign(mypath, data);

  if (method == "GET") {
    // url拼接参数
    _url = _url + '?'
    for (var key in data) {
      var item = data[key];
      _url = _url + key + '=' + encodeURIComponent(item) + '&'
    }
    // let e_url =encodeURIComponent(_url);
    return new Promise((resolve, reject) => {
      uni.request({
        method,
        url: _url,
        header: {
          AppCode: AppCode,
          MVer: MVer,
        },
        success: (res) => {
          if (res.data.code == 20000) {
            gotoLogin();
          } else if (res.data.code == 10001) {
            uni.showToast({
              title: res.data.msg,
              icon: 'none'
            });
            uni.removeStorageSync('userInfo')
            uni.removeStorageSync('companyguid')
            uni.removeStorageSync('uniquekey')
            setTimeout(function() {
              gotoLogin();
            }, 800);
          } else {
            resolve(res)
          }
        },
        fail: (err) => {
          reject(err)
          uni.showModal({
            title: '提示',
            content: '请求失败,请稍后重试',
            showCancel: false
          })
        }
      });

    });
  } else if (method == "POST") {
    return new Promise((resolve, reject) => {
      uni.request({
        method,
        url: _url,
        header: {
          AppCode: AppCode,
          MVer: MVer,
        },
        success: (res) => {
          if (res.data.code == 20000) {
            gotoLogin();
          } else if (res.data.code == 10001) {
            uni.showToast({
              title: res.data.msg,
              icon: 'none'
            });
            uni.removeStorageSync('userInfo')
            uni.removeStorageSync('companyguid')
            uni.removeStorageSync('uniquekey')
            setTimeout(function() {
              gotoLogin();
            }, 800);
          } else {
            resolve(res)
          }
        },
        fail: (err) => {
          reject(err)
          uni.showModal({
            title: '提示',
            content: '请求失败,请稍后重试',
            showCancel: false
          })
        }
      });
    });
  }
}

module.exports = {
  MyAPI,
  // 首页楼层
  homepage: (data) => {
    return MyAPI('benefits/homepage', false, 'GET', data)
  },
  // 获取用户福利列表
  getWelfareList: (data) => {
    return MyAPI('benefits/getWelfareList', false, 'GET', data)
  },
  // 红色背景图
  slides: (data) => {
    return MyAPI('benefits/slides', false, 'GET', data)
  },
  // 点赞
  praise: (data) => {
    return MyAPI('benefits/praise', false, 'GET', data)
  },
  // 余额
  account: (data) => {
    return MyAPI('benefits/account', false, 'GET', data)
  },
  // 头条
  headline: (data) => {
    return MyAPI('benefits/headline', false, 'GET', data)
  },
  // 商品tab
  mytabs: (data) => {
    return MyAPI('benefits/mytabs', false, 'GET', data)
  },
  // 商品tab对应的商品
  productListByTabid: (data) => {
    return MyAPI('benefits/getProductListByTabid', false, 'GET', data)
  },
  // 已选的订单
  myorder: (data) => {
    return MyAPI('benefits/myorder', false, 'GET', data)
  },
  // 获取商品规格
  getGoodGuiGe: (data) => {
  	return MyAPI('benefits/ShoppingCart', false, 'GET', data)
  },
  // 敬请期待
  expecting: (data) => {
    return MyAPI('benefits/expecting', false, 'GET', data)
  },
  // 购物车显示
  shoppingCart: (data) => {
    return MyAPI('benefits/shoppingCart', false, 'GET', data)
  },
  // 进页面获取购物车信息
  firstInCartInfo: (data) => {
  	return MyAPI('benefits/getShopcartSkus', false, 'GET', data)
  },
  // 重选
  chongXuan: (data) => {
    return MyAPI('benefits/todozcc', false, 'GET', data)
  },
  // 催单
  cuiDan: (data) => {
    return MyAPI('benefits/reminder', false, 'GET', data)
  },
  // 结算
  checkOut: (data) => {
    return MyAPI('shoppingcart/Checkoutfix', false, 'GET', data)
  },
  //兑换优惠券
  exchangeCoupon: (data) => {
    return MyAPI('benefits/amountExchange', false, 'GET', data)
  },
  //获取余额明细
  getMoneyDetails: (data) => {
    return MyAPI('benefits/amountDetails', false, 'GET', data)
  },
  //支付成功
  paySuccess: (data) => {
    return MyAPI('order/payResult', false, 'GET', data)
  },

  //扫码支付成功
  paySuccessQR: (data) => {
    return MyAPI('qrcodepay/payResult', false, 'GET', data)
  },

  //选择优惠券
  selectLuck: (data) => {
    return MyAPI('lottery/choosePrize', false, 'GET', data)
  },
  //选择优惠券
  selectLuckRedpack: (data) => {
    return MyAPI('redpacket/getRebateRedpacket', false, 'GET', data)
  },
  // ----------------------------- 分销 -----------------------------
  
  // 首页第一个tab
  getHomepageInfo: (data) => {
  	return MyAPI('distribution/homePage', false, 'GET', data)
  },
  // 我的账户
  MyAccount: (data) => {
  	return MyAPI('distribution/myInfo', false, 'GET', data)
  },
  // 我的账户收益订单
  MyAccountList: (data) => {
  	return MyAPI('distribution/incomeOrders', false, 'GET', data)
  },
  // 预提现
  PreviewWithdraw: (data) => {
  	return MyAPI('distribution/withdrawPreview', false, 'GET', data)
  },
  //提现明细
  getMoneyDetail: (data) => {
  	return MyAPI('distribution/withdrawHistory', false, 'GET', data)
  },
  //获取已经绑定的支付宝账户
  getBindAlipayAccount: (data) => {
  	return MyAPI('distribution/getAlipayAccount', false, 'GET', data)
  },
  //绑定支付宝账户
  BindAlipayAccount: (data) => {
  	return MyAPI('distribution/setAlipayAccount', false, 'GET', data)
  },
  //提现到支付宝
  withdraw: (data) => {
  	return MyAPI('distribution/withdraw', false, 'GET', data)
  },
  //填写邀请码
  inviteCode: (data) => {
  	return MyAPI('distribution/signup', false, 'GET', data)
  },
  //首页分类列表
  homeCategoryList: (data) => {
  	return MyAPI('distribution/listProducts', false, 'GET', data)
  },
  //分销详情
  productDetail: (data) => {
  	return MyAPI('distribution/productDetail', false, 'GET', data)
  },
  //分销详情猜你喜欢
  productDetaillike: (data) => {
  	return MyAPI('distribution/guessYouLike', false, 'GET', data)
  },
  //分销领取优惠券
  getcounpon: (data) => {
  	return MyAPI('product/getReceiveCoupon', false, 'GET', data)
  },
  // -----------------------1元拼购---------------------------------------
  //1元拼购首页数据
  oneyuanList: (data) => {
  	return MyAPI('groupbuyone/homepage', false, 'GET', data)
  },
  // ---------------------- 点滴关怀 -------------------------------------
  // 获取token
  dianDiLoginToken: (data) => {
  	return MyAPI('diandi/getLoginToken', false, 'GET', data)
  },
}
