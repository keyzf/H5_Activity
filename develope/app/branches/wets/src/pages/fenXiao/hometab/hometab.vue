<!-- 分销首页 hometab -->
<template>
	<view class="all">
		<!-- <view class="firsttab"> -->
		<scroll-view class="itemall" v-bind:style="{'height':'calc(100% - 0rpx)'}" enableBackToTop="true" scroll-y="true" @scrolltolower="lower">


			<view class="background"></view>
			<!-- 轮播图 -->
			<view class="swipperpic">
				<swiper class="carouselpic" autoplay circular indicator-dots indicator-color='rgba(195, 195, 195, 0.3)'
				 indicator-active-color='#fff'>
					<swiper-item class="carousel-itempic" v-for="(item,index) in swipperDetail" :key="index" @click="goswiper(item)">
						<image :src="item.pic_url" mode="scaleToFill" />
					</swiper-item>
				</swiper>
			</view>

			<!-- 4个图片功能模块选项 -->
			<view class="partner">
				<view class="partitem" v-for="(item ,index1) in fourlink" :key="index1" >
					<view class="partnericon" @click="fourpicclick(index1+1,item)">
						<image :src="item.pic_url"></image>
					</view>
				</view>
				<!-- <view class="partitem">
					<view class="partnericon" @click="fourpicclick(2)">
						<image src=""></image>
					</view>
				</view>
				<view class="partitem">
					<view class="partnericon" @click="fourpicclick(3)">
						<image src="../../../static/fenXiao/levelup.png"></image>
					</view>
				</view>
				<view class="partitem">
					<view class="partnericon" @click="fourpicclick(4)">
						<image src="../../../static/fenXiao/invate.png"></image>
					</view>
				</view> -->
			</view>

			<!-- 好物推荐 -->
			<view class="goodproduct">
				<view class="title">
					<view class="title_one">好物推荐</view>
					<view class="title_two">选好货</view>
					<view class="title_two">更赚钱</view>
				</view>

				<scroll-view id="tab-bar" class="goodproduct_scroll" scroll-x="true" show-scrollbar="false">
					<view v-for="(tab,index) in goodlist" :key="tab.id" class="uni-tab-item" :id="tab.id" :data-current="index" >
						<view class="partnericon" @click="ongoodproductclick(tab)">
							<image :src="tab.picInfo.url"></image>
						</view>
					</view>
				</scroll-view>

			</view>

			<!-- 为您推荐 -->
			<view class="recommend">
				<view class="title">
					<image class="heart" src="../../../static/fenXiao/guselike.png" mode="scaleToFill"></image>
				</view>
				<view class="goods">
					<view class="goodsitem" v-for="(item,index) in guesslike" :key="index">
						<goodsItemTwo :productid='item.productid +""' :mainpic='item.picInfo.url' :actimgurl='item.newOnShelvesProductIcon' :goodDes='item.feature_short'
						 :tag='item.selftext' :goodTitle='item.productname' :goodPrice='item.newprice' :bottomtag="item.commission_label" :goodOriginPrice="item.commission"
						 :coupontext="item.coupon_label" :couponvalue="item.coupon_value" @clickGoodDetail='goodsdetail(item)'></goodsItemTwo>
					</view>
				</view>
				<!-- <uni-load-more :status="loadingType"></uni-load-more> -->
			</view>

		</scroll-view>
	</view>
</template>

