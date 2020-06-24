<template>
    <view class="content">
        <view>
            <radio-group @change="radioChange">
                <view class="radioitem">
                    <label class="radio">
                        <radio :value="'1'" :checked="freight.kind==1"/>
                        <text>无条件包邮</text>
                    </label>
                </view>
                <view class="radioitem">
                    <label class="radio">
                        <radio :value="'2'"  :checked="freight.kind==2"/>
                        <view>
                            <view>满额包邮</view>
                            <view class="consumption">
                                <text>首单消费满</text>
                                <input type="number" maxlength="6" v-model="freight.type1freepost"/>
                                元包邮
                            </view>
                            <view class="consumption">
                                <text>非首单消费满</text>
                                <input type="number" maxlength="6" v-model="freight.type2freepost"/>
                                元包邮
                            </view>
                        </view>
                    </label>
                </view>
                <view class="radioitem">
                    <label class="radio">
                        <radio :value="'3'"  :checked="freight.kind==3"/>
                        <text>暂不包邮</text>
                    </label>
                </view>
            </radio-group>
        </view>
        <view class="footer"><text class="submit" @click="save">提交</text></view>
    </view>
</template>

<script>
export default {
    data() {
        return {
			
			freight:{
				kind:'',
				type1freepost:'',
				type2freepost:''
			}
		};
    },
	onLoad(){
		this.cguid = uni.getStorageSync('companyguid'); //店铺id
		this.$ajax.get("sale/salefreight",{cguid:this.cguid}).then(res => {
			if(res.data.code == 0){
				this.freight = res.data.result.data;
			}else{
				this.$api.msg(res.data.msg);
			}
		});
	},
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    methods: {
        radioChange: function(evt) {
            console.log(evt.detail);
			this.freight.kind = evt.detail.value;
			if(evt.detail.value != 2){
				this.freight.type1freepost = '';
				this.freight.type2freepost = '';
			}
        },
		save(){
			if(this.check() ){
				
                uni.showLoading({
					mask : true
				})
				this.$ajax.get("sale/setsalefreighttype",{
						cguid:this.cguid,
						kind:this.freight.kind,
						type1freepost:this.freight.type1freepost,
						type2freepost:this.freight.type2freepost
					}).then(res => {
                        uni.hideLoading()
						this.$api.msg(res.data.msg);
						if(res.data.code == 0){
							uni.navigateBack();
						}else{
							
						}
					});
			}
		},
		check(){
			let msg = '';
			let mark = true;
			if(mark && this.freight.kind == ''){
				msg = "请选择邮费类型";
				mark = false;
			}
			if(mark && this.freight.kind == 2 && this.freight.type1freepost == ''){
				msg = "请输入首单运费";
				mark = false;
			}
			if(mark && this.freight.kind == 2 && this.freight.type2freepost == ''){
				msg = "请输入非首单运费";
				mark = false;
			}
			if (!mark) {
				this.$api.msg(msg);
			}
			return mark;
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
.radioitem{
    border-bottom: 1px solid #dddddd;
    padding: 20rpx 30rpx;
    background: #FFFFFF;
    .radio{
       display: flex;
       align-items: center;
    }
    .consumption{
        display: flex;
        align-items: center;
        text{
            width: 260rpx;
            max-width: 260rpx;
            min-width: 260rpx;
        }
        input{
            border: 1px solid #dddddd;
            height: auto;
            padding: 6rpx;
            width: 160rpx;
            max-width: 160rpx;
            min-width: 160rpx;
            margin: 10rpx;
        }
    }
}
</style>
