<template>
	<view class="container">
		
	</view>
</template>

<script>
	import API from "@/store/api.js";
	
	export default {
		data() {
			return {
				dianDiJumpType: '',
				dianDiOrderNumber: '',
			}
		},
		onLoad(option) {
			this.dianDiJumpType = option.dianDiJumpType || ''
			this.dianDiOrderNumber = option.dianDiOrderNumber || ''
			
			uni.showLoading({
				title:"正在跳转..."
			})
			
			this.setTitle()
			
			// 向点滴关怀获取login_token
			this.loginToken()
		},
		onShow() {
			if (this.isapp()) {
				
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
			setTitle() {
				uni.setNavigationBarTitle({
					title: ''
				})
			},
			loginToken() {
				API.dianDiLoginToken({
					dianDiJumpType : this.dianDiJumpType || '',
					dianDiOrderNumber : this.dianDiOrderNumber || ''
				}).then(res => {
					console.log(res);
					let resData = res.data.result.data
					uni.hideLoading()
					
					if (res.data.code == -1) {
						uni.showModal({
							title: '提示',
							content: res.data.msg,
							showCancel: false
						})
						
						return
					} 
					
					// 跳转到点滴
					this.jumpToDianDi(resData.method_url,resData.login_url,resData.login_token)
				}).catch(err => {
					console.log(err);
					uni.hideLoading()
				})
			},
			jumpToDianDi(url,sUrl,token) {
				let _url = url+'?'+'surl='+sUrl+'&login_token='+token
				console.log(_url);
				window.location.href = _url
			}
		}
	}
</script>

<style lang="scss">
	.container {
		padding-top: 300rpx;
		text-align: center;
		color: #a5a9a9;
		font-size: 32rpx;
	}
</style>
