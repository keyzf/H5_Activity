<template>
    <view class="content">
        <view v-for="(item, inx) in data" :key="inx">
            <template v-if="item.type == 0">
                <img :src="item.shopinfo.headimg" class="shopimg" />
                <view class="headcon">
                    <view class="titlemf">{{ item.shopinfo.companyname }}</view>
                    <view class="headcon-top">
                        <image class="img" :src="item.shopinfo.logo" mode="aspectFill"></image>
                        <view class="conter">
                            <view class="title">
                                <text class="type">个人</text>
                                <block v-for="(itemss,indesi) in item.shopinfo.levelarray" :key="indesi+'m'">
                                    <image :src="'../../static/level'+ itemss +'.png'" mode="aspectFit" class="tip"></image>
                                </block>
                                <text class="name">{{ item.shopinfo.fansnumber }}</text>
                            </view>
                            <view class="notice clamp">{{ item.shopinfo.notice }}</view>
                            <view class="type clamp">{{item.shopinfo.managescope}}</view>
                        </view>
                    </view>
                    <view class="statea">
                        <view class="follow">{{item.shopinfo.isfollow==1?"已关注":"+关注"}}</view>
                        <view class="details"></view>
                    </view>
                </view>
                <view class="shopcon">
                    <view class="yticon icon-shouhuodizhi" style="width: 90rpx;text-align: center;font-size: 50rpx;"></view>
                    <view class="free">{{ item.shopinfo.companyAddress.address }}</view>
                    <view class="addergo">去店里</view>
                </view>
            </template>
            <template v-if="item.type == 1">
                <view>
                    <swiper class="swiper" autoplay>
                        <swiper-item v-for="(items, index) in item.slidelist" :key="index+'p'"><img :src="items.url" /></swiper-item>
                    </swiper>
                </view>
            </template>
            <template v-if="item.type == 2">
                <scroll-view class="scroll-view_H" scroll-x="true">
                    <view class="scroll-view-item_H" v-for="(items, index) in item.couponlist" :key="index+'e'">
                        <view class="item">
                            <view class="con">
                                <view class="tip">
                                    <text class="number">{{ items.discounts }}</text>
                                    <text>优惠券</text>
                                </view>
                                <view class="tip">{{ items.limit }}</view>
                                <view class="tip">{{ items.title }}</view>
                            </view>
                            <view class="btn">立即领取</view>
                        </view>
                    </view>
                </scroll-view>
            </template>
            <template v-if="item.type == 4">
                <view class="activity">
                    <view class="activity-item">
                        <text class="title" :style="'background: ' + item.activity.color">{{ item.activity.text }}</text>
                        <text class="tip">{{ item.activity.title }}</text>
                    </view>
                </view>
            </template>
            <template v-if="item.type == 3">
                <view class="itemtitle">
                    <view class="btns">
                        <text class="action">新品</text>
                        <text>销量</text>
                    </view>
                </view>
                <view class="goods-list">
                    <view v-for="(items, index) in item.productlist" :key="index+'y'" class="goods-item">
                        <image v-if="items.isNewOnShelvesProduct == 1" class="label" :src="items.newOnShelvesProductIcon" mode="aspectFit"></image>
                        <view class="image-wrapper">
                            <uimg :src="items.url"></uimg>
                        </view>
                        <view class="item-con">
                            <view class="title clamp"><text v-if="items.presell" class="presell">{{items.presell}}</text>{{ items.name }}</view>
                            <view class="price-box clamp">
                                <text class="price">{{ items.price }}</text>
                                <text v-if="items.activitylist.length == 0">{{ items.sales }}</text>
                                <view v-else>
                                    <text v-for="ite in items.activitylist" :key="ite.wholetext" :style="{color:ite.color,borderColor:ite.color}">{{ ite.wholetext }}</text>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </template>
            <template v-if="item.type == 5">
                <view class="goods-list type">
                    <view class="goods-item" v-for="(items, index) in item.adlist" :key="index+'a'">
                        <view class="image-wrapper"><img :src="items.url" /></view>
                    </view>
                </view>
            </template>
            <template v-if="item.type == 6">
                <view class="itemtitle">
                    <view class="title">{{ item.title }}</view>
                </view>
            </template>
        
            <template v-if="item.type == 7">
                <view>
                    <view class="rob" v-for="(items, index) in item.item" :key="index+'x'">
                        <img :src="items.url" />
                        <view class="con">
                            <view class="flexd">
                                <view class="name">{{ items.name }}</view>
                                <view class="stata">{{ items.robstatetext }}</view>
                            </view>
                            <view class="tip">{{ items.limit }}</view>
                            <view class="flexd">
                                <view class="time"><countdown :time="items.time"></countdown></view>
                                <view class="old">原价{{ items.oldprice }}</view>
                            </view>
                            <view class="flexd">
                                <view class="schedule" v-if="items.robstate!=0">
                                    <text :style="'width:' + items.percent"></text>
                                    <view>{{ items.percenttext }}</view>
                                </view>
                                <view>
                                    抢购价
                                    <text class="new">{{ items.price }}</text>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </template>
            <template v-if="item.type == 15">
                <view v-for="(items, index) in item.item" :key="index+'s'" class="recommend">
                    <view class="image-wrapper"><img :src="items.url" /></view>
                    <view class="con">
                        <text class="title clamp">{{ items.name }}</text>
                        <view class="price-box">
                            <text class="price">{{ items.price }}</text>
                            <text><img :src="items.shopcarturl" /></text>
                        </view>
                    </view>
                </view>
            </template>
        </view>
        <view class="footer">
            <view class="submit ash">
                <image src="../../static/share.png" mode="aspectFit"></image>
                分享</view>
            <!-- <text class="submit ash">联系店家</text> -->
            <view class="submit ash">
                <image src="../../static/classify.png" mode="aspectFit"></image>
                分类</view>
        </view>
    </view>
