<template>
	<view class="content">
		<empty v-if="addressArray.length === 0"></empty>
		<view class="skin" v-for="(item, index) in addressArray" :key="index">
			<view class="skintitle">{{ item.address }}</view>
			<view class="movebtn">
				<text class="btn" @click="addressshop(item.addressid)">编辑</text>
				<text class="btn" @click="delAddress(item.addressid, index)">删除</text>
			</view>
		</view>
		<view class="footer" @click="addressshop('')"><text class="submit">新增地址</text></view>
	</view>
</template>
<script>
import empty from '@/components/empty';
export default {
	components: { empty },
	data() {
		return {
			addressArray: []
		};
	},
	onLoad() {
		this.cguid = uni.getStorageSync('companyguid'); //店铺id
	},
    onBackPress(){
        this.$api.ovPage()
    },
	onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
		this.$ajax.get('com/showcompanyselfaddress', { cguid: this.cguid, pagesize: 1000 }).then(res => {
			if (res.data.code == 0) {
				this.addressArray = res.data.result.data;
				console.log(this.addressArray.length);
				if(this.addressArray.length > 0){
					this.$api.prePage().shopInfo.isSelfAddress = 1;
				}
			}
		});
	},
	methods: {
		addressshop(addressid) {
			uni.navigateTo({
				url: '/pages/establishment/addressshop?addressid=' + addressid
			});
		},
		delAddress(addressid, index) {
			let _this = this;
			uni.showModal({
			    title: '',
			    content: '确定删除该收货地址吗？',
			    success: function (res) {
			        if (res.confirm) {
			            _this.$ajax.get('com/delcompanyselfaddress', { addressid: addressid }).then(res => {
			            	_this.$api.msg(res.data.msg);
			            	if (res.data.code == 0) {
			            		_this.addressArray.splice(_this.index, 1);
								if(_this.addressArray.length == 0){
									_this.$api.prePage().shopInfo.isSelfAddress = 0;
								}
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
.skin {
	padding: 20rpx 30rpx;
	background: #ffffff;
	margin-bottom: 20rpx;

	.movebtn {
		border-top: 1px solid #dddddd;
		padding-top: 10rpx;
		text-align: right;
		margin-top: 10rpx;
		.btn {
			display: inline;
			padding: 4rpx 26rpx;
			margin: 6rpx 0 6rpx 26rpx;
			border: 1px solid #dddddd;
			border-radius: 20rpx;
			font-size: 28rpx;
		}
	}
}
.uni-tip {
    padding: 15px;
    width: 300px;
    background: #fff;
    box-sizing: border-box;
    border-radius: 10px;
}

.uni-tip-title {
    text-align: center;
    font-weight: bold;
    font-size: 16px;
    color: #333;
}

.uni-tip-content {
    padding: 10rpx;
    font-size: 28rpx;
    color: #666;
    display: flex;
    align-items: center;
    border: 1px solid #DDDDDD;
    border-radius:8rpx ;
    margin: 20rpx 0;
    .cell-more {
        height: 30px;
        line-height: 30px;
        flex-grow: 1;
    }
    text{
        color: #007aff;
    }
}

.uni-tip-group-button {
    margin-top: 10px;
    display: flex;
}

.uni-tip-button {
    width: 100%;
    text-align: center;
    font-size: 14px;
    color: #3b4144;
    &.action{
        color:#007aff;
    }
}
</style>
