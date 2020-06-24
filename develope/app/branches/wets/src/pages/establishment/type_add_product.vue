<template>
	<view class="content">
		<!-- 分类添加商品 -->
		<checkbox-group @change="checkboxChange">
			<view class="commodity" v-for="(item ,index) in orderList">
				<view> 
					<checkbox :value="index + ''" :checked="item.checked"/>
				</view>
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
		</checkbox-group>
		<uni-load-more :status="loadingType"></uni-load-more>

		<view class="footer">
			<view class="submit ash">
				<checkbox value="cb" @click="allCheck" :checked="allchecked"/>全选
			</view>
			<view class="submit ash">已选择 {{checkbox_vals.length}} 商品</view>
			<view class="submit" @click="lowerShelf">确定</view>
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
			checkbox_vals : [],
			allchecked : false,
		};
	},
	onLoad(options) {
		this.categoryid = options.categoryid;
		this.cguid = uni.getStorageSync("companyguid");
		this.load()
	},
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    onBackPress(){
        this.$api.ovPage()
    },
			//加载更多
	onReachBottom() {
	   if(this.loadingType === 'noMore'){
	   	return;
	   } 
	   this.load();
	},
		//下拉刷新
	onPullDownRefresh() {
	   this.load("refresh");
	},
	methods: {
		load(load_type){
			console.log(12)
			//下拉刷新
			if(load_type == 'refresh'){
				this.lid = '';
				this.orderList = [];
				uni.stopPullDownRefresh();
			}
			let data = {
				pagesize : 10,
				lastid:this.lid,
				cguid : this.cguid ,
				categoryid : this.categoryid
			}
			this.$ajax.get('comcategory/companyproducts', data).then(res => {
				console.log(res)
				if(res.data.code == 0){
					let data_list = res.data.result.data
					if(data_list.length>0){
						// 应该追加到该 list 后面
						this.orderList = this.orderList.concat(data_list);
						this.lid = data_list[data_list.length - 1].id;
					}
					this.loadingType = data_list.length == 10 ? 'more' : 'noMore'
					
				}
				
			})
		},
		//添加
		lowerShelf(){
			if(this.pids.length == 0){
				this.$api.msg("请选择商品")
				return
			}
			let data = {
				categoryid : this.categoryid,
				productids : this.pids,
				cguid : this.cguid
			}
			this.$ajax.get('comcategory/saveproducts', data).then(res => {
				console.log(res)
				if(res.data.code == 0){
					let checkbox_vals = this.checkbox_vals;
					let list_add = [];
					for (let i= 0; i< checkbox_vals.length; i++ ) {
						list_add.push(this.orderList[checkbox_vals[i]])
					}
					//添加后 父页面 添加
					this.$api.prePage().orderList = this.$api.prePage().orderList.concat(list_add);
					//上上页面的数子  刷新
					this.$api.prePage_3().load();
					this.$api.msg("添加成功");
					//返回上以页面
					uni.navigateBack();   // 这个方法是刷新当前页面
				}else{
					this.$api.msg(res.data.msg)
				}	
			})	
			console.log(this.pids.toString())
		},
		checkboxChange: function (e) {
			var values = e.detail.value;
			this.checkbox_vals = values;
			let pids_arr = [];
			for (let i= 0; i< values.length; i++ ) {
				pids_arr.push(this.orderList[values[i]].id)
			}
			this.pids = pids_arr;
        },
		allCheck(){
             this.pids = [];
			if(this.allchecked == false){
				this.allchecked = true;
				this.checkbox_vals = [];
				for (let i= 0; i< this.orderList.length; i++ ) {
					this.$set(this.orderList[i],'checked',true)
                    this.pids.push(this.orderList[i].id)
					this.checkbox_vals.push(i);
				}       
			}else{
				this.allchecked = false; 
				this.checkbox_vals = [];
				for (let i= 0; i< this.orderList.length; i++ ) {
					this.$set(this.orderList[i],'checked',false)
				}
			}
					
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
