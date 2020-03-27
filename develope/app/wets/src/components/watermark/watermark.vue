<template>
	<view>
		<view class="copyRightBox">
			<view class="font" ref='sy' v-for="(item,index) in 20" :key='index'>
				{{sytext}}
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {};
		},
		props: {
			//载入的标签数据
			sytext: String
		},
		mounted() {}
	}
</script>
<style>
	.copyRightBox {
		overflow: hidden;
		width: 100%;
        height: 100%;
        background: #FFFFFF;
	}
	.font {
		float: left;
		transform: rotate(-30deg);
		margin-top: 120upx;
		margin-left: 80upx;
		font-size: 28upx;
		color: rgba(100, 0, 0, 0.2);
	}
</style>
