<!-- 兑换优惠券 -->
<template>
	<view class="all">
		<view class="codes">
			<input class="input" maxlength="20" v-model="couponcode" placeholder="请输入优惠券码"> </input>
			<image @click="scan" src="../../static/moneydetail/scan.png"></image>
		</view>
<view class="connection">
		<view class="connectionbt" @click="commit">确定</view>
		</view>
	</view>
</template>

<script>
	import API from "@/store/api.js";
	
	export default {
		data() {
			return {
				couponcode: ''
			}
		},
		onLoad() {
			this.regiserh();//注册handler
		},
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
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
			regiserh(){
				let that = this;
        if(this.isapp()){
          that.registerHandler("SCANRESULT",function(data, responseCallback) {
          	var dirs = {};
            switch (uni.getSystemInfoSync().platform) {
              case 'android':
                dirs = JSON.parse(data);
                break;
              case 'ios':
                dirs = data;
                break;
              default:
                console.log('运行在开发者工具上')
                break;
            }
            that.couponcode = dirs.scanStr;
          });
        }
			},
			commit(){
				if(this.checkData()){
					this.exchange();
				}
			},
			scan(){
        var _this = this;
        if(this.isapp()){
          this.callHandler('CallNative',{
          	'key': 'scan'
          })
        }else{
          if (this.$wx.isWechat()) {
            this.$wx.scanQRCodescan().then(res => {
              alert(res)
            });
          }
        }
			},
			checkData(){
				if(this.isEmpty(this.couponcode)){
					uni.showToast({
						title:'请输入优惠券码',
						icon:'none'
					})
					return false;
				}else{
					return true;
				}
			},
			exchange(){
				API.exchangeCoupon({
					exchangeCode:this.couponcode,
				}).then(res => {
					console.log(res);
					if (res.data.code == -1) {
						uni.showModal({
							title: '提示',
							content: res.data.msg,
							showCancel:false
						})
					} else {
						// 兑换成功
						uni.showToast({
							title:res.data.msg
						})
						setTimeout(()=>{
							uni.navigateBack();
						},500);
						
					}
				}).catch(err => {
					console.log(err);
				})
				
			}

		}
	}
</script>

<style lang="scss">
	
	page{
		background: #FFFFFF;
	}
	
	.all {
		
		display: flex;
		flex-direction: column;
		align-items: center;
		background: #FFFFFF;
		
		.codes{
			width: 70%;
			height: 80rpx;
			border: 1rpx solid #ddd;
			margin-top: 280rpx;
			border-radius: 80rpx;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			
			image{
				width: 50rpx;
				height: 50rpx;
				margin: 0 30rpx 0 30rpx;
				
			}
			
			.input{
				width: 70%;
				margin: 0 0 0 30rpx;
			}
		}
		
		.connection{
			
			width: 100%;
			display: flex;
			justify-content: center;
			margin-top: 60rpx;
			background: #FFFFFF;
			padding: 10rpx 0 50rpx;
			
			.connectionbt{
				
				width: 70%;
				height: 70rpx;
				font-size: 32rpx;
				color: #FFFFFF;
				border-radius: 70rpx;
				text-align: center;
				line-height: 70rpx;
				background: linear-gradient(to right,#EE3847,#FF6401);
			}
			
		}
		
	}
</style>
