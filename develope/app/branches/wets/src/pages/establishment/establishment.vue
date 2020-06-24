<template>
	<view class="content">
		<view class="search-box" @click="search"><input type="text" placeholder="搜索" /></view>
		<view class="navbar">
			<view v-for="(item, navList_index) in navList" :key="navList_index" class="nav-item" :class="{ current: tabCurrentIndex === navList_index }" @click="tabClick(navList_index,item.buttonType)"> {{ item.text }}({{ item.number > 0 ? item.number:0}})</view>
		</view>

		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem, tabIndex) in navList" :key="tabIndex">
				<scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData">
					<!-- 空白页 -->
					<empty v-if="tabItem.loaded === true && tabItem.orderList.length === 0"></empty>

					<!-- 订单列表 -->
					<view v-for="(item, index) in tabItem.orderList" :key="index">
						<view class="commodity">
                            <!-- item.state 0待审、1上架、2下架、4已拒绝 -->
							<view><image class="img" :src="item.url" mode=""></image></view>
							<view class="commodity-con">
								<!-- <view class="commodity-zk">{{item.url}}</view> -->
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
								<view class="state">
									<text @click="edit_product(item.id, tabIndex,index)">编辑</text>
									<view v-if="tabItem.buttonType == 0 || tabItem.buttonType == 1 || tabItem.buttonType == 3">
										<text @click="lowerShelf(item.id,tabIndex,index)">下架</text>
									</view>
									<view v-if="tabItem.buttonType == 2">
										<text @click="upperShelf(item.id,index)">上架</text>
									</view>
								</view>
                                <text class="examine" v-if="item.state == 0"></text>
                                <text class="off-shelf" v-if="item.state == 2"></text>
                                <text class="sell-out" v-if="item.state == 3"></text>
							</view>
						</view>
					</view>
					<uni-load-more :status="tabItem.loadingType"></uni-load-more>
				</scroll-view>
			</swiper-item>
		</swiper>
		<view class="footer">
			<view class="submit ash" @click="addproduct">
                <image src="../../static/add.png" mode="aspectFit"></image>
                <text>添加商品</text>
            </view>
			<view class="submit ash" @click="addproduct(2)">
                <image src="../../static/batch.png" mode="aspectFit"></image>
                <text>批量管理</text>
            </view>
			<view class="submit ash" @click="addproduct(3)">
                <image src="../../static/classifyh.png" mode="aspectFit"></image>
                <text>分类管理</text>
            </view>
		</view>
		<!-- <uni-popup ref="popup" type="bottom">
			<view class="add-btn">
				<view @click="addproduct(0)">
					<image src="../../static/emptyCart.jpg" mode=""></image>
					<view>引导添加物品</view>
				</view>
				<view @click="addproduct(1)">
					<image src="../../static/emptyCart.jpg" mode=""></image>
					<view>模板添加物品</view>
				</view>
			</view>
		</uni-popup> -->
	</view>
</template>

