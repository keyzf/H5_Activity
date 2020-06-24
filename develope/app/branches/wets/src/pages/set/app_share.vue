<template>
	<view>
		<view v-for="(item, index) in memberQrcode" :key="index">
			<image :src="item.url"></image>
			<text>{{item.desc}} {{item.sharetips}}</text>
			<text>下载到本地</text>
			<text>分享</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			memberQrcode: [{
				desc: '扫一扫，下载电科商城应用',
				sharetips: '长安可将二维码图片发送至微信',
				url: ''
			}]
		}
	},
	onLoad() {
		this.$ajax.post('homepage/memberQrcode2', {}).then(res => {
			console.log(res);
			if (res.data.code == 0) {
				this.memberQrcode = res.data.result.data;
			} else {
				this.$api.msg(res.data.msg);
			}
		});
	},
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    }
}
</script>

<style>
</style>
