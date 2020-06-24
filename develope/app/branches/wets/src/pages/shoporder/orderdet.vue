<template>
    <view class="content">
        <view class="step message" v-show="orderInfo.state > 0 && orderInfo.state != 7 && orderInfo.state != 5">
            <view :class="'step-item zuo action ' + (orderInfo.state == 0 ? 'tip' : '')">
                <view class="tip">待付款</view>
                <view class="yuan"></view>
                <view class="link"></view>
                <view class="title">提交订单</view>
            </view>
            <view :class="'step-item ' + (orderInfo.state > 0 ? orderInfo.state == 1 ? 'action tip' : 'action' : '')">
                <view class="tip">待发货</view>
                <view class="yuan"></view>
                <view class="link"></view>
                <view class="title">买家付款</view>
            </view>
            <view :class="'step-item ' + (orderInfo.state > 1 ? orderInfo.state == 2 ? 'action tip' : 'action' : '')">
                <view class="tip">待收货</view>
                <view class="yuan"></view>
                <view class="link"></view>
                <view class="title">商家发货</view>
            </view>
            <view :class="'step-item you' + (orderInfo.state > 2 ? orderInfo.state == 3 ? ' action tip' : ' action' : '')">
                <view class="yuan"></view>
                <view class="link"></view>
                <view class="title">确认订单</view>
            </view>
        </view>
        <view class="logistics" v-show="orderInfo.state > 0 && orderInfo.state != 0 && orderInfo.state != 1 && orderInfo.state != 7 && orderInfo.state != 5">
            <view>
                <view>{{ orderInfo.expressname == null ? '无物流信息' : orderInfo.expressname }}</view>
                <view>{{ orderInfo.expressnumber }}</view>
            </view>
            <view class="btn" @click="consignment" v-show="orderInfo.state != 3">
                修改
            </view>
        </view>
        <view class="logistics" v-show="orderInfo.state > 1 && orderInfo.state != 7 && orderInfo.state != 5">
            <view>
                <view>{{ orderInfo.logistics.logisticsinfo }}</view>
                <view>{{ orderInfo.logistics.logisticstime }}</view>
            </view>
            <view class="btn" @click="logistics()">
                查看
            </view>
        </view>
        <view class="buyer">
            <view class="title">
                <text class="name">收件人:{{ orderInfo.receivername }}</text>
                <text class="tel" @click="callBuyer">{{ orderInfo.receivertel }}</text>
            </view>
            <view class="address">{{ orderInfo.address }}</view>
            <view class="tip"><text>留言:{{ orderInfo.notes == '' ? '暂无留言' : orderInfo.notes }}</text></view>
            <view class="btn"><text class="btnitem" @click="chat">联系买家</text><text v-show="orderInfo.state == 0 || orderInfo.state == 1" class="btnitem" @click="modifyaddress">修改地址</text></view>
        </view>
        <view class="remarks" @click="orderremarks">
            <view>备注:</view>
            <view class="tip yticon icon-you">{{ orderInfo.shopnotes }}</view>
        </view>
        <view class="commodity" v-for="(item, index) in orderInfo.products" :key="index">
            <view><image class="img" :src="item.url || ''" mode=""></image></view>
            <view class="commodity-con">
                <view class="title">{{ item.productname }}</view>
                <view class="tip">{{ item.attributeshow }}</view>
                <view class="prices">
                    <text class="price">{{ item.newprice }}</text>
                    <text class="btn" v-show="item.code" @click.stop="refund(index)">{{ item.refund_btn_text }}</text>
                </view>
            </view>
        </view>
        <view class="orderbuy">
            <view class="tip" v-show="orderInfo.freight > 0">
                <text>+运费</text>
                <text>{{ orderInfo.freight }}</text>
            </view>
            <view class="tip" v-show="orderInfo.extradiscounts > 0">
                <text>-优币优惠</text>
                <text>{{ orderInfo.extradiscounts }}</text>
            </view>
            <view class="tip" v-show="orderInfo.salediscounts > 0">
                <text>-活动优惠</text>
                <text>{{ orderInfo.salediscounts }}</text>
            </view>
            <view class="tip" v-show="orderInfo.coupondiscounts > 0">
                <text>-优惠券</text>
                <text>{{ orderInfo.coupondiscounts }}</text>
            </view>
            <view class="tip" v-show="orderInfo.redpacketdiscounts > 0">
                <text>-红包优惠</text>
                <text>{{ orderInfo.redpacketdiscounts }}</text>
            </view>
            <!-- <view class="tip" v-show="orderInfo.salediscounts > 0">
                <text>-积分优惠</text>
                <text>{{ orderInfo.salediscounts }}</text>
            </view> -->
            <view class="tip">
                <text>商品总价</text>
                <text>{{ orderInfo.product_price }}</text>
            </view>
            <view class="money">
                <text>实际收入</text>
                <text class="number">{{ orderInfo.real_income }}</text>
            </view>
        </view>
        <view class="ordertip">
            支付方式:{{ orderInfo.dealtypename }}
        </view>
        <view class="ordertip">
            订单编号:{{ orderInfo.ordernumber }}
        </view>
        <view class="ordertip" v-show="orderInfo.delivertime != null">
            发货时间:{{ orderInfo.delivertime }}
        </view>
        <view class="ordertip" v-show="orderInfo.state == 1 && orderInfo.dealnumber != null">
            交易号:{{ orderInfo.dealnumber }}
        </view>
        <view class="ordertip" v-show="orderInfo.state == 1 && orderInfo.paymenttime != null">
            付款时间:{{ orderInfo.paymenttime }}
        </view>
        <view class="paralyse">
            <text v-show="orderInfo.state != 5 && orderInfo.state != 7" @click="copyOrder">复制订单</text>
            <text v-show="orderInfo.state == 0" @click="closeorder">关闭订单</text>
            <text class="submit" v-show="orderInfo.isshowsendgoodsbtn == 1" @click="consignment" style="color: #FF0000;">发货</text>
        </view>
    </view>
