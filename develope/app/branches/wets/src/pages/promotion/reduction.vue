<template>
    <view class="content">
		<!-- 空白页 -->
		<empty v-if="saleList.length === 0"></empty>
        <view class="sales" v-for="(item, index) in saleList" :key="index" @click="addreduction(item.saleid)">
            <view class="title">
                <view class="tip">
                    <text class="bq">{{ item.userangeMsg }}</text>
                    <text>{{ item.title }}</text>
                </view>
                <view class="state" :class="{x:item.state == 1}">
                    {{ item.stateMsg }}
                </view>
            </view>
            <view class="salescon">
                {{ item.saleContent }}
            </view>
            <view class="salestime">
                <view class="time">{{ item.timerange }}</view>
                <view class="btn" @click.stop="deleteSale(index)">删除</view>
            </view>
        </view>
        <uni-load-more :status="loadingType"></uni-load-more>
        <view class="footer" @click="addreduction('')">
        	<text class="submit">添加满减</text>
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
			saleList: [],
			cguid: uni.getStorageSync('companyguid'),
			pagesize: 10,
            loadingType: 'more',
			lastid:""
		};
    },
	onLoad() {
		this.getSaleList(0);
	},
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    //下拉刷新
    onPullDownRefresh() {
		this.lastid = '';
        this.getSaleList(0);
    },
    // 加载更多
    onReachBottom() {
		if (this.loadingType === 'noMore') {
			return;
		}
		let endIndex = this.saleList.length - 1;
		this.lastid = this.saleList[endIndex].saleid;
        this.getSaleList(1);
    },
    methods: {
		// 活动列表
		getSaleList(is) {
			let lastid = '';
            this.loadingType = 'loading';
			this.$ajax.get('sale/gettypesaleactivity', {
				cguid: this.cguid,
				type: 1,
				pagesize: this.pagesize,
				lastid: this.lastid
			}).then(res => {
				console.log(res);
				if (res.data.code == 0) {
					if (is == 0) {
						this.saleList = res.data.result.data;
                        uni.stopPullDownRefresh();
					} else {
						this.saleList = this.saleList.concat(res.data.result.data);
					}
                    this.loadingType = res.data.result.data == this.pagesize ? 'more' : 'noMore';
				} else {
					this.$api.msg('活动列表获取失败');
				}
			});
		},
		// 添加活动
        addreduction(id){
            uni.navigateTo({
                url: '/pages/promotion/addreduction?id=' + id
            });
        },
		// 删除活动
		deleteSale(index) {
            let _this = this;
            uni.showModal({
                title: '提示',
                content: '确定删除此活动吗？',
                success: res => {
                    if (res.confirm) {
                        let saleid = _this.saleList[index].saleid;
                        _this.$ajax.get('sale/delsaleactivity', {cguid: _this.cguid, saleid: saleid}).then(res => {
                            if (res.data.code == 0) {
                        		_this.saleList.splice(index, 1);
                                if (_this.saleList.length == 0) _this.loadingType = 'noMore';
                        	}
                            _this.$api.msg(res.data.msg);
                        });
                    }
                }
            })
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