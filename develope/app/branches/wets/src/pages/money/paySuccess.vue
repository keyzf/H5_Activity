<template>
	<view class="content">
        <view class="main">
            <view class="tip">
                <text>支付成功</text>
            </view>
            <view class="btn">
                <navigator :url="'/pages/order/orderdetails?ordernum=' + ordernum" open-type="redirect" class="mix-btn">查看订单</navigator>
                <navigator url="/pages/index/index" open-type="switchTab" class="mix-btn hollow">返回首页</navigator>
            </view>
        </view>
        <view class="welfare">
            <view class="tip">
                您第1004名选购完福利
            </view>
            <text class="ydz">已点赞</text>
            <text>赞一个</text>
        </view>
        <view class="turntable">
            <image src="../../static/turntable.png" mode="aspectFit"></image>
        </view>
        
        <view class="lottery">
            <view class="title">
                选取福利有奖励
            </view>
            <view class="tip">
                领取奖励
            </view>
            <view class="list">
                <view class="item">
                    <view class="name">满60元立减6元</view>
                    <view class="tips">1张</view>
                    <text class="btn">选我</text>
                </view>
            </view>
            <view class="list">
                <view class="item x">
                    <view class="name">满60元立减6元</view>
                    <view class="tips">满60元即可使用</view>
                    <text class="btn">选我</text>
                </view>
            </view>
            <view class="list">
                <view class="item">
                    <view class="name">满60元立减6元</view>
                    <view class="tips">1张</view>
                    <text class="btn">选我</text>
                </view>
                <view class="item">
                    <view class="name">满60元立减6元</view>
                    <view class="tips">1张</view>
                    <text class="btn">选我</text>
                </view>
            </view>
            <view class="list">
                <view class="item x">
                    <view class="name">满60元立减6元</view>
                    <view class="tips">满60元即可使用</view>
                    <text class="btn">选我</text>
                </view>
            </view>
            <view class="list">
                <view class="item">
                    <view class="name">满60元立减6元</view>
                    <view class="tips">1张</view>
                    <text class="btn">选我</text>
                </view>
                <view class="item">
                    <view class="name">满60元立减6元</view>
                    <view class="tips">1张</view>
                    <text class="btn">选我</text>
                </view>
                <view class="item">
                    <view class="name">满60元立减6元</view>
                    <view class="tips">1张</view>
                    <text class="btn">选我</text>
                </view>
            </view>
        </view>
        <!-- 为您推荐 -->
        <view class="titles">
            <view>
                <image src="../../static/recommend.png" mode="aspectFit"></image>
                <text>为您推荐</text>
            </view>
        </view>
        <view class="goods-list">
            <view class="goods-item" v-for="(item, index) in guess" :key="index" @click="navToDetailPage(item)">
                <image v-if="item.isNewOnShelvesProduct == 1" class="label" :src="item.newOnShelvesProductIcon" mode="aspectFit"></image>
                <view class="image-wrapper">
                    <uimg :src="item.url"></uimg>
                    <view class="tip clamp"></view>
                </view>
                <view class="item-con">
                    <view class="title"><text v-if="item.presell" class="presell">{{item.presell}}</text>{{ item.name }}</view>
                    <view class="price-box clamp">
                        <text class="price">{{ item.price }}</text>
                        <text v-if="item.activitylist.length == 0">{{ item.sales }}</text>
                        <view v-else>
                            <text v-for="ite in item.activitylist" :key="ite.wholetext" :style="{color:ite.color,borderColor:ite.color}">{{ ite.wholetext }}</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        
	</view>
</template>

<script>
	export default {
		data() {
			return {
				ordernum: ''
			}
		},
		onLoad(option) {
			this.ordernum = option.ordernum;
		},
        onBackPress(){
            this.$api.ovPage()
        },
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
        }
	}
</script>