<script>
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import empty from '@/components/empty';
// import uniPopup from '@/components/uni-popup/uni-popup.vue';
export default {
	components: {
		uniLoadMore,
		empty
	},
	data() {
		return {
			cguid:'',
			tabCurrentIndex: 0,
			loadingType:'more',
			navList: [
				{
					state: 0,
					buttonType:1,
					text: '出售中',
					loadingType: 'more',
					number:0,
					lid:'',
					orderList: []
				},
				{
					state: 1,
					buttonType:0,
					text: '待审核',
					loadingType: 'more',
					number:0,
					lid:'',
					orderList: []
				},
				{
					state: 2,
					buttonType:2,
					text: '已下架',
					loadingType: 'more',
					number:0,
					lid:'',
					orderList: []
				},
				{
					state: 3,
					buttonType:3,
					text: '已售罄',
					loadingType: 'more',
					number:0,
					lid:'',
					orderList: []
				}
			],
			productList: [],
		};
	},
    onBackPress(){
        this.$api.ovPage()
    },
	onLoad(options) {
		this.cguid = uni.getStorageSync("companyguid");
	},
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
		this.load()
    },
	//下拉刷新
    onPullDownRefresh() {
        this.datalist('refresh');
    },
	methods: {
		load(){
			let data = {
				cguid:this.cguid
			}
			this.$ajax.get('shopproduct/getProductNumber', data).then(res => {
				if(res.data.code == 0){
					console.log(res.data.result.data)
					this.navList[0].number = res.data.result.data.onshelves;
					this.navList[1].number = res.data.result.data.uncheck;
					this.navList[2].number = res.data.result.data.offshelves;
					this.navList[3].number = res.data.result.data.sellout;
					this.datalist('refresh');
				}
			});
		},
		//swiper 切换
		changeTab(e) {
			this.tabCurrentIndex = e.target.current;
			this.datalist('tabChange');
		},
		//顶部tab点击
		tabClick(index,type) {
			this.tabCurrentIndex = index;
		},
		// 上拉加载
		loadData(){
			if(this.navList[this.tabCurrentIndex].loadingType === 'noMore'){
				return;
			} 
			this.datalist();
		},
		datalist(type){
			let state =	this.navList[this.tabCurrentIndex].buttonType;
			let lid = this.navList[this.tabCurrentIndex].lid;
		 	
			//tab切换只有第一次需要加载数据
			if(type === 'tabChange' && this.navList[this.tabCurrentIndex].loaded === true){
				return;
			}
			if(type == 'refresh'){
				this.navList[this.tabCurrentIndex].orderList = [];
				lid = '';
			}
			console.log("sdfsdf")
			this.navList[this.tabCurrentIndex].loadingType = 'loading';
			let data = {
				pagesize : 10,
				state : state,
				lid:lid,
				cguid : this.cguid
			}
			this.$ajax.get('shopproduct/getShopProductPage', data).then(res => {
				console.log(res)
				if(res.data.code == 0){
					let data = res.data.result.data.productlist
					if(data.length>0){
						if(type == 'refresh'){
							this.navList[this.tabCurrentIndex].orderList = data;
						}else{
							this.navList[this.tabCurrentIndex].orderList = this.navList[this.tabCurrentIndex].orderList.concat(data);
						}
						this.navList[this.tabCurrentIndex].lid = data[data.length - 1].id;
					}
					this.navList[this.tabCurrentIndex].loadingType = data.length == 10 ? 'more' : 'noMore'
					//loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
					this.$set(this.navList[this.tabCurrentIndex], 'loaded', true);
					if(type == 'refresh'){
						uni.stopPullDownRefresh();
					}
				}
				
			})
		},
		//添加商品
		addproduct(i) {
			switch (i) {
				// case 0:
				// 	this.$refs.popup.close();
				// 	uni.navigateTo({
				// 		url: '/pages/establishment/addproduct'
				// 	});
				// 	break;
				// case 1:
				// 	this.$refs.popup.close();
				// 	uni.navigateTo({
				// 		url: '/pages/establishment/productcontemplate'
				// 	});
				// 	break;
				case 2:  
                    let type = this.navList[this.tabCurrentIndex].buttonType
                    let untype;
                    if(type == 2){
                        untype = 1
                    }else if(type == 1){
                        untype = 2
                    }else{
                        this.$api.msg("该列表暂不支持批量管理")
                        return;
                    }
					uni.navigateTo({
						url: '/pages/establishment/management?state=' + type +'&unstate=' + untype
					});
					break;
				case 3:
					uni.navigateTo({
						url: '/pages/establishment/classification'
					});
					break;
				default:
					uni.showActionSheet({
						itemList: ['引导添加商品', '模板添加商品'],
						success: function(res) {
							let url = "";
							if (res.tapIndex == 0) {
								url= '/pages/establishment/addproduct';
							} else {
								url= '/pages/establishment/productcontemplate';
							}
							uni.navigateTo({
								url: url
							});
						}
					});
					break;
			}
		},
		// 搜索
		search() {
			uni.navigateTo({
				url: '/pages/search/search_product'
			});
		},
		edit_product(pid, tabIndex,index){
			uni.navigateTo({
				url: '/pages/establishment/productcontemplate?editPid=' + pid + '&tabIndex=' + tabIndex + '&index=' + index
			});
		},
		//下架
		lowerShelf(pid,navList_index,index_son){
			let data = {
				pid : pid,
				cguid : this.cguid
			}
			this.$ajax.get('shopproduct/offShelvesProduct', data).then(res => {
				console.log(res)
				if(res.data.code == 0){
                     this.$api.msg("下架成功")
					let del_list = this.navList[navList_index].orderList[index_son];
					//在售 数字减1
                    if(navList_index != 3){
                       	let list_del = this.navList[navList_index].orderList.splice(index_son,1);
                       this.navList[navList_index].number -= 1; 
                    }
				
					//下架的数字加一 list 增加数据
					this.navList[2].orderList.push(del_list)
					this.navList[2].number += 1;
				}else{
					this.$api.msg(res.data.msg)
				}
				
			})
		},
		upperShelf(pid,index_son){
			let data = {
				pid : pid,
				cguid : this.cguid
			}
			this.$ajax.get('shopproduct/onShelvesProduct', data).then(res => {
				console.log(res)
				if(res.data.code == 0){
                    this.$api.msg("上架成功")
					let del_list = this.navList[2].orderList[index_son];
					//下架 减一
					let list_del = this.navList[2].orderList.splice(index_son,1);
					this.navList[2].number -= 1;
					//在售的数字加一 list 增加数据
					this.navList[0].orderList.push(del_list)
					this.navList[0].number += 1;
				}	
			})
		},
        Refresh(){
            //上下架刷新
            this.datalist('tabChange',1);
            this.datalist('tabChange',2);
            this.load();   
        },
		
	}
};
</script>

