<template>
    <view class="content">
        <view class="backtop" :class="{x:backshow}">
        	<image src="../../static/backtop.png" mode="aspectFit" @click="backtop"></image>
        </view>
        <view v-for="(item, inx) in data" :key="inx">
            <template v-if="item.type == 0">
                <img :src="item.shopinfo.headimg" class="shopimg" />
                <view class="headcon">
                    <view class="titlemf clamp">{{ item.shopinfo.companyname }}</view>
                    <view class="headcon-top">
                        <image class="img" :src="item.shopinfo.logo" mode="aspectFill" @click="opendetails(item.shopinfo.cguid)"></image>
                        <view class="conter">
                            <view class="title">
                                <text class="type" v-if="item.shopinfo.typetext">{{ item.shopinfo.typetext }}</text>
                                <block v-for="(itemss, indesi) in item.shopinfo.levelarray" :key="indesi + 'm'">
                                    <image :src="'../../static/level' + itemss + '.png'" mode="aspectFit" class="tip"></image>
                                </block>
                                <text class="name">{{ item.shopinfo.fansnumber }}</text>
                            </view>
                            <view class="notice clamp">{{ item.shopinfo.notice }}</view>
                            <view class="type clamp">{{ item.shopinfo.managescope }}</view>
                        </view>
                    </view>
                    <view class="statea">
                        <view class="follow" @click="follow(item.shopinfo.isfollow, inx)">{{ item.shopinfo.isfollow == 1 ? '已关注' : '+关注' }}</view>
                        <view class="details" @click="opendetails(item.shopinfo.cguid)"></view>
                    </view>
                </view>
                <view class="shopcon" @click="gomap(item.shopinfo.companyAddress, item.shopinfo.companyname)">
                    <view class="yticon icon-shouhuodizhi" style="width: 80rpx;text-align: center;font-size: 40rpx;"></view>
                    <view class="free">{{ item.shopinfo.companyAddress.address }}</view>
                    <view class="addergo">去店里</view>
                </view>
                <view class="shopjs">{{ item.shopinfo.introduction }}</view>
            </template>
            <template v-if="item.type == 1">
                <view>
                    <swiper class="swiper" autoplay indicator-dots>
                        <swiper-item v-for="(items, index) in item.slidelist" :key="index + 'p'" @click="jump(items)"><img :src="items.url" /></swiper-item>
                    </swiper>
                </view>
            </template>
            <template v-if="item.type == 2">
                <scroll-view class="scroll-view_H" scroll-x="true">
                    <view class="scroll-view-item_H" v-for="(items, index) in item.couponlist" :key="index + 'e'" @click="jump(items)">
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
                        <text :class="type == 1 ? 'action' : ''" @click="producttype(1)">新品</text>
                        <text :class="type == 2 ? 'action' : ''" @click="producttype(2)">销量</text>
                    </view>
                </view>
                <view class="goods-list">
                    <view v-for="(items, index) in item.productlist" :key="index + 'y'" class="goods-item" @click="navToDetailPage(items.productid)">
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
                    <view class="goods-item" v-for="(items, index) in item.adlist" :key="index + 'a'" @click="jump(items)">
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
                    <view class="rob" v-for="(items, index) in item.item" :key="index + 'x'" @click="jump(items)">
                        <image :src="items.url" mode="aspectFill"></image>
                        <view class="con">
                            <view class="flexd">
                                <view class="name">{{ items.name }}</view>
                                <view class="stata" :class="{ x: items.robstate == 1, xx: items.robstate == 2 }">{{ items.robstatetext }}</view>
                            </view>
                            <view class="tip">{{ items.limit }}</view>
                            <view class="flexd">
                                <view>
                                    <view class="old">{{ items.oldprice }}</view>
                                    <view>
                                        <text class="new">{{ items.price }}</text>
                                    </view>
                                </view>
                                <view>
                                    <view class="time" :class="{ x: items.robstate != 0 }" v-if="items.time != 0&& items.robstate != 3">
                                        <countdown :time="items.time" @timeup="robtip(items)"></countdown>
                                    </view>
                                    <view class="schedule" v-if="items.robstate != 0">
                                        <text :style="'width:' + items.percent + '%'"></text>
                                        <view>{{ items.percenttext }}</view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </template>
            <template v-if="item.type == 15">
                <view v-for="(items, index) in item.item" :key="index + 's'" class="recommend" @click="navToDetailPage(items.productid)">
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
        <uni-load-more :status="loadingType"></uni-load-more>
        <view class="footer">
            <view class="submit ash" @click="openqrcode">
                <image src="../../static/share.png" mode="aspectFit"></image>
                分享
            </view>
            <view class="submit ash" @click="chat">
                <image src="../../static/service.png" mode="aspectFit"></image>
                联系店家
            </view>
            <view class="submit ash" @click="jumpClassify()">
                <image src="../../static/classify.png" mode="aspectFit"></image>
                分类
            </view>
        </view>

        <uni-popup ref="qrcode" class="qrcode">
            <view>
                <view class="title">店铺二维码</view>
                <image :src="srce" :style="{ width: cpSize + 'rpx', height: cpSize + 'rpx' }"></image>
                <canvas canvas-id="qrcode-canvas" :style="{ width: cpSize + 'rpx', height: cpSize + 'rpx' }" />
                <view class="tip">扫一扫关注店铺，长按保存至手机</view>
            </view>
        </uni-popup>
        <uni-popup ref="getredpacket" type="center" class="getredpacket">
            <view class="envelopes" @click="elastics()">
                <view class="pice">{{ envelopes.discounts }}</view>
                <view class="tip">{{ envelopes.limitmoney }}</view>
                <view class="type">{{ envelopes.redpackettypeMsg }}</view>
                <view class="tips">已放入账号，请在商城-我的-优惠券中查看</view>
                <view class="btn">我知道了</view>
            </view>
        </uni-popup>
    </view>
