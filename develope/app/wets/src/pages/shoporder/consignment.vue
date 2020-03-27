<template>
    <view class="content">
        <view class="logistics">
            <view>
                <view>收货人:{{ consignment.receivername }} {{ consignment.receivertel }}</view>
                <view>{{ consignment.address }}</view>
            </view>
        </view>
        <view class="list-cell m-t">
            <label class="radio" @click="radioClick(1)">
                普通快递
                <radio :checked="consignment.logistictype == 1" value="" />
            </label>
        </view>
        <view class="list-cell">
            <label class="radio" @click="radioClick(0)">
                无需物流
                <radio :checked="consignment.logistictype == 0" value="" />
            </label>
        </view>
        <view class="list-cell" @click="openPopup" v-show="consignment.logistictype == 1">
            <view class="cell-tit">快递单号</view>
            <view class="cell-more yticon icon-you">{{ consignment.expressnumber || '请输入快递单号' }}</view>
        </view>
        <view class="list-cell" @click="express" v-show="consignment.logistictype == 1">
            <view class="cell-tit">快递公司</view>
            <view class="cell-more yticon icon-you">{{ consignment.expressname || '请选择' }}</view>
        </view>
        <view class="footer" @click="submit"><text class="submit">发货</text></view>
        <uni-popup ref="addclassification" type="center">
            <view class="uni-tip">
                <view class="uni-tip-title">快递单号</view>
                <input class="input" type="number" v-model="consignment.expressnumber" placeholder="请输入快递单号" />
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
            ordernumber: '',
            cguid: uni.getStorageSync('companyguid'),
            consignment: {}
        };
    },
    onLoad(option) {
        this.ordernumber = option.ordernumber;
        this.getInfo();
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    methods: {
        // 获取发货详情
        getInfo() {
            this.$ajax.get('com/preDeliverOrder', {ordernumber: this.ordernumber, cguid: this.cguid}).then(res => {
                console.log(res);
                if (res.data.code == 0) {
                    this.consignment = res.data.result.data;
                    if (this.consignment.expressnumber == '' || this.consignment.expressnumber == null) {
                        this.consignment.expressnumber = '';
                    }
                } else {
                    this.$api.msg('获取发货信息失败');
                }
            });
        },
        // 打开窗口
        openPopup(){
            this.$refs.addclassification.open();
        },
        // 关闭窗口
        closePopup(){
            this.$refs.addclassification.close();
        },
        // 选择物流方式
        radioClick(type) {
            this.consignment.logistictype = type;
        },
        // 选择物流
        express(){
            uni.navigateTo({
                url: '/pages/shoporder/express'
            });
        },
        // 修改物流公司
        editExpress(data) {
            this.consignment.expressname = data.expressname;
            this.consignment.expresscompanyid = data.id;
        },
        // 确认发货
        submit() {
            if (this.consignment.logistictype == 1) {
                if (this.consignment.expressnumber.length == 0) {
                    this.openPopup();
                    return;
                }
                if (this.consignment.expressname == null || this.consignment.expressname.length == 0) {
                    this.$api.msg('请选择快递公司');
                    return;
                }
            }
            this.$ajax.get('com/deliverConfirm', {
                ordernumber: this.ordernumber,
                logistictype: this.consignment.logistictype,
                expressnumber: this.consignment.logistictype == 0 ? '' : this.consignment.expressnumber,
                expresscompanyid: this.consignment.logistictype == 0 ? '' : this.consignment.expresscompanyid
            }).then(res => {
                console.log(res);
                if (res.data.code) {
                    this.$api.msg('发货成功');
                    this.$api.prePage().getOrderDetail();
                    setTimeout(function() {uni.navigateBack();}, 800);
                } else {
                    this.$api.msg('发货失败');
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
