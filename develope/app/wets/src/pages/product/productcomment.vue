<template>
	<view>
		<view class="comment">
			<view class="x">全部</view>
			<view>好评</view>
			<view>中评</view>
			<view>差评</view>
		</view>
		<view class="row comment-item">
			<view class="comment-ren-img">
				<image src="../../static/missing-face.png" mode=""></image>
			</view>
			<view class="comment-nr">
				<view class="row">
					<view class="comment-ren">
						<view class="comment-ren-title">yayay得v空</view>
						<view class="comment-ren-number">
							<sunui-star :defaultStar="starConfig.defaultStar" :maxStar="starConfig.maxStar" :starSize='starConfig.starSize'
							 :isTips="starConfig.isTips" :type="starConfig.type" @changeStar="changeStar" class='sunui-star'></sunui-star>
						</view>
					</view>
					<view class="comment-ren-time">
						19-2-22 16:32
					</view>
				</view>
				<view class="comment-ren-con">
					此用户没有填写评论
				</view>
				<view class="comment-ren-gm">规格</view>
				<view class="comment-ren-gmsj">购买日期: 19-04-05</view>
			</view>
		</view>
		<view class="row comment-item">
			<view class="comment-ren-img">
				<image src="../../static/missing-face.png" mode=""></image>
			</view>
			<view class="comment-nr">
				<view class="row">
					<view class="comment-ren">
						<view class="comment-ren-title">yayay得v空</view>
						<view class="comment-ren-number">
							<sunui-star :defaultStar="starConfig.defaultStar" :maxStar="starConfig.maxStar" :starSize='starConfig.starSize'
							 :isTips="starConfig.isTips" :type="starConfig.type" @changeStar="changeStar" class='sunui-star'></sunui-star>
						</view>
					</view>
					<view class="comment-ren-time">
						19-2-22 16:32
					</view>
				</view>
				<view class="comment-ren-con">
					此用户没有填写评论
				</view>
				<view class="comment-ren-gm">规格</view>
				<view class="comment-ren-gmsj">购买日期: 19-04-05</view>
			</view>
		</view>

	</view>
</template>
<script>
	import sunuiStar from '@/components/sunui-star/sunui-star.vue';
	export default {
		components: {
			sunuiStar
		},
		data() {
			return {
				starConfig: {
					defaultStar: 2,
					maxStar: 5,
					starSize: '1.2em',
					isTips: true,
					type: 'love'
				}
			};
		},
        onBackPress(){
            this.$api.ovPage()
        },
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
        },
		methods: {}
	};
</script>
<style lang="scss" scoped>
	.comment {
		display: flex;
		justify-content: space-around;
		border-top: 1px solid #dddddd;
		padding: 20rpx 30rpx;
		view {
			border: 1px solid #dddddd;
			padding: 4rpx 26rpx;
			border-radius: 60rpx;
			font-size: 28rpx;

			&.x {
				color: #FA436A;
				border-color: #FA436A;
			}
		}
	}

	.row {
		display: flex;
	}
	.comment-item {
		padding: 20rpx 30rpx;
		border-bottom: 1px solid #dddddd;
		.comment-ren-img {
			uni-image {
				width: 80rpx;
				height: 80rpx;
			}
		}
		.comment-nr {
			flex-grow: 1;
				padding-left: 10rpx;
			.comment-ren {
				font-size: 28rpx;
				flex-grow: 1;
				.sunui-stars {
					justify-content: inherit;
					/deep/ .sunui-m {
						justify-content: inherit;
					}
				}
			}

			.comment-ren-time {
				font-size: 24rpx;
				color: #DADADA;
			}

			.comment-ren-con {
				font-size: 26rpx;
			}

			.comment-ren-gm,
			.comment-ren-gmsj {
				font-size: 24rpx;
				color: #DADADA;
			}
		}
	}
</style>
