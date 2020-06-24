<template>
	<view>
		<view class="card">
			<view class="card-title">自助服务</view>
			<view class="card-list">
				<template v-if="menu.length > 0">
					<view class="cate-section">
						<view class="cate-item" v-for="(item, index) in menu" :key="index" @click="tablist(item)">
							<image :src="item.url"></image>
							<view>{{ item.display }}</view>
						</view>
					</view>
				</template>
			</view>
		</view>
		<view class="card">
			<view class="card-title">帮助中心</view>
			<view class="card-list"  v-for="(item, index) in help" :key="index" @click="navto(item.url)">
				<view class="card-option">
					<view>{{ item.topic }}</view>
					<text class="yticon icon-you"></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			menu: [],
			help: []
		};
	},
	onLoad() {
		this.load();
	},
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
	methods: {
		// 初始化加载
		load() {
			this.$ajax.get('customerservice/homepage', {}).then(res => {
				if (res.data.code == 0) {
					let data = res.data.result.data;
					this.menu = data.menu;
					this.help = data.help;
				} else {
					this.$api.msg('客服信息获取失败');
				}
			});
		},
		// 自助服务
		tablist(obj) {
			if (obj.code === 'HOTLINE') {
				uni.showModal({
				    title: '客服电话',
				    content: obj.teldisplay,
				    success: function(res) {
						uni.makePhoneCall({
							phoneNumber: obj.teldisplay 
						});
				    }
				});
			} else if (obj.code === 'CUSTOMERFEEDBACK') {
				uni.navigateTo({
					url: '/pages/user/feedback'
				})
			}
		},
		// 帮助中心
		navto(url) {
			uni.navigateTo({
				url: '/pages/user/customerexit?url=' + url
			})
		}
	}
};
</script>

<style lang="scss">
page {
	background: $page-color-base;
	.cate-section {
		border-radius: 16upx 16upx 0 0;
		margin-top: 20upx;
	}
}
.card {
	margin-bottom: 20rpx;
	background: #ffffff;
	padding: 0 30rpx;
	border-top: 1px solid #e4e7ed;
	.card-title {
		font-size: 34rpx;
		font-weight: 600;
		padding: 30upx 0;
	}
	.card-option {
		border-top: 1px solid #e4e7ed;
		font-size: 28rpx;
		padding: 20upx 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
}
.cover-container {
	background: $page-color-base;
	padding: 0 30upx;
	position: relative;
	background: #f5f5f5;
	padding-bottom: 20upx;
	.arc {
		position: absolute;
		left: 0;
		top: -34upx;
		width: 100%;
		height: 36upx;
	}
}
/* 分类 */
.cate-section {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	padding: 30upx 22upx;
	background: #fff;
	.cate-item {
		width: 25%;
		flex-direction: column;
		align-items: center;
		font-size: $font-sm + 2upx;
		color: $font-color-dark;
		margin-bottom: 14upx;
		text-align: center;
	}
	/* 原图标颜色太深,不想改图了,所以加了透明度 */
	image {
		width: 88upx;
		height: 88upx;
	}
}
</style>
