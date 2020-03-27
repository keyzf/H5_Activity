<template>
    <view class="content">
        <view class="card">
            <view class="nr">
                <img :src="cardDetail.iconurl">
                <view class="con">
                    <view class="name">{{cardDetail.realname}}</view>
                    <view class="tip">{{cardDetail.bankname}}</view>
                </view>
            </view>
            <view class="number">
                {{cardDetail.tailnumber}}
            </view>
        </view>
        <view class="footer" @click="changeCard"><text class="submit">更换银行卡</text></view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            cardDetail : {
                realname : "无",
                bankname : "无",
                tailnumber : "无"
            },
        };
    },
    onLoad() {
        this.cardlist();	
    },
    onBackPress(){
        this.$api.ovPage()
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    methods: {
        cardlist(){
            let data = {    
                cguid : uni.getStorageSync("companyguid"),
            };
            this.$ajax.get('income/getbankcard', data).then(res => {
                console.log(res)
                if(res.data.code == 0){
                     this.cardDetail = res.data.result.data    
                }else{
                    this.$api.msg("发生异常")
                    return;
                }
            });
        },
        changeCard(){
            uni.navigateTo({
            	url : '/pages/income/binding_bank_card'
            })
            
        },
      
    }
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
.card{
    width: 90%;
    margin: 30rpx auto;
    background-image: linear-gradient(to right, rgb(255, 112, 49) , rgb(255, 17, 63));
    padding: 30rpx;
    border-radius: 20rpx;
    color: #FFFFFF;
    .nr{
        display: flex;
        align-items: center;
        margin-bottom: 80rpx;
        img{
            width: 100rpx;
            height: 100rpx;
            margin-right: 10rpx;
        }
        .tip{
            font-size: 24rpx;
        }
    }
    .number{
        text-align: center;
    }
}
</style>
