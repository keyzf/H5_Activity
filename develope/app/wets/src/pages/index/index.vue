<template>
    <view class="container">
        <nav-bar type="transparentFixed" transparentFixedFontColor="#DDD" :title="searchtitle ? searchtitle : '搜索'" @click="searchs">
            <view slot="right" class="search_box" @click.stop="msages"><text v-if="msgtip > 0" class="msgtip"></text></view>
            <view slot="transparentFixedRight" class="search_transparent_box" @click.stop="msages"><text v-if="msgtip > 0" class="msgtip"></text></view>
            <!-- <view slot="right" class="search_boxs" @click.stop="goenvelopes"></view>
            <view slot="transparentFixedRight" class="search_transparent_boxs" @click.stop="goenvelopes"></view> -->
        </nav-bar>
        <!-- 头部轮播 -->
        <view class="carousel-section">
            <!-- 标题栏和状态栏占位符 -->
            <view class="titleNview-placing"></view>
            <!-- 背景色区域 -->
            <view class="titleNview-background"></view>
            <swiper class="carousel" autoplay circular indicator-dots>
                <swiper-item v-for="(item, index) in carouselList" :key="index" class="carousel-item" @click="toDetailPage(item)"><img :src="item.url" /></swiper-item>
            </swiper>
        </view>
        <!-- 分类 -->

        <view v-for="(row, inse) in datalist" :key="inse">
            <template v-if="row.type == 23">
                <view class="platform">
                    <view class="platform-item" v-for="(item, indexy) in row.pic" :key="indexy">
                        <image :src="item.url" mode="aspectFit"></image>
                        <text>{{ item.name }}</text>
                    </view>
                </view>
            </template>
            <template v-if="row.type == 6">
                <view class="cate-section">
                    <view class="cate-item" v-for="(item, indexy) in row.inlet" :key="indexy" @click="tablist(item)">
                        <img :src="item.url" />
                        <view>{{ item.display }}</view>
                    </view>
                </view>
            </template>
            <template v-if="row.type == 25">
                <view class="hot-floor m-t">
                    <view class="floor-img-box" @click="tablist(row)"><img class="floor-img" :src="row.url" /></view>
                    <scroll-view class="floor-list" scroll-x>
                        <view class="scoll-wrapper">
                            <view v-for="(item, index) in row.lisRecord" :key="index" class="floor-item" @click="navToDetailPage(item)">
                                <img :src="item.url" />
                                <text class="title">{{ item.name }}</text>
                                <text class="price">{{ item.price }}</text>
                                <view class="clamp">
                                    <text class="active" v-for="ite in item.activity" :key="ite.wholetext" :style="{color:ite.color,borderColor:ite.color}">{{ ite.wholetext }}</text>
                                </view>
                            </view>
                            <!-- <view class="more">
                                <text>查看全部</text>
                                <text>More+</text>
                            </view> -->
                        </view>
                    </scroll-view>
                </view>
            </template>
            <template v-if="row.type == 24">
                <view class="promotion m-t">
                    <view v-if="row.url != null">
                        <view class="ad-1" v-if="row.url != ''"><img :src="row.url" /></view>
                    </view>
                    <view class="list">
                        <view class="column" v-for="(rows, indexq) in row.list" :key="indexq" @click="entrance(rows)">
                            <view class="top">
                                <view class="title">
                                    {{ rows.mainheading }}
                                    <countdown v-if="rows.timetoend" class="countdown" :time="rows.timetoend"></countdown>
                                </view>
                                <view class="ad">{{ rows.subheading }}</view>
                            </view>
                            <view class="imglist"><img :src="rowsx.url" v-for="(rowsx, indexx) in rows.itemList" :key="indexx" v-if="indexx < 2" /></view>
                        </view>
                    </view>
                </view>
            </template>
            <template v-if="row.type == 22">
                <view class="f-header"><image :src="row.pic[0].url" :style="'width:' + row.pic[0].width + 'rpx;height:' + row.pic[0].height + 'rpx;'"></image></view>
            </template>
        </view>
        <!-- 活动区 -->

        <!-- 猜你喜欢 -->
        <view class="goods-list">
            <view class="goods-item" v-for="(item, index) in guess" :key="index" @click="navToDetailPage(item)">
                <image v-if="item.isNewOnShelvesProduct == 1" class="label" :src="item.newOnShelvesProductIcon" mode="aspectFit"></image>
                <view class="image-wrapper">
                    <uimg :src="item.url"></uimg>
                </view>
                <view class="item-con">
                    <view class="title clamp"><text v-if="item.presell" class="presell">{{item.presell}}</text>{{ item.name }}</view>
                    <view class="price-box clamp">
                        <text class="price">{{ item.price }}</text>
                        <text v-if="item.activitylist.length == 0">{{ item.sales }}</text>
                        <view v-else>
                            <text v-for="ite in item.activitylist" :key="ite.wholetext" :style="{color:ite.color,borderColor:ite.color}">{{ ite.wholetext }}</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view class="backtop" :class="{ x: backshow }"><image src="../../static/backtop.png" mode="aspectFit" @click="backtop"></image></view>
        <uni-load-more :status="loadingType"></uni-load-more>
    </view>
