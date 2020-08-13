import Vue from 'vue'

//ios
function setupWebViewJavascriptBridge(callback) {
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

function bridgeAndroidAndIOS(callbacks) {
	
	function bridgeLog(logContent) {
		uni.showModal({
			title: "原始数据",
			content: logContent,
		})
	}

	switch (uni.getSystemInfoSync().platform) {
		case 'android':
			connectWebViewJavascriptBridge(function(bridge) {
				bridge.init();
				bridge.registerHandler("GetUser", function(data, responseCallback) {
					if (JSON.parse(data).guid != "null") {
						uni.setStorageSync('userInfo', {
							guid: JSON.parse(data).guid,
							token: JSON.parse(data).token
						})
					}
					uni.setStorageSync('parameter', {
						activityID: JSON.parse(data).activityID,
						AppCode: JSON.parse(data).AppCode
					})
					// 初始传入token和guid
					Vue.config.configDic = {
						Authorization: JSON.parse(data).Authorization,
						productID: JSON.parse(data).productID,
						guid: JSON.parse(data).guid,
						statusBarHeight: Number.parseInt(JSON.parse(data).statusBarHeight),
						token: JSON.parse(data).token,
						orderNumber: JSON.parse(data).orderNumber,
						MVer: JSON.parse(data).MVer,
						AppCode: JSON.parse(data).AppCode
					};
					// 福利使用
					Vue.prototype.globaldata = {
						guid: JSON.parse(data).guid,
						statusBarHeight: Number.parseInt(JSON.parse(data).statusBarHeight),
						token: JSON.parse(data).token,
						orderNumber: JSON.parse(data).orderNumber,
						MVer: JSON.parse(data).MVer,
						AppCode: JSON.parse(data).AppCode
					};
					callbacks();
				});

			})
			break;
		case 'ios':
			setupWebViewJavascriptBridge(function(bridge) {
				bridge.registerHandler('GetUser', function(data, responseCallback) {
					if (data.guid != "null") {
						uni.setStorageSync('userInfo', {
							guid: data.guid,
							token: data.token
						})
					}
					uni.setStorageSync('parameter', {
						activityID: data.activityID,
						AppCode: data.AppCode
					})
					// 初始传入token和guid
					Vue.config.configDic = {
						Authorization: data.Authorization,
						productID: data.productID,
						guid: data.guid,
						statusBarHeight: Number.parseInt(data.statusBarHeight),
						token: data.token,
						orderNumber: data.orderNumber,
						MVer: data.MVer,
						AppCode: data.AppCode
					};
					// 福利使用
					Vue.prototype.globaldata = {
						guid: data.guid,
						statusBarHeight: Number.parseInt(data.statusBarHeight),
						token: data.token,
						orderNumber: data.orderNumber,
						MVer: data.MVer,
						AppCode: data.AppCode
					};
					callbacks();
				})
			})
			break;
		default:
			console.log('运行在开发者工具上')
			callbacks();
			break;
	}
}

//注册函数,供原生调用
function mregisterHandler(callname, invoke) {
	switch (uni.getSystemInfoSync().platform) {
		case 'android':
			window.WebViewJavascriptBridge.registerHandler(callname, invoke);
			break;
		case 'ios':
			setupWebViewJavascriptBridge(function(bridge) {
				bridge.registerHandler(callname, invoke);
			})
			break;
		default:
			break;
	}
}

//调用原生函数
function mcallHandler(callname, data, callback) {
	switch (uni.getSystemInfoSync().platform) {
		case 'android':
			window.WebViewJavascriptBridge.callHandler(callname, data, callback);
			break;
		case 'ios':
			setupWebViewJavascriptBridge(function(bridge) {
				bridge.callHandler(callname, data, callback);
			})
			break;
		default:
			break;
	}
}

module.exports = {
	bridgeAndroidAndIOS: bridgeAndroidAndIOS,
	mregisterHandler: mregisterHandler,
	mcallHandler: mcallHandler,
}
