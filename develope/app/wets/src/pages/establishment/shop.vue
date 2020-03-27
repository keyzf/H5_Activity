<template>
    <view class="content">
        <view v-if="companyresult == 1">
            <view class="shoptop">
                <view class="bg"></view>
                <view class="shoptoptitle">
                    <text class="number">{{ shopInfo.nicenumber }}</text>
                    <text class="title">{{ shopInfo.companyname }}</text>
                    <text class="state yticon icon-you" @click="openState">{{ shopInfo.businessstate == 1 ? '正在营业' : '暂停营业' }}</text>
                </view>
                <view class="shopbg">
                    <view style="flex-grow: 1;">
                        <view class="shopcon" @click="shop">
                            <view v-show="shopInfo.logo"><img :src="shopInfo.logo || '/static/missing-face.png'" class="titleimg" /></view>
                            <view class="free">
                                <view>
                                    <text class="type">{{ shopInfo.typename.substring(0, 2) }}</text>
                                    <text class="title">{{ shopInfo.companyname }}</text>
                                </view>
                                <view>{{ shopInfo.attention }}</view>
                                <view>
                                    <block v-for="(itemss,indesi) in shopInfo.levelarray" :key="indesi+'m'">
                                        <image :src="'../../static/level'+ itemss +'.png'" mode="aspectFit" class="tip"></image>
                                    </block>
                                </view>
                            </view>
                        </view>
                        <view class="free zjdx">
                            <view>
                                <image src="../../static/notice.png" class="noticetip"></image>
                                {{shopInfo.notice == '' ? '暂无公告': shopInfo.notice}}
                            </view>
                        </view>
                    </view>
                    <view class="follow">
                        <view @click="editshop">编辑</view>
						<image src="../../static/ercode.png" mode="aspectFit" class="code" @click="openqrcode"></image>
                    </view>
                </view>
            </view>
            <view class="checktext" v-if="checktext!=''" @click="shopcheck">
                {{checktext}}<text class="yticon icon-you"></text>
            </view>
            <view class="cate-section">
                <view class="cate-item" v-for="(menu, index) in menuArray" :key="index" v-if="[15].indexOf(menu.type) == -1" @click="clickMenu(menu.type)">
                    <img :src="menu.url" />
                    <view>{{ menu.name }}</view>
                    <text v-if="menu.hasnew == 1" class="numtip"></text>
                </view>
            </view>
            <uni-popup :show="show" type="center" :custom="true" :mask-click="false">
                <view class="uni-tip">
                    <view class="uni-tip-title">暂停营业后，您店铺中的商品会暂时搜索不到</view>

                    <view class="uni-tip-group-button">
                        <view class="uni-tip-button" @click="cancel('no')">取消</view>
                        <view class="uni-tip-button action" @click="cancel('yes')">确定</view>
                    </view>
                </view>
            </uni-popup>
            <uni-popup ref="qrcode" class="qrcode">
                <view>
                    <view class="title">店铺二维码</view>
                    <image :src="srce" :style="{ width: cpSize + 'rpx', height: cpSize + 'rpx' }"></image>
                    <canvas canvas-id="qrcode-canvas" :style="{ width: cpSize + 'rpx', height: cpSize + 'rpx' }" />
                    <view class="tip">扫一扫关注店铺，长按保存至手机</view>
                </view>
            </uni-popup>
        </view>
        <view v-else>
            <view
                class="creat_item"
                v-for="(item, inx) in creat_shopList" 
                @click="on_click_creat(item.type)"
                :style="'background-image:url(' + item.backgroundurl + ');'"
                :key="inx"
            >
                <view class="item">
                    <view><img :src="item.url" /></view>
                    <view>{{ item.typename }}</view>
                </view>
                <view>{{ item.explainwords }}</view>
            </view>
        </view>
    </view>
</template>

