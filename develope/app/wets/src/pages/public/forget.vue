<template>
	<view class="container">
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="input-content">
				<view class="input-item">
					<text class="tit">手机号码</text>
					<input type="number" placeholder="请输入手机号码" maxlength="11" v-model="tel" />
				</view>
				<view class="input-item">
					<text class="tit">验证码</text>
					<input type="type" placeholder="请输入验证码" maxlength="6" v-model="authcode" />
					<text class="gain" v-show="show" @click="getCode()">获取验证码</text>
					<text class="gain" v-show="!show">{{ count }}s重新获取</text>
				</view>
				<view class="input-item">
					<text class="tit">新密码</text>
					<input type="text" placeholder="请输入新密码" maxlength="20" password="true" v-model="newPassword" />
				</view>
				<view class="input-item">
					<text class="tit">重复密码</text>
					<input type="text" placeholder="请输入重复密码" maxlength="20" password="true" v-model="repeatpw" />
				</view>
			</view>
			<button class="confirm-btn" @click="submit" :disabled="logining">确定</button>
		</view>
	</view>
</template>

<script>
import md5 from 'static/md5.min.js';
export default {
	data() {
		return {
			tel: '',
			authcode: '',
			newPassword: '',
			repeatpw: '',
			logining: false,
			show: true,
			count: 60,
			timer:null
		};
	},
    onBackPress(){
        this.$api.ovPage()
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
	methods: {
		navBack() {
			uni.navigateBack();
		},
		countdown() {
			this.count = 60;
			this.show = false;
			this.timer = setInterval(() => {
				if (this.count == 0) {
					clearInterval(this.timer);
					this.show = true;
				} else {
					this.count--;
				}
			}, 1000);
		},
		getCode() {
			const reg = /^1[0-9]{10}$/;
			if (reg.test(this.tel)) {
				this.$ajax.get('login/regUserForgetPasswordGetAuthCode', { tel: this.tel }).then(res => {
					if (res.data.code == 0) {
						this.countdown();
					} else {
						this.$api.msg(res.data.msg);
					}
				});
			} else {
				this.$api.msg('手机号码错误');
			}
		},
		submit() {
			if (this.check()) {
				this.logining = true;
				this.$ajax.get('login/changePasswordWithAuthCode', {
						tel: this.tel,
						authcode: this.authcode,
						newPassword: md5(this.newPassword),
						repeatpw: md5(this.repeatpw)
					}).then(res => {
						if (res.data.code == 0) {
							this.$api.prePage().mobile = this.tel;
							uni.navigateBack();
						} else {
							this.logining = false;
							this.$api.msg(res.data.msg);
						}
					});
			}
		},
		check() {
			let msg = '';
			let mark = true;
			if (mark && this.tel == '') {
				msg = '请输入手机号';
				mark = false;
			}
			if (mark && this.authcode == '') {
				msg = '请输入验证码';
				mark = false;
			}
			if (mark && this.newPassword == '') {
				msg = '请输入密码';
				mark = false;
			}
			if (mark && this.repeatpw == '') {
				msg = '请再次输入密码';
				mark = false;
			}
			if (mark && (this.newPassword.length < 6 || this.newPassword.length > 20)) {
				msg = '新密码长度为6-20位字符';
				mark = false;
			}
			if (mark && this.newPassword != this.repeatpw) {
				msg = '输入密码不一致，请重新输入';
				mark = false;
			}
			if (!mark) {
				this.$api.msg(msg);
			}
			return mark;
		}
	}
};
</script>

<style lang="scss">
page {
	background: #fff;
}
.container {
	padding-top: 140rpx;
	position: relative;
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	background: #fff;
}
.wrapper {
	position: relative;
	z-index: 90;
	background: #fff;
	padding-bottom: 40upx;
}
.back-btn {
	position: absolute;
	left: 40upx;
	z-index: 9999;
	padding-top: var(--status-bar-height);
	top: 40upx;
	font-size: 40upx;
	color: $font-color-dark;
}
.left-top-sign {
	font-size: 120upx;
	color: $page-color-base;
	position: relative;
	left: -16upx;
}
.right-top-sign {
	position: absolute;
	top: 80upx;
	right: -30upx;
	z-index: 95;
	&:before,
	&:after {
		display: block;
		content: '';
		width: 400upx;
		height: 80upx;
		background: #b4f3e2;
	}
	&:before {
		transform: rotate(50deg);
		border-radius: 0 50px 0 0;
	}
	&:after {
		position: absolute;
		right: -198upx;
		top: 0;
		transform: rotate(-50deg);
		border-radius: 50px 0 0 0;
		/* background: pink; */
	}
}
.left-bottom-sign {
	position: absolute;
	left: -270upx;
	bottom: -320upx;
	border: 100upx solid #d0d1fd;
	border-radius: 50%;
	padding: 180upx;
}
.welcome {
	position: relative;
	left: 50upx;
	top: -90upx;
	font-size: 46upx;
	color: #555;
	text-shadow: 1px 0px 1px rgba(0, 0, 0, 0.3);
}
.input-content {
	padding: 0 60upx;
}
.input-item {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	padding: 0 30upx;
	background: $page-color-light;
	height: 120upx;
	border-radius: 4px;
	margin-bottom: 50upx;
	position: relative;
	&:last-child {
		margin-bottom: 0;
	}
	.gain {
		position: absolute;
		right: 20rpx;
		font-size: 28rpx;
		color: #0081ff;
	}
	.tit {
		height: 50upx;
		line-height: 56upx;
		font-size: $font-sm + 2upx;
		color: $font-color-base;
	}
	input {
		height: 60upx;
		font-size: $font-base + 2upx;
		color: $font-color-dark;
		width: 100%;
	}
}

.confirm-btn {
	width: 630upx;
	height: 76upx;
	line-height: 76upx;
	border-radius: 50px;
	margin-top: 70upx;
	background: $uni-color-primary;
	color: #fff;
	font-size: $font-lg;
	&:after {
		border-radius: 100px;
	}
}
.forget-section {
	font-size: $font-sm + 2upx;
	color: $font-color-spec;
	text-align: center;
	margin-top: 40upx;
}
.register-section {
	position: absolute;
	left: 0;
	bottom: 50upx;
	width: 100%;
	font-size: $font-sm + 2upx;
	color: $font-color-base;
	text-align: center;
	text {
		color: $font-color-spec;
		margin-left: 10upx;
	}
}
</style>
