<template>
    <view class="content" :class="{ x: backstate }">
        <view class="nav-head" v-if="backstate">
            <div class="uni-page-head-hd">
                <div class="uni-page-head-btn" @click="backnav"><i class="uni-btn-icon" style="color: rgb(0, 0, 0); font-size: 27px;"></i></div>
            </div>
            <view class="nav-bd"><view class="uni-page-head__title">{{name}}</view></view>
        </view>
        <view class="con" :class="{ x: backstate }">
            <view class="navbar">
                <view class="nav-item" :class="{ current: condition === 1 || condition === 5}" @click="tabClick(1)">
                    <text>{{ sort == 1 ? '综合' : '新品优先' }}</text>
                    <view class="p-box"><text :class="{ active: condition === 5 || condition === 1 }" class="yticon icon-shang xia"></text></view>
                </view>
                <view class="nav-item" :class="{ current: condition === 2 }" @click="tabClick(2)">销量</view>
                <view class="nav-item" :class="{ current: condition == 3 || condition == 4 }" @click="tabClick(3)">
                    <text>价格</text>
                    <view class="p-box">
                        <text :class="{ active: condition === 4 }" class="yticon icon-shang"></text>
                        <text :class="{ active: condition === 3 }" class="yticon icon-shang xia"></text>
                    </view>
                </view>
            </view>
        </view>
        <view class="goods-list">
            <view v-for="(item, index) in goodsList" :key="index" class="goods-item" @click="navToDetailPage(item.id)">
                <view class="image-wrapper">
                    <image :src="item.url" mode="aspectFill"></image>
                </view>
                <view class="item-con">
                    <view class="title clamp">{{ item.name }}</view>
                    <view class="prompt clamp" v-if="item.taglist.length > 0">
                        <text v-for="(ite, iin) in item.taglist" :key="iin">{{ ite.text }}</text>
                    </view>
                    <view class="price-box clamp">
                        <text class="price">
                            <text>￥</text>{{ item.newprice }}
                        </text>
                        <view v-if="item.activitylist.length > 0">
                            <text class="xe" v-for="ite in item.activitylist" :key="ite.wholetext" :style="{ color: ite.color, borderColor: ite.color }">{{ ite.wholetext }}</text>
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
export default {
    components: {
        uniLoadMore
    },
    data() {
        return {
            id: 0,
            loadingType: 'more',
            name:'网易严选',
            goodsList: [],
            pagesize: 12,
            condition: 1,
            lastid: '',
            backstate: false,
            sort:1
        };
    },
    onLoad(options) {
        this.id = options.id;
        this.name = options.name;
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/holdmall/i) == 'holdmall') {
            this.backstate = true;
        }
        this.loadData();
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    //下拉刷新
    onPullDownRefresh() {
        this.loadData('refresh');
    },
    //加载更多
    onReachBottom() {
        this.loadData();
    },
    methods: {
        //加载商品 ，带下拉刷新和上滑加载
        async loadData(type = 'add', loading) {
            //没有更多直接返回
            if (type === 'add') {
                if (this.loadingType === 'nomore') {
                    return;
                }
                this.loadingType = 'loading';
            } else {
                this.loadingType = 'more';
            }
            if (type === 'refresh') {
                this.goodsList = [];
                this.lastid = '';
            }
            let data = {
                categoryId: this.id,
                type: this.condition,
                lid: this.lastid,
                pagesize: this.pagesize
            };
            this.$ajax.get('poster/getCategoryProductPage', data).then(res => {
                if (res.data.code == 0) {
                    let list = res.data.result.data;
                    //判断是否还有下一页，有是more  没有是nomore(测试数据判断大于20就没有了)
                    this.loadingType = list.length < this.pagesize ? 'nomore' : 'more';
                    if (list.length > 0) {
                        this.lastid = list[list.length - 1].id;
                        this.goodsList = this.goodsList.concat(list);
                    }
                    if (type === 'refresh') {
                        if (loading == 1) {
                            uni.hideLoading();
                        } else {
                            uni.stopPullDownRefresh();
                        }
                    }
                }
            });
        },
        navToDetailPage(id) {
            this.$jump.jumpMethod(id);
        },
        tabClick(index) {
            if (this.condition === index && index !== 3 && index !== 1) {
                return;
            }
            if (index === 3) {
                this.condition = this.condition === 3 ? 4 : 3;
            } else if (index === 1) {
                this.condition = this.condition === 1 ? 5 : 1;
                this.sort = this.condition === 1 ? 1 : 5;
            } else {
                this.condition = index;
            }
            uni.pageScrollTo({
                duration: 300,
                scrollTop: 0
            });

            this.loadData('refresh', 1);

            uni.showLoading({
                title: '正在加载'
            });
        },
        backnav() {
            uni.navigateBack();
        }
    }
};
</script>

