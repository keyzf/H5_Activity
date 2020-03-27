<template>
    <view class="content">
        <view class="list-cell b-b">
            <text class="cell-tit">充值个数</text>
            <input class="cell-more input" type="number" maxlength="7" v-model="u_number" @keydown="validata" placeholder="请输入充值个数(个)" />
        </view>
        <view class="tips">
            <view><text>{{ notic }}</text></view>
        </view>
        <view class="footer" @click="back"><text class="submit">下一步</text></view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            u_number: '',
            notic: ''
        };
    },
    onLoad() {
        this.getNotic();
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    methods: {
        // 获取提示信息
        getNotic() {
            this.$ajax.get('ub/getubtip', {type: 1}).then(res => {
                if (res.data.code == 0) {
                    this.notic = res.data.result.data.tip;
                } else {
                    this.$api.msg('获取提示失败');
                }
            });
        },
        back(){
			if(this.u_number == ""){
				this.$api.msg("请输入正确的金额");
				return;
			}
            this.$ajax.get('ub/adduborder', {rechargeprice: this.u_number}).then(res => {
                if (res.data.code == 0) {
                    uni.navigateTo({
                        url: '/pages/user/ub_pay?ordernumber=' + res.data.result.data.ordernumber
                    })
                } else {
                    this.$api.msg(res.data.msg);
                }
            });
        },
        // 数字值校验
        validata(e) {
            
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
        min-width: 120rpx;
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
</style>