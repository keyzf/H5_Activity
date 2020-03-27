<template>
	<view class="app">
		<view class="price-box">
			<text>支付金额</text>
			<text class="price">{{ price }}</text>
		</view>

		<!-- <view class="pay-type-list"> -->
			<!-- <view class="type-item b-b" @click="changePayType(1)">
				<text class="icon yticon icon-weixinzhifu"></text>
				<view class="con">
					<text class="tit">微信支付</text>
					<text>推荐使用微信支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType == 1' />
					</radio>
				</label>
			</view> -->
			<!-- <view class="type-item b-b" @click="changePayType(2)">
				<text class="icon yticon icon-alipay"></text>
				<view class="con">
					<text class="tit">支付宝支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType == 2' />
					</radio>
				</label>
			</view>
			<view class="type-item" @click="changePayType(3)">
				<text class="icon yticon icon-erjiye-yucunkuan"></text>
				<view class="con">
					<text class="tit">预存款支付</text>
					<text>可用余额 ¥198.5</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType == 3' />
					</radio>
				</label>
			</view> -->
		<!-- </view> -->
		
		<text class="mix-btn" @click="pay">确认支付</text>
	</view>
</template>

<script>

	export default {
		data() {
			return {
				payType: 1,
				ordernum: 20190926174462,
				price: 0.00
			};
		},
		onLoad(options) {
            this.type = options.type;
			this.ordernum = options.ordernum;
			this.price = options.price;
		},
        onBackPress(){
            this.$api.ovPage()
        },
        onShow() {
            // 初始化微信配置
            if (this.$wx.isWechat()) this.$wx.share();
        },
		methods: {
			pay() {
				// 初始化成功
				if (this.$wx.isWechat()) {
                    uni.showLoading({
                        title: '加载中...'
                    })
					// 获取支付需要的config
					this.$ajax.get('com/getcompanywxgzhsign', {ordernumber: this.ordernum}).then(res => {
                        uni.hideLoading();
						console.log(res);
						if (res.data.code == 0) {
							let data = res.data.result.data;
							// 唤起支付
							this.$wx.jweixin().chooseWXPay({
								timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
								nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
								package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
								signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
								paySign: data.paySign, // 支付签名
								success: function (res) {
									// 支付成功后 目前 直接成功并跳转
                                    if(this.type == 0){ //建店
                                        this.jump_fun();
                                        return;
                                    }
									uni.redirectTo({
										url: '/pages/install/paySuccess?ordernum=' + this.ordernum
									});
								}
							});
						} else {
							this.$api.msg('支付拉取失败');
						}
					});
				}
			},
			//选择支付方式
			changePayType(type) {
				this.payType = type;
			},
            jump_fun() {
              uni.switchTab({
                  url: '/pages/establishment/shop',
              }); 
            },
		}
	}
</script>

<style lang='scss'>
	.app {
		width: 100%;
	}

	.price-box {
		background-color: #fff;
		height: 265upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		color: #909399;

		.price{
			font-size: 50upx;
			color: #303133;
			margin-top: 12upx;
		}
	}

	.pay-type-list {
		margin-top: 20upx;
		background-color: #fff;
		padding-left: 60upx;
		
		.type-item{
			height: 120upx;
			padding: 20upx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-right: 60upx;
			font-size: 30upx;
			position:relative;
		}
		
		.icon{
			width: 100upx;
			font-size: 52upx;
		}
		.icon-erjiye-yucunkuan {
			color: #fe8e2e;
		}
		.icon-weixinzhifu {
			color: #36cb59;
		}
		.icon-alipay {
			color: #01aaef;
		}
		.tit{
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 4upx;
		}
		.con{
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-sm;
			color: $font-color-light;
		}
	}
	.mix-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 630upx;
		height: 80upx;
		margin: 80upx auto 30upx;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}

</style>
