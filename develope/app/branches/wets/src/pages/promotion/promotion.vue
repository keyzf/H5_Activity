<template>
    <view>
        <view class="promotiontitle" @click="detailed">
            {{ honorpoint.honorpointtext }}
            <text class="promotionnumber">{{ honorpoint.honorpoint }}</text>
            <text class="promotiondet">{{ honorpoint.honorpointdetail }}</text>
        </view>
        <view class="cate-section">
            <view class="cate-item" @click="reduction">
                <image src="../../static/jian.png" mode="aspectFit"></image>
                <view>满减</view>
            </view>
            <view class="cate-item" @click="give">
                <image src="../../static/zeng.png" mode="aspectFit"></image>
                <view>满赠</view>
            </view>
            <view class="cate-item" @click="coupon">
                <image src="../../static/quan.png" mode="aspectFit"></image>
                <view>优惠券</view>
            </view>
            <view class="cate-item" @click="discount">
                <image src="../../static/zhe.png" mode="aspectFit"></image>
                <view>折扣</view>
            </view>
            <view class="cate-item" @click="exemption">
                <image src="../../static/mian.png" mode="aspectFit"></image>
                <view>满免</view>
            </view>
            <view class="cate-item" @click="freight">
                <image src="../../static/yun.png" mode="aspectFit"></image>
                <view>运费</view>
            </view>
            <view class="cate-item" @click="envelopes">
                <image src="../../static/hong.png" mode="aspectFit"></image>
                <view>红包</view>
            </view>
            <view class="cate-item" @click="advertisement">
                <image src="../../static/guang.png" mode="aspectFit"></image>
                <view>广告推送</view>
            </view>
            <view class="cate-item" @click="rob">
                <image src="../../static/qiang.png" mode="aspectFit"></image>
                <view>抢购</view>
            </view>
            <view class="cate-item" @click="recommend">
                <image src="../../static/tui.png" mode="aspectFit"></image>
                <view>店长推荐</view>
            </view>
        </view>
        <uni-popup ref="popup" type="center" >
             <view class="uni-tip">
                 <view class="uni-tip-title">促销规则</view>
                 <text class="input">{{msg}}</text>
                 <view class="uni-tip-group-button">
                     <view class="uni-tip-button" @click="closes">确定</view>
                 </view>
             </view>
        </uni-popup>
    </view>
</template>

<script>
import uniPopup from "@/components/uni-popup/uni-popup.vue"
export default {
    components: {uniPopup},
    data() {
        return {
            cguid: 0,
            honorpoint: {},
            msg:''
        };
    },
    onLoad() {
        this.cguid = uni.getStorageSync('companyguid');
        this.$ajax.get('buylimit/gethonorpoint', { cguid: this.cguid }).then(res => {
            console.log(res.data);
            if (res.data.code == 0) {
                this.honorpoint = res.data.result.data;
            } else {
                this.$api.msg('系统出错,请稍后再试');
            }
        });
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    onNavigationBarButtonTap(e) {
        uni.showLoading({
            title:'加载中'
        })
        const index = e.index;
        this.$ajax.get('sale/getsalerule', { cguid: this.cguid }).then(res => {
            if (res.data.code == 0) {
                this.msg = res.data.result.data.salerule;
                uni.hideLoading();
                this.$refs.popup.open();
            } else {
                this.$api.msg('系统出错,请稍后再试');
            }
        })
    },
    methods: {
        closes(){
            this.$refs.popup.close();
        },
        reduction() {
            uni.navigateTo({
                url: '/pages/promotion/reduction'
            });
        },
        give() {
            uni.navigateTo({
                url: '/pages/promotion/give'
            });
        },
        coupon() {
            uni.navigateTo({
                url: '/pages/promotion/coupon'
            });
        },
        discount() {
            uni.navigateTo({
                url: '/pages/promotion/discount'
            });
        },
        exemption() {
            uni.navigateTo({
                url: '/pages/promotion/exemption'
            });
        },
        freight() {
            uni.navigateTo({
                url: '/pages/promotion/freight'
            });
        },
        envelopes() {
            uni.navigateTo({
                url: '/pages/promotion/envelopes'
            });
        },
        advertisement() {
            uni.navigateTo({
                url: '/pages/promotion/advertisement'
            });
        },
        rob() {
            uni.navigateTo({
                url: '/pages/promotion/rob'
            });
        },
        recommend() {
            uni.navigateTo({
                url: '/pages/promotion/recommend'
            });
        },
        detailed() {
            uni.navigateTo({
                url: '/pages/promotion/detailed'
            });
        }
    }
};
</script>

<style lang="scss">

.promotiontitle {
    padding: 10upx 30rpx;
    font-size: 28rpx;
    background: $page-color-base;
    .promotionnumber {
        font-size: 44rpx;
        color: $base-color;
        margin: 0 14rpx;
        font-weight: 600;
        vertical-align: middle;
    }
    .promotiondet {
        font-size: 28rpx;
        color: #0faeff;
        margin: 0 10rpx;
        text-decoration: underline;
    }
}
.cate-section {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    background: #fff;
    .cate-item {
        width: 25%;
        padding: 20rpx 0;
        flex-direction: column;
        align-items: center;
        font-size: $font-sm + 2upx;
        color: $font-color-dark;
        margin-bottom: 14upx;
        text-align: center;
    }
    image {
        width: 68upx;
        height: 68upx;
    }
}
.uni-tip {
    background: #fff;
    box-sizing: border-box;
}

.uni-tip-title {
    text-align: center;
    font-weight: bold;
    font-size: 16px;
    color: #333;
}

.input {
    padding: 12rpx;
    font-size: 28rpx;
    color: #666;
    border-bottom: 1px solid #dddddd;
    display: block;
    max-height: 60vh;
    overflow-y: auto;
}

.uni-tip-group-button {
    margin-top: 10px;
}

.uni-tip-button {
    text-align: center;
    font-size: 14px;
    color: $base-color;
}
</style>
