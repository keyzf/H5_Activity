<template>
	<view class="content">
		<view class="list-cell b-b" @click="credentials">
			<text class="cell-tit">真实姓名</text>
			<text class="cell-more input yticon icon-you">{{data.name}}</text>
		</view>
		<view class="list-cell b-b">
			<text class="cell-tit">证件类型</text>
			<text class="cell-more input">{{data.verificationstateinfo}}</text>
		</view>
		<view class="list-cell b-b" @click="credentials">
			<text class="cell-tit">证件号</text>
			<text class="cell-more input ccov">{{data.verificationinfo}}</text>
		</view>
		<view class="list-cell b-b">
			<text class="cell-tit">手机号</text>
			<text class="cell-more input">{{data.tel}}</text>
		</view>
		<view class="list-cell b-b" @click="binding_bank_card">
			<text class="cell-tit">银行卡号</text>
			<text class="cell-more input yticon icon-you">{{data.cardinfo}}</text>
		</view>
		<view class="list-cell b-b">
			<text class="cell-tit">开户行</text>
			<text class="cell-more input">{{data.bankinfo}}</text>
		</view>
		<view class="list-cell b-b" @click="binding_alipay">
			<text class="cell-tit">支付宝</text>
			<text class="cell-more input yticon icon-you">{{data.alipay}}</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
            data : {},
            realName : "",
            cardNum : "",
        };
	},
    onLoad() {
    	this.load();
    },
    onBackPress(){
        this.$api.ovPage()
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
	methods: {
        load(){
            let data = {
                  cguid : uni.getStorageSync("companyguid"),
            }
            this.$ajax.get('com/verificationinfo', data).then(res => {
                if(res.data.code == 0){
                    this.data = res.data.result.data;
                    console.log(res.data.result.data) 
                }else{
                    this.$api.msg(res.data.msg)
                    return;
                }
            });
        },
		credentials(){
			uni.navigateTo({
				url: '/pages/attestation/credentials'
			});
		},
		binding_bank_card() {
			uni.navigateTo({
				url: '/pages/income/binding_bank_card?type=attestation'
			});
		},
        binding_alipay() {
        	uni.navigateTo({
        		url: '/pages/income/binding_alipay'
        	});
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
        word-break: break-all;
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
.ccov{
    width: 400rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    
}
</style>
