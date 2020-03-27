import Vue from 'vue'
// import Vue from '../App.vue'

function bridgeAndroidAndIOS() {

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

	function bridgeLog(logContent) {
		uni.showModal({
			title:"原始数据",
			content: logContent,
		})
	}

	switch (uni.getSystemInfoSync().platform) {
		case 'android':
			connectWebViewJavascriptBridge(function(bridge) {
				bridge.init();
				bridge.registerHandler("GetUser", function(data, responseCallback) {
					console.log('接收到来自Android数据： '+ JSON.parse(data).guid);
                    uni.setStorageSync('userInfo',{
                        guid:JSON.parse(data).guid,
                        token:JSON.parse(data).token
                    })
                    
					// 初始传入token和guid
					Vue.config.configDic = {
						Authorization: JSON.parse(data).Authorization,
						statusBarHeight:Number.parseInt(JSON.parse(data).statusBarHeight),
						// Authorization: '45678978345456',
						// guid: "123456",
						// token: "abcdefg",
						// version: "0.0.1",
						// verCode: "191122",
						// appCode: "corpMall",
					};
					// bridgeLog('接收到来自Android数据： '+Vue.config.configDic.Authorization );
				});

			})
			// bridge.init();
			break;
		case 'ios':
            setupWebViewJavascriptBridge(function(bridge) {
                /* Initialize your app here */
                bridge.registerHandler('GetUser', function(data, responseCallback) {
                    console.log("JS Echo called with:", data)
                    // responseCallback(data)
                    uni.setStorageSync('userInfo',{
                        guid:JSON.parse(data).guid,
                        token:JSON.parse(data).token
                    })
                    // 初始传入token和guid
                    Vue.config.configDic = {
                        Authorization: data.Authorization,
                        productID: data.productID,
                        statusBarHeight: data.statusBarHeight,
                        // token: "abcdefg",
                        // version: "0.0.1",
                        // verCode: "191122",
                        // appCode: "corpMall",
                    };
                })
                // bridge.callHandler('ObjC Echo', data, function responseCallback(responseData) {
                // 	console.log("JS received response:", responseData)
                // })
            })
            break;
		default:
			console.log('运行在开发者工具上')
			break;
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

module.exports = {
	bridgeAndroidAndIOS: bridgeAndroidAndIOS,
	mregisterHandler: mregisterHandler,
	mcallHandler: mcallHandler,
}
