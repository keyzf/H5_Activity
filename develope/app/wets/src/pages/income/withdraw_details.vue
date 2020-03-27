<template>
	<view class="content">
        <view class="title">{{data.msg}}</view>
        <view class="list-cell" v-if="type == 'bank'">
            <view class="cell-tit" >到账银行</view>
            <view class="cell-more">{{data.bank}}</view>
        </view>
          <view class="list-cell" v-else>
            <view class="cell-tit" >到账支付宝</view>
            <view class="cell-more">{{data.alipay}}</view>
        </view>
        <view class="list-cell">
            <view class="cell-tit">提现金额</view>
            <view class="cell-more">{{data.withdraw}}</view>
        </view>
        <view class="list-cell">
            <view class="cell-tit">预计到账时间</view>
            <view class="cell-more">{{data.deadline}}</view>
        </view>
        <view class="footer"><text class="submit" @click="submit_fun">完成</text></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
                data : {},
            }
		},
        onLoad(param) {
            this.type = param.type;
            this.withdraw = param.withdraw;
            this.load()
        },
        onBackPress(){
            this.$api.ovPage()
        },
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
        },
		methods: {
            load(){
                let url;
                if(this.type == "bank"){
                    url = "income/getwithdrawsuccessdetail";
                }else{
                    url = "income/getwithdrawalipaysuccessdetail";
                }
                let data = {
                    withdraw : this.withdraw ,
                    cguid : uni.getStorageSync("companyguid"),
                }
                this.$ajax.get(url, data).then(res => {
                    console.log(res)
                    if(res.data.code == 0){     
                        this.data = res.data.result.data;  
                    }else{
                        this.$api.msg("发生异常")
                        return;
                    }
                }); 
            },
            submit_fun(){
               uni.navigateBack(); 
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
.title{
    padding: 50rpx 30rpx;
    font-size: 40rpx;
    text-align: center;
    background: #FFFFFF;
    border-bottom: 1px solid #dddddd;
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

</style>
