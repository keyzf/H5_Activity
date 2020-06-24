<template>
    <view class="content">
        <view class="robtip">
            该备注买家看不见
        </view>
        <view class="skin">
        	<view class="">
        		<textarea class="input" v-model="shopnotes" placeholder="请输入备注"/>
        	</view>
        </view>
        <view class="footer">
        	<text class="submit" @click="submit">保存</text>
        </view>
    </view>
</template>
<script>
    export default {
        data() {
            return {
                ordernumber: '',
                shopnotes: ''
            }
        },
        onLoad(option) {
            this.ordernumber = option.ordernumber;
            this.getShopnotes();
        },
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
        },
        methods: {
            // 获取订单备注
            getShopnotes() {
                this.$ajax.get('com/getShopnotes', {ordernumber: this.ordernumber}).then(res => {
                    console.log(res);
                    if (res.data.code == 0) {
                        this.shopnotes = res.data.result.data.shopnotes || '';
                    } else {
                        this.$api.msg(res.data.msg);
                    }
                });
            },
            // 保存备注
            submit() {
                this.$ajax.get('com/updateShopnotes', {ordernumber: this.ordernumber, shopnotes: this.shopnotes}).then(res => {
                    console.log(res);
                    if (res.data.code == 0) {
                        this.$api.msg('备注更新成功');
                        this.$api.prePage().updateRemaker(this.shopnotes);
                        setTimeout(function() {
                            uni.navigateBack();
                        }, 800)
                    } else {
                        this.$api.msg(res.data.msg)
                    }
                });
            }
        }
    }
</script>
<style lang="scss">
page {
	background: $page-color-base;
}
.content {
	border-top: 1px solid #dddddd;
	padding-bottom: 100rpx;
}
.robtip{
    font-size: 24rpx;
    padding: 20rpx $page-row-spacing;
    color: $base-color;
}
.skin {
    padding: 20rpx 30rpx;
    background: #ffffff;
    margin-bottom: 20rpx;
    .input{
        width: 100%;
    }
}

</style>