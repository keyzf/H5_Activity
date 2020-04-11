<template>  
    <view class="container">  
		<view class="user-section">
            <image src="../../static/set.png" mode="aspectFit" class="set" @click.stop="setclick"></image>
			<view class="user-info-box" @click="clickHeadimg">
				<view class="portrait-box">
					<image class="portrait" :src=" user.img || '/static/missing-face.png'" mode="aspectFill" @error="errorImg()"></image>
                    <image class="gradeimg" :src="'/static/vip'+user.grade+'.png'" mode="aspectFit"></image>
                </view>
				<view class="info-box">
					<text class="username">{{ user.name || '游客'}}</text>
				</view>
                <!-- <view class="activity" @click.stop="goenvelopes" v-show="user.isshowredpacketshare == 1">
                    <image src="../../static/envelopeactivities.gif" mode="aspectFit"></image>
                    <text>邀请得红包</text>
                </view> -->
                <view class="activity" @click.stop="jumpConsumerank" v-show="user.isshowconsumerank == 1">
                    <image :src="'../../static/consume.png'" mode="aspectFit"></image>
                    <text>年度消费排行榜</text>
                </view>
			</view>
			
		</view>
		
		<view class="cover-container">
			<image class="arc" src="/static/arc.png"></image>
			<!-- 订单 -->
            <view class="header">我的订单<text class="yticon icon-you" @click="navTo('/pages/order/order?state=0')">全部订单</text></view>
			<view class="order-section">
				<view class="order-item" @click="navTo('/pages/order/order?state=1')" hover-class="common-hover"  :hover-stay-time="50">
					<text v-if="orderlist.non_payment != 0" class="cart-number">{{ orderlist.non_payment }}</text>
					<view class="yticon">
			            <image src="../../static/non_payment.png" mode="aspectFill"></image>
			        </view>
					<text>待付款</text>
				</view>
				<view class="order-item" @click="navTo('/pages/order/order?state=2')"  hover-class="common-hover" :hover-stay-time="50">
					<text v-if="orderlist.non_delivery != 0" class="cart-number">{{ orderlist.non_delivery }}</text>
					<view class="yticon">
			            <image src="../../static/non_delivery.png" mode="aspectFill"></image>
			        </view>
					<text>待发货</text>
				</view>
				<view class="order-item" @click="navTo('/pages/order/order?state=3')" hover-class="common-hover"  :hover-stay-time="50">
					<text v-if="orderlist.non_takeover != 0" class="cart-number">{{ orderlist.non_takeover }}</text>
					<view class="yticon">
			            <image src="../../static/non_takeover.png" mode="aspectFill"></image>
			        </view>
					<text>待收货</text>
				</view>
				<view class="order-item" @click="navTo('/pages/order/order?state=4')" hover-class="common-hover"  :hover-stay-time="50">
					<text v-if="orderlist.non_evaluate != 0" class="cart-number">{{ orderlist.non_evaluate }}</text>
					<view class="yticon">
			            <image src="../../static/non_evaluate.png" mode="aspectFill"></image>
			        </view>
					<text>待评价</text>
				</view>
				<view class="order-item" @click="navTo('/pages/order/aftermarket')" hover-class="common-hover"  :hover-stay-time="50">
					<text v-if="orderlist.service != 0" class="cart-number">{{ orderlist.service }}</text>
					<view class="yticon">
			            <image src="../../static/service.png" mode="aspectFill"></image>
			        </view>
					<text>退款售后</text>
				</view>
			</view>
            <view class="header">我的钱包</view>
			<view class="tj-sction">
				<view class="tj-item" @click="navTo('/pages/user/extra')">
					<text class="num">{{u_coin}}</text>
					<text>U币</text>
				</view>
                <view class="tj-item" @click="navTo('/pages/user/envelopes')">
                	<text class="num">{{envelopes}}</text>
                	<text>红包</text>
                </view>
				<view class="tj-item" @click="navTo('/pages/user/coupon')">
					<text class="num">{{coupon}}</text>
					<text>优惠券</text>
				</view>
			</view>
			
			<template v-if="menu.length > 0">
			    <view class="cate-section">
			        <view class="cate-item" v-for="(item, index) in menu" :key="index" @click="tablist(item)">
			            <image :src="item.url"></image>
			            <view>{{ item.display }}</view>
			        </view>
			    </view>
			</template>
		</view>
    </view>  
