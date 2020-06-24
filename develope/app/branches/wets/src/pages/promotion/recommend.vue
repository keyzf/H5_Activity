<template>
	<view class="content">
        <view class="robtip">
            <text>{{tip}}</text>
        </view>
		<view class="search-keyword">
            <view class="commodity" v-for="(pro, index) in recommendList" :key="index">
            	<view><image class="img" :src="pro.url" mode=""></image></view>
            	<view class="commodity-con">
            		<view class="title">{{pro.name}}</view>
            		<view class="price">{{pro.pricerange}}</view>
            	</view>
                <view @click="del(index)">
                    <image src="../../static/delete.png" class="delimg"></image>
                </view>
            </view>
            <view class="commodity" @click="add">
            	<view><image class="delimg" src="../../static/timeadd.png" mode=""></image></view>
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
                cguid: 0,
                recommendList: [],
                tip: ''
			}
		},
		onLoad() {
            this.cguid = uni.getStorageSync("companyguid");
            this.list();
		},
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
        },
		methods: {
            list() {
            	this.$ajax.get('managerrecommend/getlist', {cguid: this.cguid}).then(res => {
            		if (res.data.code == 0) {
            			let data = res.data.result.data;
                        this.recommendList = data.list;
                        this.tip = data.tips;
            		} else {
            			this.$api.msg('系统出错,请稍后再试');
            		}
            	});
            },
            add() {
                let productids = this.changeProductIds();
                uni.navigateTo({
                	url: '/pages/search/shopproductsearch?productids=' + productids
                });
            },
            editData(data) {
                let productids = '';
                this.pros = data.productids;
                this.pros.forEach(data => {
                    productids += data + ',';
                });
                productids = productids.substring(0, productids.length - 1);
                this.$ajax.get('sale/getselectproductinfo', {cguid: this.cguid, saleproductids: productids}).then(res => {
                	if (res.data.code == 0) {
                		let data = res.data.result.data;
                        this.recommendList = data;
                	} else {
                		this.$api.msg('系统出错,请稍后再试');
                	}
                });
            },
            del(index) {
                let _this = this;
                uni.showModal({
                    title: '提示',
                    content: '确定删除该商品吗？',
                    success: function (res) {
                        if (res.confirm) {
                            _this.recommendList.splice(index, 1);
                        }
                    }
                });
            },
            submit() {
                uni.showLoading();
                this.$ajax.get('managerrecommend/add', {cguid: this.cguid, productids: this.changeProductIds()}).then(res => {
                	uni.hideLoading();
                	if (res.data.code == 0) {
                	    this.$api.msg(`保存成功`);
                	    setTimeout(()=>{
                	        uni.navigateBack()
                	    }, 800)
                	} else {
                	    this.$api.msg(res.data.code + ":" + res.data.msg);
                	}
                });
            },
            changeProductIds() {
                let productids = '';
                this.recommendList.forEach(data => {
                	productids += data.productid + ',';
                });
                productids = productids.substring(0, productids.length - 1);
                return productids;
            }
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
    .robtip{
        font-size: 24rpx;
        padding: 20rpx $page-row-spacing;
        color: $base-color;
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
            vertical-align: middle;
        }
        .btn{
            margin-top: 10rpx;
            border: 1px solid #dddddd;
            border-radius: 8px;
            padding: 4px 8px;
            color: #606266;
            font-size: 24rpx;
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
