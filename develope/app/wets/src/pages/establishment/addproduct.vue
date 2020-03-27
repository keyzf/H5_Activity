<template>
	<view class="content">
		<view class="list-cell b-b">
			<text class="cell-tit">商品名称</text>
			<input class="cell-more" type="text" v-model="name" maxlength="16" placeholder="请输入商品名称" />
		</view>
		<view class="list-cell b-b">
			<text class="cell-tit">副标题</text>
			<input class="cell-more" type="text" v-model="subheading" maxlength="16" placeholder="补充商品名称简单介绍商品" />
		</view>
		<view class="list-cell b-b">
			<text class="cell-tit">关键字</text>
			<input class="cell-more" type="text" v-model="keyword" maxlength="16" placeholder="添加关键词方便用户搜索(以逗号分隔)" />
		</view>
		<view class="footer"><text class="submit" @click="addShopProductStep1">下一步</text></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			name:"",
			subheading: "",
			keyword: ""
			
		};
	},

	onLoad() {},
    onBackPress(){
        this.$api.ovPage()
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
	methods: {
		//下一步
		addimg() {
			uni.navigateTo({
				url: '/pages/establishment/addproductimg?pid=' + this.pid + '&name=' + this.name
			});
		},
		check() {
			
			
		},
		addShopProductStep1() {
			//校验
            if(this.name == "" || this.subheading == "" || this.keyword == ""){
                this.$api.msg("请填写完整商品信息")
                return;
            }
			
			let data = {
				name: this.name,
				subheading: this.subheading,
				keyword:this.keyword,
				cguid :uni.getStorageSync("companyguid"),
			}
			this.$ajax.get('shopproduct/addShopProductStep1', data).then(res => {
				if(res.data.code == 0){
					console.log(res.data.result)
					this.pid = res.data.result.data.pid
					this.addimg(); 
				}
			});
		},
		
	}
};
</script>

<style lang="scss">
page {
	background: $page-color-base;
}
.content {
	border-top: 1px solid #dddddd;
	padding-top: 10rpx;
}
.list-cell {
	display: flex;
	align-items: baseline;
	padding: 20upx $page-row-spacing;
	line-height: 60upx;
	position: relative;
	background: #fff;
	justify-content: center;
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
		flex: 1;
	}
	.cell-tit {
		font-size: $font-base + 2upx;
		color: $font-color-dark;
		margin-right: 10upx;
		width: 120rpx;
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
	switch {
		transform: translateX(16upx) scale(0.84);
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

.uni-swiper-item {
	height: auto;
}

/* load-more */
.uni-load-more {
	display: flex;
	flex-direction: row;
	height: 80upx;
	align-items: center;
	justify-content: center;
}

.uni-load-more__text {
	font-size: 28upx;
	color: #999;
}

.uni-load-more__img {
	height: 24px;
	width: 24px;
	margin-right: 10px;
}

.uni-load-more__img > view {
	position: absolute;
}

.uni-load-more__img > view view {
	width: 6px;
	height: 2px;
	border-top-left-radius: 1px;
	border-bottom-left-radius: 1px;
	background: #999;
	position: absolute;
	opacity: 0.2;
	transform-origin: 50%;
	animation: load 1.56s ease infinite;
}

.uni-load-more__img > view view:nth-child(1) {
	transform: rotate(90deg);
	top: 2px;
	left: 9px;
}

.uni-load-more__img > view view:nth-child(2) {
	transform: rotate(180deg);
	top: 11px;
	right: 0;
}

.uni-load-more__img > view view:nth-child(3) {
	transform: rotate(270deg);
	bottom: 2px;
	left: 9px;
}

.uni-load-more__img > view view:nth-child(4) {
	top: 11px;
	left: 0;
}
</style>
