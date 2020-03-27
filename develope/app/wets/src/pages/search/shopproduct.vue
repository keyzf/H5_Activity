<template>
	<view class="content">
		<view class="search-keyword">
            <view class="commodity" v-for="(item, index) in products" :key="index">
            	<view><image class="img" :src="item.url || ''" mode=""></image></view>
            	<view class="commodity-con">
            		<view class="title">{{ item.name }}</view>
            		<view class="price">{{ item.pricerange }}</view>
            	</view>
                <view @click="productDelete(index)">
                    <image src="../../static/del.png" class="delimg"></image>
                </view>
            </view>
            <view class="commodity" @click="shopproductsearch">
            	<view><image class="delimg" src="../../static/add.png" mode=""></image></view>
            	<view class="commodity-con">
                    添加商品
                </view>
            </view>
		</view>
        <view class="footer">
        	<view class="submit" @click="submit">确定</view>
        </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				defaultKeyword: "",
				keyword: "",
				productids: [],
				cguid: '',
				products: []
			}
		},
		onLoad(option) {
			this.productids = option.productids ? option.productids.split(',') : [];
			this.cguid = uni.getStorageSync('companyguid');
			this.getSelectProduct();
		},
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
        },
		methods: {
			// 获取选择的商品列表
			getSelectProduct() {
				this.$ajax.get('sale/getselectproductinfo', {cguid: this.cguid, saleproductids: this.productids}).then(res => {
					console.log(res);
					if (res.data.code == 0) {
						this.products = res.data.result.data;
					} else {
						this.$api.msg('获取商品列表失败');
					}
				});
			},
			// 删除商品
			productDelete(index) {
				this.products.splice(index, 1);
				this.productids.splice(index, 1);
				this.$forceUpdate();
			},
			// 提交
            submit(){
				if (this.productids.length == 0) {
					this.$api.msg('请至少选择一件商品');
					return;
				}
				this.$api.prePage().editData({productids: this.productids, showState: true});
				uni.navigateBack();
            },
			// 选择商品
            shopproductsearch(){
				let ids = this.productids.length > 0 ? this.productids.join(',') : '';
                uni.navigateTo({
                    url: '/pages/search/shopproductsearch?productids=' + ids
                });
            },
			// 修改变量
			editData(data) {
				this.productids = data.productids;
				let url = location.href.toString().split('=')[0] + '=' + this.productids.join(',');
				history.replaceState(null, null, url);
				this.getSelectProduct();
			},
		}
	}
</script>
<style lang="scss">
    page{
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
		background-color: #ffffff;
	}

	.placeholder-class {
		color: #9e9e9e;
	}

    .search-left{
        .yticon{
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
        .delimg{
            width: 50rpx;
            height: 50rpx;
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
