<template>
    <view class="content">
        <view class="robtip" @click="toptip">
            {{tip.title}}
        </view>
        <view class="robbtn">
            <radio-group @change="radioChange">
                <label class="radio">
                    <radio value="0" :checked="type == 0" :disabled="buylimitid != 0 || iskingapply == 1"/>
                    <text>店铺抢购</text>
                </label>
                <label class="radio">
                    <radio value="1" :checked="type == 1" :disabled="buylimitid != 0 || isplatapply == 1"/>
                    <text>平台抢购</text>
                </label>
            </radio-group>
        </view>
        
        <view class="list-cell b-b">
            <text class="cell-tit">活动名称</text>
            <input class="cell-more input" type="text" placeholder="请输入" v-model="rob.title"/>
        </view>
        <view class="list-cell b-b" v-show="type == 1">
            <text class="cell-tit">抢购日期</text>
            <picker mode="selector" :value="platindex" :range="platrange"  class="cell-more input" @change="datetime">
                <view class="uni-input">{{rob.buylimitdate != '' ? rob.buylimitdate : "请选择抢购日期"}}</view>
            </picker>
        </view>
        <view class="list-cell b-b" v-show="type == 0">
            <text class="cell-tit">开始时间</text>
            <picker-time :time="rob.buylimitstarttime" class="cell-more input" @change="timestrart"></picker-time>
        </view>
        <view class="list-cell b-b" v-show="type == 0">
            <text class="cell-tit">结束时间</text>
            <picker-time :time="rob.buylimitendtime" class="cell-more input" @change="timeend"></picker-time>
        </view>
        <view class="list-cell b-b" @click="shopproduct">
            <text class="cell-tit">选择商品</text>
            <text class="cell-more input yticon icon-you">{{rob.name ? rob.name : '请选择商品'}}</text>
        </view>
        <view class="list-cell b-b m-t">
            <text class="cell-tit">抢购价格</text>
            <input class="cell-more input" type="number" maxlength="8" placeholder="商品的抢购价" v-model="rob.buylimitprice"/>
        </view>
        <view class="list-cell b-b">
            <text class="cell-tit">抢购数量</text>
            <input class="cell-more input" type="number" maxlength="8" @input="num($event,1)" placeholder="可抢购的总数" v-model="rob.buylimitstock"/>
        </view>
        <view class="list-cell b-b">
            <text class="cell-tit">每人限购</text>
            <input class="cell-more input" type="number" maxlength="8" @input="num($event,2)" placeholder="每人可抢购的数量" v-model="rob.buytoplimit"/>
        </view>
        <view class="footer"><text class="submit" @click="submit">确定</text></view>
        <uni-popup ref="toptip" type="center">
            <view class="uni-tip">
                <view class="uni-tip-title">帮助</view>
                <text class="input">
                    {{tip.detail}}
                </text>
                <view class="uni-tip-group-button" @click="gbtoptip">
                    <view class="uni-tip-button">确定</view>
                </view>
            </view>
        </uni-popup>
    </view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import pickerTime from '@/components/picker-time/picker-time';
