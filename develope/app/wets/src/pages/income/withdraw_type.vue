<template>
	<view class="content">
        <!-- <view class="list-cell" @click="bank_card('bank')">
            <view class="cell-tit">
                <view>提现到银行卡</view>
            </view>
            <view class="cell-more yticon icon-you"></view>
        </view> -->
        <view class="list-cell" @click="bank_card('alipay')">
            <view class="cell-tit">
                <view>提现到支付宝</view>
            </view>
            <view class="cell-more yticon icon-you"></view>
        </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
        onLoad(param) {
        	this.cashOrMeal = param.type;
        },
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
        },
        onBackPress(){
            this.$api.ovPage()
        },
		methods: {
			bank_card(type){
			    uni.navigateTo({
			        url: '/pages/income/bank_card?type=' + type + '&cashOrMeal=' + this.cashOrMeal
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
        &.input {
            flex-grow: 1;
        }
    }
    .pice{
        color: $base-color;
        font-size: 32rpx;
    }
    .cell-tit {
        font-size: $font-base + 2upx;
        color: $font-color-dark;
        margin-right: 10upx;
        .tip{
            font-size: 24rpx;
            color: $font-color-base;
        }
    }
}

</style>
