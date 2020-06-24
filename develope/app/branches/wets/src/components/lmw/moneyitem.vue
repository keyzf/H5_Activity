<template>

	<view class="all" @click="clickitem">
		<!-- <view class="icon" > <image :src="geticon"></image></view> -->
		<view class="content">
			<view class="reason">{{reason}}</view>

			<view class="money">
				<rich-text :nodes="flag == 1?getupPrice:getdownPrice"></rich-text>
			</view>
		</view>
		<view class="date">{{date}}</view>

	</view>

</template>

<script>
	export default {
		name: 'moneyItem',
		props: {
			icon: {
				type: Number,
				default: 0
			},
			flag: {
				type: Number,
				default: 0
			},
			reason: {
				type: String,
				default: ""
			},
			date: {
				type: String,
				default: ""
			},
			money: {
				type: String,
				default: ""
			}
		},
		computed: {
			getupPrice() {
				let b = this.money.substr(0, 1);
				let m = this.money.substr(1, this.money.length - 3);
				let e = this.money.substr(this.money.length - 2, this.money.length - 1);
				return "<div style='color:#ee3847;font-size:15px;display:inline;'>+" + b +
					"</div><div  style='color:#ee3847;font-size:20px;display:inline;'>" + m +
					"</div><div  style='color:#ee3847;font-size:12px;display:inline;'>" + e + "</div>"
			},
			getdownPrice() {
				let b = this.money.substr(0, 1);
				let m = this.money.substr(1, this.money.length - 3);
				let e = this.money.substr(this.money.length - 2, this.money.length - 1);
				return "<div style='color:#000000;font-size:15px;display:inline;'>-￥" + b +
					"</div><div  style='color:#000000;font-size:15px;display:inline;'>" + m +
					"</div><div  style='color:#000000;font-size:15px;display:inline;'>" + e + "</div>"
			},
			geticon() {
				//2-自己兑换，3-订单消费，4-订单退款，5-过期清零
				let type = this.icon;
				if (type === 1) {
					return '../../static/moneydetail/chongzhi.png';
				} else if (type === 2) {
					return '../../static/moneydetail/chongzhi.png';
				} else if (type === 3) {
					return '../../static/moneydetail/xiaofei.png';
				} else if (type === 4) {
					return '../../static/moneydetail/tuikuan.png';
				} else if (type === 5) {
					return '../../static/moneydetail/guoqi.png';
				}
			}
		},
		data() {
			return {
				// show: true,
				// showSync: false,
				// searchVal: this.initSearchVal
			}
		},
		methods: {
			clickitem() {
				this.$emit("click", {
					value: "1211"
				});
				// this.show = true;
			},
		}
	}
</script>

<style lang="scss">
	.all {

		display: flex;
		height: 120rpx;
		padding: 10rpx 20rpx;
		// align-items: center;
		flex-direction: column;
		justify-content: center;
		margin-bottom: 1px;
		background-color: #FFFFFF;


		.icon image {
			width: 50rpx;
			height: 50rpx;

		}

		.content {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			// margin: 0 20rpx;
			font-size: 28rpx;
			color: #333333;
			
			.reason {
				font-size: 28rpx;
				width: 650rpx;
				color: #333333;
				/** 对象作为伸缩盒子模型显示 **/
				display: -webkit-box;
				-webkit-line-clamp: 1;
				overflow: hidden;
				text-overflow: ellipsis;
				-webkit-box-orient: vertical;
			}

			.money {
				width: 100rpx;
				text-align: right;
				// color: #000000;
				// font-weight: bold;
			}
		}

		.date {
			font-size: 19rpx;
			color: #929292;
			margin: 10rpx 0 0 0;
			/** 对象作为伸缩盒子模型显示 **/
			display: -webkit-box;
			-webkit-line-clamp: 2;
			overflow: hidden;
			text-overflow: ellipsis;
			-webkit-box-orient: vertical;
		}





	}
</style>