</template>

<script>
import uimg from "@/components/uimg/uimg.vue";
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import countdown from '@/components/countdown/countdown.vue';
import navBar from '@/components/navBar/index.vue';
import { mapState } from 'vuex';
export default {
    components: {
        uniLoadMore,
        countdown,
        navBar,
        uimg
    },
    computed: {
        ...mapState(['jump_shop'])
    },
    data() {
        return {
            backshow: false,
            msgtip: 0,
            titleNViewBackground: '',
            swiperCurrent: 0,
            swiperLength: 0,
            goodsList: [],
            entry: [],
            guess: [],
            multiples: {},
            multiple: {},
            special: {},
            loadingType: 'more',
            pagesize: 10,
            pageid: 0,
            searchtitle: ''
        };
    },
    props: {
    	datalist:Array,
        carouselList:Array
    },
    created(){
    	uni.showLoading({
    	    title: '加载中'
    	});
    	this.load(0);
    	
    	//监听登录登出方法刷新页面
    	let _this = this;
    	uni.$on('changeLoginState', function(data) {
    	    _this.load(0);
    	});
    	this.$ajax.get('shoppingcart/lookshoplist', {}).then(res => {
    	    if (res.data.code == 0) {
    	        let list = res.data.result.data;
    	        var number = 0;
    	        let cartList = list.map(item => {
    	            number += item.goodsinfo.length;
    	        });
    	    } else {
    	        this.$api.msg(res.data.msg);
    	    }
    	});
        this.$ajax.get('shoppingcart/getModelTipNum', { code: 'MESSAGE' }).then(res => {
            if(res.data.code == 0){
                let number = res.data.result.data.tipnumber;
                this.msgtip = number;
            }
        });
        
    },
    methods: {
        backtop() {
            uni.pageScrollTo({ scrollTop: 0, duration: 0 });
        },
        load(is) {
            if (is == 0) {
                uni.hideLoading();
            } else {
                uni.stopPullDownRefresh();
            }
            this.$ajax.get('homepage/getGuesslikeList', {}).then(res => {
                this.guess = res.data.result.data;
            });
            this.$ajax.get('homepage/getSearchboxShading', {}).then(res => {
                this.searchtitle = res.data.result.data.text;
            });
        },
        more() {
            if (this.loadingType == 'nomore') {
                return;
            }
            this.loadingType = 'loading';
            const data = {
                lid: this.pageid,
                pagesize: this.pagesize
            };
            this.$ajax.get('homepage/getGuesslikeList', data).then(res => {
                if (res.data.code == 0) {
                    var list = res.data.result.data;
                    this.loadingType = list.length >= this.pagesize ? 'more' : 'nomore';
                    if (list.length > 0) {
                        this.guess = this.guess.concat(list);
                        this.pageid = list[list.length - 1].productid;
                    }
                } else {
                    this.$api.msg('系统出错,请稍后再试');
                }
            });
        },
        tablist(item) {
            if (item.code == 'POSTER') {
                uni.navigateTo({
                    url: '/pages/selective/selective?id=' + item.activityid
                });
            } else if (item.code == 'RANKLIST') {
                uni.navigateTo({
                    url: '/pages/product/ranking'
                });
            } else if (item.code == 'GROUPBUYING') {
                uni.navigateTo({
                    url: '/pages/product/assemble'
                });
            } else if (item.code == 'BENEFIT') {
                uni.navigateTo({
                    url: '/pages/product/welfare'
                });
            }  else if (item.code == 'COUPON') {
                uni.navigateTo({
                    url: '/pages/user/coupon'
                });
            } else if (item.code == 'HELPPOOR_COMPETITION') {
                uni.navigateTo({
                    url: '/pages/ranking/index'
                });
            } else if (item.code == 'PROMOTION') {
                uni.navigateTo({
                    url: '/pages/product/catelist?id=' + item.activityid
                });
            } else if (item.code == 'MORE') {
                uni.navigateTo({
                    url: '/pages/product/catemore'
                });
            } else if (item.code == 'BUYLIMIT') {
                uni.navigateTo({
                    url: '/pages/product/rushbuy'
                });
            } else if (item.code == 'NEWPRODUCT') {
               if (item.activityid == '' || item.activityid == null) {
                   return false;
               }
               uni.navigateTo({
                   url: '/pages/product/fashionable?id=' + item.activityid
               });
            } else if (item.code == 'POSTER') {
               uni.navigateTo({
                   url: '/pages/product/poster?id=' + item.activityid
               });
            } else if (item.jumptype == 1) {
                uni.navigateTo({
                    url: '/pages/product/product?productid=' + item.productid
                });
            } else if (item.code == 'HELP_POOR_COMPETITION') {
                location.href = '';
            } else {
                this.$api.msg('功能开发中');
            }
        },
        toDetailPage(item) {
            if (item.code == 'HELP_POOR_COMPETITION') {
                location.href = '';
                return;
            }
            if (item.code == 'POSTER') {
                uni.navigateTo({
                    url: '/pages/product/poster?id=' + item.activityid
                });
            }else if (item.jumptype == 1) {
                let id = item.productid;
                uni.navigateTo({
                    url: '/pages/product/product?productid=' + id
                });
            }else if(item.jumptype == 5){
                if (item.activityid == '' || item.activityid == null) {
                    return false;
                }
                uni.navigateTo({
                    url: '/pages/product/catelist?id=' + item.activityid
                });
            }else if(item.jumptype == 4){
                uni.navigateTo({
                    url: '/pages/product/rushbuy'
                });
            }else if(item.jumptype == 8){
                let userInfo = uni.getStorageSync('userInfo') || '';
                location.href = item.h5url + "?guid=" + userInfo.guid;
            }
        },
        // 大入口分类
        entrance(i) {
            if (i.code == 'RANKLIST') {
                uni.navigateTo({
                    url: '/pages/product/ranking'
                });
            } else if (i.code == 'GROUPBUYING') {
                uni.navigateTo({
                    url: '/pages/product/assemble'
                });
            } else if (i.code == 'BUYLIMIT') {
                uni.navigateTo({
                    url: '/pages/product/rushbuy'
                });
            } else if (i.code == 'NEWPRODUCT') {
                if (i.activityid == '' || i.activityid == null) {
                    return false;
                }
                uni.navigateTo({
                    url: '/pages/product/fashionable?id=' + i.activityid
                });
            }else if (i.code == 'PROMOTION') {
                uni.navigateTo({
                    url: '/pages/product/catelist?id=' + i.activityid
                });
            }else{
                this.$api.msg('功能开发中');
            }
        },
        //详情页
        navToDetailPage(item) {
            if (item.code == 'PROMOTION') {
                uni.navigateTo({
                    url: '/pages/product/catelist?id=' + item.activityid
                });
            } else if (item.code == 'MORE') {
                uni.navigateTo({
                    url: '/pages/product/catemore'
                });
            } else if (item.jumptype == 1) {
                uni.navigateTo({
                    url: '/pages/product/product?productid=' + item.productid
                });
            }else{
                uni.navigateTo({
                    url: '/pages/product/product?productid=' + item.productid
                });
            }
        },
        
        msages() {
            uni.navigateTo({
                url: '/pages/information/information'
            });
        },
        searchs() {
            uni.navigateTo({
                url: '/pages/search/search'
            });
        },
        goenvelopes(){
            // 跳转红包页面
			uni.navigateTo({
				url: '/pages/activity/activity'
			})
        }
    }
};
</script>

