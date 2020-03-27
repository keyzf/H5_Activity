<template>
    <view class="page-content">
        <view class="group">
            <view class="item" v-for="(item,index) in ranklist">
                <text class="number">{{index +1}}</text>
                <view class="title-img">
                    <image class="img" :src="item.headUrl" mode="aspectFill"></image>
                    <image class="tip" :src="'../../static/vip' + item.memberlevel + '.png'" mode="aspectFit"></image>
                </view>
                <view class="title">{{item.nickname}}</view>
                <view class="right">
                    <view class="tip">发起并成团</view>
                    <view class="btn">{{item.amount}}</view>
                </view>
            </view>
        </view>
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
                ranklist: []
            };
        },
        onLoad(e) {
            this.getRankList();
        },

        //下拉刷新
        onPullDownRefresh() {

        },
        //加载更多
        onReachBottom() {

        },
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
        },
        onNavigationBarButtonTap(e) {
            uni.navigateTo({
                url: '/pages/product/assemble-information'
            });
        },
        methods: {
            getRankList() {
                //http://api.holdsoft.cn/mall/
                this.$ajax.get("groupbuying/rankList", {}).then(res => {
                    console.log(res);
                    if (res.data.code == 0) {
                        ///分类
                        this.ranklist = res.data.result.data.ranklist;
                    }
                });
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
                    view.selectViewport().fields({
                        size: true,
                        scrollOffset: true
                    });
                    view.exec(function(res) {
                        resolve(res);
                    });
                });
            },
        }
    };
</script>
<style lang="scss">
    page {
        background: #DB1A38;
        font-size: 28rpx;
    }

    .group {
        .item {
            display: flex;
            align-items: center;
            background: #FFF;
            border-radius: 10rpx;
            margin: 0 40rpx 20rpx;
            padding: 20rpx;

            .number {
                width: 60rpx;
                height: 60rpx;
                border-radius: 50%;
                text-align: center;
                line-height: 60rpx;
                margin-right: 20rpx;
                color: #333;
            }

            &:nth-child(1) .number {
                background: #FF6450;
                color: #FFF;
            }

            &:nth-child(2) .number {
                background: #6ACE81;
                color: #FFF;
            }

            &:nth-child(3) .number {
                background: #52B6FF;
                color: #FFF;
            }

            .title-img {
                position: relative;
                text-align: right;
                margin-right: 20rpx;

                .img {
                    width: 160rpx;
                    height: 160rpx;
                    border-radius: 20rpx;
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

            .title {
                margin-right: 20rpx;
                flex-grow: 1;
            }

            .right {
                min-width: 140rpx;
                color: #F43F3B;

                .btn {
                    margin-top: 10rpx;
                    border-radius: 10rpx;
                    color: #333;
                    background: #f1f1f1;
                    text-align: center;
                }
            }
        }
    }
</style>
