// var guid ="9b3d1f32cb3c45cdba1d0800c38bc582";
var guid;
var isAndroid;
var isiOS;
var isNoApp;
var token;
var MVer = '20062501';
var AppCode;
var pub_url = "http://api.holdsoft.cn/mall/";
// var pub_url = "http://114.115.217.252:8001/HighMallServer/";

//判断浏览器内核
$(function() {
	let u = navigator.userAgent;
	isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
	isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
	// alert('是否是Android：'+isAndroid);
	// alert('是否是iOS：'+isiOS);
	isNoApp = u.toLowerCase().match(/holdmall/i) != 'holdmall';
	// guidCallback();
	if (isNoApp) {
		initBridge();
	} else {
		guid = sessionStorage.getItem('guid');
		token = sessionStorage.getItem('token');
		AppCode = sessionStorage.getItem('AppCode');
		if (isEmpty(guid) || isEmpty(token) || isEmpty(AppCode)) {
			initBridge();
		} else {
			guidCallback();
		}
	}
});

//ios
function setupWebViewJavascriptBridge(callback) {
	console.log("ios")
	if (window.WebViewJavascriptBridge) {
		return callback(WebViewJavascriptBridge);
	}
	if (window.WVJBCallbacks) {
		return window.WVJBCallbacks.push(callback);
	}
	window.WVJBCallbacks = [callback];
	var WVJBIframe = document.createElement('iframe');
	WVJBIframe.style.display = 'none';
	WVJBIframe.src = 'https://__bridge_loaded__';
	document.documentElement.appendChild(WVJBIframe);
	setTimeout(function() {
		document.documentElement.removeChild(WVJBIframe)
	}, 0)
}

//安卓
function connectWebViewJavascriptBridge(callback) {
	if (window.WebViewJavascriptBridge) {
		callback(WebViewJavascriptBridge)
	} else {
		document.addEventListener(
			'WebViewJavascriptBridgeReady',
			function() {
				callback(WebViewJavascriptBridge)
			},
			false
		);
	}
}

//注册函数,供原生调用
function mregisterHandler(callname, invoke) {
	window.WebViewJavascriptBridge.registerHandler(callname, invoke);
	//invoke 示例
	// function(data, responseCallback) {
	// 			// bridgeLog('收到Android数据： ' + data);
	// 			uni.showToast({
	// 				title: '收到Android数据： ' + data,

	// 			})
	// 		}
}

//调用原生函数
function mcallHandler(callname, data, callback) {
	window.WebViewJavascriptBridge.callHandler(callname, data, callback);
	//callback 示例
	// function(responseData) {
	// 	console.log("JS received response:", responseData)
	// 	// uni.showToast({
	// 	// 	title: responseData,
	// 	// })
	// }
}

//初始化函数
function initBridge() {
	if (isNoApp) {
		token = getQueryVariable("token")
		token = token ? token : "";
		guid = getQueryVariable("guid")
		guid = guid ? guid : "";
		AppCode = getQueryVariable("AppCode");
		AppCode = AppCode ? AppCode : "";
		sessionStorage.setItem('guid', guid);
		sessionStorage.setItem('token', token);
		sessionStorage.setItem('AppCode', AppCode);
		guidCallback();
		return;
	}

	if (isAndroid) {
		connectWebViewJavascriptBridge(function(bridge) {
			//注册回调函数，第一次连接时调用 初始化函数
			bridge.init();
			bridge.registerHandler("GetUser", function(data, responseCallback) {
				// getTopdata();
				// earninglist();
				guid = JSON.parse(data).guid;
				token = JSON.parse(data).token;
				AppCode = JSON.parse(data).AppCode;
				sessionStorage.setItem('guid', guid);
				sessionStorage.setItem('token', token);
				sessionStorage.setItem('AppCode', AppCode);
				guidCallback();
			});

		})
	}
	if (isiOS) {
		console.log('运行iOS上');
		setupWebViewJavascriptBridge(function(bridge) {
			/* Initialize your app here */
			bridge.registerHandler('GetUser', function(data, responseCallback) {
				// alert("进入bridge ios");
				// alert(data.guid);
				guid = data.guid;
				token = data.token;
				AppCode = data.AppCode;
				sessionStorage.setItem('guid', guid);
				sessionStorage.setItem('token', token);
				sessionStorage.setItem('AppCode', AppCode);
				console.log("GetUser called with:", data);
				guidCallback();
			})
		})
	}
}

/**
 * 分享
 */
function shareFun() {
	if (isNoApp) {
		share();
		return;
	}
	mcallHandler("CallNative", {
		'key': 'sharegetredpackage'
	})
}
/**
 * 返回
 */
function goback() {
	// alert("点击分享")
	if (isNoApp) {
		history.go(-1)
		return;
	}
	mcallHandler("CallNative", {
		'key': 'back'
	})
}

function isEmpty(s) {
	if (s == undefined || s === '') {
		return true;
	} else {
		return false;
	}
}

//加密
function sing(url, data) {
	data.guid = guid;
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

	jm = "/" + url + "?token=" + token + beforeSign;
	data.sign = hex_md5(jm);
	return data;
}

//获取url参数
function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		if (pair[0] == variable) {
			return pair[1];
		}
	}
	return (false);
};

//初始化sdk配置
function initJssdk(url, callback) {
	//服务端进行签名
	publicAjax('wxservicenumber/getjssdkconfig', {
		url: url
	}).then(res => {
		if (res.code == 0) {
			let data = res.result.data;
			wx.config({
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

//在需要自定义分享的页面中调用
function share(data, url) {
	let rediractUrl = url ? url : 'http://ets.51pingce.net/';
	//每次都需要重新初始化配置，才可以进行分享
	initJssdk(window.location.href.split('#')[0], function() {
		wx.ready(function() {
			var shareData = {
				title: data ? data.title : '电科商城',
				desc: data ? data.desc : '石家庄最优惠的网上商城',
				link: rediractUrl,
				imgUrl: data ? data.imgUrl : 'http://ets.51pingce.net/static/logo.png',
				success: function(res) {},
				cancel: function(res) {}
			};
			//分享给朋友接口
			wx.updateAppMessageShareData(shareData);
			//分享到朋友圈接口
			wx.updateTimelineShareData(shareData);
		});
	});
}

//ajax请求
function publicAjax(path, dataJson, type) {
	if (type == undefined) {
		type = 'POST'
	}
	dataJson = sing(path, dataJson)
	// console.log(dataJson)
	const promise = new Promise((resolve, reject) => {
		$.ajax({
			headers: {
				MVer: MVer,
				AppCode: AppCode
			},
			type: type,
			url: pub_url + path,
			dataType: 'json',
			data: dataJson,
			success: function(data) {
				// console.log(data);
				if (data.code == "0") {
					resolve(data)
				} else if (data.code == '20000') {
					gotoLogin();
				} else if (data.code == '10001') {
					alert(res.data.msg);
					// uni.removeStorageSync('userInfo')
					// uni.removeStorageSync('companyguid')
					// uni.removeStorageSync('uniquekey')
					setTimeout(function() {
						gotoLogin();
					}, 800);
				} else {
					alert("发生异常,刷新后再试!")
					return;
				}
			},
			error: function(jqXHR) {

			},
		});
	});
	return promise
}

//令牌错误 去登录
function gotoLogin() {
	if (isNoApp) {
		mcallHandler("CallNative", {
			'key': 'gotoLogin'
		})
	}

}
