<template>
	<view class="content">
		<!-- 批量管理 -->
		<checkbox-group @change="checkboxChange">
			<view class="commodity" v-for="(item ,index) in orderList" :key="index">
				<view> 
					<checkbox :value="index + ''" :checked="checkList[index]"/>
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
            
			<view class="submit" @click="lowerShelf" v-if="state == 1">下架</view>
            <view class="submit" @click="lowerShelf" v-else>上架</view>
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
            checkList : [],
            
            
		};
	},
    onBackPress(){
        this.$api.ovPage()
    },
	onLoad(options) {
		this.cguid = uni.getStorageSync("companyguid");
        this.unstate = options.unstate;
        this.state = options.state;
		this.load()
	},
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
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
				state : this.state,
				lid:this.lid,
				cguid : this.cguid 
			}
			this.$ajax.get('shopproduct/getShopProductPage', data).then(res => {
				console.log(res)
				if(res.data.code == 0){
					console.log(this.loadingType)
					let data_list = res.data.result.data.productlist
                     //多选框
                    for (let i= 0; i< data_list.length; i++ ) {
                    	this.checkList.push(false);
                    }
					if(data_list.length>0){
						// 应该追加到该 list 后面
						this.orderList = this.orderList.concat(data_list);
						this.lid = data_list[data_list.length - 1].id;
						this.allchecked = false;
					}
					this.loadingType = data_list.length == 10 ? 'more' : 'noMore'
				}
				
			})
		},
		//下架 or 上架
		lowerShelf(){
			if(this.pids.length == 0){
				this.$api.msg("请选择商品")
				return
			}
			let data = {
				pids : this.pids,
				state : this.unstate,
			}
            //下架shopproduct/shelvesProductBatch
            //上架shopproduct/shelvesProductBatch
			this.$ajax.get('shopproduct/shelvesProductBatch', data).then(res => {
				console.log(res)
				if(res.data.code == 0){
                    this.$api.msg("批量操作成功")
					//把选中的移除
					let checkbox_vals = this.checkbox_vals;
					//倒叙排列  删除后下标不会影响其他的下标
					checkbox_vals.sort(function(a,b){
						return b - a;
					})
					let orderList = this.orderList;
					let deleList = [];
                    //移除
                    this.checkbox_vals = [];
					for (let i= 0; i< checkbox_vals.length; i++ ) {
						deleList.push(orderList[checkbox_vals[i]]);	
						orderList.splice([checkbox_vals[i]],1);
                        this.checkList.splice([checkbox_vals[i]],1);
					}
					//把上个页面已经已移除list添加   数字加
                    //下架  --> 上架增加
                    //上架 --> 下架增加
                    let index_sta;
                    if(this.state == 0){ //在售
                        index_sta = 2  //下架 增加
                    }else{ //下架
                        index_sta = 0  //在售增加
                    }
                    //
                    this.$api.prePage().Refresh();
					this.load("refresh");
					this.allchecked = false;
				/* 	this.$api.prePage().navList[index_sta].orderList = this.$api.prePage().navList[index_sta].orderList.concat(deleList);
					this.$api.prePage().navList[index_sta].number += deleList.length
					//在售的数字 减  list 移除对应的商品              
					this.$api.prePage().navList[0].orderList = orderList;
					this.$api.prePage().navList[this.state].number = orderList.length; */
				}else{
					this.$api.msg(res.data.msg)
				}	
			})	
			console.log(this.pids.toString())
		},
		checkboxChange: function (e) {
			var values = e.detail.value;
			console.log(values);
			this.checkbox_vals = values;
			let pids_arr = [];
			console.log(values.length+"------"+this.orderList.length);
			if(values.length == this.orderList.length){
				this.allchecked = true;
			}else{
				this.allchecked = false;
			}
			for(let i = 0;i<this.orderList.length;i++){
				if(values.indexOf(i+"") === -1){
					this.checkList[i] = false;
				}else{
					pids_arr.push(this.orderList[i].id)
					this.checkList[i] = true;
				}
			}
			// for (let i= 0; i< values.length; i++ ) {
			// 	pids_arr.push(this.orderList[values[i]].id)
   //              this.checkList[values[i]] = true;
			// }
			this.pids = pids_arr;
			console.log(this.pids)
        },
		allCheck(){
			this.pids = [];
			if(this.allchecked == false){
				this.allchecked = true;
				this.checkbox_vals = [];
				for (let i= 0; i< this.orderList.length; i++ ) {
					this.checkList[i] = true;
					this.checkbox_vals.push(i);
					this.pids.push(this.orderList[i].id);
				}
			}else{
				this.allchecked = false; 
				this.checkbox_vals = [];
				for (let i= 0; i< this.orderList.length; i++ ) {
					this.checkList[i] = false;
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
		width: 180rpx;
		height: 180rpx;
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
			justify-content: flex-start;
			font-size: 28rpx;
			color: #dddddd;
			view {
				margin-right: 20rpx;
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
