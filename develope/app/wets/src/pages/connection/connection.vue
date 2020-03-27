<template>
	<view class="content">
		<view class="cate-section">
			<view class="cate-item" v-for="(custom,index) in customMenus" :key="index" @click="clickMenu(custom.code)" >
				<img :src="custom.url" />
				<view>{{custom.title}}</view>
			</view>
			<!-- <view class="cate-item" @click="evaluate">
				<img src="../../static/emptyCart.jpg" />
				<view>评价管理</view>
			</view> -->
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			customMenus:[]
		};
	},
	onLoad() {
		this.cguid = uni.getStorageSync('companyguid'); //店铺id
		this.$ajax.get("com/getClientModule",{cguid:this.cguid}).then(res => {
			if(res.data.code == 0){
				this.customMenus = res.data.result.data;
			}
		});
	},
    onBackPress(){
        this.$api.ovPage()
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
	methods:{
		clickMenu(code){
			let url = ""
			if(code == "FANS"){
				url = "/pages/connection/fans";
			}else if(code == "COMMENT"){
				url = "/pages/connection/evaluate";
			}
			uni.navigateTo({
				url: url
			});
		},
	}
};
</script>

<style lang="scss">
	.content {
		border-top: 1px solid #dddddd;
	}
	.cate-section {
	    display: flex;
	    align-items: center;
	    flex-wrap: wrap;
	    padding: 30upx 22upx;
	    background: #fff;
	    .cate-item {
	        width: 20%;
	        flex-direction: column;
	        align-items: center;
	        font-size: $font-sm + 2upx;
	        color: $font-color-dark;
	        margin-bottom: 14upx;
	        text-align: center;
	    }
	    img {
	        width: 88upx;
	        height: 88upx;
	    }
	}
</style>