<script>
import QRCode from '@/store/qrcode.js';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import { mapMutations } from 'vuex';
export default {
    components: {
        uniPopup,
        QRCode
    },
    data() {
        return {
            loginState:false,
            checktext:'',
            downTimer: '',
            srce: '',
            cpSize: 400,
            show: false,
            shopInfo: {
                logo: '',
                companyname: '',
                typename: '',
                attention: '',
                notice: '',
                businessstate: '',
                nicenumber: '',
                companyQrCode: ''
            },
            menuArray: [],
            companyresult: '',
            creat_shopList: []
        };
    },
    created(){
    	this.hasCompany();
    	let _this = this;
        let userinfo = uni.getStorageSync('userInfo') || '';
        if (userinfo.guid) {
            this.loginState = true;
        } else {
            this.loginState = false;
        }
    	uni.$on('changeLoginState', function(data) {
    	    _this.hasCompany();
    	});
    	this.jumpshop(true);
    },
    methods: {
        ...mapMutations(['jumpshop']),
		load(){
			this.hasCompany();
			uni.stopPullDownRefresh();
		},
		more(){
		},
        hasCompany (){
            uni.showLoading({
                title: '加载中',
                mask: true
            });
            this.$ajax.get('com/hasCompany', {}).then(res => {
                if (res.data.code == 0) {
                    this.companyresult = res.data.result.data.companyresult; // 0-未创建店铺，1-已创建店铺
                    uni.setStorageSync('companyguid', res.data.result.data.companyguid);
                    if (this.companyresult == 0) {
                         uni.setTabBarItem({
                          index: 2,
                          text: '建店',
                        })
                        this.creat_load();
                        uni.hideLoading();

                    } else {
                        //已创建
                        uni.setTabBarItem({
                          index: 2,
                          text: '我的店铺',
                        })
                        this.cguid = uni.getStorageSync('companyguid'); //店铺id
                        this.shopMenu();
                        this.shopWindow();
                    }
                }
            });  
        },
        openqrcode() {
            let that = this;
            let val = 'http://ets.51pingce.net/pages/product/shop?cguid=' + that.cguid;
            if(that.srce == ''){
                let qrcode = new QRCode({
                    context: that, // 上下文环境
                    canvasId: 'qrcode-canvas', // canvas-id
                    showLoading: true, // 是否显示loading
                    loadingText: '加载中', // loading文字
                    text: val, // 生成内容
                    size: uni.upx2px(that.cpSize), // 二维码大小
                    background: '#FFF', // 背景色
                    foreground: '#000', // 前景色
                    correctLevel: 3, // 容错级别
                    cbResult: function(res) {
                        // 生成二维码的回调
                        that.srce = res;
                    }
                });
            }
            this.$refs.qrcode.open();
        },
        navTo() {
            if (!this.loginState) {
                uni.navigateTo({
                    url: '/pages/public/login'
                });
                return false;
            }
        },
        shopMenu() {
            this.$ajax
                .get('com/shopMenu', {
                    cguid: this.cguid
                })
                .then(res => {
                    if (res.data.code == 0) {
                        this.menuArray = res.data.result.data;
                    }
                });
        },
        shopWindow() {
            this.$ajax
                .get('com/shopWindow', {
                    cguid: this.cguid
                })
                .then(res => {
                    if (res.data.code == 0) {
                        let data = res.data.result.data;
                        this.shopInfo.logo = data.logo;
                        this.shopInfo.companyname = data.companyname;
                        this.shopInfo.typename = data.typename;
                        this.shopInfo.notice = data.notice;
                        this.shopInfo.businessstate = data.businessstate;
                        this.shopInfo.attention = data.attention;
                        this.shopInfo.nicenumber = data.nicenumber;
                        this.shopInfo.companyQrCode = data.companyQrCode;
                        this.shopInfo.levelarray = data.levelarray;
                        this.checktext = data.checktext;
                    }
                    uni.hideLoading();
                });
        },

        openState() {
            let _this = this;
            let itemList = [];
            if (this.shopInfo.businessstate == 1) {
                itemList = ['暂停营业'];
            } else if (this.shopInfo.businessstate == 0) {
                itemList = ['正在营业'];
            }
            uni.showActionSheet({
                itemList: itemList,
                success: function(res) {
                    if (_this.shopInfo.businessstate == 1) {
                        _this.show = true;
                    } else {
                        _this.setState(1);
                    }
                }
            });
        },
        cancel(type) {
            if (type == 'no') {
                this.show = false;
            } else {
                this.setState(0);
            }
        },
        setState(state) {
            this.$ajax
                .get('com/setCompanyBusinessState', {
                    cguid: this.cguid,
                    businessstate: state
                })
                .then(res => {
                    this.$api.msg(res.data.msg);
                    if (res.data.code == 0) {
                        this.show = false;
                        this.shopInfo.businessstate = state;
                    }
                });
        },
        clickMenu(type) {
            let url = '';
            switch (type) {
                case 1: //商品
                    url = '/pages/establishment/establishment?cguid=' + this.cguid;
                    break;
                case 2: //订单
                    url = '/pages/shoporder/shoporder';
                    break;
                case 3: //消息
                    url = '/pages/establishment/news';
                    break;
                case 4: //收入
                    url = '/pages/income/income';
                    break;
                case 5: //认证
                    url = '/pages/attestation/attestation';
                    break;
                case 6: //设置
                    url = '/pages/install/install?type=1';
                    break;
                case 7: //帮助
                    url = '/pages/establishment/help?url=' + encodeURIComponent('http://api.holdsoft.cn/mall/companyh5help/h5HelpHomepage') + '&type=0';
                    break;
                case 9: //促销
                    url = '/pages/promotion/promotion';
                    break;
                case 10: //装饰
                    url = '/pages/establishment/decorativeshop?cguid=' + this.cguid;
                    break;
                case 11: //聊天
                    url = '/pages/chat/list';
                    break;
                case 12: //客户
                    url = '/pages/connection/connection';
                    break;
                case 13: //店员
                    url = '/pages/clerk/clerk';
                    break;
                case 14: //攻略
                    url = '/pages/establishment/strategy';
                    break;
            }
            uni.navigateTo({
                url: url
            });
        },
        editshop() {
            uni.navigateTo({
                url: '/pages/establishment/editshop'
            });
        },
        shop() {
            uni.navigateTo({
                url: '/pages/product/shop?cguid=' + this.cguid
            });
        },
        creat_load() {
			if (uni.getStorageSync('companyguid') == '') return;
            let data = {
                cguid: uni.getStorageSync('companyguid')
            };
            this.$ajax.get('com/companytype', data).then(res => {
                if (res.data.code == 0) {
                    this.creat_shopList = res.data.result.data;
                    console.log(res.data.result.data);
                }
            });
        },
        on_click_creat(type) {
            if (!this.loginState) {
                uni.navigateTo({
                    url: '/pages/public/login'
                });
                return false;
            }else{
                uni.navigateTo({
                   url: '/pages/openshop/found?type=' + type
                });
            }
        },
        shopcheck(){
            uni.navigateTo({
               url: '/pages/establishment/shopcheck?cguid='+uni.getStorageSync('companyguid')
            });
        }
    }
};
</script>

