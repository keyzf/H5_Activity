<template>
	<view class="content">
		<view class="robtip">
		    {{businesshour.tips}}
		</view>
		<view class="list-cell b-b" v-for="(item, index) in businesshour.businesshours" :key="index">
			<view class="cell-tit t-cen">
				<picker class="times" mode="time" @change="bindTimeChange($event, 0, index)" :value="item.starttime">
					<view class="uni-input">{{ item.starttime }}</view>
				</picker>
				<text> -- </text>
				<picker class="times" mode="time" @change="bindTimeChange($event, 1, index)" :value="item.endtime">
					<view class="uni-input">{{ item.endtime }}</view>
				</picker>
                <image class="del" src="../../static/timedel.png" mode="" v-show="index != 0" @click="removeHour(0,index)"></image>
			</view>
		</view>
		<view class="list-cell b-b" @click="addHours(0)">
			<view class="cell-tit">
                <image src="../../static/timeadd.png" mode="aspectFit"></image>
                <text>添加营业时间</text>
            </view>
		</view>
		<view v-show="reservationHours.accept_reservation != 0">
			<view class="robtip">
			    {{reservationHours.tips}}
			</view>
			<view class="list-cell b-b m-t">
				<text class="cell-tit">设置预定时间</text>
				<switch
					style="transform:scale(0.7)"
					color="#fa436a"
					:checked="reservationHours.accept_reservation == 1"
					@change="switchClick"
				/>
			</view>
			<view v-show="reservationHours.accept_reservation == 1">
				<view class="list-cell b-b" v-for="(item, index) in reservationHours.acceptreservationhours" :key="index">
					<view class="cell-tit t-cen">
						<picker class="times" mode="time" @change="bindTimeChange($event, 3, index)" :value="item.starttime">
							<view class="uni-input">{{ item.starttime }}</view>
						</picker>
						<text> -- </text>
						<picker class="times" mode="time" @change="bindTimeChange($event, 4, index)" :value="item.endtime">
							<view class="uni-input">{{ item.endtime }}</view>
						</picker>
						<image class="del" src="../../static/timedel.png" mode="" v-show="index != 0" @click="removeHour(1,index)"></image>
					</view>
				</view>
				<view class="list-cell b-b" @click="addHours(1)">
					<view class="cell-tit">
						<image src="../../static/timeadd.png" mode="aspectFit"></image>
						<text>添加预定时间</text>
					</view>
				</view>
			</view>
		</view>
		<view class="footer"><text class="submit" @click="submit">提交</text></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			businesshour: {
				defaultEndTime: "",
				defaultStartTime: "",
				businesshours: [],
				maxRow: 0,
				tips: ""
			},
			reservationHours: {
				defaultEndTime: "",
				defaultStartTime: "",
				acceptreservationhours: [],
				maxRow: 0,
				tips: "",
				accept_reservation: 0
			}
		};
	},
	onLoad() {
		this.cguid = uni.getStorageSync('companyguid'); //店铺id
		this.$ajax.get('com/getBusinesshoursAndAcceptReservationHours', { cguid: this.cguid }).then(res => {
			console.log(res);
			if (res.data.code == 0) {
				this.businesshour = res.data.result.data.businesshour;
				this.reservationHours = res.data.result.data.reservationHours;
			} else {
				this.$api.msg(res.data.msg);
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
		bindTimeChange: function(e, type, index) {
			if (type == 0) {
				this.businesshour.businesshours[index].starttime = e.target.value;
			} else if(type == 1){
				this.businesshour.businesshours[index].endtime = e.target.value;
			}else if(type == 3){
				this.reservationHours.acceptreservationhours[index].starttime = e.target.value;
			}else if(type == 4){
				this.reservationHours.acceptreservationhours[index].endtime = e.target.value;
			}
		},
		addHours(type) {
			if(type == 0){
				let size = this.businesshour.businesshours.length;
				if (size <= this.businesshour.maxRow - 1) {
					let hour = {
						starttime: this.businesshour.defaultStartTime,
						endtime: this.businesshour.defaultEndTime
					};
					this.businesshour.businesshours.push(hour);
				} else {
					this.$api.msg('天呐，您不能再添加了！');
				}
			}else if(type == 1){
				let size = this.reservationHours.acceptreservationhours.length;
				if (size <= this.reservationHours.maxRow - 1) {
					let hour = {
						starttime: this.reservationHours.defaultStartTime,
						endtime: this.reservationHours.defaultEndTime
					};
					this.reservationHours.acceptreservationhours.push(hour);
				} else {
					this.$api.msg('天呐，您不能再添加了！');
				}
			}
		},
		removeHour(type,index) {
			if(type == 0){
				this.businesshour.businesshours.splice(index, 1);
			}else if(type == 1){
				this.reservationHours.acceptreservationhours.splice(index, 1);
			}
		},
		switchClick : function(e){
			if(e.target.value){
				this.reservationHours.accept_reservation = 1
			}else{
				this.reservationHours.accept_reservation = 2
			}
		},
		submit() {
			let hourStr = '';
			this.businesshour.businesshours.forEach((item, index) => {
				hourStr += ',' + item.starttime + '-' + item.endtime;
			});
			this.$api.prePage().shopInfo.businesshours = hourStr.substring(1);
			if(this.reservationHours.accept_reservation != 0){//接受预定
				if(this.reservationHours.accept_reservation == 1){//接受预定
					let acceptStr = '';
					this.reservationHours.acceptreservationhours.forEach((item, index) => {
						acceptStr += ',' + item.starttime + '-' + item.endtime;
					});
					this.$api.prePage().shopInfo.reservationhours = acceptStr.substring(1);
				}
				this.$api.prePage().shopInfo.acceptreservation = this.reservationHours.accept_reservation
			}
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
.robtip{
    font-size: 24rpx;
    padding: 20rpx $page-row-spacing;
    color: $base-color;
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
		align-self: baseline;
		font-size: $font-lg;
		color: $font-color-light;
		margin-left: 10upx;
		vertical-align: middle;
		&.input {
			flex-grow: 1;
		}
		image {
			display: inline-block;
			width: 30rpx;
			height: 30rpx;
			vertical-align: middle;
			margin-left: 20rpx;
		}
	}
	.cell-tit {
		flex: 1;
		font-size: $font-base + 2upx;
		color: $font-color-dark;
		margin-right: 10upx;
		min-width: 160rpx;
		vertical-align: middle;
        image{
            width: 50rpx;
            height: 50rpx;
            vertical-align: middle;
            margin-right: 10rpx;
        }
        .del{
            position: absolute;
            left: 30rpx;
            top: 50%;
            margin-top: -25rpx;
        }
		.times {
			display: inline-block;
		}
		&.t-cen {
			text-align: center;
		}
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
