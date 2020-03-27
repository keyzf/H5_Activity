<template>
	<view class="content">
        <view class="typelist">
			<view class="typetitle">{{cname}}</view>
			<view v-for="item in subTypeList">
				<view class="typeitem" @click="typeSelected(item.id,item.name,item.isleaf)">{{item.name}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cname : "",
				subTypeList : [], //子分类列表
				
			};
		},
		onLoad(param) {
			this.cid = param.cid;
			this.subList(this.cid);
		},
        onBackPress(){
            this.$api.ovPage()
        },
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
        },
		methods: {
			typeSelected(dataId,name,isleaf) {	
				//1 是叶子节点 0 不是叶子节点
				//请求下级节点
				if(isleaf == 0){
					this.subList(dataId)
				}else{
					//this.$api.prePage()获取上一页实例，在App.vue定义
					this.$api.prePage_3().typeId = dataId;
					this.$api.prePage_3().typeName = name;
					this.$api.prePage_3().subCallback();
					uni.navigateBack({
						delta:2
					});
					console.log(dataId + name)
				}
				
			},
			subList(cid){
				let data = {
					cid : cid,
				}
				this.$ajax.get('com/subcategorylist', data).then(res => {
					if(res.data.code == 0){
						console.log(res.data.result.data)
						this.subTypeList = res.data.result.data
						if(this.subTypeList.length > 0){
							let fullnameArray = this.subTypeList[0].fullname.split("->");
							this.cname = fullnameArray.length > 2 ? fullnameArray[0] + "->" + fullnameArray[1] : fullnameArray[0]
						}
						
					}
				});
			},
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