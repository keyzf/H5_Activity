<!-- 绑定支付宝账户 -->
<template>
	<view class="all">
		<view class="top">
			<!-- 非第一个tab的头部 -->
			<view class="navigateBarsecond" :style="{height:stateBarHeight + 'rpx','background-color': navBarBgColor}">
				<image src="../../../static/fenXiao/black_back.png" mode="aspectFit" @click="back"></image>
				<view class="navigateBartitle">{{navBarTitle}}</view>
				<view class="searchtext"></view>
			</view>
		</view>
		<view class="line"></view>
		<view class="account">
			<view class="l">
				<view class="title">请输入支付宝账户</view>
				<input class="input" maxlength="20" v-model="alipayAccount" placeholder="输入账号"> </input>
			</view>
			<image src="../../../static/fenXiao/close.png" @click="clearAccount()"></image>
		</view>
		<view class="line"></view>

		<view class="name">
			<view class="title">姓名</view>
			<input class="input" maxlength="20" v-model="alipayUsername" placeholder="输入姓名"> </input>
		</view>
		<view class="line"></view>

<view class="commit" @click="bind()">
	确认绑定
</view>

	</view>
</template>

<script>
  import API from "@/store/api.js";
	export default {
		onLoad(o) {
			this.stateBarHeight = this.globaldata.statusBarHeight+110||110;
			this.haveAlipayAccount = o.haveAlipayAccount; 
			if(this.haveAlipayAccount == '1'){
				this.getoldAliAccount();
			}
		},
		onShow() {
			if (this.isapp()) {
			  this.callHandler('CallNative', {
			    'key': 'stateBarTextBlack',
			    'showstatebar': '0'
			  });
			}
		},
		data() {
			return {
				stateBarHeight: 100, //状态栏和导航栏的总高度
				navBarBgColor: '#ffffff', //导航栏背景色
				tabtextColor: '#333333', //tab栏字体颜色
				navBarTitle: '绑定支付宝账户', //导航栏标题
				alipayAccount:'',
				alipayUsername:'',
				haveAlipayAccount:''

			};
		},
		methods:{
			//返回
			back() {
				this.$jump.back();
			},
			clearAccount(){
				this.alipayAccount = '';
			},
			//获取原来绑定的支付宝账号
			getoldAliAccount(){
				API.getBindAlipayAccount({
					
					// posterId: this.id
				}).then(res => {
					console.log(res);
					// 停止下拉刷新
					if (res.data.code != 0) {
						uni.showModal({
							title: '提示',
							content: res.data.msg,
							showCancel: false
						})
				
						return
					}
					this.alipayAccount = res.data.result.data.alipayAccount ;
					this.alipayUsername = res.data.result.data.alipayUsername;
					
				}).catch(err => {
					// 停止下拉刷新
					uni.stopPullDownRefresh();
					console.log(err);
				})
			},
			//绑定账号
			bindAliAccount(){
				API.BindAlipayAccount({
					alipayUsername: this.alipayUsername,
					alipayAccount:this.alipayAccount
				}).then(res => {
					console.log(res);
					// 停止下拉刷新
					if (res.data.code != 0) {
						uni.showModal({
							title: '提示',
							content: res.data.msg,
							showCancel: false
						})
						return
					}else{
						uni.showToast({
							title:res.data.msg
						})
						uni.$emit('bindhaveAlipayAccount', {
							keyword: '1'
						})
						uni.navigateBack({
							
						})
					}
					
					
				}).catch(err => {
					console.log(err);
				})
				
			},
			checkdata(){
				if(this.isEmpty(this.alipayAccount)){
					uni.showToast({
						title:'请填写支付宝账号',
						icon:'none'
					})
					return false;
				}else if(this.isEmpty(this.alipayUsername)){
					uni.showToast({
						title:'请填写姓名',
						icon:'none'
					})
					return false;
				}else{
					return true;
				}
			},
			bind(){
				if(this.checkdata()){
					let that = this;
					uni.showModal({
					    title: '提示',
					    content: '确定绑定该支付宝账号吗',
					    success: function (res) {
					        if (res.confirm) {
					          that.bindAliAccount();
					        } else if (res.cancel) {
					            console.log('用户点击取消');
					        }
					    }
					});
				}
			},
      isapp() {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/holdmall/i) == 'holdmall') {
          return true;
        } else {
          return false;
        }
      }
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f5f5f5;
	}

	.all {

		display: flex;
		flex-direction: column;
		font-size: 28rpx;
		color: #333333;
		
		
		// 自定义导航栏 非第一个tab
			.navigateBarsecond {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				padding: 50rpx 0 0 0;
				padding-bottom: 10rpx;
		
				image {
					margin-left: 20rpx;
					margin-right: 20rpx;
					padding: 8rpx;
					width: 50rpx;
					height: 50rpx;
				}
		
				// 搜索模块
				.navigateBartitle{
					font-weight: bold;
					font-size: 34rpx;
				}
		
				.searchtext {
					width: 100rpx;
					font-size: 28rpx;
					color: rgba(51, 51, 51, 1);
				}
			}

		.line {
			height: 1rpx;
			width: 100%;
			background-color: #ddd;
		}

		.account {
			height: 100rpx;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			background-color: #fff;
			align-items: center;
			padding: 0 20rpx;

			.l {
				display: flex;
				flex-direction: row;
				
				.input {
					font-size: 28rpx;
					color: #333333;
					margin-left: 15rpx;
				}
			}

			image {
				width: 28rpx;
				height: 28rpx;
				margin: 0 20rpx 0 0;
			}
		}

		.name {
			height: 100rpx;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			background-color: #fff;
			align-items: center;
			padding: 0 20rpx;


			.input {

				font-size: 28rpx;
				color: #333333;
				margin-left: 15rpx;
				text-align: right;
			}

		}
		
		.commit{
			width: 100%;
			height: 100rpx;
			line-height: 100rpx;
			background-color: #DA494D;
			color: #FFFFFF;
			font-size: 32rpx;
			text-align: center;
			align-items: center;
			position: fixed;
			bottom: 0;
		}

	}
</style>
