<script>
/**
 * vuex管理登陆状态，具体可以参考官方登陆模板示例
 */
import { mapMutations } from 'vuex';
export default {
    methods: {
        ...mapMutations(['login', 'logout'])
    },
    onLaunch: async function() {
        // 判断是否是微信浏览器
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/holdmall/i) == 'holdmall') {
            this.$title = false;
        }
        // 页面url
        if (ua.match(/micromessenger/i) == 'micromessenger') {
            let thisUrl = window.location.href;
            // 页面参数
            let urlParams = thisUrl.split('?')[1] || '';
			// 推荐参数 recommendloginguid
            let regGuid = new RegExp('(^|&)recommendloginguid=([^&]*)(&|$)');
            let guid = urlParams.match(regGuid);
            if (guid != null) {
            	let guidStr = decodeURIComponent(guid[2]);
            	uni.setStorageSync('recommendloginguid', guidStr);
            }
			// 判断用户openid缓存
            if ((localStorage.getItem('userInfo') != null) && (localStorage.getItem('openid') != null)) {
				if (uni.getStorageSync('recommendloginguid') && uni.getStorageSync('userInfo').guid == "") {
					uni.navigateTo({
					    url: '/pages/public/login'
					});
				}
				if(uni.getStorageSync('isopenbuildcompany') == 1){
                    this.$store.dispatch('menu_3')
                }else{
                    this.$store.dispatch('menu_5')
                }
                this.$ajax.get('com/hasCompany', {}).then(res => {
                    if (res.data.code == 0) {
                        let companyresult = res.data.result.data.companyresult; 
                        // 0-未创建店铺，1-已创建店铺
                        if (companyresult == 1) {
                            this.$store.dispatch('menu_4');
                        }
                    }
                });
                return;
            }
            // 用户code
            let regCode = new RegExp('(^|&)code=([^&]*)(&|$)');
            let code = urlParams.match(regCode);
            // 参数state
            let regState = new RegExp('(^|&)state=([^&]*)(&|$)');
            let state = urlParams.match(regState);
            // 判断参数是否是微信转发来的
            if (code != null && state != null) {
                let decodeState = decodeURIComponent(state[2]);
                let codeStr = code[2];
                let stateStr = decodeState.indexOf('from=') >= 0 ? decodeState.indexOf('from=') == 0 ? '' : decodeState.substring(0, decodeState.indexOf('from=')) : decodeState;
                // 获取 用户openid
                let data = { code: codeStr };
                let url = 'wxservicenumber/getWechatGZOpenid';
                data = this.$ajax.sign(url, data);
                let header = this.$ajax.header();
                var [error, res] = await uni.request({
                    url: this.$api_url + url,
                    data: data,
                    header: header
                });
                if (res.data.code == 0) {
                    let data = res.data.result.data;
                    uni.setStorageSync('openid', data.openid);
                    uni.setStorageSync('isopenbuildcompany', data.isopenbuildcompany);
					let userInfo = {
                        guid: data.guid,
                        token: data.token
                    };
                    this.login(userInfo);
                    if(uni.getStorageSync('isopenbuildcompany') == 1){
                        this.$store.dispatch('menu_3')
                    }else{
                        this.$store.dispatch('menu_5')
                    }
                    this.$ajax.get('com/hasCompany', {}).then(res => {
                        if (res.data.code == 0) {
                            let companyresult = res.data.result.data.companyresult; 
                            // 0-未创建店铺，1-已创建店铺
                            if (companyresult == 1) {
                                this.$store.dispatch('menu_4');
                            }
                        }
                    });
                    uni.$emit('changeLoginState', {});
					// 如果是推荐活动进入的话 判断用户信息来确认是否走登录页
					if (uni.getStorageSync('recommendloginguid') && (data.guid == null || data.guid.length == 0)) {
						uni.navigateTo({
						    url: '/pages/public/login'
						});
					}
                    // thisUrl = thisUrl + (stateStr.length == 0 ? '' : '?' + stateStr)
                    // 修改页面路径
                    // history.replaceState(null, null, thisUrl);
                    // location.reload();
                } else {
                    this.$api.msg(res.data.msg);
                    this.logout();
                }
            } else {
                let redirectUrl =
                    'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx769f1c0cc1156be0&redirect_uri=' +
                    encodeURIComponent(thisUrl) +
                    '&response_type=code&scope=snsapi_userinfo&state=#wechat_redirect';
                location.href = redirectUrl;
            }
        } else {
            let userInfo = uni.getStorageSync('userInfo') || '';
            if (userInfo.guid) {
                this.login(userInfo);
            }
            if(uni.getStorageSync('isopenbuildcompany') == 1){
                this.$store.dispatch('menu_3')
            }else{
                this.$store.dispatch('menu_5')
            }
            this.$ajax.get('com/hasCompany', {}).then(res => {
                if (res.data.code == 0) {
                    let companyresult = res.data.result.data.companyresult; 
                    // 0-未创建店铺，1-已创建店铺
                    if (companyresult == 1) {
                        this.$store.dispatch('menu_4');
                    }
                }
            });
        }
    },
    onShow: function() {},
    onHide: function() {}
};
</script>

