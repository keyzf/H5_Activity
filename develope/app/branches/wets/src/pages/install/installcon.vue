<template>
    <view class="content">
        <view class="commodity" v-for="(item, index) in data.chargelist" :key="index">
            <view class="commodity-con">
                <view class="title">{{ item.title }}</view>
                <view class="tip">
                    <text>{{ item.detail }}</text>
                </view>
            </view>
            <view class="stata">
                <view v-if="item.originprice" class="tip">{{item.originprice}}</view>
                <view>{{ item.price }}</view>
            </view>
            <text class="paid" v-if="item.paystate == 1"></text>
        </view>
        <!-- v-show="data.totalprice != 0" -->
        <view class="footer" v-if="type == 0" v-show="data.totalprice != 0">
            <text class="submit ash" v-if="type == 0" @click="jump_fun(0)">以后再说</text>
            <text class="submit" @click="creat_submit(1)">去支付</text>
        </view>
        <view class="footer" v-else v-show="data.totalprice != 0">
            <text class="submit" @click="submit">支付</text>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            cguid: uni.getStorageSync('companyguid'),
            type: 0, //0建店过程 1已建店
            force: 0,
            data: {
                totalprice: 0
            }
        };
    },
    onLoad(option) {
        this.type = option.type;
        this.getChargelist();
    },
    onBackPress(){
        this.$api.ovPage()
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    onNavigationBarButtonTap(e) {
        uni.navigateTo({
            url: '/pages/install/install-history'
        });
    },
    methods: {
        // 获取店铺资费
        getChargelist() {
            this.$ajax.get('com/chargelist', { cguid: this.cguid, type: this.type }).then(res => {
                console.log(res);
                if (res.data.code == 0) {
                    this.data = res.data.result.data;
                } else {
                    this.$api.msg('获取资费失败');
                }
            });
        },
        // 缴费
        submit() {
            this.createDepositOrder();
        },

        //缴费请求
        createDepositOrder() {
            this.$ajax.get('com/createDepositOrder', { cguid: this.cguid, costtype: this.data.costtype }).then(res => {
                console.log(res);
                if (res.data.code == 0) {
                    let result = res.data.result.data;
                    uni.navigateTo({
                        url: '/pages/install/pay?ordernum=' + result.ordernumber + '&price=￥' + result.deposit + '&type=' + this.type
                    });
                } else {
                    this.$api.msg('下单失败');
                    this.jump_fun();
                }
            });
        },
        // 建店缴费
        creat_submit(type) {
            this.creatSuccess(type);
            this.createDepositOrder();
        },
        jump_fun(type) {
            this.creatSuccess(type);
        },
        //建店完成接口
        creatSuccess(type) {
            try {
                this.$ajax.get('com/setCompanyState', { cguid: uni.getStorageSync('companyguid') }).then(res => {
                    if (res.data.code == 0) {
                        //shop建店页面 刷新
                        uni.$emit('changeLoginState', {});
                        console.log("changeLoginState -- type" + type)
                        if (type == 0) {  //0以后再说  1 去支付
                            uni.switchTab({
                                url: '/pages/establishment/shop'
                            });
                        }
                    }
                });
            } catch (e) {
                //TODO handle the exception
            }
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
}

.commodity {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #ffffff;
    padding: 20rpx 30rpx;
    border-bottom: 1px solid #dddddd;
    .commodity-con {
        flex-grow: 1;
        .title {
            font-size: 30rpx;
            margin-bottom: 10rpx;
        }
        .tip {
            font-size: 24rpx;
            color: $font-color-base;
        }
    }
    .stata {
        min-width: 100rpx;
        font-size: 40rpx;
        margin-left: 20rpx;
        color: $base-color;
        .tip{
            font-size: 24rpx;
            color: $font-color-disabled;
            text-decoration: line-through;
            text-align: center;
        }
    }
    .paid {
        position: absolute;
        top: 20rpx;
        right: 140rpx;
        height: 80rpx;
        width: 80rpx;
        background: url(../../static/paid.png) no-repeat;
        background-size: 100% 100%;
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
    height: auto;
}

.uni-tip-group-button {
    margin-top: 10px;
}

.uni-tip-button {
    text-align: center;
    font-size: 14px;
    color: $base-color;
}
/deep/ .uni-popup__wrapper-box {
    border-radius: 20rpx;
}
</style>
