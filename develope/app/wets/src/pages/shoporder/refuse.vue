<template>
    <view class="content">
        <view class="up">
			<view class="con">
				<textarea v-model="content" placeholder="请输入拒绝原因" />
			</view>
		</view>
		<view class="down">
			<view>上传图片(最多三张)</view>
			<view class="imglist">
				<view class="item" v-show="pics.length != 0" v-for="(item, index) in pics" :key="index">
					<img :src="item" @click="previewImg(index)">
                    <text class="del" @click="delImg(index)"></text>
				</view>
				<view class="item add" v-show="pics.length < 3" @click="uploadImg">
					<img src="../../static/upimg.png">
					<view>上传照片</view>
				</view>
			</view>
		</view>
		<view class="footer"><text class="submit" @click="submit">提交</text></view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            content: '',
            refundcode: '',
            pics: []
        };
    },
    onLoad(option) {
        this.refundcode = option.refundcode;
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    methods: {
        submit() {
            if (this.content.length == 0) {
                this.$api.msg('请输入拒绝原因');
                return;
            }
            this.$ajax.get('com/refuseRefund', {refundcode: this.refundcode, content: this.content, urls: this.pics.length == 0 ? '' : this.pics.join(',')}).then(res => {
                console.log(res);
                if (res.data.code == 0) {
                    this.$api.msg('提交成功');
                    this.$api.prePage().getRefundFlowList();
                    setTimeout(function() {
                        uni.navigateBack();
                    }, 800);
                } else {
                    this.$api.msg(res.data.msg);
                }
            });
        },
        // 上传图片
        uploadImg() {
            if (this.$wx.isWechat()) {
            	this.$wx.upload(1).then(res => {
            		let data = res.data.result.data;
            		if (res.data.code == 0) {
                        this.pics.push(data.url);
            		} else {
            			this.$api.msg('图片上传失败');
            		}
            	});
            }
        },
        // 删除图片
        delImg(index) {
            this.pics.splice(index, 1);
        },
        // 预览图片
        previewImg(index) {
            let _this = this;
            uni.previewImage({
                current: index,
                urls: _this.pics,
                success: res => {}
            });
        }
    }
};
</script>

<style lang="scss">
page {
    background: $page-color-base;
	font-size: 28rpx;
}
.content {
    border-top: 1px solid #dddddd;
}
.up{
	padding: 20rpx 30rpx;
	background: #FFFFFF;
	margin-bottom: 10rpx;
	textarea{
        width: 690rpx;
        height: 400rpx;
    }
}
.down{
	padding: 30rpx;
	background: #FFFFFF;
	.imglist{
		display: flex;
		text-align: center;
		padding: 20rpx 0;
		flex-wrap: wrap;
		.item{
			width:210rpx;
			height: 210rpx;
			border: 1px solid #dddddd;
			border-radius: 16rpx;
			margin:0 20rpx 20rpx 0;
			box-sizing: border-box;
            position: relative;
			img{
				width:210rpx;
				height: 210rpx;
			}
            .del{
                position: absolute;
                top: 0;
                right: 0;
                width: 40rpx;
                height: 40rpx;
                border-radius:50%;
                background: url(../../static/imgdel.png) no-repeat;
                background-size: 40rpx 40rpx;
                z-index: 1;
            }
			&.add{
				padding-top: 60rpx;
				img{
					width:80rpx;
					height: 80rpx;
				}
			}
		}
	}
}
</style>
