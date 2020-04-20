<template>
    <view>
        <view class="goods-section">
            <view class="g-item">
                <image :src="refundinfo.orderinfo.picurl"></image>
                <view class="right">
                    <text class="title">{{ refundinfo.orderinfo.productname }}</text>
                    <text class="spec">{{ refundinfo.orderinfo.attributeshow }}</text>
                    <!-- <view class="price-box">
                        <text class="price">￥17.8</text>
                        <text class="number">x 1</text>
                    </view> -->
                </view>
            </view>
        </view>

        <!-- 金额明细 -->
        <view class="yt-list">
            <view class="address-section b-b" v-for="(item, index) in refundinfo.refundkind" :key="index" @click="refundClick(item.refundtype)">
                <view class="order-content">
                    <view class="cen">
                        <view class="top">
                            <view class="name">
                                <block v-if="item.refundtype == 0"><image src="../../static/refund.png" mode="aspectFit"></image></block>
                                <block v-if="item.refundtype == 1"><image src="../../static/goods.png" mode="aspectFit"></image></block>
                                <block v-if="item.refundtype == 3"><image src="../../static/exchange.png" mode="aspectFit"></image></block>
                                {{ item.refundtitle }}
                            </view>
                        </view>
                        <text class="address">{{ item.refundcontent }}</text>
                    </view>
                    <text class="yticon icon-you"></text>
                </view>
            </view>
        </view>
        <!-- 金额明细 -->
        <view class="yt-list">
            <view class="record">{{ refundinfo.historyrecordtitle }}</view>
            <view class="address-section b-b">
                <view class="order-content" v-if="refundinfo.historyrecord.length > 0" v-for="(item, index) in refundinfo.historyrecord" :key="index" @click="historyClick(item)">
                    <text class="yticon">{{ item.index }}</text>
                    <view class="cen">
                        <view class="top">
                            <text class="name">{{ item.refundtypestr }}</text>
                        </view>
                        <text class="address">{{ item.codestr }}</text>
                        <text class="address">{{ item.createtime }}</text>
                    </view>
                    <text class="yticon icon-you">{{ item.resultflowstr }}</text>
                </view>
                <view class="order-content" v-if="refundinfo.historyrecord.length == 0"><text class="address">暂无数据</text></view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            refundinfo: {
                historyrecord: [],
                // historyrecordtitle: '历史记录',
                orderinfo: {
                    // attributeshow: "数量:1  5L",
                    // bopid: 10876,
                    // picid: 1206,
                    // picurl: "http://highmall.holdsoft.cn/290/1509791770760TB1eeBLRXXXXXasapXXXXXXXXXX_!!0-item_pic.jpg_430x430q90.jpg",
                    // productname: "鲁花5S压榨 5L",
                    picurl: ''
                },
                isclick: 1,
                isclickchange: 1
                // refundkind: [{
                // 	refundcontent: "未收到货或者卖家协商同意前提下",
                // 	refundtitle: "仅退款",
                // 	refundtype: 0
                // }, {
                // 	refundcontent: "已收到货，需要退换已收到的货物",
                // 	refundtitle: "退货并退款(问题反馈)",
                // 	refundtype: 1
                // }]
            },
            bopid: 0
        };
    },
    onLoad(options) {
        this.bopid = options.bopid;
        this.getApplyrefund();
    },
    onBackPress(){
        this.$api.ovPage()
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    methods: {
        // 获取退货页面的信息
        getApplyrefund() {
            this.$ajax.get('order/applyrefund', { bopid: this.bopid }).then(res => {
                console.log(res);
                if (res.data.code == 0) {
                    this.refundinfo = res.data.result.data;
                } else {
                    this.$api.msg('获取退款信息失败');
                }
            });
        },
        // 跳转至退货表单页面
        refundClick(state) {
            if (state == 0 && this.refundinfo.isclick != 1) {
                this.$api.msg('有正在处理的申请...');
                return;
            }
            if (state == 1 && this.refundinfo.isclickchange != 1) {
                this.$api.msg('有正在处理的申请...');
                return;
            }
            uni.navigateTo({
                url: '/pages/order/orderform?refundtype=' + state + '&bopid=' + this.bopid
            });
        },
        // 历史记录点击
        historyClick(obj) {
            uni.navigateTo({
                url: '/pages/order/createrecord?refundtype=' + obj.refundtype + '&code=' + obj.code
            });
        }
    }
};
</script>

