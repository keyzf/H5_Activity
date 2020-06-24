<template>
	<view class="content">
		<view class="list-cell b-b">
			<text class="cell-tit">活动名称</text>
			<input class="cell-more input" type="text" v-model="envelope.title" placeholder="请输入活动名称" />
		</view>
		<view class="list-cell b-b">
			<text class="cell-tit">开始时间</text>
			<picker-time :time="envelope.receivebegintime" class="cell-more input" @change="timestrart"></picker-time>
		</view>
		<view class="list-cell b-b">
			<text class="cell-tit">结束时间</text>
			<picker-time :time="envelope.receiveendtime" class="cell-more input" @change="timeend"></picker-time>
		</view>
		<view class="list-cell b-b" v-show="envelope.redpackettype == 1">
			<text class="cell-tit">活动范围</text>
			<city class="cell-more input yticon icon-you" :city="envelope.activityareainfo" @change="onConfirm"></city>
		</view>
		<view class="list-cell b-b m-t">
			<text class="cell-tit">红包面值</text>
			<!-- <input class="cell-more input" type="number" @input="num($event,1)" v-model="envelope.discounts" placeholder="请输入价格" /> -->
			<input class="cell-more input" type="digit" maxlength="9" v-model="envelope.discounts" placeholder="请输入价格" />
			<text>元</text>
		</view>
		<view class="list-cell b-b">
			<text class="cell-tit">满</text>
			<input class="cell-more input" type="number" maxlength="9"  @input="num($event,2)" v-model="envelope.limitmoney" placeholder="请输入价格" />
			<text>元可用</text>
		</view>
		<view class="list-cell b-b">
			<text class="cell-tit">从领取之日</text>
			<input class="cell-more input" type="number" maxlength="4"  @input="num($event,3)" v-model="envelope.usedate" placeholder="请输入天数" />
			<text>天有效</text>
		</view>
		<view class="footer"><text class="submit" @click="submit">提交</text></view>
	</view>
</template>

<script>
import pickerTime from '@/components/picker-time/picker-time';
import city from '@/components/city/city';
export default {
	components: {
		pickerTime,
		city
	},
	data() {
		return {
			
			couponid: '',
			envelope: {
				title: '',
				redpackettype: '',
				receivebegintime: '',
				receiveendtime: '',
				activityarea: '',
				discounts: '',
				limitmoney: '',
				usedate: '',
				activityareainfo: ''
			}
		};
	},
	onLoad(option) {
		this.cguid = uni.getStorageSync('companyguid'); //店铺id
		this.couponid = option.couponid;
		this.envelope.redpackettype = option.type;
		let title = option.type == 1 ? '普通红包' : '新客红包';
		uni.setNavigationBarTitle({
			title: title
		});

		this.$ajax.get('sale/editredpacket', { cguid: this.cguid, couponid: this.couponid }).then(res => {
			if (res.data.code == 0) {
				this.envelope = res.data.result.data;
			}
		});
	},
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
	methods: {
		num(e,index){
			let num = e.detail.value.replace(".", "");
			if(index == 1){
				this.envelope.discounts = num
			}else if(index == 2){
				this.envelope.limitmoney = num
			}else if(index == 3){
				this.envelope.usedate = num
			}
		},
		onConfirm(e) {
			console.log(e.adress);
			console.log(e.areaId);
			let areaid = '';
			let address = '';
			e.areaId.forEach((item, index) => {
				if (item != -1) {
					areaid = item;
				}
			});
			e.adress.split(",").forEach((item, index) => {
				if (item != '全部') {
					address += ","+item;
				}
			});
			this.envelope.activityarea = areaid;
			this.envelope.activityareainfo = address.substring(1);
		},
		submit() {
			if (this.check() ) {
				uni.showLoading({
					mask : true
				})
				this.$ajax
					.get('sale/addnormalredpacket', {
						cguid: this.cguid,
						couponid: this.couponid,
						title: this.envelope.title,
						redpackettype: this.envelope.redpackettype,
						receivebegintime: this.envelope.receivebegintime,
						receiveendtime: this.envelope.receiveendtime,
						limitmoney: this.envelope.limitmoney,
						discount: this.envelope.discounts,
						activityarea: this.envelope.activityarea,
						usedate: this.envelope.usedate
					})
					.then(res => {
                        uni.hideLoading()
						this.$api.msg(res.data.msg);
						if (res.data.code == 0) {
							uni.navigateBack();
						}else{
							
						}
					});
			}
		},
		check() {
			let msg = '';
			let mark = true;
			if (mark && this.envelope.title == '') {
				msg = '请输入活动名称';
				mark = false;
			}
			if (mark && this.envelope.receivebegintime == '') {
				msg = '请选择开始时间';
				mark = false;
			}
			if (mark && this.envelope.receiveendtime == '') {
				msg = '请选择结束时间';
				mark = false;
			}
			if (mark && this.envelope.limitmoney == '') {
				msg = '请输入金额';
				mark = false;
			}
			if (mark && this.envelope.discounts == '') {
				msg = '请输入金额';
				mark = false;
			}
			if (mark && this.envelope.redpackettype == 1 && this.envelope.activityarea === '') {
				msg = '请选择活动区域';
				mark = false;
			}
			if (mark && this.envelope.usedate == '') {
				msg = '请输入有效期';
				mark = false;
			}
			if (!mark) {
				this.$api.msg(msg);
			}
			return mark;
		},
		timestrart(e) {
			this.envelope.receivebegintime = e.time;
		},
		timeend(e) {
			this.envelope.receiveendtime = e.time;
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
.list-cell {
	display: flex;
	align-items: center;
	padding: 20upx $page-row-spacing;
	line-height: 60upx;
	position: relative;
	background: #fff;
	justify-content: center;
	font-size: $font-base + 2upx;
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
