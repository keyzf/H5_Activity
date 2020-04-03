<template>
	<view class="container">
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
                <view class="input-content">
                	<view class="input-item">
                		<input 
                			type="number" 
                			:value="mobile" 
                			placeholder="手机号码"
                			maxlength="11"
                			data-key="mobile"
                			@input="inputChange"
                		/>
                	</view>
                	<view class="input-item">
                		<input 
                			type="number" 
                            v-model="telLogin.code"
                			placeholder="短信验证码"
                			placeholder-class="input-empty"
                			maxlength="6"
                			@confirm="registerLogin"
                		/>
                        <text :class="telLogin.codestyle" @click="getTelCode">{{ telLogin.codetext }}</text>
                	</view>
                </view>
                <button class="confirm-btn" @click="registerLogin" :disabled="logining">下一步</button>
         </view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				mobile: '',
                logining: false,
                telLogin: {
                    code: '',
                    codetext: '获取验证码',
                    codetime: 0,
                    codestyle: 'btn',
                    code_state: true
                },
                guid: ''
			}
		},
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
        },
		methods: {
			inputChange(e){
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			navBack(){
				uni.navigateBack();
			},
            forget(){
				uni.redirectTo({
				    url:'/pages/public/forget?guid=' + this.guid
				})
			},
            // 发送验证码
            getTelCode() {
                if(!/(^1[3|4|5|7|8][0-9]{9}$)/.test(this.mobile)){
                	this.$api.msg('请输入正确的手机号码');
                	return;
                }
                if (this.telLogin.codetime != 0 || !this.telLogin.code_state) {
                    return;
                }
                this.telLogin.code_state = false;
                this.$ajax.get('register/getVerificationCodeInRegister', { tel: this.mobile }).then(res => {
                    if (res.data.code == 0) {
                        this.$api.msg('验证码已发送，请注意查收');
                        this.telLogin.codetext = '60s';
                        this.telLogin.codestyle = 'btn x';
                        this.telLogin.codetime = 60;
                        this.intervalID = setInterval(() => {
                            if (this.telLogin.codetime == 0) {
                                clearInterval(this.intervalID);
                                this.telLogin.codestyle = 'btn';
                                this.telLogin.codetext = '获取验证码';
                                this.telLogin.code_state = true;
                            } else {
                                this.telLogin.codetime = this.telLogin.codetime - 1;
                                this.telLogin.codetext = this.telLogin.codetime + 's';
                            }
                        }, 1000);
                    } else {
                        this.telLogin.code_state = true;
                        this.$api.msg(res.data.msg);
                    }
                });
            },
            registerLogin() {
                if(!/(^1[3|4|5|7|8][0-9]{9}$)/.test(this.mobile)){
                	this.$api.msg('请输入正确的手机号码');
                	return;
                }
                console.log(this.telLogin.code)
                if (this.telLogin.code.length == 0) {
                    this.$api.msg('请输入正确的验证码');
                    return;
                }
                // 注册
                this.logining = true;
                this.$ajax.get('login/getGuidByTelWithCode', {
                    tel: this.mobile,
                    code: this.telLogin.code
                }).then(res => {
                    if (res.data.code == 0) {
                        this.guid = res.data.result.data.guid;
                        this.forget();
                    } else {
                        this.logining = false;
                        this.$api.msg(res.data.msg);
                    }
                });
            },
		},
	}
</script>

<style lang='scss'>
	page{
		background: #fff;
	}
	.container{
		padding-top: 60px;
		position:relative;
		width: 100vw;
		min-height: 100vh;
		overflow: hidden;
		background: #fff;
	}
	.wrapper{
		position:relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 40upx;
	}
	.back-btn{
		position:absolute;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 40upx;
		color: $font-color-dark;
	}
	.left-top-sign{
        text-align: center;
        margin-bottom: 40rpx;
        image{
            width: 160rpx;
            height: 160rpx;
        }
	}
	.welcome{
		position:relative;
		left: 50upx;
		top: -90upx;
		font-size: 46upx;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0,0,0,.3);
	}
	.input-content{
		padding: 0 60upx;
	}
	.input-item{
		display:flex;
		justify-content: center;
		padding: 0 20upx;
		height: 80upx;
		border-radius: 4px;
		margin-bottom: 50upx;
		position: relative;
		border-bottom: 1px solid #f1f1f1;
		align-items: center;
		&:last-child{
			margin-bottom: 0;
		}
		.tit{
			height: 50upx;
			line-height: 56upx;
			font-size: $font-sm+2upx;
			color: $font-color-base;
		}
		input{
			height: 60upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			flex: 1;
		}	
		.btn{
		    font-size: 24rpx;
		    border-left: 1px solid #D6D6D6;
		    padding-left:20rpx;
		    line-height: 36rpx;
		    color: #EE3847;
		    margin-left: 6rpx;
		    &.x{
		        color: #969696;
		    }
		}
		image{
		    padding: 14rpx;
		    height: 60rpx;
		    width: 60rpx;
		}
	}

	.confirm-btn{
		width: 630upx;
		height: 76upx;
		line-height: 76upx;
		border-radius: 50px;
		margin-top: 70upx;
		background: $uni-color-primary;
		color: #fff;
		font-size: $font-lg;
		&:after{
			border-radius: 100px;
		}
	}
	.forget-section{
        padding: 0 30rpx;
		font-size: $font-sm+2upx;
		color: $font-color-spec;
		text-align: center;
		margin-top: 40upx;
        display: flex;
        align-items: center;
        justify-content: space-between;
	}
	.register-section{
		position:absolute;
		left: 0;
		bottom: 50upx;
		width: 100%;
		font-size: $font-sm+2upx;
		color: $font-color-base;
		text-align: center;
		text{
			color: $font-color-spec;
			margin-left: 10upx;
		}
	}
</style>
