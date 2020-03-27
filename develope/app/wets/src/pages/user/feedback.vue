<template>
    <view>
        <view class="card">
              <textarea placeholder-style="color:#e4e7ed" maxlength="500" v-model="notic" placeholder="请输入您的问题反馈(500字以内)"/>
        </view>
        <view class="photos">
            <view class="titles">上传照片</view>
            <view class="photos-list">
                <view v-show="pics.length > 0" v-for="(item, index) in pics" :key="index" @click="previewImg(index)">
                    <text class="delimg del-btn yticon icon-fork" @click.stop="deleteImg(index)"></text>
                    <image :src="item" mode=""></image>
                </view>
                <view class="add" v-show="pics.length < 3" @click="uploadImg"></view>
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
			notic: '',
            pics: []
		};
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    methods: {
        submit() {
            if (this.notic.length == 0) {
                this.$api.msg('请输入反馈内容');
                return;
            }
			if(!this.submitMark){
				this.$api.msg('请稍后再试');
				return;
			}
			this.submitMark = false;
			this.$ajax.get('customerservice/customerfeedback', {
				content: this.notic,
				pic: this.pics.length == 0 ? '' : this.pics.join(',')
			}).then(res => {
				console.log(res);
				if (res.data.code == 0) {
					this.$api.msg('已收到您的宝贵意见');
					setTimeout(function() {
						uni.switchTab({
							url: '/pages/user/user'
						})
					}, 2000);
				} else {
					this.$api.msg('反馈提交失败');
					this.submitMark = true;
				}
			});
		},
        // 上传图片
        uploadImg() {
            if (this.$wx.isWechat()) {
                this.$wx.upload(1).then(res => {
                    if (res.data.code == 0) {
                        if (this.pics.length < 3 && res.data.result.data.url.length > 0) {
                            this.pics.push(res.data.result.data.url);
                        }
                    } else {
                        this.$api.msg(res.data.msg);
                    }
                });
            }
        },
        // 预览图片
        previewImg(index) {
            uni.previewImage({
                current: index,
                urls: this.pics
            });
        },
        // 删除图片
        deleteImg(index) {
            this.pics.splice(index, 1);
            this.$forceUpdate();
        }
    }
};
</script>

<style lang="scss">
page {
    background: $page-color-base;
}
uni-textarea{
    width: 100%;
    padding: 20rpx 0;
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
