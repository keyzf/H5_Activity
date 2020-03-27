<template>
	<view class="container">
		<view class="list-cell b-b m-t" @click="navTo('/pages/set/information')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">个人信息</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell b-b" @click="navTo(userType == 0 ? '/pages/set/cipher' : '/pages/set/new_cipher')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit" v-if="userType == 0">修改密码</text>
            <text class="cell-tit" v-else>设置新密码</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell log-out-btn" @click="toLogout" v-if="loginState">
			<text class="cell-tit">退出登录</text>
		</view>
	</view>
</template>

<script>
	import {mapMutations } from 'vuex';
	export default {
		data() {
			return {
				loginState: false,
                userType: 0
			};
		},
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
            let userInfo = uni.getStorageSync('userInfo') || '';
            if (userInfo.guid) {
                this.loginState = true;
                this.initUserType();
            } else {
                this.loginState = false;
            }
        },
        onBackPress(){
            this.$api.ovPage()
        },
		methods:{
			...mapMutations(['logout']),
			navTo(url){
                if (!this.loginState) {
                    uni.navigateTo({
                        url: '/pages/public/login'
                    });
                    return;
                }
				uni.navigateTo({
					url
				});
			},
            initUserType() {
                this.$ajax.get('login/regUserCenter', {}).then(res => {
                    console.log(res);
                    if (res.data.code == 0) {
                        let data = res.data.result.data;
                        this.userType = data.hasNotPassword;
                    } else {
                        this.$api.msg('获取用户信息异常，请稍后重试');
                    }
                });
            },
			//退出登录
			toLogout(){
				uni.showModal({
				    content: '确定要退出登录么',
				    success: (e)=>{
				    	if(e.confirm){
                            this.$ajax.get('login/regUserlogout', {}).then(res => {
                                if (res.data.code == 0) {
                                    this.$store.dispatch('menu_5')
                                    this.logout();
                                    uni.$emit('changeLoginState', {});
                                    setTimeout(()=>{
                                    	uni.navigateBack();
                                    }, 200)
                                } else {
                                    this.$api.msg(res.data.msg);
                                }
                            });
				    		
				    	}
				    }
				});
			}
		}
	}
</script>

<style lang='scss'>
	page{
		background: $page-color-base;
	}
	.list-cell{
		display:flex;
		align-items:baseline;
		padding: 20upx $page-row-spacing;
		line-height:60upx;
		position:relative;
		background: #fff;
		justify-content: center;
		&.log-out-btn{
			margin-top: 40upx;
			.cell-tit{
				color: $uni-color-primary;
				text-align: center;
				margin-right: 0;
			}
		}
		&.cell-hover{
			background:#fafafa;
		}
		&.b-b:after{
			left: 30upx;
		}
		&.m-t{
			margin-top: 16upx; 
		}
		.cell-more{
			align-self: baseline;
			font-size:$font-lg;
			color:$font-color-light;
			margin-left:10upx;
		}
		.cell-tit{
			flex: 1;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			margin-right:10upx;
		}
		.cell-tip{
			font-size: $font-base;
			color: $font-color-light;
		}
		switch{
			transform: translateX(16upx) scale(.84);
		}
	}
</style>