<style lang="scss">
page {
    background: #f5f5f5;
}
.container{
	margin-bottom: 100rpx;
}
.m-t {
    margin-top: 16upx;
}
.popbender{
    width: 600rpx;
    height: 600rpx;
    .imgs{
        width: 100%;
        height: 100%;
    }
}
.search_box {
    width: 48upx;
    height: 48upx;
    background-image: url('../../static/notes.png');
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin-right: 15upx;
    position: relative;
    .msgtip {
        position: absolute;
        top: 0;
        right: 0;
        width: 16rpx;
        height: 16rpx;
        border-radius: 50%;
        background: $base-color;
    }
}
.search_transparent_box {
    width: 48upx;
    height: 48upx;
    background-image: url('../../static/notesw.png');
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 48upx 48upx;
    margin-right: 15upx;
    position: relative;
    .msgtip {
        position: absolute;
        top: 0;
        right: 0;
        width: 16rpx;
        height: 16rpx;
        border-radius: 50%;
        background: $base-color;
    }
}
.search_boxs {
    width: 48upx;
    height: 48upx;
    background-image: url('../../static/envelopeactivities.gif');
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 32upx 42upx;
    margin-right: 15upx;
}
.search_transparent_boxs {
    width: 48upx;
    height: 48upx;
    background-image: url('../../static/envelopeactivities.gif');
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 32upx 42upx;
    margin-right: 15upx;
}
/deep/ uni-swiper .uni-swiper-dot-active {
    background: red;
}
/deep/ .uni-popup__wrapper.uni-custom.center .uni-popup__wrapper-box {
    background: inherit;
    padding: 0;
    max-width: inherit;
    max-height: inherit;
    overflow-y: inherit;
}
.elasticdel {
    width: 60rpx;
    height: 60rpx;
    margin: 40rpx auto;
    display: block;
}
.countdown {
    display: inline-block;
    margin-left: 16rpx;
    /deep/ text {
        padding: 4rpx 6rpx;
        background: #000000;
        color: #ffffff;
        border-radius: 50%;
        font-size: 24rpx;
    }
}
/* 头部 轮播图 */
.carousel-section {
    position: relative;
    .titleNview-placing {
        height: var(--status-bar-height);
        box-sizing: content-box;
    }
}
.carousel {
    width: 100%;
    height: 350upx;

    .carousel-item {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    img {
        width: 100%;
        height: 100%;
    }
    image {
        width: 100%;
        height: 100%;
    }
}
.swiper-dots {
    display: flex;
    position: absolute;
    left: 60upx;
    bottom: 15upx;
    width: 72upx;
    height: 36upx;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDhn8LAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTk4MzlBNjE0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTk4MzlBNjA0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0E3RUNERkE0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0E3RUNERkI0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4Gh5BPAAACTUlEQVR42uzcQW7jQAwFUdN306l1uWwNww5kqdsmm6/2MwtVCp8CosQtP9vg/2+/gY+DRAMBgqnjIp2PaCxCLLldpPARRIiFj1yBbMV+cHZh9PURRLQNhY8kgWyL/WDtwujjI8hoE8rKLqb5CDJaRMJHokC6yKgSCR9JAukmokIknCQJpLOIrJFwMsBJELFcKHwM9BFkLBMKFxNcBCHlQ+FhoocgpVwwnv0Xn30QBJGMC0QcaBVJiAMiec/dcwKuL4j1QMsVCXFAJE4s4NQA3K/8Y6DzO4g40P7UcmIBJxbEesCKWBDg8wWxHrAiFgT4fEGsB/CwIhYE+AeBAAdPLOcV8HRmWRDAiQVcO7GcV8CLM8uCAE4sQCDAlHcQ7x+ABQEEAggEEAggEEAggEAAgQACASAQQCCAQACBAAIBBAIIBBAIIBBAIABe4e9iAe/xd7EAJxYgEGDeO4j3EODp/cOCAE4sYMyJ5cwCHs4rCwI4sYBxJ5YzC84rCwKcXxArAuthQYDzC2JF0H49LAhwYUGsCFqvx5EF2T07dMaJBetx4cRyaqFtHJ8EIhK0i8OJBQxcECuCVutxJhCRoE0cZwMRyRcFefa/ffZBVPogePihhyCnbBhcfMFFEFM+DD4m+ghSlgmDkwlOgpAl4+BkkJMgZdk4+EgaSCcpVX7bmY9kgXQQU+1TgE0c+QJZUUz1b2T4SBbIKmJW+3iMj2SBVBWz+leVfCQLpIqYbp8b85EskIxyfIOfK5Sf+wiCRJEsllQ+oqEkQfBxmD8BBgA5hVjXyrBNUQAAAABJRU5ErkJggg==);
    background-size: 100% 100%;

    .num {
        width: 36upx;
        height: 36upx;
        border-radius: 50px;
        font-size: 24upx;
        color: #fff;
        text-align: center;
        line-height: 36upx;
    }

    .sign {
        position: absolute;
        top: 0;
        left: 50%;
        line-height: 36upx;
        font-size: 12upx;
        color: #fff;
        transform: translateX(-50%);
    }
}
.platform {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10rpx 30rpx;
    .platform-item {
        color: $base-color;
        image {
            width: 28rpx;
            height: 28rpx;
            vertical-align: middle;
            margin-right: 4rpx;
        }
        font-size: 24rpx;
        text {
            vertical-align: middle;
        }
    }
}
/* 分类 */
.cate-section {
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    padding: 30upx 22upx;
    .cate-item {
        width: 20%;
        flex-direction: column;
        align-items: center;
        font-size: $font-sm + 2upx;
        color: $font-color-dark;
        margin-bottom: 14upx;
        text-align: center;
    }
    /* 原图标颜色太深,不想改图了,所以加了透明度 */
    image {
        width: 88upx;
        height: 88upx;
    }
    img {
        width: 88upx;
        height: 88upx;
    }
}