<style lang='scss'>
    page{
        background: #F5F5F5;
    }
    .main{
        background: linear-gradient(to left,#E8584B,#DD4D4E);
        padding: 50rpx 0;
        color: #FFF;
        .tip{
            font-size: 36rpx;
            text-align: center;
            font-weight: bold;
            text{
                background: url(../../static/orderd.png) no-repeat left center;
                background-size: 30rpx 30rpx;
                padding-left: 45rpx;
            }
        }
        .btn{
            margin-top: 40rpx;
            display: flex;
            align-items: center;
            justify-content: space-around;
            .mix-btn {
                font-size: 24rpx;
            	border: 1rpx solid #FFF;
                padding: 8rpx 30rpx;
                border-radius: 30rpx;
                    line-height: 1.6;
            }
        }
    }
    .turntable{
        background: #FFF;
        border-radius: 18rpx;
        margin: 20rpx;
        image{
            width: 100%;
            height: 200rpx;
        }
    }
    .titles {
        text-align: center;
        position: relative;
    
        &:after {
            position: absolute;
            left: 50%;
            top: 50%;
            -webkit-transform: translateX(-50%);
            transform: translateX(-50%);
            width: 150px;
            height: 0;
            content: '';
            border-bottom: 1px solid #ccc;
        }
        view {
            position: relative;
            z-index: 1;
            display: inline-block;
            font-size: 32rpx;
            background: #f5f5f5;
            padding: 0 8rpx;
            image {
                width: 40rpx;
                height: 40rpx;
                vertical-align: middle;
                margin-right: 8rpx;
            }
            text {
                vertical-align: middle;
            }
        }
    }
	.welfare{
        background: #FFF;
        border-radius: 18rpx;
        margin: -20rpx 20rpx 20rpx 20rpx;
        padding: 20rpx;
        display: flex;
        align-items: center;
        font-size: 28rpx;
        color: #333333;
        font-weight: bold;
        .tip{
            flex: 1;
        }
        text{
            background: url(../../static/dzb.png) no-repeat left 12rpx center #EE3847;
            background-size: 30rpx;
            border-radius: 30rpx;
            padding:10rpx 20rpx 10rpx 50rpx;
            color: #FFF;
            font-size: 24rpx;
            font-weight: 500;
            &.ydz{
                background: url(../../static/zdh.png) no-repeat left 12rpx center #F5F5F5;
                background-size: 30rpx;
                color: #DE4E4E;
            }
        }
    }
    .lottery{
        background: #FFF;
        border-radius: 18rpx;
        margin: 20rpx;
        padding: 20rpx;
        font-size: 24rpx;
        color: #969696;
        .title{
            text-align: center;
            font-size: 28rpx;
        }
        .tip{
            font-size: 32rpx;
            color: #EE3847;
            font-weight: bold;
            text-align: center;
            margin: 20rpx 0;
        }
        .list{
            display: flex;
            margin: 0 -10rpx;
            align-items: center;
            .item{
                flex: 1;
                margin: 10rpx;
                padding: 20rpx 0;
                border: 1rpx solid #DDDDDD;
                background: #f5f5f5;
                border-radius: 8rpx;
                text-align: center;
                .name{
                    font-size: 28rpx;
                    color: #333333;
                    margin: 20rpx 0;
                }
                .tips{
                    font-size: 28rpx;
                    color: #333;
                    font-weight: bold;
                }
                .btn{
                    background: linear-gradient(to right,#EE5A38,#EE3847);
                    color: #FFF;
                    display: inline-block;
                    padding: 8rpx 40rpx;
                    border-radius: 30rpx;
                    margin-top: 30rpx;
                }
                &.x{
                    border: 1rpx solid #EE3847;
                    background: #FEF3F3;
                    .name{
                        color: #EE3947;
                    }
                    .tips{
                       font-size: 24rpx;
                       color: #969696;
                        font-weight: inherit;
                    }
                    .btn{
                        background: url(../../static/zjt.png) no-repeat right center;
                        color: #EE3947;
                        padding-right: 30rpx;
                        background-size: 15rpx;
                        display: inline-block;
                        margin-top: 30rpx;
                        
                    }
                }
            }
        }
    }
</style>
