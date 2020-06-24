<template>
    <view class="content">
        <view class="list-cell b-b">
            <text class="cell-tit">活动名称</text>
            <input class="cell-more input" type="text" placeholder="请输入" v-model="discount.title"/>
        </view>
        <view class="list-cell b-b">
            <text class="cell-tit">开始时间</text>
            <picker-time :time="discount.begintime" class="cell-more input" @change="timestrart"></picker-time>
        </view>
        <view class="list-cell b-b">
            <text class="cell-tit">结束时间</text>
            <picker-time :time="discount.endtime" class="cell-more input" @change="timeend"></picker-time>
        </view>
        <view class="list-cell b-b" @click="activities">
            <text class="cell-tit">活动范围</text>
            <text class="cell-more input">{{discount.userange ? (discount.userange == 1 ? '部分商品' : '全部商品') : '未设置'}}</text>
        </view>
        <view class="list-cell b-b" @click="shopproduct" v-if="discount.userange == 1">
            <text class="cell-tit">选择商品</text>
            <text class="cell-more input yticon icon-you">已选择{{pros.length}}个</text>
        </view>
        <view>
            <view class="discount">活动内容</view>
            <view class="give" v-for="(param, index) in discount.saleparamstype2" :key="index">
                <view>
                    <image src="../../static/timedel.png" mode="" class="delimg" @click="delParam(index)"></image>
                </view>
                <view class="discountcon">
                    第<input class="mg" type="number" maxlength="8" @input="num($event,index)" v-model="param.index"/>件,
                    <input class="mg" type="digit" @input="validate($event, index)" maxlength="3" @ v-model="param.cdiscount"/>折
                </view>
            </view>
            <view class="give" @click="addParam">
                <view>
                    <image src="../../static/timeadd.png" mode="" class="delimg"></image>
                    <text class="add">添加</text>
                </view>
            </view>
        </view>
        <view class="discounttip">
			<text>{{tip}}</text>
		</view>
        <view class="footer"><text class="submit" @click="submit">确定</text></view>
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
            saleId: 0,
            cguid: 0,
            discount: {
                title: '',
                begintime: '',
                endtime: '',
                userange: '',
                saleparamstype2: []
            },
            pros: [],
            tip: ''
        };
    },
    onLoad(option) {
        this.cguid = uni.getStorageSync("companyguid");
        option.saleId && (this.saleId = option.saleId);
        if (this.saleId != 0) {
        	this.detail();
        } else {
            const date = new Date();
            let year, month, day, hour;
            year = date.getFullYear();
            month = date.getMonth();
            day = date.getDate();
            hour = date.getHours();
            this.discount.begintime = year + '-' + (month + 1) + '-' + day  + ' ' + hour + ':00:00';
            this.discount.endtime = year + '-' + (month + 1) + '-' + day + ' ' + hour + ':00:00';
        }
        this.$ajax.get('sale/getsetsalelimitrebatetip', {}).then(res => {
        	let data = res.data.result.data;
        	this.tip = data.tips;
        });
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    methods: {
        validate(e, index) {
            let val = e.detail.value;
            if (val < 1 || val >= 10) {
                this.$api.msg('折扣请控制在1-10之间');
                this.discount.saleparamstype2[index].cdiscount = '';
            }
        },
		num(e,index){
			let num = e.detail.value.replace(".", "");
			console.log(e.detail.value)
			this.discount.saleparamstype2[index].index = num;
			this.$forceUpdate();
		},
        detail() {
            this.$ajax.get('sale/editsaleactivity', {cguid: this.cguid, saleid: this.saleId}).then(res => {
            	let data = res.data.result.data;
            	this.discount = data;
                if (this.discount.userange == 1) {
                    this.pros = this.discount.saleproductids.split(',');
                }
            });
        },
        activities(){
            let _this = this;
            uni.showActionSheet({
                itemList: ['全部商品', '部分商品'],
                success: function(res) {
                    if(res.tapIndex == 0){
                        _this.discount.userange = 3;
                    }
                    if (res.tapIndex == 1) {
                        _this.discount.userange = 1;
                    }
                }
            });
        },
        shopproduct(){
            let _this = this;
            let productids = this.changeProductIds();
            let url = '';
            if (this.pros.length == 0) {
                url = '/pages/search/shopproductsearch';
            } else {
                url = '/pages/search/shopproduct'
            }
            uni.navigateTo({
                url: url + '?productids=' + productids
            });
        },
        delParam(index) {
            this.discount.saleparamstype2.splice(index, 1);  
        },
        addParam() {
            this.discount.saleparamstype2.push([]);
        },
        editData(data) {
            this.pros = data.productids;
        },
        changeProductIds() {
            let productids = '';
            this.pros.forEach(id => {
            	productids += id + ',';
            });
            productids = productids.substring(0, productids.length - 1);
            return productids;
        },
        timeend(e) {
            console.log(e.time);
            this.discount.endtime = e.time
        },
        timestrart(e) {
            this.discount.begintime = e.time
            console.log(e.time);
        },
        submit() {
            if (this.discount.title.length == 0) {
                this.$api.msg('标题不能为空');
                return;
            }
            if (this.discount.userange != 3 && this.changeProductIds().length == 0) {
                this.$api.msg('请选择活动商品');
                return;
            }
            let state = 0;
            let rebateparams = '';
            this.discount.saleparamstype2.forEach(data => {
                if (data.index != null && data.cdiscount != null && data.index != '' && data.cdiscount != '') {
                    rebateparams += data.index + '_' + data.cdiscount + ',';
                    if (data.index == 0 || data.cdiscount == 0) {
                        state = 1;
                        return;
                    }
                } else {
                    state = 2;
                    return;
                }
            });
            if (state == 1) {
                this.$api.msg('活动内容不能为0');
                return;
            } else if (state == 2) {
                this.$api.msg('活动内容不能为空');
                return;
            }
            rebateparams = rebateparams.substring(0, rebateparams.length - 1);
            let data = {
            	cguid: this.cguid,
            	title: this.discount.title,
                begintime: this.discount.begintime,
                endtime: this.discount.endtime,
                userange: this.discount.userange,
                rebateparams: rebateparams,
                productids: this.changeProductIds()
            };
            if (this.saleId != 0) {
                data.saleid = this.saleId;
            }
            console.log(data);
            uni.showLoading({
mask : true
})
            this.$ajax.get('sale/setsalelimitrebate', data).then(res => {
                uni.hideLoading();
                if (res.data.code == 0) {
                    this.$api.msg(`保存成功`);
                    this.$api.prePage().list('');
                    setTimeout(()=>{
                        uni.navigateBack()
                    }, 800)
                } else {
                    this.$api.msg(res.data.code + ":" + res.data.msg);
					
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
.discount{
    margin-top: 10rpx;
    background: #FFFFFF;
    padding: 20rpx 30rpx;
}
.discounttip{
    margin-top: 10rpx;
    font-size: 28rpx;
    padding: 20rpx 30rpx;
}
.give{
    padding: 20rpx 30rpx;
    display: flex;
    align-items: center;
    background: #FFFFFF;
    .delimg{
        width: 50rpx;
        height: 50rpx;
        display: inline-block;
        vertical-align: middle;
    }
    .add{
        margin-left: 24rpx;
        display: inline-block;
        vertical-align: middle;
    }
    .discountcon{
        flex-grow: 1;
        margin:0 16rpx;
        vertical-align: middle;
        display: flex;
        align-items: center;
        .mg{
            flex-grow: 1;
            border: 1px solid #DDDDDD;
            border-radius: 6rpx;
            margin:0 16rpx;
            padding: 8rpx;
            height:auto;
        }
    }
    .givecon{
        flex-grow: 1;
        margin:0 16rpx;
        border: 1px solid #DDDDDD;
        border-radius: 16rpx;
        .giveitem{
            padding: 20rpx;
            font-size: 28rpx;
            display: flex;
            align-items: center;
            position: relative;
            .title{
                width: 100rpx;
                max-width: 100rpx;
                min-width: 100rpx;
            }
            .mg{
                flex-grow: 1;
                margin-left: 12rpx;
                padding: 8rpx;
                height:auto;
            }
            &.b-b{
                border-bottom: 1px solid #DDDDDD;
            }
            .icon-you:after{
                margin-top: -16rpx;
            }
        }
        
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
