<template>
    <view>
        <view v-for="(item, index) in list" :key="index">
            <view class="cate-con" :style="'color:' + item.color">
                <text :style="'border-color:' + item.color">{{ item.name }}</text>
            </view>
            <view class="cate-section">
                <view class="cate-item" v-for="(ite, indexy) in item.inlets" :key="indexy" @click="tablist(ite)">
                    <uimg :src="ite.url" mode="aspectFit"></uimg>
                    <view>{{ ite.display }}</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import uimg from '@/components/uimg/uimg.vue';
export default {
    components: {
        uimg
    },
    data() {
        return {
            list: []
        };
    },
    onBackPress(){
        this.$api.ovPage()
    },
    onLoad() {
        uni.showLoading({
            title: '加载中'
        });
        this.load();
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    methods: {
        load() {
            this.$ajax.get('homepage/moreinlet_type', {}).then(res => {
                if (res.data.code == 0) {
                    this.list = res.data.result.data;
                }
                uni.hideLoading();
            });
        },
        tablist(item) {
            if (item.code == 'PROMOTION') {
                uni.navigateTo({
                    url: '/pages/product/catelist?id=' + item.activityid
                });
            } else if (item.code == 'MORE') {
                uni.navigateTo({
                    url: '/pages/product/catemore'
                });
            } else if (item.code == 'BUYLIMIT') {
                uni.navigateTo({
                    url: '/pages/product/rushbuy'
                });
            } else if (item.code == 'NEWPRODUCT') {
               if (item.activityid == '' || item.activityid == null) {
                   return false;
               }
               uni.navigateTo({
                   url: '/pages/product/fashionable?id=' + item.activityid
               });
            } else if (item.code == 'POSTER') {
               uni.navigateTo({
                   url: '/pages/product/poster?id=' + item.activityid
               });
            } else if (item.jumptype == 1) {
                uni.navigateTo({
                    url: '/pages/product/product?productid=' + item.productid
                });
            } else {
                this.$api.msg('功能开发中');
            }
        }
    }
};
</script>

<style lang="scss">
page {
    background: $page-color-base;
}
/* 分类 */
.cate-con {
    padding: 30upx 22upx 0 22upx;
    font-size: 32upx;
    text {
        border-left: 4rpx solid;
        padding-left: 10rpx;
    }
}
.cate-section {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 10upx 22upx 30upx 22upx;
    .cate-item {
        width: 20%;
        flex-direction: column;
        align-items: center;
        font-size: $font-sm + 2upx;
        color: $font-color-dark;
        margin-bottom: 14upx;
        text-align: center;
        view {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
    }
    /* 原图标颜色太深,不想改图了,所以加了透明度 */
    /deep/ image {
        width: 88upx;
        height: 88upx;
    }
}
</style>
