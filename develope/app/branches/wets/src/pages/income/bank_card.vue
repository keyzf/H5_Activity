<template>
    <view class="content">
        <view class="list-cell b-b" v-if=" type == 'bank'">
            <text class="cell-tit">到账银行卡</text>
            <view class="cell-more input">{{data.name}}</view>
        </view>
         <view class="list-cell b-b" v-else>
            <text class="cell-tit">到账支付宝</text>
            <view class="cell-more input">{{data.alipay}}</view>
        </view>
        <view class="list-cell b-b">
            <text class="cell-tit">提现金额</text>
            <input class="cell-more input" type="number" :placeholder="'可提现金额' + (data.withdraw?data.withdraw:'0')" v-model="money"/>
            <text class="cell-more btn" @click="rate(data.withdraw)">全部提取</text>
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
        <view class="footer" @click="rate()"><text class="submit">确定</text></view>
    </view>
</template>

<script>
import uniPopup from "@/components/uni-popup/uni-popup.vue"
export default {
	components: {uniPopup},
    data() {
        return {
            data : {
                withdraw : 0,
            },
            money : "",
            type : "",
        };
    },
    onLoad(param) {
    	this.type = param.type;
        this.cashOrMeal = param.cashOrMeal;
        this.load();
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    onBackPress(){
        this.$api.ovPage()
    },
    methods: {
        withdrawdetails(){
            uni.navigateTo({
                url: '/pages/income/withdraw_details'
            });
        },
        load(){
            let url;
            if(this.type == 'bank'){
                url = 'income/getbankandwithbank';   //银行卡
            }else{
                url = 'income/getalipaymsg'; //支付宝
            }
            //income/getbankandwithbank 银行卡
            //income/getalipayandwithdraw//支付宝
            let data = {
                cguid : uni.getStorageSync("companyguid"),
                code : this.cashOrMeal, 
            };
           this.$ajax.get(url, data).then(res => {
              console.log(res)
              if(res.data.code == 0){
				this.data = res.data.result.data;
				if(this.type == "alipay"){
					this.$refs.popup.open();
				}
              }else{
                this.$api.msg("发生异常")
				return;
              }
          });  
        },
        //提交
        submit_fun(){
            let data = {
                cguid : uni.getStorageSync("companyguid"),
                code : this.cashOrMeal,
                withdraw : this.money,
            }
            let url;
            if(this.type == 'bank'){
                url = 'income/withdraw';   //银行卡
                data.bcid = this.data.id;
            }else{
                url = 'income/withdrawalipay'; //支付宝
            }
               this.$ajax.get(url, data).then(res => {
               console.log(res)
               if(res.data.code == 0){
                    uni.navigateTo({
                       url: '/pages/income/withdraw_details?type=' + this.type + '&withdraw=' + this.money 
                   });
               }else{
                   this.$api.msg("发生异常")
                   return;
               }
           }); 
        },
        //获取手续费
        rate(all_money){
            let page_this = this;
             //全部提现
            if(all_money != undefined){
               this.money = all_money;
            }
            let data = {
                cguid : uni.getStorageSync("companyguid"),
                code : this.cashOrMeal,
                withdraw : this.money,
            }
           
            this.$ajax.get('income/getRealWithdrawAndRate', data).then(res => {
                console.log(res)
                if(res.data.code == 0){
                    let data = res.data.result.data;
                    //弹框
                    uni.showModal({
                        title: '提现',
                        confirmColor : '#fa436a',
                        content: data.withdraw_text + '-' + data.withdraw_rate_text, //金额
                        success: function (res) {
                            if (res.confirm) {
                                page_this.submit_fun();
                            } else if (res.cancel) {
                                return;
                            }
                        }
                    });
                }else{
                    this.$api.msg(res.data.msg)
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
    .btn{
        color: #0081FF;
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
