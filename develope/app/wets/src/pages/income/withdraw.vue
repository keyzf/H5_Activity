<template>
	<view class="content">
		<view class="list-cell bg" @click="detailed">
		    <view class="cell-tit">
                <view>{{witdraw_data.total_msg}}</view>
                <view class="pice">{{witdraw_data.total_balance}}</view>
            </view>
		    <view class="cell-more" @click="detail">明细</view>
		</view>
        <view class="list-cell m-t" @click="withdraw_type('CASH')">
            <view class="cell-tit">{{witdraw_data.cash_msg}}<text>{{witdraw_data.cash_balance}}</text></view>
            <view class="cell-more btn">提现</view>
        </view>
        <view class="list-cell" @click="withdraw_type('MEAL')">
            <view class="cell-tit">{{witdraw_data.meal_msg}}<text>{{witdraw_data.meal_balance}}</text></view>
            <view class="cell-more btn">提现</view>
        </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
                witdraw_data : {},
				
			}
		},
        onLoad() {
        	this.withdraw_load();
        },
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
        },
        onBackPress(){
            this.$api.ovPage()
        },
		methods: {
            withdraw_load(){
                let data = {
                    cguid : uni.getStorageSync("companyguid"),
                };
                this.$ajax.get('income/getTotalWithdraw', data).then(res => {
                    console.log(res)
                    if(res.data.code == 0){
                        this.witdraw_data = res.data.result.data;
                    }else{
                        this.$api.msg("发生异常")
                        return;
                    }
                });
            },
            detailed(){
                uni.navigateTo({
                    url: '/pages/income/detailed'
                });
            },
			withdraw_type(type){
                uni.navigateTo({
                    url: '/pages/income/withdraw_type?type=' + type
                });
            },
            detail(){
                 uni.navigateTo({
                    url: '/pages/income/detailed'
                });
            }
		}
	}
</script>

<style lang="scss">
page {
    background: $page-color-base;
}
.content {
    border-top: 1px solid #dddddd;
}
.list-cell {
    padding: 20upx $page-row-spacing;
    line-height: 60upx;
    background: #fff;
    border-bottom: 1px solid #dddddd;
    justify-content: space-between;
    align-items: center;
    display: flex;
    &.m-t {
        margin-top: 16upx;
    }
    .cell-more {
        font-size: $font-base;
        color: $font-color-light;
        margin-left: 10upx;
    }
    .cell-tit {
        font-size: $font-base + 2upx;
        color: $font-color-dark;
        margin-right: 10upx;
        .pice{
            font-size: 60rpx;
            color: $base-color;
        }
    }
}
.bg{
    background: $base-color;
    color: #FFF;
    padding: 40rpx 30rpx;
    .cell-tit{
        color: #FFF;
        font-size: 40rpx;
        .pice{
            color: #FFF;
            font-size: 80rpx;
            margin: 40rpx 0;
        }
    }
    .cell-more{
        color: #FFF;
    }
}
</style>
