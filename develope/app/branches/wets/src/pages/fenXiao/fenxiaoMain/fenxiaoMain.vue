<!-- 分销首页 -->
<template>
	<view class="all">
		<head>
			<meta name="format-detection" content="telephone=no">
		</head>
		<view class="top">
			<!-- 第一个tab的头部 -->
			<view class="navigateBar" :style="{height:stateBarHeight + 'rpx','background-color': navBarBgColor}" v-if="isfirsttab">
				<image src="../../../static/fenXiao/backa.png" mode="scaleToFill" @click="back"></image>
				<!-- 搜索框 -->
				<view class="searchBlock" @click="gosearch()" :style="{'background-color': navBarBgColor}">
					<text>{{searchWord}}</text>
				</view>
				<view class="searchtext" @click="gosearch()">搜索</view>
				<image src="../../../static/fenXiao/counta.png" mode="scaleToFill" @click="gocount"></image>
			</view>
			<!-- 非第一个tab的头部 -->
			<view class="navigateBarsecond" :style="{height:stateBarHeight + 'rpx','background-color': navBarBgColor}" v-if="!isfirsttab">
				<image src="../../../static/fenXiao/black_back.png" mode="aspectFit" @click="back"></image>
				<!-- 搜索框 -->
				<view class="searchBlock" @click="gosearch()" :style="{'background-color': navBarBgColor}">
					<text>{{searchWord}}</text>
				</view>
				<view class="searchtext" @click="gosearch()">搜索</view>
			</view>

			<scroll-view id="tab-bar" class="scroll-h" scroll-x="true" show-scrollbar="false" :scroll-into-view="scrollInto"
			 :style="{'background-color':navBarBgColor}">
				<view v-for="(tab,index) in tabBars" :key="tab.id" class="uni-tab-item" :id="tab.id" :data-current="index" @click="ontabtap">
					<view class="itemtext">
						<text class="uni-tab-item-title" :style="{'color':tabtextColor}">{{tab.title}}</text>
						<view class="line" v-if="tabIndex==index" :style="{'background-color':tabtextColor}"></view>
					</view>
				</view>
			</scroll-view>
		</view>
		<!--  -->
		<swiper :current="tabIndex" class="swiper-box" :duration="300" @change="ontabchange" :style="{'flex': 1,'height':swiperHeight+'rpx','top':top}">
			<swiper-item class="swiper-item">

				<hometab :swipperDetail="swipperDetail" :fourlink="fourlink" :goodlist="goodlist" :guesslike="guesslike"></hometab>

			</swiper-item>

			<swiper-item class="swiper-item" v-for="(tab,index1) in newsList" :key="index1">
				<subtab :category_guid="tab.category_guid"></subtab>
			</swiper-item>
		</swiper>

		<!-- 弹窗 -->
		<uni-popup :show="showtip" :type="type" :mask-click="false">
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
			<!-- </view> -->
		</uni-popup>


	</view>
</template>

