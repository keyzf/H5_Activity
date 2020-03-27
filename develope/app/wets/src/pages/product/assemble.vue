<template>
    <view class="page-content">
        <view class="inlet">
            <view class="item left" @click="golaunch">
                <image src="../../static/assemble-add.png" mode="aspectFit"></image>
                <view>发起拼团</view>
            </view>
            <view class="item right" @click="gomy">
                <image src="../../static/assemble-my.png" mode="aspectFit"></image>
                <view>我的拼团</view>
            </view>
        </view>
        <view class="ranking">
            <image src="../../static/assemble-ranking.png" mode="aspectFit" @click="ranking"></image>
        </view>
        <view class="lu-bar-tab-nav">
            <view id="luTabFixed" class="lu-bar-tab lu-bar-tab-fixed" :style="{display: barShow}">
                <view class="search">搜索拼团商品/团长名</view>
                <scroll-view class="wuc-tab" scroll-with-animation scroll-x>
                    <view :class="selectedIndex == index ? 'wuc-tab-item lu-active' : 'wuc-tab-item'" v-for="(item, index) in tabList"
                        :key="index" @click="typeClick(item.id,index)">
                        <span>{{ item.name }}</span>
                    </view>
                </scroll-view>
            </view>
            <view id="luTabStatic" class="lu-bar-tab lu-bar-tab-static">
                <view class="search" @click="gosearch">搜索拼团商品/团长名</view>
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
                <view>
                    <text v-if="item.state == 2" class="state">正在抢单</text> 
                    <image class="shopimg" :src="item.picurl" mode="aspectFit"></image>
                </view>
                <view class="introduce">
                    <view class="title">{{item.product_name}}</view>
                    <view class="progress" v-if="item.state == 1">
                        <view :style="{width:(item.currentamount/item.peopleamount)*100+'%'}"></view>
                    </view>
                    <view class="main">
                        <view class="con">
                            <view v-if="item.state == 1" class="news">还差<text class="number">{{item.remainamount}}</text>人
                                <countdown class="indeblock" :time="(item.endtimestamp - new Date().getTime())/1000"
                                    @timeup="robtip()" :day="false"></countdown>
                            </view>
                            <view v-if="item.state == 5" class="news">
                                <text class="number">拼团成功</text>
                            </view>
                            <view class="pcice">
                                <text class="new">{{item.unit_price}}</text><text class="old">{{item.old_price}}</text>
                            </view>
                            <view class="tip">{{item.peopleamount}}人拼已拼{{item.currentamount}}件</view>
                        </view>
                        <view class="right">
                            <view class="title-img">
                                <image class="img" :src="item.headUrl" mode="aspectFill"></image>
                                <image class="tip" :src="'../../static/vip' + item.memberlevel + '.png'" mode="aspectFit"></image>
                            </view>
                            <view class="btn">
                                立即参与
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <uni-load-more :status="loadingType" color="#FFF"></uni-load-more>
        <uni-popup ref="popup" type="center">
            <view class="uni-tip">
                <view class="uni-tip-title">请输入拼团昵称</view>
                <input class="input" type="text" value="" placeholder="请输入拼团昵称"/>
                <view class="uni-tip-group-button"><view class="uni-tip-button">确定</view></view>
            </view>
        </uni-popup>
    </view>
