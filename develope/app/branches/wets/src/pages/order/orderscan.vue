<template>
    <view>
        <view class="yt-list">
            <label v-show="item.isscancode == 0" v-for="(item, index) in data" :key="index">
                <view class="yt-list-cell b-b">
                    <view class="cell-tit">
                        <text>{{ item.productname }}</text>
                        <text>{{ item.attributeshow }}</text>
                    </view>
                    <text class="cell-tip">
                        <text>{{ item.number }}</text>
                        <checkbox value="" :checked="item.checked" @click="checkClick(item)" />
                    </text>
                </view>
            </label>
        </view>
        <!-- 底部 -->
        <view class="remarks">
            <view>备注</view>
            <textarea v-model="value" placeholder="添加收货备注"/>
        </view>
        <view class="footer" @click="submit"><text class="submit">收货并继续</text></view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            value:"",
            ordernumber: '',
            data: [],
            submitState: true
        };
    },
    onLoad(option) {
        uni.setNavigationBarTitle({title: '扫码收货'})
        this.ordernumber = option.ordernumber;
        this.getOrderScancode();
    },
    onBackPress(){
        this.$api.ovPage()
    },
    methods: {
        getOrderScancode() {
            this.$ajax.get('order/scancode', {ordernum: this.ordernumber}).then(res => {
                if (res.data.code == 0) {
                    if (!res.data.result) {
                        this.$api.msg(res.data.msg);
                        return;
                    }
                    this.data = res.data.result.data;
                    this.data.forEach(item => {
                        item.chaecked = false;
                    });
                } else {
                    this.$api.msg(res.data.msg);
                }
            });
        },
        // 选择商品
        checkClick(item) {
            item.chaecked = !item.chaecked;
        },
        // 确认收货
        submit() {
            if (!this.submitState) {
                return;
            }
            let attribute = [];
            this.data.forEach(item => {
                if (item.chaecked) attribute.push(item.skuattributeid);
            });
            if (attribute.length == 0) {
                this.$api.msg('请选择收货商品');
                return;
            }
            if (this.value == '') {
                this.$api.msg('请填写备注信息');
                return;
            }
            this.submitState = false;
            this.$ajax.get('order/cargoinfo', {remark: this.value, ordernum: this.ordernumber, attribute: attribute.join('_')}).then(res => {
                this.$api.msg(res.data.msg);
                this.submitState = true;
                if (res.data.code == 0) {
                    setTimeout(function() {
                        uni.navigateBack();
                    }, 1000)
                }
            });
        }
    }
};
</script>

<style lang="scss">
page {
    background: $page-color-base;
    min-height: 100%;
}
.yt-list {
    background: #fff;
}

.yt-list-cell {
    display: flex;
    align-items: center;
    padding: 10upx 30upx 10upx 40upx;
    line-height: 70upx;
    position: relative;
    &.b-b:after {
        left: 30upx;
    }
    .cell-tit {
        flex: 1;
        font-size: 26upx;
        margin-right: 10upx;
    }
    .cell-tip {
        font-size: 26upx;
        color: $font-color-dark;
        vertical-align: middle;
        text{
            vertical-align: middle;
            margin-right: 20rpx;
        }
        checkbox{
            transform:scale(0.7)
        }
    }
}
.remarks {
    position: fixed;
    left: 30rpx;
    right: 30rpx;
    bottom: 100rpx;
    z-index: 998;
    textarea{
        width: 100%;
        background: #FFF;
        border: 1rpx solid #DDD;
        border-radius:20rpx;
        margin-top: 10rpx;
        padding: 10rpx;
        height: 120rpx;
    }
}
.footer {
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    width: 100%;
    height: 90upx;
    justify-content: space-between;
    z-index: 998;
    box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);
    .submit {
        color: #fff;
        font-size: 32upx;
        background-color: $base-color;
        flex-grow: 1;
    }
}
</style>
