<template>
    <view class="content">
        <view class="titles">
            <image :src="user.headUrl" mode="aspectFill"></image>
            <view class="title">{{ user.name }}</view>
            <view class="tel">{{ user.tel }}</view>
        </view>
        <view class="list-cell b-b">
            <text class="cell-tit">转账个数</text>
            <input class="cell-more input" type="number" v-model="number" placeholder="请输入转账个数(个)" />
        </view>
        <view class="tips">
            <view>{{ tip }}</view>
        </view>
        <view class="footer" @click="back"><text class="submit">确定</text></view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            user: {},
            tip: '',
            number: ''
        };
    },
    onLoad(option) {
        this.user = JSON.parse(option.user);
        this.tip = option.tip;
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    methods: {
        back(){
            let _this = this;
            if (this.number == '') {
                this.$api.msg('请输入正确的金额');
                return;
            }
            uni.showModal({
                title: '提示',
                content: '确认转账？',
                success: res => {
                    if (res.confirm) {
                        _this.submit();
                    }
                }
            })
        },
        submit() {
            this.$ajax.get('ub/confirmsenubtoother', {otherguid: this.user.otherguid, ub: this.number}).then(res => {
                console.log(res);
                if (res.data.code == 0) {
                    this.$api.msg('转账成功');
                    uni.$emit('reload_extra', {});
                    setTimeout(function() {
                        uni.navigateBack();
                    }, 800);
                } else {
                    this.$api.msg(res.data.msg);
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
.titles{
    padding: 30rpx;
    text-align: center;
    background: #FFFFFF;
    image{
        width: 80rpx;
        height: 80rpx;
        border-radius: 80rpx;
    }
    .title{
        font-size: 32rpx;
        margin: 10rpx 0;
    }
    .tel{
        font-size: 30rpx;
    }
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
</style>>