</template>

<script>
var x_PI = (3.14159265358979324 * 3000.0) / 180.0;
var PI = 3.1415926535897932384626;
var a = 6378245.0;
var ee = 0.00669342162296594323;

/**
 * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
 * 即 百度 转 谷歌、高德
 * @param bd_lon
 * @param bd_lat
 * @returns {*[]}
 */
function bd09togcj02(bd_lon, bd_lat) {
    var x_pi = (3.14159265358979324 * 3000.0) / 180.0;
    var x = bd_lon - 0.0065;
    var y = bd_lat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    var gg_lng = z * Math.cos(theta);
    var gg_lat = z * Math.sin(theta);
    return [gg_lng, gg_lat];
}

function transformlat(lng, lat) {
    var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
    ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0;
    ret += ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) / 3.0;
    ret += ((160.0 * Math.sin((lat / 12.0) * PI) + 320 * Math.sin((lat * PI) / 30.0)) * 2.0) / 3.0;
    return ret;
}

function transformlng(lng, lat) {
    var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
    ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0;
    ret += ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) / 3.0;
    ret += ((150.0 * Math.sin((lng / 12.0) * PI) + 300.0 * Math.sin((lng / 30.0) * PI)) * 2.0) / 3.0;
    return ret;
}

/**
 * 判断是否在国内，不在国内则不做偏移
 * @param lng
 * @param lat
 * @returns {boolean}
 */
