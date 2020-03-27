<template>
    <view>
        <view class="orderstata">{{ orderDetail.statename }}</view>
        <!-- 物流信息 -->
        <view class="address-section" v-if="orderDetail.state != 0">
            <view class="order-content" @click="navTo('/pages/order/logistics?ordernum=' + ordernum)">
                <view class="yticon"><image class="logoimg" src="../../static/logistics.png" mode="aspectFit"></image></view>
                <view class="cen" v-if="logistics.length > 0">
                    <block v-if="logistics[0].logisticsname != ''">
                        <view class="top">
                            <text class="name">{{ logistics[0].logisticsname }}</text>
                        </view>
                        <text class="address">{{ logistics[0].time }}</text>
                    </block>
                    <block v-else>
                        <view class="top">
                            <text class="name">{{ logistics[1].logisticsname }}</text>
                        </view>
                        <text class="address">{{ logistics[1].time }}</text>
                    </block>
                </view>
                <view class="cen" v-if="logistics.length == 0">
                    <view class="top"><text class="name">暂无物流信息</text></view>
                    <text class="address"></text>
                </view>
            </view>
        </view>
        <!-- 地址 -->
        <view class="address-section">
            <view class="order-content" @click="selectAddress">
                <text class="yticon icon-shouhuodizhi"></text>
                <view class="cen">
                    <view class="top">
                        <text class="name">{{ addressData.receivername }}</text>
                        <text class="mobile">{{ addressData.receivertel }}</text>
                    </view>
                    <text class="address">{{ addressData.address }}</text>
                </view>
            </view>
            <image
                class="a-bg"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAu4AAAAFCAYAAAAaAWmiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Rjk3RjkzMjM2NzMxMTFFOUI4RkU4OEZGMDcxQzgzOEYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Rjk3RjkzMjQ2NzMxMTFFOUI4RkU4OEZGMDcxQzgzOEYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGOTdGOTMyMTY3MzExMUU5QjhGRTg4RkYwNzFDODM4RiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGOTdGOTMyMjY3MzExMUU5QjhGRTg4RkYwNzFDODM4RiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PrEOZlQAAAiuSURBVHjazJp7bFvV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"
            ></image>
        </view>
        <!-- 留言 -->
        <view class="address-section">
            <view class="order-content">
                <view class="yticon"><image class="logoimg" src="../../static/notes.png" mode="aspectFit"></image></view>
                <view class="cen">
                    <view class="top"><text class="name">买家留言</text></view>
                    <text class="address">{{ orderDetail.notes || '暂无留言' }}</text>
                </view>
            </view>
            <image
                class="a-bg"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAu4AAAAFCAYAAAAaAWmiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Rjk3RjkzMjM2NzMxMTFFOUI4RkU4OEZGMDcxQzgzOEYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Rjk3RjkzMjQ2NzMxMTFFOUI4RkU4OEZGMDcxQzgzOEYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGOTdGOTMyMTY3MzExMUU5QjhGRTg4RkYwNzFDODM4RiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGOTdGOTMyMjY3MzExMUU5QjhGRTg4RkYwNzFDODM4RiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PrEOZlQAAAiuSURBVHjazJp7bFvV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"
            ></image>
        </view>

        <view class="goods-section">
            <view class="g-header b-b">
                <!-- <image class="logo" src="http://duoduo.qibukj.cn/./Upload/Images/20190321/201903211727515.png"></image> -->
                <text class="name">{{ orderDetail.companyname }}</text>
                <view class="telshop" v-if="orderDetail.verificationtel != ''" @click="opentel">
                    <image src="../../static/telshop.png" mode="aspectFit"></image>
                    <text>联系卖家</text>
                </view>
            </view>
            <!-- 商品列表 -->
            <view class="g-item" v-for="(goodsinfo, index) in orderDetail.products" :key="index" @click="navTo('/pages/product/product?productid=' + goodsinfo.productid)">
                <image :src="goodsinfo.url"></image>
                <view class="right">
                    <text class="title clamp">{{ goodsinfo.productname }}</text>
                    <text class="spec">{{ goodsinfo.attributeshow }}</text>
                    <view class="price-box">
                        <text class="price">{{ goodsinfo.newprice }}</text>
                        <text class="number">x {{ goodsinfo.number }}</text>
                        <!-- 是否显示红点 isShowReddot 退换货是否显示红点：0不显示，1显示 -->
                        <text class="refund" v-show="goodsinfo.isshowbutton == 1" @click.stop="returnGoods(goodsinfo)">
                            {{ goodsinfo.commentstate != 3 ? '售后服务' : '退货' }}
                        </text>
                        <text class="refund" v-show="goodsinfo.commentstate != 3" @click.stop="productcomment(goodsinfo)">
                            {{ goodsinfo.commentstate == 1 ? '评价' : '追加评论' }}
                        </text>
                    </view>
                </view>
            </view>
        </view>
        <view class="yt-list">
            <view class="yt-list-cell b-b">
                <text class="cell-tit clamp">商品总价</text>
                <text class="cell-tip">￥{{ orderDetail.product_price }}</text>
            </view>
            <view class="yt-list-cell b-b" v-if="orderDetail.dealtypename != ''">
                <text class="cell-tit clamp">支付方式</text>
                <text class="cell-tip">{{ orderDetail.dealtypename }}</text>
            </view>
        </view>
            
        <view class="assemble" v-if="orderDetail.groupbuyinfo_mid > 0">
            <view class="imgs">
                <image :src="item" mode="aspectFill" v-for="(item,index) in orderDetail.groupbuymember" :key="index"></image>
            </view>
            <view class="tip">
                {{orderDetail.groupbuyinfo_head_prefix}}<text>{{orderDetail.groupbuyinfo_head_number}}</text>{{orderDetail.groupbuyinfo_head_suffix}}<countdown class="indeblock" :time="orderDetail.groupbuyinfo_mid/1000"  :day="false"></countdown>{{orderDetail.groupbuyinfo_end}}<br>{{orderDetail.groupbuyinfo_second_msg}}
            </view>
            <view class="btn" @click="openshare">分享给好友</view>
        </view>
        <!-- 金额明细 -->
        <view class="yt-list">
            <view class="yt-list-cell b-b" v-if="orderDetail.dealnumber">
                <text class="cell-tit clamp">交易号</text>
                <text class="cell-tip">{{ orderDetail.dealnumber }}</text>
            </view>
            <view class="yt-list-cell b-b" v-if="orderDetail.ordernumber != ''">
                <text class="cell-tit clamp">订单编号</text>
                <text class="cell-tip">{{ orderDetail.ordernumber }}</text>
            </view>
            <view class="yt-list-cell b-b" v-if="orderDetail.paymenttime">
                <text class="cell-tit clamp">付款时间</text>
                <text class="cell-tip">{{ orderDetail.paymenttime }}</text>
            </view>
            <view class="yt-list-cell b-b" v-if="orderDetail.couponvalue != 0">
                <text class="cell-tit clamp">优惠券</text>
                <text class="cell-tip red">-￥{{ orderDetail.couponvalue }}</text>
            </view>
            <view class="yt-list-cell b-b" v-if="orderDetail.saleprice != 0">
                <text class="cell-tit clamp">优惠活动</text>
                <text class="cell-tip red">-￥{{ orderDetail.saleprice }}</text>
            </view>
            <view class="yt-list-cell b-b" v-if="orderDetail.redpacketprice != 0">
                <text class="cell-tit clamp">红包优惠</text>
                <text class="cell-tip red">-￥{{ orderDetail.redpacketprice }}</text>
            </view>
            <view class="yt-list-cell b-b" v-if="orderDetail.extradiscounts">
                <text class="cell-tit clamp">U币优惠</text>
                <text class="cell-tip red">-￥{{ orderDetail.extradiscounts }}</text>
            </view>
            <view class="yt-list-cell b-b">
                <text class="cell-tit clamp">运费</text>
                <text class="cell-tip">￥{{ orderDetail.freight ? orderDetail.freight : '0' }}</text>
            </view>

            <view class="yt-list-cell b-b" v-if="orderDetail.state != 0">
                <text class="cell-tit clamp">实付款</text>
                <text class="cell-tip">{{ orderDetail.real_price }}</text>
            </view>
        </view>
        <!-- 二维码 -->
        <view v-show="srce != ''"><image :src="srce" :style="{ width: cpSize + 'rpx', height: cpSize + 'rpx' }" class="qrcodeImg"></image></view>
        <canvas class="qrcode" canvas-id="qrcode-canvas" :style="{ width: cpSize + 'rpx', height: cpSize + 'rpx' }" />
        <view class="recommend">
            <text>为</text>
            /
            <text>您</text>
            /
            <text>推</text>
            /
            <text>荐</text>
        </view>

        <view class="goods-list">
            <view class="goods-item" v-for="(item, index) in orderDetail.guessyoulike" :key="index" @click="navToDetailPage(item)">
                <image v-if="item.isNewOnShelvesProduct == 1" class="label" :src="item.newOnShelvesProductIcon" mode="aspectFit"></image>
                <view class="image-wrapper">
                    <uimg :src="item.url"></uimg>
                </view>
                <view class="item-con">
                    <view class="title clamp">
                        <text v-if="item.presell" class="presell">{{ item.presell }}</text>
                        {{ item.name }}
                    </view>
                    <view class="price-box clamp">
                        <text class="price">{{ item.price }}</text>
                        <text v-if="item.activitylist.length == 0">{{ item.sales }}</text>
                        <view v-else>
                            <text v-for="ite in item.activitylist" :key="ite.wholetext" :style="{ color: ite.color, borderColor: ite.color }">{{ ite.wholetext }}</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <!-- 底部 -->
        <view class="footer" v-if="orderDetail.state == 0">
            <view class="price-content">
                <text>实付款</text>
                <text class="price">{{ orderDetail.real_price }}</text>
            </view>
            <text class="submit" @click="navTo('/pages/money/pay?ordernum=' + ordernum + '&price=' + orderDetail.real_price)">前往支付</text>
        </view>
        <uni-popup ref="assemble" class="assembles" type="center" @touchmove.stop="">
            <view class="layer">
                <view class="assemble">
                    <view class="imgs">
                        <image :src="item" mode="aspectFill" v-for="(item,index) in orderDetail.groupbuymember" :key="index"></image>
                    </view>
                    <view class="tip">
                        {{orderDetail.groupbuyinfo_head_prefix}}<text>{{orderDetail.groupbuyinfo_head_number}}</text>{{orderDetail.groupbuyinfo_head_suffix}}<countdown class="indeblock" :time="orderDetail.groupbuyinfo_mid/1000"  :day="false"></countdown><br>{{orderDetail.groupbuyinfo_second_msg}}
                    </view>
                    <view class="btn" @click="openshare">分享给好友</view>
                </view>
            </view>
        </uni-popup>
    </view>
