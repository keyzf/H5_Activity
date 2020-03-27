<template>
    <view class="contents">
        <view class="con">
            <watermark :sytext="sytext" class="bg"></watermark>
            <view class="xdys">
                <view class="title">缴费凭证</view>
                <view class="tip">
                    此凭证仅供参考，请以收方账号实际入账为准。
                </view>
                <view class="item">
                    <view class="head">收款方</view>
                    <view class="content">{{ historyinfo.payee }}</view>
                </view>
                <view class="item">
                    <view class="head">转账金额</view>
                    <view class="content">{{ historyinfo.deposit }}</view>
                </view>
                <view class="item">
                    <view class="head">付款方式</view>
                    <view class="content">{{ historyinfo.paymethod }}</view>
                </view>
                <view class="item">
                    <view class="head">转账流水号</view>
                    <view class="content">{{ historyinfo.deposit_number }}</view>
                </view>
                <view class="item">
                    <view class="head">交易时间</view>
                    <view class="content">{{ historyinfo.createtime }}</view>
                </view>
                <view class="item">
                    <view class="head">缴费明细</view>
                    <view class="content">{{ historyinfo.paytype }}</view>
                </view>
                <text class="paid" v-show="historyinfo.is_pay == 1"></text>
            </view>
        </view>
    </view>
</template>

<script>
    import watermark from '@/components/watermark/watermark.vue';
export default {
    components:{
        watermark
    },
	data() {
		return {
            sytext:'',
            historyinfo: {
                is_pay: 0
            }
        };
	},
    onLoad(option) {
        this.$ajax.get('com/getDetailDepositHistory', {id: option.id}).then(res => {
            if (res.data.code == 0) {
                this.historyinfo = res.data.result.data;
                this.sytext=res.data.result.data.watermark;
            } else {
                this.$api.msg('获取详情失败');
            }
        });
    },
    onBackPress(){
        this.$api.ovPage()
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
	methods: {
        
	}
};
</script>

<style lang="scss">
page {
    background: $page-color-base;
}
.contents {
    border-top: 1px solid #dddddd;
}
.con {
    width: 700rpx;
    margin: 25rpx auto;
    padding: 20rpx;
    border-radius: 20rpx;
    position: relative;
    .bg{
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
    }
    .xdys{
        position: relative;
        z-index: 555;
    }
    .title {
        font-size: 40rpx;
        text-align: center;
    }
    .tip {
        font-size: 30rpx;
        text-align: center;
        margin: 20rpx 0;
    }
    .item {
        display: flex;
        align-items: center;
        font-size: 32rpx;
        padding: 14rpx 0;
        .head {
            width: 160rpx;
            min-width: 160rpx;
        }
        .content {
            flex-grow: 1;
            text-align: right;
        }
    }
    .paid {
        position: absolute;
        top: 80rpx;
        right: 80rpx;
        height: 140rpx;
        width: 140rpx;
        background: url(../../static/paid.png) no-repeat;
        background-size: 100% 100%;
    }
}
</style>
