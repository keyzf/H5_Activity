<template>
    <view class="content">
		<!-- 空白页 -->
		<empty v-if="couponList.length === 0"></empty>
        <view class="coupon-item" v-for="(coupon, index) in couponList" :key="index" @click="edit(coupon.id)" @longpress="delCoupon(coupon.id,coupon.state,index)">
            <view class="con">
                <view class="left" :class="coupon.state==0?'':'x'">
                    <text class="price">{{coupon.discounts}}</text>
                    <text>{{coupon.limit}}</text>
                </view>
                <view class="right" :class="coupon.state==0?'':'x'">
                    <view class="title"><text class="bq">{{coupon.userangeMsg}}</text>{{coupon.title}}</view>
                    <view class="time">{{coupon.validtime}}<text class="tips x">{{coupon.remainMsg}}</text></view>
                </view>
				<text v-if="coupon.state==0" class="coupon-invalid"></text>
				<text v-if="coupon.state==-2" class="looting"></text>
            </view>
        </view>
		<uni-load-more :status="loadingType"></uni-load-more>
        <view class="footer" @click="add">
        	<text class="submit">添加优惠券</text>
        </view>
    </view>
</template>

<script>
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import empty from '@/components/empty';
export default {
	components: {
		uniLoadMore,
		empty
	},
    data() {
        return {
			couponList : [],
			cguid: 0,
			pagesize: 10,
			loadingType: 'more',
			lastid:''
		};
    },
	onLoad() {
		this.cguid = uni.getStorageSync("companyguid");
		this.list(0);
	},
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
	//下拉刷新
	onPullDownRefresh() {
		this.lastid = '';
		this.list(0);
	},
	onReachBottom() {
		// 获取优惠券列表
		if(this.loadingType == "noMore"){
			return;
		}
		let length = this.couponList.length;
		this.lastid = length > 0 ? this.couponList[length - 1].id : 0;
		this.list(1);
	},
    methods: {
        add() {
            uni.navigateTo({
                url: '/pages/promotion/addcoupon'
            });
        },
		list(load_type) {
			this.$ajax.get('sale/getcouponlist', {cguid: this.cguid, pagesize: this.pagesize, lastid: this.lastid}).then(res => {
				console.log(res.data);
				if (res.data.code == 0) {
					let data = res.data.result.data;
					if(load_type == 0){
						this.couponList = data;
						uni.stopPullDownRefresh();
					}else if(load_type == 1){
						this.couponList = this.couponList.concat(data);
					}
					this.loadingType = data.length == this.pagesize ? 'more' : 'noMore'
				} else {
					uni.stopPullDownRefresh();
					this.$api.msg('系统出错,请稍后再试');
				}
			});
		},
		edit(id) {
			uni.navigateTo({
			    url: '/pages/promotion/addcoupon?couponId=' + id
			});
		},
		delCoupon(couponid,state,index){
			let _this = this;
			let content;
			if(state == 0){
				content = "确定删除此优惠券吗？";
			}else{
				content = "确定废除此优惠券吗？";
			}
			uni.showModal({
			    title: '',
			    content: content,
			    success: function (res) {
			        if (res.confirm) {
			            _this.$ajax.get("sale/delcoupon",{cguid:_this.cguid,couponid:couponid}).then(res => {
							_this.$api.msg(res.data.msg);
							if(res.data.code == 0 && state == 0){
								_this.couponList.splice(index, 1);
							}else if(res.data.code == 0 && state == 1){
								_this.couponList[index].state = 0;
								_this.$forceUpdate();
							}
						});
			        } 
			    }
			});
		}
    }
};
</script>

<style lang="scss">
page {
	background: $page-color-base;
}
.content {
    border-top: 1px solid #dddddd;
	padding-bottom: 100rpx;
}
.coupon-item {
    margin: 20upx 24upx;
    background: #fff;
    border-radius: 20rpx;
    overflow: hidden;
    .con {
        display: flex;
        align-items: stretch;
        position: relative;
		.coupon-invalid{
            position: absolute;
            top: 20rpx;
            right: 60rpx;
            z-index: 3;
            width: 120rpx;
            height: 120rpx;
            background: url(../../static/coupon-invalid.png) no-repeat center;
            background-size: 100% 100%;
        }
        .looting{
            position: absolute;
            top: 20rpx;
            right: 60rpx;
            z-index: 3;
            width: 120rpx;
            height: 120rpx;
            background: url(../../static/looting.png) no-repeat center;
            background-size: 100% 100%;
        }
    }
    .left {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 200rpx;
        min-width: 200rpx;
        overflow: hidden;
        color: #ffffff;
        padding: 20rpx 30upx;
        text-align: center;
        background: #dddddd;
        height:200rpx;
        &.x {
            background: #fa436a;
        }
    }
    .title {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		position: absolute;
		top: 10rpx;
		left: 10rpx;
		right: 10rpx;
		font-size: 32rpx;
        color: $font-color-dark;
        margin-bottom: 10upx;
        
    }
    
    .time {
        font-size: 24upx;
        color: $font-color-light;
        line-height: 40rpx;
		flex-grow: 1;
    }
    .right {
        font-size: 26upx;
        color: $font-color-base;
        flex-grow: 1;
        padding: 0 30upx;
		display:flex;
		align-items:flex-end;
		position: relative;
        .bq{
            margin-right: 20rpx;
            display: inline-block;
            background: #dddddd;
            padding: 4rpx 10rpx;
            border-radius: 6rpx;
            color: #FFFFFF;
        }
        &.x{
            .bq{
                background: $base-color;
            }
        }
    }
    
    .price {
        font-size: 44upx;
        color: #ffffff;
    }
    .tips {
        font-size: 30upx;
        color: $font-color-light;
        &.x {
            color: #fa436a;
            float: right;
        }
    }
    .received{
        position: absolute;
        top: 0;
        right: 10rpx;
    }
}
</style>