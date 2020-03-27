<template>
    <view>
        <view class="search-box" @click="search"><input type="text" placeholder="搜索" /></view>
        <view class="shoplist">
            <view class="shopitem" v-for="(item, index) in shopList" :key="index" @click="navToShop(item.companyguid)">
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
            shopList: [],
            loadingType: 'more',
            pagesize: 10,
            lid: ''
        };
    },
    onLoad() {
        this.load('res');
    },
    onReachBottom() {
        this.load('more')
    },
    methods: {
        load(type) {
            if (this.loadingType == 'loading' || this.loadingType == 'nomore') {
                return;
            }
            this.loadingType = 'loading';
            if (type == 'res') {
                this.lid = '';
                this.shopList = [];
            } else {
                this.lid = this.shopList[this.shopList.length - 1].id;
            }
            let data={
                pagesize:this.pagesize,
                lid:this.lid
            }
            this.$ajax.get('com/getAttentionCompanyPage', data).then(res => {
                if (res.data.code == 0) {
                    this.shopList =  this.shopList.concat(res.data.result.data);
                    this.loadingType = res.data.result.data.length < this.pagesize ? 'nomore' : 'more';
                } else {
                    this.$api.msg('系统出错,请稍后再试');
                }
            });
        },
        navToShop(id) {
            uni.navigateTo({
                url: '/pages/product/shop?cguid=' + id
            });
        },
        search() {
        	uni.navigateTo({
        		url: '/pages/search/search?cut=1'
        	});
        },
    }
};
</script>

<style lang="scss">
page {
    background: $page-color-base;
}
.search-box {
	width: 100%;
	background-color: #ffffff;
	padding: 15rpx 30rpx;

	input {
		width: 100%;
		font-size: 24rpx;
		border: 0;
		border-radius: 30rpx;
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		padding: 20rpx 3%;
		background:url(../../static/search.png) no-repeat left 10rpx center rgb(249, 249, 249);
        background-size: 30rpx 30rpx;
        padding-left: 60rpx;
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
