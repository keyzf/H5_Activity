<template>
	<view class="content">
		<view class="typelist">
			<view class="typetitle">类目</view>
			<view class="typelist" v-for="item in categorys">
				<view class="typeitem" @click="typeSelected_son(item.id,item.name)">{{item.name}}</view>
				<!-- <view class="typeitem">数码配件</view> -->
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pname : "",
				categorys : [], //系统分类列表
				typeId : "",
				typeName : "",
			};
		},
		onLoad(param) {
			this.$ajax.get('groupbuying/getGroupbuyCategory', {}).then(res => {
				if(res.data.code == 0){
					console.log(res.data.result.data)
					this.categorys = res.data.result.data
				}
			});
		},
        onBackPress(){
            this.$api.ovPage()
        },
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
        },
		methods: {
			typeSelected_son(dataId,name){
				if(dataId == undefined){
					return ;
				}
				this.$api.prePage().typeId = dataId;
				this.$api.prePage().typeName = name;
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
	}
	.content{
		border-top: 1px solid #dddddd;
		padding-top: 10rpx;
	}
    .search-box {
    	width: 100%;
    	background-color: #ffffff;
    	padding: 15rpx 30rpx;
    
    	input {
    		width: 100%;
    		font-size: 24rpx;
    		border: 0;
    		border-radius: 30rpx;
    		-webkit-appearance: none;
    		-moz-appearance: none;
    		appearance: none;
    		padding: 20rpx 3%;
    		background: rgb(249, 249, 249);
    	}
    }
	.typelist{
		font-size: 32rpx;
		.typetitle{
			padding: 15rpx 30rpx;
		}
		.typeitem{
			padding: 15rpx 30rpx;
			border-bottom: 1px solid #dddddd;
			background: #FFFFFF;
		}
	}
	.footer {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 995;
		display: flex;
		align-items: center;
		width: 100%;
		height: 90upx;
		justify-content: space-between;
		font-size: 30upx;
		background-color: #fff;
		z-index: 998;
		color: $font-color-base;
		box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);

		.submit {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 750upx;
			height: 100%;
			color: #fff;
			font-size: 32upx;
			background-color: $base-color;
		}
	}


</style>