</template>  
<script>  
    export default {
		data(){
			return {
				u_coin:0.00,
				coupon:0,
				envelopes:0.00,
				user:{
					img:"",
					name:"",
					grade:0,
					isshowredpacketshare: 0,
                    isshowconsumerank: 0,
                    consumerankurl: '',
                    facepic: ''
				},
				orderlist: {
					non_payment: 0,
					non_delivery: 0,
					non_takeover: 0,
					non_evaluate: 0,
					service: 0
				},
				moving: false,
				menu:[],
                loginState: false
			}
		},
		
        created(){
        	let _this = this;
        	uni.$on('changeLoginState',function(data){
        		_this.getUserInfo();
        		_this.getUserInfoSub();
        	});
			this.getUserInfo();
			this.getUserInfoSub();
        },
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
            this.getUserInfoSub();
        },
        methods: {
            more(){},
			load(){
				this.getUserInfo();
				this.getUserInfoSub();
			},
            setclick(e) {
                uni.navigateTo({
                    url: '/pages/set/set'
                });
            },
			clickHeadimg() {
                let userInfo = uni.getStorageSync('userInfo') || '';
				if (!userInfo.guid) {
				    uni.navigateTo({
				        url: '/pages/public/login'
				    });
				    return;
				}
                this.navTo('/pages/set/information');
			},
			// 获取个人中心
			getUserInfo() {
				this.$ajax.get('user/newinfo', {}).then(res => {
					if (res.data.code == 0) {
						let data = res.data.result.data;
						this.user.img = data.userinfo.facepic;
						this.user.name = data.userinfo.realname;
						this.user.grade = data.userinfo.memberlevel;
						this.user.isshowredpacketshare = data.userinfo.isshowredpacketshare;
                        this.user.isshowconsumerank = data.userinfo.isshowconsumerank;
                        this.user.consumerankurl = data.userinfo.consumerankurl;
                        this.user.facepic = data.userinfo.facepic;
						this.menu = data.menu;
					} else {
					    this.$api.msg('系统出错,请稍后再试');
					}
                    uni.stopPullDownRefresh();
				});
			},
			// 获取订单状态数字
			getUserInfoSub() {
				this.$ajax.get('user/newinfosub', {}).then(res => {
					if (res.data.code == 0) {
						let data = res.data.result.data;
						this.u_coin=data.wallet.extrapoint;
						this.coupon=data.wallet.couponnumber;
						this.envelopes=data.wallet.redpack;
						
						this.orderlist.non_payment= data.userinfo.orderlist[0].number;
						this.orderlist.non_delivery= data.userinfo.orderlist[1].number;
						this.orderlist.non_takeover= data.userinfo.orderlist[2].number;
						this.orderlist.non_evaluate= data.userinfo.orderlist[3].number;
						this.orderlist.service= data.userinfo.orderlist[4].number;
					} else {
					    this.$api.msg('系统出错,请稍后再试');
					}
                    uni.stopPullDownRefresh();
				});
			},
			/**
			 * 统一跳转接口,拦截未登录路由
			 * navigator标签现在默认没有转场动画，所以用view
			 */
			navTo(url){
				uni.navigateTo({  
					url
				})  
			}, 
            // 菜单选择
			tablist(item) {
				let code = item.code;
                switch(code) {
                    case 'ATTEN':
                        this.navTo('/pages/user/attentionproductlist');
                        break;
                    case 'ADDRESS':
                        this.navTo('/pages/address/address');
                        break;
                    case 'HOTLINE':
                        this.navTo('/pages/user/customer');
                        break;
                    case 'RICHSCAN':
                        if (this.$wx.isWechat()) {
                            this.$wx.scanQRCode(1);
                        }
                        break;
                    case 'CHAT':
                        this.navTo('/pages/chat/list');
                        break;
                    case 'SHOPFOLLOW':
                        this.navTo('/pages/product/shoplist');
                        break;
                    case 'COUPON':
                        this.navTo('/pages/user/morecoupon');
                        break;
                    case 'HISTORY':
                        this.navTo('/pages/product/recordlist');
                        break;
                    case 'INVEST':
                        this.navTo('/pages/establishment/help?url=' + item.content + '&type=3');
                        break;
                    default:
                        this.$api.msg('功能开发中');
                        break;
                }
			},
            errorImg(){
                this.user.img = '/static/missing-face.png';
            },
            goenvelopes(){
                // 跳转红包页面
				uni.navigateTo({
					url: '/pages/activity/activity'
				})
            },
            jumpConsumerank() {
                let userinfo = uni.getStorageSync('userInfo');
                location.href = this.user.consumerankurl + '?guid=' + userinfo.guid + '&token=' + userinfo.token + '&AppCode=WXMall';
            }
        }
    }  
