<template>
	<view class="container">
		<view class="wrapper">
			<view class="input-content">
				<view class="input-item">
					<text class="tit">用户名</text>
					<input type="text" placeholder="请输入用户名" maxlength="20" v-model="username"/>
				</view>
                <view style="font-size: 24rpx;">4-20个字符，可由中英文、数字、“-”、“_”组成，用户名只可设置一次，不可修改。</view>
			</view>
			<button class="confirm-btn" @click="register" :disabled="logining">确定</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
            username:'',
			logining: false,
            guid:0
		};
	},
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    onLoad(o) {
        this.guid = o.guid;
    },
	methods: {
		register() {
            
            var reg = /^[A-Za-z0-9-_\u4e00-\u9fa5]{2,20}$/;     
            if (reg.test(this.username)) {         
               var newvalue = this.username.replace(/[^\x00-\xff]/g, "**"); //输入内容
               var length = newvalue.length;
               if(length > 3 && length < 21){
                   // uni.request({
                   //     url: this.$api_url + 'login/changeUsername', //仅为示例，并非真实接口地址。
                   //     data: {
                   //         username: this.username,
                   //         guid:"44daabdbe6a045f89c35ef8a6bb7df64"
                   //     },
                   //     success: (res) => {
                   //         if (res.data.code == 0) {
                   //             // uni.navigateBack({
                   //             //     delta: 2
                   //             // });
                   //         } else {
                   //             this.$api.msg(res.data.msg);
                   //             this.logining = false;
                   //         }
                   //     }
                   // });
                   this.logining = true;
                   this.$ajax.get('login/changeUsername', {
                       username: this.username,
                       guid:this.guid
                   }).then(res => {
                       if (res.data.code == 0) {
                           uni.navigateBack({
                               delta: 2
                           });
                       } else {
                           this.$api.msg(res.data.msg);
                           this.logining = false;
                       }
                   });
               }else{
                   this.$api.msg('用户名长度不符合');
               }
            }else{
                this.$api.msg('请输入正确格式');
            }
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