</template>

<script>
import uniSteps from '@/components/uni-steps/uni-steps.vue';
import clipboard from '@/components/clipboard/ican-clipBoard.js'
export default {
    components: { uniSteps, clipboard },
    data() {
        return {
            ordernumber: '',
            cguid: uni.getStorageSync('companyguid'),
            orderInfo: {
                logistics: {
                    logisticsinfo: '',
                    logisticstime: ''
                },
                delivertime: null,
                state: 7
            }
        };
    },
    onLoad(option) {
        this.ordernumber = option.ordernumber;
        this.getOrderDetail();
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    methods: {
        // 修改备注信息
        updateRemaker(data) {
            this.orderInfo.shopnotes = data;
        },
        // 获取订单详情
        getOrderDetail() {
            this.$ajax.get('com/orderDetail', {ordernumber: this.ordernumber, cguid: this.cguid}).then(res => {
                console.log(res);
                if (res.data.code == 0) {
                    this.orderInfo = res.data.result.data;
                } else {
                    this.$api.msg('获取订单详情失败');
                }
            });
        },
        consignment() {
            uni.navigateTo({
                url: '/pages/shoporder/consignment?ordernumber=' + this.ordernumber
            });
        },
        modifyaddress(){
            uni.navigateTo({
                url: '/pages/shoporder/modify_address?ordernumber=' + this.ordernumber
            });
        },
        orderremarks(){
            uni.navigateTo({
                url: '/pages/shoporder/order_remarks?ordernumber=' + this.ordernumber
            });
        },
        // 物流信息 列表
        logistics() {
            uni.navigateTo({
                url: '/pages/shoporder/logistics?ordernumber=' + this.ordernumber + '&logisticcode=' + (this.orderInfo.expressnumber != null ? this.orderInfo.expressnumber : '') + '&shippercode=' + (this.orderInfo.shippercode != null ? this.orderInfo.shippercode : '')
            });
        },
        // 售后
        refund(index) {
            let product = this.orderInfo.products[index];
            uni.navigateTo({
                url: '/pages/shoporder/createrecord?refundcode=' + product.code
            })
        },
        closeorder(){
            let _this = this;
            this.$ajax.get('com/getCloseReasonList',{cguid: this.cguid}).then(res => {
                if (res.data.code == 0) {
                    let data = res.data.result.data;
                    let items = [];
                    data.forEach(item => {
                        items.push(item.reason);
                    });
                    uni.showActionSheet({
                        itemList: items,
                        success: function (res) {
                            _this.$ajax.get('com/closeOrder', {ordernumber: _this.ordernumber, reasonid: data[res.tapIndex].id}).then(res => {
                                if (res.data.code == 0) {
                                    _this.$api.msg('关闭订单成功');
                                    _this.$api.prePage().getOrderState(0);
                                    setTimeout(function() {
                                        uni.navigateBack();
                                    }, 1000)
                                } else {
                                    _this.$api.msg('关闭订单失败');
                                }
                            });
                        },
                        fail: function (res) {
                            console.log(res.errMsg);
                        }
                    });
                } else {
                    this.$api.msg('关闭订单失败');
                }
            });
        },
        // 复制单号
        copyOrder() {
            let _this = this;
            uni.setClipboardData({ data: this.ordernumber, success:function(data){
                _this.$api.msg('复制订单号成功');
            }, fail:function(err){
                _this.$api.msg('操作失败！请重试！');
            }, complete:function(res){} })
        },
        // 联系买家
        callBuyer() {
            let _this = this;
            uni.makePhoneCall({
                phoneNumber: _this.orderInfo.receivertel
            })
        },
        // 联系买家
        chat() {
            let dataInfo = {
                nickName:this.orderInfo.companyname,
                username:this.orderInfo.buyerguid,
                avatar:''
            };
            uni.setStorage({
                key:'jiguang_chater_info',
                data: dataInfo
            });
            uni.navigateTo({
                url: '/pages/chat/chat'
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
}
.message {
    padding: 20rpx 30rpx;
    background: #ffffff;
}
.step {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .step-item {
        position: relative;
        padding-top: 40rpx;
        flex-grow: 1;
        .tip {
            position: absolute;
            right: 0;
            top: 0;
            z-index: 1;
            width: 140rpx;
            text-align: center;
            margin-right: -70rpx;
            font-size: 24rpx;
            color: $base-color;
            display: none;
        }
        .tip:after {
            content: '';
            display: block;
            width: 16rpx;
            height: 16rpx;
            background: $base-color;
            border-radius: 50%;
            position: absolute;
            bottom: -30rpx;
            left: 50%;
            margin-left: -8rpx;
        }
        .yuan {
            width: 30rpx;
            height: 30rpx;
            margin: 0 auto;
            background: #c0c4cc;
            border-radius: 30rpx;
            margin-bottom: -27rpx;
        }
        .title {
            text-align: center;
            font-size: 28rpx;
        }
        .link {
            width: 100%;
            height: 4rpx;
            margin: 10rpx 0 20rpx 0;
            background: #c0c4cc;
        }
        &.zuo {
            .link {
                width: 50%;
                margin: 10rpx 0 20rpx auto;
            }
        }
        &.you {
            .link {
                width: 50%;
                margin: 10rpx auto 20rpx 0;
            }
        }
        &.action {
            .yuan {
                background: $base-color;
            }
            .link {
                background: $base-color;
            }
            &.tip {
                .tip {
                    display: block;
                }
            }
        }
    }
}
.buyer {
    padding: 20rpx 30rpx;
    margin-top: 10rpx;
    background: #ffffff;
    .title {
        font-size: 32rpx;
        margin-bottom: 10rpx;
        .tel {
            margin-left: 20rpx;
            color: #0081FF;
            text-decoration: underline;
        }
    }
    .address,
    .tip {
        font-size: 28rpx;
    }
    .btn {
        text-align: right;
        .btnitem {
            border: 1px solid #dddddd;
            display: inline-block;
            padding: 6rpx 16rpx;
            border-radius: 10rpx;
            font-size: 28rpx;
            margin-left: 30rpx;
        }
    }
}
.logistics{
    padding: 20rpx 30rpx;
    background: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 28rpx;
    border-bottom: 1px solid #dddddd;
    .btn{
        color: #007AFF;
    }
}
.remarks {
    padding: 20rpx 30rpx;
    background: #ffffff;
    display: flex;
    align-items: center;
    font-size: 28rpx;
    margin-top: 10rpx;
    border-bottom: 1px solid #dddddd;
    .tip {
        flex-grow: 1;
    }
    .icon-you:after {
        margin-top: -18rpx;
    }
}
.commodity {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #ffffff;
    padding: 20rpx 30rpx;
    border-bottom: 1px solid #dddddd;
    .img {
        width: 100rpx;
        height: 100rpx;
    }
    .delimg {
        width: 80rpx;
        height: 80rpx;
    }
    .commodity-con {
        flex-grow: 1;
        padding: 20rpx;
        .title {
            font-size: 30rpx;
            margin-bottom: 10rpx;
        }
        .tip {
            font-size: 28rpx;
            color: #dddddd;
        }
        .prices {
            margin-top: 10rpx;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            .price{
                color: $base-color;
            }
            .btn{
                color: $base-color;
                border: 1px solid $base-color;
                padding: 4rpx 18rpx;
                border-radius: 12rpx;
				font-size: 24rpx;
            }
        }
    }
}

.ordertip{
    padding: 10rpx 30rpx;
    background: #FFFFFF;
    font-size: 24rpx;
}
.orderbuy{
    margin: 10rpx 0;
    padding: 20rpx 30rpx;
    background: #FFFFFF;
    .tip{
        display: flex;
        justify-content: space-between;
        font-size: 28rpx;
        color:$font-color-base;
    }
    .money{
        margin-top: 6rpx;
        padding-top: 10rpx;
        border-top: 1px solid #dddddd;
        display: flex;
        justify-content: space-between;
        font-size: 32rpx;
        .number{
            color: $base-color;
        }
    }
}
.paralyse{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    padding: 30upx;
    background-color: #fff;
    text-align: right;
    text{
        border: 1px solid #DDDDDD;
        padding: 10rpx 30rpx;
        border-radius: 20rpx;
        font-size: 28rpx;
        margin-left: 30rpx;
    }
}
</style>
