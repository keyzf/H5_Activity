<template>
	<view class="group">
        <view class="title">
            抢购须知
        </view>
        <view class="second">
            1。如何抢单
        </view>
        <view class="words">
            为了鼓励用户发起拼团，每个团单需向团长打赏一定的金额作为奖励。
        </view>
		<view class="foter">
		    <view class="tip">
		        <label class="radio"><radio value="r1" checked="true" />已阅读并同意以上须知</label>
		    </view>
            <view class="btn" @click="gograb">我要参与抢单</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
        methods:{
            gograb(){
                uni.navigateTo({
                    url:'/pages/grab/grab'
                })
            },
        }
	}
</script>

<style lang="scss">
.group{
    border-top:1px solid #f1f1f1;
    padding-bottom: 60px;
}
.title{
    font-size: 32rpx;
    text-align: center;
    margin: 20rpx 30rpx;
    font-weight: 700;
}
.second{
    font-size: 30rpx;
    margin: 10rpx 30rpx;
    font-weight: 600;
}
.words{
    font-size: 28rpx;
    margin: 5rpx 30rpx;
}
.foter{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    font-size: 30rpx;
    .tip{
        padding: 20rpx;
        background: #DDD;
    }
    .btn{
        background: #EE3847;
        text-align: center;
        padding: 20rpx;
        color: #FFF;
        font-size: 36rpx;
    }
}
</style>
