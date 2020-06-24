<!-- 搜索结果页面 -->
<template>
	<view class="all">
		<head>
			<meta name="format-detection" content="telephone=no">
		</head>
		<view class="top">

			<!-- 非第一个tab的头部 -->
			<view class="navigateBarsecond" :style="{height:stateBarHeight + 'rpx','background-color': navBarBgColor}">
				<image src="../../../static/fenXiao/black_back.png" mode="aspectFit" @click="back"></image>
				<!-- 搜索框 -->
				<view class="searchBlock" @click="back()" :style="{'background-color': navBarBgColor}">
					<text>{{searchWord}}</text>
				</view>
				<view class="searchtext" @click="back()">搜索</view>
			</view>


			<view class="navbar">
				<view class="nav-item" :class="{ current: condition === 1 || condition === 5}" @click="tabClick(1)">
					<text>{{ sort == 1 ? '综合' : '新品优先' }}</text>
					<view class="p-box"><text :class="{ active: condition === 5 || condition === 1 }" class="yticon icon-shang xia"></text></view>
				</view>
				<view class="nav-item" :class="{ current: condition === 2 }" @click="tabClick(2)">销量</view>
				<view class="nav-item" :class="{ current: condition == 3 || condition == 4 }" @click="tabClick(3)">
					<text>价格</text>
					<view class="p-box">
						<text :class="{ active: condition === 4 }" class="yticon icon-shang"></text>
						<text :class="{ active: condition === 3 }" class="yticon icon-shang xia"></text>
					</view>
				</view>
			</view>

		</view>

		<view class="products">
			<view class="productsitem" v-for="(item,index) in productlist" :key="index">
				<productitem :item=item @clickGoodDetail='goodsdetail(item)'></productitem>
			
			</view>
			<emptyView v-if="productlist.length<1" :style="{'width':'750rpx','height':'500rpx'}" emptytext='暂无搜索结果'></emptyView>
			<uni-load-more v-if="productlist.length>0" :status="loadingType" class="loadmore"></uni-load-more>
		</view>

	</view>
</template>

