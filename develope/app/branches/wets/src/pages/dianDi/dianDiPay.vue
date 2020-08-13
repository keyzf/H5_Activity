<template>
	<view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderNumber:''
			}
		},
		onLoad(option) {
			this.orderNumber = option.orderNumber || ''
			if (this.isapp()) {
				this.$util.mcallHandler('CallNative', {
					key: 'dianDiPay',
					orderNumber: this.orderNumber,
				}, function(responseData) {});
			}else{
        uni.redirectTo({
          url:'/pages/money/pay?ordernum='+option.orderNumber+'&type=1'
        })
      }
		},
		methods: {
			isapp() {
				var ua = window.navigator.userAgent.toLowerCase();
				if (ua.match(/holdmall/i) == 'holdmall') {
					return true;
				} else {
					return false;	
				}
			},
		}
	}
</script>

<style>

</style>
