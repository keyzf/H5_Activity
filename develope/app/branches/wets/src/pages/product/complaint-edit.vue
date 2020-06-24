<template>
    <view class="content">
        <view class="tip" v-show="data.infringe.state == 1">{{ data.infringe.text }}</view>
        <view class="type" v-show="data.forbidden.state == 1" @click="forbiddenClick">
            <text>{{ data.forbidden.text }}</text>
            <view class="more yticon icon-you">{{ forbiddenText }}</view>
        </view>
        <view class="complaint">
            <text>投诉详情信息</text>
            <view class="input"><textarea v-model="complaintText" placeholder="请输入投诉信息(不少于50个字)" maxlength="200" /></view>
        </view>
        <view class="imgtitle">图片证据(最多4张)</view>
        <view class="imglist">
            <view class="item" v-for="(url, index) in complaintPics" :key="index">
                <image :src="url" mode="aspectFit" @click="previewImg(index)"></image>
                <text class="del" @click="delImg(index)"></text>
            </view>
            <view class="item add" v-show="complaintPics.length < 4" @click="uploadImg">
                <image src="../../static/upimg.png" mode="aspectFit"></image>
                <view>上传图片</view>
            </view>
        </view>
        <view class="tip">{{ data.picturetips }}</view>
        <view class="tel">
            <text>联系人</text>
            <input type="number" v-model="complaintTel"  placeholder="请输入手机号" maxlength="20"/>
        </view>
        <view class="tip">{{ data.teltips }}</view>
        <view class="fooster" @click="submit">
            提交
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            type: 0,
            cguid: '',
            data: {
                forbidden: {state: 0},
                infringe: {state: 0}
            },
            forbiddenText: '',
            complaintText: '',
            complaintTel: '',
            complaintPics: []
        };
    },
    onLoad(options) {
        uni.showLoading({
            title: '加载中...',
            mask: true
        })
        this.cguid = options.cguid;
        this.type = options.type;
        this.loadData();
    },
    onBackPress(){
        this.$api.ovPage()
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    methods: {
        async loadData() {
            this.$ajax.get('shophomepage/complainshow',{cguid: this.cguid, type:this.type}).then(res => {
            	uni.hideLoading();
                console.log(res);
                if(res.data.code == 0){
                    this.data=res.data.result.data;
            	} else {
                    this.$api.msg('获取内容失败');
                }
            });
        },
        // 违禁品选择
        forbiddenClick() {
            let _this = this;
            let itemList = [];
            this.data.forbidden.list.forEach(item => {
                itemList.push(item.content);
            });
            uni.showActionSheet({
                itemList: itemList,
                success: res => {
                    let index = res.tapIndex;
                    _this.forbiddenText = itemList[index];
                }
            })
        },
        // 上传图片
        uploadImg() {
            if (this.$wx.isWechat()) {
                this.$wx.upload(1).then(res => {
                    if (res.data.code == 0) {
                        let data = res.data.result.data;
                        this.complaintPics.push(data.url);
                    } else {
                        this.$api.msg('图片上传失败');
                    }
                });
            } else {
                //this.complaintPics.push('../../static/upimg.png');
            }
        },
        // 预览图片
        previewImg(index) {
            uni.previewImage({
                current: index,
                urls: this.complaintPics
            })
        },
        // 删除图片
        delImg(index) {
            this.complaintPics.splice(index, 1);
        },
        submit() {
            if (this.data.forbidden.state == 1 && this.forbiddenText.length == 0) {
                this.$api.msg('请选择禁售品类型');
                return;
            }
            if (this.complaintText.length == 0) {
                this.$api.msg('请填写详细信息');
                return;
            }
            if (this.complaintPics.length == 0 || this.complaintPics.length > 4) {
                this.$api.msg('请上传投诉证明图片');
                return;
            }
            if (this.complaintTel.length == 0) {
                this.$api.msg('请填写联系方式');
                return;
            }
            uni.showLoading({
                title: '提交中...',
                mask: true
            });
            this.$ajax.get('shophomepage/complainsubmit', {
                picurl: this.complaintPics.join(','),
                forbidden: this.forbiddenText,
                tel: this.complaintTel,
                detail: this.complaintText,
                type: this.type,
                cguid: this.cguid
            }).then(res => {
                uni.hideLoading();
                if (res.data.code == 0) {
                    this.$api.msg('提交成功');
                    setTimeout(function() {
                        uni.navigateBack();
                    }, 800);
                } else {
                    this.$api.msg(res.data.msg);
                }
            });
            
        }
    }
};
</script>

<style lang="scss">
page {
    background: $page-color-base;
}
.content{
    padding-bottom: 100rpx;
}
.type {
    padding: 20rpx 30rpx;
    background: #fff;
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    .more {
        flex-grow: 1;
        text-align: right;
    }
}
.complaint {
    padding: 20rpx 30rpx;
    display: flex;
    margin-bottom: 20rpx;
    background: #FFF;
    .input {
        margin-left: 10rpx;
        flex-grow: 1;
        textarea {
            width: 100%;
            height: 120rpx;
        }
    }
}
.imgtitle {
    padding: 20rpx 30rpx 0 30rpx;
    font-size: 32rpx;
    background: #fff;
}
.imglist {
    background: #fff;
    display: flex;
    padding: 20rpx 10rpx;
    .item {
        position: relative;
        width: 170rpx;
        height: 170rpx;
        border: 1px solid #ddd;
        margin-right: 20rpx;
        border-radius: 10rpx;
        image {
            width: 168rpx;
            height: 168rpx;
        }
        text {
            position: absolute;
            top: -20rpx;
            right: -20rpx;
            width: 40rpx;
            height: 40rpx;
            background: url(../../static/imgdel.png) no-repeat center;
            background-size: 30rpx 30rpx;
        }
        &.add {
            text-align: center;
            font-size: 24rpx;
            image {
                margin-top: 20rpx;
                width: 80rpx;
                height: 80rpx;
            }
        }
    }
}
.tel{
    padding: 20rpx 30rpx;
    background: #FFF;
    display: flex;
    align-items: center;
    input{
        flex-grow: 1;
        margin-left: 10rpx;
    }
}
.tip {
    padding: 20rpx 30rpx;
    font-size: 28rpx;
}
.fooster{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100rpx;
    line-height: 100rpx;
    text-align: center;
    font-size: 30rpx;
    background: rgb(238, 56, 71);
    color: #FFF;
}
</style>
