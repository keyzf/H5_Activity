<template>
    <view class="container">
        <view class="list-cell b-b m-t" @click="open">
            <text class="cell-tit">昵称</text>
            <text class="cell-more">{{data.nickname}}</text>
        </view>
        <view class="list-cell b-b">
            <text class="cell-tit">积分</text>
            <text class="cell-more">{{data.memberpoint}}</text>
        </view>
        <view class="list-cell b-b">
            <text class="cell-tit">星级</text>
            <view class="cell-more">
                <image :src="'../../static/vip' + data.memberlevel + '.png'" class="tximg" mode="aspectFill"></image>
            </view>
        </view>
        <view class="list-cell b-b">
            <text class="cell-tit">拼团成功数</text>
            <text class="cell-more">{{data.successamount}}</text>
        </view>
        <view class="list-cell b-b">
            <text class="cell-tit">拼团成功率</text>
            <text class="cell-more">{{data.successpercent}}</text>
        </view>
        <view class="list-cell b-b">
            <text class="cell-tit">拼团获利</text>
            <text class="cell-more">{{data.benefit}}</text>
        </view>
        <uni-popup ref="popup" type="center">
            <view class="uni-tip">
                <view class="uni-tip-title">请输入拼团昵称</view>
                <input class="input" type="text" value="" v-model="nickname" placeholder="请输入拼团昵称"/>
                <view class="uni-tip-group-button">
                    <view class="uni-tip-button" @click="saveNikeName">确定</view>
                </view>
            </view>
        </uni-popup>
    </view>
</template>
<script>
    import uniPopup from '@/components/uni-popup/uni-popup.vue';
    export default {
        components: {
            uniPopup
        },
        data() {
            return {
                data: {},
                nickname: ""
            };
        },
        onLoad(e) {
            this.getInformation();
        },
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
        },
        methods: {
            getInformation() {
                //http://api.holdsoft.cn/mall/
                this.$ajax.get("groupbuying/myInfo", {}).then(res => {
                    console.log(res);
                    if (res.data.code == 0) {
                        ///分类
                        this.data = res.data.result.data;
                    }
                });

            },
            open() {
                this.$refs.popup.open();
            },
            saveNikeName() {
                console.log(this.nickname)
                if (this.nickname == "") {
                    this.$api.msg("请输入昵称")
                    return;
                }
                this.$ajax.get("groupbuying/setNickname", {
                    nickname: this.nickname
                }).then(res => {
                    console.log(res);
                    if (res.data.code == 0) {
                        this.data.nickname = this.nickname
                        this.$refs.popup.close();
                    }else{
                        this.$api.msg(res.data.msg) 
                    }
                });
            },
        },
    };
</script>
<style lang="scss">
    page {
        background: $page-color-base;
    }

    /deep/ .uni-popup__wrapper-box {
        border-radius: 20rpx !important;
    }

    .uni-tip {
        background: #fff;
        box-sizing: border-box;
    }

    .uni-tip-title {
        text-align: center;
        font-weight: bold;
        font-size: 16px;
        color: #333;
    }

    .input {
        padding: 12rpx;
        font-size: 28rpx;
        color: #666;
        border-bottom: 2px solid #DB1A38;
        display: block;
        height: 80rpx;
    }

    .uni-tip-group-button {
        margin-top: 10px;
    }

    .uni-tip-button {
        text-align: center;
        font-size: 14px;
        color: $base-color;
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
        }

        .cell-tip {
            font-size: $font-base;
            color: $font-color-light;
        }
    }

    .uni-popup {
        z-index: 998;
    }
</style>
