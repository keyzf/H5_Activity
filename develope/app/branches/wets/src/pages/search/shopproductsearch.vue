<template>
	<view class="content">
		<view class="search-box">
			<view class="search-left" @tap="returngo()"><uni-text class="yticon icon-zuo"></uni-text></view>
			<!-- 原样式 如果使用原样式，恢复下方注销代码 -->
			<view class="input-box"><input type="text" :placeholder="defaultKeyword" v-model="keywords" placeholder-class="placeholder-class" confirm-type="search" /></view>
			<view class="search-btn" @tap="getShopproductsByCguid(0)">搜索</view>
			<!-- 原样式 end -->
		</view>
		<view class="search-keyword">
			<empty v-if="shopproducts.length === 0"></empty>
			<checkbox-group @change="checkboxChange">
				<label class="commodity" v-for="(item, index) in shopproducts" :key="index">
					<view><checkbox :checked="productState[index]" :value="'' + index" /></view>
					<view><image class="img" :src="item.url" mode=""></image></view>
					<view class="commodity-con">
						<view class="title">{{ item.name }}</view>
						<view class="price">{{ item.pricerange }}</view>
					</view>
				</label>
			</checkbox-group>
			<uni-load-more :status="loadingType"></uni-load-more>
		</view>
		<view class="footer">
			<checkbox-group @change="checkboxAll" class="submit ash">
				<label class="submit ash">
					<checkbox :checked="productids.length == shopproducts.length" value="cb" />
					全选
				</label>
			</checkbox-group>
			<view class="submit ash">已选择 {{ productids.length }} 商品</view>
			<view class="submit" @click="submit">确定</view>
		</view>
	</view>
</template>

<script>
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import empty from '@/components/empty';
export default {
	components: {
	    uniLoadMore,
		empty
	},
	data() {
		return {
			loadingType: 'more',
			defaultKeyword: '',
			keyword: '',
			cguid: '',
			pagesize: 10,
			lastid: '',
			keywords: '',
			shopproducts: [],
			productState: [],
			checkboxCount: 0,
			productids: [],
		};
	},
	onLoad(options) {
		if(options.productids != ""){
			let arr = options.productids.split(',');
			for (var i = 0; i < arr.length; i++) {
				this.productids.push(Number(arr[i]));
			}
		}
		this.cguid = uni.getStorageSync('companyguid');
		this.getShopproductsByCguid(0);
	},
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
	//下拉刷新
	onPullDownRefresh() {
		this.lastid = '';
		this.getShopproductsByCguid(0);
	},
	//加载更多
	onReachBottom() {
		if (this.loadingType === 'noMore') {
			return;
		}
		this.lastid = this.shopproducts[this.shopproducts.length - 1].productid;
		this.getShopproductsByCguid(1);
	},
	methods: {
		// 获取店铺下的商品列表
		getShopproductsByCguid(laod_type) {
			this.$ajax.get('sale/selectsaleactivityinfo', {cguid: this.cguid, pagesize: this.pagesize, lastid: this.lastid, keywords: this.keywords}).then(res => {
				console.log(res);
				if (res.data.code == 0) {
					let data = res.data.result.data;
					let list = new Array(data.length).fill(false);
					// 下拉刷新时不进行 数据合并
					if (laod_type != 0) {
						this.shopproducts = this.shopproducts.concat(data);
						this.productState = this.productState.concat(list);
					} else {
						this.shopproducts = data;
						this.productState = list;
						uni.stopPullDownRefresh();
					}
					this.loadingType = data.length == this.pagesize ? 'more' : 'noMore';
					if (this.productids.length > 0) {
						this.shopproducts.forEach((product, index) => {
							this.productids.forEach(id => {
								if (product.productid == id) {
									this.productState[index] = true;
								}
							});
						});
					}
					console.log(this.productState);
				} else {
					uni.stopPullDownRefresh();
					this.$api.msg('商品列表获取失败');
				}
			});
		},
		// 商品选择
		checkboxChange(event) {
			let checkboxs = event.detail.value;
			this.productState.fill(false);
			this.productids = [];
			if (checkboxs.length != 0) {
				checkboxs.forEach(index => {
					this.productState[index] = true;
					this.productids.push(this.shopproducts[index].productid);
				});
			}
		},
		// 全选
		checkboxAll(event) {
			if (event.detail.value.length == 0) {
				this.productState.fill(false);
                this.productids = [];
			} else {
                this.productState.fill(true);
                this.shopproducts.forEach(item => {
                    if (this.productids.indexOf(item.productid) < 0) {
                        this.productids.push(item.productid);
                    }
				});
			}
			this.$forceUpdate();
		},
		returngo() {
			uni.navigateBack();
		},
		doSearch() {},
		// 完成选择
		submit() {
			if (this.productids.length == 0) {
				this.$api.msg('请至少选择一件商品');
				return;
			}
			this.$api.prePage().editData({productids: this.productids, showState: true});
			uni.navigateBack();
		}
	}
};
</script>
<style lang="scss">
page {
	background: $page-color-base;
}
.content {
	border-top: 1px solid #dddddd;
	padding-bottom: 100rpx;
}
.search-box {
	width: 100%;
	background-color: rgb(242, 242, 242);
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
	margin: 0 0 0 2%;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-shrink: 0;
	font-size: 28upx;
}

.search-box .input-box > input {
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
	background-color: #ffffff;
}

.placeholder-class {
	color: #9e9e9e;
}

.search-left {
	.yticon {
		font-size: 48rpx;
	}
}
.commodity {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	background: #ffffff;
	padding: 20rpx 30rpx;
	border-bottom: 1px solid #dddddd;
	.img {
		width: 100rpx;
		height: 100rpx;
	}
	.commodity-con {
		flex-grow: 1;
		padding: 20rpx;
		.commodity-zk {
			position: absolute;
			top: 40rpx;
			right: 40rpx;
		}
		.title {
			font-size: 30rpx;
			margin-bottom: 10rpx;
		}
		.tip {
			display: flex;
			justify-content: center;
			font-size: 28rpx;
			color: #dddddd;

			view {
				width: 50%;
			}
		}
		.price {
			color: $base-color;
			margin-top: 10rpx;
		}
		.state {
			overflow: hidden;

			text {
				float: right;
				padding: 4rpx 20rpx;
				border: 1px solid #dddddd;
				border-radius: 20rpx;
				margin-left: 20rpx;
				font-size: 24rpx;
			}
		}
	}
}
</style>