<script>
	import goodsItemTwo from '../../../components/lmw/fenxiaohomegoodsitem.vue'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		name: 'hometab',
		components: {
			goodsItemTwo,
			uniLoadMore
		},
		props: {
			guesslike: {//猜你喜欢
				type: Array,
				default () {
					return []
				}
			},
			swipperDetail: {//轮播图
				type: Array,
				default () {
					return []
				}
			},
			goodlist: {//好物推荐
				type: Array,
				default () {
					return []
				}
			},
			fourlink:{//四个选项的链接
				type: Array,
				default () {
					return []
				}
			}
		},
		onLoad() {
			console.log("hometab加载");
			// console.log(this.homedata);
		},
		onShow() {
			console.log("hometab加载onShow");
		},
		// //加载更多
		// onReachBottom(e) {
		// 	console.log(e);
		// 	uni.showToast({
		// 		title:'加载更多，hometab'
		// 	})
		// 	// this.gorecommendmore(this.recommendelementId,this.recommendindex);
		// },
		data() {
			return {
				loadingType: 'more',
			}
		},
		methods: {
			getswipperDetail(){
				for (var i = 0; i < this.homedata.length; i++) {
					let dic = this.homedata[i]
					 if(dic.code == 'DISTRIBUTION_SLIDESHOW'){//轮播图
						this.swipperDetail  = dic.info.slideshow;
					}
					 
				}
			},
			
			// getswiperdata()
			//加载更多
			lower(e){
				console.log(e);
				// uni.showToast({
				// 	title: '滚动到底部'
				// })
			},
			//轮播图点击事件
			goswiper(item) {
				// uni.showToast({
				// 	title: '轮播图点击'+item.id
				// })
			},
			//四个图点击事件
			fourpicclick(type,item) {
				switch(item.describle){
					case '邀请机制':
					// let that = this;
					// uni.$once('bindhaveAlipayAccount', function(data) {
					// 	if (data.keyword == '1') {
					// 		that.haveAlipayAccount === '1'
					// 	}
					// })
					uni.navigateTo({
						url:'../inviteCode/inviteCode'
					})
					break;
					default:
          if (this.isapp()) {
            this.callHandler('CallNative', {
            	'key': 'stateBarTextBlack',
            	'showstatebar': '1'
            });
            this.callHandler('CallNative', {
            	'key': 'h5Url',
            	'h5Url':item.url,
            	'title':item.describle
            });
          } else {
            uni.navigateTo({
              url:'/pages/establishment/help?type=0&title='+ item.describle +'&url='+item.url
            })
          }
					break;
				}
			},
			
			//好物推荐点击item
			ongoodproductclick(item){
				// uni.showToast({
				// 	title: '好物推荐点击'+item
				// })
				uni.navigateTo({
					url:'../productDetail/productDetail?skuid='+item.skuid
				})
			},
			
			//商品详情
			goodsdetail(item){
				// uni.showToast({
				// 	title: '商品详情'+item.id
				// })
				
				uni.navigateTo({
					url:'../productDetail/productDetail?skuid='+item.skuid
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

	// 第一个tab
	.all {
		.itemall {
			flex: 1;
			display: flex;
			flex-direction: column;

			.background {
				height: 200rpx;
				width: 100%;
				background-color: rgba(252, 98, 42, 1);
				position: absolute;
				z-index: 0;
			}

			// 轮播图
			.swipperpic {
				// background: rgba(252, 98, 42, 0);
				margin: 0rpx 0;
				height: 290rpx;

				.carouselpic {
					width: 100%;
					height: 100%;
				}

				.carousel-itempic {
					width: 100%;
					// padding: 0 5rpx 15rpx;

					image {
						width: 710rpx;
						margin-left: 20rpx;
						margin-right: 20rpx;
						border-radius: 10rpx;
					}
				}
			}

			/* 4张图片 */
			.partner {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				flex-wrap: wrap;
				padding: 15rpx 30rpx 10rpx;
				background: #fff;

				.partitem {
					width: 50%;
					display: flex;
					flex-direction: column;
					align-items: center;
					padding: 0 10rpx;

					/* 原图标颜色太深,不想改图了,所以加了透明度 */
					image {
						width: 330rpx;
						height: 140rpx;
						margin-bottom: 5rpx;
					}
				}

			}

			/* 好物推荐 */
			.goodproduct {
				display: flex;
				flex-direction: column;
				background-color: #ffffff;

				.title {
					display: flex;
					flex-direction: row;
					align-items: flex-end;
					margin: 0 30rpx;

					.title_one {
						color: rgba(252, 98, 42, 1);
						font-size: 38rpx;
					}

					.title_two {
						color: rgba(146, 146, 146, 1);
						font-size: 24rpx;
						margin-left: 10rpx;
					}
				}

				.goodproduct_scroll {
					width: 750rpx;
					height: 180rpx;
					white-space: nowrap;

					.uni-tab-item {
						flex-wrap: nowrap;
						width: 31%;
						padding: 0 30rpx;
						display: inline-block;

						.partnericon {
							display: flex;
							flex-direction: column;
							margin: 10rpx 0;
							text-align: center;

							/* 原图标颜色太深,不想改图了,所以加了透明度 */
							image {
								width: 200rpx;
								height: 140rpx;
								margin-bottom: 5rpx;
							}

						}

					}
				}
			}

			//推荐商品模块
			.recommend {
				display: flex;
				flex-direction: column;
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
		}
	}
</style>
