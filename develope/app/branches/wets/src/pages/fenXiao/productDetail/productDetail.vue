<!-- 商品详情页面 -->
<template>
	<scroll-view class="all" v-bind:style="{'height':'calc(100% - 0rpx)'}" enableBackToTop="true" scroll-y="true">

		<!-- 第一个tab的头部 -->
		<view class="navigateBar" :style="{height:stateBarHeight + 'rpx'}">
			<image src="../../../static/fenXiao/backa.png" mode="scaleToFill" @click="back"></image>
			<image src="../../../static/fenXiao/share.png" mode="scaleToFill" @click="share('skuid')"></image> <!-- todo -->
		</view>

		<!-- 轮播图 -->
		<view class="swipperpic">
			<swiper class="carouselpic" autoplay circular :indicator-dots='swipperDetail.length>1' indicator-color='rgba(195, 195, 195, 0.3)'
			 indicator-active-color='#fff'>
				<swiper-item class="carousel-itempic" v-for="(item,index) in swipperDetail" :key="index" @click="goswiper(item)">
					<image :src="item.picurl" mode="scaleToFill" />
				</swiper-item>
			</swiper>
		</view>

		<!-- 轮播图下边线框 -->
		<view class="alertline">
			<view class="l">{{data.rebate_flag}}{{data.rebate}}</view>
			<view class="r" @click="golevelup">去升级</view>
		</view>

		<!-- 商品信息 -->
		<view class="productinfo">
			<view class="priceline">
				<view class="l">
					<view class="p1">{{data.subcoupon_price}}</view>
					<view class="p2">￥{{data.price}}</view>
				</view>
				<view class="r" @click="gostore()">
					<view class="t1">{{data.label}}</view>
					<view class="t2">{{data.companyname}}</view>
					<image src="../../../static/fenXiao/row_right.png"></image>
				</view>
			</view>
			<view class="title">{{data.productname}}</view>
			<view class="subbox">
				<view class="subtitle">{{data.attributeshow}}</view>
			</view>


			<view class="coupon" v-if="data.coupon_value">
				<view class="value">￥{{data.coupon_value}}</view>
				<view class="alert">
					<view class="msg">{{data.coupon_label}}</view>
					<view class="getcoupon" @click="getcoupon">立即领取</view>
				</view>
			</view>
		</view>

		<!-- 猜你喜欢 -->
		<!-- 为您推荐 -->
		<view class="recommend">
			<view class="title">
				<image class="heart" src="../../../static/fenXiao/guselike.png" mode="scaleToFill"></image>
			</view>
			<view class="goods">
				<view class="goodsitem" v-for="(item,index) in guesslike" :key="index">
					<goodsItemTwo :productid='item.productid +""' :mainpic='item.picInfo.url' :actimgurl='item.newOnShelvesProductIcon'
					 :goodDes='item.feature_short' :tag='item.selftext' :goodTitle='item.productname' :goodPrice='item.newprice'
					 :bottomtag="item.commission_label" :goodOriginPrice="item.commission" :coupontext="item.coupon_label"
					 :couponvalue="item.coupon_value" @clickGoodDetail='goodsdetail(item)'></goodsItemTwo>
				</view>
			</view>
			<!-- <uni-load-more :status="loadingType" :style="{'margin-bottom':'100rpx'}"></uni-load-more> -->
		</view>
		<!-- 底部按钮 -->
		<view class="bottom-bt">
			<view class="home" @click="gohomepage()">
				<image src="../../../static/fenXiao/home.png"></image>
				<view>首页</view>
			</view>
			<view class="btns">
				<view class="share" @click="sharewithmoney()">分享赚{{data.commission}}</view>
				<view class="save" @click="buywithmoney()">自购省{{data.final_price}}</view>
			</view>


		</view>
		<!-- 弹窗 -->
		<uni-popup :show="showtip" :type="type" :mask-click="false" @change="change">
			<view class="uni-tip">
				<view class="close">
					<view></view>
					<image src="../../../static/fenXiao/close.png" @click="cancel()"></image>
				</view>
				<text class="uni-tip-title">请填写邀请码</text>
				<view class="codes">
					<input class="input" maxlength="20" v-model="couponcode" placeholder="请填写邀请码"> </input>

				</view>

				<view class="help" @click="helpclick">
					<image src="../../../static/fenXiao/help.png"></image>
					<view>如何获得邀请码</view>
				</view>
				<view class="connection">
					<view class="connectionbt" @click="commit">提交</view>
				</view>
			</view>
			</view>
		</uni-popup>

	</scroll-view>
</template>

