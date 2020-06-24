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
                    <view class="goods-list">
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
            navList: [],
            activityid: 0,
            pagesize: 10
        };
    },
    onBackPress(){
        this.$api.ovPage()
    },
    onLoad(options) {
        this.activityid = options.id;
        const data = {
            activityid: this.activityid
        };
        this.$ajax.get('homepage/newinletTab', data).then(res => {
            if (res.data.code == 0) {
                var list = [];
                var idd = 0;
                res.data.result.data.tabs.forEach((items, index) => {
                    var i = {};
                    i.text = items.name;
                    i.state = index;
                    i.id = items.id;
                    i.loadingType = 'more';
                    i.orderList = [];
                    list.push(i);
                });
                this.navList = list;

                this.loadData();
            } else {
                this.$api.msg('系统出错,请稍后再试');
            }
        });
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    methods: {
        //获取订单列表
        loadData(source) {
            //这里是将订单挂载到tab列表下
            let index = this.tabCurrentIndex;
            let navItem = this.navList[index];
            let id = navItem.id;

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
                activityid: this.activityid,
                tabid: id,
                pagesize: this.pagesize
            };
            this.$ajax.get('homepage/inletDetail', data).then(res => {
                if (res.data.code == 0) {
                    var guesse = [];
                    res.data.result.data.forEach((items, index) => {
                        items.item.forEach((itemse, indexe) => {
                            guesse.push(itemse);
                        });
                    });

                    navItem.orderList = guesse;
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
        more(xh) {
            let navItem = this.navList[xh];
            let id = navItem.id;
            if (navItem.loadingType == 'loading' || navItem.loadingType == 'noMore') {
                //防止重复加载
                return;
            }
            navItem.loadingType = 'loading';
            const data = {
                activityid: this.activityid,
                tabid: id,
                pagesize: this.pagesize,
                lid: navItem.orderList[navItem.orderList.length - 1].productid
            };
            this.$ajax.get('homepage/inletDetail', data).then(res => {
                if (res.data.code == 0) {
                    var guesse = [];
                    res.data.result.data.forEach((items, index) => {
                        items.item.forEach((itemse, indexe) => {
                            guesse.push(itemse);
                        });
                    });
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
</style>
