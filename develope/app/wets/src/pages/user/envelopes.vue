<template>
    <view>
        <view class="envelopes">
            <view class="left">
                <view class="myenvelopes">红包总额(元)</view>
                <view class="myenvelopes-number">{{ allredpacketbalance }}</view>
            </view>
        </view>
        <view class="envelopestitle">我的红包</view>
        <view class="coupon-item" v-for="(item, index) in navList" :key="index" @click="envelopesedit(item)">
            <view class="con">
                <view class="left"><image src="../../static/hongs.png" mode="aspectFit"></image></view>
                <view class="right">
                    <view class="price">{{ item.redpacketbalance }}</view>
                    <view class="type">{{ item.typemsg }}</view>
                    <view class="time">{{ item.time }}</view>
                </view>
            </view>
        </view>
        <uni-load-more :status="loadingType"></uni-load-more>
    </view>
</template>

<script>
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
export default {
    components: {
        uniLoadMore
    },
    data() {
        return {
            allredpacketbalance: 0.0,
            navList: [],
            pagesize: 10,
            lastid: '',
            loadingType: 'more'
        };
    },

    onLoad(options) {
        this.getEnvelopesSum();
        this.getEnvelopesList();
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    onNavigationBarButtonTap(e) {
        this.dk();
    },
    // 下拉刷新
    onPullDownRefresh() {
        this.lastid = '';
        this.getEnvelopesSum();
        this.getEnvelopesList();
    },
    // 加载更多
    onReachBottom() {
        if (this.loadingType == 'nomore') return;
        this.getEnvelopesList();
    },
    methods: {
        // 获取红包总额
        getEnvelopesSum() {
            this.$ajax.get('redpacket/getuseallredpacketbalance', {}).then(res => {
                if (res.data.code == 0) {
                    this.allredpacketbalance = res.data.result.data.allredpacketbalance;
                } else {
                    this.$api.msg('红包金额获取失败');
                }
            });
        },
        // 获取红包列表
        getEnvelopesList() {
            this.$ajax
                .get('redpacket/getuseredpacketrulelist', {
                    pagesize: this.pagesize,
                    lastid: this.lastid
                })
                .then(res => {
                    if (res.data.code == 0) {
                        if (this.lastid == 0 || this.lastid == '') {
                            this.navList = res.data.result.data;
                        } else {
                            this.navList = this.navList.concat(res.data.result.data);
                        }
                        if (res.data.result.data.length != this.pagesize) {
                            this.loadingType = 'nomore';
                        } else {
                            this.loadingType = 'more';
                            this.lastid = res.data.result.data[res.data.result.data.length - 1].userredpacketid;
                        }
                    } else {
                        this.$api.msg(res.data.msg);
                    }
                    uni.stopPullDownRefresh();
                });
        },
        dk() {
            uni.navigateTo({
                url: '/pages/user/invalidenvelopes'
            });
        },
        envelopesedit(it) {
            uni.navigateTo({
                url: '/pages/user/envelopesedit?userredpacketid='+it.userredpacketid
            });
        }
    }
};
</script>

<style lang="scss">
page {
    background: $page-color-base;
}

.envelopes {
    background: #fa436a;
    color: #ffffff;
    padding: 40rpx;

    .left {
        font-size: 38upx;

        .myenvelopes {
            margin-top: 60rpx;
            font-size: 32upx;
        }

        .myenvelopes-number {
            font-size: 100upx;
        }
    }

    .right {
        flex-grow: 1;
        text-align: right;
        font-size: 30upx;
    }
}

.envelopestitle {
    margin: 20rpx;
}

.coupon-item {
    margin: 20upx 24upx;
    background: $base-color;
    overflow: hidden;
    padding: 20rpx;
    border-radius: 20rpx;
    color: #ffcc00;
    .con {
        display: flex;
        position: relative;
    }

    .left {
        image {
            width: 80rpx;
            height: 80rpx;
        }
    }

    .title {
        font-size: 32upx;
        margin-bottom: 10upx;
    }

    .time {
        font-size: 24upx;
        margin-top: 12rpx;
        text-align: right;
    }

    .right {
        font-size: 26upx;
        flex-grow: 1;
        padding: 0 30upx;
        color: #ffcc00;
    }

    .price {
        font-size: 44upx;
    }

    .received {
        position: absolute;
        top: 0;
        right: 10rpx;
    }
}
</style>
