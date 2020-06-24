<template>
	<view class="container">
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
                <view class="input-content">
                	<view class="input-item">
                		<text></text>
                        <input
                            v-show="new_show"
                			type="text" 
                			placeholder="输入新密码"
                            v-model="newPassword"
                			placeholder-class="input-empty" 
                            data-key="newPassword"
                			maxlength="16" 
                		/>
                        <input
                            v-show="!new_show"
                        	type="password" 
                        	placeholder="输入新密码"
                            v-model="newPassword"
                        	placeholder-class="input-empty" 
                            data-key="newPassword"
                        	maxlength="16" 
                        />
                        <image src="../../static/close.png" mode="aspectFit" v-show="newPassword.length > 0"></image>
                        <image :src="new_show ? '../../static/yank.png' : '../../static/yanbk.png'" mode="aspectFit" @click="display_pwd(1)"></image>
                	</view>
                	<view class="input-item">
                		<text></text>
                        <input 
                            v-show="con_show"
                            type='text' 
                            placeholder="确认新密码" 
                            v-model="conPassword" 
                            placeholder-class="input-empty" 
                            data-key="conPassword"
                            maxlength="16" 
                        />
                        <input
                            v-show="!con_show"
                            type='password' 
                            placeholder="确认新密码" 
                            v-model="conPassword" 
                            placeholder-class="input-empty" 
                            data-key="conPassword"
                            maxlength="16" 
                        />
                        <image src="../../static/close.png" mode="aspectFit" v-show="conPassword.length > 0"></image>
                        <image :src="con_show ? '../../static/yank.png' : '../../static/yanbk.png'" mode="aspectFit" @click="display_pwd(2)"></image>
                	</view>
                    <view class="tips">必须是6-16个英文字母、数字或符号(除空格)</view>
                </view>
                <button class="confirm-btn" :disabled="logining" @click="submit">确认</button>
         </view>
	</view>
</template>

<script>
import md5 from 'static/md5.min.js';
export default {
	data() {
		return {
            logining: false,
            guid: '',
            newPassword: '',
            conPassword: '',
            new_show: false,
            con_show: false
		};
	},
    onBackPress(){
        this.$api.ovPage()
    },
    onLoad(option) {
        this.guid = option.guid;
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
	methods: {
        display_pwd(index) {
            if (index == 1) {
                this.new_show = !this.new_show;
            } else {
                this.con_show = !this.con_show;
            }
        },
        navBack(){
        	uni.navigateBack();
        },
		submit() {
            if (this.guid.length == 0) {
                this.$api.msg('手机验证未成功');
                return;
            }
            if (this.newPassword.length < 6 || this.newPassword.length > 16) {
                this.$api.msg('密码长度请控制在6-16位');
                return;
            }
            if (this.conPassword.length < 6 || this.conPassword.length > 16) {
                this.$api.msg('密码长度请控制在6-16位');
                return;
            }
            if (this.conPassword != this.newPassword) {
                this.$api.msg('两次密码不一致');
                return;
            }
            if (this.logining) return;
            this.logining = true;
            this.$ajax.get('login/setPassword', {
                    guid: this.guid,
                    password: md5(this.conPassword),
                }).then(res => {
                    if (res.data.code == 0) {
                        this.$api.msg('密码设置成功');
                        setTimeout(function() {
                            uni.redirectTo({
                                url: '/pages/public/login?statr=1'
                            });
                        }, 1000);
                    } else {
                        this.logining = false;
                        this.$api.msg(res.data.msg);
                    }
                });
		}
	}
};
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
        text{
            width: 10rpx;
            height: 10rpx;
            border-radius: 50%;
            background: #000000;
            margin-right: 30rpx;
        }
	}
    .tips{
        font-size: 24rpx;
        color: #666;
        padding: 0 20rpx;
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
