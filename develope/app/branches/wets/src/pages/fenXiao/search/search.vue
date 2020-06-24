<template>
	<view class="content">
		<view class="search-box" :style="{'padding-top':stateBarHeight + 'rpx'}">
			<view class="search-left" @tap="returngo()">
				<uni-text class="yticon icon-zuo"></uni-text>
			</view>
			<!-- 原样式 如果使用原样式，恢复下方注销代码 -->
			<view class="input-box">
				<input type="text" maxlength="15" focus :placeholder="defaultKeyword" v-model="keyword" @confirm="doSearch(false)" placeholder-class="placeholder-class"
				 confirm-type="search">
			</view>
			<view class="search-btn" @tap="doSearch(false)">搜索</view>
			<!-- 原样式 end -->
		</view>
		<view class="search-keyword" @touchstart="blur">
			<scroll-view class="keyword-box" v-show="!isShowKeywordList" scroll-y>
				<view class="keyword-block" v-if="oldKeywordList.length>0">
					<view class="keyword-list-header">
						<view>搜索记录</view>
						<view>
							<image @tap="oldDelete" src="/static/delete.png"></image>
						</view>
					</view>
					<view class="keyword">
						<view v-for="(keyword,index) in oldKeywordList" @tap="doSearch(keyword)" :key="index">{{keyword}}</view>
					</view>
				</view>
				<view class="emptyView" v-else>
					暂无搜索记录
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				stateBarHeight: '',
				defaultKeyword: "搜索商品",
				keyword: "",
				oldKeywordList: [],
				hotKeywordList: [],
				keywordList: [],
				forbid: '',
				isShowKeywordList: false,
				category_guid: ''
			}
		},
		onLoad(e) {
			// this.stateBarHeight = this.globaldata.statusBarHeight + 110||110;
			this.stateBarHeight = e.stateBarHeight;
			this.category_guid = e.category_guid;
			// this.keyword = e.keyword
			this.init();
		},
		onShow() {
			if (this.$wx.isWechat()) this.$wx.share();
      if(this.isapp()){
        this.callHandler('CallNative', {
        	'key': 'stateBarTextBlack',
        	'showstatebar': '0'
        });
      }
			
		},
		methods: {
			returngo() {
				uni.navigateBack();
			},
			init() {
				this.loadOldKeyword();
			},
			blur() {
				uni.hideKeyboard()
			},
			//加载历史搜索,自动读取本地Storage
			loadOldKeyword() {
				uni.getStorage({
					key: 'fenXiaoSearchOldKeys',
					success: (res) => {
						var OldKeys = JSON.parse(res.data);
						this.oldKeywordList = OldKeys;
					}
				});
			},
			//监听输入
			inputChange(event) {
				//兼容引入组件时传入参数情况
				var keyword = event.detail ? event.detail.value : event;
				if (!keyword) {
					this.keywordList = [];
					this.isShowKeywordList = false;
					return;
				}
				//以下示例截取淘宝的关键字，请替换成你的接口
				// this.$ajax.get('search/searchSuggest', {keyword:keyword}).then(res => {
				//     if(res.data.result.data.length == 0){
				//         this.isShowKeywordList = false;
				//     }else{
				//         this.isShowKeywordList = true;
				//         this.keywordList = res.data.result.data;
				//     }
				// });
			},
			//顶置关键字
			setkeyword(data) {
				this.keyword = data.keyword;
			},
			//清除历史搜索
			oldDelete() {
				uni.showModal({
					content: '确定清除历史搜索记录？',
					success: (res) => {
						if (res.confirm) {
							this.oldKeywordList = [];
							uni.removeStorage({
								key: 'fenXiaoSearchOldKeys'
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			//热门搜索开关
			hotToggle() {
				this.forbid = this.forbid ? '' : '_forbid';
			},
			//执行搜索
			doSearch(key) {
				uni.hideKeyboard()
				key = key ? key : this.keyword ? this.keyword : this.defaultKeyword;
				this.keyword = key;
				this.saveKeyword(key); //保存为历史 

				uni.$emit('search', {
					keyword: key
				})
				uni.navigateTo({
					url: '../searchresult/searchresult?keyword=' + key + '&category_guid=' + this.category_guid
				})
				// uni.navigateBack({})
			},
			//保存关键字到历史记录
			saveKeyword(keyword) {
				uni.getStorage({
					key: 'fenXiaoSearchOldKeys',
					success: (res) => {
						var OldKeys = JSON.parse(res.data);
						var findIndex = OldKeys.indexOf(keyword);
						if (findIndex == -1) {
							OldKeys.unshift(keyword);
						} else {
							OldKeys.splice(findIndex, 1);
							OldKeys.unshift(keyword);
						}
						//最多10个纪录
						OldKeys.length > 10 && OldKeys.pop();
						uni.setStorage({
							key: 'fenXiaoSearchOldKeys',
							data: JSON.stringify(OldKeys)
						});
						this.oldKeywordList = OldKeys; //更新历史搜索
					},
					fail: (e) => {
						var OldKeys = [keyword];
						uni.setStorage({
							key: 'fenXiaoSearchOldKeys',
							data: JSON.stringify(OldKeys)
						});
						this.oldKeywordList = OldKeys; //更新历史搜索
					}
				});
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
<style>
	view {
		display: block;
	}

	.content {
		height: 100%;
	}
	
	.yticon {
		font-size: 52rpx;
	}

	.search-box {
		width: 100%;
		background-color: #fff;
		padding: 15upx 2.5%;
		display: flex;
		justify-content: space-between;
	}

	.search-box .input-box {
		width: 85%;
		flex-shrink: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.search-box .search-btn {
		width: 15%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-shrink: 0;
		font-size: 28upx;
		border-radius: 60upx;
	}

	.search-box .input-box>input {
		width: 100%;
		height: 60upx;
		font-size: 32upx;
		border: 0;
		border-radius: 60upx;
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		padding: 0 3%;
		margin: 0;
		background-color: #f2f2f2;
	}

	.placeholder-class {
		color: #9e9e9e;
	}

	.search-keyword {
		width: 100%;
		background-color: rgb(242, 242, 242);
	}

	.keyword-list-box {
		height: calc(100vh - 110upx);
		padding-top: 10upx;
		background-color: #fff;
	}

	.keyword-entry-tap {
		background-color: #eee;
	}

	.keyword-entry {
		width: 94%;
		height: 80upx;
		margin: 0 3%;
		font-size: 30upx;
		color: #333;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: solid 1upx #e7e7e7;
	}

	.keyword-entry image {
		width: 60upx;
		height: 60upx;
	}

	.keyword-entry .keyword-text,
	.keyword-entry .keyword-img {
		height: 80upx;
		display: flex;
		align-items: center;
	}

	.keyword-entry .keyword-text {
		width: 90%;
	}

	.keyword-entry .keyword-img {
		width: 10%;
		justify-content: center;
	}

	.keyword-box {
		height: calc(100vh - 150upx);
		background-color: #fff;
	}

	.keyword-box .keyword-block {
		padding: 10upx 0;
	}

	.keyword-box .keyword-block .keyword-list-header {
		width: 94%;
		padding: 10upx 3%;
		font-size: 27upx;
		color: #333;
		display: flex;
		justify-content: space-between;
	}

	.keyword-box .keyword-block .keyword-list-header image {
		width: 40upx;
		height: 40upx;
	}

	.keyword-box .keyword-block .keyword {
		width: 94%;
		padding: 3px 3%;
		display: flex;
		flex-flow: wrap;
		justify-content: flex-start;
	}

	.keyword-box .keyword-block .hide-hot-tis {
		display: flex;
		justify-content: center;
		font-size: 28upx;
		color: #6b6b6b;
	}

	.keyword-box .keyword-block .keyword>view {
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 60upx;
		padding: 0 20upx;
		margin: 10upx 20upx 10upx 0;
		height: 60upx;
		font-size: 28upx;
		background-color: rgb(242, 242, 242);
		color: #6b6b6b;
	}
	
	.emptyView {
		color: #9d9fa7;
		font-size: 36rpx;
		text-align: center;
		padding-top: 350rpx;
	}
</style>
