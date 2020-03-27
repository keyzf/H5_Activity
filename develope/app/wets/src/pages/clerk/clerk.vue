<template>
	<view class="content">
		<view class="list-cell b-b">
			<text class="cell-tit">店长是否接收聊天</text>
			<view class="cell-more input t-r"><switch :checked="iskeepergetmessage == 1" @change="switchChange" /></view>
		</view>
		<view class="list-cell b-b m-t" v-for="(clerk, index) in clerkArray" :key="index" @click="jurisdiction(clerk.clerkid)" @longpress="delclerk(clerk.clerkid,index)">
			<view class="cell-tit yticon icon-you">
				<view>{{ clerk.nickname }}</view>
				<view class="tip">{{ clerk.authstring }}</view>
			</view>
		</view>
		<!-- <view class="list-cell b-b">
			<view class="cell-tit yticon icon-you">
				<view>李四</view>
				<view class="tip">权限....权限....权限....权限....权限....权限....权限....权限....权限....权限....权限....权限....权限....权限....权限....权限....权限....权限....</view>
			</view>
		</view> -->
		<view class="footer" @click="jurisdiction('')"><text class="submit">添加店员</text></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			iskeepergetmessage: '',
			clerkArray: []
		};
	},
    onBackPress(){
        this.$api.ovPage()
    },
	onLoad() {
		this.cguid = uni.getStorageSync('companyguid'); //店铺id
		this.$ajax.get('clerk/getShopkeeperMessageSetting', { cguid: this.cguid }).then(res => {
			if (res.data.code == 0) {
				this.iskeepergetmessage = res.data.result.data.iskeepergetmessage;
			}
		});
	},
	onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
		this.$ajax.get('clerk/clerklist', { cguid: this.cguid }).then(res => {
			if (res.data.code == 0) {
				this.clerkArray = res.data.result.data;
			}
		});
	},
	methods: {
		switchChange: function(e) {
			if (e.target.value) {
				this.iskeepergetmessage = 1;
			} else {
				this.iskeepergetmessage = 0;
			}
			this.$ajax.get('clerk/setShopkeeperMessageSetting', { cguid: this.cguid, iskeepergetmessage: this.iskeepergetmessage }).then(res => {
				this.$api.msg(res.data.msg);
				if (res.data.code == 0) {
				} else {
                    this.iskeepergetmessage = !this.iskeepergetmessage;
                }
			});
		},
		delclerk(clerkid,index){
			let _this = this;
			uni.showModal({
			    title: '',
			    content: '确定要删除该店员吗？',
			    success: function (res) {
			        if (res.confirm) {
			            _this.$ajax.get("clerk/delclerk",{cguid:_this.cguid,clerkid:clerkid}).then(res => {
							_this.$api.msg(res.data.msg);
							if(res.data.code == 0){
								_this.clerkArray.splice(index, 1);
							}
						});
			        } 
			    }
			});
		},
		jurisdiction(clerkid) {
			uni.navigateTo({
				url: '/pages/clerk/jurisdiction?clerkid=' + clerkid
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
.t-r {
	text-align: right;
	switch {
		transform: scale(0.7);
	}
}
.list-cell {
	display: flex;
	align-items: center;
	padding: 20upx $page-row-spacing;
	line-height: 60upx;
	position: relative;
	background: #fff;
	justify-content: center;
	&.b-b:after {
		left: 30upx;
	}
	&.m-t {
		margin-top: 16upx;
	}
	.cell-more {
		align-self: center;
		font-size: $font-lg;
		color: $font-color-light;
		margin-left: 10upx;
	}
	.cell-tit {
		font-size: $font-base + 2upx;
		color: $font-color-dark;
		margin-right: 10upx;
		flex-grow: 1;
		.tip {
			font-size: 24rpx;
			color: $font-color-light;
		}
	}
}
</style>
