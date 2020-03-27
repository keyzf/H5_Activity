<template>
	<view class="container">
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="left-top-sign">
                <image src="../../static/logo.png" mode="aspectFit"></image>
            </view>
            <view v-if="statr == 0">
                <view class="input-content">
                	<view class="input-item">
                		<text class="tit">手机号码</text>
                		<input 
                			type="number" 
                			:value="mobile" 
                			placeholder="请输入手机号码"
                			maxlength="11"
                			data-key="mobile"
                			@input="inputChange"
                		/>
                        <text class="btn" @click="getTelCode">{{ telLogin.codetext }}</text>
                	</view>
                	<view class="input-item">
                		<text class="tit">验证码</text>
                		<input 
                			type="mobile" 
                            v-model="telLogin.code"
                			placeholder="请输入验证码"
                			placeholder-class="input-empty"
                			maxlength="20"
                			@confirm="registerLogin"
                		/>
                	</view>
                </view>
                <button class="confirm-btn" @click="registerLogin" :disabled="logining">注册/登录</button>
                <view class="forget-section">
                    <text></text>
                	<text @click="trgrstatr">使用密码登录</text>
                </view>
            </view>
			<view v-else>
                <view class="input-content">
                	<view class="input-item">
                		<text class="tit">手机号码</text>
                		<input 
                			type="number" 
                			:value="mobile" 
                			placeholder="请输入手机号码"
                			maxlength="11"
                			data-key="mobile"
                			@input="inputChange"
                		/>
                	</view>
                	<view class="input-item">
                		<text class="tit">密码</text>
                		<input 
                			type="mobile" 
                			:value="password" 
                			:placeholder="请输入密码"
                			placeholder-class="input-empty"
                			maxlength="20"
                			password 
                			data-key="password"
                			@input="inputChange"
                			@confirm="toLogin"
                		/>
                	</view>
                </view>
                <button class="confirm-btn" @click="toLogin" :disabled="logining">登录</button>
                <view class="forget-section">
                    <text @click="forget">忘记密码?</text>
                	<text @click="trgrstatr">使用短信登录</text>
                </view>
            </view>
		</view>
	</view>
</template>

