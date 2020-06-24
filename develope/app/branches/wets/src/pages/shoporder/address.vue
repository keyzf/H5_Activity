<template>
	<view class="content b-t">
        <empty v-if="addressList.length === 0"></empty>
		<view class="list b-b" v-for="(item, index) in addressList" :key="index" @click="checkAddress(item)">
			<view class="wrapper">
				<view class="address-box">
					<text v-if="item.isDefault == 1" class="tag">默认</text>
					<text class="address">{{item.address}}</text>
				</view>
				<view class="u-box">
					<text class="name">{{item.name}}</text>
					<text class="mobile">{{item.tel}}</text>
				</view>
                <view class="u-box">
                	<text class="name">{{item.remark}}</text>
                </view>
			</view>
			<text class="yticon icon-bianji" @click.stop="addAddress('edit', item.id)"></text>
		</view>
		<button class="add-btn" @click="addAddress('add', 0)">新增地址</button>
	</view>
</template>

<script>
    import empty from "@/components/empty";
	export default {
        components: {empty},
		data() {
			return {
				source: 0,
				addressList: [],
                cguid: uni.getStorageSync('companyguid'),
                refundcode: '',
                refundstate: 0
			}
		},
		onLoad(option){
            this.refundcode = option.refundcode;
            this.refundstate = option.refundstate;
			this.getAddressList();
		},
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
        },
		methods: {
			// 获取地址列表
			getAddressList() {
				this.$ajax.get('com/getRefundAddress', {cguid: this.cguid}).then(res => {
					console.log(res);
					if (res.data.code == 0) {
						this.addressList = res.data.result.data;
					} else {
						this.$api.msg('系统出错,请稍后再试');
					}
				});
			},
			//选择地址
			checkAddress(item){
                let _this = this;
                uni.showModal({
                    title: '提示',
                    content: '同意退货并提交退货地址？',
                    success: function(res) {
                        if (res.confirm) {
                            _this.$ajax.get('com/agreeRefund', {refundcode: _this.refundcode, addressid: item.id, state: _this.refundstate}).then(res => {
                                console.log(res);
                                if (res.data.code == 0) {
                                    _this.$api.prePage().getRefundFlowList();
                                    uni.navigateBack();
                                } else {
                                    _this.$api.msg('提交失败');
                                }
                            });
                        }
                    }
                })
			},
			addAddress(type, addressid){
				uni.navigateTo({
					url: '/pages/shoporder/addressManage?type=' + type + '&addressid=' + addressid
				})
			}
		}
	}
</script>

<style lang='scss'>
	page{
		padding-bottom: 120upx;
	}
	.content{
		position: relative;
	}
	.list{
		display: flex;
		align-items: center;
		padding: 20upx 30upx;;
		background: #fff;
		position: relative;
	}
	.wrapper{
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.address-box{
		display: flex;
		align-items: center;
		.tag{
			font-size: 24upx;
			color: $base-color;
			margin-right: 10upx;
			background: #fffafb;
			border: 1px solid #ffb4c7;
			border-radius: 4upx;
			padding: 4upx 10upx;
			line-height: 1;
		}
		.address{
			font-size: 30upx;
			color: $font-color-dark;
		}
	}
	.u-box{
		font-size: 28upx;
		color: $font-color-light;
		margin-top: 16upx;
		.name{
			margin-right: 30upx;
		}
	}
	.icon-bianji{
		display: flex;
		align-items: center;
		height: 80upx;
		font-size: 40upx;
		color: $font-color-light;
		padding-left: 30upx;
	}
	
	.add-btn{
		position: fixed;
		left: 30upx;
		right: 30upx;
		bottom: 16upx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		font-size: 32upx;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);		
	}
</style>
