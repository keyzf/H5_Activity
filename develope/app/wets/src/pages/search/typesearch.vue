<template>
	<view class="content">
		<view class="search-box">
            <view class="search-left" @tap="returngo()">
                <uni-text class="yticon icon-zuo"></uni-text>
            </view>
			<!-- 原样式 如果使用原样式，恢复下方注销代码 -->
			<view class="input-box">
				<input type="text"  v-model="keyword" />
			</view>
			<view class="search-btn" @click="doSearch">搜索</view>
			<!-- 原样式 end -->
		</view>
		<view class="typelist" v-for="(value,index) in typeList">
			<view class="typeitem" @click="typeSelected(value.id,value.name)">{{value.fullname}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
				keyword: "",
				typeList: [],
				
			}
		},
		onLoad() {
		},
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
        },
		methods: {
			doSearch(){
				let data = {
					keyword : this.keyword,
					cguid : uni.getStorageSync("companyguid")
				}
				this.$ajax.get('com/categorysearch', data).then(res => {
					if(res.data.code == 0){
						console.log(res.data.result.data)
						this.typeList = res.data.result.data
					}
				});
			},
			typeSelected(dataId,name) {	
				this.$api.prePage_3().typeId = dataId;
				this.$api.prePage_3().typeName = name;
			
				uni.navigateBack({
					delta:2
				});
				console.log(dataId + name)
				
				
			},
			returngo(){
			    uni.navigateBack();
			},
		}
	}
</script>
<style lang="scss">
	view {
		display: block;
	}

	.search-box {
		width: 100%;
		background-color: rgb(242, 242, 242);
		padding: 15upx 2.5%;
		display: flex;
		justify-content: space-between;
	}

	.search-box .input-box {
		width: 85%;
		flex-shrink: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.search-box .search-btn {
		width: 15%;
		margin: 0 0 0 2%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-shrink: 0;
		font-size: 28upx;
		border-radius: 60upx;
		color: #333333;
	}

	.search-box .input-box>input {
		width: 100%;
		height: 60upx;
		font-size: 32upx;
		border: 0;
		border-radius: 60upx;
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		padding: 0 3%;
		margin: 0;
		background-color: #ffffff;
	}

	.placeholder-class {
		color: #9e9e9e;
	}

	.search-keyword {
		width: 100%;
		background-color: rgb(242, 242, 242);
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
	
</style>
