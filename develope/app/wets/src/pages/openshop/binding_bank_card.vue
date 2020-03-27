<template>
    <view class="content">
        <view class="list-cell b-b">
            <text class="cell-tit">真实姓名</text>
            <input class="cell-more input" type="text" placeholder="请输入" v-model="realname" />
        </view>
        <view class="list-cell b-b">
            <text class="cell-tit">银行卡号</text>
            <input class="cell-more input" type="text" placeholder="请输入" v-model="cardNum" />
        </view>
        <view class="list-cell b-b" @click="select_bank">
            <text class="cell-tit">开户银行</text>
            <text class="cell-more input yticon icon-you">请选择</text>
        </view>
        <view class="list-cell b-b">
            <text class="cell-tit">支付宝号</text>
            <input class="cell-more input" type="text" placeholder="请输入" v-model="aliPayNum" />
        </view>
        
        <!-- 注意文字 -->
         <view class="tips">
            <view>注意:</view>
            <view>1.仅可使用储蓄卡、请不要填写信用卡</view>
            <view>2.绑定62开头、有银联标示的储蓄卡,提现更及时</view>
            <view>3.仅支持开户银行列表内的17家银行</view>
            <view>4.填入完整的支付宝账号</view>
            <view>5.不要填写别人的账号,否则后果自负</view> 
        </view>
        
        
        <view class="footer"><text class="submit ash" @click="jump_fun">以后再说</text><text class="submit" @click="deposit">确定</text></view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                realname: "",
                cardNum: "",
                bank_selectName: "",
                bank_selectId: "",
                aliPayNum: "",

            };
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
            check_f(){
                if(this.realname == ""){
                   this.$api.msg("请输入真实姓名!")
                   return false; 
                }
                if(this.cardNum == ""){
                   this.$api.msg("请输入银行卡号!")
                   return false; 
                }
                if(this.bank_selectId == ""){
                   this.$api.msg("请选择开户银行!")
                   return false; 
                }
                if(this.aliPayNum == ""){
                   this.$api.msg("请输入支付宝号!")
                   return false; 
                } 
                return true;
                
            },
            deposit() {
                if(!this.check_f()){
                    return false;
                }
                let data = {
                    realname: this.realname,
                    cardnum: this.cardNum,
                    bankid: this.bank_selectId,
                    alipay: this.aliPayNum,
                    cguid: uni.getStorageSync("companyguid"),
                };
                this.$ajax.get('com/saveBankAndAlipay', data).then(res => {
                    if (res.data.code == 0) {
                        //绑定成功
                        //建店资质页面
                       this.jump_fun();
                    }
                    console.log(res);
                    this.$api.msg(res.data.msg)
                });
            },
            jump_fun() {
                uni.navigateTo({
                    url: '/pages/install/installcon?type=0'
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