<style lang="scss">
/*
		全局公共样式和字体图标
	*/
@font-face {
    font-family: yticon;
    font-weight: normal;
    font-style: normal;
    src: url('https://at.alicdn.com/t/font_1078604_w4kpxh0rafi.ttf') format('truetype');
}
text{
    font-family: -apple-system,Helvetica,sans-serif;
}
view{
    font-family: -apple-system,Helvetica,sans-serif;
}
uni-tabbar .uni-tabbar__icon {
    width: 56rpx;
    padding: 6rpx;
}
.yticon {
    font-family: 'yticon' !important;
    font-size: 32rpx;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    position: relative;
}

.icon-yiguoqi1:before {
    content: '\e700';
}

.icon-iconfontshanchu1:before {
    content: '\e619';
}

.icon-iconfontweixin:before {
    content: '\e611';
}

.icon-alipay:before {
    content: '\e636';
}

.icon-shang:before {
    content: '\e624';
}

.icon-shouye:before {
    content: '\e626';
}

.icon-shanchu4:before {
    content: '\e622';
}

.icon-xiaoxi:before {
    content: '\e618';
}

.icon-jiantour-copy:before {
    content: '\e600';
}

.icon-fenxiang2:before {
    content: '\e61e';
}

.icon-pingjia:before {
    content: '\e67b';
}

.icon-daifukuan:before {
    content: '\e68f';
}

.icon-pinglun-copy:before {
    content: '\e612';
}

.icon-dianhua-copy:before {
    content: '\e621';
}

.icon-shoucang:before {
    content: '\e645';
}

.icon-xuanzhong2:before {
    content: '\e62f';
}

.icon-gouwuche_:before {
    content: '\e630';
}

.icon-icon-test:before {
    content: '\e60c';
}

.icon-icon-test1:before {
    content: '\e632';
}

.icon-bianji:before {
    content: '\e646';
}

.icon-jiazailoading-A:before {
    content: '\e8fc';
}

.icon-zuoshang:before {
    content: '\e613';
}

.icon-jia2:before {
    content: '\e60a';
}

.icon-huifu:before {
    content: '\e68b';
}

.icon-sousuo:before {
    content: '\e7ce';
}

.icon-arrow-fine-up:before {
    content: '\e601';
}

.icon-hot:before {
    content: '\e60e';
}

.icon-lishijilu:before {
    content: '\e6b9';
}

.icon-zhengxinchaxun-zhifubaoceping-:before {
    content: '\e616';
}

.icon-naozhong:before {
    content: '\e64a';
}

.icon-xiatubiao--copy:before {
    content: '\e608';
}

.icon-shoucang_xuanzhongzhuangtai:before {
    content: '\e6a9';
}

.icon-jia1:before {
    content: '\e61c';
}

.icon-bangzhu1:before {
    content: '\e63d';
}

.icon-arrow-left-bottom:before {
    content: '\e602';
}

.icon-arrow-right-bottom:before {
    content: '\e603';
}

.icon-arrow-left-top:before {
    content: '\e604';
}

.icon-icon--:before {
    content: '\e744';
}

.icon-zuojiantou-up:before {
    content: '\e605';
}

.icon-xia:before {
    content: '\e62d';
}

.icon--jianhao:before {
    content: '\e60b';
}

.icon-weixinzhifu:before {
    content: '\e61a';
}

.icon-comment:before {
    content: '\e64f';
}

