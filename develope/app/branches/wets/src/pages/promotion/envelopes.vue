<template>
	<view class="content">
		<!-- 空白页 -->
		<empty v-if="redEnvelopes.length === 0"></empty>
		<view class="sales" v-for="(envelope, index) in redEnvelopes" :key="index">
			<view class="title" @click="addenvelopes(envelope.couponid,envelope.redpackettype)">
				<view class="tip">
					<text class="bq">{{ envelope.redpackettypemsg }}</text>
					<text>{{ envelope.title }}</text>
				</view>
				<view class="state" :class="{x:envelope.activitystate == 1}">{{ envelope.activitystatemsg }}</view>
			</view>
			<view class="salescon" @click="addenvelopes(envelope.couponid,envelope.redpackettype)">{{ envelope.saleMsg }}</view>
			<view class="salestime">
				<view class="time" @click="addenvelopes(envelope.couponid,envelope.redpackettype)">{{ envelope.daterange }}</view>
				<view class="btn" @click="delEnvelope(envelope.couponid, index)">删除</view>
			</view>
		</view>
		<uni-load-more :status="loadingType"></uni-load-more>
		<view class="footer" @click="addenvelopes('','')"><text class="submit">添加红包</text></view>
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
			loadingType: 'more',
			type: 7,
			lastid: '',
			pagesize: 10,
			redEnvelopes: []
		};
	},
	onLoad() {
		this.cguid = uni.getStorageSync('companyguid'); //店铺id
		uni.setNavigationBarTitle({
			title: '红包活动'
		});
	},
	onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
		this.getEnvelopes('refresh');
	},
	methods: {
		//下拉刷新
		onPullDownRefresh() {
			this.lastid = '';
			this.getEnvelopes('refresh');
		},
		//加载更多
		onReachBottom() {
			if (this.loadingType === 'noMore') {
				return;
			}
			this.lastid = this.redEnvelopes[this.redEnvelopes.length - 1].couponid;
			this.getEnvelopes('load');
		},
		getEnvelopes(load_type) {
			this.$ajax
				.get('sale/redpacketlist', {
					cguid: this.cguid,
					pagesize: this.pagesize,
					lastid: this.lastid,
					type: this.type
				})
				.then(res => {
					if (res.data.code == 0) {
						if (load_type == 'refresh') {
							uni.stopPullDownRefresh();
							this.redEnvelopes = res.data.result.data;
						} else if (load_type == 'load') {
							this.redEnvelopes = this.redEnvelopes.concat(res.data.result.data);
						}
						this.loadingType = res.data.result.data.length == this.pagesize ? 'more' : 'noMore';
					}
				});
		},
		addenvelopes(couponid,type) {
			if (couponid == '') {
				uni.showActionSheet({
					itemList: ['普通红包', '新客红包'],
					success: function(res) {
						if (res.tapIndex == 0) {
							//普通红包
							type = 1;
						} else {
							//新客红包
							type = 2;
						}
						uni.navigateTo({
							url: '/pages/promotion/addenvelopes?couponid=' + couponid + '&type=' + type
						});
					}
				});
			}else{
				uni.navigateTo({
					url: '/pages/promotion/addenvelopes?couponid=' + couponid + '&type=' + type
				});
			}
		},
		delEnvelope(couponid,index){
			let _this = this;
			uni.showModal({
			    title: '',
			    content: '确定删除此红包活动吗？',
			    success: function (res) {
			        if (res.confirm) {
			            _this.$ajax.get("sale/delredpacket",{cguid:_this.cguid,couponid:couponid}).then(res => {
							_this.$api.msg(res.data.msg);
							if(res.data.code == 0){
								_this.redEnvelopes.splice(index, 1);
                                if (_this.redEnvelopes.length == 0) _this.loadingType = 'noMore';
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
