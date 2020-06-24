<template>
    <view class="content">
        <view class="js">
            <view class="btns">
                <image class="backgo" src="../../static/backgo.png" mode="aspectFit" @click="backgo"></image>
                <image class="qrcord" src="../../static/qrcord.png" mode="aspectFill" @click="openqrcode"></image>
            </view>
            <image class="titleimg" :src="data.headimg" mode="aspectFill"></image>
            <view>
                <view class="logoimg"><image :src="data.logo" mode="aspectFill"></image></view>
                <view class="name">{{data.companyname}}</view>
                <view class="tip">
                    <text class="type" v-if="data.typetext!=''">{{data.typetext}}</text>
                    <block v-for="(item,indes) in data.levelarray" :key="indes + 'm'">
                        <image :src="'../../static/level'+item+'.png'" mode="aspectFit" class="tip"></image>
                    </block>
                    <text class="name">{{data.fansnumber}}</text>
                </view>
            </view>            
        </view>
        <view class="discount" v-for="(it,indek) in data.detaillist" :key="indek">
            <block v-if="it.type == 1">
                <text class="type" :style="'background: ' + it.activity.color">{{it.activity.text}}</text>
                <text>{{it.activity.title}}</text>
            </block>
            <block v-if="it.type == 2">
                <view>
                <view class="title">{{it.info.title}}</view>
                <view class="tips">{{it.info.content}}</view>
                </view>
            </block>
        </view>
        <view class="back" @click="backgo()">
            <image src="../../static/shopdetails.png" mode="aspectFit"></image>
        </view>
        <uni-popup ref="qrcode" class="qrcode">
            <view>
                <view class="title">店铺二维码</view>
                <image :src="srce" :style="{ width: cpSize + 'rpx', height: cpSize + 'rpx' }"></image>
                <canvas canvas-id="qrcode-canvas" :style="{ width: cpSize + 'rpx', height: cpSize + 'rpx' }" />
                <view class="tip">扫一扫关注店铺，长按保存至手机</view>
            </view>
        </uni-popup>
    </view>
</template>

<script>
import QRCode from '@/store/qrcode.js';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
export default {
    components: {
        uniPopup,
        QRCode
    },
    data() {
        return {
            srce: '',
            cpSize: 400,
            loadingType: 'more',
            cguid:'',
            data:{}
        };
    },
    onBackPress(){
        this.$api.ovPage()
    },
    onNavigationBarButtonTap(e) {
        
    },
    onLoad(options) {
        this.cguid = options.cguid;
        this.loadData();
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    //下拉刷新
    onPullDownRefresh() {
        this.loadData();
    },
    methods: {
        //加载商品 ，带下拉刷新和上滑加载
        async loadData() {
            this.$ajax.get("shophomepage/shopdetail",{cguid:this.cguid}).then(res => {
            	if(res.data.code == 0){
                    this.data=res.data.result.data;
                    uni.stopPullDownRefresh()
            	}
            });
        },
        openqrcode() {
            let that = this;
            let val = 'http://ets.51pingce.net/h5/#/pages/product/shop?cguid=' + that.cguid;
            if (that.srce == '') {
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
        backgo(){
            uni.navigateBack()
        }
    }
};
</script>

<style lang="scss">
page{
    background: $page-color-base;
}
.content {
    padding-bottom: 120rpx;
    padding-top: 540rpx;
}
.js{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    background: $page-color-base;
    .btns{
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        display: flex;
        justify-content: space-between;
        z-index: 2;
        .backgo{
            width: 80rpx;
            height: 80rpx;
            padding: 10rpx;
        }
        .qrcord{
            width: 80rpx;
            height: 80rpx;
            padding: 10rpx;
        }
    }
    .titleimg{
        width: 750rpx;
        height: 300rpx;
    }
    .logoimg{
        text-align: center;
        margin-top: -120rpx;
        image{
            width: 160rpx;
            height: 160rpx;
            border-radius: 50%;
        }
    }
    .name{
        text-align: center;
        font-size: 50rpx;
        margin-bottom: 20rpx;
    }
    .tip{
        text-align: center;
        font-size: 28rpx;
        vertical-align: middle;
        .type{
            padding: 0 10rpx;
            background: $base-color;
            border-radius: 10rpx;
            vertical-align: middle;
            margin-right: 10rpx;
            color: #FFF;
        }
        .tip{
            width: 30rpx;
            height: 30rpx;
            margin-right: 10rpx;
            vertical-align: middle;
        }
        .name{
            font-size: 28rpx;
            vertical-align: middle;
        }
    }
}
.discount{
    padding: 10rpx 30rpx;
    display: flex;
    align-items: center;
    font-size: 28rpx;
    .type{
        color: #FFF;
        background: #00B26A;
        margin-right: 20rpx;
        width: 80rpx;
        min-width: 80rpx;
        text-align: center;
        border-radius: 10rpx;
    }
    .title{
        font-size: 40rpx;
        margin-top: 20rpx;
        margin-bottom: 10rpx;
    }
    .tips{
        font-size: 28rpx;
        word-break:break-all;
    }
}
.back{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    background: $page-color-base;
    image{
        width: 50rpx;
        height: 50rpx;
        margin: 20rpx;
    }
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
</style>
