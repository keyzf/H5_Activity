<template>
    <!-- 收入 -->
    <view class="content">
        <view class="list-cell" v-for="(item, index) in cashOut" @click="transaction(item.stype)">
            <view class="cell-tit">
                <view>{{ item.maintitle }}</view>
                <view class="tip">{{ item.subtitle }}</view>
            </view>
            <view class="cell-more yticon icon-you pice">{{ item.price }}</view>
        </view>

        <view class="list-cell m-t" v-for="(item, index) in bankCard" @click="transaction(item.stype, item.state)" :key="index">
            <view class="cell-tit">
                <view>{{ item.maintitle }}</view>
            </view>
            <view class="cell-more yticon icon-you">{{ item.bindmsg }}</view>
        </view>
        <uni-popup ref="popup" type="center">
            <view class="uni-tip">
                <view class="uni-tip-title">提现说明</view>
                <text class="input">{{ msg }}</text>
                <view class="uni-tip-group-button"><view class="uni-tip-button" @click="closes">确定</view></view>
            </view>
        </uni-popup>
    </view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
export default {
    components: { uniPopup },
    data() {
        return {
            cashOut: [], //可提现 已提现 交易中
            bankCard: [],
            msg: ''
        };
    },
    onLoad() {
        this.income_load();
    },
    onBackPress(){
        this.$api.ovPage()
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    onNavigationBarButtonTap(e) {
        this.$ajax.get('income/getWithdrawMsg', {}).then(res => {
            if (res.data.code == 0) {
                this.msg = res.data.result.data.msg;
                this.$refs.popup.open();
            }
        });
    },
    methods: {
        closes() {
            this.$refs.popup.close();
        },
        income_load() {
            let data = {
                cguid: uni.getStorageSync('companyguid')
            };
            this.$ajax.get('income/getincomeinfo', data).then(res => {
                if (res.data.code == 0) {
                    this.cashOut = res.data.result.data[0].list;
                    this.bankCard = res.data.result.data[1].list;
                } else {
                    this.$api.msg('发生异常');
                    return;
                }
            });
        },
        transaction(type, state) {
            let url = '';
            switch (type) {
                case 1:
                    url = '/pages/income/withdraw'; //可提现
                    break;
                case 2: //交易中
                    url = '/pages/income/transaction';
                    break;
                case 3: //已提现
                    url = '/pages/income/cash-out';
                    break;
                case 4: //银行卡
                    if (state == 1) {
                        //已绑定
                        url = '/pages/income/bank_card_list';
                    } else {
                        url = '/pages/income/binding_bank_card';
                    }
                    break;
                case 5: //交易明细
                    url = '/pages/income/detailed';
                    break;
            }
            uni.navigateTo({
                url: url
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
}
/deep/ .uni-popup__wrapper.uni-custom.center .uni-popup__wrapper-box {
        border-radius: 20px;
        overflow: hidden;
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
        font-size: $font-base;
        color: $font-color-light;
        margin-left: 10upx;
        &.input {
            flex-grow: 1;
        }
    }
    .pice {
        color: $base-color;
        font-size: 32rpx;
    }
    .cell-tit {
        font-size: $font-base + 2upx;
        color: $font-color-dark;
        margin-right: 10upx;
        .tip {
            font-size: 24rpx;
            color: $font-color-base;
        }
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
    max-height: 60vh;
    overflow-y: auto;
}

.uni-tip-group-button {
    margin-top: 10px;
}

.uni-tip-button {
    text-align: center;
    font-size: 14px;
    color: $base-color;
}
</style>
