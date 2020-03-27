<template>
    <view class="page-content">
        <image class="topimg" src="http://highmall.holdsoft.cn/rank/热销百强榜2.jpg" mode="aspectFit"></image>
        <view class="lu-bar-tab-nav">
            <view id="luTabFixed" class="lu-bar-tab lu-bar-tab-fixed" :style="{display: barShow}">
                <scroll-view class="wuc-tab" scroll-with-animation scroll-x>
                    <view :class="selectedIndex == index ? 'wuc-tab-item lu-active' : 'wuc-tab-item'" v-for="(item, index) in tabList"
                        :key="index" @click="typeClick(item.id,index)">
                        <span>{{ item.name }}</span>
                    </view>
                </scroll-view>
            </view>
            <view id="luTabStatic" class="lu-bar-tab lu-bar-tab-static">
                <scroll-view class="wuc-tab" scroll-with-animation scroll-x>
                    <view :class="selectedIndex == index ? 'wuc-tab-item lu-active' : 'wuc-tab-item'" v-for="(item, index) in tabList"
                        :key="index" @click="typeClick(item.id,index)">
                        <span>{{ item.name }}</span>
                    </view>
                </scroll-view>
            </view>
        </view>
        <view class="group">
            <view class="item" v-for="(item,index) in groupWaresList" @click="participatein(item.product_id)">  
                <view :class="'state first'+index">
                    <view v-show="index < 3"> TOP </view>
                    {{index + 1}}
                </view> 
                <image class="shopimg" :src="item.picurl" mode="aspectFit"></image>
                <view class="introduce">
                    <view class="title">{{item.product_name}}</view>
                    <view class="main">
                        <view class="con">
                            <view class="pcice">
                                <text class="new">{{item.unit_price}}</text><text class="old">{{item.old_price}}</text>
                            </view>
                        </view>
                        <view class="right">
                            <view class="btn"> 抢 </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <uni-load-more :status="loadingType" color="#FFF"></uni-load-more>
    </view>


</template>
<script>
    import countdown from '@/components/countdown/countdown.vue';
    import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
    export default {
        components: {
            uniLoadMore,
            countdown
        },
        data() {
            return {
                loadingType: "more",
                barShow: 'none',
                selectedIndex: 0,
                tabList: [{
                    id: "",
                    name: ""
                }],
                InstructionsUrl: "",
                pagesize: 8,
                lid: 0,
                tabid: -1,
                groupWaresList: [], //团购商品列表

            };
        },
        onLoad(e) {
            this.typeList();
            this.groupList("refresh");
        },

        //下拉刷新
        onPullDownRefresh() {
            this.groupList("refresh");
        },
        //加载更多
        onReachBottom() {
            if (this.loadingType == "nomore") {
                return;
            }
            this.groupList("more");
        },
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
        },
        onNavigationBarButtonTap(e) {
            uni.navigateTo({
                url: '/pages/user/customerexit?url=' + this.InstructionsUrl + '&name=使用说明'
            });
        },
        methods: {
            //分类
            typeList() {
                this.$ajax.get("groupbuying/homepageInfo", {}).then(res => {
                    console.log(res);
                    if (res.data.code == 0) {
                        ///分类
                        this.tabList = res.data.result.data.tabs;
                        console.log(this.tabList)
                        //1需要设置昵称 0 不需要设置
                        let setnick = res.data.result.data.setnick
                        if(setnick == 1){
                            //改昵称
                        }
                    }
                });
            },
            participatein(id){
                uni.navigateTo({
                    url: "/pages/product/product?productid="+ id
                });
            },
            groupList(type) {
                console.log(type)
                if (type == "more") {
                    this.lid = this.groupWaresList[this.groupWaresList.length - 1].teamid
                } else if (type == "refresh") {
                    this.lid = 0;
                    this.groupWaresList = [];
                    this.loadingType = "more"
                    uni.stopPullDownRefresh();
                }
                this.loadingType = "loading";
                let json = {
                    tabid: this.tabid,
                    pagesize: this.pagesize,
                };
                if (this.lid != 0) {
                    json.lid = this.lid
                }
                this.$ajax.get("groupbuying/listProducts", json).then(res => {
                    console.log(res);
                    if (res.data.code == 0) {
                        let resList = res.data.result.data;
                        if (resList.length < this.pagesize) {
                            this.loadingType = "nomore";
                        }
                        this.groupWaresList = this.groupWaresList.concat(resList);
                    }
                });
            },
            typeClick(id, index) {
                this.tabid = id
                this.selectedIndex = index;
                this.groupList("refresh");
            },
            golaunch() {
                uni.navigateTo({
                    url: '/pages/product/launch-assemble'
                })
            },
            gomy() {
                uni.navigateTo({
                    url: '/pages/product/my-assemble'
                })
            },
            _showBarFixed: function() {
                this._queryMultipleNodes('#luTabStatic', true).then(res => {
                    let tabNav = res[0];
                    if (tabNav.top <= 0) {
                        this.barShow = 'block';
                    } else {
                        this.barShow = 'none';
                    }
                });
            },
            _queryMultipleNodes: function(e, notThis) {
                return new Promise((resolve, reject) => {
                    let view = uni.createSelectorQuery();
                    if (!!notThis) {
                        view.in(this);
                    }
                    if (!!e) {
                        view.select(e).boundingClientRect();
                    }
                    view.exec(function(res) {
                        resolve(res);
                    });
                });
            },
        },
        onPageScroll: function(e) {
            this._showBarFixed(e.scrollTop);
        }
    };
