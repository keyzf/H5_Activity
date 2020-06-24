<template>
    <view class="container">
        <view class="list-cell b-b m-t">
            <text class="cell-tit">头像</text>
            <view class="cell-more yticon icon-you"><image :src="headurl || '/static/missing-face.png'" class="tximg" @click="changeHeadurl" mode="aspectFill" @error="errorImg()"></image></view>
        </view>
        <view class="list-cell b-b">
            <text class="cell-tit">昵称</text>
            <text class="cell-more yticon icon-you" @click="popupName">{{ name }}</text>
        </view>
        <uni-popup :show="nameShow" type="center" :custom="true" :mask-click="false" @change="change">
            <view class="uni-tip">
                <view class="uni-tip-title">昵称修改</view>
                <view class="uni-tip-content"><input class="cell-more" type="text" v-model="newName" placeholder="请输入昵称" /></view>
                <view style="font-size: 24rpx;">4-20个字符，可由中英文、数字、“-”、“_”组成。</view>
                <view class="uni-tip-group-button">
                    <view class="uni-tip-button" @click="editName('no')">取消</view>
                    <view class="uni-tip-button action" @click="editName('yes')">确定</view>
                </view>
            </view>
        </uni-popup>
        <view class="list-cell b-b">
            <text class="cell-tit">手机号</text>
            <text class="cell-more yticon icon-you" @click="togglePopup()">{{ tel }}</text>
        </view>
        <uni-popup :show="show" type="center" :custom="true" :mask-click="false" @change="change">
            <view class="uni-tip">
                <view class="uni-tip-title">电话绑定</view>
                <view class="uni-tip-content"><input class="cell-more" type="text" maxlength="11" v-model="changetel.telNum" placeholder="请输入手机号" /></view>
                <view class="uni-tip-content">
                    <input class="cell-more" type="text" maxlength="10" v-model="changetel.code" placeholder="请输入验证码" />
                    <text @click="validataPwd(changetel.codetime)">{{ changetel.codetext }}</text>
                </view>
                <view class="uni-tip-group-button">
                    <view class="uni-tip-button" @click="cancel('no')">取消</view>
                    <view class="uni-tip-button action" @click="cancel('yes')">确定</view>
                </view>
            </view>
        </uni-popup>
        <uni-popup :show="pwdshow" type="center" :custom="true" :mask-click="false" @change="change">
            <view class="uni-tip">
                <view class="uni-tip-title">登录密码验证</view>
                <view class="uni-tip-content"><input class="cell-more" type="password" maxlength="20" v-model="changetel.password" placeholder="请输入登录密码" /></view>
                <view class="uni-tip-group-button">
                    <view class="uni-tip-button" @click="pwdcancel('no')">取消</view>
                    <view class="uni-tip-button action" @click="pwdcancel('yes')">确定</view>
                </view>
            </view>
        </uni-popup>
        <view class="list-cell b-b">
            <text class="cell-tit">性别</text>
            <picker class="cell-more" @change="bindPickerChange" :value="index" :range="array">
                <view class="uni-input">{{ array[index] }}</view>
            </picker>
        </view>
        <view class="list-cell b-b">
            <text class="cell-tit">生日</text>
            <picker class="cell-more" mode="date" @change="bindDateChange" :value="date" start="1900-01-01" end="2100-12-31">
                <view class="uni-input">{{ date }}</view>
            </picker>
        </view>
    </view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import md5 from '@/static/md5.min.js';