<style lang="scss">
page,
.content {
	background: $page-color-base;
	height: 100%;
}

.swiper-box {
	height: calc(100% - 240rpx);
}

.list-scroll-content {
	height: 100%;
}

.search-box {
	width: 100%;
	background-color: #ffffff;
	padding: 15rpx 30rpx;

	input {
		width: 100%;
		font-size: 24rpx;
		border: 0;
		border-radius: 30rpx;
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		padding: 20rpx 3%;
		background:url(../../static/search.png) no-repeat left 10rpx center rgb(249, 249, 249);
        background-size: 30rpx 30rpx;
        padding-left: 60rpx;
	}
}

.navbar {
	display: flex;
	height: 40px;
	padding: 0 5px;
	background: #fff;
	box-shadow: 0 1px 5px rgba(0, 0, 0, 0.06);
	position: relative;
	z-index: 10;

	.nav-item {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		font-size: 15px;
		color: $font-color-dark;
		position: relative;

		&.current {
			color: $base-color;

			&:after {
				content: '';
				position: absolute;
				left: 50%;
				bottom: 0;
				transform: translateX(-50%);
				width: 120rpx;
				height: 0;
				border-bottom: 2px solid $base-color;
			}
		}
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
	margin-bottom: 20rpx;

	.img {
		width: 100rpx;
		height: 100rpx;
	}

	.commodity-con {
		flex-grow: 1;
		padding: 20rpx;
        position: relative;
        .off-shelf{
            position: absolute;
            top: 20rpx;
            right: 60rpx;
            z-index: 3;
            width: 120rpx;
            height: 120rpx;
            background: url(../../static/off-shelf.png) no-repeat center;
            background-size: 100% 100%;
        }
        .sell-out{
            position: absolute;
            top: 20rpx;
            right: 60rpx;
            z-index: 3;
            width: 120rpx;
            height: 120rpx;
            background: url(../../static/sell-out.png) no-repeat center;
            background-size: 100% 100%;
        }
        .examine{
            position: absolute;
            top: 20rpx;
            right: 60rpx;
            z-index: 3;
            width: 120rpx;
            height: 120rpx;
            background: url(../../static/examine.png) no-repeat center;
            background-size: 100% 100%;
        }
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
    margin-right: -1px;
	.submit {
		flex-grow: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		color: #fff;
		font-size: 32upx;
		background-color: $base-color;
        border-right:1px solid #DDD ;
		&.ash {
			background-color: #fff;
			color: #333;
		}
        image{
            width: 50rpx;
            height: 50rpx;
            vertical-align: middle;
            margin-right: 20rpx;
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