<style lang="scss">
page {
    background: $page-color-base;
}

.content {
    border-top: 1px solid #dddddd;
}
.qrcode {
    text-align: center;
    .title {
        font-size: 32rpx;
        margin-bottom: 30rpx;
    }
    canvas {
        position: fixed;
        top: -99999upx;
        left: -99999upx;
        z-index: -99999;
    }
    .tip {
        font-size: 28rpx;
        margin-top: 30rpx;
    }
}
.shoptop {
    overflow: hidden;
    position: relative;
    .bg {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 30%;
        background: rgb(240, 75, 54);
    }
    .shoptoptitle {
        position: relative;
        text-align: center;
        color: #fff;
        line-height: 60rpx;
        align-items: center;
        display: flex;
        justify-content: space-between;
        .number {
            float: left;
            margin-left: 30rpx;
        }
        .title {
            width: 280rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: inline-block;
        }
        .state {
            float: right;
            background: rgb(205, 11, 26);
            border-radius: 30rpx 0 0 30rpx;
            padding: 0 30rpx 0 20rpx;
            display: inline-block;
            font-size: 28rpx;
            margin-top: 20rpx;
            &.icon-you:after {
                margin-top: -16rpx;
            }
        }
    }
}
.shopbg {
    position: relative;
    margin: 30rpx;
    background-size: 110% 110%;
    padding: 20rpx;
    background: #fff;
    border-radius: 20rpx;
    display: flex;
    box-shadow: 0 6rpx 12rpx rgb(240, 240, 240);
    .follow {
        min-width: 120rpx;
        width: 120rpx;
        text-align: center;
        margin-left: 20rpx;
        view {
            border-radius: 30rpx;
            background: rgb(239, 58, 71);
            color: #fff;
            font-size: 30rpx;
            padding: 10rpx;
        }
        image {
            margin-top: 30rpx;
            max-width: 100%;
            height: 100rpx;
        }
    }
    .shopcon {
        display: flex;
        align-items: center;
        font-size: 28rpx;
        .titleimg {
            width: 120rpx;
            height: 120rpx;
            margin-right: 20rpx;
            border-radius: 100rpx;
        }

        .tip {
            width: 30rpx;
            height: 30rpx;
            margin-right: 10rpx;
        }
    }
    
    .zjdx{
        font-size: 28rpx;
    }
    .free {
        flex-grow: 1;
        color: rgb(147, 147, 147);
        word-break: break-all;
        .title {
            color: #333333;
        }
        .type {
            display: inline-block;
            margin-right: 20rpx;
            background: rgb(239, 58, 71);
            color: #fff;
            border-radius: 8rpx;
            padding: 2rpx 12rpx;
        }
        .noticetip {
            width: 32rpx;
            height: 32rpx;
            margin-right: 6rpx;
            display: inline-block;
            vertical-align: middle;
        }
    }
}
.checktext{
    padding: 10rpx 30rpx;
    background:url(../../static/shopcheck.png) no-repeat left 40rpx center rgb(255, 250, 170);
    background-size: 30rpx 30rpx;
    padding-left: 80rpx;
    font-size: 28rpx;
    color: $base-color;
    
}
.cate-section {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 30upx 22upx;
    .cate-item {
        width: 20%;
        flex-direction: column;
        align-items: center;
        font-size: $font-sm + 2upx;
        color: $font-color-dark;
        margin-bottom: 14upx;
        text-align: center;
        position: relative;
        .numtip{
            position: absolute;
            top: 0;
            right: 20rpx;
            width: 16rpx;
            height: 16rpx;
            border-radius: 50%;
            background: $base-color;
        }
    }

    img {
        width: 88upx;
        height: 88upx;
    }
}

