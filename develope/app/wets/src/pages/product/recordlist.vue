<template>
    <view class="content">
        <view class="navbar">
            <view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{ current: tabCurrentIndex === index }" @click="tabClick(index)">{{ item.text }}</view>
        </view>

        <swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
            <swiper-item class="tab-content" v-for="(tabItem, tabIndex) in navList" :key="tabIndex">
                <scroll-view class="list-scroll-content" scroll-y @scrolltolower="more(tabIndex)">
                    <!-- 空白页 -->
                    <empty v-if="tabItem.loaded === true && tabItem.orderList.length === 0"></empty>

                    <!-- 订单列表 -->
                    <view class="goods-list" v-if="tabItem.type == 0">
                        <view class="goods-item" v-for="(item, indexe) in tabItem.orderList" :key="indexe" @click="navToDetailPage(item)">
                            <image v-if="item.isNewOnShelvesProduct == 1" class="label" :src="item.newOnShelvesProductIcon" mode="aspectFit"></image>
                            <view class="image-wrapper">
                                <uimg :src="item.url"></uimg>
                            </view>
                            <view class="item-con">
                                <view class="title clamp">
                                    <text v-if="item.presell" class="presell">{{item.presell}}</text>{{ item.name }}
                                </view>
                                <view class="price-box clamp">
                                    <text class="price">{{ item.price }}</text>
                                    <text v-if="item.activitylist.length == 0">{{ item.sales }}</text>
                                    <view v-else>
                                        <text v-for="ite in item.activitylist" :key="ite.wholetext" :style="{color:ite.color,borderColor:ite.color}">{{ ite.wholetext }}</text>
                                    </view>
                                </view>
                                <view class="clamp">
                                    <view class="typename">
                                        <block v-if="item.selficon.url"><image :src="item.selficon.url" mode="aspectFit"></image></block>
                                        <block v-else><text>{{ item.typename }}</text></block>
                                    </view>
                                    <text class="companyname" @click.stop="goshop(item)">{{ item.companyname }}</text>
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="shoplist" v-else>
                        <view class="shopitem" v-for="(item, index) in tabItem.orderList" :key="index" @click="navToShop(item.companyguid)">
                            <view class="logo">
                                <image class="img" :src="item.logo" mode="aspectFill"></image>
                                <text class="name">{{ item.companyname }}</text>
                            </view>
                            <view class="header clamp">
                                <text class="type" v-if="item.companyLabel">{{ item.companyLabel }}</text>
                                <view class="shoplever">
                                    <image v-for="(itemse, ine) in item.levelarray" :src="'../../static/level' + itemse + '.png'" mode="aspectFit" :key="ine"></image>
                                </view>
                                <text class="number">{{ item.attentionMsg }}</text>
                            </view>
                            <image class="conimg" :src="item.picurl" mode="aspectFill"></image>
                            <view class="evaluate clamp">{{ item.commentMsg }}</view>
                            <view class="activity">
                                <text v-for="(it, ins) in item.salecoloractivity" :key="ins" :style="{ color: it.color, borderColor: it.color }">{{ it.wholetext }}</text>
                            </view>
                            <view class="scope clamp">{{ item.managescope ? item.managescope : '暂未设置经营范围' }}</view>
                            <view class="address clamp">{{ item.companyAddress.address ? item.companyAddress.address : '暂未设置地理位置' }}</view>
                        </view>
                    </view>
                    <uni-load-more :status="tabItem.loadingType"></uni-load-more>
                </scroll-view>
            </swiper-item>
        </swiper>
    </view>
</template>

