<template>
	<view class="container">
		<view class="list-title">{{ activitytips }}</view>
		<view class="activity">
			距活动结束
			<text>{{ d }}</text>
			:
			<text>{{ h }}</text>
			:
			<text>{{ i }}</text>
			:
			<text>{{ s }}</text>
		</view>
		<!-- 空白页 -->
		<empty v-if="activityinfo.length === 0"></empty>
		<view class="cart-list">
			<block v-for="(item, index) in activityinfo" :key="index">
				<view class="shop-item">
					<view class="shop-title cart-item">
						<view>{{ item.tabname }}</view>
					</view>
					<view class="cart-item" v-for="(items, indexs) in item.productlistinfo" :key="indexs">
						<view class="image-wrapper" @click="openproduck(items)">
							<img :src="items.picurl" />
							<!-- :class="[item.loaded]" -->
						</view>
						<view class="item-right">
							<view @click="openproduck(items)">
								<view class="clamp title">{{ items.name }}</view>
								<view class="clamp attr">{{ items.attributeshow }}</view>
							</view>
							<view class="edit">
								<view class="con">
									<view class="oldprice">{{ items.oldprice }}</view>
									<view class="price">{{ items.newprice }}</view>
								</view>
								<uni-number-box
									class="step"
									:min="0"
									:max="items.number > items.stock ? items.number : items.stock"
									:value="items.number"
									:isMin="items.number === 0 || items.number == null"
									:isMax="items.number >= items.stock ? true : false"
									:index="indexs"
									:zindex="index"
									@eventChange="numberChange"
								></uni-number-box>
							</view>
							<!-- <text class="tip" v-if="items.isfull == 0 && items.isuse == 1">库存不足,请修改数量</text> -->
						</view>
					</view>
				</view>
			</block>
		</view>
		<!-- 底部菜单栏 -->
		<view class="action-section">
			<text class="tip">{{ acounttips }}</text>
			<view class="total-box">
				<view class="price">{{ welfareCount.allprice }}</view>
				<text class="coupon">{{ welfareCount.needpay }}</text>
			</view>
			<button type="primary" class="confirm-btn" :class="{ d: submitBtn }" @click="submit">提交</button>
		</view>
	</view>
</template>

