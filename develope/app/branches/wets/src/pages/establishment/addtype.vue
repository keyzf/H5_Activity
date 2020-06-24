<template>
	<view class="content">
		<view class="search-box" @click="search">
			<input type="text" placeholder="搜索">
		</view>
      <!--  <view class="typelist">
			<view class="typetitle">最近使用的类目</view>
			<view class="typeitem">数码-数码配件-电池/test</view>
			<view class="typeitem">数码-数码配件-电池/test</view>
			<view class="typeitem">数码-数码配件-电池/test</view>
			<view class="typeitem">数码-数码配件-电池/test</view>
		</view> -->
		<view class="typelist">
			<view class="typetitle">根据商品名称推荐的类目</view>
			<view class="typelist" v-for="item in recocategorys">
				<view class="typeitem" @click="typeSelected_son(item.id,item.name)">{{item.fullname}}</view>
				<!-- <view class="typeitem">数码配件</view> -->
			</view>
		</view>
		<view class="typelist">
			<view class="typetitle">类目</view>
			<view class="typelist" v-for="item in categorys">
				<view class="typeitem" @click="typeSelected(item.id,item.name)">{{item.name}}</view>
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
				recocategorys : [],	 //推荐列表
				typeId : "",
				typeName : "",
			};
		},
		onLoad(param) {
			this.pname = param.pname;
			this.checkid = param.checkid
			let data = {
				pname : this.pname,
			}
			if(this.checkid != undefined && this.checkid != "" ){
				data.checkid = this.checkid
			}
			this.$ajax.get('com/categorylist', data).then(res => {
				if(res.data.code == 0){
					console.log(res.data.result.data)
					this.categorys = res.data.result.data[0].categorys;
					this.recocategorys = res.data.result.data[0].recocategorys;
					if(this.recocategorys.length == 0){
						this.recocategorys = [{"fullname":'无'}]
					}
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
            search(){
                uni.navigateTo({
                	url: '/pages/search/typesearch'
                });
            },
			typeSelected(dataId,name) {	
				uni.navigateTo({
					url: '/pages/establishment/addsubtype?cid=' + dataId + '&cname=' + name,
				});
			},
			typeSelected_son(dataId,name){
				if(dataId == undefined){
					return ;
				}
				this.$api.prePage().typeId = dataId;
				this.$api.prePage().typeName = name;
				this.$api.prePage().subCallback();
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