.uni-tip {
    padding: 15px;
    width: 300px;
    background: #fff;
    box-sizing: border-box;
    border-radius: 10px;
}

.uni-tip-title {
    text-align: center;
    font-weight: bold;
    font-size: 16px;
    color: #333;
}

.uni-tip-content {
    padding: 10rpx;
    font-size: 28rpx;
    color: #666;
    display: flex;
    align-items: center;
    border: 1px solid #dddddd;
    border-radius: 8rpx;
    margin: 20rpx 0;

    .cell-more {
        height: 30px;
        line-height: 30px;
        flex-grow: 1;
    }

    text {
        color: #007aff;
    }
}

.uni-tip-group-button {
    margin-top: 10px;
    display: flex;
}

.uni-tip-button {
    width: 100%;
    text-align: center;
    font-size: 14px;
    color: #3b4144;

    &.action {
        color: #007aff;
    }
}

.creat_item {
    margin: 20rpx 30rpx;
    color: #ffffff;
    padding: 30rpx;
    text-align: center;
    border-radius: 20rpx;
    vertical-align: middle;
    font-size: 28rpx;
    .item {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 10rpx;
    }
    img {
        width: 60rpx;
        height: 60rpx;
        display: inline-block;
        vertical-align: middle;
        margin-right: 20rpx;
    }
}
</style>
