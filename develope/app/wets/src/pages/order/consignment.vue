<template>
    <view class="content">
        <view class="list-cell" @click="openPopup">
            <view class="cell-tit">快递单号</view>
            <view class="cell-more yticon icon-you">{{ expressnumber || '请输入快递单号' }}</view>
        </view>
        <view class="list-cell" @click="express">
            <view class="cell-tit">快递公司</view>
            <view class="cell-more yticon icon-you">{{ expressname || '请选择' }}</view>
        </view>
        <view class="footer" @click="submit"><text class="submit">提交</text></view>
        <uni-popup ref="addclassification" type="center">
            <view class="uni-tip">
                <view class="uni-tip-title">快递单号</view>
                <input class="input" type="text" v-model="expressnumber" maxlength="30" placeholder="请输入快递单号" />
                <view class="uni-tip-group-button"><view class="uni-tip-button" @click="closePopup">确定</view></view>
            </view>
        </uni-popup>
    </view>
</template>
<script>
    import uniPopup from '@/components/uni-popup/uni-popup.vue';
export default {
    components: {
        uniPopup
    },
    data() {
        return {
            refundcode: '',
            expressname: '',
            expressnumber: '',
            expresscompanyid: ''
        };
    },
    onLoad(option) {
        this.refundcode = option.refundcode;
    },
    onBackPress(){
        this.$api.ovPage()
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    methods: {
        // 打开窗口
        openPopup(){
            this.$refs.addclassification.open();
        },
        // 关闭窗口
        closePopup(){
            this.$refs.addclassification.close();
        },
        // 选择物流
        express(){
            uni.navigateTo({
                url: '/pages/shoporder/express'
            });
        },
        // 修改物流公司
        editExpress(data) {
            this.expressname = data.expressname;
            this.expresscompanyid = data.id;
        },
        // 确认发货
        submit() {
            if (this.expressnumber.length == 0) {
                this.openPopup();
                return;
            }
            if (this.expresscompanyid.length == 0 || this.expresscompanyid == 0) {
                this.$api.msg('请选择快递公司');
                return;
            }
            let data = {
                refundcode: this.refundcode,
                number: this.expressnumber,
                cid: this.expresscompanyid
            };
            this.$ajax.get('com/saveRefundExpress', data).then(res => {
                console.log(res);
                if (res.data.code) {
                    this.$api.prePage().getRefundFlowList();
                    setTimeout(function() {uni.navigateBack();}, 800);
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
.logistics {
    padding: 20rpx 30rpx;
    background: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 28rpx;
    border-bottom: 1px solid #dddddd;
}
.list-cell {
    padding: 20upx $page-row-spacing;
    line-height: 60upx;
    background: #fff;
    border-bottom: 1px solid #dddddd;
    justify-content: space-between;
    align-items: center;
    display: flex;
    .radio {
        flex-grow: 1;
        justify-content: space-between;
        align-items: center;
        display: flex;
    }
    &.m-t {
        margin-top: 16upx;
    }
    .cell-more {
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
    }
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

.input {
    padding: 12rpx;
    font-size: 28rpx;
    color: #666;
    border-bottom: 1px solid #dddddd;
    display: block;
    height: auto;
}

.uni-tip-group-button {
    margin-top: 10px;
}

.uni-tip-button {
    text-align: center;
    font-size: 14px;
    color: $base-color;
}
/deep/ .uni-popup__wrapper-box {
    border-radius: 20rpx;
}
</style>
