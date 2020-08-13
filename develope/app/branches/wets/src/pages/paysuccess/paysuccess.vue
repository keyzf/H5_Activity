<!-- 支付成功界面  create by  LiangMingwei-->
<template>
	<view class="all">
		<view class="navigateBar" :style="{height:stateBarHeight + 'rpx','background-color': navBarBgColor}">
			<image :src="backurl" mode="aspectFit" @click="back"></image>
			<view class="middletitle" :style="{opacity:opacity}">
				支付成功
			</view>
			<!-- <view class="helpText" @click="clickHelp">选购说明</view> -->
		</view>

		<!-- 红色背景部分 -->
		<view class="top">
			<view class="success">
				<image class="icon" src="../../static/paysuccess/success_icon.png"></image>
				<view class="text">支付成功</view>
			</view>
			<view class="successbt">
				<view class="btn" @click="goIndex">返回首页</view>
				<view class="btn" @click="goOrderdetail">查看订单</view>
			</view>
		</view>

		<!-- 福利特有的模块，第几名选择福利 -->
		<view class="middle" v-if="iswelfare">
			<view class="text">{{welfaretext}}</view>
			<!-- 点赞 -->
			<view :class="haszan?'dianZanBlockhas':'dianZanBlock'" @click.once="dianZan">
				<view :class="haszan?'dianZanRignthas':'dianZanRignt'">
					<image :class="haszan?'dianZanPichas':'dianZanPic'" :src="haszan?'../../static/paysuccess/zan_red.png':'../../static/paysuccess/zan_white.png'"
					 mode="widthFix"></image>
				</view>
				<view :class="haszan?'dianZanTexthas':'dianZanText'">{{getZanText}}</view>
			</view>
		</view>

		<!-- 抽奖模块 -->
		<view class="goodluck">
			<view v-if="lucktype == 1" class="goodlucktype0">
				<image class="roateluck" @click="gotogetLuck(0)" mode="aspectFit" src="/../../static/paysuccess/luckroate.png"></image>
			</view>
			<view v-if="lucktype == 3" class="goodlucktype1">
				<view class="title">下单有奖励</view>
				<view class="subtitle">领取奖励</view>
				<view class="luckselect">
					<view class="luckitem" v-if="!hasselsectluck" :style="{width:getwidth(lucklist)}" v-for="(item,index) in lucklist"
					 :key='index'>
						<luckitem @clickluckitem='selectluck(item)' :title="item.title" :subtitle="item.numberText"></luckitem>
					</view>
					<view class="luckresult" v-if="hasselsectluck" @click="goluckresult(selectluckitem)">
						<view class="title">{{selectluckitem.title}}</view>
						<view class="subtitle">{{selectluckitem.limitText}}</view>
						<view class="button">查看></view>
					</view>
				</view>
			</view>
		</view>

		<!-- 为您推荐模块 -->
		<view class="recommend">
			<view class="title">
				<view class="line"></view>
				<image class="heart" src="../../static/paysuccess/recommand_heart.png"></image>
				<view class="guselike">为您推荐</view>
				<view class="line"></view>
			</view>
			<view class="goods">
				<view class="goodsitem" v-for="(item,index) in goods" :key='index'>
					<goodsItemTwo :produceid='item.productid' :mainpic='item.url' :actimgurl='item.newOnShelvesProductIcon' :goodDes='item.feature_short'
					 :tag='item.selftext' :goodTitle='item.name' :goodPrice='item.price' :bottomtag="item.activitylist"
					 @clickGoodDetail='goodsdetail(item.productid)'></goodsItemTwo>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import API from "@/store/api.js";
	import goodsItemTwo from '@/components/lmw/goodsitem.vue'
	import luckitem from '@/components/lmw/luckitem.vue'
	// import Vue from 'vue'
	export default {
		components: {
			goodsItemTwo,
			luckitem
		},
		computed: {
			getZanText() {
				return this.haszan ? "已点赞" : "赞一个";
			}
		},
		data() {
			return {
				orderNumber: '', //订单号
				stateBarHeight: 0, //状态栏和导航栏的总高度
				navBarBgColor: 'rgba(255,255,255,0.0)', //导航栏背景色
				haszan: false, //是否已经点赞
				iswelfare: false, //是否是福利
				welfaretext: '',
				opacity: 0.0, //标题透明度
				lucktype: 0, //1直接去转盘；3优惠券类型
				backurl: '../../static/index/whiteBack.png',
				goods: [],
				lucklist: [],
				selectluckitem: {},
				hasselsectluck: false, //是否已经选择过奖励
			}
		},
		onLoad(o) {
			var that = this;
			if (this.isapp()) {
				that.$util.bridgeAndroidAndIOS(function() {
					that.stateBarHeight = that.globaldata.statusBarHeight + 110 || 110;
					that.orderNumber = that.globaldata.orderNumber || ''; //20200416154259
					that.getPayresult();
				})
			} else {
				that.orderNumber = o.ordernumber;
				that.getPayresult();
			}
		},
		onPageScroll: function(e) { //nvue暂不支持滚动监听，可用bindingx代替
			// console.log("滚动距离为：" + e.scrollTop);
			// 判断导航栏背景的颜色
			if (e.scrollTop <= 1) {
				this.navBarBgColor = 'rgba(255,255,255,0.0)'
				this.opacity = 0.0;
				this.backurl = '../../static/index/whiteBack.png';
			} else if (e.scrollTop >= 100) {
				this.navBarBgColor = 'rgba(255,255,255,1.0)'
				this.opacity = 1;
				this.backurl = '../../static/paysuccess/black_back.png';
			} else {
				var tmp = e.scrollTop / 100.0
				this.navBarBgColor = 'rgba(255,255,255,' + tmp + ')'
				this.opacity = tmp;
			}
		},
		methods: {
			getPayresult() {
				API.paySuccess({
					ordernumber: this.orderNumber || '',
				}).then(res => {
					console.log(res);
					if (res.data.code === '0') {
						let data_ = res.data.result.data;
						if (data_.thumbup) {
							this.welfaretext = data_.thumbup.text;
							this.haszan = data_.thumbup.flag === 1;
							this.iswelfare = !this.isEmpty(this.welfaretext);
						}
						this.lucktype = data_.lotterytype;
						if (this.lucktype == 3) {
							this.lucklist = data_.prizelist;
						}
						this.goods = data_.guessyoulike;
						if (data_.wxLotteryFlag == 1) {
							uni.showModal({
								title: '',
								content: '恭喜你！获得2次大转盘抽奖机会！100%中奖！',
								cancelText: '继续购物',
								confirmText: '去抽奖',
								success: function(res) {
									if (res.confirm) {
										uni.navigateTo({
											url: '/pages/draw/draw'
										})
									} else if (res.cancel) {
										console.log('用户点击取消');
									}
								}
							});
						}
					}
				}).catch(err => {
					console.log(err);
				})

			},
			/**
			 * @param {Object} e
			 * 领取奖励
			 */
			selectluck(item) {
				if (item.prizeType == 1) { //优惠券

					API.selectLuck({
						prizeid: item.prizeid
					}).then(res => {
						console.log(res);
						if (res.data.code === '0') {
							this.hasselsectluck = true;
							this.selectluckitem = item;
						}
					}).catch(err => {
						console.log(err);
					})

				} else if (item.prizeType == 6) { //红包
					API.selectLuckRedpack({
						ordernumber: this.orderNumber
					}).then(res => {
						console.log(res);
						if (res.data.code === '0') {
							this.hasselsectluck = true;
							this.selectluckitem = item;
						}
					}).catch(err => {
						console.log(err);
					})

				}

			},
			// 点赞
			praise() {
				if (this.haszan) {
					uni.showToast({
						title: '您今天已经点过赞啦',
						icon: 'none'
					})
					return;
				}
				API.praise({}).then(res => {
					// console.log(res);
					if (res.data.code != 0) {
						uni.showModal({
							title: '提示',
							content: res.data.msg,
							showCancel: false
						})
						return
					} else {
						this.haszan = true;
					}
				}).catch(err => {
					console.log(err);
				})
			},
			/**
			 * @param {Object} lucklist
			 * 获取领取奖励选项宽度
			 */
			getwidth(lucklist) {
				if (lucklist == null || lucklist == undefined || lucklist.length == 0) {
					return '100%'
				} else if (lucklist.length == 1) {
					return "100%";
				} else if (lucklist.length == 2) {
					return "48%";
				} else if (lucklist.length >= 3) {
					return "32%";
				}
			},
			/**
			 * 返回
			 */
			back() {
				this.$jump.back();
			},
			/**
			 * 去首页
			 */
			goIndex() {
				if (this.isapp()) {
					this.callHandler('CallNative', {
						'key': 'homepage'
					});
				} else {
					this.backs()
				}
			},
			backs() {
				var xh = getCurrentPages();
				xh.forEach((item, index) => {
					if (item.route.indexOf('/pages/') == -1 || item.route.indexOf('/home/home') > -1) {
						uni.navigateBack({
							delta: xh.length - index
						})
					}
				})
			},
			/**
			 * 查看订单
			 */
			goOrderdetail() {
				if (this.isapp()) {
					this.callHandler('CallNative', {
						'key': 'orderdetail'
					});
				} else {
					uni.redirectTo({
						url: '/pages/order/order?state=2'
					});
				}
			},
			/**
			 * 去商品详情
			 */
			goodsdetail(id) {
				this.$jump.jumpMethod(id);
			},
			/**
			 * @param {Object} type
			 * 去抽奖
			 */
			gotogetLuck(type) {
				if (this.isapp()) {
					switch (type) {
						case 0: //去转盘
							this.callHandler('CallNative', {
								'key': 'rotary',
								'orderNumber': '123456'
							});
							break;
						case 1: //

							break;
					}
				}
			},
			/**
			 * @param {Object} type
			 * 不同的中奖类型跳转
			 */
			goluckresult(selectitem) {
				let type = selectitem.prizeType;
				if (this.isapp()) {
					switch (type) {
						case 1: //去优惠券列
							this.callHandler('CallNative', {
								'key': 'couponlist'
							});
							break;
							// case 1: //去转盘抽奖
							// this.callHandler('CallNative', {
							// 	'key': 'rotary'
							// });
							// break;
						case 6: //去余额列表
							// uni.showToast({
							// 	title:'余额列表',
							// 	icon:'none'
							// })
							this.callHandler('CallNative', {
								'key': 'remaininglist'
							});
							break;
						default:
							uni.showToast({
								title:'功能开发中',
								icon:'none'
							})
							break;
					}
				} else {
					switch (type) {
						case 1: //去优惠券列
							uni.navigateTo({
								url: '/pages/user/coupon'
							})
							break;
						case 6: //去余额列表
							uni.navigateTo({
								url:'/pages/user/balance'
							})
							break;

						default:
							this.$api.msg('功能开发中')
							break;
					}
				}

			},
			/**
			 * 点赞
			 */
			dianZan() {
				this.praise();
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

		//推荐商品模块
		.recommend {
			display: flex;
			flex-direction: column;

			.title {
				display: flex;
				flex-direction: row;
				justify-content: center;
				padding: 20rpx 0;
				align-items: center;

				.guselike {
					color: #333333;
					font-size: 34rpx;
					margin-left: 5rpx;
					font-weight: bold;
				}

				.heart {
					width: 35rpx;
					height: 35rpx;
					margin-right: 5rpx;
					margin-top: 6rpx;
					text-align: center;
					align-items: center;
				}

				.line {
					width: 100rpx;
					height: 1rpx;
					margin: 0 20rpx;
					background-color: #dddddd;
				}
			}

			.goods {
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				padding: 0 15rpx;

				.goodsitem {
					width: 48%;
					margin: 0rpx 5rpx;
				}
			}
		}

		// 抽奖模块
		.goodluck {

			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.title {
				font-size: 28rpx;
				margin-top: 20rpx;
				color: #333333;
			}

			.subtitle {
				font-size: 34rpx;
				color: #ee3847;
				font-weight: bold;
			}

			//单张图片的转盘抽奖
			.goodlucktype0 {

				margin: 20rpx 20rpx 0 20rpx;
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: center;

				.roateluck {
					height: 190rpx;
				}
			}

			.goodlucktype1 {

				width: 100%;
				margin: 20rpx 0 0 0;
				background-color: #FFFFFF;
				display: flex;
				flex-direction: column;
				align-items: center;

				.luckselect {
					width: 90%;
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					text-align: center;
					align-items: center;
					flex-wrap: wrap;
					padding: 0 15rpx;
					margin: 20rpx 0rpx;


					.luckresult {
						width: 100%;
						border: 1rpx solid #EE3847;
						background: #FEF3F3;

						.title {
							color: #ee3847;
							font-size: 28rpx;
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
							color: #929292;
							font-size: 22rpx;
							margin: 0 5rpx;
							word-break: break-word; //换行模式
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							-webkit-box-orient: vertical;
						}

						.button {

							text-align: center;
							font-size: 24rpx;
							margin: 15rpx 0 15rpx 0;
							padding: 5rpx 15rpx;
							border-radius: 25rpx;
							color: #ee3847;
						}

					}

				}

			}

		}

		//红色背景部分
		.top {
			background-image: linear-gradient(to right, #E8584B, #DD4D4E);
			height: 340rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.success {

				display: flex;
				flex-direction: row;
				align-items: center;
				margin-top: 50rpx;

				.icon {
					width: 45rpx;
					height: 45rpx;
					margin: 0 10rpx 0 0;
				}

				.text {
					font-size: 40rpx;
					color: #FFFFFF;
					font-weight: bold;
				}
			}

			.successbt {
				display: flex;
				flex-direction: row;
				margin-top: 30rpx;
				justify-content: center;
				align-items: center;

				.btn {
					height: 45rpx;
					line-height: 45rpx;
					border: 1rpx solid #FFFFFF;
					color: #FFFFFF;
					margin: 0 25rpx;
					padding: 2rpx 25rpx;
					font-size: 28rpx;
					text-align: center;
					border-radius: 40rpx;
				}
			}
		}

		// 福利-成功显示
		.middle {
			display: flex;
			flex-direction: row;
			height: 130rpx;
			background-color: #FFFFFF;
			margin: -35rpx 30rpx 0;
			border: 1rpx solid #FFFFFF;
			border-radius: 20rpx;
			justify-content: space-between;
			align-items: center;

			.text {
				font-size: 28rpx;
				width: 65%;
				color: #333333;
				margin: 0 20rpx;
				/** 对象作为伸缩盒子模型显示 **/
				display: -webkit-box;
				-webkit-line-clamp: 2;
				overflow: hidden;
				text-overflow: ellipsis;
				-webkit-box-orient: vertical;
			}

			// 点赞模块,未点赞之前
			.dianZanBlock {
				// position: absolute;
				top: 0;
				right: 0rpx;
				width: 160rpx;
				height: 60rpx;
				border-radius: 60rpx;
				margin-right: 20rpx;
				background: linear-gradient(to right, #ee3847, #FF6401);
				display: flex;
				justify-content: center;
				// text-align: center;
				align-items: center;

				.dianZanText {
					font-size: 26rpx;
					color: #FFFFFF;
					width: 100rpx;
					padding: 0 6rpx 0 0;
				}

				.dianZanRignt {
					width: 70rpx;
					text-align: center;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					position: relative;

					.dianZanPic {
						width: 35rpx;
						margin-bottom: 9rpx;
					}

				}
			}


			// 点赞模块,赞之后
			.dianZanBlockhas {
				// position: absolute;
				top: 0;
				right: 0rpx;
				width: 160rpx;
				height: 60rpx;
				margin-right: 20rpx;
				border-radius: 60rpx;
				background: #f5f5f5;
				display: flex;
				justify-content: center;
				// text-align: center;
				align-items: center;

				.dianZanTexthas {
					font-size: 26rpx;
					color: #FF6401;
					width: 100rpx;
					line-height: 60rpx;
					padding: 0 6rpx 0 0;
				}

				.dianZanRignthas {
					width: 70rpx;
					text-align: center;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					position: relative;

					.dianZanPichas {
						margin-bottom: 9rpx;
						width: 35rpx;
					}
				}
			}

		}

		// 自定义导航栏
		.navigateBar {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			z-index: 10;
			display: flex;
			align-items: flex-end;
			padding-bottom: 20rpx;

			image {
				margin-left: 20rpx;
				margin-right: 20rpx;
				padding: 8rpx;
				width: 50rpx;
				height: 50rpx;
			}

			.middletitle {
				position: relative;
				height: 50rpx;
				width: 100%;
				display: flex;
				justify-content: center;
				color: #333333;
				margin: 0 65rpx 0 0;
				// filter: alpha(opacity=0.0);
				opacity: 0.0;

			}

			.helpText {
				width: 20%;
				position: absolute;
				right: 10rpx;
				font-size: 28rpx;
				color: #fff;
				text-align: center;
				padding-bottom: 10rpx;
			}
		}
	}
</style>
