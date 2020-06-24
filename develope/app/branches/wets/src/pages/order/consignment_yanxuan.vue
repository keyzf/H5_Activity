<template>
    <view class="content">
        <view class="main" v-for="(item, index) in expres" :key="index">
            <view class="list-cell b-b" @click="openPopup(index)">
                <view class="cell-tit">快递单号</view>
                <view class="cell-more yticon icon-you">{{ item.expressnumber || '请输入快递单号' }}</view>
            </view>
            <view class="list-cell" @click="express(index)">
                <view class="cell-tit">快递公司</view>
                <view class="cell-more yticon icon-you">{{ item.expressname || '请选择' }}</view>
            </view>
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
            expressnumber: '',
            expres: [{
                expressname: '',
                expressnumber: '',
                expresscompanyid: ''
            }],
            sendExpressType: 1,
            showExpressNum: 1,
            index: 0
        };
    },
    onLoad(option) {
        this.sendExpressType = option.sendExpressType || 1;
        this.showExpressNum = option.showExpressNum || 1;
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
        openPopup(index){
            this.index = index;
            this.$refs.addclassification.open();
        },
        // 关闭窗口
        closePopup(){
            this.expres[this.index].expressnumber = this.expressnumber;
            this.$refs.addclassification.close();
        },
        // 选择物流
        express(index){
            this.index = index;
            uni.navigateTo({
                url: '/pages/shoporder/express?sendExpressType=' + this.sendExpressType
            });
        },
        // 修改物流公司
        editExpress(data) {
            this.expres[this.index].expressname = data.expressname;
            this.expres[this.index].expresscompanyid = data.id;
        },
        // 确认发货
        submit() {
            let expressInfoStr = new Array();
            let msg = -1;
            this.expres.forEach((item, index) => {
                if (item.expressnumber.length == 0) {
                    this.msg = index;
                    return;
                }
                if (item.expresscompanyid.length == 0 || item.expresscompanyid == 0) {
                    this.msg = index;
                    return;
                }
                expressInfoStr.push({
                    cid: item.expresscompanyid,
                    number: item.expressnumber
                });
            });
            if (msg > -1) {
                this.$api.msg('请填写完整第' + (msg + 1) + '个物流信息');
                return;
            }
            let data = {
                refundcode: this.refundcode,
                expressInfoStr: JSON.stringify(expressInfoStr),
                guid: uni.getStorageSync('userInfo').guid
            };
            this.$ajax.get('com/saveRefundExpressFix', data).then(res => {
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
.main{
    margin: 20rpx;
    border-radius: 18rpx;
    overflow: hidden;
    background: #FFF;
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
    margin: 0 20rpx;
    justify-content: space-between;
    align-items: center;
    display: flex;
    &.b-b{
        border-bottom: 1px solid #f1f1f1;
    }
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
