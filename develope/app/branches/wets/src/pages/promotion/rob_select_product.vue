<template>
	<view class="content">
		<view class="search-box">
			<view class="search-left" @click="returngo()"><uni-text class="yticon icon-zuo"></uni-text></view>
			<!-- 原样式 如果使用原样式，恢复下方注销代码 -->
			<view class="input-box"><input type="text" placeholder="搜索商品" v-model="keywords" placeholder-class="placeholder-class" confirm-type="search" /></view>
			<view class="search-btn" @tap="search()">搜索</view>
			<!-- 原样式 end -->
		</view>
        <view class="robtip" v-if="tip">
            {{tip}}
        </view>
		<view v-for="(product, index) in productlist" :key="index" class="commodity" @click="select(product)">
			<view><image class="img" :src="product.url" mode=""></image></view>
			<view class="commodity-con">
				<view class="title" v-html="product.name"></view>
                <view class="tip" v-html="product.attributeshow"></view>
				<view class="price" v-html="product.newprice"></view>
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
			companyid: 0,
			productlist: [],
			keywords: "",
			loadingType: 'more',
			lastid: "",
			pagesize: 10,
            tip: ''
		};
	},
	//下拉刷新
	onPullDownRefresh() {
		this.lastid = '';
		this.getProduct(0);
	},
	onReachBottom() {
		if (this.loadingType === 'noMore') {
			return;
		}
		let length = this.productlist.length;
		this.lastid = length > 0 ? this.productlist[length - 1].indexnum : 0;
		this.getProduct(1);
	},
	onLoad() {
		this.companyid = uni.getStorageSync("companyguid");
		this.getProduct(0);
        this.$ajax.get('sale/getbuylimittips', {cguid: this.companyid, type: 2}).then(res => {
        	console.log(res.data);
        	if (res.data.code == 0) {
        		let data = res.data.result.data;
        		this.tip = data.tips;
        	}
        });
	},
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
	methods: {
		search(){
			this.lastid = '';
			this.getProduct(0);
		},
		getProduct(load_type) {
			this.$ajax.get('sale/getcompanyskulist', {cguid: this.companyid, pagesize: this.pagesize, keyword: this.keywords, lastid: this.lastid}).then(res => {
				console.log(res.data);
				if (res.data.code == 0) {
					let data = res.data.result.data;
					if(load_type == 0){
						uni.stopPullDownRefresh();
						this.productlist = data;
					}else if(load_type == 1){
						this.productlist = this.productlist.concat(data);
					}
					this.loadingType = data.length == this.pagesize ? 'more' : 'noMore'
				} else {
					this.$api.msg('系统出错,请稍后再试');
				}
			});
		},
		select(product) {
			uni.$emit('rob_select_product', product);
			uni.navigateBack();
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
		margin-right: 20rpx;
	}

	.commodity-con {
		flex-grow: 1;
		padding: 20rpx 0;

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
			font-size: 28rpx;
			color: #dddddd;
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

.uni-swiper-item {
	height: auto;
}

/* load-more */
.uni-load-more {
	display: flex;
	flex-direction: row;
	height: 80upx;
	align-items: center;
	justify-content: center;
}

.uni-load-more__text {
	font-size: 28upx;
	color: #999;
}

.uni-load-more__img {
	height: 24px;
	width: 24px;
	margin-right: 10px;
}

.uni-load-more__img > view {
	position: absolute;
}

.uni-load-more__img > view view {
	width: 6px;
	height: 2px;
	border-top-left-radius: 1px;
	border-bottom-left-radius: 1px;
	background: #999;
	position: absolute;
	opacity: 0.2;
	transform-origin: 50%;
	animation: load 1.56s ease infinite;
}

.uni-load-more__img > view view:nth-child(1) {
	transform: rotate(90deg);
	top: 2px;
	left: 9px;
}

.uni-load-more__img > view view:nth-child(2) {
	transform: rotate(180deg);
	top: 11px;
	right: 0;
}

.uni-load-more__img > view view:nth-child(3) {
	transform: rotate(270deg);
	bottom: 2px;
	left: 9px;
}

.uni-load-more__img > view view:nth-child(4) {
	top: 11px;
	left: 0;
}
.robtip{
    font-size: 24rpx;
    padding: 20rpx $page-row-spacing;
    color: $base-color;
}
</style>