</template>

<script>
import uimg from "@/components/uimg/uimg.vue";
export default {
    components: {
        uimg
    },
    data() {
        return {
            data:[],
            cguid: ''
        };
    },
    onBackPress(){
        this.$api.ovPage()
    },
    onLoad(options) {
        this.cguid = uni.getStorageSync("companyguid");
        this.$ajax.get('decoration/getpreview', {cguid: this.cguid}).then(res => {
            console.log(res);
            if (res.data.code == 0) {
                this.data = res.data.result.data;
                uni.setNavigationBarTitle({
                    title: res.data.result.data[0].shopinfo.companyname
                });
            } else {
            }
        });
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    }
};
</script>


<style lang="scss">
page,
.content {
    background: $page-color-base;
}
.content {
    padding-bottom: 100rpx;
}
.rob {
    display: flex;
    align-items: center;
    background: #ffffff;
    padding: 16rpx 30rpx;
    border-bottom: 1px solid #dddddd;
    img {
        width: 180rpx;
        height: 180rpx;
        border-radius: 8rpx;
    }
    .con {
        flex-grow: 1;
        margin-left: 20rpx;
        font-size: 28rpx;
        .flexd {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            .name {
                font-size: 32rpx;
            }
            .stata {
                font-size: 32rpx;
                color: $base-color;
                min-width: 100rpx;
            }
            .time {
                font-size: 32rpx;
                color: $base-color;
            }
            .old {
                color: $border-color-dark;
                text-decoration: line-through;
            }
            .new {
                font-size: 40rpx;
                color: $base-color;
            }
            .schedule {
                margin-right: 60rpx;
                border: 1px solid #dddddd;
                border-radius: 30rpx;
                text-align: center;
                flex-grow: 1;
                position: relative;
                overflow: hidden;
                font-size: 24rpx;
                text {
                    position: absolute;
                    top: 0;
                    left: 0;
                    bottom: 0;
                    width: 20%;
                    background: #fec7d3;
                    z-index: 1;
                }
                view {
                    position: relative;
                    z-index: 2;
                }
            }
        }
        .tip {
            color: $border-color-dark;
            margin: 10rpx 0;
        }
    }
}
.scroll-view_H {
    white-space: nowrap;
    width: 100%;
}
.scroll-view-item_H {
    display: inline-block;
}
.shopimg {
    width: 750rpx;
    height: 260rpx;
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
.itemtitle {
    background: #ffffff;
    .title {
        padding: 20rpx 30rpx;
        font-size: 32rpx;
    }
    .btns {
        border-top: 1px solid #dddddd;
        padding: 10rpx 30rpx;
        text {
            display: inline-block;
            margin: 0 20rpx 0 0;
            &.action {
                color: $base-color;
            }
        }
    }
}
.shopcon {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx;
    font-size: 32rpx;
    background: #ffffff;
    margin-bottom: 10rpx;
    .free {
        flex-grow: 1;
    }
    .addergo{
        width: 200rpx;
        text-align: center;
        color: $base-color;
    }
}
.swiper {
    padding: 20rpx 30rpx;
    img {
        width: 690rpx;
        height: 260rpx;
    }
}
.type {
    background: none;
    .goods-item {
        padding-bottom: 0;
    }
}
.activity-item {
    background: #ffffff;
    padding: 10rpx 30rpx;
    font-size: 28rpx;
    display: flex;
    align-items: center;
    .title {
        display: inline-block;
        width: 60rpx;
        text-align: center;
        color: #ffffff;
        background: #0081ff;
        margin-right: 10rpx;
        border-radius: 12rpx;
    }
    .tip {
        flex-grow: 1;
    }
}
.scroll-view_H {
    padding: 0 0 0 30rpx;
    .item {
        width: 330rpx;
        display: flex;
        align-items: center;
        background: $base-color;
        border-radius: 12rpx;
        color: #ffffff;
        white-space: initial;
        margin-right: 30rpx;
        .con {
            flex-grow: 1;
            padding: 10rpx 20rpx;
            .tip {
                font-size: 28rpx;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                max-width: 220rpx;
                .number {
                    position: relative;
                    padding-left: 20rpx;
                    font-size: 40rpx;
                    margin: 0 10rpx;
                    &:after {
                        content: '￥';
                        position: absolute;
                        left: 0;
                        top: 0;
                        font-size: 24rpx;
                    }
                }
            }
        }
        .btn {
            position: relative;
            width: 60rpx;
            padding: 10rpx;
            text-align: center;
            font-size: 24rpx;
            border-left: 1px dashed #ffffff;
            &:after {
                content: '';
                width: 20rpx;
                height: 20rpx;
                border-radius: 20rpx;
                position: absolute;
                left: -10rpx;
                top: -10rpx;
                background: #ffffff;
                z-index: 1;
            }
            &:before {
                content: '';
                width: 20rpx;
                height: 20rpx;
                border-radius: 20rpx;
                position: absolute;
                left: -10rpx;
                bottom: -10rpx;
                background: #ffffff;
                z-index: 1;
            }
        }
    }
}
.recommend{
    padding: 20rpx 30rpx;
    background: #FFFFFF;
    border-bottom: 1px solid #DDDDDD;
    display: flex;
    align-items: center;
    .con{
        flex-grow: 1;
    }
    .image-wrapper{
        margin-right: 20rpx;
        img{
            width: 180rpx;
            height: 180rpx;
        }
    }
    .title{
        font-size: 28rpx;
        max-width: 480rpx;
        margin-bottom: 100rpx;
    }
    .price-box{
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        .price{
            color: $base-color;
            font-size: 36rpx;
        }
        img{
            width: 40rpx;
            height: 40rpx;
        }
    }
    
}
.submit image{
    width: 40rpx;
    height: 40rpx;
    margin-right: 20rpx;
}
.headcon{
    display: flex;
    margin-top: -140rpx;
    padding: 0 30rpx;
    position: relative;
    margin-bottom: 20rpx;
    .titlemf{
        position: absolute;
        left: 0;
        right: 0;
        top: -100rpx;
        text-align: center;
        color: #FFF;
    }
    .headcon-top{
        flex-grow: 1;
        display: flex;
        color: #FFF;
        .img{
            width: 100rpx;
            height: 100rpx;
            min-width: 100rpx;
            margin-right: 10rpx;
            border-radius: 50%;
        }
        .conter{
            flex-grow: 1;
            font-size: 28rpx;
            .title{
                .type{
                    font-size: 28rpx;
                    padding: 0 10rpx;
                    background: $base-color;
                    border-radius: 10rpx;
                    vertical-align: middle;
                    margin-right: 10rpx;
                }
                .tip{
                    width: 40rpx;
                    height: 40rpx;
                    margin-right: 10rpx;
                    vertical-align: middle;
                }
            }
            .notice{
                background: url(../../static/bnotice.png) no-repeat left center;
                background-size: 30rpx 30rpx;
                padding-left: 40rpx;
                width: 400rpx;
                max-width: 400rpx;
            }
            .type{
                background: url(../../static/btab-shop.png) no-repeat left center;
                background-size: 30rpx 30rpx;
                padding-left: 40rpx;
                width: 400rpx;
                max-width: 400rpx;
            }
        }
    }
    .statea{
        width: 180rpx;
        min-width: 180rpx;
        position: relative;
        text-align: center;
        .follow{
            border: 1px solid #dddddd;
            font-size: 24rpx;
            padding: 8rpx 26rpx;
            border-radius: 20rpx;
            background: #ffffff;
            text-align: center;
            display: inline-block;
        }
        .details{
            width: 70rpx;
            height: 70rpx;
            background: url(../../static/xjt.png) no-repeat center #FFF;
            border-radius: 50%;
            border: 1px solid #DDD;
            position: absolute;
            bottom: -35rpx;
            left: 50%;
            margin-left: -35rpx;
        }
    }
}
</style>