<style lang="scss">
page,
.content {
    background: $page-color-base;
}

.price text {
    font-size: 24rpx;
}
.nav-head {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 44px;
    padding: 7px 3px;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    overflow: hidden;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    box-sizing: border-box;
    z-index: 999;
    -webkit-transition-property: all;
    transition-property: all;
    background-color: rgb(255, 255, 255);
    color: rgb(0, 0, 0);

    .nav-bd {
        position: absolute;
        left: 70px;
        right: 70px;
        min-width: 0;
        -webkit-user-select: auto;
        user-select: auto;
    }
    .uni-page-head__title {
        font-weight: 700;
        font-size: 16px;
        line-height: 30px;
        text-align: center;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 16px;
        opacity: 1;
    }
    image {
        width: 50rpx;
        height: 50rpx;
    }
}
.yticon {
    font-size: 52rpx;
}

.content {
    padding-top: 80rpx;
    &.x {
        padding-top: 84px;
    }
}

.search-box {
    width: 100%;
    background-color: rgb(242, 242, 242);
    padding: 15upx 2.5%;
    display: flex;
    justify-content: space-between;
}
.prompt {
    margin-bottom: 6rpx;
    text {
        display: inline-block;
        padding: 0 8px;
        font-size: 14px;
        margin-right: 10px;
        background: #f5f5f5;
        border-radius: 8px;
        color: #929292;
    }
}
.search-box .input-box {
    width: 85%;
    flex-shrink: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}

.search-box .search-btn {
    width: 12%;
    margin: 0 0 0 2%;
    display: flex;
    justify-content: center;
    align-items: center;

    image {
        width: 50rpx;
        height: 50rpx;
    }
}

.search-box .input-box > input {
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

.con {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 666;
    &.x {
        top: 44px;
    }
}

.navbar {
    display: flex;
    width: 100%;
    height: 40px;
    background: #fff;
    box-shadow: 0 2upx 10upx rgba(0, 0, 0, 0.06);
    z-index: 10;

    .nav-item {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        font-size: 30upx;
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
                width: 120upx;
                height: 0;
                border-bottom: 4upx solid $base-color;
            }
        }
    }

    .p-box {
        display: flex;
        flex-direction: column;

        .yticon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 30upx;
            height: 14upx;
            line-height: 1;
            margin-left: 4upx;
            font-size: 26upx;
            color: #888;

            &.active {
                color: $base-color;
            }
        }

        .xia {
            transform: scaleY(-1);
        }
    }

    .cate-item {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 80upx;
        position: relative;
        font-size: 44upx;

        &:after {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            border-left: 1px solid #ddd;
            width: 0;
            height: 36upx;
        }
    }
}

/* 分类 */
.cate-mask {
    position: fixed;
    left: 0;
    top: var(--window-top);
    bottom: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0);
    z-index: 667;
    transition: 0.3s;

    .cate-content {
        width: 630upx;
        height: 100%;
        background: #fff;
        float: right;
        transform: translateX(100%);
        transition: 0.3s;
    }

    &.none {
        display: none;
    }

    &.show {
        background: rgba(0, 0, 0, 0.4);

        .cate-content {
            transform: translateX(0);
        }
    }
}

.cate-mask-btn {
    display: flex;
    border-top: 1px solid #dddddd;

    .btn {
        flex-grow: 1;
        line-height: 100rpx;
        text-align: center;
        font-size: 32rpx;

        &.action {
            background: $base-color;
            color: #ffffff;
        }
    }
}

