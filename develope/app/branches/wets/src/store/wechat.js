import ajax from './ajax'

var jweixin = require('../components/wxjs-module/jweixin-1.4.1.js');

//判断是否在微信中  
function isWechat() {
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/micromessenger/i) == 'micromessenger') {
    return true;
  } else {
    return false;
  }
}

//初始化sdk配置  
function initJssdk(url, callback) {
  //服务端进行签名
  ajax.get('wxservicenumber/getjssdkconfig', {
    url: url
  }).then(res => {
    if (res.data.code == 0) {
      let data = res.data.result.data;
      jweixin.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: data.appId, // 必填，公众号的唯一标识
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature, // 必填，签名
        jsApiList: [
          'chooseImage',
          'uploadImage',
          'chooseWXPay',
          'scanQRCode',
          'updateAppMessageShareData',
          'updateTimelineShareData',
          'getLocation',
          'openAddress'
        ] // 必填，需要使用的JS接口列表
      });
      if (callback) {
        callback();
      }
    } else {
      this.$api.msg('初始化时，获取签名失败！');
    }
  });
}

// 循环判断 
function switchCase(type, params) {
  let url = '';
  switch (type) {
    case 'mall_receipt': // 扫码收货
      url = '/pages/order/orderscan?ordernumber=' + params;
      break;
    case 'GOLDENEGG': // 砸金蛋兑换实物

      break;
    case 'HMCoupon': // 直接兑换优惠券

      break;
    case 'DeliveryInfo': // 到货情况查看

      break;
    case 'redirect-otherpay': // 代付

      break;
    case 'groupbuyshare': // 拼团商品详情

      break;
    case 'redirect-company': // 直接关注店铺

      break;
    case 'RP': // 领取红包

      break;
    case 'shopfollow': // 跳转到店铺并关注

      break;
    default: // 调用扫描商品条码接口，跳商品详情或返错

      break;
  }
  if (url == '') {
    uni.showToast({
      icon: 'none',
      title: '扫码仅可用于订单收货'
    });
    return;
  }
  uni.navigateTo({
    url: url
  });
}

// 扫一扫
function scanQRCode(type) {
  ajax.get('homepage/scanAuthority', {}).then(res => {
    if (res.data.code == 0) {
      let data = res.data.result.data;
      jweixin.scanQRCode({
        needResult: type, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: function(result) {
          // 当needResult 为 1 时，扫码返回的结果
          let infos = result.resultStr.split(':'); // 下标0 类型  下边1 参数
          let isAuthor = false;
          data.forEach(item => {
            if (item == infos[0]) isAuthor = true;
          });
          if (isAuthor) {
            switchCase(infos[0], infos[1]);
          } else {
            uni.showToast({
              icon: 'none',
              title: '二维码无效或没有权限'
            })
          }
        }
      });
    } else {
      uni.showToast({
        icon: 'none',
        title: res.data.msg
      })
    }
  });
}

// 扫一扫
function scanQRCodescan() {
  const promise = new Promise((resolve, reject) => {
    jweixin.scanQRCode({
      needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
      success: function(result) {
        alert(resurl)
        resolve(resurl);
      }
    });
  });
  return promise
}

// 上传图片 
function upload(type) {
  const promise = new Promise((resolve, reject) => {
    jweixin.chooseImage({
      count: 1, // 默认9
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有 'album', 'camera'
      success: function(res) {
        var localId = res.localIds[0]; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
        uni.showLoading({
          title: '图片上传中',
          mask: true
        })
        jweixin.uploadImage({
          localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
          isShowProgressTips: 0, // 默认为1，显示进度提示
          success: function(resupload) {
            var media_id = resupload.serverId; // 返回图片的服务器端ID
            ajax.get('wxservicenumber/getfilefrommedia', {
              media_id: media_id,
              type: type
            }).then(resurl => {
              uni.hideLoading();
              resurl.data.result.data.localId = localId;
              resolve(resurl);
            });
          }
        });
      }
    });
  });
  return promise
}
// 获取地址 
function editadd() {
  const promise = new Promise((resolve, reject) => {
    jweixin.openAddress({
      success: function(res) {
        resolve(res);
      }
    });
  });
  return promise
}
//在需要自定义分享的页面中调用
function share(data, url) {
  let rediractUrl = url ? url : 'http://ets.51pingce.net/';
  //每次都需要重新初始化配置，才可以进行分享
  initJssdk(window.location.href.split('#')[0], function() {
    jweixin.ready(function() {
      var shareData = {
        title: data ? data.title : '电科商城',
        desc: data ? data.desc : '石家庄最优惠的网上商城',
        link: rediractUrl,
        imgUrl: data ? data.imgUrl : 'http://ets.51pingce.net/static/logo.png',
        success: function(res) {
          //用户点击分享后的回调，这里可以进行统计，例如分享送金币之类的  
          //request.post('/api/member/share');

        },
        cancel: function(res) {}
      };
      //分享给朋友接口  
      jweixin.updateAppMessageShareData(shareData);
      //分享到朋友圈接口  
      jweixin.updateTimelineShareData(shareData);
    });
  });
}

const wechat = {
  initJssdk: (url, callback) => {
    return initJssdk(url, callback);
  },
  isWechat: () => {
    return isWechat();
  },
  upload: (type) => {
    return upload(type);
  },
  jweixin: () => {
    return jweixin;
  },
  share: (data, url) => {
    return share(data, url);
  },
  scanQRCode: (type) => {
    return scanQRCode(type);
  },
  editadd: () => {
    return editadd();
  },
  scanQRCodescan: () => {
    return scanQRCodescan();
  },
}

export default wechat
