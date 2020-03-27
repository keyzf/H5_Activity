<template>
    <view class="uni-steps">
        <view class="uni-steps-items" :class="'uni-steps-' + direction">
            <view class="uni-steps-item" v-for="(item, index) in steps" :key="index" :class="[item.status ? 'uni-steps-' + item.status : active > 0 ? '' : 'uni-steps-finish']">
                <view class="uni-steps-item-title-container" :style="{ color: item.status === 'process' ? activeColor : '' }">
                    <view class="uni-steps-item-title">{{ item.title }}</view>
                    <view class="uni-steps-item-msg" v-if="item.yy">
                        <text>{{ item.yy }}</text>
                    </view>
                    <block v-if="item.tk != undefined">
                        <view class="uni-steps-item-msg">
                            <text>{{ item.tk }}</text>
                        </view>
                        <view class="uni-steps-item-msg">
                            <text>{{ item.ms }}</text>
                        </view>
                    </block>
                    <block v-show="item.img != undefined">
                        <view class="uni-steps-item-msg">
                            <image :src="img.url" @click="previewImg(numb, item.img)" v-for="(img, numb) in item.img" :key="numb"></image>
                        </view>
                    </block>
                    <view class="uni-steps-item-desc" v-if="item.desc">
                        <text>{{ item.desc }}</text>
                    </view>
                    <block v-if="item.btn != undefined">
                        <view class="btns">
                            <text class="btn" v-for="(items, inex) in item.btn" :key="inex" @click="open(items)">{{ items.btnstr }}</text>
                        </view>
                    </block>
                </view>
                <view class="uni-steps-item-circle-container">
                    <view class="uni-steps-item-circle" v-if="item.status !== 'process'" :style="{ backgroundColor: item.status == 'finish' || index == 0 ? activeColor : '' }"></view>
                    <view v-else class="uni-steps-item-circle" :style="{ backgroundColor: activeColor }"></view>
                </view>
                <view class="uni-steps-item-line" v-if="index !== steps.length - 1" :style="{ backgroundColor: item.status === 'finish' ? activeColor : '' }"></view>
            </view>
        </view>
    </view>
</template>

<script>
import uniIcon from '../uni-icon/uni-icon.vue';
export default {
    name: 'uni-steps',
    components: {
        uniIcon
    },
    props: {
        direction: {
            //排列方向 row column
            type: String,
            default: 'row'
        },
        activeColor: {
            //激活状态颜色
            type: String,
            default: '#EE3847'
        },
        active: {
            //当前步骤
            type: [Number, String],
            default: 0
        },
        data: Array //数据
    },
    data() {
        return {};
    },
    computed: {
        steps() {
            let steps = [];
            this.data.forEach((item, index) => {
                let step = {};
                step.title = item.title;
                step.lx = item.lx;
                step.yy = item.yy;
                step.tk = item.tk;
                step.ms = item.ms;
                step.img = item.img;
                step.desc = item.desc;
                step.btn = item.btn;
                step.status = this.getStatus(index + 1);
                steps.push(step);
            });
            return steps;
        }
    },
    methods: {
        getStatus(index) {
            if (index < Number(this.active)) {
                return 'finish';
            } else if (index === Number(this.active)) {
                return 'process';
            }
            return '';
        },
        open(e) {
            this.$emit('change', {
                title: e
            });
        },
        previewImg(index, imgs) {
            let urls = [];
            imgs.forEach(img => {
                urls.push(img.url);
            });
            uni.previewImage({
                urls: urls,
                current: index
            });
        }
    }
};
</script>

<style lang="scss">
$steps-line-color: #ebedf0;
$steps-text-color: #969799;
$steps-title-size: 28upx;
$steps-desc-size: 24upx;
$steps-text-finish-color: #333333;
$steps-bg-color: #ffffff;
.uni-steps {
    border-top: 1px solid #dddddd;
}
.uni-steps-item-title {
    font-size: 34rpx;
    line-height: 50rpx;
    font-weight: 600;
}
.uni-steps-item-msg {
    font-size: 28rpx;
    line-height: 40rpx;
    image {
        width: 180rpx;
        height: 180rpx;
        display: inline-block;
        margin-right: 10rpx;
    }
}
.btns {
    text-align: right;
    margin: 12rpx 0;
    .btn {
        display: inline-block;
        padding: 6rpx 24rpx;
        border: 1px solid #dddddd;
        margin-left: 30rpx;
        border-radius: 10rpx;
        font-size: 24rpx;
    }
}
.uni-steps {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;

    &-items {
        position: relative;
        display: flex;
        flex-direction: row;
        margin: 10px;
        box-sizing: border-box;
        overflow: hidden;

        &.uni-steps-column {
            margin: 10px 0;
            padding-left: 31px;
            flex-direction: column;

            .uni-steps-item {
                &:after {
                    content: ' ';
                    position: absolute;
                    height: 1px;
                    width: 100%;
                    bottom: 9px;
                    left: 0;
                    background-color: #ebedf0;
                    transform: scaleY(0.5);
                }

                &:last-child {
                    position: relative;

                    &:after {
                        height: 0px;
                    }

                    .uni-steps-item-title-container {
                        text-align: left;
                    }

                    .uni-steps-item-circle-container {
                        left: -17px;
                        right: auto;
                    }
                }

                &-title-container {
                    transform: none;
                    display: block;
                    line-height: 36upx;
                }

                &-title {
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                }

                &-desc {
                    white-space: normal;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    overflow: hidden;
                }

                &-circle-container {
                    left: -17px;
                    top: -1px;
                    bottom: auto;
                    padding: 8px 0px;
                    z-index: 1;
                }

                &-line {
                    height: 100%;
                    width: 1px;
                    left: -15px;
                    top: -1px;
                    bottom: auto;
                }

                // &.uni-steps-process {
                // 	.uni-steps-item-circle-container {
                // 		bottom: auto;
                // 		left: -21px;
                // 	}
                // }
            }
        }
    }

    &-item {
        flex: 1;
        position: relative;
        padding-bottom: 30rpx;
        padding-right: 30rpx;

        &-title-container {
            text-align: left;
            margin-left: 3px;
            display: inline-block;
            transform: translateX(-50%);
            color: $steps-text-color;
        }

        &-title {
            font-size: $steps-title-size;
        }

        &-desc {
            font-size: $steps-desc-size;
        }

        &:first-child {
            .uni-steps-item-title-container {
                transform: none;
                margin-left: 0;
            }
        }

        &:last-child {
            position: absolute;
            right: 0;

            .uni-steps-item-title-container {
                transform: none;
                text-align: right;
            }

            .uni-steps-item-circle-container {
                left: auto;
                right: -8px;
            }
        }

        &-circle-container {
            position: absolute;
            bottom: 8px;
            left: -8px;
            padding: 0 8px;
            background-color: $steps-bg-color;
            z-index: 1;
        }

        &-circle {
            width: 5px;
            height: 5px;
            background-color: $steps-text-color;
            border-radius: 50%;
        }

        &-line {
            background-color: $steps-line-color;
            position: absolute;
            bottom: 10px;
            left: 0;
            width: 100%;
            height: 1px;
        }

        &.uni-steps-finish {
            .uni-steps-item-title-container {
                color: $steps-text-finish-color;
            }
        }

        // &.uni-steps-process {
        // 	.uni-steps-item-circle-container {
        // 		bottom: 3px;
        // 		display: flex;
        // 	}
        // }
    }
}
</style>
