<template>
	<view class="group">
		<view class="item" @click="goproduct">
		    <image class="shopimg" src="../../static/back-id.png" mode="aspectFit"></image>
		    <view class="introduce">
		        <view class="title">古龙香水什么的</view>
		        <view class="main">
		            <view class="con">
		                <view class="pcice">
                            <view class="news">距离结束 <text class="number"><countdown class="indeblock" time="56464"></countdown></text></view>
		                    <text class="new">$45</text><text class="old">2人拼已拼5件</text>
		                </view>
		            </view>
		            <view class="right">
		                <view class="btn">立即抢单</view>
		            </view>
		        </view>
		    </view>
		</view>
	</view>
</template>

<script>
    import countdown from '@/components/countdown/countdown.vue';
	export default {
        components: {
            countdown
        },
		data() {
			return {
				
			};
		},
        methods:{
            goproduct(){
                uni.navigateTo({
                    url:'/pages/grab/grab-product'
                })
            },
        }
	}
</script>

<style lang="scss">
    
.group{
    font-size: 28rpx;
    border-top:1px solid #f1f1f1;
    .item{
        display: flex;
        align-items: center;
        background: #FFF;
        border-radius: 10rpx;
        margin: 20rpx;
        padding: 20rpx;
        .shopimg{
            width: 220rpx;
            min-width: 220rpx;
            height: 220rpx;
            margin-right: 20rpx;
        }
        .introduce{
            flex-grow: 1;
            .title{
                font-size: 30rpx;
                line-height: 40rpx;
                height: 80rpx;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                font-weight: 600;
            }
            .progress{
                overflow: hidden;
                width: 50%;
                height: 8rpx;
                border: 1px solid #F43F3B;
                border-radius: 4rpx;
                view{
                    float: left;
                    display: inline-block;
                    height: 8rpx;
                    border-radius: 4rpx;
                    background: #F43F3B;
                    width: 20%;
                }
            }
            .main{
                display: flex;
                align-items: center;
                .con{
                    flex-grow: 1;
                    .news{
                        color: #969696;
                        .number{
                            color: #F43F3B;
                        }
                        .indeblock{
                            display: inline-block;
                            margin-left: 12rpx;
                        }
                    }
                    .pcice{
                        .new{
                            color: #F43F3B;
                            font-size: 34rpx;
                            font-weight: 600;
                        }
                        .old{
                            margin-left: 20rpx;
                            color: #969696;
                        }
                    }
                    .tip{
                        color: #969696;
                    }
                }
                .right{
                    min-width: 140rpx;
                    .title-img{
                        position: relative;
                        text-align: right;
                        .img{
                            width: 100rpx;
                            height: 100rpx;
                            border-radius: 50%;
                        }
                        .tip{
                            position: absolute;
                            right: 0;
                            bottom: 0;
                            width: 60rpx;
                            height: 60rpx;
                            border-radius: 50%;
                        }
                    }
                    .btn{
                        margin-top: 10rpx;
                        border-radius: 10rpx;
                        color: #FFF;
                        background: #F43F3B;
                        text-align: center;
                    }
                }
            }
        }
        
    }
}

</style>
