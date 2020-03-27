<template>
	<view>
		<view class="coupon-item" v-for="(item, index) in navList" :key="index" @click="envelopesedit(item)">
		    <view class="con">
		        <view class="left"><image src="../../static/hongs.png" mode="aspectFit"></image></view>
		        <view class="right">
		            <view class="price">{{ item.redpacketbalance }}<text>{{item.statemsg}}</text></view>
		            <view class="type">{{ item.typemsg }}</view>
		            <view class="time">{{ item.time }}</view>
		        </view>
		    </view>
		</view>
		<uni-load-more :status="loadingType"></uni-load-more>
	</view>
</template>

<script>
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
export default {
    components: {
        uniLoadMore
    },
		data() {
			return {
				navList: [],
				pagesize: 10,
				lastid: '',
                loadingType: 'more'
			}
		},

		onLoad(options) {
			this.getInvalidEnvelopesList();
		},
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
        },
        // 下拉刷新
        onPullDownRefresh() {
            this.lastid = '';
            this.getInvalidEnvelopesList();
        },
        // 加载更多
        onReachBottom() {
            if (this.loadingType == 'nomore') return;
            this.getInvalidEnvelopesList();
        },
		methods: {
			getInvalidEnvelopesList() {
				this.$ajax.get('redpacket/getnouseredpacketrulelist', {
					pagesize: this.pagesize,
					lastid: this.lastid
				}).then(res => {
					if (res.data.code == 0) {
                        if (this.lastid == '' || this.lastid == 0) {
                            this.navList = res.data.result.data;
                        } else {
                            this.navList = this.navList.concat(res.data.result.data);
                        }
						if (res.data.result.data.length != this.pagesize) {
						    this.loadingType = 'nomore';
						} else {
                            this.loadingType = 'more';
						    this.lastid = res.data.result.data[res.data.result.data.length - 1].userredpacketid;
						}
					} else {
						this.$api.msg('获取红包列表失败');
					}
                    uni.stopPullDownRefresh();
				});
			},
			envelopesedit(it) {
				uni.navigateTo({
					url: '/pages/user/envelopesedit?userredpacketid='+it.userredpacketid
				});
			}
		}
	};
</script>

<style lang="scss">
	page {
		background: $page-color-base;
	}

	.coupon-item {
		margin: 20upx 24upx;
		background: $base-color;
		overflow: hidden;
		padding: 20rpx;
		border-radius: 20rpx;
		color: #FFCC00;

		.con {
			display: flex;
			position: relative;
		}

		.left {
			image {
				width: 80rpx;
				height: 80rpx;
			}
		}

		.title {
			font-size: 32upx;
			margin-bottom: 10upx;
		}

		.time {
			font-size: 24upx;
			margin-top: 12rpx;
			text-align: right;
		}

		.right {
			font-size: 26upx;
			flex-grow: 1;
			padding: 0 30upx;
			color: #FFCC00;
		}

		.price {
			font-size: 44upx;
			margin-bottom: 30rpx;
			text{
				font-size: 36rpx;
				float: right;
			}
		}
	}
</style>
