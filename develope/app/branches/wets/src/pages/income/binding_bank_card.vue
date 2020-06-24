<template>
    <view class="content">
        <view class="list-cell b-b">
            <text class="cell-tit">真实姓名</text>
            <input class="cell-more input" v-model="realname" type="text" placeholder="请填写真实姓名" />
        </view>
        <view class="list-cell b-b">
            <text class="cell-tit">银行卡号</text>
            <input class="cell-more input" v-model="cardNum" type="number" placeholder="请填写银行卡号" />
        </view>
        <view class="list-cell b-b" @click="select_bank">
            <text class="cell-tit">开户银行</text>
            <text class="cell-more input yticon icon-you">{{bank_selectName == ""?"请选择开户银行":bank_selectName}}</text>
        </view>
        <view class="tips">
            <view>注意:</view>
            <view>1.仅可使用储蓄卡、请不要填写信用卡</view>
            <view>2.绑定62开头、有银联标示的储蓄卡,提现更及时</view>
            <view>3.仅支持开户银行列表内的17家银行</view>
        </view>
        <view class="footer"><text class="submit" @click="save_card">确定</text></view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            bank_selectId : "",
            bank_selectName : "",
            realname : "",
            cardNum : "",
        };
    },
    onLoad(param) {
        //attestation
        this.parentType = param.type;
        
    	
    },
    onBackPress(){
        this.$api.ovPage()
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    methods: {
        select_bank() {
            uni.navigateTo({
                url: '/pages/income/select_bank'
            });
        },
        save_card(){
			if(this.realname == ""){
				this.$api.msg("请填写真实姓名");
				return;
			}
			if(this.cardNum == ""){
				this.$api.msg("请填写银行卡号");
				return;
			}
			if(this.bank_selectId == ""){
				this.$api.msg("请选择开户银行");
				return;
			}
            let data = {    
                realname : this.realname,
                cardnum : this.cardNum,
                bankid : this.bank_selectId,
            };
            uni.showLoading({
			mask : true
			})
            this.$ajax.get('income/bindbank', data).then(res => {
                uni.hideLoading()
                console.log(res)
                if(res.data.code == 0){
                    this.$api.msg("绑定成功")
                    //认证页面过来的
                    if(this.parentType == 'attestation'){
                        let sonCardNum = this.cardNum.slice(this.cardNum.length -4,this.cardNum.length);
                        sonCardNum = '*** **** ****' + sonCardNum;
                        this.$api.prePage().data.cardinfo = sonCardNum ; //卡号
                        this.$api.prePage().data.bankinfo = this.bank_selectName;//开户行
                        uni.navigateBack();
                        return;
                    }
                    uni.navigateTo({
                    	url : "/pages/income/income"
                    })
                    return;            
                }else{
                    this.$api.msg("发生异常")
                    return;
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
</style>