</script>  
<style lang='scss'>
	page {
		background: $page-color-base;
		min-height:100%;
		.cate-section {
		    border-radius: 16upx 16upx 0 0;
		    margin-top: 20upx;
		}
	}
	/* 分类 */
	.cate-section {
	    display: flex;
	    align-items: center;
	    flex-wrap: wrap;
	    padding: 30upx 22upx;
	    background: #fff;
	    .cate-item {
	        width: 25%;
	        flex-direction: column;
	        align-items: center;
	        font-size: $font-sm + 2upx;
	        color: $font-color-dark;
	        margin-bottom: 14upx;
	        text-align: center;
	    }
	    /* 原图标颜色太深,不想改图了,所以加了透明度 */
	    image {
	        width: 88upx;
	        height: 88upx;
	    }
	}
	%flex-center {
	 display:flex;
	 flex-direction: column;
	 justify-content: center;
	 align-items: center;
	}
	%section {
	  display:flex;
	  justify-content: space-around;
	  align-content: center;
	  background: #fff;
	  border-radius: 10upx;
	}

	.user-section{
		height: 280upx;
		padding: 60upx 30upx 0;
		position:relative;
		background: rgb(239, 56, 70);
        .set{
            position: fixed;
            top: 20rpx;
            right: 30rpx;
            width: 50rpx;
            height: 50rpx;
            z-index: 3;
        }
	}
	.user-info-box{
		height: 180upx;
		display:flex;
		align-items:center;
        justify-content: space-between;
		position:relative;
		z-index: 1;
        .portrait-box{
            position: relative;
        }
		.portrait{
			width: 140upx;
			height: 140upx;
			border:5upx solid #fff;
			border-radius: 50%;
		}
        .gradeimg{
            position: absolute;
            bottom: -8rpx;
            right: -20rpx;
            height: 60rpx;
            width: 60rpx;
        }
        .info-box{
            flex: 1;
        }
		.username{
			font-size: $font-lg + 6upx;
			color: #FFFFFF;
			margin-left: 20upx;
		}
        .activity{
            min-width: 210rpx;
            padding: 6rpx 20rpx;
            background: #FFF;
            border-radius: 40rpx;
            font-size: 24rpx;
            text-align: center;
            image{
                width: 30rpx;
                height: 40rpx;
                display: inline-block;
                vertical-align: middle;
                margin-right: 8rpx;
            }
            text{
                vertical-align: middle;
            }
        }
	}

	.cover-container{
		background: $page-color-base;
		padding: 0 30upx;
		position:relative;
		background: #f5f5f5;
		padding-bottom: 20upx;
        margin-bottom: 100rpx;
		.arc{
			position:absolute;
			left: 0;
			top: -34upx;
			width: 100%;
			height: 36upx;
		}
	}
	.tj-sction{
		@extend %section;
		.tj-item{
			@extend %flex-center;
			flex-direction: column;
			height: 140upx;
			font-size: $font-sm;
			color: #75787d;
		}
		.num{
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 8upx;
		}
	}
	.order-section{
		@extend %section;
		padding: 28upx 0;
		.order-item{
			@extend %flex-center;
			width: 120upx;
			height: 120upx;
			border-radius: 10upx;
			font-size: $font-sm;
			color: $font-color-dark;
			position:relative;
			.cart-number {
			    position: absolute;
			    top: 0;
			    right: 0;
			    min-width: 36upx;
			    height: 36upx;
			    border-radius: 18upx;
			    background: red;
			    color: #ffffff;
			    text-align: center;
			    line-height: 36upx;
                padding: 0 6rpx;
                z-index: 1;
			}
		}
		.yticon{
			font-size: 48upx;
            image{
                width: 60rpx;
                height: 60rpx;
            }
		}
	}
	.history-section{
		padding: 30upx 0 0;
		margin-top: 20upx;
		background: #fff;
		border-radius: 0 0 10rpx 10rpx;
		.sec-header{
			display:flex;
			align-items: center;
			font-size: $font-base;
			color: $font-color-dark;
			line-height: 40upx;
			margin-left: 30upx;
			.yticon{
				font-size: 44upx;
				color: #5eba8f;
				margin-right: 16upx;
				line-height: 40upx;
			}
		}
		.h-list{
			white-space: nowrap;
			padding: 30upx 30upx 0;
			image{
				display:inline-block;
				width: 160upx;
				height: 160upx;
				margin-right: 20upx;
				border-radius: 10upx;
			}
		}
	}
	.header{
        margin-top: 12rpx;
        padding: 20rpx 30rpx;
        font-size: 32rpx;
        border-bottom: 1px solid #DDDDDD;
        background: #FFFFFF;
        border-radius:10rpx 10rpx 0 0 ;
        text{
            float: right;
            font-size: 26rpx;
            color: rgb(192, 196, 204);
        }
    }
</style>