.cate-list {
    display: flex;
    flex-direction: column;
    height: calc(100% - 100rpx);

    .cate-item {
        display: flex;
        align-items: center;
        height: 90upx;
        padding-left: 30upx;
        font-size: 28upx;
        color: #555;
        position: relative;
    }

    .cate-item-lists {
        overflow: hidden;
        display: flex;
        flex-wrap: wrap;
        align-items: stretch;
        height: 76rpx;
        overflow: hidden;

        &.open {
            height: auto;
        }

        .cate-item-list {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 12rpx;
            border: 1px solid #dddddd;
            min-height: 68rpx;
            border-radius: 40rpx;
            font-size: 28rpx;
            width: 31%;
            margin: 1%;
            text-align: center;
            line-height: 1;

            &.active {
                border-color: $base-color;
            }
        }
    }

    .two {
        height: 64upx;
        color: #303133;
        font-size: 30upx;
        display: flex;
        align-items: center;

        .xjt {
            flex-grow: 1;
            background: url(../../static/xjt.png) no-repeat right center;
            height: 64upx;
            line-height: 64upx;
            color: #fa436a;
            margin-right: 30rpx;
            background-size: 38rpx 20rpx;
            text-align: right;
            padding-right: 50rpx;
        }

        &.open {
            .xjt {
                background: url(../../static/sjt.png) no-repeat right center;
                background-size: 38rpx 20rpx;
            }
        }
    }

    .active {
        color: $base-color;
    }
}

.screenlist {
    padding: 10px;

    .screenitem {
        display: flex;
        background: #fff;
        border-bottom: 1px solid #dddddd;
        padding: 20rpx;
        align-items: stretch;
        position: relative;

        .label {
            width: 80rpx;
            height: 80rpx;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 2;
        }

        .img {
            width: 40%;
            min-width: 40%;
            height: 300rpx;
        }

        .cons {
            width: 60%;
            min-width: 60%;
            padding: 10rpx;
            position: relative;
            display: flex;
            align-items: flex-end;

            .title {
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                position: absolute;
                top: 10rpx;
                left: 10rpx;
                right: 10rpx;
                font-size: 32rpx;
            }

            .pcice {
                font-size: 36rpx;
                color: $base-color;

                .pcices {
                    vertical-align: middle;
                }

                .tip {
                    font-size: 28rpx;
                    color: #c1c1c1;
                    margin-left: 10rpx;
                    vertical-align: middle;
                }

                .active {
                    border: 1px solid #ddd;
                    border-radius: 10rpx;
                    padding: 2rpx 6rpx;
                    margin-left: 10rpx;
                    font-size: 24rpx;
                    vertical-align: middle;
                }
            }

            .shoptitle {
                display: inline-block;
                padding: 0 10rpx;
                border-radius: 10rpx;
                background: $base-color;
                color: #fff;
                font-size: 28rpx;
                margin-right: 10rpx;
            }

            .fl {
                display: inline-block;
                max-width: 200rpx;
                overflow: hidden;
                font-size: 24rpx;
                line-height: 28rpx;
                vertical-align: middle;
            }

            .tipimg {
                display: inline-block;
                float: right;
                width: 30rpx;
                height: 30rpx;
                margin-top: 10rpx;
            }
        }
    }
}
.goods-list {
    background: #fff;
    .price-box {
        justify-content: inherit;
        .price{
            font-size: 40rpx;
            text{
                font-size: 24rpx;
            }
        }
        
        .xe {
            display: inline-block;
            border: 1px solid #ddd;
            border-radius: 30rpx;
            padding: 0 10rpx;
            margin-left: 5px;
            font-size: 24rpx;
            line-height: 32rpx;
            height: 32rpx;
        }
    }
    .image-wrapper {
        width: 100%;
        height: 330upx;
        border-radius: 3px;
        overflow: hidden;
        image {
            width: 100%;
            height: 330upx;
        }
    }
}
.goods-list .title{
    line-height:60rpx;
}
.goods-list .goods-item .item-con {
    padding:0 10rpx 10rpx 10rpx;
}
</style>
