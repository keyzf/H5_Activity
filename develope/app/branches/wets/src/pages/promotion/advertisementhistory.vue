<template>
	<view class="content">
		<!-- 空白页 -->
		<empty v-if="messages.length === 0"></empty>
		<view v-for="(message,index) in messages" :key="index">
			<view class="adtip">{{message.day}}</view>
			<view class="adend">
				<view>{{message.content}}</view>
				<view>{{message.time}}</view>
			</view>
		</view>
		<!-- <view class="adend">
			<view>内容</view>
			<view>09:20</view>
		</view>
		<view class="adtip">2019-10-10</view>
		<view class="adend">
			<view>内容</view>
			<view>09:20</view>
		</view> -->
		<uni-load-more :status="loadingType"></uni-load-more>
	</view>
</template>

<script>
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import empty from '@/components/empty';
export default {
	components: { uniLoadMore,empty },
	data() {
		return {
			loadingType: 'more',
			pagesize: 10,
			lid: '',
			messages: []
		};
	},
	onLoad() {
		this.cguid = uni.getStorageSync('companyguid'); //店铺id
        this.getMessages('refresh');
	},
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    //下拉刷新
    onPullDownRefresh() {
    	this.lid = '';
    	this.getMessages('refresh');
    },
    //加载更多
    onReachBottom() {
    	if (this.loadingType === 'noMore') {
    		return;
    	}
    	this.lid = this.messages[this.messages.length - 1].id;
    	this.getMessages('load');
    },
	methods: {
		getMessages(load_type) {
			this.$ajax.get('sale/getCompanyPushMessages', {
					cguid: this.cguid,
					pagesize: this.pagesize,
					lid: this.lid
				}).then(res => {
					if (res.data.code == 0) {
						if (load_type == 'refresh') {
							uni.stopPullDownRefresh();
							this.messages = res.data.result.data;
						} else if (load_type == 'load') {
							this.messages = this.messages.concat(res.data.result.data);
						}
						this.loadingType = res.data.result.data.length == this.pagesize ? 'more' : 'noMore';
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
}
.adtip {
	padding: 10rpx 30rpx;
	font-size: 24rpx;
}
.adend {
	background: #ffffff;
	padding: 20rpx 30rpx;
	font-size: 28rpx;
	border-bottom: 1px solid #dddddd;
}
</style>
