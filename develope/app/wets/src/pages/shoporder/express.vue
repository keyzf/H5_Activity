<template>
    <view class="content">
        <view class="list-cell" v-for="(item, index) in expressList" :key="index" @click="expressClick(index)">
            <view class="cell-tit">{{ item.expressname }}</view>
        </view>
    </view>
</template>
<script>
export default {
    data() {
        return {
            expressList: [],
            sendExpressType: 1
        };
    },
    onLoad(option) {
        this.sendExpressType = option.sendExpressType || 1;
        this.getExpressList();
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    methods: {
        // 获取物流公司列表
        getExpressList() {
            this.$ajax.get('com/getExpressCompanyList', {sendExpressType: this.sendExpressType}).then(res => {
                console.log(res);
                if (res.data.code == 0) {
                    this.expressList = res.data.result.data;
                } else {
                    this.$api.msg('获取物流公司列表');
                }
            });
        },
        // 选择 快递公司
        expressClick(index) {
            let expressItem = this.expressList[index];
            this.$api.prePage().editExpress(expressItem);
            uni.navigateBack();
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
.list-cell {
    padding: 20upx $page-row-spacing;
    line-height: 60upx;
    background: #fff;
    border-bottom: 1px solid #dddddd;
    justify-content: space-between;
    align-items: center;
    display: flex;
    .cell-tit {
        font-size: $font-base + 2upx;
        color: $font-color-dark;
        margin-right: 10upx;
    }
}

</style>