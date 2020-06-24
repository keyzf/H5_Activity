<template>
    <view class="page-content">
        <view class="goods-list">
            <view v-for="(item, index) in goodsList" :key="index + 'y'" class="goods-item" @click="navToDetailPage(item)">
                <image v-if="item.isNewOnShelvesProduct == 1" class="label" :src="item.newOnShelvesProductIcon" mode="aspectFit"></image>
                <view class="image-wrapper">
                    <uimg :src="item.url"></uimg>
                </view>
                <view class="item-con">
                    <view class="title clamp"><text v-if="item.presell" class="presell">{{item.presell}}</text>{{ item.name }}</view>
                    <view class="price-box clamp">
                        <text class="price">{{ item.price }}</text>
                        <text v-if="item.activitylist.length == 0">{{ item.sales }}</text>
                        <view v-else>
                            <text v-for="ite in item.activitylist" :key="ite.wholetext" :style="{color:ite.color,borderColor:ite.color}">{{ ite.wholetext }}</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <uni-load-more :status="loadingType"></uni-load-more>
    </view>
</template>
<script>
import uimg from "@/components/uimg/uimg.vue";
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
export default {
    components: {
        uniLoadMore,
        uimg
    },
    data() {
        return {
            goodsList: [],
            loadingType: 'more',
            pagesize: 10,
            categoryid: '',
            cguid: '',
            lid:''
        };
    },
    onLoad(option) {
		uni.setNavigationBarTitle({
			title: option.name
		});
        this.categoryid = option.categoryid;
        this.cguid = option.cguid;
        this.load(0);
    },
    onBackPress(){
        this.$api.ovPage()
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    //下拉刷新
    onPullDownRefresh() {
        this.load(1);
    },
    //加载更多
    onReachBottom() {
        this.load(2);
    },
    methods: {
        load(is) {
            if (this.loadingType == 'nomore' && is == 2) {
                return;
            }
            this.loadingType = 'loading';
            this.$ajax
                .get('comcategory/productlist', {
                    categoryid: this.categoryid,
                    cguid: this.cguid,
                    lid: is < 2 ? '' : (this.lid = this.goodsList[this.goodsList.length - 1].productid),
                    pagesize: this.pagesize
                })
                .then(res => {
                    if (res.data.code == 0) {
                        if (is === 1) {
                            uni.stopPullDownRefresh();
                            this.lid = ''
                        }
                        if (res.data.result.data.length > 0) {
                            let data = res.data.result.data[0].item;
                            if (this.lid == '') {
                                this.goodsList = data;
                            } else {
                                this.goodsList = this.goodsList.concat(data);
                            }
                            this.loadingType = data.length != this.pagesize ? 'nomore' : 'more';
                        } else {
                            this.loadingType = 'nomore';
                        }
                    } else {
                        this.$api.msg('获取商品失败');
                    }
                });
        },
        // 跳转商品详情
        navToDetailPage(item) {
            uni.navigateTo({
                url: '/pages/product/product?productid=' + item.productid
            });
        }
    }
};
</script>
<style lang="scss">
page {
    background: $page-color-base;
}
</style>
