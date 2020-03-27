<template>
    <view class="container">
        <view class="list-cell b-b">
            <text class="cell-tit">新密码</text>
            <input class="cell-more" type="password" v-model="newPassword" maxlength="16" placeholder="请输入新密码"/>
        </view>
        <view class="list-cell b-b">
            <text class="cell-tit">重复新密码</text>
            <input class="cell-more" type="password" v-model="newPassword1" maxlength="16" placeholder="重复新密码"/>
        </view>
        <view class="btn-action" @click="editPassword">确定</view>
    </view>
</template>

<script>
import md5 from '@/static/md5.min.js';
export default {
    data() {
        return {
			newPassword: '',
			newPassword1: ''
        };
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    methods: {
		// 修改密码
        editPassword() {
            if (this.newPassword.length == 0 || this.newPassword1.length == 0) {
                this.$api.msg('请输入新密码');
                return;
            }
            if (this.newPassword.length < 6 || this.newPassword1.length < 6) {
                this.$api.msg('密码长度为6-16字符');
                return;
            }
			if (this.newPassword == this.newPassword1) {
				this.$ajax.get('login/setPassword', {
                    password: md5(this.newPassword)
                }).then(res => {
					console.log(res);
					if (res.data.code == 0) {
						this.$api.msg('密码设置成功');
						// this.logout();
                        setTimeout(function() {
                            uni.navigateBack();
                        }, 1000);
					} else {
						this.$api.msg(res.data.msg);
					}
				});
			} else {
				this.$api.msg('两次新密码不一致，请查看并修改');
			}
		}
    }
};
</script>

<style lang="scss">
page {
    background: $page-color-base;
}
.uni-tip {
    padding: 15px;
    width: 300px;
    background: #fff;
    box-sizing: border-box;
    border-radius: 10px;
}

.uni-tip-title {
    text-align: center;
    font-weight: bold;
    font-size: 16px;
    color: #333;
}

.uni-tip-content {
    padding: 15px;
    font-size: 14px;
    color: #666;
}

.uni-tip-group-button {
    margin-top: 10px;
    display: flex;
}

.btn-action {
    width: 94%;
    text-align: center;
    color: #3b4144;
    font-size: 32rpx;
    padding: 16rpx;
    margin: 0 auto;
    margin-top: 20rpx;
    background: white;
    border-radius:8rpx ;
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
        font-size: $font-lg;
        color: $font-color-light;
        margin-left: 10upx;
        flex: 1;
    }
    .cell-tit {
        width: 160rpx;
        font-size: $font-base + 2upx;
        color: $font-color-dark;
        margin-right: 10upx;
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
