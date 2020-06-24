<template>
	<view class="content">
		<image class="empty-image"  :src="emptyimage"></image>
		<view class="empty-text">{{emptytext}}</view>
	</view>

</template>

<script>
	export default {

		props: {
			emptytext: {
				type: String,
				default () {
					return "暂无数据";
				}

			},
			emptyimage: {
				type: String,
				default () {
					return "";
				}
			}
		}
	}
</script>

<style lang="scss">
	
	.content{
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		
		.empty-image{
			
			width: 40%;
			height: 40%;
		}
		
		.empty-text{
			font-size: 30rpx;
			color: #929292;
		}
	}

</style>
