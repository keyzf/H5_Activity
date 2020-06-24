<template>
    <view class="content">
		<!-- 空白页 -->
		<empty v-if="discountList.length === 0"></empty>
        <view class="sales" v-for="(discount, index) in discountList" :key="index" @click="edit(discount.saleid)">
            <view class="title">
                <view class="tip">
                    <text class="bq">{{discount.userangeMsg}}</text>
                    <text>{{discount.title}}</text>
                </view>
                <view class="state" :class="{x:discount.state == 1}">
                    {{discount.stateMsg}}
                </view>
            </view>
            <view class="salescon">
                {{discount.saleContent}}
            </view>
            <view class="salestime">
                <view class="time">{{discount.timerange}}</view>
                <view class="btn" @click.stop="del(index)">删除</view>
            </view>
        </view>
        <uni-load-more :status="loadingType"></uni-load-more>
        <view class="footer" @click="adddiscount">
            <text class="submit">添加折扣</text>
        </view>
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
            cguid: 0,
            discountList: [],
            pagesize: 10,
            loadingType: 'more',
			lastid:''
        };
    },
    onLoad() {
        this.cguid = uni.getStorageSync("companyguid");
        this.list(0);
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
	//下拉刷新
	onPullDownRefresh() {
		this.lastid = '';
		this.list(0);
	},
	onReachBottom() {
		if(this.loadingType == "noMore"){
			return;
		}
		// 获取优惠券列表
		let length = this.discountList.length;
		this.lastid = length > 0 ? this.discountList[length - 1].id : 0;
		this.list(1);
	},
    methods: {
        list(load_type) {
            this.$ajax.get('sale/gettypesaleactivity', {cguid: this.cguid, pagesize: this.pagesize, type: 2, lastid: this.lastid}).then(res => {
                console.log(res.data);
                if (res.data.code == 0) {
                    let data = res.data.result.data;
                    if (load_type == 0) {
                        this.discountList = data;
						uni.stopPullDownRefresh();
                    } else if(load_type == 1){
                        this.discountList = this.discountList.concat(data);
                    }
                    this.loadingType = data.length == this.pagesize ? 'more' : 'noMore'
                } else {
					uni.stopPullDownRefresh();
                    this.$api.msg('系统出错,请稍后再试');
                }
            });
        },
        adddiscount(){
            uni.navigateTo({
                url: '/pages/promotion/adddiscount'
            });
        },
        edit(id) {
            uni.navigateTo({
                url: '/pages/promotion/adddiscount?saleId=' + id
            });
        },
        del(index) {
            let _this = this;
            uni.showModal({
                title: '提示',
                content: '确定删除此活动吗？',
                success: function (res) {
                    if (res.confirm) {
                        _this.$ajax.get('sale/delsaleactivity', {cguid: _this.cguid, saleid: _this.discountList[index].saleid}).then(res => {
                            uni.hideLoading();
                            console.log(res);
                            if (res.data.code == 0) {
                                _this.discountList.splice(index, 1);
                                _this.$api.msg(`删除成功`);
                            } else {
                                _this.$api.msg(res.data.code + ":" + res.data.msg);
                            }
                        });
                    }
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
    border-top: 1px solid #dddddd;
    padding-bottom: 100rpx;
}

</style>