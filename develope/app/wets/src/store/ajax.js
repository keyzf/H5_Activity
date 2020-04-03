/*
@name: request请求
@params: {
	method: 请求方式
	url: 请求的url，
	data: 携带的数据,
	loading: 放在data里面，需要显示菊花加载就为true
}
@使用方法，挂载到vue-prototype上，
	Vue.prototype.$ajax = ajax
*/
import md5 from './md5.min.js';
import Vue from 'vue';
function generateUUID() {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}
const request = (method, url, data, header_diy) => {
    // url = 'http://114.115.217.252:8001/HighMallServer/'+ url
    data = sign(url, data);
    //delete data.token;
    url = Vue.prototype.$api_url + url
    let header_c = header();
    if (header_diy != undefined) {
        header_c = Object.assign({}, header_c, header_diy);
    }

    const promise = new Promise((resolve, reject) => {
        uni.request({
            method,
            url,
            data,
            header: header_c,
            success: (res) => {
                if (res.data.code == 401) {
                    reject(res)
                } else if (res.data.code == 20000) {
                    Vue.prototype.$jump.gotoLogin();
                } else if (res.data.code == 10001) {
                    uni.showToast({
                        title: res.data.msg,
                        icon:'none'
                    });
                    uni.removeStorageSync('userInfo')
                    uni.removeStorageSync('companyguid')
                    uni.removeStorageSync('uniquekey')
                    setTimeout(function() {
                        Vue.prototype.$jump.gotoLogin();
                    }, 800);
                } else {
                    resolve(res)
                }
            },
            fail: (err) => {
                reject(err)
                let msg = err.errMsg
                if (msg.indexOf('timeout') > -1) {
                    msg = '连接超时'
                }
                if (msg.indexOf('abort') > -1) {
                    msg = '连接终止'
                }
                uni.showToast({
                    title:'网络不给力,请稍后重试！',
                    icon: 'none'
                })
            }
        });
    });
    return promise
}
const ajax = {
    get: (url, data, header_diy) => {
        return request('GET', url, data, header_diy)
    },
    post: (url, data, uniquekey) => {
        return request('POST', url, data)
    },
    put: (url, data, uniquekey) => {
        return request('PUT', url, data)
    },
    del: (url, data, uniquekey) => {
        return request('DELETE', url, data)
    },
    sign: (url, data) => {
        return sign(url, data);
    },
    header: () => {
        return header();
    }
}
const sign = (url, data) => {
    const userInfo = uni.getStorageSync('userInfo') || '';
    let token = '';
    if (userInfo) {
        data.guid = userInfo.guid;
        token = userInfo.token;
        // data.token = userInfo.token;
    }
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
    data.sign = md5(jm);
    return data;
}
const header = () => {
    let uniquekey;
    if (uni.getStorageSync('uniquekey')) {
        uniquekey = uni.getStorageSync('uniquekey')
    } else {
        uniquekey = generateUUID();
        uni.setStorageSync('uniquekey', uniquekey);
    }
    var AppCode;
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/holdmall/i) == 'holdmall') {
        AppCode = uni.getStorageSync('parameter').AppCode;
    } else {
        AppCode = 'WXMall';
    }
    return {
        'MVer': '19111801',
        'AppCode': AppCode,
        'content-type': 'application/json',
        'dtype': 'WX',
        'uniquekey': uniquekey,
    }
}
export default ajax;
