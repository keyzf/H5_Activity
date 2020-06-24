<template>
	<view class="content">
		<view v-for="(product, index) in productlist" :key="index" class="commodity" @click="select(product)">
			<view><image class="img" :src="product.url" mode=""></image></view>
			<view class="commodity-con">
				<view class="title" v-html="product.name"></view>
				<view class="tip">
					<view v-html="product.pricerange"></view>
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
			companyid: 0,
			productlist: [],
			loadingType: 'more',
			pagesize: 10
		};
	},
	onReachBottom() {
		// 获取优惠券列表
		let length = this.productlist.length;
		let lastId = length > 0 ? this.productlist[length - 1].id : 0;
		this.getProduct(lastId);
	},
    onBackPress(){
        this.$api.ovPage()
    },
	onLoad() {
		this.companyid = uni.getStorageSync("companyguid");
		this.getProduct(0);
	},
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
	methods: {
		getProduct(lastid) {
			this.$ajax.get('sale/selectsaleactivityinfo', {cguid: this.companyid, pagesize: this.pagesize, lastid: lastid}).then(res => {
				console.log(res.data);
				if (res.data.code == 0) {
					let data = res.data.result.data;
					this.productlist = this.productlist.concat(data);
					this.loadingType = data.length == this.pagesize ? 'more' : 'noMore'
				} else {
					this.$api.msg('系统出错,请稍后再试');
				}
			});
		},
		select(product) {
			uni.$emit('selectProduct', product);
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
</style>