<script>
	import productitem from '../homeproductitem/homeproductitem.vue';
  import API from "@/store/api.js";
	export default {
		components: {
			productitem
		},
		onLoad(o) {
			this.stateBarHeight = this.globaldata.statusBarHeight+110||110;
			this.keyword = o.keyword;
			console.log("======load,keyword:"+this.keyword);
			this.category_guid = o.category_guid;
			this.searchWord = o.keyword;
			// uni.showModal({
			// 	title:this.keyword,
			// 	content:this.category_guid
			// })
			console.log(this.category_guid)
			this.loadData('refresh');
		},
		onShow() {
      if(this.isapp()){
        this.callHandler('CallNative', {
        	'key': 'stateBarTextBlack',
        	'showstatebar':'0'
        });
      }
		},
		onPullDownRefresh() {
			setTimeout(()=>{
				this.nextCursorMark = '';
				this.loadData('refresh', 1);
			},600)
			
		},
		//加载更多
		onReachBottom() {
			this.loadData('add', 1);
		},
		data() {
			return {
				stateBarHeight: 100, //状态栏和导航栏的总高度
				navBarBgColor: '#ffffff', //导航栏背景色
				tabtextColor: 'rgba(255,255,255,1)', //tab栏字体颜色
				navBarTitle: '中华特产馆', //导航栏标题
				searchWord: '搜索商品', //搜索的提示词
				loadingType: 'more',
				nextCursorMark: '',
				pagesize: 10,
				lastid: '', //用来临时保存nextCursorMark
				keyword: '',
				sort: 1,
				condition: 5,
				productlist: [],
				category_guid: ''
			};
		},
		methods: {
			//返回
			back() {
        this.$jump.back();
			},
			//商品详情
			goodsdetail(item) {
				// uni.showToast({
				// 	title: '商品详情' + item.id
				// })
				uni.navigateTo({
					url: '../productDetail/productDetail?skuid=' + item.skuid
				})
			},
			//加载更多
			lower(e) {
				console.log(e);
				// uni.showToast({
				// 	title: '滚动到底部'
				// })

				// setTimeout(() => {
				this.loadData('add', 1);
				// }, 600)
			},
			//筛选点击
			tabClick(index) {
				console.log('--------------index:' + index);
				if (this.condition === index && index !== 3 && index !== 1) {
					return;
				}
				this.nextCursorMark = '';
				if (index === 3) {
					this.condition = this.condition === 3 ? 4 : 3;
				} else if (index === 1) {
					this.condition = this.condition === 1 ? 5 : 1;
					this.sort = this.condition === 1 ? 1 : 5;
				} else {
					this.condition = index;
				}

				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				});

				uni.showLoading({
					title: '正在加载'
				});

				setTimeout(() => {
					this.loadData('refresh', 1);
				}, 600)

			},
			//加载商品 ，带下拉刷新和上滑加载
			async loadData(type = 'add', loading) {
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

				console.log('------------this.api-this.keyword:'+this.keyword)
				API.homeCategoryList({
					categoryGuid: this.category_guid,
					keyword:this.keyword,
					condition: this.condition + '',
					nextCursorMark: this.nextCursorMark,
					pagesize: this.pagesize,
					// filter: '命题'
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
					let list = res.data.result.data.list || [];
					this.lastid = res.data.result.data.nextCursorMark;
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
	.all {
		display: flex;
		// flex-direction: column;
		height: 100%;


		.products {
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			// margin: 82rpx 0 0 0;
			// padding: 0 15rpx;
			position: relative;
			top: 185rpx;

			.loadmore {
				width: 100%;
				// text-align: center;
			}

			.productsitem {
				// width: 98%;
				margin: 0rpx 5rpx;
			}

		}


		.top {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			z-index: 10;
			display: flex;
			flex-direction: column;

			.navbar {
				// position: fixed;
				display: flex;
				width: 100%;
				height: 80upx;
				// margin: 30rpx 0 0 0;
				background: #fff;
				box-shadow: 0 2upx 10upx rgba(0, 0, 0, 0.06);
				z-index: 10;

				.nav-item {
					flex: 1;
					display: flex;
					justify-content: center;
					align-items: center;
					height: 100%;
					font-size: 30upx;
					color: rgba(51, 51, 51, 1);
					position: relative;

					&.current {
						color: rgba(252, 98, 42, 1);

						&:after {
							content: '';
							position: absolute;
							left: 50%;
							bottom: 0;
							transform: translateX(-50%);
							width: 120upx;
							height: 0rpx;
							border-bottom: 4upx solid rgba(252, 98, 42, 1);
						}
					}
				}

				.p-box {
					display: flex;
					flex-direction: column;

					.yticon {
						display: flex;
						align-items: center;
						justify-content: center;
						width: 30upx;
						height: 14upx;
						line-height: 1;
						margin-left: 4upx;
						font-size: 26upx;
						color: #888;

						&.active {
							color: rgba(252, 98, 42, 1);
						}
					}

					.xia {
						transform: scaleY(-1);
					}
				}

				.cate-item {
					display: flex;
					justify-content: center;
					align-items: center;
					height: 100%;
					width: 80upx;
					position: relative;
					font-size: 44upx;

					&:after {
						content: '';
						position: absolute;
						left: 0;
						top: 50%;
						transform: translateY(-50%);
						border-left: 1px solid #ddd;
						width: 0;
						height: 36upx;
					}
				}
			}

			// 自定义导航栏 非第一个tab
			.navigateBarsecond {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				z-index: 20;
				padding: 50rpx 0 0 0;
				padding-bottom: 0rpx;

				image {
					margin-left: 20rpx;
					margin-right: 20rpx;
					padding: 8rpx;
					width: 50rpx;
					height: 50rpx;
				}

				// 搜索模块
				.searchBlock {
					position: relative;
					width: 650rpx;
					text-align: center;
					background: #FFF;

					text {
						display: block;
						height: 60rpx;
						margin: 0rpx 20rpx 0 0rpx;
						background: url(../../../static/teChanZhuanQu/searchse.png) no-repeat left 20rpx center #F2F2F2;
						background-size: 36rpx 36rpx;
						border-radius: 30rpx;
						padding: 14rpx 40rpx 14rpx 66rpx;
						text-align: left;
						font-size: 26rpx;
						color: #969696;
					}
				}

				.searchtext {
					width: 100rpx;
					font-size: 28rpx;
					color: rgba(51, 51, 51, 1);
				}

			}

			.scroll-h {
				width: 750rpx;
				height: 80rpx;
				white-space: nowrap;
				background-color: rgba(252, 98, 42, 1);
				// background-color: #ee3847;

				/* flex-wrap: nowrap; */
				/* border-color: #cccccc;
		border-bottom-style: solid;
		border-bottom-width: 1px; */

				.uni-tab-item {
					flex-wrap: nowrap;
					// padding-left: 34upx;
					width: 20%;
					padding: 0 10rpx;
					// padding-right: 34upx;
					// background-color: #ffff00;
					display: inline-block;

					.itemtext {

						display: flex;
						flex-direction: column;
						text-align: center;

						.uni-tab-item-title {
							color: #fff;
							font-size: 30upx;
							height: 65upx;
							line-height: 80upx;
							flex-wrap: nowrap;
							white-space: nowrap;
						}

						.line {
							height: 4rpx;
							background-color: #FFFFFF;
						}
					}


				}
			}
		}
	}
</style>
