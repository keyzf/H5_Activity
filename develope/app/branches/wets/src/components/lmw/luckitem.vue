<template>
	<view class="all">
		<view class="singleGood" @click="clickitem('')">
			<view class="title">{{title}}</view>
			<view class="subtitle">{{subtitle}}</view>
			<view class="button">{{button}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'luckitem',
		props: {
			title: {
				type: String,
				default: ""
			},
			subtitle: {
				type: String,
				default: ""
			},
			button: {
				type: String,
				default: "选我"
			}
		},
		methods: {
			clickitem() {
				this.$emit("clickluckitem", {
					value: "1211"
				});
			},
		}
	}
</script>

<style lang="scss">
	// 商品模块，一行两个
	.all {

		.singleGood {
			padding-bottom: 10rpx;
			margin-bottom: 20rpx;
			background-color: #F5F5F5;
			border: 1rpx solid #DDd;
			display: flex;
			flex-direction: column;
			align-items: center;
			overflow: hidden;
			width: 100%;

			.title {
				color: #333333;
				font-size: 24rpx;
				height: 60rpx;
				margin: 15rpx 5rpx 0 5rpx;
				word-break: break-word; //换行模式
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}
			
			.subtitle {
				color: #333333;
				font-size: 24rpx;
				margin: 0 5rpx;
			
				word-break: break-word; //换行模式
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}
			.button{
				
				text-align: center;
				font-size: 20rpx;
				margin: 15rpx 0 15rpx 0;
				padding: 5rpx 15rpx;
				border-radius: 25rpx;
				color: #FFFFFF;
				background-image: linear-gradient(to right,#EE3847,#EE5A38);
			}

		}

	}
</style>
