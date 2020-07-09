<template>
	<view class="all">
		<!-- <view class="goodBlockRowTwo"> -->
		<view class="singleGood" @click="clickGoodDetail(productid)">
			<view class="l">
				<image class="goodImage" :src="getmainurl()" mode="scaleToFill"></image>
				<image class="activityimg" :src="actimgurl" mode="aspectFill"></image>
			</view>

			<view class="r">
				<!-- <view class="goodDes">{{goodDes}}</view> -->
				<view class="titlecontent" v-html="gettitle()"></view>
				<view class="goodPrice"><view :style="{display:'inline'}">原价： </view><view :style="{display:'inline','text-decoration': 'line-through'}">{{goodPrice}}</view></view>
				<view class="goodBottom">
					<view class="lf">
						<view class="value">
							<rich-text :nodes="getPrice"></rich-text>
						</view>
						<view class="endtext">平台补贴价</view>
					</view>
					<view class="rt">
						<!-- <view class="bottomtag" >{{bottomtag}}</view>
					<view class="goodOriginPrice">{{goodOriginPrice}}</view>
					<view class="save" v-if="couponvalue != ''">
						
						<view class="text">{{couponvalue}}</view>
					</view> -->
						<view class="rabtext">抢购</view>
						<image class="rightraw" src="../../../static/right_white.png" mode="scaleToFill"></image>
						
					</view>
				</view>
			</view>

		</view>
		<!-- </view> -->
	</view>
</template>

<script>
	export default {
		name: 'goodsItemTwo',
		props: {
			actimgurl: {
				type: String,
				default: ''
			},
			mainpic: {
				type: String,
				default: ''
			},
			tag: {
				type: String,
				default: ""
			},
			goodTitle: {
				type: String,
				default: ""
			},
			goodOriginPrice: {
				type: String,
				default: ""
			},
			goodPrice: {
				type: String,
				default: ""
			},
			productid: {
				type: String,
				default: ""
			},

		},
		data() {
			return {

			}

		},
		computed: {
			getPrice: function() {
				let b = this.goodOriginPrice.substr(0, 1);
				let e = this.goodOriginPrice.substr(1, this.goodOriginPrice.length - 1);
				return "<div style='color:#FF2734;font-size:5px;display:inline;font-weight:bold'>" + b +
					"</div><div  style='color:#FF2734;font-size:15px;display:inline;font-weight:bold'>" + e + "</div>"
			}
		},
		methods: {
			clickGoodDetail(e) {
				this.$emit("clickGoodDetail", e);
			},
			addToCart() {
				this.$emit("addToCart", {
					value: "11"
				});
			},
			gettitle() {
				if (this.isEmpty(this.tag)) {
					return "<view style='color: #333333;font-size: 14px;vertical-align: middle;font-weight: bold;margin: 0 2px; word-break: break-word; overflow: hidden;text-overflow: ellipsis;display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;'>" +
						this.goodTitle + "</view>"
				} else {
					return "<view style='color: #333333;font-size: 14px; vertical-align: middle; font-weight: bold;margin: 0 2px; word-break: break-word; overflow: hidden;text-overflow: ellipsis;display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;'><p style='color: #FFFFFF;font-size: 10px;border-radius: 0px;padding: 2px 6px 1px 6px;margin:0px 3px 0px 0; vertical-align: middle;line-height: 27px;background: linear-gradient(to right,#FF2736,#FF2736);display: inline;'>" +
						this.tag + "</p>" + this.goodTitle + "</view>"
				}
			},
			getmainurl() {
				let url = this.mainpic;
				if (url.indexOf("?") != -1) {
					return url.split('?')[0];
				} else {
					return url;
				}
			}
		}
	}
</script>

<style lang="scss">
	// 商品模块，一行两个
	.all {
		.singleGood {
			// padding-bottom: 10rpx;
			margin-bottom: 2rpx;
			background-color: #fff;
			// border-radius: 20rpx;
			overflow: hidden;
			width: 100%;
			display: flex;
			flex-direction: row;
			position: relative;
			justify-content: flex-start;

			.l {
				width: 350rpx;
				height: 100%;
				display: flex;
				flex-direction: row;
				position: relative;


				.goodImage {
					width: 230rpx;
					height: 230rpx;
					padding: 20rpx;
				}

				.activityimg {
					width: 90rpx;
					height: 90rpx;
					position: absolute;
					left: 0;
					top: 0px;
				}
			}


			.r {
				width: 100%;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				position: relative;
				padding: 10rpx 0;

				.titlecontent {
					display: flex;
					justify-content: start;
					align-items: center;
					margin: 5rpx 8rpx 3rpx 8rpx;

					.titletag {
						// color: #FFFFFF;
						// font-size: 18rpx;
						// border-radius: 30rpx;
						// // padding: 3rpx 6rpx;
						// line-height: 33rpx;
						// flex-wrap: wrap;
						// display: inline;
						// background: linear-gradient(to right, #EE3847, #FF6401);
					}

					.goodTitle {
						color: #333333;
						font-size: 30rpx;
						font-weight: bold;
						// margin: 0 10rpx;

						word-break: break-word; //换行模式
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
					}

				}


				.goodPrice {
					color: #929292;
					font-size: 26rpx;
					// font-weight: bold;
					margin: 40rpx 10rpx 0 10rpx;
					position: relative;
					// bottom: -10rpx;
				}

				.goodBottom {
					height: 60rpx;
					width: 90%;
					display: flex;
					align-items: center;
					margin: 5rpx 10rpx 10rpx 10rpx;
					border-radius: 50rpx;
					flex-direction: row;
					flex-wrap: wrap;


					.lf {
						background-color: #FFFAF8;
						height: 100%;
						width: 60%;
						border-radius: 60rpx 0 0 60rpx;
						display: flex;
						flex-direction: row;
						padding: 0 30rpx;


						.value {
							font-size: 24rpx;
							color: #FF2734;
							text-align: center;
							line-height: 60rpx;
							margin: 0 5rpx 0 0;
						}

						.endtext {
							font-size: 18rpx;
							color: #FF2734;
							line-height: 60rpx;
							text-align: end;
							max-lines: 1;
							overflow: hidden;
						}
					}

					.rt {
						background: linear-gradient(to right, #FE3613, #FF2637);
						border-radius: 0rpx 60rpx 60rpx 0rpx;
						height: 100%;
						width: 40%;
						display: flex;
						flex-direction: row;
						justify-content: center;
						align-items: center;

						.rabtext {
							font-size: 26rpx;
							color: #FFFFFF;
							margin-right: 10rpx;
						}

						.rightraw {
							width: 15rpx;
							height: 20rpx;
							margin-left: 10rpx;
						}

					}

				}
			}

		}

	}
</style>