.ad-1 {
    width: 100%;
    height: 210upx;
    background: #fff;
    image {
        width: 100%;
        height: 100%;
    }
    img {
        width: 100%;
        height: 100%;
    }
}
.promotion {
    padding: 20upx;
    background: white;
    margin: 20rpx;
    border-radius: 20rpx;
    .text {
        width: 100%;
        height: 60upx;
        font-size: 34upx;
        font-weight: 600;
        margin-top: -10upx;
    }
    .list {
        overflow: hidden;
        padding-right: 1px;
        .column {
            width: 50%;
            float: left;
            padding: 10upx 0 10upx 0;
            border-right: 1px solid #dddddd;
            border-bottom: 1px solid #dddddd;
            &:nth-last-of-type(2) {
                border-bottom: none;
            }
            &:nth-last-of-type(1) {
                border-bottom: none;
            }
            &:nth-child(even) {
                border-right: none;
                padding: 10upx 0 10upx 16upx;
            }
            .top {
                height: 80upx;
                margin-bottom: 5upx;
                .title {
                    font-size: 30upx;
                }
                .ad {
                    margin-top: 5upx;
                    width: 100%;
                    font-size: 22upx;
                    color: #acb0b0;
                }
            }
            .imglist {
                overflow: hidden;
                height: 168upx;
                margin-right: -10rpx;
                image {
                    width: 160upx;
                    height: 160upx;
                    border-radius: 3px;
                    margin-right: 4upx;
                    float: left;
                }
                img {
                    width: 160upx;
                    height: 160upx;
                    border-radius: 3px;
                    margin-right: 4upx;
                    float: left;
                }
            }
        }
    }
}