</script>
<style lang="scss">
page {
    background: #DB1A38;
    font-size: 28rpx;
}
.topimg{
    width: 750rpx;
    height: 360rpx;
}
.lu-bar-tab-nav {
    position: relative;
    width: 100%;
    .lu-bar-tab {
        width: 100%;
        display: flex;
        flex-flow: row wrap;
        justify-content: space-around;
        align-items: center;
        background-color: #DB1A38;
        padding: 20rpx 0;
    }
    .lu-bar-tab-fixed {
        position: fixed;
        z-index: 3;
        top: 44px;
        box-shadow: 0px 0px 5px #666;
        //ios不兼容 top: calc(0px + var(--window-top));
    }
    .lu-bar-tab-static {
        position: static;
        z-index: 0;
    }
    .wuc-tab {
        white-space: nowrap;
    }
    .wuc-tab-item {
        display: inline-block;
        line-height: 70upx;
        margin: 0 10upx;
        padding: 0 20upx;
        color: #FFF;
        &.lu-active{
            font-weight: bold;
        }
    }
}
.group{
    .item{
        display: flex;
        align-items: center;
        background: #FFF;
        border-radius: 20rpx;
        margin: 20rpx;
        padding: 20rpx;
        position: relative;
        overflow: hidden;
        .state{
            display: inline-block;
            position: absolute;
            left: 12rpx;
            top: 12rpx;
            background: rgb(102, 102, 102);
            color: #FFF;
            z-index: 2;
            width: 50rpx;
            height: 50rpx;
            border-radius: 50%;
            line-height: 50rpx;
            text-align: center;
            &.first0{
                background: url(../../static/ranking0.png) no-repeat center;
                background-size: 100% 100%;
                width: 60rpx;
                height: 80rpx;
                line-height: 36rpx;
                border-radius: 0;
                top: 0;
            }
            &.first1{
                background: url(../../static/ranking1.png) no-repeat center;
                background-size: 100% 100%;
                width: 60rpx;
                height: 80rpx;
                line-height: 36rpx;
                border-radius: 0;
                top: 0;
            }
            &.first2{
                background: url(../../static/ranking2.png) no-repeat center;
                background-size: 100% 100%;
                width: 60rpx;
                height: 80rpx;
                line-height: 36rpx;
                border-radius: 0;
                top: 0;
            }
        }
        .shopimg{
            width: 220rpx;
            min-width: 220rpx;
            height: 220rpx;
            margin-right: 20rpx;
        }
        .introduce{
            flex-grow: 1;
            .title{
                font-size: 30rpx;
                line-height: 40rpx;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                font-weight: 600;
            }
            .main{
                display: flex;
                align-items: center;
                margin-top: 40rpx;
                .con{
                    flex-grow: 1;
                    .pcice{
                        .new{
                            color: #F43F3B;
                            font-size: 34rpx;
                            font-weight: 600;
                        }
                        .old{
                            margin-left: 20rpx;
                            color: #969696;
                            text-decoration: line-through;
                        }
                    }
                }
                .right{
                    .btn{
                        border-radius: 50%;
                        text-align: center;
                        min-width: 80rpx;
                        height: 80rpx;
                        width: 80rpx;
                        line-height: 80rpx;
                        color: #FFF;
                        background: #F43F3B;
                    }
                }
            }
        }
        
    }
}
</style>