<template>
    <view class="content">
        <view class="navbar">
            <view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{ current: tabCurrentIndex === index }" @click="tabClick(index)">{{ item.text }}</view>
        </view>

        <swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
            <swiper-item class="tab-content" v-for="(tabItem, tabIndex) in navList" :key="tabIndex">
                <scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData">
                    <!-- 空白页 -->
                    <empty v-if="tabItem.loaded === true && tabItem.orderList.length === 0"></empty>

                    <view class="coupon-item" v-for="(item, index) in tabItem.orderList" :key="index">
                        <view class="con">
                            <view class="left" :class="item.couponstate == 1 ? 'x' : ''">
                                <text class="price">{{ item.discounts }}</text>
                                <text>{{ item.limit }}</text>
                            </view>
                            <view class="right">
                                <view class="title">{{ item.title }}</view>
                                <view class="time" v-show="item.couponstate == 1">
                                    <view class="progress"><view class="progress-con" :style="'width:' + item.percentage * 100 + '%'"></view></view>
                                    {{ item.percentagetext }}
                                </view>
                                <view style="overflow: hidden;">
                                    <!-- 如果只有一个操作  是不是可以考虑直接点击领取 -->
                                    <text class="tips x" v-show="item.couponstate == 1" @click="getReceiveCoupon(item)">立即领取</text>
                                    <text class="tips x" v-show="item.couponstate == 2 && item.targettype != 5" @click="usecoupon(item)">立即使用</text>
                                    <text class="tips x" v-show="item.couponstate == 3 && item.targettype != 5" @click="usecoupon(item)">去看看</text>
                                </view>
                                <text class="received have-received" v-show="item.couponstate == 2"></text>
                                <text class="received looting" v-show="item.couponstate == 3"></text>
                            </view>
                        </view>
                    </view>

                    <uni-load-more :status="tabItem.loadingType"></uni-load-more>
                </scroll-view>
            </swiper-item>
        </swiper>
        <view class="footer">
            <text class="submit" @click="exchangecoupon">兑换</text>
            <text v-show="false" class="submit sys">扫一扫</text>
        </view>
        <uni-popup ref="popup" type="center">
            <view class="uni-tip">
                <view class="uni-tip-title">优惠券使用说明</view>
                <text class="input">{{ msg }}</text>
                <view class="uni-tip-group-button"><view class="uni-tip-button" @click="closes">确定</view></view>
            </view>
        </uni-popup>
    </view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import empty from '@/components/empty';
