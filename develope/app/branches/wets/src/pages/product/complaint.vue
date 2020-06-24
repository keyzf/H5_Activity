<template>
    <view class="content">
        <view class="tip">{{ data.reasontips }}</view>
        <view class="item" v-for="(item, index) in data.reasons" :key="index" @click="goedit(index)">{{ item.reason }}</view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            data: {
                reasontips: '',
                reasons: []
            }
        }
    },
    onLoad(options) {
        uni.showLoading({
            title: '加载中...',
            mask: true
        })
        this.cguid = options.cguid;
        this.loadData();
    },
    onBackPress(){
        this.$api.ovPage()
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    methods: {
        async loadData() {
            this.$ajax.get('shophomepage/complainreason', {cguid: this.cguid}).then(res => {
                uni.hideLoading();
                if (res.data.code == 0) {
                    this.data = res.data.result.data;
                } else {
                    this.$api.msg('获取投诉类型失败');
                }
            });
        },
        goedit(index){
            let type = this.data.reasons[index].type;
            uni.navigateTo({
                url:'/pages/product/complaint-edit?cguid=' + this.cguid + '&type=' + type
            })
        },
    }
};
</script>

<style lang="scss">
.tip{
    color: #808080;
    font-size: 28rpx;
    padding: 10rpx 30rpx;
    background: $page-color-base;
    border-bottom: 1px solid #DBDBDB;
}
.item{
    padding: 20rpx 30rpx;
    border-bottom: 1px solid #DBDBDB;
}
</style>
