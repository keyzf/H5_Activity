<template>
    <view>
        <view class="pl-con" v-show="product.state == 1">
            <sunui-star
                :defaultStar="starConfig.defaultStar"
                :maxStar="starConfig.maxStar"
                :starSize="starConfig.starSize"
                :isTips="starConfig.isTips"
                :type="starConfig.type"
                @changeStar="changeStar"
                class="sunui-star"
            ></sunui-star>
            <view class="tip">觉得怎么样,给打个分吧</view>
            <!-- <view class="comment">
				<view>差评</view>
				<view>中评</view>
				<view class="x">好评</view>
			</view> -->
        </view>
        <view class="uni-textarea">
            <textarea placeholder-style="color:#dddddd" @linechange="checkde" v-model="content" placeholder="亲,在这家店消费还满意吗?" />
        </view>
        <view class="upimg">
            <view class="item" v-show="pics.length > 0" v-for="(item, index) in pics" :key="index">
                <image :src="item" mode="aspectFit"></image>
                <text class="del" @click="delPic(index)"></text>
            </view>
            <view class="item add" @click="uploadImg" v-show="pics.length < 9">
                <image src="../../static/upimg.png" mode="aspectFit"></image>
                <view>上传图片</view>
            </view>
        </view>
        <view class="redeo" v-show="product.state == 1">
            <label class="radio">
                <radio :checked="isfake" @click="nimingClick(isfake)" />匿名
            </label>
        </view>
        <!-- 底部 -->
        <view class="footer"><text class="submit" @click="submit">提交</text></view>
    </view>
</template>
<script>
import sunuiStar from '@/components/sunui-star/sunui-star.vue';
export default {
    components: {
        sunuiStar
    },
    data() {
        return {
            starConfig: {
                defaultStar: 5,
                maxStar: 5,
                starSize: '1.2em',
                isTips: true,
                type: 'love'
            },
            content: '',
            isfake: false,
            product: {
                url: '',
                state: 2
            },
            star: 5,
            pics: []
        };
    },
    onLoad(option) {
        this.product = JSON.parse(option.data);
    },
    onBackPress(){
        this.$api.ovPage()
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    methods: {
        // 提交表单
        submit() {
			if(this.content == ""){
				this.$api.msg("内容不可为空");
				return;
			}
            let url = this.product.state == 1 ? 'product/addcomment' : 'product/againaddcomment';
            this.$ajax
                .get(url, {
                    ordernum: this.product.ordernum,
                    skuid: this.product.skuid,
                    attributes: this.product.attributes,
                    content: this.content,
                    skutext: this.product.skutext,
                    pic: this.pics.length == 0 ? '' : this.pics.join(','),
                    isfake: this.isfake ? 1 : 0,
                    star: this.star
                })
                .then(res => {
                    console.log(res);
                    if (res.data.code == 0) {
                        this.$api.msg('评论成功');
                        this.$api.prePage().getOrderDetail();
                        setTimeout(function() {
                            uni.navigateBack();
                        }, 800);
                    } else {
                        this.$api.msg('评论失败');
                    }
                });
        },
        // 是否匿名
        nimingClick(state) {
            this.isfake = !state;
        },
        // 星星选择
        changeStar(e) {
            this.star = e.curStar;
        },
        checkde() {
            var hezce = '';
            this.content.split('\n').forEach(item => {
                hezce += item;
            });
            this.content = hezce;
        },
        // 上传图片
        uploadImg() {
            if (this.$wx.isWechat()) {
                this.$wx.upload(1).then(res => {
                    if (res.data.code == 0) {
                        let data = res.data.result.data;
                        this.pics.push(data.url);
                    } else {
                        this.$api.msg(res.data.msg);
                    }
                });
            }
        },
        // 删除图片
        delPic(index) {
            this.pics.splice(index, 1);
        }
    }
};
</script>
<style lang="scss" scoped>
.pl-con {
    padding: 30rpx 30rpx;
    border-top: 1px solid #dddddd;

    .tip {
        margin: 30rpx 0;
        font-size: 24rpx;
        color: #dadada;
        text-align: center;
    }
}

.comment {
    display: flex;
    justify-content: space-around;
    border-top: 1px solid #dddddd;
    padding: 20rpx 30rpx;
    view {
        border: 1px solid #dddddd;
        padding: 4rpx 26rpx;
        border-radius: 60rpx;
        font-size: 28rpx;

        &.x {
            color: #fa436a;
            border-color: #fa436a;
        }
    }
}
.redeo {
    padding: 20rpx 30rpx;
    margin-bottom: 90rpx;
}
.upimg{
    padding-left: 20rpx;
    .item{
        width: 200rpx;
        height: 200rpx;
        position: relative;
        display: inline-block;
        margin-right: 30rpx;
        border: 1px solid #DDDDDD;
        vertical-align: middle;
        image{
            width: 192rpx;
            height: 192rpx;
        }
        .del{
            width: 40rpx;
            height: 40rpx;
            background: url(../../static/imgdel.png) no-repeat center;
            background-size: 30rpx 30rpx;
            position: absolute;
            top: -20rpx;
            right: -20rpx;
        }
        &.add{
            text-align: center;
            font-size: 28rpx;
            image{
                width: 80rpx;
                height: 80rpx;
                margin-top: 40rpx;
            }
        }
    }
}
.uni-textarea {
    margin: 30rpx;
    border-top: 1px solid #dddddd;
    border-bottom: 1px solid #dddddd;
    padding: 12rpx;
    textarea {
        width: 100%;
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