export default {
    components: {
        uniLoadMore,
        empty,
        uniPopup
    },
    data() {
        return {
            msg:'',
            tabCurrentIndex: 0,
            navList: [
                {
                    state: 0,
                    text: '平台优惠券',
                    loadingType: 'more',
                    orderList: []
                },
                {
                    state: 1,
                    text: '店铺优惠券',
                    loadingType: 'more',
                    orderList: []
                }
            ]
        };
    },
    onLoad(options) {
        this.loadData();
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    // 下拉刷新
    onPullDownRefresh() {
        let index = this.tabCurrentIndex;
        let navItem = this.navList[index];
        navItem.loadingType = 'more';
        navItem.orderList = [];
        this.loadData();
    },
    onNavigationBarButtonTap(e) {
        console.log(e.index)
        if(e.index == 0){
            this.$ajax.get('user/couponIntro', {}).then(res => {
                if (res.data.code == 0) {
                    this.msg = res.data.result.data.detail;
                    this.$refs.popup.open();
                } else {
                    this.$api.msg('使用说明拉取失败');
                }
            });
        }else{
            uni.navigateTo({
                url: '/pages/user/coupon'
            });
        }
    },
    methods: {
        exchangecoupon() {
            uni.navigateTo({
                url: '/pages/user/exchangecoupon'
            });
        },
        //获取订单列表
        loadData(source) {
            //这里是将订单挂载到tab列表下
            let index = this.tabCurrentIndex;
            let navItem = this.navList[index];
            //防止重复加载
            if (navItem.loadingType === 'loading' || navItem.loadingType === 'noMore') {
                return;
            }
            //tab切换只有第一次需要加载数据
            if (source === 'tabChange' && navItem.loaded === true) {
                return;
            }

            let state = navItem.state;
            let lastid = navItem.orderList.length > 0 ? navItem.orderList[navItem.orderList.length - 1].couponid : '';
            let pagesize = 10;
            let url = navItem.state == 0 ? 'user/couponcenter' : 'user/shopcouponcenter';
            navItem.loadingType = 'loading';
            this.$ajax.get(url, { pagesize: pagesize, lid: lastid }).then(res => {
                console.log(res);
                if (res.data.code == 0) {
                    let data = res.data.result.data;
                    navItem.orderList = navItem.orderList.concat(data);
                    this.$set(navItem, 'loaded', true);
                    navItem.loadingType = data.length == pagesize ? 'more' : 'noMore';
                } else {
                    this.$api.msg('列表获取失败');
                }
                // 如果是第一次  则关闭下拉刷新
                if (res.data.result.data.length == navItem.orderList.length) uni.stopPullDownRefresh();
            });
        },

        //swiper 切换
        changeTab(e) {
            this.tabCurrentIndex = e.target.current;
            this.loadData('tabChange');
        },
        //顶部tab点击
        tabClick(index) {
            this.tabCurrentIndex = index;
            this.loadData('tabChange');
        },
        // 领取优惠券
        getReceiveCoupon(item) {
            uni.showLoading({
                title: '领取中...',
                mask: true
            });
            this.$ajax.get('product/getReceiveCoupon', { couponid: item.couponid }).then(res => {
                uni.hideLoading();
                if (res.data.code == 0) {
                    item.couponstate = 2;
                } else {
                    this.$api.msg('领取失败');
                }
            });
        },
        // 立即使用
        usecoupon(item) {
            // 跳转类型优惠券类型 1针对单个商品，2针对某种系列的商品例如华为手机荣耀系列，3针对某种类型例如手机类型，4店铺，5全场类 6 keywords
            let type = item.targettype;
            // let state = item.couponstate;
            switch (type) {
                case 1: // 跳转商品详情
                    uni.navigateTo({
                        url: '/pages/product/product?productid=' + item.keyword
                    });
                    break;
                case 2: // 跳转搜索
                    uni.navigateTo({
                        url: '/pages/product/searchlist?targetids=' + item.keyword
                    });
                    break;
                case 3: // 跳转搜索
                    uni.navigateTo({
                        url: '/pages/product/searchlist?targetids=' + item.keyword
                    });
                    break;
                case 4: // 跳转店铺首页
                    uni.navigateTo({
                        url: '/pages/product/shop?cguid=' + item.cguid
                    });
                    break;
                case 5: // 不处理
                    break;
                case 6: // 跳转首页分类
                    uni.navigateTo({
                        url: '/pages/product/catelist?id=' + item.keyword
                    });
                    break;
            }
        },
        closes() {
            this.$refs.popup.close();
        }
    }
};
</script>

<style lang="scss">
page,
.content {
    background: $page-color-base;
    height: 100%;
}
page {
    padding-bottom: 100rpx;
}
.swiper-box {
    height: calc(100% - 40px);
}
.list-scroll-content {
    height: 100%;
}

.navbar {
    display: flex;
    height: 40px;
    padding: 0 5px;
    background: #fff;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.06);
    position: relative;
    z-index: 10;
    .nav-item {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        font-size: 15px;
        color: $font-color-dark;
        position: relative;
        &.current {
            color: $base-color;
            &:after {
                content: '';
                position: absolute;
                left: 50%;
                bottom: 0;
                transform: translateX(-50%);
                width: 44px;
                height: 0;
                border-bottom: 2px solid $base-color;
            }
        }
    }
}

.uni-swiper-item {
    height: auto;
}

.coupon-item {
    margin: 20upx 24upx;
    background: #fff;
    overflow: hidden;
    .con {
        display: flex;
        align-items: center;
        position: relative;
        &:after {
            position: absolute;
            left: 0;
            bottom: 0;
            content: '';
            width: 100%;
            height: 0;
            border-bottom: 1px dashed #f3f3f3;
            transform: scaleY(50%);
        }
    }
    .left {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 240rpx;
        min-width: 240rpx;
        overflow: hidden;
        color: #ffffff;
        padding: 20rpx 30upx;
        text-align: center;
        background: #dddddd;
        height: 200rpx;
        font-size: 24rpx;
        &.x {
            background: #fa436a;
        }
    }
    .title {
        font-size: 32upx;
        color: $font-color-dark;
        margin-bottom: 10upx;
    }
    .time {
        font-size: 24upx;
        color: $font-color-light;
    }
    .right {
        font-size: 26upx;
        color: $font-color-base;
        flex-grow: 1;
        padding: 0 30upx;
    }
    .tips {
        font-size: 24upx;
        color: $font-color-light;
        display: inline-block;
        border-radius: 20upx;
        margin-right: 30rpx;
        position: relative;
        z-index: 2;
        &.x {
            padding: 0 10upx;
            border: 1px solid #fa436a;
            color: #fa436a;
            float: right;
            margin-top: 10rpx;
        }
    }
    .price {
        font-size: 44upx;
        color: #ffffff;
    }
    .progress {
        width: 50%;
        height: 4px;
        border: 1px solid #fa436a;
        border-radius: 4px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
        overflow: hidden;
        .progress-con {
            width: 4%;
            height: 4px;
            float: left;
            background: #fa436a;
        }
    }
    .received {
        position: absolute;
        top: 40rpx;
        right: 40rpx;
        z-index: 1;
        &.looting {
            width: 130rpx;
            height: 130rpx;
            background: url(../../static/looting.png) no-repeat center;
            background-size: 100% 100%;
        }
        &.have-received {
            width: 130rpx;
            height: 130rpx;
            background: url(../../static/have-received.png) no-repeat center;
            background-size: 100% 100%;
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
    z-index: 998;
    color: $font-color-base;
    box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);
    .submit {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 750upx;
        height: 100%;
        color: #fff;
        font-size: 32upx;
        background-color: $base-color;
        &.sys {
            background-color: #f0ad4e;
        }
    }
}
/* load-more */
.uni-load-more {
    display: flex;
    flex-direction: row;
    height: 80upx;
    align-items: center;
    justify-content: center;
}

.uni-load-more__text {
    font-size: 28upx;
    color: #999;
}

.uni-load-more__img {
    height: 24px;
    width: 24px;
    margin-right: 10px;
}

.uni-load-more__img > view {
    position: absolute;
}

.uni-load-more__img > view view {
    width: 6px;
    height: 2px;
    border-top-left-radius: 1px;
    border-bottom-left-radius: 1px;
    background: #999;
    position: absolute;
    opacity: 0.2;
    transform-origin: 50%;
    animation: load 1.56s ease infinite;
}

.uni-load-more__img > view view:nth-child(1) {
    transform: rotate(90deg);
    top: 2px;
    left: 9px;
}

.uni-load-more__img > view view:nth-child(2) {
    transform: rotate(180deg);
    top: 11px;
    right: 0;
}

.uni-load-more__img > view view:nth-child(3) {
    transform: rotate(270deg);
    bottom: 2px;
    left: 9px;
}

.uni-load-more__img > view view:nth-child(4) {
    top: 11px;
    left: 0;
}

.load1,
.load2,
.load3 {
    height: 24px;
    width: 24px;
}

.load2 {
    transform: rotate(30deg);
}

.load3 {
    transform: rotate(60deg);
}

.load1 view:nth-child(1) {
    animation-delay: 0s;
}

.load2 view:nth-child(1) {
    animation-delay: 0.13s;
}

.load3 view:nth-child(1) {
    animation-delay: 0.26s;
}

.load1 view:nth-child(2) {
    animation-delay: 0.39s;
}

.load2 view:nth-child(2) {
    animation-delay: 0.52s;
}

.load3 view:nth-child(2) {
    animation-delay: 0.65s;
}

.load1 view:nth-child(3) {
    animation-delay: 0.78s;
}

.load2 view:nth-child(3) {
    animation-delay: 0.91s;
}

.load3 view:nth-child(3) {
    animation-delay: 1.04s;
}

.load1 view:nth-child(4) {
    animation-delay: 1.17s;
}

.load2 view:nth-child(4) {
    animation-delay: 1.3s;
}

.load3 view:nth-child(4) {
    animation-delay: 1.43s;
}

@-webkit-keyframes load {
    0% {
        opacity: 1;
    }

    100% {
        opacity: 0.2;
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