</template>

<script>
import uimg from "@/components/uimg/uimg.vue";
import QRCode from '@/store/qrcode.js';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import countdown from '@/components/countdown/countdown.vue';
export default {
    components: { 
        uniPopup,
        uimg,
        countdown
    },
    data() {
        return {
            //telpopup:false,
            srce: '',
            cpSize: 700,
            orderDetail: { state: 0 },
            logistics: [],
            ordernum: 20190926876000,
            addressData: {
                level: '',
                guid: '',
                addressid: '',
                addresstype: '',
                defaultaddressstate: '',
                receivername: '',
                receivertel: '',
                address: '',
                postcode: ''
            }
        };
    },
    onLoad(options) {
        this.ordernum = options.ordernum;
    },
    onBackPress(){
        this.$api.ovPage()
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
        this.getOrderDetail();
        this.getlogistics();
    },
    methods: {
        openshare(){
            this.$refs.assemble.open();
        },
        // 二维码生成
        createQrcode(str) {
            let that = this;
            let qrcode = new QRCode({
                context: that, // 上下文环境
                canvasId: 'qrcode-canvas', // canvas-id
                showLoading: true, // 是否显示loading
                loadingText: '加载中', // loading文字
                text: str, // 生成内容
                size: uni.upx2px(that.cpSize), // 二维码大小
                background: '#FFF', // 背景色
                foreground: '#000', // 前景色
                correctLevel: 3, // 容错级别
                cbResult: function(res) {
                    // 生成二维码的回调
                    that.srce = res;
                }
            });
        },
        // 获取订单详情
        getOrderDetail() {
            this.$ajax.get('order/getOrderDetail', { ordernum: this.ordernum }).then(res => {
                if (res.data.code == 0) {
                    this.orderDetail = res.data.result.data;
                    this.addressData.address = this.orderDetail.address;
                    this.addressData.addressid = this.orderDetail.addressid;
                    this.addressData.receivername = this.orderDetail.receivername;
                    this.addressData.receivertel = this.orderDetail.receivertel;
                    if(this.orderDetail.showshare==1){
                        this.$refs.assemble.open();
                    }
                    if (this.orderDetail.state == 1 || this.orderDetail.state == 2) this.createQrcode('mall_receipt:' + this.ordernum);
                } else {
                    this.$api.msg('订单详情获取失败');
                }
                uni.hideLoading();
            });
        },
        getlogistics() {
            this.$ajax.get('order/getlogistics', { ordernum: this.ordernum }).then(res => {
                if (res.data.code == 0) {
                    this.logistics = res.data.result.data;
                } else {
                    this.$api.msg('物流信息获取失败');
                }
            });
        },
        navTo(url) {
            uni.navigateTo({
                url
            });
        },
        // 商品评价
        productcomment(goodsinfo) {
            let data = {};
            data.ordernum = this.ordernum;
            data.skuid = goodsinfo.skuid;
            data.attributes = goodsinfo.attribute;
            data.skutext = goodsinfo.attributeshow;
            data.url = goodsinfo.url;
            data.state = goodsinfo.commentstate;
            this.navTo('/pages/product/commentfrom?data=' + JSON.stringify(data));
        },
        // 是否可修改地址：0不可，1可以
        selectAddress() {
            if (this.orderDetail.isalertaddr == 1) {
                // 是否可自定义收货地址：0不可，1可以
                if (this.orderDetail.iscustomaddress == 0) {
                    this.$api.msg(this.orderDetail.alertaddrerrormsg);
                } else {
                    this.navTo('/pages/address/address?source=1');
                }
            } else {
                this.$api.msg(this.orderDetail.alertaddrerrormsg);
            }
        },
        updateOrderAddress() {
            this.$ajax
                .get('order/alertOrderAddress', {
                    ordernum: this.ordernum,
                    addrid: this.addressData.addressid
                })
                .then(res => {
                    console.log(res);
                    if (res.data.code == 0) {
                        this.$api.msg('修改成功');
                        setTimeout(function() {
                            this.getOrderDetail();
                            this.getlogistics();
                        }, 1000);
                    } else {
                        this.$api.msg(res.data.msg);
                        setTimeout(function() {
                            this.getOrderDetail();
                            this.getlogistics();
                        }, 1000);
                    }
                });
        },
        // 退货
        returnGoods(info) {
            if (info.isShowDialog == 1) {
                uni.showModal({
                    title: '友情提示',
                    content: info.isShowMsg,
                    success: res => {
                        if (res.confirm) {
                            this.navTo('/pages/order/orderrefund?bopid=' + info.bopid);
                        }
                    }
                });
            } else {
                this.navTo('/pages/order/orderrefund?bopid=' + info.bopid);
            }
        },
        //详情页
        navToDetailPage(item) {
            let id = item.productid;
            uni.navigateTo({
                url: '/pages/product/product?productid=' + id
            });
        },
        opentel() {
            let _this = this;
            uni.makePhoneCall({
                phoneNumber: _this.orderDetail.verificationtel
            });
            //this.telpopup=true;
        },
        closetel() {
            this.telpopup = false;
        },
        telshow(e) {
            if (e.show == false) {
                this.telpopup = false;
            }
        }
    }
};
</script>

