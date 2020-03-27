<template>
	<view class="content">
        <!-- 空白页 -->
        <empty v-if="categorylist.length == 0"></empty>
		<view v-for="(category, index) in categorylist" :key="index">
			<view class="list-cell b-b" @click="jumpGoods(category.categoryid,category.categoryname)">
				<text class="cell-tit yticon icon-you">{{category.categoryname}}</text>
			</view>
		</view>
	</view>
</template>

<script>
import empty from "@/components/empty";
export default {
    components: {
    	empty
    },
	data() {
		return {
			categorylist : [],
		};
	},
    onBackPress(){
        this.$api.ovPage()
    },
	onLoad(option) {
		this.cguid = option.cguid;
		this.load();
	},
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
	methods: {
		load(){
			// 1 有商品信息  0  无商品信息
			let data = {
				cguid : this.cguid, 
				type : 0 
			};
			this.$ajax.get('comcategory/categorylist', data).then(res => {
                uni.stopPullDownRefresh();
				if(res.data.code == 0){
					this.categorylist = res.data.result.data;
				}
			});
		},
		jumpGoods(id,name){
			uni.navigateTo({
				url: '/pages/product/classifygoods?cguid='+this.cguid+'&categoryid=' + id+'&name='+name
			});
		},
        //下拉刷新
        onPullDownRefresh() {
            this.load();
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


.list-cell {
	display: flex;
	align-items: baseline;
	padding: 20upx $page-row-spacing;
	line-height: 60upx;
	position: relative;
	background: #fff;
	justify-content: center;
	&.btn{
		justify-content: flex-end;
		.btn{
			font-size: 24rpx;
			margin-left: 32rpx;
			line-height: 50rpx;
			padding: 0 26rpx;
			border:  1px solid #dddddd;
			border-radius: 40rpx;
		}
	}
	&.log-out-btn {
		margin-top: 40upx;
		.cell-tit {
			color: $uni-color-primary;
			text-align: center;
			margin-right: 0;
		}
	}
	&.cell-hover {
		background: #fafafa;
	}
	&.b-b:after {
		left: 30upx;
	}
	&.m-t {
		margin-top: 16upx;
	}
	.cell-more {
		align-self: baseline;
		font-size: $font-lg;
		color: $font-color-light;
		margin-left: 10upx;
		text-align: right;
	}
	.cell-tit {
		flex: 1;
		font-size: $font-base + 2upx;
		color: $font-color-dark;
		margin-right: 10upx;
	}
	.tximg {
		width: 100rpx;
		height: 100rpx;
		vertical-align: middle;
	}
	.cell-tip {
		font-size: $font-base;
		color: $font-color-light;
	}
	image{
		width: 36rpx;
		height: 36rpx;
	}
}



.uni-tip {
    background: #fff;
    box-sizing: border-box;
}

.uni-tip-title {
    text-align: center;
    font-weight: bold;
    font-size: 16px;
    color: #333;
}

.input {
    padding: 12rpx;
    font-size: 28rpx;
    color: #666;
    border-bottom: 1px solid #dddddd;
    display: block;
    height: auto;
}

.uni-tip-group-button {
    margin-top: 10px;
}

.uni-tip-button {
    text-align: center;
    font-size: 14px;
    color: $base-color;
}
</style>
