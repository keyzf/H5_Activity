<template>
    <view class="content">
        <view class="envelopes">
            <view class="left">
                <view class="myenvelopes">{{ ubSum.tip }}</view>
                <view class="myenvelopes-number">{{ ubSum.ubvalue.toFixed(2) }}</view>
            </view>
        </view>
        <view class="coupon-item" v-for="(item, index) in navList" :key="index">
            <view class="left"><image :src="item.pic"></image></view>
            <view class="con">
                <view class="price">{{ item.typename }}</view>
                <view class="time">{{ item.time }}</view>
            </view>
            <view class="right" :class="item.costtype == 1 ? 'x' : ''">{{ item.ub }}</view>
        </view>
        <view class="footer">
            <text class="submit ash" @click="accounts">转账</text>
            <text class="submit" @click="recharge">充值</text>
        </view>
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
            loadingType: 'more',
            navList: [],
            pagesize: 10,
            lastid: '',
            ubSum: {
                tip: '',
                ubrule: '',
                ubvalue: 0
            }
        };
    },

    onLoad(options) {
        this.getMyExtra();
        let _this = this;
        uni.$on('reload_extra', function(data) {
            _this.onloadList();
        });
    },
    onUnload() {
        uni.$off('reload_extra');
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    // 下拉刷新
    onPullDownRefresh() {
        this.ubSum = {
            tip: '',
            ubrule: '',
            ubvalue: 0
        };
        this.loadingType = 'more';
        this.navList = [];
        this.getMyExtra();
    },
    // 加载更多
    onReachBottom() {
        if (this.navList.length > 0) {
            let lastid = this.navList[this.navList.length - 1].ubrecordid;
            this.getExtraList(lastid);
        }
    },
    methods: {
        // 转账完成后跳转
        onloadList(data) {
            this.loadingType = 'more';
            this.navList = [];
            this.getMyExtra();
        },
        recharge() {
            uni.navigateTo({
                url: '/pages/user/recharge'
            });
        },
        accounts() {
            uni.navigateTo({
                url: '/pages/user/accounts'
            });
        },
        // 我的U币
        getMyExtra() {
            if (this.loadingType === 'loading' || this.loadingType === 'noMore') {
                return;
            }
            this.loadingType = 'loading';
            this.$ajax.get('user/myallub', {}).then(res => {
                console.log(res);
                if (res.data.code == 0) {
                    this.ubSum = res.data.result.data;
                    this.loadingType = 'more';
                    this.getExtraList('');
                } else {
                    this.$api.msg(res.data.msg);
                }
                uni.stopPullDownRefresh();
            });
        },
        // U币 使用列表
        getExtraList(lastid) {
            if (this.loadingType === 'loading' || this.loadingType === 'noMore') {
                return;
            }
            this.loadingType = 'loading';
            this.$ajax.get('user/getubrecord', { pagesize: this.pagesize, lastid: lastid }).then(res => {
                console.log(res);
                if (res.data.code == 0) {
                    this.navList = this.navList.concat(res.data.result.data);
                    this.loadingType = res.data.result.data.length == this.pagesize ? 'more' : 'noMore';
                } else {
                    this.$api.msg(res.data.msg);
                }
                uni.stopPullDownRefresh();
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
    padding-bottom: 100rpx;
    padding-top: 380rpx;
}
.envelopes {
    position: fixed;
    top: 80rpx;
    left: 0;
    right: 0;
    z-index: 6;
    align-items: center;
    background: rgb(255, 168, 2);
    color: #ffffff;
    padding: 30rpx;
    .left {
        font-size: 120upx;
        .myenvelopes {
            font-size: 30upx;
            margin: 40rpx 0;
        }
    }
}

.coupon-item {
    padding: 20upx 30upx;
    background: #fff;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
        image {
            width: 60rpx;
            height: 60rpx;
            margin-right: 10rpx;
        }
    }
    .con {
        flex: 1;
        font-size: 32rpx;
        .time {
            font-size: 28rpx;
        }
    }
    .right {
        &.x {
            color: $base-color;
        }
    }
}
.footer {
    .ash {
        background: rgb(255, 168, 2);
        color: #fff;
    }
}
</style>
