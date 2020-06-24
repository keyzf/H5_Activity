<template>
    <view>
       <view class="exchange">
           <input type="text" value="" placeholder="请输入兑换码"/>
           <view class="btn">兑换</view>
       </view>
    </view>
</template>

<script>

export default {

    data() {
        return {
           
        };
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    methods: {
        
    }
};
</script>

<style lang="scss">
page {
    background: $page-color-base;
}
.exchange{
    display: flex;
    justify-content: center;
    align-items: center;
    padding:20rpx 30rpx;
    background:#FFFFFF;
    input{
        flex-grow: 1;
        line-height: 50rpx;
        background: #dddddd;
		height: 50rpx;
		padding: 10rpx;
		margin-right: 30rpx;
    }
	.btn{
		 background-color: $base-color;
		 color: #ffffff;
		 font-size: 24rpx;
		 padding:10rpx 20rpx;
		 border-radius: 10rpx;
	}
}
</style>