<template>
    <view class="container">
        <view class="heading">{{data.companyname}}</view>
        <view class="shop">
            <image :src="data.url" mode="aspectFit"></image>
            <view class="con">
                <view class="title">{{data.name}}</view>
                <view class="tip">{{data.allattributeshow}}</view>
                <view class="price">
                    {{data.price}}
                    <text>{{data.number}}</text>
                </view>
            </view>
        </view>
        <view class="total">
            <text>合计</text>
            <text class="price">{{data.total_price}}</text>
        </view>
        <view class="list-cell b-b m-t">
            <text class="cell-tit">预定时间</text>
            <picker-time :time="time" class="cell-more input" @change="timestrart"></picker-time>
        </view>
        <view class="list-cell b-b">
            <text class="cell-tit">买家留言</text>
            <input class="cell-more input" type="text" placeholder="选填" v-model="message" maxlength=50 />
        </view>
        <view class="footer"><text class="submit" @click="submit">提交预定</text></view>
    </view>
</template>

<script>
import pickerTime from '@/components/picker-time/picker-time';
export default {
    components: {
        pickerTime
    },
    data() {
        return {
            data:{},
            time: '',
            number:1,
            keywords:'',
            productid:0,
            picid:0,
            companyid:0,
            message:''
        };
    },
    onBackPress(){
        this.$api.ovPage()
    },
    onLoad(op) {
        this.productid = op.productid;
        this.number = op.number;
        this.keywords = op.keywords;
        this.picid = op.picid;
        this.companyid = op.companyid;
        this.load();
    },
    methods: {
        load(){
            let data = {
                productid : this.productid,
                number : this.number,
                keywords : this.keywords,
            }
            this.$ajax.get('com/reservationCheckout', data).then(res => {
                if(res.data.code == 0){
                    this.data = res.data.result.data
                }
            });
        },
        timestrart(it){
            this.time = it.time;
        },
        submit(){
            if(this.time != ''){
                let data = {
                    product : '[{number:'+ this.number +',productid:'+ this.productid +',allattribute:'+ this.keywords +',picid:'+ this.picid +',companyid:'+ this.companyid +'}]',
                    notes : this.message,
                    pickuptime : this.time,
                }
                this.$ajax.get('com/doReservation', data).then(res => {
                    if(res.data.code == 0){
                        this.$api.msg("预定成功");
                    }else{
                        this.$api.msg("预定失败");
                    }
                    setTimeout(function() {
                        uni.navigateBack();
                    }, 1000);
                });
            }else{
                this.$api.msg("请选择预定时间")
            }
        }
    }
};
</script>

<style lang="scss">
page {
    background: $page-color-base;
}
.heading{
    padding: 20rpx 30rpx;
    font-size: 30rpx;
    background: #FFF;
    border-top: 1rpx solid #DDD;
}
.shop{
    border-top: 1rpx solid #DDD;
    display: flex;
    align-items: center;
    background: #FFF;
    padding: 20rpx 30rpx;
    image{
        width: 120rpx;
        min-width: 120rpx;
        height: 160rpx;
        margin-right: 20rpx;
    }
    .con{
        flex-grow: 1;
        font-size: 28rpx;
        .tip{
            color: $font-color-light;
            margin: 10rpx 0;
        }
        .price{
            color: $base-color;
            font-size: 30rpx;
            text{
                float: right;
                font-size: 28rpx;
                color: $font-color-light;
            }
        }
    }
}
.total{
    padding: 20rpx 30rpx;
    font-size: 30rpx;
    background: #FFF;
    border-top: 1rpx solid #DDD;
    .price{
        float: right;
        color: $base-color;
    }
}
.list-cell {
    display: flex;
    align-items: center;
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
        align-self: center;
        font-size: $font-lg;
        color: $font-color-light;
        margin-left: 10upx;
        &.input {
            flex-grow: 1;
        }
    }
    .cell-tit {
        font-size: $font-base + 2upx;
        color: $font-color-dark;
        margin-right: 10upx;
        min-width: 160rpx;
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
    switch {
        transform: translateX(16upx) scale(0.84);
    }
}
</style>