/* 秒杀专区 */
.seckill-section {
    padding: 4upx 30upx 24upx;
    background: #fff;
    .s-header {
        display: flex;
        align-items: center;
        height: 92upx;
        line-height: 1;
        .s-img {
            width: 140upx;
            height: 30upx;
        }
        .tip {
            font-size: $font-base;
            color: $font-color-light;
            margin: 0 20upx 0 40upx;
        }
        .timer {
            display: inline-block;
            width: 40upx;
            height: 36upx;
            text-align: center;
            line-height: 36upx;
            margin-right: 14upx;
            font-size: $font-sm + 2upx;
            color: #fff;
            border-radius: 2px;
            background: rgba(0, 0, 0, 0.8);
        }
        .icon-you {
            font-size: $font-lg;
            color: $font-color-light;
            flex: 1;
            text-align: right;
        }
    }
    .scoll-wrapper {
        display: flex;
        align-items: flex-start;
    }
    .floor-item {
        width: 150upx;
        margin-right: 20upx;
        font-size: $font-sm + 2upx;
        color: $font-color-dark;
        line-height: 1.8;
        image {
            width: 150upx;
            height: 150upx;
            border-radius: 6upx;
        }
        img {
            width: 150upx;
            height: 150upx;
            border-radius: 6upx;
        }
        .price {
            color: $uni-color-primary;
        }
        
    }
}

