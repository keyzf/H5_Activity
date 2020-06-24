<template>
    <view class="content">
        <view class="list-cell b-b">
            <text class="cell-tit">活动名称</text>
            <input class="cell-more input" type="text" placeholder="请输入活动名称" v-model="coupon.title" />
        </view>
        <view class="list-cell b-b">
            <text class="cell-tit">开始时间</text>
            <picker class="cell-more input" mode="date" :value="coupon.begintime" :start="startDate" :end="endDate" @change="bindStartTimeChange">
                <view class="uni-input">{{coupon.begintime ? coupon.begintime : '请选择开始时间'}}</view>
            </picker>
        </view>
        <view class="list-cell b-b">
            <text class="cell-tit">结束时间</text>
            <picker class="cell-more input" mode="date" :value="coupon.endtime" :start="startDate" :end="endDate" @change="bindEndTimeChange">
                <view class="uni-input">{{coupon.endtime ? coupon.endtime : '请选择结束时间'}}</view>
            </picker>
        </view>
        <view class="list-cell b-b" @click="activities">
            <text class="cell-tit">活动范围</text>
            <text class="cell-more input">{{coupon.type ? (coupon.type == 2 ? '部分商品' : '全部商品') : '请选择活动范围'}}</text>
        </view>
        <view class="list-cell b-b" @click="shopproduct" v-if="coupon.type == 2">
            <text class="cell-tit">选择商品</text>
            <text class="cell-more input yticon icon-you">已选择{{pros.length}}个</text>
        </view>
        <view class="list-cell b-b m-t">
            <text class="cell-tit">券的库存</text>
            <input class="cell-more input" type="number" maxlength="8" @input="num($event,1)" placeholder="可被领取的总券数" v-model="coupon.number" />
        </view>
        <view class="list-cell b-b">
            <text class="cell-tit">每人限领</text>
            <input class="cell-more input" type="number" maxlength="8" @input="num($event,2)" placeholder="每人可领取的数量" v-model="coupon.maxnumlimit" />
        </view>
        <view class="list-cell b-b m-t">
            <text class="cell-tit">消费满</text>
            <input class="cell-more input" type="number" maxlength="6" placeholder="请输入金额" v-model="coupon.limitmoney"/>
            <text>元</text>
        </view>
        <view class="list-cell b-b">
            <text class="cell-tit">减</text>
            <input class="cell-more input" type="number" maxlength="6" placeholder="请输入金额" v-model="coupon.discounts"/>
            <text>元</text>
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
			
			couponid: 0,
			coupon: {
                title: '',
                begintime: '',
                endtime: '',
                type: '',
                limitmoney: '',
                discount: '',
                number: '',
                maxnumlimit: '',
            },
			cguid: 0,
            pros: []
        };
    },
    computed: {
        startDate() {
            return this.getDate('start');
        },
        endDate() {
            return this.getDate('end');
        }
    },
    onLoad(option) {
		this.cguid = uni.getStorageSync("companyguid");
		option.couponId && (this.couponid = option.couponId);
		if (this.couponid != 0) {
			this.detail();
		} else {
            let now = new Date();
            this.coupon.begintime = this.dateFormat('yyyy-MM-dd', now);
            this.coupon.endtime = this.dateFormat('yyyy-MM-dd', now);
        }
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    methods: {
		num(e,index){
			let num = e.detail.value.replace(".", "");
			if(index == 1){
				this.coupon.number = num
			}else if(index == 2){
				this.coupon.maxnumlimit = num
			}
		},
        dateFormat(fmt, date) {
            let ret;
            let opt = {
                "y+": date.getFullYear().toString(),        // 年
                "M+": (date.getMonth() + 1).toString(),     // 月
                "d+": date.getDate().toString(),            // 日
                "h+": date.getHours().toString(),           // 时
                "m+": date.getMinutes().toString(),         // 分
                "s+": date.getSeconds().toString(),         // 秒
                "q+": Math.floor((date.getMonth()+3)/3),    //季度   
                "S" : date.getMilliseconds()                //毫秒   
                // 有其他格式化字符需求可以继续添加，必须转化成字符串
            };
            for (let k in opt) {
                ret = new RegExp("(" + k + ")").exec(fmt);
                if (ret) {
                    fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
                };
            };
            return fmt;
        },
		detail() {
			this.$ajax.get('sale/editcoupon', {cguid: this.cguid, couponid: this.couponid}).then(res => {
				let data = res.data.result.data;
				this.coupon = data;
                if (this.coupon.type == 2) {
                    this.pros = this.coupon.saleproductids.split(',');
                }
			});
		},
        bindStartTimeChange: function(e) {
            this.coupon.begintime = e.target.value
        },
        bindEndTimeChange: function(e) {
            this.coupon.endtime = e.target.value
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
        changeProductIds() {
            let productids = '';
            this.pros.forEach(id => {
            	productids += id + ',';
            });
            productids = productids.substring(0, productids.length - 1);
            return productids;
        },
        getDate(type) {
            const date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();

            if (type === 'start') {
                year = year;
            } else if (type === 'end') {
                year = year + 2;
            }
            month = month > 9 ? month : '0' + month;;
            day = day > 9 ? day : '0' + day;
            return `${year}-${month}-${day}`;
        },
        activities() {
            let _this = this;
            uni.showActionSheet({
                itemList: ['全部商品', '部分商品'],
                success: function(res) {
                    if(res.tapIndex == 0){
                        _this.coupon.type = 4;
                    }
                    if (res.tapIndex == 1) {
                        _this.coupon.type = 2;
                    }
                }
            });
        },
        editData(data) {
            this.pros = data.productids;
        },
        submit() {
			
            if (this.coupon.title.length == 0) {
                this.$api.msg('请输入活动名称');
                return;
            }
            if (this.coupon.type != 4 && this.changeProductIds().length == 0) {
                this.$api.msg('请选择商品');
                return;
            }
            if (this.coupon.number.length == 0) {
                this.$api.msg('请输入券的库存');
                return;
            }
			if (this.coupon.maxnumlimit.length == 0) {
			    this.$api.msg('请输入每人可领取的数量');
			    return;
			}
            if (this.coupon.discounts == null || this.coupon.discounts.length == 0 || this.coupon.limitmoney.length == 0) {
                this.$api.msg('请输入金额');
                return;
            }
			
			
            let data = {
            	cguid: this.cguid,
            	title: this.coupon.title,
                begintime: this.coupon.begintime,
                endtime: this.coupon.endtime,
                type: this.coupon.type,
                limitmoney: this.coupon.limitmoney,
                discount: this.coupon.discounts,
                number: this.coupon.number,
                maxnumlimit: this.coupon.maxnumlimit,
                productids: this.changeProductIds()
            };
            if (this.couponid != 0) {
                data.couponid = this.couponid;
            }
            console.log(data);
            uni.showLoading({
				mask : true
			})
            this.$ajax.get('sale/createcoupon', data).then(res => {
            	uni.hideLoading();
            	console.log(res);
            	if (res.data.code == 0) {
            		this.$api.msg('保存成功');
                    this.$api.prePage().list('');
            		setTimeout(()=>{
            			uni.navigateBack()
            		}, 800)
            	} else {
            		this.$api.msg(res.data.msg);
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
