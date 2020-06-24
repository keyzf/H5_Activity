<template>
    <view class="page-content">
        <view class="goods-list">
            <view class="goods-item" @click="navToDetailPage(item)" v-for="(item, index) in goodsList" :key="index">
                <view class="image-wrapper">
                    <uimg :src="item.url"></uimg>
                </view>
                <view class="item-con">
                    <text class="title clamp">{{ item.name }}</text>
                    <view class="price-box clamp">
                        <text class="price">{{ item.price }}</text>
                        <text v-if="item.activitylist.length == 0">{{ item.sales }}</text>
                        <view v-else>
                            <text v-for="ite in item.activitylist" :key="ite.wholetext" :style="{color:ite.color,borderColor:ite.color}">{{ ite.wholetext }}</text>
                        </view>
                    </view>
                    <view class="clamp">
                        <view class="typename">
                            <block v-if="item.selficon.url"><image :src="item.selficon.url" mode="aspectFit"></image></block>
                            <block v-else><text>{{ item.typename }}</text></block>
                        </view>
                        <text class="companyname" @click.stop="goshop(item)">{{ item.companyname }}</text>
                    </view>
                </view>
            </view>
        </view>
        <empty v-if="goodsList.length === 0"></empty>
        <uni-load-more v-if="goodsList.length !== 0" :status="loadingType"></uni-load-more>
    </view>
</template>
<script>
import uimg from "@/components/uimg/uimg.vue";
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import empty from "@/components/empty";
export default {
    components: {
        uniLoadMore,
        empty,
        uimg
    },
    data() {
        return {
            goodsList: [],
            loadingType: 'more',
            pagesize: 10
        };
    },
    //下拉刷新
    onPullDownRefresh() {
        this.load(1);
    },
    //加载更多
    onReachBottom() {
		if(this.loadingType == "nomore"){
			return;
		}
        this.load(2);
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
        this.load(1);
    },
    methods: {
        load(is) {
            uni.showLoading({
                title: '加载中',
                mask: true
            });
            this.loadingType = 'loading';
            this.$ajax
                .get('homepage/attentionproductlist', {
                    lid: is < 2 ? '' : (this.lid = this.goodsList[this.goodsList.length - 1].id),
                    pagesize: this.pagesize
                })
                .then(res => {
                    if (res.data.code == 0) {
                        if (res.data.result.data.length != 0) {
                            let data = res.data.result.data[0].item;
                            if (is == 1) {
                                this.goodsList = data;
                            } else if(is == 2){
                                this.goodsList = this.goodsList.concat(data);
                            }
                            this.loadingType = data.length == this.pagesize ? 'more' : 'nomore';
                        } else {
                            this.loadingType = 'nomore';
                        }
						uni.stopPullDownRefresh();
						uni.hideLoading();
                    } else {
						uni.hideLoading();
						uni.stopPullDownRefresh();
                        this.$api.msg('获取商品失败');
                    }
                });
        },
        // 跳转商品详情
        navToDetailPage(item) {
            uni.navigateTo({
                url: '/pages/product/product?productid=' + item.productid
            });
        },
        goshop(it){
            if(it.isself ==0){
                uni.navigateTo({
                    url: '/pages/product/shop?cguid=' + it.cguid
                });
            }else if(it.isself == 1){
                uni.navigateTo({
                    url: '/pages/product/shopproductlist?cguid=' + it.cguid
                });
            }
        },
    }
};
</script>
<style lang="scss">
page {
    background: $page-color-base;
}

</style>
