<template>
	<view class="content">
		<view class="list-cell b-b">
			<view class="cell-tit">手机号</view>
			<input class="cell-more input" type="number" placeholder="请输入手机号" maxlength="20" v-model="clerkInfo.tel" />
		</view>
		<view class="list-cell b-b">
			<view class="cell-tit">昵称</view>
			<input class="cell-more input" type="text" placeholder="请输入昵称" maxlength="10" v-model="clerkInfo.nickname" />
		</view>
		<view class="list">
			<view class="item b-b" @click="all">
				<label>
					<text>权限管理</text>
					<view>
						全选
						<checkbox :checked="selectAll" />
					</view>
				</label>
			</view>
			<block v-for="(authitem, index) in clerkInfo.authitemlist" :key="index">
				<view class="item b-b" @click="checks(authitem.id, '')">
					<label>
						<text>{{ authitem.title }}</text>
						<view><checkbox :value="authitem.id + ''" :checked="authitem.ischeck == 1" /></view>
					</label>
				</view>
				<view class="item b-b b-2" v-for="(subItem, i) in authitem.subauthitems" :key="i" @click="checks(authitem.id, subItem.id)">
					<label>
						<text>{{ subItem.title }}</text>
						<view><checkbox :value="subItem.id + ''" :checked="subItem.ischeck == 1" /></view>
					</label>
				</view>
			</block>
		</view>
		<view class="footer"><text class="submit" @click="submit">提交</text></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			selectAll: false,
			clerkid: '',
			clerkInfo: {
				nickname: '',
				tel: '',
				authitemlist: []
			}
		};
	},
	onLoad(option) {
		this.cguid = uni.getStorageSync('companyguid'); //店铺id
		this.clerkid = option.clerkid;
		this.$ajax.get('clerk/editclerk', { cguid: this.cguid, clerkid: this.clerkid }).then(res => {
			if (res.data.code == 0) {
				res.data.result.data.authitemlist.forEach(item => {
					if (item.ischeck == false) {
						this.selectAll = false;
					}
				});
				this.clerkInfo = res.data.result.data;
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
		submit() {
			let auth = [];
			this.clerkInfo.authitemlist.forEach(item => {
				if (item.ischeck == 1) {
					auth.push(item.id);
				}
				if (item.subauthitems.length > 0) {
					item.subauthitems.forEach(items => {
						if (items.ischeck == 1) {
							auth.push(items.id);
						}
					});
				}
			});
			if (auth.length == 0) {
				this.$api.msg('请选择权限');
				return;
			}
			if (this.clerkInfo.tel == '') {
				this.$api.msg('请输入手机号码');
				return;
			}
			if (this.clerkInfo.nickname == '') {
				this.$api.msg('请输入用户名');
				return;
			}
			this.$ajax
				.get('clerk/saveclerk', {
					cguid: this.cguid,
					tel: this.clerkInfo.tel,
					clerkid: this.clerkid,
					nickname: this.clerkInfo.nickname,
					auth: auth.toString()
				})
				.then(res => {
					if (res.data.code == 0) {
						uni.navigateBack();
					} else {
						this.$api.msg(res.data.msg);
					}
				});
		},
		all() {
			if (this.selectAll) {
				this.clerkInfo.authitemlist.forEach(item => {
					item.ischeck = 0;
					if (item.subauthitems.length > 0) {
						item.subauthitems.forEach(items => {
							items.ischeck = 0;
						});
					}
				});
				this.selectAll = false;
			} else {
				this.clerkInfo.authitemlist.forEach(item => {
					item.ischeck = 1;
					if (item.subauthitems.length > 0) {
						item.subauthitems.forEach(items => {
							items.ischeck = 1;
						});
					}
				});
				this.selectAll = true;
			}
		},
		checks(pid, id) {
			let kg = true;
			this.clerkInfo.authitemlist.forEach(item => {
				if (pid == item.id && id == '') {
					item.ischeck = item.ischeck == 0 ? 1 : 0;
					if (item.subauthitems.length > 0 && item.ischeck == 1) {
						item.subauthitems.forEach(items => {
							items.ischeck = 1;
						});
					} else {
						item.subauthitems.forEach(items => {
							items.ischeck = 0;
						});
					}
				} else {
					if (pid == item.id) {
						let all = false;
						item.subauthitems.forEach(items => {
							if (id == items.id) {
								items.ischeck = items.ischeck == 0 ? 1 : 0;
							}
							if (items.ischeck == 1) {
								all = true;
							}
						});
						if (all) {
							item.ischeck = 1;
						} else {
							item.ischeck = 0;
						}
					}
				}
				if (item.ischeck == 0) {
					kg = false;
				}
				item.subauthitems.forEach(items => {
					if (items.ischeck == 0) {
						kg = false;
					}
				});
			});
			this.selectAll = kg;
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
.list {
	margin-top: 10rpx;
	.item {
		padding: 10rpx 30rpx;
		background: #ffffff;
		position: relative;
		&.b-2 {
			padding-left: 60rpx;
			&:after {
				left: 30rpx;
			}
		}
		label {
			display: flex;
			justify-content: space-between;
			checkbox {
				transform: scale(0.7);
			}
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
		min-width: 120rpx;
	}
	.cell-tip {
		font-size: $font-base;
		color: $font-color-light;
	}
	.btn {
		color: #0081ff;
	}
}
</style>
