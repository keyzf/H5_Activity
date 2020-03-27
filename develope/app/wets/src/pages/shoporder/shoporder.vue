<template>
	<view class="content">
		<view class="navbar">
			<view 
				v-for="(item, index) in navList" :key="index" 
				class="nav-item" 
				:class="{current: tabCurrentIndex === index}"
				@click="tabClick(index)"
			>
				{{item.text}}
			</view>
		</view>

		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<scroll-view class="list-scroll-content" scroll-y @scrolltolower="orderListMore">
					<!-- 空白页 -->
					<empty v-if="tabItem.loaded === true && tabItem.orderList.length === 0"></empty>
                    <view v-if="tabIndex == 0" class="empty"></view>
					<view v-if="tabIndex == 0" class="goodsstata">
                        <view :class="itemIndex == index ? 'action' : ''" v-for="(item, index) in orderStates" :key="index" @click="getOrderState(index)">
                            <view class="number">{{ item.item }}</view>
                            <view>{{ item.word }}</view>
                        </view>
                    </view>
					<!-- 订单列表 -->
                    
					<view class="commodity" v-for="(item, index) in tabItem.orderList" :key="index"  @click="orderdet(item.ordernumber)">
						<view><image class="img" :src="item.url || ''" mode=""></image></view>
						<view class="commodity-con">
							<view class="title">订单号:{{ item.ordernumber }}</view>
							<view class="title">{{ item.receivername }}</view>
							<view class="tip">
                                <text>{{ item.createtime }}</text>
                                <text class="stata">{{ item.word }}</text>
                            </view>
						</view>
					    <view class="yticon icon-you"></view>
					</view>
					 
					<uni-load-more :status="tabItem.loadingType"></uni-load-more>
					
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template> 

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
	export default {
		components: {
			uniLoadMore,
			empty
		},
		data() {
			return {
				tabCurrentIndex: 0,
                itemIndex: 0,
				navList: [{
						state: 0,
						text: '进行中',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 8,
						text: '预定中',
						loadingType: 'more',
						orderList: []
					},
                    {
                        state: 3,
                        text: '已完成',
                        loadingType: 'more',
                        orderList: []
                    },
                    {
                        state: 7,
                        text: '已关闭',
                        loadingType: 'more',
                        orderList: []
                    }
				],
				pagesize: 10,
				orderStates: [],
                cguid: ''
			};
		},
		onLoad(options) {
            this.cguid = uni.getStorageSync('companyguid');
			this.getOrderState(0);
		},
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
        },
        //下拉刷新
        onPullDownRefresh() {
            let navitem = this.navList[this.tabCurrentIndex];
            if (navitem.state == 0) {
                this.getOrderState(this.itemIndex);
            } else {
                this.getOrderList(0, navitem.state);
            }
        },
		methods: {
			// 获取订单状态
			getOrderState(index) {
                this.itemIndex = index;
				this.$ajax.get('com/orderstate', {cguid: this.cguid}).then(res => {
					if (res.data.code == 0) {
						this.orderStates = res.data.result.data;
                        this.getOrderList(0, this.orderStates[this.itemIndex].state);
					} else {
						this.$api.msg('获取订单状态失败');
					}
				});
			},
            // 订单列表
			getOrderList(is, state) {
                let navitem = this.navList[this.tabCurrentIndex];
                navitem.loadingType = 'loading';
                let lastId = is == 0 ? '' : navitem.orderList[navitem.orderList.length - 1].id;
                this.$ajax.get('com/orderlist', {cguid: this.cguid, state: state, lid: lastId, pagesize: this.pagesize}).then(res => {
                    console.log(res);
                    if (res.data.code == 0) {
                        let data = res.data.result.data;
                        navitem.orderList = is == 0 ? data : navitem.orderList.concat(data);
                        navitem.loadingType = data.length == this.pagesize ? 'more' : 'noMore';
                    } else {
                        this.$api.msg('获取订单列表失败');
                    }
                    if (is == 0) {
                        uni.stopPullDownRefresh();
                    }
                });
			},
			//swiper 切换
			changeTab(e){
				this.tabCurrentIndex = e.target.current;
                let navitem = this.navList[this.tabCurrentIndex];
                //防止重复加载
                if(navitem.loadingType === 'loading' || navitem.loadingType === 'noMore'){
                	return;
                }
                //tab切换只有第一次需要加载数据
                if(navitem.loaded === true){
                	return;
                }
                this.getOrderList(0, navitem.state);
			},
			//顶部tab点击
			tabClick(index){
				this.tabCurrentIndex = index;
                let navitem = this.navList[this.tabCurrentIndex];
                //防止重复加载
                if(navitem.loadingType === 'loading' || navitem.loadingType === 'noMore'){
                	return;
                }
                //tab切换只有第一次需要加载数据
                if(navitem.loaded === true){
                	return;
                }
                this.getOrderList(0, navitem.state);
			},
            //加载更多
            orderListMore() {
                let navitem = this.navList[this.tabCurrentIndex];
                //防止重复加载
                if(navitem.loadingType === 'loading' || navitem.loadingType === 'noMore'){
                	return;
                }
                //tab切换只有第一次需要加载数据
                if(navitem.loaded === true){
                	return;
                }
                if (navitem.state == 0) {
                    this.getOrderList(1, this.orderStates[this.itemIndex].state);
                } else {
                    this.getOrderList(1, navitem.state);
                }
            },
            orderdet(ordernumber){
                uni.navigateTo({
                    url: '/pages/shoporder/orderdet?ordernumber=' + ordernumber
                });
            },
		},
	}
</script>

<style lang="scss">
	page, .content{
		background: $page-color-base;
		height: 100%;
	}
	
	.swiper-box{
		height: calc(100% - 80rpx);
	}
	.list-scroll-content{
		height: 100%;
	}
	
	.navbar{
		display: flex;
		height: 40px;
		padding: 0 5px;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0,0,0,.06);
		position: relative;
		z-index: 10;
		.nav-item{
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 15px;
			color: $font-color-dark;
			position: relative;
			&.current{
				color: $base-color;
				&:after{
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					border-bottom: 2px solid $base-color;
				}
			}
		}
	}
    
	.uni-swiper-item{
		height: auto;
        position: relative;
	}
    .goodsstata{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1;
        padding: 20rpx 30rpx;
        display: flex;
        justify-content:space-between;
        text-align: center;
        background: #FFFFFF;
        font-size: 28rpx;
        .number{
            font-size: 40rpx;
        }
        .action{
            color: $base-color;
        }
    }
    .empty{
        height: 140rpx;
    }
	.commodity {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #ffffff;
		padding: 20rpx 30rpx;
		border-bottom: 1px solid #dddddd;
        margin-bottom: 10rpx;
		.img {
			width: 100rpx;
			height: 100rpx;
		}
		.commodity-con {
			flex-grow: 1;
			padding: 20rpx;
			.title {
				font-size: 30rpx;
				margin-bottom: 10rpx;
			}
			.tip {
				display: flex;
				justify-content: space-between;
				font-size: 24rpx;
				color: #dddddd;
                .stata {
                    margin-left: 20rpx;
                    color: $base-color;
                }
                
			}
			
			
		}
	}
</style>
