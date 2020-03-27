<template>
    <view class="conter">
        <view class="item">
            <view class="title">【套餐14】(1.60kg)450元(字体)</view>
            <view class="list">
                <view class="option">
                    <checkbox value="cb" checked="true" />
                    <image src="../../static/adds.png" mode="aspectFit"></image>
                    <view class="con">
                        <view class="tip">1.4福利但我</view>
                        <uni-number-box
                            class="step"
                            :min="1"
                            :max="2"
                            :value="1"
                            :isMin="1 === 1"
                            :isMax="false"
                            :index="1"
                            :zindex="1"
                            @eventChange="numberChange"
                            :disabled="true"
                        ></uni-number-box>
                    </view>
                </view>
            </view>
        </view>
        <view class="item">
            <view class="title">
                说了肯德基发生的拉上框架的离开时打了卡萨的脸孔就爱丽丝看到了萨克卢卡斯加的脸孔静安寺来得快了萨克就卢卡斯加登录开发商来看待加拉斯柯达弗兰卡塑料袋口就爱丽丝看到拉开始接单分拉开始接单浪费卡斯丹佛我就阿萨德离开家安生多了
            </view>
            <view class="list">
                <view class="option">
                    <checkbox value="cb" checked="true" />
                    <image src="../../static/adds.png" mode="aspectFit"></image>
                    <view class="con">
                        <view class="tip">1.4福利但我</view>
                        <uni-number-box
                            class="step"
                            :min="1"
                            :max="2"
                            :value="1"
                            :isMin="1 === 1"
                            :isMax="false"
                            :index="1"
                            :zindex="1"
                            @eventChange="numberChange"
                            :disabled="true"
                        ></uni-number-box>
                    </view>
                </view>
            </view>
        </view>
        <view class="btn">提交</view>
    </view>
</template>

<script>
import uniNumberBox from '@/components/uni-number-box.vue';
export default {
    components: {
        uniNumberBox
    },
    data() {
        return {};
    },
    methods: {
        numberChange() {}
    }
};
</script>

<style lang="scss">
page {
    background: $page-color-base;
}
.conter {
    border-top: 1px solid #f1f1f1;
    padding-bottom: 100rpx;
}
.item {
    background: #fff;
    border-top: 1px solid #f1f1f1;
    margin: 20rpx 0;
    .title {
        padding: 20rpx;
        font-size: 32rpx;
    }
    .list {
        border-top: 1px solid #f1f1f1;
        .option {
            padding: 30rpx;
            border-bottom: 1px solid #f1f1f1;
            display: flex;
            align-items: center;
            checkbox {
                min-width: 60rpx;
            }
            image {
                width: 160rpx;
                min-width: 160rpx;
                height: 160rpx;
                margin: 0 20rpx;
            }
            .con {
                flex-grow: 1;
                .tip {
                    height: 120rpx;
                    overflow: hidden;
                    line-height: 40rpx;
                    font-size: 28rpx;
                }
                .step {
                    font-size: 28rpx;
                    width: 100%;
                    justify-content: flex-end;
                }
            }
        }
    }
}
.btn {
    text-align: center;
    background: $base-color;
    color: #fff;
    line-height: 100rpx;
    font-size: 32rpx;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
}
</style>
