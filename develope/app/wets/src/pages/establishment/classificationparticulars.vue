<template>
	<view class="content">
		<!-- 批量管理 -->
			<view class="commodity" v-for="(item ,index) in orderList">
				<view><image class="img" :src="item.url" mode=""></image></view>
				<view class="commodity-con">
					<!-- <view class="commodity-zk">审核图片</view> -->
					<view class="title">{{item.name}}</view>
					<view class="tip">
						<view>销量:{{item.sales}}</view>
						<view>成交额:{{item.amount}}</view>
					</view>
					<view class="tip">
						<view>库存:{{item.stock}}</view>
						<view>添加日期:{{item.creattime}}</view>
					</view>
					<view class="price">{{item.price}}</view>
				</view>
			</view>
		<uni-load-more :status="loadingType"></uni-load-more>
		<view class="footer">
			<view class="submit ash" @click="allManage">批量管理</view>
			<view class="submit" @click="typeAddProduct">添加商品</view>
		</view>
	</view>
</template>

<script>
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import empty from '@/components/empty';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
export default {
	components: {
		uniLoadMore,
		empty,
		uniPopup
	},
	data() {
		return {
			loadingType:'more',
			lid : '',
			orderList:[],
			pids : [],
			pagesize : 10,
		};
	},
    onBackPress(){
        this.$api.ovPage()
    },
	onLoad(options) {
		this.categoryid = options.categoryid;
		this.cguid = uni.getStorageSync("companyguid");
	},
	onShow(){
        if (this.$wx.isWechat()) this.$wx.share();
		this.load("refresh");
	},
	//下拉刷新
	onPullDownRefresh() {
	    this.load("refresh");
	},
	//加载更多
	onReachBottom() {
	    if(this.loadingType === 'noMore'){
			
	    	return;
	    } 
	    this.load();
	},
	methods: {
		//批量管理
		allManage(){
			uni.navigateTo({
				url: '/pages/establishment/type_batch_management?categoryid=' + this.categoryid
			});
		},
		//添加商品
		typeAddProduct(){
			uni.navigateTo({
				url: '/pages/establishment/type_add_product?categoryid=' + this.categoryid
			});
			
			
		},
		
		load(load_type){
			console.log(12)
			//下拉刷新
			if(load_type == 'refresh'){
				this.lid = '';
				this.orderList = [];
				uni.stopPullDownRefresh();
			}
			let data = {
				pagesize : this.pagesize,
				categoryid : this.categoryid ,
				lastid : this.lid,
				cguid : this.cguid 
			}
			
			this.$ajax.get('comcategory/categoryproducts', data).then(res => {
				console.log(res)
				if(res.data.code == 0){
					console.log(this.loadingType)
					let data_list = res.data.result.data
					if(data_list.length > 0 ){
						// 应该追加到该 list 后面
						this.orderList = this.orderList.concat(data_list);
						this.lid = data_list[data_list.length - 1].id;
					}
					this.loadingType = data_list.length == this.pagesize ? 'more' : 'noMore'
					
				}
				
			})
		},
	},
};
</script>

<style lang="scss">
page,
.content {
	background: $page-color-base;
}
.content {
	padding-bottom: 100rpx;
}


.commodity {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	background: #ffffff;
	padding: 20rpx 30rpx;
	border-bottom: 1px solid #dddddd;
	margin-bottom: 20rpx;
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
.add-btn {
	display: flex;
	justify-content: space-around;
	align-items: center;
	text-align: center;
	padding: 30rpx;
	uni-image {
		width: 80rpx;
		height: 80rpx;
	}
}
.footer {
	position: fixed;
	left: 0;
	bottom: 0;
	z-index: 995;
	display: flex;
	align-items: center;
	width: 100%;
	height: 90upx;
	justify-content: space-between;
	font-size: 30upx;
	background-color: #fff;
	z-index: 998;
	color: $font-color-base;
	box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);

	.submit {
		flex-grow: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		color: #fff;
		font-size: 32upx;
		background-color: $base-color;
		&.ash {
			background-color: #fff;
			color: #333;
		}
	}
}

.uni-swiper-item {
	height: auto;
}

/* load-more */
.uni-load-more {
	display: flex;
	flex-direction: row;
	height: 80upx;
	align-items: center;
	justify-content: center;
}

.uni-load-more__text {
	font-size: 28upx;
	color: #999;
}

.uni-load-more__img {
	height: 24px;
	width: 24px;
	margin-right: 10px;
}

.uni-load-more__img > view {
	position: absolute;
}

.uni-load-more__img > view view {
	width: 6px;
	height: 2px;
	border-top-left-radius: 1px;
	border-bottom-left-radius: 1px;
	background: #999;
	position: absolute;
	opacity: 0.2;
	transform-origin: 50%;
	animation: load 1.56s ease infinite;
}

.uni-load-more__img > view view:nth-child(1) {
	transform: rotate(90deg);
	top: 2px;
	left: 9px;
}

.uni-load-more__img > view view:nth-child(2) {
	transform: rotate(180deg);
	top: 11px;
	right: 0;
}

.uni-load-more__img > view view:nth-child(3) {
	transform: rotate(270deg);
	bottom: 2px;
	left: 9px;
}

.uni-load-more__img > view view:nth-child(4) {
	top: 11px;
	left: 0;
}
</style>