</template>
<script>
    import countdown from '@/components/countdown/countdown.vue';
    import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
    import uniPopup from '@/components/uni-popup/uni-popup.vue';
    export default {
        components: {
            uniLoadMore,
            countdown,
            uniPopup
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
                    if (res.data.code == 0) {
                        ///分类
                        this.tabList = res.data.result.data.tabs;
                        this.InstructionsUrl = res.data.result.data.instruction
                        //1需要设置昵称 0 不需要设置
                        let setnick = res.data.result.data.setnick
                        
                        // 弹框
                            this.$refs.popup.open();
                        if(setnick == 1){
                            //改昵称
                        }
                    }
                });
            },
            participatein(id){
                uni.navigateTo({
                    url: "/pages/product/assemble-product?productid="+ id + "&typeGroup=1"
                });
            },
            groupList(type) {
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
            gosearch() {
                uni.navigateTo({
                    url: '/pages/search/assemble-search'
                })
            },
            ranking() {
                uni.navigateTo({
                    url: '/pages/product/assemble-ranking'
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
/deep/ .uni-popup__wrapper-box{
    border-radius: 20rpx !important;
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
    border-bottom: 2px solid #DB1A38;
    display: block;
    height: 80rpx;
}

.uni-tip-group-button {
    margin-top: 10px;
}

.uni-tip-button {
    text-align: center;
    font-size: 14px;
    color: $base-color;
}
.inlet{
    display: flex;
    .item{
        margin: 5%;
        flex-grow: 1;
        text-align: center;
        padding: 20rpx;
        font-size: 32rpx;
        color: #FFF;
        border-radius: 20rpx;
        image{
            width: 80rpx;
            height: 80rpx;
            margin-bottom: 20rpx;
        }
        &.left{
            background: linear-gradient(to bottom right, #7110EA,#F99AFB);
        }
        &.right{
            background: linear-gradient(to bottom right, #5463FF,#3CE8E2);
        }
    }
}
.ranking{
    padding: 0 30rpx;
    overflow: hidden;
    background: url(../../static/assemble-all.png) no-repeat center;
    background-size: 440rpx;
    image{
        width: 120rpx;
        height: 120rpx;
        float: right;
    }
}
.lu-bar-tab-nav {
    position: relative;
    width: 100%;
    .search{
        width: 80%;
        margin: 0 auto;
        background: url(../../static/search.png) no-repeat left 10px center #FFF;
        background-size: 30rpx 30rpx;
        height: 60rpx;
        line-height: 60rpx;
        color: #666;
        border-radius: 30rpx;
        padding-left: 60rpx;
    }
    .lu-bar-tab {
        width: 100%;
        display: flex;
        flex-flow: row wrap;
        justify-content: space-around;
        align-items: center;
        background-color: #DB1A38;
        padding: 20rpx 0 0;
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
        border-radius: 10rpx;
        margin: 20rpx;
        padding: 20rpx;
        position: relative;
        .state{
            display: inline-block;
            position: absolute;
            left: 30rpx;
            top: 20rpx;
            background: $base-color;
            color: #FFF;
            z-index: 2;
            padding: 4rpx 8rpx;
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
            .progress{
                overflow: hidden;
                width: 50%;
                height: 8rpx;
                border: 1px solid #F43F3B;
                border-radius: 4rpx;
                margin-top: 6rpx;
                view{
                    float: left;
                    display: inline-block;
                    height: 8rpx;
                    border-radius: 4rpx;
                    background: #F43F3B;
                    width: 20%;
                }
            }
            .main{
                display: flex;
                align-items: center;
                .con{
                    flex-grow: 1;
                    .news{
                        min-height: 80rpx;
                        color: #969696;
                        .number{
                            color: #F43F3B;
                        }
                        .indeblock{
                            display: inline-block;
                            margin-left: 12rpx;
                        }
                    }
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
                    .tip{
                        color: #969696;
                    }
                }
                .right{
                    min-width: 140rpx;
                    .title-img{
                        position: relative;
                        text-align: right;
                        .img{
                            width: 100rpx;
                            height: 100rpx;
                            border-radius: 50%;
                        }
                        .tip{
                            position: absolute;
                            right: 0;
                            bottom: 0;
                            width: 40rpx;
                            height: 40rpx;
                            border-radius: 50%;
                        }
                    }
                    .btn{
                        margin-top: 10rpx;
                        border-radius: 10rpx;
                        color: #FFF;
                        background: #F43F3B;
                        text-align: center;
                    }
                }
            }
        }
        
    }
}
</style>