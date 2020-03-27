<template>
	<view class="yt-list">
        <view class="record" v-show="refundcode != ''">{{ expressName }}</view>
        <view class="record">订单编号：{{orderNumber}}</view>
		<view><uni-steps :data="date" direction="column" :active="1" @change="btnChange"></uni-steps></view>
	    <view class="address-section" v-if="date.length == 0">
			<text class="address">暂无信息</text>
	    </view>
	</view>
</template>

<script>
    import uniSteps from '@/components/uni-steps/uni-steps.vue';
	export default {
        components: { uniSteps },
		data() {
			return {
				expressName: '',
                orderNumber: '',
                date: [],
                refundcode: '',
                logisticcode: '',
                shippercode: ''
			}
		},
		onLoad(option) {
            this.refundcode = option.refundcode || '';
            this.shippercode = option.shippercode || '';
            this.logisticcode = option.logisticcode || '';
            this.orderNumber = option.ordernumber || '';
            uni.showLoading({
                title: '加载中'
            });
			this.getLogistics();
		},
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
        },
        //下拉刷新
        onPullDownRefresh() {
            uni.showLoading({
                title: '加载中'
            });
            this.getLogistics();
        },
		methods: {
			getLogistics() {
                let url = this.refundcode == '' ? 'com/ordertraces' : 'com/trackLogistic';
                let data = {
                    'refundcode': this.refundcode,
                    'shippercode': this.shippercode,
                    'logisticcode': this.logisticcode
                }
				this.$ajax.get(url, data).then(res => {
                    uni.hideLoading();
					if (res.data.code == 0) {
						let data = res.data.result.data;
                        this.expressName = this.refundcode == '' ? data.ExpressName : data.express_name;
                        this.orderNumber = this.refundcode == '' ? this.orderNumber : data.ordernumber;
                        if (this.refundcode == '') {
                            data.Traces.forEach((item, index) => {
                                let info = {};
                                info.yy = item.AcceptStation;
                                info.desc = item.AcceptTime;
                                this.date.push(info);
                            });
                        } else {
                            data.list.forEach((item, index) => {
                                let info = {};
                                info.yy = item.logisticsname;
                                info.desc = item.time;
                                this.date.push(info);
                            });
                        }
					} else {
						this.$api.msg(res.data.msg);
					}
                    uni.stopPullDownRefresh();
				});
			}
		}
	}
</script>

<style>
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

.address-section {
	padding: 20rpx 30rpx;
	text-align: center;
	font-size: 24rpx;
}
</style>
