<template>
    <view class="content">
		<!-- 空白页 -->
		<empty v-if="list.length === 0"></empty>
        <view class="commodity" v-for="(item, index) in list" :key="index">
            <view class="commodity-con">
                <view class="title">
                    <text>{{ item.operate }}</text>
                    <text class="stata">{{ item.honorpoint }}</text>
                </view>
                <view class="tip">{{ item.createtime }}</view>
            </view>
        </view>
        <uni-load-more :status="loadingType"></uni-load-more>
    </view>
</template>

<script>
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import empty from '@/components/empty';
export default {
    components: {
        uniLoadMore,
		empty
    },
    data() {
        return {
            cguid: '',
            list: [],
            lastid: '',
            pagesize: 10
        };
    },
    onLoad() {
        this.cguid = uni.getStorageSync('companyguid');
        this.datalist();
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    //加载更多
    onReachBottom() {
        if (this.loadingType === 'noMore') {
            return;
        }
        this.datalist();
    },
    //下拉刷新
    onPullDownRefresh() {
        this.datalist('refresh');
    },
    methods: {
        datalist(type) {
            if (type == 'refresh') {
                this.lastid = '';
                this.list = [];
            }
            if (this.loadingType === 'noMore' && this.loadingType === 'loading') {
                return;
            }
            this.loadingType = 'loading';
            this.$ajax.get('buylimit/honorpointdetail', { cguid: this.cguid, lastid: this.lastid, pagesize: this.pagesize }).then(res => {
                if (res.data.code == 0) {
                    let list = res.data.result.data;
                    this.list = this.list.concat(list);
                    if(list.length > 0){
                        this.lastid = list[list.length - 1].id;
                        this.loadingType = list.length == this.pagesize ? 'more' : 'noMore';
                    }else{
                        this.loadingType = list.length == this.pagesize ? 'more' : 'noMore';
                    }
                    
                }
                if (type == 'refresh') {
                    uni.stopPullDownRefresh();
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
    border-top:1px solid #DDDDDD ;
}



.commodity {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #ffffff;
    padding: 20rpx 30rpx;
    border-bottom: 1px solid #dddddd;
    .commodity-con {
        flex-grow: 1;
        padding: 20rpx;
        .title {
            font-size: 30rpx;
            margin-bottom: 10rpx;
            display: flex;
            justify-content: space-between;
            .stata {
                margin-left: 20rpx;
                color: $base-color;
            }
        }
        .tip {
            font-size: 24rpx;
            color: $font-color-base;
        }
    }
}
</style>