export default {
    components: { uniPopup },
    data() {
        return {
            date: '2019-01-01',
            array: ['女', '男'],
            index: 0,
            show: false,
            pwdshow: false,
            tel: '',
            headurl: '',
            name: '',
            changetel: {
                code: '',
                codetext: '获取验证码',
                codetime: 0,
                password: '',
                telNum: ''
            },
            clickState: true,
            nameShow: false,
            newName: ''
        };
    },
    onLoad() {
        this.$ajax.get('login/regUserCenter', {}).then(res => {
            console.log(res);
            if (res.data.code == 0) {
                let data = res.data.result.data;
                if (data.birthday.length != 0) this.date = data.birthday;
                this.index = data.sex;
                this.tel = data.tel;
                this.name = data.name;
                this.newName = this.name;
                this.headurl = data.headurl;
            } else {
                this.$api.msg('获取用户信息异常，请稍后重试');
            }
        });
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    methods: {
        bindDateChange: function(e) {
            this.$ajax.get('user/updatebirthday', { birthday: e.target.value }).then(res => {
                console.log(res);
                if (res.data.code == 0) {
                    this.date = e.target.value;
                } else {
                    this.$api.msg('修改失败，请稍后重试');
                }
            });
        },
        bindPickerChange: function(e) {
            this.$ajax.get('user/updatesex', { sex: e.target.value }).then(res => {
                console.log(res);
                if (res.data.code == 0) {
                    this.index = e.target.value;
                } else {
                    this.$api.msg('修改失败，请稍后重试');
                }
            });
        },
        // 手机号修改弹框
        togglePopup() {
            this.pwdshow = true;
        },
        // 用户名修改弹框
        popupName() {
            this.nameShow = true;
        },
        change(e) {
            console.log(e.show);
        },
        cancel(type) {
            if (type == 'no') {
                this.show = false;
            } else {
                if (this.changetel.code.length == 0) {
                    this.$api.msg('请输入验证码');
                    return;
                }
                this.editTel();
            }
        },
        pwdcancel(type) {
            if (type == 'no') {
                this.pwdshow = false;
            } else {
                if (this.changetel.password.length == 0) {
                    this.$api.msg('请输入密码');
                    return;
                }
                this.$ajax.get('user/checkPassword', { password: md5(this.changetel.password) }).then(res => {
                    if (res.data.code == 0) {
                        this.pwdshow = false;
                        this.show = true;
                    } else {
                        this.$api.msg('密码错误，请确认密码是否正确');
                    }
                });
            }
        },
        // 是否修改用户名
        editName(type) {
            if (type == 'no') {
                this.nameShow = false;
            } else {
                // 修改用户名
                this.$ajax.get('login/changeUsername', { username: this.newName }).then(res => {
                    if (res.data.code == 0) {
                        this.name = this.newName;
                        this.nameShow = false;
                        this.$api.msg('昵称修改成功');
                        uni.$emit('changeLoginState', {});
                    } else {
                        this.$api.msg('昵称修改失败');
                    }
                });
            }
        },
        // 获取验证码
        getTelCode() {
            if(!/(^1[3|4|5|7|8][0-9]{9}$)/.test(this.changetel.telNum)){
            	this.$api.msg('请输入正确的手机号码');
            	return;
            }
            if (this.clickState) {
                this.clickState = false;
                this.$ajax.get('user/sendCheckCode', { tel: this.changetel.telNum }).then(res => {
                    if (res.data.code == 0) {
                        this.$api.msg('验证码已发送，请注意查收');
                        this.changetel.codetext = '60秒后可重发';
                        this.changetel.codetime = 60;
                        this.intervalID = setInterval(() => {
                            if (this.changetel.codetime == 0) {
                                clearInterval(this.intervalID);
                                this.changetel.codetext = '重新获取';
                            } else {
                                this.changetel.codetime = this.changetel.codetime - 1;
                                this.changetel.codetext = this.changetel.codetime + '秒后可重发';
                            }
                        }, 1000);
                    } else {
                        this.$api.msg(res.data.msg);
                    }
                    this.clickState = true;
                });
            }
        },
        // 验证密码是否正确
        validataPwd(time) {
            if (time == 0) {
                if (this.changetel.telNum) {
                    this.getTelCode();
                } else {
                    this.$api.msg('请输入手机号');
                }
            } else {
                this.$api.msg('验证码已发送，请注意查收');
            }
        },
        // 修改手机号
        editTel() {
            if (this.clickState) {
                this.clickState = false;
                this.$ajax.get('user/changeUserTel', { code: this.changetel.code, tel: this.changetel.telNum }).then(res => {
                    console.log(res);
                    if (res.data.code == 0) {
                        this.tel = this.changetel.telNum;
                        this.show = false;
                    } else {
                        this.$api.msg(res.data.msg);
                    }
                    this.clickState = true;
                });
            }
        },
        // 更换头像
        changeHeadurl() {
            if (this.$wx.isWechat()) {
                this.$wx.upload(1).then(res => {
                    if (res.data.code == 0) {
                        let data = res.data.result.data;
                        uni.showLoading({
                            title: '头像修改中',
                            mask: true
                        });
                        this.headurl = data.localId;
                        this.$ajax
                            .get('login/changeHeadUrl', {
                                headurl: data.url
                            })
                            .then(res => {
                                uni.hideLoading();
                                console.log(res);
                                if (res.data.code == 0) {
                                    uni.$emit('changeLoginState', {});
                                    this.headurl = data.url;
                                } else {
                                    this.$api.msg('头像修改失败');
                                }
                            });
                    } else {
                        this.$api.msg('图片上传失败');
                    }
                });
            }
        },
        errorImg(){
            this.headurl = '/static/missing-face.png';
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
    padding: 10rpx;
    font-size: 28rpx;
    color: #666;
    display: flex;
    align-items: center;
    border: 1px solid #dddddd;
    border-radius: 8rpx;
    margin: 20rpx 0;
    .cell-more {
        height: 30px;
        line-height: 30px;
        flex-grow: 1;
    }
    text {
        color: #007aff;
        min-width: 200rpx;
        text-align: center;
    }
}

.uni-tip-group-button {
    margin-top: 10px;
    display: flex;
}

.uni-tip-button {
    width: 100%;
    text-align: center;
    font-size: 14px;
    color: #3b4144;
    &.action {
        color: #007aff;
    }
}
.list-cell {
    display: flex;
    align-items: baseline;
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
        align-self: baseline;
        font-size: $font-lg;
        color: $font-color-light;
        margin-left: 10upx;
        flex: 1;
        text-align: right;
    }
    .cell-tit {
        font-size: $font-base + 2upx;
        color: $font-color-dark;
        margin-right: 10upx;
    }
    .tximg {
        width: 100rpx;
        height: 100rpx;
        vertical-align: middle;
        border-radius: 50%;
    }
    .cell-tip {
        font-size: $font-base;
        color: $font-color-light;
    }
    switch {
        transform: translateX(16upx) scale(0.84);
    }
}
.uni-popup {
    z-index: 998;
}
</style>
