<template>
    <view class="content">
        <view class="search-box">
            <view class="search-left" @click="returngo"><uni-text class="yticon icon-zuo"></uni-text></view>
            <!-- 原样式 如果使用原样式，恢复下方注销代码 -->
            <view class="input-box">
                <input type="text" placeholder="搜索商品" v-model="keyword" @confirm="doSearch(false)" placeholder-class="placeholder-class" confirm-type="search" />
            </view>
            <view class="search-btn" @tap="doSearch(false)">搜索</view>
            <!-- 原样式 end -->
        </view>
        <!-- 订单列表 -->
        <view v-for="(item, index) in orderList" :key="index">
            <view class="commodity">
                <view><image class="img" :src="item.url" mode=""></image></view>
                <view class="commodity-con">
                    <!-- <view class="commodity-zk">{{item.url}}</view> -->
                    <view class="title">{{ item.name }}</view>
                    <view class="tip">
                        <view>销量:{{ item.sales }}</view>
                        <view>成交额:{{ item.amount }}</view>
                    </view>
                    <view class="tip">
                        <view>库存:{{ item.stock }}</view>
                        <view>添加日期:{{ item.creattime }}</view>
                    </view>
                    <view class="price">{{ item.price }}</view>
                    <view class="state">
                        <text @click="edit_product(item.id, index)">编辑</text>
                        <view v-if="item.state == 0 || item.state == 1"><text @click="lowerShelf(item.id, index)">下架</text></view>
                        <view v-if="item.state == 2"><text @click="upperShelf(item.id, index)">上架</text></view>

                        <!-- <text>分享</text> -->
                    </view>
                    
                    <text class="examine" v-if="item.state == 0"></text>
                    <text class="off-shelf" v-if="item.state == 2"></text>
                    <text class="sell-out" v-if="item.state == 3"></text>
                </view>
            </view>
        </view>

        <uni-load-more :status="loadingType"></uni-load-more>
    </view>
</template>

<script>
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import empty from '@/components/empty';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
export default {
    components: {
        uniLoadMore,
        empty,
        uniPopup
    },
    data() {
        return {
            cguid: '',
            tabCurrentIndex: 0,
            loadingType: 'more',
            orderList: [],
            lid: '',
            keyword: ''
        };
    },

    onLoad(options) {
        this.cguid = uni.getStorageSync('companyguid');
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    //下拉刷新
    onPullDownRefresh() {
        this.datalist('refresh');
    },
    //加载更多
    onReachBottom() {
        if (this.loadingType === 'noMore') {
            return;
        }
        this.datalist();
    },
    methods: {
        datalist(type) {
            let data = {
                pagesize: 10,
                lid: type == 'refresh' ? '' : this.lid,
                cguid: this.cguid,
                keyword: this.keyword
            };
            this.$ajax.get('shopproduct/productsearch', data).then(res => {
                console.log(res);
                if (res.data.code == 0) {
                    let data = res.data.result.data;
                    if (data.length > 0) {
                        this.orderList = type == 'refresh' ? data : this.orderList.concat(data);
                        this.lid = data[data.length - 1].id;
                    }
                    this.loadingType = data.length == 10 ? 'more' : 'noMore';
                    if (type == 'refresh') uni.stopPullDownRefresh();
                }
            });
        },

        // 搜索
        doSearch() {
            this.datalist('refresh');
        },
        //编辑
        edit_product(pid, index) {
            uni.navigateTo({
                url: '/pages/establishment/productcontemplate?editPid=' + pid + '&index=' + index + '&type=search'
            });
        },
        //下架
        lowerShelf(pid, index) {
            let data = {
                pid: pid,
                cguid: this.cguid
            };
            this.$ajax.get('shopproduct/offShelvesProduct', data).then(res => {
                console.log(res);
                if (res.data.code == 0) {
                    this.$api.msg('下架成功');
                    this.orderList[index].state = 2;
                } else {
                    this.$api.msg(res.data.msg);
                }
            });
        },
        //上架
        upperShelf(pid, index) {
            let data = {
                pid: pid,
                cguid: this.cguid
            };
            this.$ajax.get('shopproduct/onShelvesProduct', data).then(res => {
                console.log(res);
                if (res.data.code == 0) {
                    this.$api.msg('上架成功');
                    this.orderList[index].state = 1;
                }
            });
        },
        returngo(){
            uni.navigateBack();
        },
    }
};
</script>

<style lang="scss">
.yticon{
    font-size: 52rpx;
}
.search-box {
    width: 100%;
    background-color: rgb(242, 242, 242);
    padding: 15upx 2.5%;
    display: flex;
    justify-content: space-between;
}

.search-box .input-box {
    width: 85%;
    flex-shrink: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}

.search-box .search-btn {
    width: 15%;
    margin: 0 0 0 2%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    font-size: 28upx;
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
.commodity {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #ffffff;
    padding: 20rpx 30rpx;
    border-bottom: 1px solid #dddddd;
    margin-bottom: 20rpx;

    .img {
        width: 100rpx;
        height: 100rpx;
    }

    .commodity-con {
        flex-grow: 1;
        padding: 20rpx;
        position: relative;
        .off-shelf{
            position: absolute;
            top: 20rpx;
            right: 60rpx;
            z-index: 3;
            width: 120rpx;
            height: 120rpx;
            background: url(../../static/off-shelf.png) no-repeat center;
            background-size: 100% 100%;
        }
        .sell-out{
            position: absolute;
            top: 20rpx;
            right: 60rpx;
            z-index: 3;
            width: 120rpx;
            height: 120rpx;
            background: url(../../static/sell-out.png) no-repeat center;
            background-size: 100% 100%;
        }
        .examine{
            position: absolute;
            top: 20rpx;
            right: 60rpx;
            z-index: 3;
            width: 120rpx;
            height: 120rpx;
            background: url(../../static/examine.png) no-repeat center;
            background-size: 100% 100%;
        }
        .commodity-zk {
            position: absolute;
            top: 40rpx;
            right: 40rpx;
        }

        .title {
            font-size: 30rpx;
            margin-bottom: 10rpx;
        }

        .tip {
            display: flex;
            justify-content: center;
            font-size: 28rpx;
            color: #dddddd;

            view {
                width: 50%;
            }
        }

        .price {
            color: $base-color;
            margin-top: 10rpx;
        }

        .state {
            overflow: hidden;

            text {
                float: right;
                padding: 4rpx 20rpx;
                border: 1px solid #dddddd;
                border-radius: 20rpx;
                margin-left: 20rpx;
                font-size: 24rpx;
            }
        }
    }
}
</style>