.icon-weixin:before {
    content: '\e61f';
}

.icon-fenlei1:before {
    content: '\e620';
}

.icon-erjiye-yucunkuan:before {
    content: '\e623';
}

.icon-Group-:before {
    content: '\e688';
}
.yticon.icon-you {
    padding-right: 30rpx;
}
.icon-you:after {
    content: '\e606';
    position: absolute;
    right: 0;
    top: 50%;
    margin-top: -16rpx;
    line-height: 1;
}

.icon-forward:before {
    content: '\e607';
}

.icon-tuijian:before {
    content: '\e610';
}

.icon-bangzhu:before {
    content: '\e679';
}

.icon-share:before {
    content: '\e656';
}

.icon-yiguoqi:before {
    content: '\e997';
}

.icon-shezhi1:before {
    content: '\e61d';
}

.icon-fork:before {
    content: '\e61b';
}

.icon-kafei:before {
    content: '\e66a';
}

.icon-iLinkapp-:before {
    content: '\e654';
}

.icon-saomiao:before {
    content: '\e60d';
}

.icon-shezhi:before {
    content: '\e60f';
}

.icon-shouhoutuikuan:before {
    content: '\e631';
}

.icon-gouwuche:before {
    content: '\e609';
}

.icon-dizhi:before {
    content: '\e614';
}

.icon-fenlei:before {
    content: '\e706';
}

.icon-xingxing:before {
    content: '\e70b';
}

.icon-tuandui:before {
    content: '\e633';
}

.icon-zuanshi:before {
    content: '\e615';
}

.icon-zuo:before {
    content: '\e63c';
}

.icon-shoucang2:before {
    content: '\e62e';
}

.icon-shouhuodizhi:before {
    content: '\e712';
}

.icon-yishouhuo:before {
    content: '\e71a';
}

.icon-dianzan-ash:before {
    content: '\e617';
}

view,
scroll-view,
swiper,
swiper-item,
cover-view,
cover-image,
icon,
text,
rich-text,
progress,
button,
checkbox,
form,
input,
label,
radio,
slider,
switch,
textarea,
navigator,
audio,
camera,
image,
video {
    box-sizing: border-box;
}
/* 骨架屏替代方案 */
.Skeleton {
    background: #f3f3f3;
    padding: 20upx 0;
    border-radius: 8upx;
}

/* 图片载入替代方案 */
.image-wrapper {
    font-size: 0;
    border-radius: 4px;
    image {
        width: 100%;
        height: 100%;
    }
}

.clamp {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
}

.common-hover {
    background: #f5f5f5;
}
// 复选框
uni-checkbox .uni-checkbox-input {
    border-radius: 50%;
    background: #ddd;
    color: #fff !important;
    border: none;
}
uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked {
    background: $base-color;
}
uni-checkbox .uni-checkbox-input:before {
    font: normal normal normal 14px/1 uni;
    content: '\EA08';
    font-size: 18px !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -48%) scale(0.73);
    -webkit-transform: translate(-50%, -48%) scale(0.73);
}
uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked:before {
    font: normal normal normal 14px/1 uni;
    content: '\EA08';
    font-size: 18px !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -48%) scale(0.73);
    -webkit-transform: translate(-50%, -48%) scale(0.73);
}
// 单选框
uni-radio .uni-radio-input.uni-radio-input-checked {
    background: $base-color !important;
    border-color: $base-color !important;
}
// 开关
uni-switch .uni-switch-input.uni-switch-input-checked {
    background: $base-color !important;
    border-color: $base-color !important;
}
/*边框*/
.b-b:after,
.b-t:after {
    position: absolute;
    z-index: 3;
    left: 0;
    right: 0;
    height: 0;
    content: '';
    transform: scaleY(0.5);
    border-bottom: 1px solid $border-color-base;
}

.b-b:after {
    bottom: 0;
}

.b-t:after {
    top: 0;
}

/* button样式改写 */
uni-button,
button {
    height: 80upx;
    line-height: 80upx;
    font-size: $font-lg + 2upx;
    font-weight: normal;

    &.no-border:before,
    &.no-border:after {
        border: 0;
    }
}

uni-button[type='default'],
button[type='default'] {
    color: $font-color-dark;
}

/* input 样式 */
.input-placeholder {
    color: #999999;
}

