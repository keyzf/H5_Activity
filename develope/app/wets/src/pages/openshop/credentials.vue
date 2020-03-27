<template>
	<view class="content">
		<view class="list-cell b-b">
			<text class="cell-tit">真实姓名</text>
			<input class="cell-more input" type="text" placeholder="请输入" />
		</view>
		<view class="list-cell b-b">
			<text class="cell-tit">证件类型</text>
			<text class="cell-more input">身份证</text>
		</view>
		<view class="list-cell b-b">
			<text class="cell-tit">证件号</text>
			<input class="cell-more input" type="text" placeholder="请输入" />
		</view>
		<view class="idcard">
			<view class="item">
				<image class="img" src="../../static/shopbg.png"></image>
				<view class="title">上传身份证正面</view>
			</view>
			<view class="item">
				<image class="img" src="../../static/shopbg.png"></image>
				<view class="title">上传身份证正面</view>
			</view>
			<view class="item">
				<image class="img" src="../../static/shopbg.png"></image>
				<view class="title">上传身份证正面</view>
			</view>
		</view>
		<view class="footer"><text class="submit ash">以后再说</text><text class="submit" @click="cipher">下一步</text></view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    onBackPress(){
        this.$api.ovPage()
    },
	methods: {
		cipher() {
			uni.navigateTo({
				url:'/pages/openshop/cipher'
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
.idcard{
	padding: 20rpx 30rpx 4rpx 30rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: #FFFFFF;
	flex-wrap: wrap;
	.item{
		width: 330rpx;
		text-align: center;
		margin-bottom: 16rpx;
		.img{
			width: 330rpx;
			height: 220rpx;
		}
		.title{
			font-size: 28rpx;
		}
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
		&.input {
			flex-grow: 1;
		}
	}
	.cell-tit {
		font-size: $font-base + 2upx;
		color: $font-color-dark;
		margin-right: 10upx;
		min-width: 160rpx;
	}
	.cell-tip {
		font-size: $font-base;
		color: $font-color-light;
	}
}
</style>