<script>
import uniNumberBox from '@/components/uni-number-box.vue';
import empty from '@/components/empty';
export default {
	components: {
		uniNumberBox,
		empty
	},
	data() {
		return {
			msg:'',
			type: '', //0福利，1优惠券
			guid: '',
			welfareid: '',
			activityTitle: '',
			activitytips: '',
			acounttips: '',
			overplustime: 0,
			activityinfo: [],
			skuinfo: {},
			skuinfoStr: '',
			welfareCount: {},
			submitBtn: true,
			shopids: '',
			d: '00',
			h: '00',
			i: '00',
			s: '00',
			seconds: 0
		};
	},
	onLoad(options) {
		this.guid = uni.getStorageSync('userinfo').guid;
		this.welfareid = options.welfareid;
		if (this.welfareid != undefined && this.welfareid != null) {
			this.type = 0;
			this.getPopUpDetail();
			this.getWelfareDetail();
		}
		this.targettype = options.targettype; //优惠券
		if (this.targettype != undefined && this.targettype != null) {
			this.type = 1;
			this.usercouponid = options.usercouponid;
			this.targetids = options.targetids;
			this.listWelfareCouponProducts();
		}
	},
	onShow(){
		if (this.$wx.isWechat()) this.$wx.share();
		if (this.msg != '') {
			this.msgTip();
		}
	},
	//下拉刷新
	onPullDownRefresh() {
		if (this.type == 0) {
			this.getWelfareDetail();
		} else if (this.type == 1) {
			this.listWelfareCouponProducts();
		}
	},
	methods: {
		listWelfareCouponProducts() {
			uni.showLoading({
				title: '加载中'
			});
			this.$ajax
				.get('groupwelfare/listWelfareCouponProducts', {
					guid: this.guid,
					usercouponid: this.usercouponid,
					targettype: this.targettype,
					targetids: this.targetids
				})
				.then(res => {
					if (res.data.code == 0) {
						this.activityinfo = res.data.result.data.activityinfo;
						this.activityTitle = res.data.result.data.activitytitle;
						this.activitytips = res.data.result.data.activitytips;
						this.overplustime = res.data.result.data.overplustime / 1000;
						this.acounttips = res.data.result.data.acounttips;
						uni.setNavigationBarTitle({
							title: this.activityTitle
						});
						if (res.data.result.data.overplustime > 0) {
							this.seconds = res.data.result.data.overplustime;
							this.countDown();
							this.timer = setInterval(() => {
								this.seconds--;
								if (this.seconds < 0) {
									this.timeUp();
									return;
								}
								this.countDown();
							}, 1000);
						}
					}
					uni.hideLoading();
					uni.stopPullDownRefresh();
				});
		},
		getGroupWelfareCount(skuinfoStr) {
			this.$ajax.get('groupwelfare/getGroupWelfareCount', { guid: this.guid, usercouponid: this.usercouponid, skuinfo: skuinfoStr }).then(res => {
				if (res.data.code == 0) {
					this.skuinfoStr = skuinfoStr;
					this.welfareCount = res.data.result.data;
				} else {
					this.$api.msg(res.data.msg);
				}
			});
		},
		getPopUpDetail() {
			this.$ajax.get('welfare/getPopUpDetail', { welfareid: this.welfareid }).then(res => {
				if (res.data.code == 0) {
					console.log(res.data.result.data);
				}
			});
		},
		timeUp() {
			clearInterval(this.timer);
			this.$emit('timeup');
		},
		countDown() {
			let seconds = this.seconds;
			let [day, hour, minute, second] = [0, 0, 0, 0];
			if (seconds > 0) {
				day = Math.floor(seconds / (60 * 60 * 24));
				hour = Math.floor(seconds / (60 * 60)) - day * 24;
				minute = Math.floor(seconds / 60) - day * 24 * 60 - hour * 60;
				second = Math.floor(seconds) - day * 24 * 60 * 60 - hour * 60 * 60 - minute * 60;
			} else {
				this.timeUp();
			}
			if (day < 10) {
				day = '0' + day;
			}
			if (hour < 10) {
				hour = '0' + hour;
			}
			if (minute < 10) {
				minute = '0' + minute;
			}
			if (second < 10) {
				second = '0' + second;
			}
			this.d = day;
			this.h = hour;
			this.i = minute;
			this.s = second;
		},
		getWelfareDetail() {
			uni.showLoading({
				title: '加载中'
			});
			this.$ajax.get('welfare/getWelfareDetail', { guid: this.guid, welfareid: this.welfareid }).then(res => {
				if (res.data.code == 0) {
					this.activityinfo = res.data.result.data.activityinfo;
					this.activityTitle = res.data.result.data.activitytitle;
					this.activitytips = res.data.result.data.activitytips;
					this.overplustime = res.data.result.data.overplustime;
					this.acounttips = res.data.result.data.acounttips;
					uni.setNavigationBarTitle({
						title: this.activityTitle
					});
					if (res.data.result.data.overplustime > 0) {
						this.seconds = res.data.result.data.overplustime;
						this.countDown();
						this.timer = setInterval(() => {
							this.seconds--;
							if (this.seconds < 0) {
								this.timeUp();
								return;
							}
							this.countDown();
						}, 1000);
					}
					if (this.$api.prePage()) {
						this.$api.prePage().msg = '';
					}
				} else {
					if (this.$api.prePage()) {
						this.$api.prePage().msg = res.data.msg;
					}
					uni.navigateBack();
				}
				uni.hideLoading();
				uni.stopPullDownRefresh();
			});
		},
		navToLogin() {
			uni.navigateTo({
				url: '/pages/public/login'
			});
		},
		openproduck(it) {
			let id = it.productid;
			uni.navigateTo({
				url: '/pages/product/product?productid=' + id
			});
		},
		//数量
		numberChange(data) {
			this.activityinfo[data.zindex].productlistinfo[data.index].number = data.number;
			let key = data.zindex + ',' + data.index;
			const sku = {
				skuid: this.activityinfo[data.zindex].productlistinfo[data.index].skuid,
				picid: this.activityinfo[data.zindex].productlistinfo[data.index].picid,
				number: data.number,
				picurl: this.activityinfo[data.zindex].productlistinfo[data.index].picurl,
				name: this.activityinfo[data.zindex].productlistinfo[data.index].name
			};
			if (data.number === 0) {
				this.$delete(this.skuinfo, key);
			} else {
				this.$set(this.skuinfo, key, sku);
			}
			let skuinfoArray = [];
			let mark = false;
			for (let key in this.skuinfo) {
				mark = true;
				skuinfoArray.push(this.skuinfo[key]);
			}
			if (mark) {
				this.submitBtn = false;
			} else {
				this.submitBtn = true;
			}
			let skuinfoStr = JSON.stringify(skuinfoArray);
			if (this.type == 0) {
				//工会福利
				this.$ajax.get('welfare/getWelfareCount', { welfareid: this.welfareid, skuinfo: skuinfoStr }).then(res => {
					if (res.data.code == 0) {
						this.skuinfoStr = skuinfoStr;
						this.welfareCount = res.data.result.data;
					} else {
						this.$api.msg(res.data.msg);
					}
				});
			} else if (this.type == 1) {
				//优惠券
				this.getGroupWelfareCount(skuinfoStr);
			}
		},
		submit() {
			let url = '';
			if (this.submitBtn) {
				return;
			}
			if (this.type == 0) {
				url = '/pages/order/welfareorderdetails?welfareid=' + this.welfareid + '&skuinfo=' + this.skuinfoStr;
				uni.navigateTo({
					url: url
				});
			} else {
				let shopids;
				this.$ajax.get('groupwelfare/getGroupWelfareCheckout', { guid: this.guid, usercouponid: this.usercouponid, skuinfo: this.skuinfoStr }).then(res => {
					if (res.data.code == 0) {
						this.$ajax.get('groupwelfare/getGroupWelfareShopids', { guid: this.guid, skuinfo: this.skuinfoStr }).then(res => {
							if (res.data.code == 0) {
								this.shopids = res.data.result.data.shopids;
								url = '/pages/order/welfareorderdetails?shopids=' + this.shopids;
								uni.navigateTo({
									url: url
								});
							} else {
								this.$api.msg(res.data.msg);
								return;
							}
						});
					} else {
						this.$api.msg(res.data.msg);
						return;
					}
				});
			}
		},
		msgTip() {
			uni.showModal({
				content: this.msg,
				showCancel: false,
				success: function(res) {
					if (res.confirm) {
					} 
				}
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background: #f8f8f8;
}
.naver {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	text-align: center;
	background: #fff;
	z-index: 10;
	font-weight: 700;
	font-size: 32rpx;
	line-height: 88rpx;
	text-align: center;
	text {
		font-size: 26rpx;
		line-height: 88rpx;
		font-weight: 500;
		margin-right: 30rpx;
		position: absolute;
		right: 0;
	}
}
.container {
	background: #f8f8f8;
	border-top: 1px solid #f1f1f1;
}
.cart-list {
	margin-bottom: 100rpx;
}
/* 购物车列表项 */

.shop-item {
	margin-bottom: 16upx;
	background: #ffffff;
	border-bottom: 1px solid #f5f5f5;
	.shop-title {
		padding: 30upx 20upx 0 20upx !important;
		font-size: 28upx;
	}
}
.cart-item {
	display: flex;
	position: relative;
	padding: 16upx 20upx;
	align-items: center;
	.image-wrapper {
		width: 230upx;
		height: 230upx;
		flex-shrink: 0;
		position: relative;
		image {
			border-radius: 8upx;
		}
		img {
			width: 230upx;
			height: 230upx;
			border-radius: 8upx;
		}
	}
	.checkbox {
		z-index: 8;
		font-size: 44upx;
		line-height: 1;
		padding: 20upx;
		color: $font-color-disabled;
		background: #fff;
		border-radius: 50px;
	}
	.item-right {
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: hidden;
		position: relative;
		padding-left: 30upx;
		.title,
		.price {
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			line-height: 40upx;
		}
		.attr {
			font-size: $font-sm + 2upx;
			color: $font-color-light;
			height: 50upx;
			line-height: 50upx;
		}
		.price {
			line-height: 50upx;
			color: $base-color;
		}
		.tip {
			font-size: 24rpx;
		}
		.edit {
			display: flex;
			align-items: center;
			.con {
				flex-grow: 1;
				word-break: break-all;
				.oldprice {
					font-size: 24rpx;
					text-decoration: line-through;
					color: #969696;
				}
			}
			.step {
				min-width: 100px;
			}
		}
	}
	.del-btn {
		padding: 4upx 10upx;
		font-size: 34upx;
		height: 50upx;
		color: $font-color-light;
	}
}
/* 底部栏 */
.action-section {
	position: fixed;
	left: 0;
	bottom: 0;
	right: 0;
	z-index: 95;
	display: flex;
	align-items: center;
	padding: 0 0 0 30upx;
	background: #ffffff;
	border-top: 1rpx solid #ddd;
	.tip {
		font-size: 24rpx;
		color: $base-color;
	}
	.checkbox {
		height: 52upx;
		position: relative;
		image {
			width: 52upx;
			height: 100%;
			position: relative;
			z-index: 5;
		}
	}
	.clear-btn {
		position: absolute;
		left: 26upx;
		top: 0;
		z-index: 4;
		width: 0;
		height: 52upx;
		line-height: 52upx;
		font-size: $font-base;
		color: #fff;
		background: $font-color-disabled;
		border-radius: 0 50px 50px 0;
		opacity: 0;
		transition: 0.2s;
		display: none;
		&.show {
			display: block;
			padding-left: 38upx;
			opacity: 1;
			width: 120upx;
		}
	}
	.total-box {
		flex: 1;
		display: flex;
		flex-direction: column;
		text-align: right;
		padding-right: 40upx;
		.price {
			font-size: $font-lg;
			color: $font-color-dark;
			text {
				font-size: 24rpx;
			}
		}
		.coupon {
			font-size: $font-sm;
			color: $font-color-light;
			text {
				color: $font-color-dark;
			}
		}
	}
	.confirm-btn {
		padding: 0 38upx;
		margin: 0;
		border-radius: 0;
		height: 90upx;
		line-height: 90upx;
		font-size: $font-base + 2upx;
		background: $uni-color-primary;
		&:after {
			content: none;
		}
		&.d {
			background: none;
			color: #dddddd;
			border: none;
		}
	}
}
.activity {
	padding: 10rpx;
	line-height: 60rpx;
	width: 100%;
	text-align: center;
	background: #fff;
	border-bottom: 1px solid #f1f1f1;
	text {
		background: #303133;
		color: #fff;
		padding: 4rpx 8rpx;
		margin: 4rpx 8rpx;
		border-radius: 4rpx;
	}
}
.list-title {
	padding: 10px;
	font-size: 26rpx;
	color: #e54d42;
}
/* 复选框选中状态 */
.action-section .checkbox.checked,
.cart-item .checkbox.checked {
	color: $uni-color-primary;
}
</style>