<style lang="scss">
page {
    background: $page-color-base;
    padding:20rpx 20rpx 100upx 20rpx;
}
.record {
    padding: 30upx;
    border-bottom: 1px solid #e4e7ed;
}
.address-section {
    padding: 30upx;
    background: #fff;
    position: relative;

    .order-content {
        display: flex;
        align-items: center;
        .yticon {
            min-width: 40rpx;
        }
    }

    .icon-shouhuodizhi {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 90upx;
        color: #888;
        font-size: 44upx;
    }

    .cen {
        display: flex;
        flex-direction: column;
        flex: 1;
        font-size: 28upx;
        color: $font-color-dark;
    }

    .name {
        font-size: 34upx;
        margin-right: 24upx;
        image {
            width: 50rpx;
            height: 50rpx;
            vertical-align: middle;
            margin-right: 10rpx;
        }
    }

    .address {
        margin-top: 16upx;
        margin-right: 20upx;
        color: $font-color-light;
    }

    .icon-you {
        font-size: 32upx;
        color: $font-color-light;
        margin-right: 30upx;
    }

    .a-bg {
        position: absolute;
        left: 0;
        bottom: 0;
        display: block;
        width: 100%;
        height: 5upx;
    }
}
.goods-section {
    background: #fff;
    padding: 10rpx;
    border-radius: 18rpx;
    .g-header {
        display: flex;
        align-items: center;
        height: 84upx;
        padding: 0 30upx;
        position: relative;
    }

    .logo {
        display: block;
        width: 50upx;
        height: 50upx;
        border-radius: 100px;
    }

    .name {
        font-size: 30upx;
        color: $font-color-base;
        margin-left: 24upx;
    }
    .tel {
        margin-left: auto;
        color: #fa436a;
        font-size: 28rpx;
    }
    .g-item {
        display: flex;
        image {
            flex-shrink: 0;
            display: block;
            width: 140upx;
            height: 140upx;
            border-radius: 4upx;
        }

        .right {
            flex: 1;
            padding-left: 24upx;
            overflow: hidden;
        }

        .title {
            font-size: 30upx;
            color: $font-color-dark;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }

        .spec {
            font-size: 26upx;
            color: $font-color-light;
        }

        .price-box {
            display: flex;
            align-items: center;
            font-size: 32upx;
            color: $font-color-dark;
            padding-top: 10upx;

            .price {
                margin-bottom: 4upx;
            }
            .number {
                font-size: 26upx;
                color: $font-color-base;
                margin-left: 20upx;
            }
            .refund {
                width: 100rpx;
                text-align: center;
                border: 1px solid #dddddd;
                border-radius: 20rpx;
                padding: 6rpx;
                font-size: 28rpx;
                margin-left: auto;
            }
        }

        .step-box {
            position: relative;
        }
    }
}
.yt-list {
    margin-top: 16upx;
    background: #fff;
    border-radius: 18rpx;
    overflow: hidden;
}

.yt-list-cell {
    display: flex;
    align-items: center;
    padding: 10upx 30upx 10upx 40upx;
    line-height: 70upx;
    position: relative;

    &.cell-hover {
        background: #fafafa;
    }

    &.b-b:after {
        left: 30upx;
    }

    .cell-icon {
        height: 32upx;
        width: 32upx;
        font-size: 22upx;
        color: #fff;
        text-align: center;
        line-height: 32upx;
        background: #f85e52;
        border-radius: 4upx;
        margin-right: 12upx;

        &.hb {
            background: #ffaa0e;
        }

        &.lpk {
            background: #3ab54a;
        }
    }

    .cell-more {
        align-self: center;
        font-size: 24upx;
        color: $font-color-light;
        margin-left: 8upx;
        margin-right: -10upx;
    }

    .cell-tit {
        flex: 1;
        font-size: 26upx;
        color: $font-color-light;
        margin-right: 10upx;
    }

    .cell-tip {
        font-size: 26upx;
        color: $font-color-dark;

        &.disabled {
            color: $font-color-light;
        }

        &.active {
            color: $base-color;
        }
        &.red {
            color: $base-color;
        }
    }

    &.desc-cell {
        .cell-tit {
            max-width: 90upx;
        }
    }

    .desc {
        flex: 1;
        font-size: $font-base;
        color: $font-color-dark;
    }
}
.icon-you:after{
    margin-top:-14rpx
}
</style>
