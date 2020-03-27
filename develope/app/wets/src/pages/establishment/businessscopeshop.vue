<template>
	<view class="content">
		<view class="scope" v-for="(category, index) in categoryArray" :key="index">
			<text
				v-for="(child, childIndex) in category.childCompanyCategory"
				:key="childIndex"
				v-bind:class="child.isSelect == true ? 'action' : ''"
				@click="select(index, childIndex)"
			>
				{{ child.categoryname }}
			</text>
		</view>
		<view class="footer" @click="submitScope"><text class="submit">提交</text></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			categoryArray: []
		};
	},
	onLoad(option) {
		let selectArray = option.managescope.split(',');
		this.$ajax.get('com/getCompanyCategoryListGroupByClass', {}).then(res => {
			if (res.data.code == 0) {
				this.categoryArray = res.data.result.data;
				this.categoryArray.forEach((item, index) => {
					item.childCompanyCategory.forEach((child, i) => {
						if (selectArray.indexOf(child.categoryname) == -1) {
							child.isSelect = false;
						} else {
							child.isSelect = true;
						}
					});
				});
				console.log(this.categoryArray);
			}
		});
	},
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    onBackPress(){
        this.$api.ovPage()
    },
	methods: {
		select(index, childIndex) {
			this.categoryArray[index].childCompanyCategory[childIndex].isSelect = !this.categoryArray[index].childCompanyCategory[childIndex].isSelect;
			this.$forceUpdate();
		},
		submitScope(){
			let nameStr = "";
			let idStr = "";
			this.categoryArray.forEach((item,index) => {
				item.childCompanyCategory.forEach((child,i) =>{
					if(child.isSelect){
						nameStr += ","+child.categoryname;
						idStr += ","+child.id;
					}
				})
			})
			this.$api.prePage().shopInfo.managescope = nameStr.substring(1);
			this.$api.prePage().shopInfo.companycategory = idStr.substring(1);
			uni.navigateBack();
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

.scope {
	overflow: hidden;
	margin-bottom: 20rpx;
	text {
		width: 160rpx;
		display: inline-block;
		float: left;
		margin: 10rpx 0 10rpx 20rpx;
		padding: 16rpx 0;
		text-align: center;
		overflow: hidden;
		background: rgb(240, 240, 240);
		border: 1px solid rgb(240, 240, 240);
		border-radius: 6rpx;
		box-sizing: border-box;
		font-size: 28rpx;
		&.action {
			background: rgb(252, 243, 245);
			border: 1px solid rgb(238, 56, 71);
		}
	}
}
</style>
