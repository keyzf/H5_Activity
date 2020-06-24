<template>
    <view class="content">
        <view class="coned" @tap="returngo()">
            <view class="search-box">
                <view class="search-left">
                    <uni-text class="yticon icon-zuo"></uni-text>
                </view>
                <view class="input-box"><input type="text" :placeholder="keyword" placeholder-class="placeholder-class"
                        confirm-type="search" disabled /></view>
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
                                    @timeup="robtip()"></countdown>
                            </view>
                            <view v-if="item.state == 5" class="news">
                                <text class="number">拼团成功</text>
                            </view>
                             <view v-if="item.state == 3"class="news">
                            	<text class="number">拼团失败</text>
                            </view>
                            <view v-if="item.state == 4" class="news">
                            	<text class="number">抢单失败</text>
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

        <uni-load-more :status="loadingType"></uni-load-more>
    </view>
</template>

<script>
    import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
    import countdown from '@/components/countdown/countdown.vue';
    export default {
        components: {
            uniLoadMore,
            countdown
        },
        data() {
            return {
                loadingType: 'more',
                keyword: '',
                pagesize: 8,
                lid: 0,
                groupWaresList: [],
            };
        },
        onLoad(options) {
            this.keyword = options.keyword || '';
            this.searchList("refresh");
        },
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
        },
        //下拉刷新
        onPullDownRefresh() {
            this.searchList("refresh");
        },
        //加载更多
        onReachBottom() {
            if (this.loadingType == "nomore") {
                return;
            }
            this.searchList("more");
        },
        methods: {
            searchList(type) {
                console.log(type)
                if (type == "more") {
                    this.lid = this.groupWaresList[this.groupWaresList.length - 1].teamid
                } else if (type == "refresh") {
                    this.lid = 0;
                    this.groupWaresList = [];
                    this.loadingType = "more"
                    uni.stopPullDownRefresh();
                }
                let json = {
                    keyword:this.keyword,
                    pagesize: this.pagesize,
                };
                if (this.lid != 0) {
                    json.lid = this.lid
                }
                this.$ajax.get("groupbuying/search", json).then(res => {
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
            returngo() {
                uni.navigateBack();
            },
            participatein(id){
               uni.navigateTo({
                   url: "/pages/product/assemble-product?productid="+ id + "&typeGroup=1"
               });
            },
            goshop(it) {
                if (it.isself == 0) {
                    uni.navigateTo({
                        url: '/pages/product/shop?cguid=' + it.cguid
                    });
                } else if (it.isself == 1) {
                    uni.navigateTo({
                        url: '/pages/product/shopproductlist?cguid=' + it.cguid
                    });
                }
            }
        }
    };
</script>

<style lang="scss">
    page,
    .content {
        background: $page-color-base;
    }

    .yticon {
        font-size: 52rpx;
    }

    .content {
        padding-top: 88rpx;
    }

    .search-box {
        width: 100%;
        background-color: rgb(242, 242, 242);
        padding: 15upx 2.5%;
        display: flex;
        justify-content: space-between;
    }

    .search-box .input-box {
        flex-grow: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .search-box .input-box>input {
        width: 100%;
        height: 60upx;
        font-size: 32upx;
        border: 0;
        border-radius: 60upx;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        padding: 0 3%;
        margin: 0;
        background-color: #ffffff;
    }

    .placeholder-class {
        color: #9e9e9e;
    }

    .search-keyword {
        width: 100%;
        background-color: rgb(242, 242, 242);
    }

    .coned {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        z-index: 666;
    }

    .group {
        font-size: 28rpx;

        .item {
            display: flex;
            align-items: center;
            background: #FFF;
            border-radius: 10rpx;
            margin: 20rpx;
            padding: 20rpx;
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
            .shopimg {
                width: 220rpx;
                height: 220rpx;
                margin-right: 20rpx;
            }

            .introduce {
                flex-grow: 1;

                .title {
                    font-size: 30rpx;
                    line-height: 40rpx;
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    font-weight: 600;
                }

                .progress {
                    overflow: hidden;
                    width: 50%;
                    height: 8rpx;
                    border: 1px solid #F43F3B;
                    border-radius: 4rpx;

                    view {
                        float: left;
                        display: inline-block;
                        height: 8rpx;
                        border-radius: 4rpx;
                        background: #F43F3B;
                        width: 20%;
                    }
                }

                .main {
                    display: flex;
                    align-items: center;

                    .con {
                        flex-grow: 1;

                        .news {
                            min-height: 80rpx;
                            color: #969696;

                            .number {
                                color: #F43F3B;
                            }

                            .indeblock {
                                display: inline-block;
                                margin-left: 12rpx;
                            }
                        }

                        .pcice {
                            .new {
                                color: #F43F3B;
                                font-size: 34rpx;
                                font-weight: 600;
                            }

                            .old {
                                margin-left: 20rpx;
                                color: #969696;
                                text-decoration: line-through;
                            }
                        }

                        .tip {
                            color: #969696;
                        }
                    }

                    .right {
                        min-width: 140rpx;

                        .title-img {
                            position: relative;
                            text-align: right;

                            .img {
                                width: 100rpx;
                                height: 100rpx;
                                border-radius: 50%;
                            }

                            .tip {
                                position: absolute;
                                right: 0;
                                bottom: 0;
                                width: 40rpx;
                                height: 40rpx;
                                border-radius: 50%;
                            }
                        }

                        .btn {
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
