<!-- 分销subtab页的商品item -->
<template>
	<view class="all" @click="clickGoodDetail">
		<!-- <image class="stata" src="http://highmall.holdsoft.cn/294/1509794071235275510_4102560_pic500_1110.jpg" mode="aspectFill"></image> -->
		<image class="img" :src="item.picInfo.url" mode="aspectFill"></image>
		<view class="main">
			<view class="title" v-html="gettitle()"></view>
			<view class="tip">{{item.attributeshow}}</view>

			<view class="activity">
				<view class="share">
					<view>{{item.rebate_flag}}</view>
					<view>{{item.rebate}}</view>
				</view>
				<view class="save" v-if="item.coupon_value">
					<view>{{item.coupon_label}}</view>
					<view>{{item.coupon_value}}</view>
				</view>
			</view>

			<view class="price">
				<text class="new">{{item.newprice}}</text>
				<!-- <text class="old"><text>￥</text>1215</text> -->
			</view>
			<view class="store">
				<view class="type">{{item.label}}</view>
				<view class="name">{{item.companyname}}</view>
			</view>
			<!-- <view class="buy">
				<image src="http://highmall.holdsoft.cn/294/1509794071235275510_4102560_pic500_1110.jpg" mode="aspectFill"></image>
			</view> -->
		</view>
		<!-- <image class="img" src="http://highmall.holdsoft.cn/294/1509794071235275510_4102560_pic500_1110.jpg" mode="aspectFill"></image> -->
	</view>
</template>

<script>
	export default {
		props: {
			item: { //猜你喜欢
				type: Object,
				default () {
					return {}
				}
			},
		},
		data() {
			return {

			}
		},
		methods: {
			clickGoodDetail(e) {
				this.$emit("clickGoodDetail", e);
			},
			gettitle() {
				if (this.isEmpty(this.item.distributionTitle)) {
					return "<view style='color: #333333;font-size: 14px;vertical-align: middle;font-weight: bold;margin: 0 2px; word-break: break-word; overflow: hidden;text-overflow: ellipsis;display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;'>" +this.item.productname + "</view>"
				} else {
					return "<view style='color: #333333;font-size: 14px; vertical-align: middle; font-weight: bold;margin: 0 2px; word-break: break-word; overflow: hidden;text-overflow: ellipsis;display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;'><p style='color: #FFFFFF;font-size: 10px;border-radius: 6px;padding: 2px 6px 1px 6px;margin:0px 3px 0px 0; vertical-align: middle;line-height: 27px;background: linear-gradient(to right,#FC622A,#FC622A);display: inline;'>" +this.item.distributionTitle + "</p>" + this.item.productname + "</view>"
				}
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f5f5f5;
	}

	.all {
		// .item {
		width: 750rpx;
		margin-top: 2rpx;
		background: #FFF;
		padding: 20rpx;
		display: flex;
		flex-direction: row;
		// position: relative;

		.stata {
			position: absolute;
			width: 60rpx;
			height: 60rpx;
			left: 20rpx;
			top: 20rpx;
			z-index: 1;
		}

		.img {
			width: 280rpx;
			min-width: 280rpx;
			height: 280rpx;
		}

		.main {
			// padding-left: 10rpx;
			padding: 20rpx 10rpx 20rpx 10rpx;
			display: flex;
			flex: 1;
			flex-direction: column;
			position: relative;
			align-content: space-between;
			justify-content: space-between;

			.activity {
				display: flex;
				flex-direction: row;
				font-size: 24rpx;
				color: #ffffff;
				// background-color: #4399FC;

				.share {

					width: 130rpx;
					height: 40rpx;
					display: flex;
					flex-direction: row;
					line-height: 40rpx;
					justify-content: space-between;
					padding: 3rpx 10rpx 3rpx 6rpx;
					background-image: url(../../../static/fenXiao/bg_coupon_purple.png);
					background-repeat: no-repeat;
					-webkit-background-size: 70px 60rpx;

				}

				.save {
					width: 130rpx;
					height: 40rpx;
					line-height: 40rpx;
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					margin: 0 0 0 10rpx;
					padding: 3rpx 10rpx 3rpx 6rpx;
					background-image: url(../../../static/fenXiao/bg_coupon.png);
					background-repeat: no-repeat
				}


			}

			.title {
				font-size: 30rpx;
				line-height: 36rpx;
				color: #333;
				font-weight: 700;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				word-wrap: break-word;
				// max-height: 120rpx;
				word-break: break-all;
				// background-color: #4CD964;
			}

			.tip {
				font-size: 24rpx;
				line-height: 30rpx;
				color: #969696;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				word-wrap: break-word;
				max-height: 120rpx;
				word-break: break-all;
				// background-color:#EE3847;
			}

			.tips {
				display: inline-block;
				padding: 0 16rpx;
				font-size: 24rpx;
				margin-right: 20rpx;
				// background: #0081FF;
				border-radius: 20rpx;
				color: #FFF;
				line-height: 40rpx;
				height: 40rpx;
				// background-color: #4CD964;
			}

			.price {
				display: flex;
				align-items: center;
				margin-top: 6rpx;
				// background-color: #F0AD4E;

				.new {
					font-size: 40rpx;
					color: #EE3847;

					text {
						font-size: 30rpx;
					}
				}

				.old {
					padding-left: 10rpx;
					font-size: 24rpx;
					color: #929292;
					flex: 1;
					text-decoration: line-through;
				}

			}

			.store {
				display: flex;
				flex-direction: row;
				font-size: 24rpx;

				.type {
					background-color: rgba(252, 98, 42, 1);
					border-radius: 10rpx;
					padding: 0rpx 10rpx;
					color: #ffffff;
				}

				.name {
					margin: 0 10rpx;
					color: rgba(146, 146, 146, 1);

				}
			}

			.buy {
				position: absolute;
				right: 0rpx;
				bottom: 0rpx;
				font-size: 0;

				image {
					width: 60rpx;
					height: 60rpx;
				}
			}

		}

		&.x {
			.main {
				padding-left: 0;
				padding-right: 16rpx;
			}

			.stata {
				right: 320rpx;
				left: auto;
			}

			.buy {
				right: 16rpx;
			}
		}

		// }
	}
</style>