function out_of_china(lng, lat) {
    return lng < 72.004 || lng > 137.8347 || (lat < 0.8293 || lat > 55.8271 || false);
}
import uimg from "@/components/uimg/uimg.vue";
import QRCode from '@/store/qrcode.js';
import BaiduMap from '@/store/baidu.js';
import countdown from '@/components/countdown/countdown';
import uniLoadMore from '@/components/uni-load-more/uni-load-more';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
export default {
    components: {
        uniLoadMore,
        countdown,
        uniPopup,
        uimg
    },
    data() {
        return {
            backshow:false,
            envelopes: {},
            srce: '',
            cpSize: 400,
            data: [],
            cguid: '',
            pagesize: 12,
            lid: '',
            loadingType: 'more',
            type: 1,
            isforward: 0
        };
    },
    onBackPress(){
        this.$api.ovPage()
    },
    onNavigationBarButtonTap(e) {
        if (e.index == 1) {
            uni.navigateTo({
                url: '/pages/search/search?type=店铺内搜索&cguid=' + this.cguid
            });
        } else if (e.index == 0) {
            uni.navigateTo({
                url: '/pages/product/complaint?cguid=' + this.cguid
            });
        }
    },
    onPageScroll(o){
        if(o.scrollTop > 60){
            this.backshow = true;
        }else{
            this.backshow = false;
        }
    },
    onLoad(options) {
        this.cguid = options.cguid;
        this.isforward = options.isforward || 0;
        this.loadData();
        //监听登录登出方法刷新页面
        let _this = this;
        uni.$on('changeLoginState', function(data) {
            _this.cguid = options.cguid;
            _this.loadData();
        });
    },
    onShow() {
        this.openenvelopes();
    },
    //下拉刷新
    onPullDownRefresh() {
        this.type = 1;
        this.loadData();
    },
    //加载更多
    onReachBottom() {
        if (this.loadingType == 'loading' || this.loadingType == 'nomore') {
            return;
        }
        this.moredata();
    },
    methods: {
        // 联系店家
        chat() {
            let dataInfo = {};
            this.data.forEach(item => {
                if (item.type == 0) {
                    dataInfo.nickName = item.shopinfo.companyname;
                    dataInfo.username = item.shopinfo.userguid;
                    dataInfo.avatar = item.shopinfo.logo;
                    return;
                }
            });
            console.log(dataInfo);
            if (!dataInfo) {
                this.$api.msg('该店铺暂不支持聊天');
            }
            uni.setStorage({
                key:'jiguang_chater_info',
                data: dataInfo
            });
            uni.navigateTo({
                url: '/pages/chat/chat'
            });
        },
        //加载商品 ，带下拉刷新和上滑加载
        async loadData() {
            uni.showLoading({
                title: '加载中',
                mask: true
            });
            this.lid = '';
            let data = {
                cguid: this.cguid,
                pagesize: this.pagesize,
                lid: this.lid,
                isforward: this.isforward
            };
            this.$ajax.get('shophomepage/shopinfo', data).then(res => {
                uni.hideLoading();
                if (res.data.code == 0) {
                    this.data = res.data.result.data;
                    if (this.$wx.isWechat()) {
                        this.$wx.share({
                            title: this.data[0].shopinfo.companyname,
                            desc: this.data[0].shopinfo.introduction,
                            imgUrl: this.data[0].shopinfo.logo
                        }, 'http://ets.51pingce.net/pages/product/shop?cguid=' + this.data[0].shopinfo.cguid + '&isforward=1');
                    }
                    res.data.result.data.forEach(item => {
                        if (item.type == 3) {
                            this.loadingType = item.productlist.length == this.pagesize ? 'more' : 'nomore';
                            this.lid = item.productlist[item.productlist.length - 1].productid;
                        }
                    });
                    uni.setNavigationBarTitle({
                        title: res.data.result.data[0].shopinfo.companyname
                    });
                    uni.stopPullDownRefresh();
                }
            });
        },
        backtop(){
            uni.pageScrollTo({scrollTop: 0,duration: 0});
        },
        openqrcode() {
            let that = this;
            let val = 'http://ets.51pingce.net/pages/product/shop?cguid=' + that.cguid;
            if (that.srce == '') {
                let qrcode = new QRCode({
                    context: that, // 上下文环境
                    canvasId: 'qrcode-canvas', // canvas-id
                    showLoading: true, // 是否显示loading
                    loadingText: '加载中', // loading文字
                    text: val, // 生成内容
                    size: uni.upx2px(that.cpSize), // 二维码大小
                    background: '#FFF', // 背景色
                    foreground: '#000', // 前景色
                    correctLevel: 3, // 容错级别
                    cbResult: function(res) {
                        // 生成二维码的回调
                        that.srce = res;
                    }
                });
            }
            this.$refs.qrcode.open();
        },
        robtip(item) {
            if (item.robstate == 0) {
                item.robstate = 1;
                item.time = 0;
                item.robstatetext = '抢购中';
            } else {
                item.robstate = 2;
                item.time = 0;
                item.robstatetext = '活动已结束';
            }
        },
        producttype(index) {
            this.type = index;
            this.moredata('refresh');
            uni.showLoading({
                title: '加载中'
            });
        },
        moredata(type) {
            if (this.loadingType == 'loading') {
                return;
            }
            this.loadingType = 'loading';
            if (type === 'refresh') {
                this.lid = '';
            }
            let data = {
                cguid: this.cguid,
                pagesize: this.pagesize,
                lid: this.lid,
                ordertype: this.type
            };
            this.$ajax.get('shophomepage/getproduct', data).then(res => {
                if (res.data.code == 0) {
                    let list = res.data.result.data[0].productlist;
                    this.data.forEach(item => {
                        if (item.type == 3) {
                            if (type === 'refresh') {
                                uni.hideLoading();
                                item.productlist = [];
                            }
                            item.productlist = item.productlist.concat(list);
                            this.loadingType = list.length == this.pagesize ? 'more' : 'nomore';
                            this.lid = list[list.length - 1].productid;
                        }
                    });
                }
            });
        },
        //详情
        navToDetailPage(id) {
            uni.navigateTo({
                url: '/pages/product/product?productid=' + id
            });
        },
        opendetails(id) {
            uni.navigateTo({
                url: '/pages/product/shopdetails?cguid=' + id
            });
        },
        jump(item) {
            if (item.jumptype == 1) {
                if (item.productid == '' || item.productid == null) {
                    return false;
                }
                uni.navigateTo({
                    url: '/pages/product/product?productid=' + item.productid
                });
            } else if (item.couponid > 0) {
                // 领取优惠券
                this.$ajax.get('product/getReceiveCoupon', { couponid: item.couponid }).then(res => {
                    if (res.data.code == -1) {
                        this.$api.msg('该优惠券您已经领取了哦~');
                    } else {
                        this.$api.msg(res.data.msg);
                    }
                });
            } else {
                if (item.productid == '' || item.productid == null) {
                    return false;
                }
                // 抢购中
                uni.navigateTo({
                    url: '/pages/product/product?productid=' + item.productid
                });
            }
        },
        follow(follow, index) {
            let isfollow = follow == 0 ? 0 : 1;
            this.$ajax.get('shophomepage/follow', { cguid: this.cguid, isfollow: isfollow }).then(res => {
                this.$api.msg(res.data.msg);
                if (res.data.code == 0) {
                    this.loadData('refresh');
                }
            });
        },
        jumpClassify() {
            uni.navigateTo({
                url: '/pages/product/classify?cguid=' + this.cguid
            });
        },
        gomap(o, name) {
            if (o.latitude) {
                let kk = bd09togcj02(o.longtitude, o.latitude);
                uni.openLocation({
                    latitude: kk[1],
                    longitude: kk[0],
                    name: name,
                    address: o.address,
                    success: function() {
                        console.log('success');
                    }
                });
            } else {
                this.$api.msg(o.address);
            }
        },
        openenvelopes() {
            let _this = this;
            if (this.$wx.isWechat()) {
                this.$wx.initJssdk(location.href.split('#')[0], function(){
                    _this.$wx.jweixin().getLocation({
                        type: 'wgs84', // 默认为wgs84的gps坐标，如果要用火星坐标，可传入'gcj02'
                        success: function(res) {
                            var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                            var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                            BaiduMap.init().then(BMap => {
                                var myGeo = new BMap.Geocoder();
                                // 根据坐标得到地址描述
                                myGeo.getLocation(new BMap.Point(longitude, latitude), function(result) {
                                    if (result) {
                                        let addres = '';
                                        addres = result.addressComponents.province + ',' + result.addressComponents.city + ',' + result.addressComponents.district;
                                        let data = {
                                            cguid: _this.cguid,
                                            activityareainfo: addres
                                        };
                                        _this.$ajax.get('sale/getredpacket', data).then(res => {
                                            if (res.data.code == 0) {
                                                _this.envelopes = res.data.result.data;
                                                _this.$refs.getredpacket.open();
                                            }
                                        });
                                    }
                                });
                            });
                        }
                    });
                })
            }
        },
        elastics() {
            this.$refs.getredpacket.close();
        }
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
    image {
        width: 180rpx;
        min-width: 180rpx;
        max-width: 180rpx;
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
            align-items: center;
            .name {
                font-size: 30rpx;
                margin-right: 24rpx;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }
            .stata {
                font-size: 28rpx;
                min-width: 120rpx;
                color: rgb(18, 184, 56);
                &.x{
                    color: $base-color;
                }
                &.xx{
                    color: $font-color-dark;
                }
            }
            .time {
                font-size: 28rpx;
                color: rgb(18, 184, 56);
                /deep/ text{
                    background:rgb(18, 184, 56);
                    color: #FFF;
                    border-radius: 4rpx;
                    margin: 0 4rpx;
                    min-width: 48rpx;
                    display: inline-block;
                    text-align: center;
                }
                &.x{
                    color: $base-color;
                    /deep/ text{
                        background:$base-color;
                    }
                }
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
                margin-top: 20rpx;
                position: relative;
                border: 1px solid #dddddd;
                border-radius: 30rpx;
                text-align: center;
                overflow: hidden;
                font-size: 24rpx;
                max-width: 240rpx;
                min-width: 240rpx;
                width: 240rpx;
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
            .remind{
                display: inline-block;
                border-radius: 12rpx;
                background: rgb(18, 184, 56);
                color: #FFF;
            }
        }
        .tip {
            color: $border-color-dark;
            margin: 18rpx 0;
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
        font-size: 24rpx;
    }
    .addergo {
        width: 200rpx;
        text-align: center;
        color: $base-color;
    }
}
.shopjs {
    padding: 20rpx 30rpx 10rpx 30rpx;
    background: #ffffff;
    font-size: 28rpx;
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
.recommend {
    padding: 20rpx 30rpx;
    background: #ffffff;
    border-bottom: 1px solid #dddddd;
    display: flex;
    align-items: center;
    .con {
        flex-grow: 1;
    }
    .image-wrapper {
        margin-right: 20rpx;
        img {
            width: 180rpx;
            height: 180rpx;
        }
    }
    .title {
        font-size: 28rpx;
        max-width: 480rpx;
        margin-bottom: 100rpx;
    }
    .price-box {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        .price {
            color: $base-color;
            font-size: 36rpx;
        }
        img {
            width: 40rpx;
            height: 40rpx;
        }
    }
}
.submit image {
    width: 40rpx;
    height: 40rpx;
    margin-right: 20rpx;
}
.headcon {
    display: flex;
    margin-top: -140rpx;
    padding: 0 30rpx;
    position: relative;
    margin-bottom: 20rpx;
    .titlemf {
        position: absolute;
        left: 140rpx;
        right: 140rpx;
        top: -100rpx;
        text-align: center;
        color: #fff;
    }
    .headcon-top {
        flex-grow: 1;
        display: flex;
        color: #fff;
        .img {
            width: 100rpx;
            height: 100rpx;
            min-width: 100rpx;
            margin-right: 10rpx;
            border-radius: 50%;
        }
        .conter {
            flex-grow: 1;
            font-size: 24rpx;
            .title {
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                .type {
                    font-size: 28rpx;
                    padding: 0 10rpx;
                    background: $base-color;
                    border-radius: 10rpx;
                    vertical-align: middle;
                    margin-right: 10rpx;
                }
                .tip {
                    width: 32rpx;
                    height: 32rpx;
                    margin-right: 8rpx;
                    vertical-align: middle;
                }
            }
            .notice {
                background: url(../../static/bnotice.png) no-repeat left center;
                background-size: 30rpx 30rpx;
                padding-left: 40rpx;
                width: 400rpx;
                max-width: 400rpx;
            }
            .type {
                background: url(../../static/btab-shop.png) no-repeat left center;
                background-size: 30rpx 30rpx;
                padding-left: 40rpx;
                width: 400rpx;
                max-width: 400rpx;
            }
        }
    }
    .statea {
        width: 180rpx;
        min-width: 180rpx;
        position: relative;
        text-align: center;
        .follow {
            border: 1px solid #dddddd;
            font-size: 24rpx;
            padding: 8rpx 26rpx;
            border-radius: 20rpx;
            background: #ffffff;
            text-align: center;
            display: inline-block;
        }
        .details {
            width: 70rpx;
            height: 70rpx;
            background: url(../../static/xjt.png) no-repeat center #fff;
            border-radius: 50%;
            border: 1px solid #ddd;
            position: absolute;
            bottom: -35rpx;
            left: 50%;
            margin-left: -35rpx;
        }
    }
}
.getredpacket {
    .envelopes {
        width: 750rpx;
        height: 890rpx;
        position: relative;
        background: url(../../static/getredpacket.png) no-repeat center;
        background-size: 750rpx 890rpx;
        text-align: center;
        .pice {
            padding-top: 200rpx;
            font-size: 100rpx;
            color: $base-color;
        }
        .tip {
            margin-top: 20rpx;
            font-size: 40rpx;
            color: rgb(239, 65, 70);
        }
        .type {
            font-size: 50rpx;
            margin-top: 140rpx;
            color: rgb(255, 209, 32);
        }
        .tips {
            font-size: 24rpx;
            margin-top: 20rpx;
            color: rgb(255, 209, 32);
        }
        .btn {
            font-size: 40rpx;
            background: rgb(255, 223, 61);
            color: $base-color;
            width: 300rpx;
            padding: 18rpx;
            margin: 40rpx auto 0 auto;
            text-align: center;
            border-radius: 40rpx;
        }
    }
    /deep/ .uni-popup__wrapper.uni-custom.center .uni-popup__wrapper-box {
        background: inherit;
        padding: 0;
        max-width: inherit;
        max-height: inherit;
        overflow-y: inherit;
    }
}
</style>
