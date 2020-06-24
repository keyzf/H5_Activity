<template>
	<view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
        },
		methods: {
			
		}
	}
</script>

<style>

</style>
