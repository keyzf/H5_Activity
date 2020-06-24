<template>
    <view class="content">
        <view class="list-cell b-b">
            <text class="cell-tit">支付宝号</text>
            <input class="cell-more input" v-model="aliPayNum" type="text" placeholder="请填写支付宝号" />
        </view>
     
        <view class="tips">
            <text>{{data.msg}}</text>     
        </view>
        <uni-popup ref="popup" type="center" >
             <view class="uni-tip">
                 <view class="uni-tip-title">提示</view>
                 <text class="input">{{data.alertmsg}}</text>
                 <view class="uni-tip-group-button">
                     <view class="uni-tip-button" @click="closePop">我知道了</view>
                 </view>
             </view>
        </uni-popup>
        <view class="footer"><text class="submit" @click="save_card">确定</text></view>
    </view>
</template>

<script>
import uniPopup from "@/components/uni-popup/uni-popup.vue"
export default {
	components: {uniPopup},
    data() {
        return {
			data:{},
			aliPayNum : ""
        };
    },
    onLoad(param) {
        this.alert_info();
    },
    onBackPress(){
        this.$api.ovPage()
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    methods: {
        alert_info(){
            this.$ajax.get("income/getalipaymsg",{cguid : uni.getStorageSync("companyguid")}).then(res =>{
				if(res.data.code == 0){
					this.data = res.data.result.data;
					this.$refs.popup.open();
				}else{
					this.$api.msg("发生异常")
				}
			});
        },
        save_card(){
			if(this.aliPayNum == ""){
				this.$api.msg("请填写支付宝号");
				return;
			}
            let data = {    
                alipay : this.aliPayNum,
                cguid : uni.getStorageSync("companyguid"), 
            };
            this.$ajax.get('income/bindalipay', data).then(res => {
                console.log(res)
                if(res.data.code == 0){
                    this.$api.msg("绑定成功")
                    let paynum = this.aliPayNum;
                    if(paynum.length > 7){
                         paynum = paynum.slice(0,3) + " **** " + paynum.slice(paynum.length - 4,paynum.length);
                    }   
                     this.$api.prePage().data.alipay = paynum;//开户行
                    uni.navigateBack({
                    	
                    });   
                    return;            
                }else{
                    this.$api.msg("发生异常")
                    return;
                }
            });
            
        },
		closePop(){
			this.$refs.popup.close();
		}
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

.list-cell {
    display: flex;
    align-items: center;
    padding: 20upx $page-row-spacing;
    line-height: 60upx;
    position: relative;
    background: #fff;
    justify-content: center;
    &.b-b:after {
        left: 30upx;
    }
    &.m-t {
        margin-top: 16upx;
    }
    .cell-more {
        align-self: center;
        font-size: $font-lg;
        color: $font-color-light;
        margin-left: 10upx;
        &.input {
            flex-grow: 1;
        }
    }
    .cell-tit {
        font-size: $font-base + 2upx;
        color: $font-color-dark;
        margin-right: 10upx;
        min-width: 160rpx;
    }
    .cell-tip {
        font-size: $font-base;
        color: $font-color-light;
    }
}
.tips {
    padding: 20rpx 30rpx;
    font-size: $font-base;
    color: $font-color-light;
}
.uni-tip {
    background: #fff;
    box-sizing: border-box;
}

.uni-tip-title {
    text-align: center;
    font-weight: bold;
    font-size: 16px;
    color: #333;
}

.uni-tip .input {
    padding: 12rpx;
    font-size: 28rpx;
    color: #666;
    border-bottom: 1px solid #dddddd;
    display: block;
    max-height: 60vh;
    overflow-y: auto;
}

.uni-tip-group-button {
    margin-top: 10px;
}

.uni-tip-button {
    text-align: center;
    font-size: 14px;
    color: $base-color;
}
</style>
