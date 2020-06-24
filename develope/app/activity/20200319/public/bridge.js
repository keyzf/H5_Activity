
// var isAndroid;
// var isiOS;

// //ios
// function setupWebViewJavascriptBridge(callback) {
//     if (window.WebViewJavascriptBridge) {
//         return callback(WebViewJavascriptBridge);
//     }
//     if (window.WVJBCallbacks) {
//         return window.WVJBCallbacks.push(callback);
//     }
//     window.WVJBCallbacks = [callback];
//     var WVJBIframe = document.createElement('iframe');
//     WVJBIframe.style.display = 'none';
//     WVJBIframe.src = 'https://__bridge_loaded__';
//     document.documentElement.appendChild(WVJBIframe);
//     setTimeout(function () {
//         document.documentElement.removeChild(WVJBIframe)
//     }, 0)
// }

// //安卓
// function connectWebViewJavascriptBridge(callback) {
//     if (window.WebViewJavascriptBridge) {
//         callback(WebViewJavascriptBridge)
//     } else {
//         document.addEventListener(
//             'WebViewJavascriptBridgeReady',
//             function () {
//                 callback(WebViewJavascriptBridge)
//             },
//             false
//         );
//     }
// }

// //注册函数,供原生调用
// export function mregisterHandler(callname, invoke) {
//     window.WebViewJavascriptBridge.registerHandler(callname, invoke);
//     //invoke 示例
//     // function(data, responseCallback) {
//     // 			// bridgeLog('收到Android数据： ' + data);
//     // 			uni.showToast({
//     // 				title: '收到Android数据： ' + data,

//     // 			})
//     // 		}
// }

// //调用原生函数
// export function mcallHandler(callname, data, callback) {
//     window.WebViewJavascriptBridge.callHandler(callname, data, callback);
//     //callback 示例
//     // function(responseData) {
//     // 	console.log("JS received response:", responseData)
//     // 	// uni.showToast({
//     // 	// 	title: responseData,
//     // 	// })
//     // }
// }


// function device() {
//     let u = navigator.userAgent;
//     isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
//     isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
// }

// export function initBridge(callback) {
//     device();
//     if (isAndroid) {
//         connectWebViewJavascriptBridge(function (bridge) {
//             //注册回调函数，第一次连接时调用 初始化函数
//             bridge.init();

//             bridge.registerHandler("GetUser", function (data, responseCallback) {
//                 // bridgeLog('接收到来自Android数据： '+ JSON.parse(data).stateBarHeight);
//                 // alert("进入bridge android" + JSON.parse(data).guid);
//                 // guid = JSON.parse(data).guid;
//                 callback(data);
//             });

//         })
//     }

//     if (isiOS) {
//         console.log('运行iOS上');
//         setupWebViewJavascriptBridge(function (bridge) {
//             /* Initialize your app here */
//             bridge.registerHandler('GetUser', function (data, responseCallback) {
//                 // alert("进入bridge ios");
//                 callback(data);
//                 // guid = data.guid;
//                 // console.log("GetUser called with:", data);
//             })
//         })
//     }
// }