.placeholder {
    color: #999999;
}
.flright {
    float: right;
}
// 促销活动页面样式
.sales {
    padding: 20rpx 30rpx;
    background: #ffffff;
    margin-bottom: 16rpx;
    border-bottom: 1px solid #dddddd;
    .title {
        display: flex;
        align-items: center;
        font-size: 32rpx;
        .tip {
            flex-grow: 1;
            .bq {
                margin-right: 20rpx;
                display: inline-block;
                background: $base-color;
                padding: 4rpx 10rpx;
                border-radius: 6rpx;
                color: #ffffff;
            }
        }
        .state {
            font-size: 24rpx;
            padding: 0 20rpx;
            min-width: 120rpx;
            &.x {
                color: $base-color;
            }
        }
    }
    .salescon {
        color: $font-color-light;
    }
    .salestime {
        display: flex;
        align-items: center;
        font-size: 28rpx;
        color: $font-color-light;
        .time {
            flex-grow: 1;
        }
        .btn {
            border: 1px solid #dddddd;
            border-radius: 16rpx;
            padding: 8rpx 16rpx;
            color: $font-color-base;
            min-width: 100rpx;
            text-align: center;
        }
    }
}
.footer {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 995;
    display: flex;
    align-items: center;
    width: 100%;
    height: 90upx;
    justify-content: space-between;
    font-size: 30upx;
    background-color: #fff;
    color: $font-color-base;
    box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);

    .submit {
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: #fff;
        font-size: 32upx;
        background-color: $base-color;
        &.ash {
            background-color: #fff;
            color: #333;
        }
    }
}

/* 商品列表 */
.goods-list {
    display: flex;
    flex-wrap: wrap;
    padding: 20rpx;
    .goods-item {
        display: flex;
        flex-direction: column;
        width: 48%;
        margin-bottom: 30rpx;
        background: #fff;
        border-radius: 20rpx;
        overflow: hidden;
        position: relative;
        &:nth-child(2n + 1) {
            margin-right: 4%;
        }
        .label {
            width: 80rpx;
            height: 80rpx;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 2;
        }
        .item-con {
            padding: 4rpx 10rpx 20rpx 10rpx;
        }
    }
    .image-wrapper {
        width: 100%;
        height: 330upx;
        border-radius: 3px;
        overflow: hidden;
        img {
            width: 100%;
            height: 330upx;
        }
        image {
            width: 100%;
            height: 330upx;
        }
        /deep/ image {
            width: 100%;
            height: 330upx;
        }
    }
    .title {
        font-size: $font-lg;
        color: $font-color-dark;
        line-height: 80upx;
        .presell {
            padding: 0rpx 8rpx;
            background: $uni-color-primary;
            font-size: 24rpx;
            color: white;
            margin-right: 12rpx;
            border-radius: 6rpx;
        }
    }
    .price-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-right: 10upx;
        font-size: 24upx;
        color: $font-color-light;
        view {
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            text {
                display: inline-block;
                border: 1px solid #ddd;
                border-radius: 10rpx;
                padding: 0 6rpx;
                margin-left: 10rpx;
            }
        }
    }
    .price {
        font-size: $font-lg;
        color: $uni-color-primary;
        line-height: 1;
    }
    .typename {
        font-size: 24rpx;
        color: white;
        margin-right: 12rpx;
        display: inline-block;
        vertical-align: middle;
        image {
            height: 34rpx;
            width: 100rpx;
            vertical-align: middle;
            border-radius: 6rpx;
        }
        text {
            border-radius: 6rpx;
            vertical-align: middle;
            padding: 0rpx 8rpx;
            background: $uni-color-primary;
        }
    }
    .companyname {
        font-size: 24rpx;
        font-family: 'yticon' !important;
        font-style: normal;
        &:after {
            content: '\e606';
            margin-top: -16rpx;
            font-size: 24rpx;
            margin: 0 0 0 4rpx;
        }
    }
}
.backtop {
    position: fixed;
    right: 30rpx;
    bottom: 180rpx;
    display: none;
    z-index: 3;
    image {
        width: 60rpx;
        height: 60rpx;
    }
    &.x {
        display: inline-block;
    }
}
uni-swiper .uni-swiper-dot-active {
    background-color: #ee3847;
}
</style>