<script>
	import goodsItemTwo from '../../../components/lmw/fenxiaohomegoodsitem.vue';
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
  import API from "@/store/api.js";
	export default {
		components: {
			goodsItemTwo,
			uniPopup
		},
		onLoad(o) {
			// this.item = JSON.parse(option.item);
			this.stateBarHeight = this.globaldata.statusBarHeight+110||110;
			this.skuid = o.skuid || '';
			// uni.showToast({
			// 	title:this.skuid
			// })
			this.getdetail();
			this.getgueslike();
		},
		onShow() {
      if(this.isapp()){
        this.callHandler('CallNative', {
        	'key': 'stateBarTextBlack',
        	'showstatebar':'0'
        });
      }else{

      }
		},
		//加载更多
		onReachBottom() {
			// uni.showToast({
			// 	title: '加载更多'
			// })
			// this.gorecommendmore(this.recommendelementId,this.recommendindex);
		},
		data() {
			return {
				stateBarHeight: 100, //状态栏和导航栏的总高度
				loadingType: 'more',
				type: '',
				showtip: false,
				skuid: '',
				productid: '',
				companyguid:'',
				allattribute:'',
				couponcode: '',
				couponid:'',
				swipperDetail: [],
				data: {},
				guesslike: [],
				memberInfo:{}
			};
		},
		methods: {
			//返回
			back() {
				this.$jump.back();
			},
			//分享
			share(skuid) {
				if(this.isVip()){
					this.callHandler('CallNative', {
						'key': 'sharedistribution',
						'skuid': this.skuid
					});
				}else{
					this.togglePopup();
				}
			},
			//去升级
			golevelup() {
				uni.showToast({
					title: '去升级'
				})
				this.callHandler('CallNative', {
					'key': 'h5Url',
					'h5Url': this.data.upgrade.url,
					'title': this.data.upgrade.title,
				});
			},
			//领取优惠券
			getcoupon() {
				if(this.isVip()){
					
					this.getCoupon();
					
				}else{
					this.togglePopup();
				}
			},
			//去店铺
			gostore() {
				this.callHandler('CallNative', {
					'key': 'shopmainpage',
					'cguid':this.companyguid,
					'isself':this.selfSupportFlag
				});
			},
			//帮助
			helpclick() {
			  if(this.isapp()){
			    this.callHandler('CallNative', {
			    	'key': 'h5Url',
			    	'h5Url': this.memberInfo.distibutionRule
			    	// 'title':item.describle
			    });
			  }else{
			    uni.navigateTo({
			      url:'/pages/establishment/help?type=0&title=如何获取邀请码&url='+this.memberInfo.distibutionRule
			    })
			  }
			},
			//商品详情
			goodsdetail(item) {
				uni.redirectTo({
					url:'../productDetail/productDetail?skuid='+item.skuid
				})
			},
			//去首页
			gohomepage() {
				// uni.showToast({
				// 	title: '去首页'
				// })
				uni.navigateTo({
					url:'../fenxiaoMain/fenxiaoMain'
				})
				
			},
			sharewithmoney() {
				if(this.isVip()){
					this.callHandler('CallNative', {
						'key': 'sharedistribution',
						'skuid': this.skuid
					});
				}else{
					this.togglePopup();
				}
				
			},
			//自购省 去原生详情
			buywithmoney() {
        if(this.isapp()){
          this.callHandler('CallNative', {
          	'key': 'goodsdetail',
          	'productid': this.productid,
          	'allattribute':this.allattribute
          });
        }else{
          this.$jump.jumpMethod(this.productid);
        }
			},
			change(e) {
				console.log('是否打开:' + e.show)
				if (!e.show) {
					this.showtip = false
				}
			},
			//邀请码弹窗
			togglePopup() {
				this.type = 'center';
				this.showtip = true;
			},
			cancel() {
				this.showtip = false;
			},
			commit() {
				if (this.checkData()) {
					this.exchange();
				}
			},
			checkData() {
				if (this.isEmpty(this.couponcode)) {
					uni.showToast({
						title: '请输入邀请码',
						icon: 'none'
					})
					return false;
				} else {
					return true;
				}
			},
			exchange() {
				API.inviteCode({
					inviteCode: this.couponcode,
				}).then(res => {
					console.log(res);
					if (res.data.code == -1) {
						uni.showModal({
							title: '提示',
							content: res.data.msg,
							showCancel: false
						})
					} else {
						// 兑换成功
						uni.showToast({
							title: res.data.msg
						})
						this.showtip = false;
						this.memberInfo.isMemberFlag = '1';
						// setTimeout(()=>{
						// 	uni.navigateBack();
						// },500);

					}
				}).catch(err => {
					console.log(err);
				})
			},
			getCoupon() {
				let that = this;
				API.getcounpon({
					couponid: this.couponid,
				}).then(res => {
					console.log(res);
					// if (res.data.code == -1) {
					// 	uni.showModal({
					// 		title: '提示',
					// 		content: res.data.msg,
					// 		showCancel: false
					// 	})
					// } else {
						// 兑换成功
						uni.showToast({
							title: res.data.msg
						})
						setTimeout(()=>{
							that.buywithmoney();
						},300);
			
					// }
				}).catch(err => {
					console.log(err);
				})
			},
			getdetail() {
				API.productDetail({
					skuid: this.skuid,
				}).then(res => {
					console.log(res);
					if (res.data.code == -1) {
						uni.showModal({
							title: '提示',
							content: res.data.msg,
							showCancel: false
						})
					} else {
						this.data = res.data.result.data || {};
						this.productid = this.data.productid;
						this.allattribute = this.data.allattribute;
						this.companyguid = this.data.companyguid;
						this.selfSupportFlag = this.data.selfSupportFlag;
						this.memberInfo = this.data.memberInfo;
						this.couponid = this.data.coupon_id;
						this.swipperDetail = [];
						this.swipperDetail.push({
							'picurl': this.data.picurl
						});

					}
				}).catch(err => {
					console.log(err);
				})
			},

			isVip(){
				return this.memberInfo.isMemberFlag == '1';
			},
			getgueslike() {
				API.productDetaillike({
					// skuid:this.skuid,
				}).then(res => {
					console.log(res);
					if (res.data.code == -1) {
						uni.showModal({
							title: '提示',
							content: res.data.msg,
							showCancel: false
						})
					} else {
						this.guesslike = res.data.result.data.guess_you_like;

					}
				}).catch(err => {
					console.log(err);
				})
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


		/* 提示窗口 */
		.uni-tip {
			display: flex;
			flex-direction: column;
			padding: 15px;
			width: 300px;
			background-color: #fff;
			border-radius: 10px;
			justify-content: center;

			.close {
				display: flex;
				flex-direction: row;
				justify-content: space-between;

				image {
					width: 28rpx;
					height: 28rpx;
					margin: 0 20rpx 0 0;
				}
			}

			.uni-tip-title {

				text-align: center;
				font-weight: bold;
				font-size: 16px;
				color: rgba(252, 98, 42, 1);
			}

			.codes {
				// width: 100%;
				height: 80rpx;
				border: 1rpx solid #ddd;
				background-color: #ddd;
				margin: 30rpx 50rpx 0 50rpx;
				border-radius: 8rpx;
				display: flex;
				// flex-direction: row;
				// justify-content: space-between;
				align-items: center;


				.input {
					width: 100%;
					margin: 0 30rpx 0 30rpx;
					// background-color: #4399FC;
				}

			}

			.help {
				display: flex;
				flex-direction: row;
				// justify-content: center;
				align-items: center;
				margin: 8rpx 50rpx 0 50rpx;
				font-size: 24rpx;
				color: rgba(0, 171, 251, 1);


				image {
					width: 28rpx;
					height: 28rpx;
					margin: 0 20rpx 0 0;
				}

			}

			.connection {
				display: flex;
				justify-content: center;
				margin: 20rpx 0 5rpx 0;

				.connectionbt {
					background-color: rgba(252, 98, 42, 1);
					color: #FFFFFF;
					font-size: 36rpx;
					padding: 5rpx 20rpx;
					border-radius: 15rpx;
				}
			}
		}

		//底部按钮
		.bottom-bt {
			position: fixed;
			bottom: 0;
			width: 100%;
			height: 100rpx;
			display: flex;
			flex-direction: row;
			background-color: #ffffff;
			justify-content: space-between;
			align-items: center;
			text-align: center;
			padding: 0 20rpx;

			.home {
				width: 20%;
				font-size: 24rpx;
				color: rgba(51, 51, 51, 1);
				padding: 10rpx 0 5rpx 10rpx;


				image {
					height: 35rpx;
					width: 40rpx;
				}

			}

			.btns {

				// background-color: #4399FC;
				display: flex;
				flex-direction: row;
				justify-content: space-around;
				width: 80%;
				font-size: 28rpx;
				color: #FFFFFF;

				.share {
					width: 100%;
					height: 70rpx;
					background: linear-gradient(to right, #ffa700, #ffb300);
					border-radius: 70rpx 0rpx 0 70rpx;
					line-height: 70rpx;
					text-align: center;
					align-items: center;

				}

				.save {
					width: 100%;
					height: 70rpx;
					background: linear-gradient(to right, #ff6302, #ee3946);
					border-radius: 0rpx 70rpx 70rpx 0;
					line-height: 70rpx;
					text-align: center;
					align-items: center;
				}

			}


		}


		//推荐商品模块
		.recommend {
			display: flex;
			flex-direction: column;
			margin: 0 0 100rpx 0;
			// background-color: #fff;
			// margin-top: 20rpx;

			.title {
				display: flex;
				flex-direction: row;
				justify-content: center;
				padding: 10rpx 0 10rpx 0;
				// align-items: center;

				.heart {
					width: 100%;
					height: 80rpx;
					text-align: center;
					align-items: center;
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

		//商品相关的信息
		.productinfo {
			background-color: #FFFFFF;
			font-size: 26rpx;
			padding: 20rpx;


			.priceline {
				display: flex;
				height: 60rpx;
				align-items: center;
				flex-direction: row;
				justify-content: space-between;

				.l {
					display: flex;
					flex-direction: row;
					align-items: flex-end;

					.p1 {
						color: rgba(238, 56, 71, 1);
						font-weight: bold;

					}

					.p2 {
						color: rgba(146, 146, 146, 1);
						text-decoration: line-through;
						margin: 0 20rpx 0;
						font-size: 20rpx;
					}

				}

				.r {
					display: flex;
					flex-direction: row;
					font-size: 24rpx;
					align-items: center;
					// align-items: flex-end;

					.t1 {
						color: rgba(255, 255, 255, 1);
						background-color: rgba(252, 98, 42, 1);
						padding: 0 10rpx;
						border-radius: 20rpx;
						text-align: center;
						// align-items: center;
						margin: 0 5rpx 0;

					}

					.t2 {

						color: rgba(146, 146, 146, 1);
						margin: 3rpx 10rpx 0 10rpx;

					}

					image {
						width: 18rpx;
						height: 23rpx;
					}
				}

			}

			.title {
				color: rgba(51, 51, 51, 1);
				font-size: 28rpx;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				word-wrap: break-word;
				word-break: break-all;
				overflow: hidden;
				text-overflow: ellipsis;

			}

			.subbox {
				display: flex;

				.subtitle {

					color: rgba(51, 51, 51, 1);
					font-size: 24rpx;
					padding: 5rpx 10rpx;
					margin: 10rpx 0 0 0;
					background-color: rgba(245, 245, 245, 1);
					border-radius: 10rpx;

					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					word-wrap: break-word;
					word-break: break-all;
				}
			}

			.coupon {
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				// background-color: #4399FC;
				height: 150rpx;
				margin: 15rpx 0 30rpx 0;

				.value {

					height: 150rpx;
					width: 160rpx;
					line-height: 150rpx;
					background-image: url(../../../static/fenXiao/bg_detail_l.png);
					background-repeat: no-repeat;
					-webkit-background-size: 160rpx 150rpx;
					color: #FFFFFF;
					text-align: center;

				}

				.alert {

					height: 150rpx;
					width: 230rpx;
					background-image: url(../../../static/fenXiao/bg_detail_r.png);
					background-repeat: no-repeat;
					-webkit-background-size: 230rpx 150rpx;
					// text-align: center;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;

					.msg {
						// text-align: center;
						color: rgba(255, 255, 255, 1);
						font-size: 28rpx;
						margin-bottom: 10rpx;

					}

					.getcoupon {
						color: rgba(252, 98, 42, 1);
						background-color: #FFFFFF;
						padding: 3rpx 15rpx;
						border-radius: 10rpx;
						font-size: 24rpx;
					}

				}

			}

		}



		//轮播图下边线框
		.alertline {
			height: 80rpx;
			background: linear-gradient(to right, #f66028, #f8b036);
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;

			.l {
				width: 25%;
				height: 100%;
				line-height: 80rpx;
				text-align: center;
				vertical-align: center;
				background-color: rgba(39, 7, 1, 0.9);
				color: rgba(248, 172, 53, 1);
				font-size: 24rpx;
				border-radius: 0 60rpx 60rpx 0;
			}

			.r {
				border: 2rpx solid rgba(39, 7, 1, 1);
				color: rgba(39, 7, 1, 1);
				margin: 0 30rpx 0;
				padding: 10rpx 30rpx;
				font-size: 24rpx;
				border-radius: 10rpx;
			}

		}

		// 自定义导航栏
		.navigateBar {
			width: 100%;
			position: fixed;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			padding: 50rpx 0 0 0;
			z-index: 10;

			image {
				margin-left: 20rpx;
				margin-right: 20rpx;
				padding: 8rpx;
				width: 70rpx;
				height: 70rpx;
			}

		}

		// 轮播图
		.swipperpic {

			.carouselpic {
				width: 100%;
				height: 600rpx;

				.carousel-itempic {
					width: 100%;
					height: 500rpx;
					// line-height: 900upx;
					// padding: 0 5rpx 15rpx;

					image {
						width: 100%;
						height: 600rpx;
						// margin-right: 20rpx;
						// border-radius: 10rpx;
					}
				}
			}


		}

	}
</style>