<style lang="scss">
page {
    background: $page-color-base;
}
.qrcode {
    position: fixed;
    top: -47999px;
    left: -47999px;
    z-index: -99999;
}
.qrcodeImg {
    margin: 30rpx auto;
    display: block;
}
.orderstata {
    padding: 20rpx 30rpx;
    background: #fa436a;
    color: #ffffff;
}
/deep/ .uni-popup__wrapper.uni-custom.center .uni-popup__wrapper-box {
    padding: 0;
    border-radius: 30rpx;
    min-width: 60%;
}
.showtel {
    text-align: center;
    .tel {
        padding: 70rpx 0;
    }
    .btn {
        border-top: 1px solid #ddd;
        font-size: 28rpx;
        padding: 20rpx;
    }
}
.recommend {
    padding: 30rpx 0 20rpx 0;
    text-align: center;
    color: #fa436a;
    font-size: 28rpx;
    text {
        font-size: 36rpx;
    }
}
.logoimg {
    width: 50rpx;
    height: 50rpx;
    margin: 0 25rpx;
}
.address-section {
    padding: 30upx 0;
    background: #fff;
    position: relative;

    .order-content {
        display: flex;
        align-items: center;
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
    margin-top: 16upx;
    background: #fff;
    padding-bottom: 1px;

    .g-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 84upx;
        padding: 0 30upx;
        position: relative;
        .telshop {
            image {
                width: 30rpx;
                height: 30rpx;
                vertical-align: bottom;
                margin-right: 10rpx;
            }
            font-size: 28rpx;
        }
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
        margin: 20upx 30upx;

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
                width: 120rpx;
                text-align: center;
                border: 1px solid #dddddd;
                border-radius: 20rpx;
                padding: 6rpx;
                font-size: 24rpx;
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
    .price-content {
        padding-left: 30upx;
    }
    .price-tip {
        color: $base-color;
        margin-left: 8upx;
    }
    .price {
        font-size: 36upx;
        color: $base-color;
    }
    .submit {
        width: 280upx;
        color: #fff;
        font-size: 32upx;
        background-color: $base-color;
        flex-grow: inherit;
    }
}
/* 猜你喜欢 */
.guess-section {
    display: flex;
    flex-wrap: wrap;
    padding: 30rpx;
    margin-top: 16rpx;
    background: #fff;
    margin-bottom: 100rpx;
    .guess-item {
        display: flex;
        flex-direction: column;
        width: 48%;
        padding-bottom: 40upx;
        &:nth-child(2n + 1) {
            margin-right: 4%;
        }
        .price-box {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-right: 10upx;
            font-size: 24upx;
            color: $font-color-light;
        }
    }
    .image-wrapper {
        width: 100%;
        height: 330upx;
        overflow: hidden;
        image {
            width: 100%;
            height: 100%;
            opacity: 1;
            border-radius: 10rpx;
        }
        img {
            width: 100%;
            height: 100%;
            opacity: 1;
            border-radius: 10rpx;
        }
    }
    .title {
        font-size: $font-lg;
        color: $font-color-dark;
        line-height: 80upx;
    }
    .price {
        font-size: $font-lg;
        color: $uni-color-primary;
        line-height: 1;
    }
    .typename {
        font-size: 24rpx;
        padding: 0rpx 8rpx;
        background: $uni-color-primary;
        color: white;
        margin-right: 12rpx;
        border-radius: 6rpx;
    }
    .companyname {
        font-size: 24rpx;
        &:after {
            content: '>';
            font-size: 24rpx;
            margin: 0 0 0 8rpx;
        }
    }
}
.assemble{
    margin: 20rpx 30rpx;
    .imgs{
        text-align: center;
        image{
            width: 80rpx;
            height: 80rpx;
            border-radius: 50%;
            margin: 0 10rpx;
            display: inline-block;
        }
    }
    .tip{
        margin-top: 20rpx;
        text-align: center;
        font-size: 32rpx;
        line-height: 48rpx;
        .indeblock{
            display: inline-block;
        }
        text{
            color: $base-color;
        }
    }
    .btn{
        margin-top: 10rpx;
        background: $base-color;
        color: #FFF;
        font-size: 32rpx;
        line-height: 80rpx;
        text-align: center;
        border-radius: 10rpx;
        width: 90%;
        margin: 0 auto;
    }
}
.assembles{
    /deep/ .uni-popup__wrapper-box{
        background: url(../../static/share_group_buy_pop.webp) no-repeat center !important;
        background-size: 100% 100% !important;;
        width: 750rpx;
        height: 760rpx;
        max-width: inherit !important;
        max-height: inherit !important;;
    }
    .layer{
        width: 90%;
        margin: 0 auto;
        margin-top: 320rpx;
        .btn{
            margin-top: 40rpx;
            background: rgb(220, 208, 38);
            color: $base-color;
            font-weight: bold;
        }
    }
}
</style>
