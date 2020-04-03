import Vue from 'vue'
import store from './store'
import App from './App'
import ajax from './store/ajax'
import Json from './Json' //测试用数据
import wechat from './store/wechat' // 微信接口
import axios from './store/axios'
import upload_img from './store/upload_img'
import uuid from './store/uuid'
import jump from './store/jump_type'
import {JjimWidget} from './store/jiguang_jim.js'
import cuCustom from './pages/chat/colorui/components/cu-custom.vue'
var util = require('./store/bridge.js');

//注册函数,供原生调用
Vue.prototype.registerHandler = function registerHandler(name, invoke) {
    util.mregisterHandler(name, invoke);
};

//调用原生
Vue.prototype.callHandler = function callHandler(name, data) {
    util.mcallHandler(name, data, function(responseData) {
        console.log("JS received response:", responseData)
    });
};

//调用原生 带回调
Vue.prototype.callHandlerBack = function callHandler(name, data, callback) {
    util.mcallHandler(name, data, callback);
};

const msg = (title, duration = 1500, mask = false, icon = 'none') => {
    //统一提示方便全局修改
    if (Boolean(title) === false) {
        return;
    }
    uni.showToast({
        title,
        duration,
        mask,
        icon
    });
}
const json = type => {
    //模拟异步请求数据
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(Json[type]);
        }, 500)
    })
}

const prePage = () => {
    let pages = getCurrentPages();
    let prePage = pages[pages.length - 2];
    // #ifdef H5
    return prePage;
    // #endif
    return prePage.$vm;
}

const prePage_3 = () => {
    let pages = getCurrentPages();
    let prePage = pages[pages.length - 3];
    // #ifdef H5
    return prePage;
    // #endif
    return prePage.$vm;
}
const ovPage = () => {
    let page = getCurrentPages()
    if (page.length == 1) {
        uni.reLaunch({
            url: '/pages/home/home'
        })
        return true;
    }
}

// 挂载bridge
Vue.prototype.$util = util;

Vue.config.productionTip = false
Vue.prototype.$fire = new Vue();
Vue.prototype.$store = store;
Vue.prototype.$api = {
    msg,
    json,
    prePage,
    prePage_3,
    ovPage
};
Vue.prototype.$ajax = ajax;
Vue.prototype.$eventHub = new Vue();
Vue.prototype.$axios = axios;
Vue.prototype.$uploadImg = upload_img;
Vue.prototype.$uuid = uuid;
Vue.prototype.$wx = wechat;
Vue.prototype.$jump = jump;
Vue.prototype.$title = true;
Vue.prototype.$api_url = 'https://www.holdsoft.cn/mall/';//'http://114.115.217.252:8001/HighMallServer/'
Vue.use(new JjimWidget());
Vue.component('cu-custom', cuCustom)
Vue.prototype = Object.assign(Vue.prototype, {
    globalData: {},
});
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
