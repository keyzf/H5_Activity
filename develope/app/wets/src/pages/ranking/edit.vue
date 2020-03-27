<template>
    <view>
        <view class="settled-item">
            <view class="labers">商品名称</view>
            <view class="con"><input type="text" placeholder="请输入名称" maxlength="20" v-model="name"/></view>
        </view>
        <view class="photos">
            <view class="titles">上传图片</view>
            <view class="photos-list">
                <view v-show="pics != ''" @click="previewImg(0)">
                    <image :src="pics" mode=""></image>
                </view>
                <view class="add" @click="uploadImg()"></view>
            </view>
        </view>
        <!-- 底部 -->
        <view class="footer">
            <text class="submit" @click="submit">提交</text>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
			submitMark: true,
			name: '',
            pics: '',
            state: true
		};
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    methods: {
        submit() {
            if (!this.state) return;
            this.state = false;
            if (this.name.trim().length == 0) {
                this.$api.msg('商品名称不能为空');
                return;
            }
            if (this.pics.trim().length == 0) {
                this.$api.msg('请上传商品图片');
                return;
            }
            let data = {
                productname: this.name,
                picurls: [{
                    picurl: this.pics
                }]
            }
            this.$api.prePage().changeProduct(data);
            this.$api.msg('添加成功');
            setTimeout(function() {
                uni.navigateBack();
            }, 800);
		},
        validataParam() {
            let state = true;
            if (this.name == '') {
                this.$api.msg('商品名称不能为空');
                state = false;
            }
            if (this.pics == '' && state) {
                this.$api.msg('商品图片不能为空');
                state = false;
            }
            return state;
        },
        // 上传图片
        uploadImg() {
            let _this = this;
            uni.chooseImage({
                count: 1,
                sourceType: ['album'],
                success: res => {
                    if (res.tempFiles[0].size > 1 * 1024 * 1024) {
                        _this.$api.msg('请将图片大小控制在1MB内');
                        return;
                    } else {
                        uni.showLoading({
                            title: '上传中...'
                        })
                        uni.uploadFile({
                            url: _this.$api_url + 'wxservicenumber/getPicUrl',
                            filePath: res.tempFilePaths[0],
                            name: 'file',
                            success: img => {
                                let data = JSON.parse(img.data);
                                if (data.code == 0) {
                                    _this.pics = data.result.data.url;
                                } else {
                                    _this.$api.msg(data.msg);
                                }
                            },
                            fail: res => {
                                _this.$api.msg('上传失败，请重新选择！');
                            },
                            complete: res => {
                                uni.hideLoading();
                            }
                        });
                    }
                }
            });
        },
        // 预览图片
        previewImg(index) {
            let array = [this.pics];
            uni.previewImage({
                current: index,
                urls: array
            });
        },
        // 删除图片
        deleteImg(index) {
            this.pics = '';
            this.$forceUpdate();
        }
    }
};
</script>

<style lang="scss">
page {
    background: $page-color-base;
}
.settled-item {
    display: flex;
    align-items: center;
    padding: 10px 15px;
    background: #fff;
    border-bottom: 1px solid #dddddd;
    font-size: 28rpx;
    .labers {
        min-width: 76px;
    }
    .con {
        flex-grow: 1;
        text-align: right;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        padding: 0 10px;
        input {
            text-align: right;
            width: 100%;
            line-height: 30px;
        }
        textarea {
            width: 100%;
            height: 100px;
            resize: none;
            padding: 6px 0;
        }
        img {
            width: 30px;
            height: 30px;
            border-radius: 50%;
        }
    }
    .zjt {
        margin-top: -1px;
        img {
            width: 10px;
            margin-right: -10px;
        }
    }
}
.photos {
    margin-top: 20rpx;
    background: #ffffff;
    padding: 20rpx 30upx;
    .titles {
        font-size: 28rpx;
    }
    .photos-list {
        display: flex;
        align-items: center;
        view {
            width: 160rpx;
            height: 160rpx;
            position: relative;
            margin: 20rpx;
            image {
                width: 160rpx;
                height: 160rpx;
            }
            text {
                position: absolute;
                top: 0;
                right: 0;
                z-index: 1;
            }
            &.add {
                border:1px solid #DDD;
                border-radius: 20rpx;
                background: url(../../static/upimg.png) no-repeat center;
                background-size: 80rpx 80rpx;
            }
        }
    }
}
.card {
    margin-bottom: 20rpx;
    background:#FFFFFF;
    padding:0 30rpx;
    border-top: 1px solid #e4e7ed;
    .card-title{
        font-size: 34rpx;
        font-weight: 600;
        padding: 30upx 0;
    }
    .card-option{
        border-top: 1px solid #e4e7ed;
        font-size: 28rpx;
        padding: 20upx 0;
        display: flex;
        align-items: center;
        justify-content:space-between;
    }
}
.footer {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 995;
    display: flex;
    align-items: center;
    width: 100%;
    height: 90upx;
    justify-content: space-between;
    font-size: 30upx;
    background-color: #fff;
    z-index: 998;
    color: $font-color-base;
    box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);
    .submit {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 750upx;
        height: 100%;
        color: #fff;
        font-size: 32upx;
        background-color: $base-color;
    }
}

</style>
