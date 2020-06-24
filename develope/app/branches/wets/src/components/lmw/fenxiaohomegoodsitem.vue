<template>
	<view class="all">
		<!-- <view class="goodBlockRowTwo"> -->
		<view class="singleGood" @click="clickGoodDetail(productid)">
			<image class="goodImage" :src="getmainurl()" mode="scaleToFill"></image>
			<image class="activityimg" :src="actimgurl" mode="aspectFill"></image>
			<view class="goodDes">{{goodDes}}</view>
			<view class="titlecontent" v-html="gettitle()"></view>
			<view class="goodPrice">{{goodPrice}}</view>
			<view class="goodBottom">

				<!-- <view class="bottomtag" v-for="(item,index) in bottomtag" :key="index"> -->
					<view  class="bottomtag" :style="{color:'#FC622A',border: '1rpx solid #FC622A','border-radius': '20rpx',padding:'1rpx 6rpx'}">{{bottomtag}}</view>
				<!-- </view> -->
				<view class="goodOriginPrice">{{goodOriginPrice}}</view>
				<view class="save" v-if="couponvalue != ''">
					<view class="value"><rich-text :nodes="getPrice"></rich-text></view>
					<view class="text">{{couponvalue}}</view>
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
			// mainpic: {
			// 	type: String,
			// 	default: 'http://highmall.holdsoft.cn/472/15113349335981.jpg'
			// },
			actimgurl: {
				type: String,
				default: ''
			},
			mainpic: {
				type: String,
				default: ''
			},
			goodDes: {
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
			bottomtag: {
				type: String,
				default: ""
			},
			productid: {
				type: String,
				default: ""
			},
			couponvalue: {
				type: String,
				default: ""
			},
			coupontext: {
				type: String,
				default: ""
			},

		},
		data() {
			return {

			}

		},
		computed: {
			getPrice() {
				let b = this.coupontext.substr(0, 1);
				let e = this.coupontext.substr(1, this.coupontext.length - 1);
				return "<div style='color:#ffffff;font-size:5px;display:inline;'>" + b +
					"</div><div  style='color:#ffffff;font-size:10px;display:inline;'>" + e + "</div>"
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
					return "<view style='color: #333333;font-size: 14px; vertical-align: middle; font-weight: bold;margin: 0 2px; word-break: break-word; overflow: hidden;text-overflow: ellipsis;display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;'><p style='color: #FFFFFF;font-size: 10px;border-radius: 6px;padding: 2px 6px 1px 6px;margin:0px 3px 0px 0; vertical-align: middle;line-height: 27px;background: linear-gradient(to right,#EE3847,#FF6401);display: inline;'>" +
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
			padding-bottom: 10rpx;
			margin-bottom: 20rpx;
			background-color: #fff;
			border-radius: 20rpx;
			overflow: hidden;
			width: 100%;
			display: flex;
			flex-direction: column;
			position: relative;

			.goodImage {
				width: 100%;
				height: 360rpx;
			}

			.activityimg {
				width: 90rpx;
				height: 90rpx;
				position: absolute;
				left: 0;
				top: 0px;
			}

			.goodDes {
				color: #9F8D58;
				font-size: 28rpx;
				background-color: #F0ECE1;
				padding: 0 10rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

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
				color: #EE3847;
				font-size: 30rpx;
				font-weight: bold;
				margin: 0 10rpx;
			}

			.goodBottom {
				display: flex;
				align-items: center;
				margin: 5rpx 10rpx 10rpx 10rpx;
				flex-direction: row;
				flex-wrap: wrap;

				.bottomtag {
					color: #EE3847;
					font-size: 18rpx;
					margin: 2rpx 5rpx;
				}

				.goodOriginPrice {
					// text-decoration: line-through;
					color: rgba(252, 98, 42, 1);
					font-size: 24rpx;
				}

				.save {
					width: 120rpx;
					height: 40rpx;
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					// font-size: 24rpx;
					color: #ffffff;
					margin: 0 0 0 10rpx;
					padding: 3rpx 10rpx;
					background-image: url(../../static/fenXiao/bg_coupon.png);
					background-repeat:no-repeat ;
					
					.value{
						font-size: 24rpx;
					}
					
					.text {
						font-size: 24rpx;
					}

				}
			}
		}

	}
</style>