/* 团购楼层 */
.group-section {
    background: #fff;
    .g-swiper {
        height: 650upx;
        padding-bottom: 30upx;
    }
    .g-swiper-item {
        width: 100%;
        padding: 0 30upx;
        display: flex;
    }
    image {
        width: 100%;
        height: 460upx;
        border-radius: 4px;
    }
    img {
        width: 100%;
        height: 460upx;
        border-radius: 4px;
    }
    .g-item {
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
    .left {
        flex: 1.2;
        margin-right: 24upx;
        .t-box {
            padding-top: 20upx;
        }
    }
    .right {
        flex: 0.8;
        flex-direction: column-reverse;
        .t-box {
            padding-bottom: 20upx;
        }
    }
    .t-box {
        height: 160upx;
        font-size: $font-base + 2upx;
        color: $font-color-dark;
        line-height: 1.6;
    }
    .price {
        color: $uni-color-primary;
    }
    .m-price {
        font-size: $font-sm + 2upx;
        text-decoration: line-through;
        color: $font-color-light;
        margin-left: 8upx;
    }
    .pro-box {
        display: flex;
        align-items: center;
        margin-top: 10upx;
        font-size: $font-sm;
        color: $font-base;
        padding-right: 10upx;
    }
    .progress-box {
        flex: 1;
        border-radius: 10px;
        overflow: hidden;
        margin-right: 8upx;
    }
}
/* 分类推荐楼层 */
.hot-floor {
    overflow: hidden;
    margin: 20upx;
    .floor-img-box {
        width: 100%;
        height: 320upx;
    }
    .floor-img {
        width: 100%;
        height: 100%;
    }
    .floor-list {
        padding: 20upx 0;
        background: #fff;
        position: relative;
        z-index: 1;
    }
    .scoll-wrapper {
        display: flex;
        align-items: flex-start;
    }
    .floor-item {
        width: 200upx;
        font-size: 28upx;
        line-height: 1.5;
        color: $font-color-dark;
        padding: 0 20rpx;
        image {
            width: 160upx;
            height: 160upx;
            border-radius: 6upx;
        }
        img {
            width: 160upx;
            height: 160upx;
            border-radius: 6upx;
        }
        .price {
            color: $uni-color-primary;
        }
        .active{
            border: 1px solid #ddd;
            border-radius: 10rpx;
            padding: 0 6rpx;
            margin-left: 10rpx;
        }
        .title{
            height: 84rpx;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
    }
    .more {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        flex-shrink: 0;
        width: 180upx;
        height: 180upx;
        border-radius: 6upx;
        background: #f3f3f3;
        font-size: $font-base;
        color: $font-color-light;
        text:first-child {
            margin-bottom: 4upx;
        }
    }
}
</style>
