<!-- 分销subtab页面 -->
<template>
	<view class="all">
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
		<scroll-view v-bind:style="{'height':'calc(100% - 0rpx)'}" enableBackToTop="true" scroll-y="true" @scrolltolower="lower">


			<view class="products">
				<view class="productsitem" v-for="(item,index) in productlist" :key="index">
					<productitem :item=item @clickGoodDetail='goodsdetail(item)'></productitem>

				</view>
				<emptyView v-if="productlist.length<1" :style="{'width':'750rpx','height':'500rpx'}"></emptyView>
				<uni-load-more class="loadmore" v-if="productlist.length>0" :status="loadingType"></uni-load-more>
			</view>

		</scroll-view>
	</view>
</template>

<script>
	import productitem from '../homeproductitem/homeproductitem.vue';
  import API from "@/store/api.js";
	export default {
		components: {
			productitem
		},
		props: {
			category_guid: {
				type: String,
				default: ''
			},
		},
		created() {
			// uni.showLoading({
			//     title: 
			// });
			console.log(this.category_guid)
			let that = this;
			//加载数据
			uni.$once('subtabdata'+this.category_guid, function(data) {
				// that.searchWord = data.keyword
				// console.log('搜索关键词：' + data.keyword);
				that.loadData('refresh');
			})
		},
		data() {
			return {
				loadingType: 'more',
				nextCursorMark: '',
				pagesize: '10',
				lastid: '', //用来临时保存nextCursorMark
				keyword: '',
				sort: 1,
				condition: 5,
				productlist: [],
			};
		},
		onLoad() {
			console.log("sub加载");
			console.log(category_guid + '');
		},
		onShow() {
			console.log("sub加载onShow");
			console.log(category_guid);
		},
		//下拉刷新
		onPullDownRefresh() {
			this.loadData('refresh');
		},

		methods: {

			//商品详情
			goodsdetail(item) {
				// uni.showToast({
				// 	title: '商品详情'+item.id
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
				uni.hideLoading();
				uni.stopPullDownRefresh();
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

				API.homeCategoryList({
					categoryGuid: this.category_guid,
					keyword: this.keyword,
					condition: this.condition,
					nextCursorMark: this.nextCursorMark,
					pagesize: this.pagesize
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
		}
	}
</script>

<style lang="scss">
	.all {

		.navbar {
			position: fixed;
			display: flex;
			width: 100%;
			height: 80rpx;
			padding: 8rpx 0 0 0;
			margin: 0rpx 0 0 0;
			background: #fff;
			box-shadow: 0 2upx 10upx rgba(0, 0, 0, 0.06);
			z-index: 100;

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


		.products {
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			// margin: 82rpx 0 0 0;
			// padding: 0 15rpx;
			position: relative;
			top: 90rpx;

			.loadmore {
				width: 100%;
			}

			.productsitem {
				// width: 98%;
				margin: 0rpx 5rpx;
			}

		}
	}
</style>
