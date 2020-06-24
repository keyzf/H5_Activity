<template>
    <view class="content">
        <view class="adtip">{{advert.desc}}</view>
        <view class="adend">
            <textarea value="" v-bind:placeholder="advert.hint" v-model="pushmessage"/>
        </view>
        <view class="adtip">今日可发送数量:<text>{{advert.remain}}</text></view>
        <view class="footer">
        	<text class="submit" @click="save">发送</text>
        </view>
    </view>
</template>
<script>
export default {
    data() {
        return {
			submitMark: true,
			pushmessage:'',
			advert:{
				canPush:'',
				remain:'',
				desc:'',
				hint:''
			}
		};
    },
	onLoad(){
		this.cguid = uni.getStorageSync('companyguid'); //店铺id
		this.getPushInfo();
	},
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    methods: {
		getPushInfo(){
			this.$ajax.get("sale/getPushMessagePage",{cguid:this.cguid}).then(res => {
				if(res.data.code == 0){
					this.advert = res.data.result.data;
				}
			});
			this.submitMark = true;
		},
		save(){
			if(this.check() && this.submitMark){
				this.submitMark = false;
				this.$ajax.get("sale/pushMessageToFollowUser",{cguid:this.cguid,pushmessage:this.pushmessage}).then(res => {
					this.$api.msg(res.data.msg);
					if(res.data.code == 0){
						this.pushmessage = '';
						this.getPushInfo();
					}else{
						this.submitMark = true;
					}
				});
			}
		},
		check(){
			let msg = "";
			let mark = true;
			if(this.pushmessage == ''){
				msg = "广告推送内容不能为空哦!";
				mark = false;
			}
			if(!mark){
				this.$api.msg(msg);
			}
			return mark;
		}
    },
    onNavigationBarButtonTap(){
        uni.navigateTo({
            url:'/pages/promotion/advertisementhistory'
        })
    },
};
</script>

<style lang="scss">
page {
	background: $page-color-base;
}
.content {
    border-top: 1px solid #dddddd;
	padding-bottom: 100rpx;
}
.adtip{
    border-bottom: 1px solid #dddddd;
    background: #FFFFFF;
    padding: 20rpx 30rpx;
    font-size: 28rpx;
    text{
        color: #fa436a;
        margin-left: 10rpx;
    }
}
.adend{
    background: #FFFFFF;
    padding: 20rpx 30rpx;
    textarea{
        width: 100%;
    }
}
</style>