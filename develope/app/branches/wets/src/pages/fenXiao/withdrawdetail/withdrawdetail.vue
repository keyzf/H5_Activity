<!-- 提现明细 -->
<!-- 余额明细 -->
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
	<view class="line" :style="{'margin-top':(stateBarHeight+1)+'rpx'}"></view>
	<scroll-view class="scroll" scroll-y="true" enableBackToTop="true" @scrolltolower="loadMore" v-bind:style="{height:scrollH+'rpx'}" show-scrollbar="false">
	<view class="list" v-for="(item,index) in data.list" :key="index">
		<moneyItem @click='clickitem' :reason='item.title' :date='item.hint' :money='item.money+""' :flag='0'></moneyItem>
	</view>
	
	<emptyView class="emptyview" v-if="data.list.length<1"></emptyView>
		<view class="loading-more" v-if="data.isLoading || data.list.length > 4">
			<text class="loading-more-text">{{data.loadingText}}</text>
		</view>
	</scroll-view>
	</view>
</template>

<script>
	import moneyItem from '../../../components/lmw/moneyitem.vue'
	import API from "@/store/api.js";
	export default {
		components:{
			moneyItem
		},
		computed: {
			scrollH: function() {
				let sys = uni.getSystemInfoSync();
				let winWidth = sys.windowWidth;
				let winrate = 750 / winWidth;
				let winHeight = parseInt(sys.windowHeight * winrate)
				return winHeight
			}
		},
		onLoad(o) {
			this.stateBarHeight = this.globaldata.statusBarHeight+110||110;
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
				navBarTitle: '提现明细', //导航栏标题
				list:[],
				welfareid: '34',
				pagesize: '10',
				data: {
					isLoading: false,
					hasmore: true,
					refreshText: "",
					loadingText: '加载更多...',
					list: [],
					currrenIndex: -1
				},
			
		}
		},
		onLoad() {
			this.stateBarHeight = this.globaldata.statusBarHeight+110||110;
			// this.stateBarHeight = this.globaldata.statusBarHeight+85||100;
			this.getlistdata('');
		},
		//下拉刷新
		onPullDownRefresh() {
			this.resetData();
			setTimeout(this.getlistdata(''), 2000);
		},
		
		methods: {
			//返回
			back() {
				this.$jump.back();
			},
			clickitem (v){
				// uni.showModal({
				// 	title:'jj',
				// 	content:v.value
				// })
			},
			resetData() {
				this.data = {
					isLoading: false,
					hasmore: true,
					refreshText: "",
					loadingText: '加载更多...',
					list: [],
					currrenIndex: -1
				};
				this.page = 1;
			},
			//加载更多
			loadMore() {
				console.log("触发加载更多")
				if (this.data.hasmore) {
					console.log("加载更多")
					this.getlistdata(this.data.list[this.data.list.length - 1].id);
				}
			},
			getlistdata(lid){
				this.data.hasmore = false;
				API.getMoneyDetail({
					// welfareid:this.welfareid,
					// pagesize:'10',
					// lid:lid
				}).then(res => {
					uni.stopPullDownRefresh();
					console.log(res);
					if (res.data.result.data.histories.length < this.pagesize) {
						this.data.loadingText = "没有更多数据了"
						this.data.hasmore = false;
					} else {
						// this.page = page + 1;
						this.data.hasmore = true;
					}
					this.data.list = this.data.list.concat(res.data.result.data.histories);
					
				}).catch(err => {
					console.log(err);
					uni.stopPullDownRefresh();
					this.data.hasmore = true;
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
		height: 100%;
		width: 100%;
		background-color: #f5f5f5;
	}
	.all{
		
		.top {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			z-index: 10;
			display: flex;
			flex-direction: column;
		
		
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
		}
		
		.line{
			height: 1rpx;
		}
		
		.scroll {
			width: 100%;
			display: flex;
			flex-direction: column;
			// margin-top: 91rpx;
			
			.emptyview{
				width: 100%;
				height: 600rpx;
			}
		
			.top-holdon {
				height: 91rpx;
			}
		
			.uni-margin-wrap {
				width: 750rpx;
		
				.swiper {
					height: 300rpx;
		
					.swiper-item {
						display: block;
						height: 300rpx;
						line-height: 300rpx;
						text-align: center;
		
						.image {
							width: 100%;
							height: 100%;
						}
					}
				}
			}
		
			.loading-more {
				align-items: center;
				justify-content: center;
				padding-top: 10px;
				padding-bottom: 10px;
				text-align: center;
		
				.loading-more-text {
					font-size: 28upx;
					color: #999;
				}
			}
		
		}
		
	}

</style>
