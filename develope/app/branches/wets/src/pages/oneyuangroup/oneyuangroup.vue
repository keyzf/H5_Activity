<!-- 一元拼购首页 -->
<template>
	<view class="all">
		<head>
			<meta name="format-detection" content="telephone=no">
		</head>
		<view class="navigateBar" :style="{height:stateBarHeight + 'rpx'}">
			<image class="navBackImage" src="../../static/fenXiao/black_back.png" mode="aspectFit" @click="back"></image>
			<view class="middle">{{navBarTitle}}</view>
			<view class="right" @click="goExplain">拼购说明</view>
		</view>
		<view :style="{height:stateBarHeight + 'rpx'}"></view>
		<!-- 轮播图 -->
		<view class="swipperpic" >
			<view class="swipper">
				<swiper class="carousel" autoplay circular>
					<swiper-item class="carousel-item" v-for="(item,index) in swipperDetail" :key="index" @click="goswiper(item)">
						<img :src="item.url" />
					</swiper-item>
				</swiper>
			</view>
		</view>
		
		<view class="goodsitem" v-for="(item,index) in productlist" :key="index">
			<goodsItemTwo :productid='item.productId +""' :mainpic='item.pic' :goodDes='item.feature_short' :tag='item.nameHeader' :goodTitle='item.name' :goodPrice='item.newprice' :goodOriginPrice="item.price" @clickGoodDetail='goodsdetail(item)'></goodsItemTwo>
		</view>
		
	</view>
</template>

<script>
  import API from "@/store/api.js";
	import goodsItemTwo from '../../components/lmw/oneyuangroup/oneyuangoodsitem.vue'
	export default {
		components: {
			goodsItemTwo,
		},
		onLoad() {
      var that = this;
      if (this.isapp()) {
        that.$util.bridgeAndroidAndIOS(function() {
		that.stateBarHeight = that.globaldata.statusBarHeight + 115 || 115;
          that.loadData('refresh');
        })
		
        
      } else {
        // 获取用户福利列表
        that.loadData('refresh');
      }
		},
		onPullDownRefresh() {
			setTimeout(()=>{
				this.nextCursorMark = '';
				this.loadData('refresh', 1);
			},100)
			
		},
		//加载更多
		// onReachBottom() {
		// 	this.loadData('add', 1);
		// },
		data() {
			return {
				stateBarHeight: 88, //状态栏和导航栏的总高度
				navBarTitle:'1元拼购',
				loadingType: 'more',
				nextCursorMark: '',
				pagesize: 10,
				lastid: '', //用来临时保存nextCursorMark
				swipperDetail: [],
				productlist:[],
				explainurl:''
			};
		},
		methods:{
			//返回
			back() {
				this.$jump.back();
			},
			//轮播图跳转
			goswiper(item) {
				// uni.showToast({
				// 	title:item.h5
				// })
				switch (item.jump_type) {
					case 1: //跳转h5
						if (this.isapp()) {
						  this.callHandler('CallNative', {
						    'key': 'h5Url',
						    'h5Url': item.h5
						  });
						} else {
						  uni.navigateTo({
						    url: '/pages/establishment/strategy?type=h5Url&information_url=' + item.h5
						  })
						}
						break;
				}
			},
			//跳转商品详情
			goodsdetail(item){
        if(this.isapp()){
          this.$jump.jumpMethod(item.productId);
        }else{
          uni.navigateTo({
              url: "/pages/product/product?productid="+ item.productId
          });
        }
			},
			//跳转拼购说明
			goExplain(){
				if(!this.isEmpty(this.explainurl)){
          if (this.isapp()) {
            this.callHandler('CallNative', {
              'key': 'h5Url',
              'h5Url': this.explainurl
            });
          } else {
            uni.navigateTo({
              url: '/pages/establishment/strategy?type=h5Url&information_url=' + this.explainurl
            })
          }
				}
			},
			
			//加载商品 ，带下拉刷新和上滑加载
			async loadData(type = 'add', loading) {
				// uni.showToast({
				// 	title:this.lastid+''
				// })
				// this.searchWord = this.keyword;
				// uni.hideLoading();
				// uni.stopPullDownRefresh();
				//没有更多直接返回
				if (type === 'add') {
					if (this.loadingType === 'nomore') {
						return;
					}
					this.loadingType = 'loading';
					this.nextCursorMark = this.lastid;
				} else {
					this.loadingType = 'more';
				}
				if (type === 'refresh') {
					this.productlist = [];
				}
			
				API.oneyuanList({
					// filter: '命题'
					lid:this.lastid,
					pagesize:this.pagesize
				}).then(res => {
					console.log(res);
					// 停止下拉刷新
					uni.stopPullDownRefresh();
			
					if (res.data.code != 0) {
						uni.showModal({
							title: '提示',
							content: res.data.msg,
							showCancel: false
						})
						return
					}
					this.swipperDetail = res.data.result.data.piclist||[];
					this.navBarTitle = res.data.result.data.title;
					this.explainurl = res.data.result.data.rule;
					let list = res.data.result.data.productList || [];
					this.lastid = list[list.length-1].id;
					this.loadingType = list.length < this.pagesize ? 'nomore' : 'more';
					if (list.length > 0) {
			
						// this.goodsList = this.goodsList.concat();
						this.productlist = this.productlist.concat(list);
					}
					if (type === 'refresh') {
						if (loading == 1) {
							uni.hideLoading();
						} else {
							uni.stopPullDownRefresh();
						}
					}
			
				}).catch(err => {
					// 停止下拉刷新
					uni.stopPullDownRefresh();
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
	
	page{
		background-color: #f5f5f5;
	}

.all{
	
	// 自定义导航栏
	.navigateBar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 10;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		background-color: #FFFFFF;
		padding-bottom: 10rpx;
	
		.navBackImage {
			margin-left: 20rpx;
			margin-right: 40rpx;
			padding: 8rpx;
			width: 50rpx;
			height: 50rpx;
		}
	
		.middle {
			position: relative;
			height: 50rpx;
			width: 70%;
			text-align: center;
			font-size: 34rpx;
			color: #333333;
			font-weight: bold;
		}
	
		.right {
			margin-left: 20rpx;
			margin-right: 20rpx;
			// padding: 8rpx;
			width: 15%;
			height: 50rpx;
			font-size: 26rpx;
			text-align: center;
			padding-top: 10rpx;
			color: #333333;
		}
	}
	
	
	// 轮播图
	.swipperpic {
		// background: rgba(252, 98, 42, 0);
		height: 320rpx;
		position: relative;
	
		// 轮播图
		.swipper {
			height: 100%;
			position: absolute;
			top: 0rpx;
			left: 0rpx;
			right: 0rpx;
	
			.carousel {
				width: 100%;
				height: 100%;
			}
	
			.carousel-item {
	
				img {
					width: 100%;
					height: 100%;
					// border-radius: 10rpx;
				}
	
			}
		}
	}
	
	
	.goodsitem {
		width: 100%;
		margin: 0rpx 0rpx;
	}
	
}
</style>