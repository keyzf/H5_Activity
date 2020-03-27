<template>
    <!-- 交易中 -->
	<view class="content">
        <view class="commodity" v-for="(item, index) in transaction_List" @click="order_detail(item.ordernumber)">
            <view>
                <image :src="item.picurl" class="img"></image>
            </view>
            <view class="commodity-con">
                <view class="title">{{item.ordernumber}}</view>
                <view class="price">
                    <text>{{item.order_state}}</text>
                      
                    <text>{{item.price}}</text>
                </view>
                <view class="tip">{{item.date}}</view> 
                <view class="tip">{{item.cash_withdraw_date}}</view>
                <view class="tip">{{item.meal_withdraw_date}}</view>
            </view>
        </view>   
        <uni-load-more :status="loadType"></uni-load-more>
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
                transaction_List : [],
                pagesize : 10,
                lid : "",
                loadType : "",
			}
		},
        onLoad() {
        	this.transaction_load();
        },
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
        },
        onBackPress(){
            this.$api.ovPage()
        },
        //加载更多
        onReachBottom() {
           if(this.loadType === 'noMore'){
           	return;
           } 
           this.transaction_load();
        },
        //下拉刷新
        onPullDownRefresh() {
           this.transaction_load("refresh");
        },
		methods: {
            order_detail(order_num){
                  uni.navigateTo({
                    url: '/pages/shoporder/orderdet?ordernumber=' + order_num
                });
                
            },
            transaction_load(type){
                if(type == "refresh"){
                    this.transaction_List = [];
                    this.lid = "";
                    uni.stopPullDownRefresh();
                }
                let data = {
                    cguid : uni.getStorageSync("companyguid"),
                    pagesize : this.pagesize,
                    lid : this.lid,
                };
                this.$ajax.get('income/gettradinglist', data).then(res => {
                    console.log(res)          
                    if(res.data.code == 0){
                     
                        let resdata = res.data.result.data; 
                        this.transaction_List = this.transaction_List.concat(resdata);
                        if(resdata.length > 0){
                            this.lid = resdata[resdata.length - 1].id;
                        }
                        this.loadType = resdata.length == this.pagesize ? 'more' : 'noMore'
                    }else{
                        this.$api.msg("发生异常")
                        return;
                    }
                });
            },
		}
	}
</script>

<style lang="scss">
page {
    background: $page-color-base;
}
.content {
    border-top: 1px solid #dddddd;
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
    	.img {
    		width: 100rpx;
    		height: 100rpx;
    	}
    	.commodity-con {
    		flex-grow: 1;
    		padding: 20rpx;
            font-size: 28rpx;
    		.title {
    			margin-bottom: 10rpx;
    		}
    		.tip {
    			font-size: 28rpx;
    			color: #dddddd;
    		}
    		.price {
    			color: $base-color;
    			margin-top: 10rpx;
                display: flex;
                justify-content: space-between;
    		}
    	}
    }

</style>