<script>
	// 缓存每页最多
	const MAX_CACHE_DATA = 100;
	// 缓存页签数量
	const MAX_CACHE_PAGE = 3;
	import hometab from '../hometab/hometab.vue';
	import subtab from '../subtab/subtab.vue';
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
  import API from "@/store/api.js";
	export default {
		components: {
			hometab,
			subtab,
			uniPopup
		},
		onLoad() {
      var that = this;
      if (this.isapp()) {
        that.$util.bridgeAndroidAndIOS(function() {
          that.stateBarHeight = that.globaldata.statusBarHeight + 110 || 110;
          that.getSwiperheight();
          that.getList();
          that.gettop();
        })
      } else {
        that.getSwiperheight();
        that.getList();
        that.gettop();
      }
		},
		onShow() {
      if(this.isapp()){
        this.callHandler('CallNative', {
        	'key': 'stateBarTextBlack',
        	'showstatebar': '0'
        });
      }
		},
		//加载更多
		onReachBottom() {
			// uni.showToast({
			// 	title: '加载更多，main'
			// })
		},
		data() {
			return {
				stateBarHeight: 100, //状态栏和导航栏的总高度
				navBarBgColor: 'rgba(252, 98, 42, 1)', //导航栏背景色
				tabtextColor: 'rgba(255,255,255,1)', //tab栏字体颜色
				navBarTitle: '中华特产馆', //导航栏标题
				searchWord: '搜索商品', //搜索的提示词
				isfirsttab: true,
				tabBars: [],
				swipperDetail: [],
				fourlink: [],
				goodlist: [],
				guesslike: [],
				scrollInto: "",
				tabIndex: 0,
				swiperHeight: 0,
				newsList: [],
				cacheTab: [],
				current_category_guid: 'all',
				memberInfo: {},
				type: '',
				showtip: false,
				couponcode: '',
				top: ''

			}
		},
		methods: {
			gettop() {
				this.top = (this.stateBarHeight + 78) + 'rpx';
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
			//获取swiper高度
			getSwiperheight() {
				let screenheight = 0;
				uni.getSystemInfo({
					complete(res) {
						screenheight = res.screenHeight * 2
					}
				});
				this.swiperHeight = (screenheight - this.stateBarHeight + 50);
			},
			//去搜索页
			gosearch() {
				let that = this
				uni.$once('search', function(data) {
					that.searchWord = data.keyword
					console.log('搜索关键词：' + data.keyword);
				})
				uni.navigateTo({
					url: '../search/search?stateBarHeight=' + (parseFloat(this.stateBarHeight) - 44) + '&category_guid=' + this.current_category_guid +
						'&keyword=' + this.searchWord
				})
			},
			//返回
			back() {
        this.$jump.back();
			},
			//去账户
			gocount() {
				if (this.memberInfo.isMemberFlag == "1") {
					// this.togglePopup();
					uni.navigateTo({
						url: '../myaccount/myaccount'
					})
				} else {
					this.togglePopup();
				}


			},
			ontabtap(e) {
				let index = e.target.dataset.current || e.currentTarget.dataset.current;
				this.switchTab(index);
			},
			ontabchange(e) {
				let index = e.target.current || e.detail.current;
				this.switchTab(index);
			},
			switchTab(index) {
				console.log('------------------index:' + index)
				// if (this.newsList[index] == null ||this.newsList[index].data.length === 0) {
				//      this.getList(index);
				//  }

				if (this.tabIndex === index) {
					return;
				}

				// 缓存 tabId
				// if (this.newsList[this.tabIndex].data.length > MAX_CACHE_DATA) {
				//     let isExist = this.cacheTab.indexOf(this.tabIndex);
				//     if (isExist < 0) {
				//         this.cacheTab.push(this.tabIndex);
				//         //console.log("cache index:: " + this.tabIndex);
				//     }
				// }
				if (index == 0) {
					this.isfirsttab = true;
					this.navBarBgColor = 'rgba(252, 98, 42, 1)';
					this.tabtextColor = 'rgba(255, 255, 255, 1)';
					this.current_category_guid = 'all';
					// uni.$emit('subtabdata'+this.newsList[0].category_guid, {
					// 	// keyword: 'key'
					// })

				} else {
					this.isfirsttab = false;
					this.navBarBgColor = 'rgba(255, 255, 255, 1)';
					this.tabtextColor = 'rgba(252, 98, 42, 1)';
					this.current_category_guid = this.newsList[index - 1].category_guid;
					// console.log('----index:' + index)
					// console.log('------this.newsList.length:' + this.newsList.length)
					if (index < this.newsList.length) {
					//预加载第二页数据
						setTimeout(() => {
							// this.getElementHeight('.swiper-box');
							uni.$emit('subtabdata' + this.newsList[index].category_guid, {
								// keyword: 'key'
							})

						}, 2000);
					}
				}
				this.tabIndex = index;
				this.scrollInto = this.tabBars[index].id;

				// 释放 tabId
				// if (this.cacheTab.length > MAX_CACHE_PAGE) {
				//     let cacheIndex = this.cacheTab[0];
				//     this.clearTabData(cacheIndex);
				//     this.cacheTab.splice(0, 1);
				//     //console.log("remove cache index:: " + cacheIndex);
				// } 
			},
			getList() {
				API.getHomepageInfo({
					// posterId: this.id
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
					this.memberInfo = res.data.result.data.memberInfo;
					this.list = res.data.result.data.elements || [];
					for (var i = 0; i < this.list.length; i++) {
						let dic = this.list[i]
						if (dic.code == 'DISTRIBUTION_CATEGORY') { //分类
							this.tabBars = dic.info.category;
							this.newsList = dic.info.category.slice(1, dic.info.category.length)
							continue;
						} else if (dic.code == 'DISTRIBUTION_SLIDESHOW') { //轮播图
							this.swipperDetail = dic.info.slideshow;
							continue;
						} else if (dic.code == 'DISTRIBUTION_LINK') { //四个模块
							this.fourlink = dic.info.link;
						} else if (dic.code == 'DISTRIBUTION_GOOD_RECOMMEND') { //好物推荐
							this.goodlist = dic.info.good_recommend;

						} else if (dic.code == 'DISTRIBUTION_GUESS_YOU_LIKE') { //猜你喜欢
							this.guesslike = dic.info.guess_you_like;
						}
					}

					setTimeout(() => {
						// this.getElementHeight('.swiper-box');
						uni.$emit('subtabdata' + this.newsList[0].category_guid, {
							// keyword: 'key'
						}) //初始化第二个tab的数据

					}, 2000)

				}).catch(err => {
					// 停止下拉刷新
					uni.stopPullDownRefresh();
					console.log(err);
				})
			},
			getElementHeight(element) {
				setTimeout(() => {
					let query = uni.createSelectorQuery().in(this);
					query.select(element).boundingClientRect();
					query.exec((res) => {
						if (!res) { //如果没获取到，再调一次
							this.getElementHeight();
						} else {
							this.swiperHeight = res[0].height;
						}
					})
				}, 20)
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
		background-color: #F5F5F5;
	}

	.all {
		display: flex;
		flex-direction: column;
		height: 100%;

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

		.top {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			z-index: 10;
			display: flex;
			flex-direction: column;

			// 自定义导航栏
			.navigateBar {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				padding: 50rpx 0 0 0;

				image {
					margin-left: 20rpx;
					margin-right: 20rpx;
					padding: 8rpx;
					width: 70rpx;
					height: 65rpx;
				}

				// 搜索模块
				.searchBlock {
					position: relative;
					width: 450rpx;
					text-align: center;
					background: #FFF;


					text {
						display: block;
						height: 60rpx;
						overflow: hidden;
						line-height: 60rpx;
						margin: 0rpx 20rpx 0 0rpx;
						background: url(../../../static/teChanZhuanQu/searchse.png) no-repeat left 20rpx center #F2F2F2;
						background-size: 36rpx 36rpx;
						border-radius: 30rpx;
						padding: 5rpx 40rpx 5rpx 66rpx;
						text-align: left;
						font-size: 26rpx;
						color: #969696;

					}
				}

				.searchtext {
					width: 100rpx;
					font-size: 28rpx;
					color: #FFFFFF;

					/** 对象作为伸缩盒子模型显示 **/
					-webkit-line-clamp: 1;
					overflow: hidden;
					text-overflow: ellipsis;
					-webkit-box-orient: vertical;

					// overflow: hidden;
					// text-overflow: ellipsis;
					// display: -webkit-box;
					// -webkit-line-clamp: 1;
					// -webkit-box-orient: vertical;
					// word-wrap: break-word;
					// max-height: 50rpx;
					// word-break: break-all;
				}
			}

			// 自定义导航栏 非第一个tab
			.navigateBarsecond {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
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
						height: 60rpx;
						overflow: hidden;
						line-height: 60rpx;
						display: block;
						margin: 0rpx 20rpx 0 0rpx;
						background: url(../../../static/teChanZhuanQu/searchse.png) no-repeat left 20rpx center #F2F2F2;
						background-size: 36rpx 36rpx;
						border-radius: 30rpx;
						padding: 5rpx 40rpx 5rpx 66rpx;
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

		.swiper-box {
			position: relative;
			background-color: #F5F5F5;
			// height: calc(100% - 400rpx);
			// height: 900rpx;

			.swiper-item {
				// flex: 1;
				// flex-direction: column;
				// background-color: #00ff00;
				// height: calc(100% - 400rpx);
				// height: 900rpx;

			}
		}


	}
</style>
