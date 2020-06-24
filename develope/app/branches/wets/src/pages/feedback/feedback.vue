<template>
    <view>
        <view class="item">
            <view class="title">
                <text class="z">错发的商品</text>
                <text class="tip" @click="commodity">选择商品</text>
            </view>
            <view class="shop">
                <view class="option">
                    <image src="../../static/add.png" mode="aspectFit"></image>
                    <view class="con">
                        <view class="tips">名字名字</view>
                        <view class="number">*1</view>
                    </view>
                </view>
                <view class="option">
                    <image src="../../static/add.png" mode="aspectFit"></image>
                    <view class="con">
                        <view class="tips">名字名字</view>
                        <view class="number">*1</view>
                    </view>
                </view>
            </view>
            <textarea value="" placeholder="问题描述(选填)" />
            <view class="imgs">
                <view class="tips">上传图片(最多3张)</view>
                <view class="list">
                    <view class="list-item"><image src="../../static/user-bg.jpg" mode="aspectFit"></image></view>
                    <view class="list-item"><image src="../../static/upimg.png" mode="aspectFit"></image></view>
                </view>
            </view>
        </view>
        <view class="item">
            <view class="title">
                <text class="z">错发的商品</text>
                <text class="tip">选择商品</text>
            </view>
            <view class="shop">
                <view class="option">
                    <image src="../../static/add.png" mode="aspectFit"></image>
                    <view class="con">
                        <view class="tips">名字名字</view>
                        <view class="number">*1</view>
                    </view>
                </view>
                <view class="option">
                    <image src="../../static/add.png" mode="aspectFit"></image>
                    <view class="con">
                        <view class="tips">名字名字</view>
                        <view class="number">*1</view>
                    </view>
                </view>
            </view>
            <textarea value="" placeholder="问题描述(选填)" />
            <view class="imgs">
                <view class="tips">上传图片(最多3张)</view>
                <view class="list">
                    <view class="list-item"><image src="../../static/user-bg.jpg" mode="aspectFit"></image></view>
                    <view class="list-item"><image src="../../static/upimg.png" mode="aspectFit"></image></view>
                </view>
            </view>
        </view>
        <view class="tel">
            <text>联系方式</text>
            <input type="text" value="" placeholder="请输入联系方式" />
        </view>
        <view class="btn">提交</view>
    </view>
</template>

<script>
export default {
    data() {
        return {};
    },
    methods:{
        commodity(){
            uni.navigateTo({
                url:'/pages/feedback/commodity'
            })
        }
    }
};
</script>

<style lang="scss">
page {
    background: $page-color-base;
}
.item {
    margin: 20rpx 0;
    background: #fff;
    .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20rpx;
        .z {
            font-size: 32rpx;
        }
        .tip {
            font-size: 28rpx;
        }
    }
    .shop {
        border-top: 1px solid #f1f1f1;
        .option {
            border-bottom: 1px solid #f1f1f1;
            display: flex;
            align-items: center;
            padding: 20rpx 40rpx;
            image {
                min-width: 160rpx;
                height: 160rpx;
                width: 160rpx;
                border-radius: 10rpx;
                margin-right: 10rpx;
            }
            .con {
                flex-grow: 1;
                .tips {
                    height: 120rpx;
                    overflow: hidden;
                    line-height: 40rpx;
                    font-size: 32rpx;
                }
                .number {
                    font-size: 28rpx;
                    line-height: 40rpx;
                    text-align: right;
                }
            }
        }
    }
    textarea {
        width: 100%;
        border: 0;
        margin: 20rpx;
        padding: 20rpx;
        height: 160rpx;
    }
    .imgs {
        border-top: 1px solid #f1f1f1;
        padding: 20rpx;
        .tips {
            font-size: 32rpx;
        }
        .list {
            display: flex;
            align-items: center;
            padding-top: 20rpx;
            .list-item {
                image {
                    height: 160rpx;
                    width: 160rpx;
                    border-radius: 10rpx;
                }
                margin-right: 20rpx;
            }
        }
    }
}
.tel {
    background: #fff;
    display: flex;
    align-items: center;
    padding: 20rpx;
    margin-bottom: 100rpx;
    text {
        font-size: 32rpx;
        margin-right: 20rpx;
    }
    input {
        background: #fff;
        flex-grow: 1;
        height: 50rpx;
        min-height: 50rpx;
        line-height: 50rpx;
        font-size: 32rpx;
    }
}
.btn{
    text-align: center;
    background: $base-color;
    color: #FFF;
    line-height: 100rpx;
    font-size: 32rpx;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
}
</style>
