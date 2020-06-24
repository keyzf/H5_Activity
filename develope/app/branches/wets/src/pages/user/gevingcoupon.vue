<template>
    <view>
       <view class="exchange">
           <input type="number" v-model="tel" placeholder="请输入手机号码" maxlength="11"/>
           <view class="btn" @click="submit">确定</view>
       </view>
    </view>
</template>

<script>

export default {
    data() {
        return {
		   id: 0,
           tel: '',
        };
    },
	onLoad(options) {
		this.id = options.id;
	},
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    methods: {
        submit() {
			if(this.tel == ""){
				this.$api.msg("请输入手机号");
				return;
			}
            uni.showLoading({
                title: '请稍等...'
            })
			this.$ajax.get('user/couponDonateByTel', {tel: this.tel, usercouponid: this.id}).then(res => {
                uni.hideLoading();
                this.$api.msg(res.data.msg);
                if (res.data.code == 0) {
                    setTimeout(()=>{
                    	uni.navigateBack();
                    }, 1000)
                }
			});
		}
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