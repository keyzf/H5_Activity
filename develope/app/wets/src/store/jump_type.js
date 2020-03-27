var util = require('./bridge.js');

function findAgent() {
    return window.navigator.userAgent.toLowerCase();
}

function jumpMethod(productId) {
    var ua = findAgent();
    if (ua.match(/holdmall/i) == 'holdmall') {
        // 初始化bridge
        util.mcallHandler('CallNative',{
            'key': 'neteasegoodsdetail',
            'productid':productId
        },function(responseData) {
            console.log("JS received response:", responseData)
            // uni.showToast({
            // 	title: responseData,
            // })
        });
    } else {
        uni.navigateTo({
            url: '/pages/product/product?productid=' + productId
        });
    }
}
function back() {
    var ua = findAgent();
    if (ua.match(/holdmall/i) == 'holdmall') {
        // 初始化bridge
        util.mcallHandler('CallNative',{
            'key': 'back'
        },function(responseData) {
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
    back:() => {
        return back();
    },
}

export default jump