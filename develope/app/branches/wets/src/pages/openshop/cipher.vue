<template>
    <!-- 校验手机 -->
    <view class="content">
        <view class="list-cell b-b">
            <input class="cell-more" type="text" placeholder="请输入手机号码" v-model="tel" maxlength="11" />
            <text class="cell-tit" v-show="show" @click="getcode">获取验证码</text>
            <text class="cell-tit" v-show="!show">{{ count }}s后获取</text>
        </view>
        <view class="list-cell b-b">
            <input class="cell-more" type="text" placeholder="请输入验证码" v-model="verification" />
        </view>
		<view class="footer"><text class="submit" @click="checkcode">下一步</text></view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            show : true,
            count : 60,
            tel : "",
            verification : "",
            timer: null
        };
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    onBackPress(){
        this.$api.ovPage()
    },
    methods: {
        //倒计时60秒
        countdown() {
        	this.count = 60;
        	this.show = false;
        	this.timer = setInterval(() => {
        		if (this.count == 1) {
        			clearInterval(this.timer);
        			this.show = true;
        		} else {
        			this.count--;
        		}
        	}, 1000);
        },
        //发送验证码
        getcode(){
            if(this.tel.length == 0){
                this.$api.msg("请输入手机号")
                return;
            }
            let data= {
                tel : this.tel
            }
            this.$ajax.get('com/getVerificationCodeInCreateShop',data).then(res => {
                   console.log(res);
                   if (res.data.code == 0) {
                     this.countdown();     
                   }
                   this.$api.msg(res.data.msg)
           }); 
        },
        //提交验证码
        checkcode(){
            if(this.tel.length == 0){
               this.$api.msg("请输入手机号")
               return;
            }
            if(this.verification.length == 0){
               this.$api.msg("请输入验证码")
               return;
            }
            
            let data = {
                tel : this.tel,
                verification : this.verification,
                cguid :  uni.getStorageSync("companyguid"),
     
            };
            this.$ajax.get('com/checkPhoneInCreatePhone',data).then(res => {
               if (res.data.code == 0) { 
                   //skipLicenseVerify 0 不挑过营业执照验证  1 跳过
                   let url = "";
                    if (res.data.result.data.skipLicenseVerify == 0) { 
                        url = "/pages/openshop/qualifications?type=creatShop";
                    }else{
                         url = "/pages/openshop/binding_bank_card";
                    }
                   uni.navigateTo({
                   	url: url
                   })
                }
                this.$api.msg(res.data.msg)
          });
        },
		qualifications(){
			uni.navigateTo({
				url:'/pages/openshop/qualifications'
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
}
.list-cell {
    display: flex;
    align-items: center;
    padding: 20upx $page-row-spacing;
    position: relative;
    background: #fff;
    justify-content: center;
    &.cell-hover {
        background: #fafafa;
    }
    &.b-b:after {
        left: 30upx;
    }
    &.m-t {
        margin-top: 16upx;
    }
    .cell-more {
        font-size: $font-lg;
        color: $font-color-light;
        margin-left: 10upx;
        flex: 1;
    }
    .cell-tit {
        width: 180rpx;
        font-size: $font-base + 2upx;
        color: $base-color;
        margin-right: 10upx;
        border: 1px solid #DDD;
        border-radius: 14rpx;
        padding: 6rpx 10rpx;
        text-align: center;
    }
    .tximg {
        width: 100rpx;
        height: 100rpx;
        vertical-align: middle;
    }
    .cell-tip {
        font-size: $font-base;
        color: $font-color-light;
    }
}
</style>
