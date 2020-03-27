<template>
    <view class="center">
        <view class="integral">
            <image class="bg" src="../../static/rankingbg.png" mode="aspectFit"></image>
            <view class="cen">
                <view class="title">当前积分</view>
                <view class="numb">{{resData.judge_criteria_sum}}</view>
            </view>
        </view>
        <view>
            <view class="integral-item">
                <view>销售总额*{{resData.xs_x}}</view>
                <text>+{{resData.judge_criteria_totalsale}}</text>
            </view>
            <view class="integral-item">
                <view>成交订单总数*{{resData.dd_x}}</view>
                <text>+{{resData.judge_criteria_order_number}}</text>
            </view>
            <view class="integral-item">
                <view>诚信度*{{resData.cx_x}}</view>
                <text>+{{resData.judge_criteria_integrity}}</text>
            </view>
            <view class="integral-item" v-if="resData.signupgroupid == 1">
                <view>扶贫影响力*{{resData.fp_x}}</view>
                <text>+{{resData.judge_criteria_attention}}</text>
            </view>
            <view class="integral-item">
                <view>店铺日平均PV*{{resData.pv_x}}</view>
                <text>+{{resData.judge_criteria_average_day_pv}}</text>
            </view>
            <view class="integral-item">
                <view>店铺日平均访问UV*{{resData.fuv_x}}</view>
                <text>+{{resData.judge_criteria_average_day_uv}}</text>
            </view>
            <view class="integral-item">
                <view>转发访问UV*{{resData.zuv_x}}</view>
                <text>+{{resData.judge_criteria_average_day_forward_uv}}</text>
            </view>
        </view>
        <view class="btns" @click="back">
            关闭
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                resData: {},
            };
        },
        onLoad() {
            let userinfo = uni.getStorageSync('userInfo') || '';
             if (userinfo.guid) {
                this.loginState = true;
            } else {
                this.loginState = false;
            }
            if (!this.loginState) {
                uni.navigateTo({
                    url: '/pages/public/login'
                });
                return false;
            }
            this.getScoreDetail();
        },
        methods: {
            getScoreDetail() {
                //tel:"17332956326","password":"e10adc3949ba59abbe56e057f20f883e"
                this.$ajax.get('helppoorcompetition2019/getScoreDetail', {
                    cguid: uni.getStorageSync("companyguid")
                }).then(res => {
                    if (res.data.code == 0) {
                        console.log(res.data.result)
                        let res_data = res.data.result.data;
                        if (res_data.signupgroupid == 1) { //扶贫
                            //销售总额*0.2+成交订单总数*0.2+诚信度*0.2+扶贫影响力*0.2+店铺日平均PV*0.05+店铺日平均访问UV*0.05+转发访问UV*0.1
                            res_data.xs_x = 0.2;
                            res_data.dd_x = 0.2;
                            res_data.cx_x = 0.2;
                            res_data.fp_x = 0.2;
                            res_data.pv_x = 0.05;
                            res_data.fuv_x = 0.05;
                            res_data.zuv_x = 0.1;

                        } else if (res_data.signupgroupid == 2 || res_data.signupgroupid == 3) { //标准 大学生
                            //销售总额*0.25+成交订单总数*0.25+诚信度*0.2+店铺日平均PV*0.05+店铺日平均访问UV*0.05+转发访问UV*0.2 
                            res_data.xs_x = 0.25;
                            res_data.dd_x = 0.25;
                            res_data.cx_x = 0.2;
                            res_data.pv_x = 0.05;
                            res_data.fuv_x = 0.05;
                            res_data.zuv_x = 0.2;
                        }
                        this.resData = res_data
                    }
                });
            },
            back() {
                uni.navigateBack({

                })
            }

        },
    };
</script>

<style lang="scss">
    .center {
        padding-bottom: 100rpx;
    }

    .integral {
        position: relative;

        .bg {
            width: 750rpx;
            height: 319rpx;
        }

        .cen {
            position: absolute;
            top: 60rpx;
            left: 0;
            right: 0;
            color: #FFF;
            text-align: center;

            .title {
                font-size: 40rpx;
                margin-bottom: 10rpx;
            }

            .numb {
                font-size: 70rpx;
            }
        }
    }

    .integral-item {
        margin: 0 30rpx;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #DDDDDD;
        padding: 18rpx 6rpx;
        font-size: 30rpx;

        text {
            flex-grow: 1;
            text-align: right;
        }
    }

    .btns {
        position: fixed;
        bottom: 0;
        left: 36rpx;
        right: 36rpx;
        font-size: 28rpx;
        line-height: 80rpx;
        border-radius: 10rpx;
        text-align: center;
        background: rgb(255, 126, 74);
        color: #FFF;
    }
</style>
