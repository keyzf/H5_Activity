<template>
	<view class="content">
		<view class="list-cell b-b">
			<text class="cell-tit">活动名称</text>
			<input class="cell-more input" type="text" placeholder="请输入活动名称" v-model="activity.title" />
		</view>
		<view class="list-cell b-b">
			<text class="cell-tit">开始时间</text>
			<picker-time :time="activity.begintime" class="cell-more input" @change="timestrart"></picker-time>
			<!-- <picker class="cell-more input" mode="multiSelector" @columnchange="bindMultiPickerColumnChange" :value="multiIndex" :range="multiArray">
				<view class="uni-input">{{ activity.begintime == '' ? '请输入开始时间' : activity.begintime }}</view>
			</picker> -->
		</view>
		<view class="list-cell b-b">
			<text class="cell-tit">结束时间</text>
			<picker-time :time="activity.endtime" class="cell-more input" @change="timeend"></picker-time>
			<!-- <picker class="cell-more input" mode="multiSelector" @columnchange="bindMultiPickerColumnChange" :value="multiEnd" :range="multiArray">
				<view class="uni-input">{{ activity.endtime == '' ? '请输入开始时间' : activity.endtime }}</view>
			</picker> -->
		</view>
		<view class="list-cell b-b" @click="activities">
			<text class="cell-tit">活动范围</text>
			<text class="cell-more input">{{ activity.saleid == '' && activity.userange == '' ? '请选择活动范围' : activity.userange == 1 ? '部分商品' : '全部商品' }}</text>
		</view>
		<view class="list-cell b-b" v-show="activity.userange == 1" @click="shopproduct(activity.saleproductids)">
			<text class="cell-tit">选择商品</text>
			<text class="cell-more input yticon icon-you">{{ activity.saleproductinfo == '' ? '选择商品' : activity.saleproductinfo }}</text>
		</view>
		<view>
			<view class="give discount">
				<view class="discountcon">
					消费满
					<input class="mg" type="number" maxlength="8" @input="num" v-model="activity.limitnum" />
					件,免一
				</view>
			</view>
		</view>
		<view class="footer"><text class="submit" @click="saveActivity">提交</text></view>
	</view>
</template>

<script>
import pickerTime from '@/components/picker-time/picker-time';
export default {
	components: {
		pickerTime
	},
	data() {
		return {
			
			title:'',
			activity: {
				saleid: '',
				title: '',
				begintime: '',
				endtime: '',
				limitnum: '',
				userange: '',
				saleproductids: '',
				saleproductinfo: ''
			},
			showState: false,
			productids: [],
		};
	},
	onLoad(option) {
		this.cguid = uni.getStorageSync('companyguid'); //店铺id
		let saleid = option.saleid;
		if (saleid != '') {
			this.title = "编辑满免";
			this.$ajax.get('sale/editsaleactivity', { cguid: this.cguid, saleid: saleid }).then(res => {
				if (res.data.code == 0) {
					this.activity = res.data.result.data;
				}
			});
		}else{
			this.title = "添加满免";
		}
		uni.setNavigationBarTitle({
			title: this.title
		});
	},
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
	methods: {
		num(e){
			this.activity.limitnum = e.detail.value.replace(".", "");
		},
		shopproduct(saleproductids) {
			let url = '/pages/search/shopproduct?productids=' + this.activity.saleproductids;
			uni.navigateTo({
				url: url
			});
		},
		activities() {
			let _this = this;
			uni.showActionSheet({
				itemList: ['全部商品', '部分商品'],
				success: function(res) {
					if (res.tapIndex == 1) {
						_this.activity.userange = 1;
						uni.navigateTo({
							url: '/pages/search/shopproductsearch?productids='
						});
					} else if (res.tapIndex == 0) {
						_this.activity.userange = 3;
						_this.activity.saleproductids = '';
					}
				}
			});
		},
		// 修改变量
		editData(data) {
			this.productids = data.productids;
			this.showState = data.showState;
			this.activity.saleproductinfo = '已选择' + data.productids.length + '件';
			this.activity.saleproductids = data.productids.join(',');
			console.log(this.activity.saleproductids);
		},
		saveActivity() {
			if (this.check()) {
				uni.showLoading({
				mask : true
				})
				this.$ajax.get('sale/setsalelimitfree', {
						cguid: this.cguid,
						saleid: this.activity.saleid,
						title: this.activity.title,
						limitnum: this.activity.limitnum,
						begintime: this.activity.begintime,
						endtime: this.activity.endtime,
						userange: this.activity.userange,
						productids: this.activity.saleproductids
					}).then(res => {
                        uni.hideLoading()
						this.$api.msg(res.data.msg);
						if(res.data.code==0){
                            this.$api.prePage().getActivity('refresh');
							uni.navigateBack();
						}else{
							
						}
					});
			}
		},
		check() {
			let msg = '';
			let mark = true;
			if (mark && this.activity.title == '') {
				msg = '请输入活动名称';
				mark = false;
			}
			if (mark && this.activity.userange == '') {
				msg = '请选择活动范围';
				mark = false;
			}
			if (mark && this.activity.userange == 1 && this.activity.saleproductids == '') {
				msg = '请选择商品';
				mark = false;
			}
			if (mark && this.activity.begintime == '') {
				msg = '请选择开始时间';
				mark = false;
			}
			if (mark && this.activity.endtime == '') {
				msg = '请选择结束时间';
				mark = false;
			}
			if (mark && this.activity.limitnum == '') {
				msg = '请输入数量';
				mark = false;
			}
			if (!mark) {
				this.$api.msg(msg);
			}
			return mark;
		},
		timeend(e) {
			console.log(e.time);
			this.activity.endtime = e.time;
		},
		timestrart(e) {
			this.activity.begintime = e.time;
			console.log(e.time);
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
	padding-bottom: 100rpx;
}
.discount {
	margin-top: 10rpx;
	background: #ffffff;
	padding: 20rpx 30rpx;
}
.discounttip {
	margin-top: 10rpx;
	font-size: 28rpx;
	padding: 20rpx 30rpx;
}
.give {
	padding: 20rpx 30rpx;
	display: flex;
	align-items: center;
	background: #ffffff;
	.delimg {
		width: 50rpx;
		height: 50rpx;
		display: inline-block;
		vertical-align: middle;
	}
	.add {
		margin-left: 24rpx;
		display: inline-block;
		vertical-align: middle;
	}
	.discountcon {
		flex-grow: 1;
		vertical-align: middle;
		display: flex;
		align-items: center;
		.mg {
			flex-grow: 1;
			border: 1px solid #dddddd;
			border-radius: 6rpx;
			margin: 0 16rpx;
			padding: 8rpx;
			height: auto;
            width: 160px;
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
</style>
