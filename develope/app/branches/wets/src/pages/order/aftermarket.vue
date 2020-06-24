<template>
    <view class="content">
        <view v-for="(item, index) in orderList" :key="index" class="order-item">
            <view class="i-top b-b">
                <text class="time">{{ item.companyname }}</text>
                <text class="state" :style="{ color: item.stateTipColor }">{{ item.statename }}</text>
                <text v-if="item.state === 9" class="del-btn yticon icon-iconfontshanchu1" @click="deleteOrder(index)"></text>
            </view>

            <view class="goods-box-single" v-for="(goodsItem, goodsIndex) in item.products" :key="goodsIndex" @click="jumpOrderDetail(goodsItem)">
                <image class="goods-img" :src="goodsItem.url" mode="aspectFill"></image>
                <view class="right">
                    <text class="title clamp">{{ goodsItem.productname }}</text>
                    <text class="attr-box">{{ goodsItem.attributeshow }} x {{ goodsItem.number }}</text>
                    <text class="price">{{ goodsItem.newprice }}</text>
                </view>
            </view>

            <view class="price-box">
                共
                <text class="num">{{ item.totalnumber }}</text>
                件商品 实付款
                <text class="price">{{ item.real_price }}</text>
            </view>
            <view class="action-box b-t" v-show="item.state < 5">
                <button v-show="item.state == 0" class="action-btn" @click="cancelOrder('cancelOrder', item)">取消订单</button>
                <button v-show="item.state == 0" class="action-btn" @click="cancelOrder('resetCart', item)">退回购物车</button>
                <button v-show="item.state == 0" class="action-btn recom" @click="nacTo('/pages/money/pay?ordernum=' + item.ordernumber + '&price=' + item.real_price)">
                    去支付
                </button>
                <button v-show="item.state == 1 || item.state == 2" class="action-btn" @click="nacTo('/pages/order/logistics?ordernum=' + item.ordernumber)">物流信息</button>
                <button v-show="item.state == 3 || item.state == 7" class="action-btn" @click="deleteOrder(index)">删除订单</button>
                <button v-show="item.state == 2" class="action-btn" @click="orderOk(index)">确认收货</button>
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
            orderList: [],
            pagesize: 10,
            loadingType:'more'
        };
    },
    onBackPress(){
        this.$api.ovPage()
    },
    onLoad() {
        this.loadData();
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    //下拉刷新
    onPullDownRefresh() {
        this.orderList = [];
        this.getOrderList('');
    },
    methods: {
        //首次加载
        loadData(source) {
            //防止重复加载
            if (this.loadingType === 'loading' || this.loadingType === 'noMore') {
                return;
            }
            this.orderList = [];
            this.getOrderList('');
        },
        // 获取订单列表
        getOrderList(lastid) {
            //这里是将订单挂载到tab列表下
            this.loadingType = 'loading';
            this.$ajax.get('order/getOrderList', {
                    ordertype: 5,
                    lastid: lastid,
                    pagesize: this.pagesize
                })
                .then(res => {
                    console.log(res.data.result.data);
                    if (res.data.code == 0) {
                        let data = res.data.result.data;
                        this.orderList = this.orderList.concat(data);
                        //判断是否还有数据， 有改为 more， 没有改为noMore
                        this.loadingType = data.length == this.pagesize ? 'more' : 'noMore';
                    } else {
                        this.$api.msg('系统出错,请稍后再试');
                    }
                    uni.stopPullDownRefresh();
                });
        },
        // 滚到到底部加载更多
        getOrderMore() {
            //防止重复加载
            if (this.loadingType === 'loading' || this.loadingType === 'noMore') {
                return;
            }
            let length = this.orderList.length;
            let lastId = length > 0 ? this.orderList[length - 1].orderid : '';
            this.getOrderList(lastId);
        },
        // 跳转订单详情
        jumpOrderDetail(order) {
            this.nacTo('/pages/order/orderdetails?ordernum=' + order.ordernum);
        },
        // 页面跳转
        nacTo(url) {
            uni.navigateTo({
                url: url
            });
        },
        //删除订单
        deleteOrder(index) {
            let _this = this;
            uni.showModal({
                title: '删除提示',
                content: '确认删除订单吗？',
                success: res => {
                    if (res.confirm) {
                        uni.showLoading({
                            title: '请稍后'
                        });
                        _this.$ajax.get('order/deleteorder', { ordernum: _this.navList[_this.tabCurrentIndex].orderList[index].ordernumber }).then(res => {
                            uni.hideLoading();
                            console.log(res);
                            if (res.data.code == 0) {
                                _this.navList[_this.tabCurrentIndex].orderList.splice(index, 1);
                            } else {
                                _this.$api.msg(res.data.msg);
                            }
                        });
                    }
                }
            });
        },
        //取消订单、退回购物车
        cancelOrder(type, item) {
            let _this = this;
            if (type == 'cancelOrder') {
                // 取消订单
                uni.showModal({
                    title: '提示',
                    content: '确定要取消订单吗？',
                    success: res => {
                        if (res.confirm) {
                            uni.showLoading({
                                title: '请稍后'
                            });
                            _this.$ajax.get('order/cancelorder', { ordernum: item.ordernumber }).then(res => {
                                uni.hideLoading();
                                console.log(res);
                                if (res.data.code == 0) {
                                    _this.navList[1].orderList = [];
                                    _this.getOrderList('');
                                } else {
                                    _this.$api.msg(res.data.msg);
                                }
                            });
                        }
                    }
                });
            } else if (type == 'resetCart') {
                // 退回购物车
                uni.showModal({
                    title: '提示',
                    content: '是否将订单中的商品退回购物车？',
                    success: res => {
                        if (res.confirm) {
                            uni.showLoading({
                                title: '请稍后'
                            });
                            _this.$ajax.get('order/createorderagain', { ordernum: item.ordernumber }).then(res => {
                                uni.hideLoading();
                                console.log(res);
                                if (res.data.code == 0) {
                                    uni.switchTab({
                                        url: '/pages/cart/cart'
                                    });
                                } else {
                                    _this.$api.msg(res.data.msg);
                                }
                            });
                        }
                    }
                });
            } else {
            }
        },
        //订单状态文字和颜色
        orderStateExp(state) {
            let stateTip = '',
                stateTipColor = '#fa436a';
            switch (+state) {
                case 1:
                    stateTip = '待付款';
                    break;
                case 2:
                    stateTip = '待发货';
                    break;
                case 9:
                    stateTip = '订单已关闭';
                    stateTipColor = '#909399';
                    break;

                //更多自定义
            }
            return { stateTip, stateTipColor };
        },
        // 确认收货
        orderOk(index) {
            let _this = this;
            uni.showModal({
                title: '提示',
                content: '是否确认收货',
                success: res => {
                    if (res.confirm) {
                        uni.showLoading({
                            title: '请稍后'
                        });
                        _this.$ajax.get('order/confirmreceipt', { ordernum: _this.navList[_this.tabCurrentIndex].orderList[index].ordernumber }).then(res => {
                            uni.hideLoading();
                            console.log(res);
                            if (res.data.code == 0) {
                                _this.navList[_this.tabCurrentIndex].orderList.splice(index, 1);
                            } else {
                                _this.$api.msg(res.data.msg);
                            }
                        });
                    }
                }
            });
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
.order-item {
    display: flex;
    flex-direction: column;
    padding-left: 30upx;
    background: #fff;
    margin-top: 16upx;
    .i-top {
        display: flex;
        align-items: center;
        height: 80upx;
        padding-right: 30upx;
        font-size: $font-base;
        color: $font-color-dark;
        position: relative;
        .time {
            flex: 1;
        }
        .state {
            color: $base-color;
        }
        .del-btn {
            padding: 10upx 0 10upx 36upx;
            font-size: $font-lg;
            color: $font-color-light;
            position: relative;
            &:after {
                content: '';
                width: 0;
                height: 30upx;
                border-left: 1px solid $border-color-dark;
                position: absolute;
                left: 20upx;
                top: 50%;
                transform: translateY(-50%);
            }
        }
    }
    /* 多条商品 */
    .goods-box {
        height: 160upx;
        padding: 20upx 0;
        white-space: nowrap;
        .goods-item {
            width: 120upx;
            height: 120upx;
            display: inline-block;
            margin-right: 24upx;
        }
        .goods-img {
            display: block;
            width: 100%;
            height: 100%;
        }
    }
    /* 单条商品 */
    .goods-box-single {
        display: flex;
        padding: 20upx 0;
        .goods-img {
            display: block;
            width: 120upx;
            height: 120upx;
        }
        .right {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 0 30upx 0 24upx;
            overflow: hidden;
            .title {
                font-size: $font-base + 2upx;
                color: $font-color-dark;
                line-height: 1;
            }
            .attr-box {
                font-size: $font-sm + 2upx;
                color: $font-color-light;
                padding: 10upx 12upx;
            }
            .price {
                font-size: $font-base + 2upx;
                color: $font-color-dark;
            }
        }
    }

    .price-box {
        display: flex;
        justify-content: flex-end;
        align-items: baseline;
        padding: 20upx 30upx;
        font-size: $font-sm + 2upx;
        color: $font-color-light;
        .num {
            margin: 0 8upx;
            color: $font-color-dark;
        }
        .price {
            font-size: $font-lg;
            color: $font-color-dark;
            &:before {
                content: '￥';
                font-size: $font-sm;
                margin: 0 2upx 0 8upx;
            }
        }
    }
    .action-box {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        height: 100upx;
        position: relative;
        padding-right: 30upx;
    }
    .action-btn {
        width: 160upx;
        height: 60upx;
        margin: 0;
        margin-left: 24upx;
        padding: 0;
        text-align: center;
        line-height: 60upx;
        font-size: $font-sm + 2upx;
        color: $font-color-dark;
        background: #fff;
        border-radius: 100px;
        &:after {
            border-radius: 100px;
        }
        &.recom {
            background: #fff9f9;
            color: $base-color;
            &:after {
                border-color: #f7bcc8;
            }
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
</style>
