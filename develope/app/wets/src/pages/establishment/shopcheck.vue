<template>
    <view class="cen">
        <view class="item" v-for="(it,ind) in date" :key="ind" @click="jump(it)">
            <view class="title">{{it.title}}</view>
            <view class="btn">{{it.jumptext}}</view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            date:[]
        };
    },
    onLoad() {
      this.onload_f();
      let _this = this;
      uni.$once('onload_f',function(data){
      	_this.onload_f();
      });
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    onBackPress(){
        this.$api.ovPage()
    },
    methods:{
        onload_f(){
             let data={
               cguid:uni.getStorageSync("companyguid")
           }
           this.$ajax.get('com/checklist', data).then(res => {
               if (res.data.code == 0) {
                   this.date = res.data.result.data;
               }
           }); 
        },
        
        jump(it){
            console.log(it)
            switch (it.jumpcode){
                case 'NAME':
                    uni.navigateTo({
                        url:'/pages/establishment/editshop'
                    })
                    break;
                case 'QUALIFICATION':
                    uni.navigateTo({
                        url:'/pages/openshop/qualifications'
                    })
                    break;
                case 'IDENTITY':
                    uni.navigateTo({
                        url:'/pages/attestation/credentials?type=shopcheck'
                    })
                    break;
                case 'DEPOSIT':
                    uni.navigateTo({
                        url:'/pages/install/installcon?type=1'
                    })
                    break;
            }
        },
    }
};
</script>

<style lang="scss">
page {
    background: $page-color-base;
}
.cen {
    border-top: 1px solid #dddddd;
}
.item {
    padding: 20rpx 30rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    border-bottom: 1px solid #dddddd;
    font-size: 32rpx;
    .btn{
        background: $base-color;
        color: #FFF;
        padding: 10rpx 20rpx;
        border-radius: 14rpx;
        font-size: 24rpx;
    }
}
</style>
