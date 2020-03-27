<template>
    <view class="content">
        <view class="goods-list">
            <view v-for="(item, index) in goodsList" :key="index" class="goods-item" @click="navToDetailPage(item.productid)">
                <image v-if="item.isNewOnShelvesProduct == 1" class="label" :src="item.newOnShelvesProductIcon" mode="aspectFit"></image>
                <view class="image-wrapper">
                    <uimg :src="item.url"></uimg>
                </view>
                <view class="item-con">
                    <view class="title clamp">
                        <text v-if="item.presell" class="presell">{{item.presell}}</text>{{ item.name }}
                    </view>
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
            cguid: '',
            pagesize: 12,
            lid: '',
            loadingType: 'more',
            goodsList: []
        };
    },
    onBackPress(){
        this.$api.ovPage()
    },
    onLoad(options) {
        this.cguid = options.cguid;
        this.loadData();
    },
    //下拉刷新
    onPullDownRefresh() {
        this.loadData('refresh');
    },
    //加载更多
    onReachBottom() {
        this.loadData();
    },
    methods: {
        //加载商品 ，带下拉刷新和上滑加载
        async loadData(type = 'add', loading) {
            //没有更多直接返回
            if (type === 'add') {
                if (this.loadingType === 'nomore') {
                    return;
                }
                this.loadingType = 'loading';
            } else {
                this.loadingType = 'more';
            }

            if (type === 'refresh') {
                this.goodsList = [];
                this.lid = '';
            }
            let data = {
                cguid: this.cguid,
                pagesize: this.pagesize,
                lid: this.lid
            };
            this.$ajax.get('homepage/listCompanyProducts', data).then(res => {
                if (res.data.code == 0) {
                    let list = res.data.result.data.productlist;
                    if (this.$wx.isWechat()) {
                        this.$wx.share({
                            title: '商城自营',
                            desc: res.data.result.data.title,
                            imgUrl: 'http://ets.51pingce.net/h5/static/logo.png'
                        }, 'http://ets.51pingce.net/#/pages/product/shopproductlist?cguid=' + this.cguid);
                    }
                    uni.setNavigationBarTitle({
                        title: res.data.result.data.title
                    });
                    //判断是否还有下一页，有是more  没有是nomore(测试数据判断大于20就没有了)
                    this.loadingType = list.length < this.pagesize ? 'nomore' : 'more';
                    if (list.length > 0) {
                        this.lid = list[list.length - 1].productid;
                        this.goodsList = this.goodsList.concat(list);
                    }
                    if (type === 'refresh') {
                        if (loading == 1) {
                            uni.hideLoading();
                        } else {
                            uni.stopPullDownRefresh();
                        }
                    }
                } else {
                }
            });
        },
        //详情
        navToDetailPage(id) {
            uni.navigateTo({
                url: '/pages/product/product?productid=' + id
            });
        }
    }
};
</script>

<style lang="scss">
page,
.content {
    background: $page-color-base;
}


</style>
