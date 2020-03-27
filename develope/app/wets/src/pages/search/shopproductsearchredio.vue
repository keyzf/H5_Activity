<template>
	<view class="content">
		<view class="search-box">
			<view class="search-left" @tap="returngo()"><uni-text class="yticon icon-zuo"></uni-text></view>
			<!-- 原样式 如果使用原样式，恢复下方注销代码 -->
			<view class="input-box"><input type="text" placeholder="搜索商品" v-model="keywords" placeholder-class="placeholder-class" confirm-type="search" /></view>
			<view class="search-btn" @tap="getShopproductsByCguid(0)">搜索</view>
			<!-- 原样式 end -->
		</view>
		<view class="search-keyword">
			<label class="commodity" v-for="(item, index) in shopproducts" :key="index" @click="selected(item)">
				<view><image class="img" :src="item.url || ''" mode=""></image></view>
				<view class="commodity-con">
					<view class="title">{{ item.name }}</view>
					<view class="price">￥{{ item.newprice }}</view>
				</view>
			</label>
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
			loadingType: 'more',
			defaultKeyword: '',
			cguid: '',
			pagesize: 10,
			lastid: '',
			keywords: '',
			shopproducts: [],
			index: ''
		};
	},
	onLoad(options) {
		this.index = options.index || '';
		this.cguid = uni.getStorageSync('companyguid');
		this.getShopproductsByCguid(0);
	},
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
	methods: {
		//下拉刷新
		onPullDownRefresh() {
			this.lastid = '';
			this.getShopproductsByCguid(0);
		},
		//加载更多
		onReachBottom() {
			if (this.loadingType === 'noMore') {
				return;
			}
			this.lastid = this.shopproducts[this.shopproducts.length - 1].skuid;
			this.getShopproductsByCguid(1);
		},
		// 获取店铺下的商品列表
		getShopproductsByCguid(is) {
			this.$ajax.get('sale/selectlargessskuid', {cguid: this.cguid, pagesize: this.pagesize, lastid: this.lastid, keywords: this.keywords}).then(res => {
				console.log(res);
				if (res.data.code == 0) {
					let data = res.data.result.data;
					if(is == 0){
						uni.stopPullDownRefresh();
						this.shopproducts = data;
					}else if(is == 1){
						this.shopproducts = this.shopproducts.concat(data);
					}
					this.loadingType = data.length == this.pagesize ? 'more' : 'noMore';
				} else {
					this.$api.msg('商品列表获取失败');
				}
			});
		},
		// 选择商品
		selected(obj) {
			let data = {
				index: this.index,
				id: obj.skuid,
				name: obj.name
			};
			this.$api.prePage().editGiveData(data);
			uni.navigateBack();
		},
		// 查询
		doSearch(obj) {
		
		},
		returngo() {
			uni.navigateBack();
		}
	}
};
</script>
<style lang="scss">
page {
	background: $page-color-base;
}
.content {
	border-top: 1px solid #dddddd;
	padding-bottom: 100rpx;
}
.search-box {
	width: 100%;
	background-color: #FFF;
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
	margin-left: 20rpx;
}

.search-box .search-btn {
	width: 15%;
	margin: 0 0 0 2%;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-shrink: 0;
	font-size: 32upx;
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
	background-color: #f5f5f5;
	background:url(../../static/search.png) no-repeat left 10rpx center rgb(249, 249, 249);
	background-size: 30rpx 30rpx;
	padding-left: 60rpx;
}

.placeholder-class {
	color: #9e9e9e;
}

.search-left {
	.yticon {
		font-size: 48rpx;
	}
}
.commodity {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	background: #ffffff;
	padding: 20rpx 30rpx;
	border-bottom: 1px solid #dddddd;
	.img {
		width: 100rpx;
		height: 100rpx;
	}
	.commodity-con {
		flex-grow: 1;
		padding: 20rpx;
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
