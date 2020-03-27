<template>
    <view class="content">
        <view class="list-cell b-b">
            <text class="cell-tit">对方账号</text>
            <input class="cell-more input" type="number" v-model="tel" maxlength="11" placeholder="请输入对方手机号码" />
        </view>
        <view class="tips">
            <view>{{ notic }}</view>
        </view>
        <view class="footer" @click="back"><text class="submit">下一步</text></view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            tel: '',
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
            this.$ajax.get('ub/getubtip', {type: 2}).then(res => {
                if (res.data.code == 0) {
                    this.notic = res.data.result.data.tip;
                } else {
                    this.$api.msg(res.data.msg);
                }
            });
        },
        back(){
            if(!/(^1[3|4|5|7|8][0-9]{9}$)/.test(this.tel)){
            	this.$api.msg('请输入正确的手机号码');
            	return;
            }
            this.$ajax.get('ub/getotherpersoninfo', {tel: this.tel}).then(res => {
                if (res.data.code == 0) {
                    uni.redirectTo({
                        url:'/pages/user/accounts-user?user=' + JSON.stringify(res.data.result.data) + '&tip=' + this.notic
                    })
                } else {
                    this.$api.msg(res.data.msg);
                }
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