export default {
    components: {
        uniPopup,
        pickerTime
    },
    data() {
        return {
			
            cguid: 0,
            tip: {
                title: '',
                detail: ''
            },
            rob: {
                buylimitstarttime: '',
                buylimitendtime: '',
                buylimitprice: '',
                buylimitstock: '',
                buytoplimit: '',
                skuid: 0,
                buylimitdate: '',
            },
            buylimitid: 0,
            type: 0,
            iskingapply: 0,
            isplatapply: 0,
            platrange: [],
            platindex: 0
        };
    },
    onLoad(options) {
        this.cguid = uni.getStorageSync("companyguid");
        this.getTip();
        if (options.buylimitid) {
            this.buylimitid = options.buylimitid;
            this.type = options.type;
            this.detail();
        } 
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    methods: {
		num(e,index){
			let num = e.detail.value.replace(".", "");
			if(index == 1){
				this.rob.buylimitstock = num
			}else if(index == 2){
				this.rob.buytoplimit = num
			}
		},
        bindPickerChange: function(e) {
            this.platindex = e.target.value
        },
        getTip() {
            this.$ajax.get('buylimit/addauth', {}).then(res => {
                if (res.data.code == 0) {
                    let data = res.data.result.data;
                    this.tip.title = data.definitiontips;
                    this.tip.detail = data.definitiondetail;
                    this.iskingapply = data.iskingapply;
                    this.isplatapply = data.isplatapply;
                    this.platrange = data.platdatelist
                } else {
                    this.$api.msg(res.data.code + ":" + res.data.msg);
                }
            });
        },
        detail() {
            let url = this.type == 0 ? 'sale/editbuylimit' : 'buylimit/editapply';
            let data = {
                buylimitid: this.type == 0 ? this.buylimitid : '',
                applyid: this.type == 0 ? '' : this.buylimitid,
                cguid: this.type == 0 ? '' : this.cguid
            }
            this.$ajax.get(url, data).then(res => {
                if (res.data.code == 0) {
                    let data = res.data.result.data;
                    this.rob = data;
                } else {
                    this.$api.msg(res.data.code + ":" + res.data.msg);
                }
            });
        },
        submit(){
            if (this.rob.title == null || this.rob.title.length == 0) {
                this.$api.msg('标题不能为空');
                return;
            }
            if (this.rob.buylimitprice == null || this.rob.buylimitprice.length == 0) {
                this.$api.msg('请输入价格');
                return;
            }
            if (this.rob.buylimitstock == null || this.rob.buylimitstock.length == 0) {
                this.$api.msg('请输入数量');
                return;
            }
            if (this.rob.buytoplimit == null || this.rob.buytoplimit.length == 0) {
                this.$api.msg('请输入限购数量');
                return;
            }
            if (this.rob.skuid == 0) {
                this.$api.msg('请选择商品');
                return;
            }
		
			
            let data = {
            	cguid: this.cguid,
            	title: this.rob.title,
                buylimitstarttime: this.type == 0 ? this.rob.buylimitstarttime : '',
                buylimitendtime: this.type == 0 ? this.rob.buylimitendtime : '',
                buylimitprice: this.rob.buylimitprice,
                buylimitstock: this.rob.buylimitstock,
                buytoplimit: this.rob.buytoplimit,
                skuid: this.rob.skuid,
                buylimitdate: this.type == 0 ? '' : this.rob.buylimitdate,
                applytype: this.type == 0 ? '' : this.type,
                applyid: this.buylimitid ? this.buylimitid : '',
                buylimitid: this.buylimitid ? this.buylimitid : ''
            };
            console.log(data);
            let url = this.type == 0 ? 'sale/addbuylimit' : 'buylimit/saveapply';
            uni.showLoading({
				mask : true
			})
            this.$ajax.get(url, data).then(res => {
                uni.hideLoading();
                console.log(res);
                if (res.data.code == 0) {
                    this.$api.msg('保存成功');
                    this.$api.prePage().tabCurrentIndex = this.type;
                    this.$api.prePage().list(0);
                    setTimeout(()=>{
                        uni.navigateBack()
                    }, 800)
                } else {
					
                    this.$api.msg(res.data.msg);
                }
            });
        },
        toptip(){
            this.$refs.toptip.open();
        },
        gbtoptip(){
            this.$refs.toptip.close();
        },
        shopproduct(){
            uni.$once('rob_select_product', (data) => {
            	this.rob.attributeshow = data.attributeshow;
                this.rob.name = data.name;
                this.rob.url = data.url;
                this.rob.skuid = data.skuid;
            	this.$forceUpdate();
            });
            uni.navigateTo({
                url: '/pages/promotion/rob_select_product'
            });
        },
        timeend(e) {
            console.log(e.time);
            this.rob.buylimitendtime = e.time
        },
        timestrart(e) {
            this.rob.buylimitstarttime = e.time
            console.log(e.time);
        },
        // 平台抢购 日期选择
        datetime(e) {
			console.log(e.detail.value);
            this.platindex = e.detail.value;
            this.rob.buylimitdate = this.platrange[this.platindex];
        },
        radioChange(e) {
            this.type = e.detail.value;
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
.robbtn{
    padding: 20upx $page-row-spacing;
    background: #fff;
    border-bottom: 1px solid #dddddd;
    font-size: 28rpx;
    .radio{
        margin-right: 20rpx;
    }
    radio {
        transform: translateX(0upx) scale(0.8);
    }
}
.robtip{
    font-size: 24rpx;
    padding: 20rpx $page-row-spacing;
    color: $base-color;
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
/deep/.uni-popup__wrapper-box{
    border-radius: 20rpx;
}
.uni-tip {
    background: #fff;
    box-sizing: border-box;
    .uni-tip-title {
        text-align: center;
        font-weight: bold;
        font-size: 16px;
        color: #333;
    }
    
    
    
    .uni-tip-group-button {
        margin-top: 10px;
    }
    
    .uni-tip-button {
        text-align: center;
        font-size: 14px;
        color: $base-color;
    }
    .input {
        padding: 12rpx;
        font-size: 28rpx;
        color: #666;
        border-bottom: 1px solid #dddddd;
        display: block;
        height: auto;
    }
}


</style>