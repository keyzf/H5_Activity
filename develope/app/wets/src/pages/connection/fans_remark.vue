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
                cguid: 0,
                shopnotes: '',
                id: 0
            }
        },
        onLoad(option) {
            this.cguid = uni.getStorageSync("companyguid");
            this.id = option.id;
            this.detail();
        },
        onBackPress(){
            this.$api.ovPage()
        },
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
        },
        methods: {
            // 获取订单备注
            detail() {
                this.$ajax.get('com/getremark', {cguid: this.cguid, fansid: this.id}).then(res => {
                    console.log(res);
                    if (res.data.code == 0) {
                        this.shopnotes = res.data.result.data.shopnotes || '';
                    } else {
                        this.$api.msg('获取备注失败');
                    }
                });
            },
            // 保存备注
            submit() {
                uni.showLoading({
                    mask : true
                })
                this.$ajax.get('com/setremark', {cguid: this.cguid, fansid: this.id, shopnotes: this.shopnotes}).then(res => {
                    uni.hideLoading()
                    console.log(res);
                    if (res.data.code == 0) {
                        this.$api.prePage().list(0);
                        this.$api.msg('备注更新成功')
                        setTimeout(function() {
                            uni.navigateBack();
                        }, 800)
                    } else {
                        this.$api.msg('更新备注失败')
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