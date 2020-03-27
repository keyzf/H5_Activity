<template>
	<view class="yt-list">
		<view class="record">订单编号:{{ ordernum }}</view>
		<view><uni-steps :data="logistics" direction="column" :active="1" @change="btnChange"></uni-steps></view>
		<view class="address-section" v-show="logistics.length == 0">暂无信息</view>
	</view>
</template>

<script>
import uniSteps from '@/components/uni-steps/uni-steps.vue';
export default {
    components: { uniSteps },
	data() {
		return {
			ordernum: 0,
			loadingType: 'more',
			logistics: [],
		};
	},
	onLoad(option) {
		this.ordernum = option.ordernum;
		this.getLogistics();
	},
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    onBackPress(){
        this.$api.ovPage()
    },
	methods: {
		getLogistics() {
			this.$ajax.get('order/getlogistics', { ordernum: this.ordernum }).then(res => {
				console.log(res);
				if (res.data.code == 0) {
                    res.data.result.data.forEach((item, index) => {
                        let info = {};
                        info.yy = item.logisticsname;
                        info.desc = item.time;
                        this.logistics.push(info);
                    });
				} else {
					this.$api.msg(res.data.msg);
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
.yt-list {
	border-top: 1px solid #dddddd;
}
.record {
	padding: 10rpx 30rpx;
	font-size: 28rpx;
}
.order-content {
	padding: 20rpx 30rpx;
	background: #ffffff;
	border-bottom: 1px solid #DDDDDD;
	.top {
		font-size: 28rpx;
	}
	.address {
		font-size: 24rpx;
	}
}
.address-section {
	padding: 20rpx 30rpx;
	text-align: center;
	font-size: 24rpx;
}
</style>