<script>
import uimg from "@/components/uimg/uimg.vue";
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import empty from '@/components/empty';
export default {
    components: {
        uniLoadMore,
        empty,
        uimg
    },
    data() {
        return {
            tabCurrentIndex: 0,
            navList: [
                {
                    text:'商品',
                    orderList:[],
                    type:0,
                    loadingType:'more'
                },
                {
                    text:'店铺',
                    orderList:[],
                    type:1,
                    loadingType:'more'
                }
            ],
            lid: '',
            pagesize: 10
        };
    },
    onBackPress(){
        this.$api.ovPage()
    },
    onLoad(options) {
        this.loadData();
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    onNavigationBarButtonTap(e) {
        let index = this.tabCurrentIndex;
        let navItem = this.navList[index];
        let historytype;
        if(index == 0){
            historytype = 'product';
        }else{
            historytype = 'company';
        }
        const data = {
            historytype: historytype,
        };
        let _this = this;
        uni.showModal({
            content: '确定清空浏览记录?',
            success: function (res) {
                if (res.confirm) {
                    _this.$ajax.get('user/clearVisitRecord', data).then(res => {
                        if (res.data.code == 0) {
                            _this.$api.msg('清除成功');
                            navItem.orderList = [];
                        } else {
                            _this.$api.msg('系统出错,请稍后再试');
                        }
                    });
                } else if (res.cancel) {
                    console.log('用户点击取消');
                }
            }
        });
        
    },
    methods: {
        //获取订单列表
        loadData(source) {
            //这里是将订单挂载到tab列表下
            let index = this.tabCurrentIndex;
            let navItem = this.navList[index];
            let historytype;
            if(index == 0){
                historytype = 'product';
            }else{
                historytype = 'company';
            }

            if (source == 'tabChange' && navItem.loaded === true) {
                //tab切换只有第一次需要加载数据
                return;
            }
            if (navItem.loadingType == 'loading' || navItem.loadingType == 'noMore') {
                //防止重复加载
                return;
            }
            navItem.loadingType = 'loading';
            const data = {
                lid: this.lid,
                historytype: historytype,
                pagesize: this.pagesize
            };
            this.$ajax.get('user/getVisitRecord', data).then(res => {
                if (res.data.code == 0) {
                    var guesse;
                    if(index == 0){
                        guesse = res.data.result.data.item;
                    }else{
                        guesse = res.data.result.data;
                    }
                    navItem.orderList = guesse;
                    //loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
                    this.$set(navItem, 'loaded', true);
                    
                    //判断是否还有数据， 有改为 more， 没有改为noMore
                    if (guesse.length != this.pagesize) {
                        navItem.loadingType = 'noMore';
                    } else {
                        navItem.loadingType = 'more';
                    }
                } else {
                    this.$api.msg('系统出错,请稍后再试');
                }
            });
        },
        more() {
            let index = this.tabCurrentIndex;
            let navItem = this.navList[index];
            let historytype;
            if(index == 0){
                historytype = 'product';
            }else{
                historytype = 'company';
            }
            if (navItem.loadingType == 'loading' || navItem.loadingType == 'noMore') {
                //防止重复加载
                return;
            }
            navItem.loadingType = 'loading';
            const data = {
                historytype: historytype,
                pagesize: this.pagesize,
                lid: navItem.orderList[navItem.orderList.length - 1].id
            };
            this.$ajax.get('user/getVisitRecord', data).then(res => {
                if (res.data.code == 0) {
                    var guesse = [];
                    if(index == 0){
                        guesse = res.data.result.data.item;
                    }else{
                        guesse = res.data.result.data;
                    }
                    navItem.orderList = navItem.orderList.concat(guesse);
                    //loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
                    this.$set(navItem, 'loaded', true);
                    if (guesse.length != this.pagesize) {
                        //判断是否还有数据， 有改为 more， 没有改为noMore
                        navItem.loadingType = 'noMore';
                    } else {
                        navItem.loadingType = 'more';
                    }
                } else {
                    this.$api.msg('系统出错,请稍后再试');
                }
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
        },
        //详情页
        navToDetailPage(item) {
            let id = item.productid;
            uni.navigateTo({
                url: '/pages/product/product?productid=' + id
            });
        },
        goshop(it){
            if(it.isself ==0){
                uni.navigateTo({
                    url: '/pages/product/shop?cguid=' + it.cguid
                });
            }else if(it.isself == 1){
                uni.navigateTo({
                    url: '/pages/product/shopproductlist?cguid=' + it.cguid
                });
            }
        },
        navToShop(id) {
            uni.navigateTo({
                url: '/pages/product/shop?cguid=' + id
            });
        },
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
// 店铺
.shoplist {
    display: flex;
    flex-wrap: wrap;
    padding: 9px;
    .shopitem {
        width: 48%;
        margin-bottom: 40upx;
        padding: 20rpx;
        background: #fff;
        border-radius: 20rpx;
        font-size: 28rpx;
        &:nth-child(2n + 1) {
            margin-right: 4%;
        }
        .logo {
            display: flex;
            align-items: center;
            .img {
                width: 50rpx;
                height: 50rpx;
                border-radius: 50%;
            }
        }
        .header {
            display: flex;
            align-items: center;
            margin-bottom: 8rpx;
            margin-top: 8rpx;
            font-size: 24rpx;
            .type {
                background: rgb(238, 77, 63);
                color: #fff;
                padding: 0 10rpx;
                border-radius: 10rpx;
            }
            .shoplever image {
                width: 30rpx;
                height: 30rpx;
                margin-left: 4rpx;
                display: inline-block;
                vertical-align: middle;
            }
        }
        .conimg {
            width: 100%;
            height: 180rpx;
        }
        .activity {
            text {
                border: 1px solid rgb(238, 77, 63);
                padding: 0 8rpx;
                margin-right: 6rpx;
                display: inline-block;
                border-radius: 10rpx;
                font-size: 24rpx;
                margin-bottom: 4rpx;
            }
        }
        .scope {
            background: url(../../static/tab-shop.png) no-repeat left center;
            padding-left: 40rpx;
            background-size: 30rpx 30rpx;
            font-weight: 600;
        }
        .address {
            background: url(../../static/address.png) no-repeat left center;
            padding-left: 40rpx;
            background-size: 30rpx 30rpx;
            font-weight: 600;
        }
    }
}
</style>