<script>
	import { mapMutations } from 'vuex';
	import md5 from 'static/md5.min.js';
	export default{
		data(){
			return {
                statr:0,
				mobile: '',
				password: '',
				logining: false,
                telLogin: {
                    code: '',
                    codetext: '获取验证码',
                    codetime: 0
                    
                }
			}
		},
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
        },
        onBackPress(){
            this.$api.ovPage()
        },
		methods: {
			...mapMutations(['login']),
			inputChange(e){
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			navBack(){
				uni.navigateBack();
			},
            forget(){
				uni.navigateTo({
				    url:'/pages/public/forget'
				})
			},
			toRegist(){
				uni.navigateTo({
				    url:'/pages/public/register'
				})
			},
			toLogin(){
				this.logining = true;
                if(this.mobile.length == 11 &&this.password.length>=6){
					let openid = uni.getStorageSync('openid') || '';
					let recommendloginguid = uni.getStorageSync('recommendloginguid') || '';
                    uni.showLoading({
                    	mask:true
                    })
                    this.$ajax.get('login/regUserlogin', {
						tel: this.mobile,
						password: md5(this.password),
						wxid: openid,
						recommendloginguid: recommendloginguid
					}).then(res => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
							uni.removeStorageSync('recommendloginguid');
                            this.login(res.data.result.data);
                            this.$api.prePage() && (this.$api.prePage().isDoRefresh = true);
                            uni.$emit('changeLoginState', {});
                            uni.setStorageSync('isopenbuildcompany', res.data.result.data.isopenbuildcompany);
                            if(res.data.result.data.isopenbuildcompany == 1){
                                this.$store.dispatch('menu_3')
                                //已建店 到建店页面
                                this.isOpenShop().then(openShop_res =>{
                                    if(openShop_res){
                                        this.$store.dispatch('menu_4');
                                    }
                                    if(res.data.result.data.haveNickName == 0){
                                        uni.navigateTo({
                                            url:'/pages/public/name?guid='+res.data.result.data.guid
                                        })
                                    }else{
                                        uni.navigateBack();
                                    }
                                }) 
                            }else{
                                if(res.data.result.data.haveNickName == 0){
                                    uni.navigateTo({
                                        url:'/pages/public/name?guid='+res.data.result.data.guid
                                    })
                                }else{
                                    uni.navigateBack();
                                }
                            }
                        } else {
                            this.logining = false;
                            this.$api.msg(res.data.msg);
                        }
                    });
                }else{
                    this.logining = false;
                    this.$api.msg('请输入正确用户名密码');
                }
			},
            isOpenShop(){
                try{
                     const promise = new Promise((resolve, reject) => {
                         this.$ajax.get('com/hasCompany', {}).then(res => {
                           if (res.data.code == 0) {
                               let companyresult = res.data.result.data.companyresult; // 0-未创建店铺，1-已创建店铺
                               let result = false;
                               if (companyresult == 0) {
                                   result = false;
                               } else {
                                   //已创建
                                   result = true;
                               }
                               resolve(result)
                           }
                       },reason => {
                            resolve(false); // 出错了！
                       });  
                     })
                     return promise
                }catch(e){
                	return false;
                } 
            },
            trgrstatr(){
                this.statr = !this.statr;
            },
            // 发送验证码
            getTelCode() {
                if (this.telLogin.codetime != 0) {
                    return;
                }
                if(!/(^1[3|4|5|7|8][0-9]{9}$)/.test(this.mobile)){
                	this.$api.msg('请输入正确的手机号码');
                	return;
                }
                this.$ajax.get('register/getVerificationCodeInRegister', { tel: this.mobile }).then(res => {
                    if (res.data.code == 0) {
                        this.$api.msg('验证码已发送，请注意查收');
                        this.telLogin.codetext = '60秒后可重发';
                        this.telLogin.codetime = 60;
                        this.intervalID = setInterval(() => {
                            if (this.telLogin.codetime == 0) {
                                clearInterval(this.intervalID);
                                this.telLogin.codetext = '重新获取';
                            } else {
                                this.telLogin.codetime = this.telLogin.codetime - 1;
                                this.telLogin.codetext = this.telLogin.codetime + '秒后可重发';
                            }
                        }, 1000);
                    } else {
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
                this.$ajax.get('login/wxRegister', {
                    wxid: uni.getStorageSync('openid'), //uni.getStorageSync('openid'),
                    tel: this.mobile,
                    code: this.telLogin.code
                }).then(res => {
                    if (res.data.code == 0) {
                        this.login(res.data.result.data);
                        uni.removeStorageSync('recommendloginguid');
                        this.login(res.data.result.data);
                        this.$api.prePage() && (this.$api.prePage().isDoRefresh = true);
                        uni.$emit('changeLoginState', {});
                        uni.setStorageSync('isopenbuildcompany', res.data.result.data.isopenbuildcompany);
                        if(res.data.result.data.isopenbuildcompany == 1){
                            this.$store.dispatch('menu_3')
                            //已建店 到建店页面
                            this.isOpenShop().then(openShop_res =>{
                                if(openShop_res){
                                  this.$store.dispatch('menu_4');
                                }
                                if(res.data.result.data.haveNickName == 0){
                                    uni.navigateTo({
                                        url:'/pages/public/name?guid='+res.data.result.data.guid
                                    });
                                }else{
                                    uni.navigateBack();
                                }
                            }) 
                        }else{
                            if(res.data.result.data.haveNickName == 0){
                                uni.navigateTo({
                                    url:'/pages/public/name?guid='+res.data.result.data.guid
                                })
                            }else{
                                uni.navigateBack();
                            }
                        }
                    } else {
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
		padding-top: 100px;
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
		flex-direction: column;
		align-items:flex-start;
		justify-content: center;
		padding: 0 30upx;
		background:$page-color-light;
		height: 120upx;
		border-radius: 4px;
		margin-bottom: 50upx;
        position: relative;
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
			width: 100%;
		}	
        .btn{
            position: absolute;
            right: 20rpx;
            font-size: 24rpx;
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
