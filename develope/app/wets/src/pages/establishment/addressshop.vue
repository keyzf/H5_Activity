<template>
	<view class="content">
		<view class="skin">
			<picker class="skintitle" mode="multiSelector" @change="onConfirm" @columnchange="bindMultiPickerColumnChange" :value="oldMultiIndex" :range="multiArray">
				<view class="uni-input">{{ districtname == '' ? '省、市、区' : districtname }}</view>
			</picker>
			<view class="movebtn"><textarea class="input" @linechange="checkde" placeholder="请输入详细地址" v-model="address" /></view>
		</view>
		<view class="footer"><text class="submit" @click="saveAddress">保存</text></view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			addressid: '',
			address: '',
			districtid: '',
			districtname: '',
			list: [],
			multiArray: [[''], [''], ['']],
			oldMultiIndex: [0, 0, 0],
			newMultiIndex: [0, 0, 0],
			districts: uni.getStorageSync('districts')
		};
	},
	onLoad(option) {
		this.addressid = option.addressid;
		this.cguid = uni.getStorageSync('companyguid'); //店铺id
		if (this.districts != null && this.districts.length > 0) {
			this.editAddress();
		}else{
			uni.showLoading({
				title: '加载中',
				mask: true
			});
			this.$ajax.get('shoppingcart/getAllDistricts', { cguid: this.cguid, update: 0 }).then(res => {
				uni.hideLoading();
				if (res.data.code == 0) {
				    uni.setStorageSync('districts', res.data.result.data.districts);
				    this.districts = res.data.result.data.districts;
				    this.editAddress();
				} else {
				    this.$api.msg('获取地区列表失败');
				} 
			});
		}
	},
    onBackPress(){
        this.$api.ovPage()
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
	methods: {
		bindMultiPickerColumnChange: function(e) {
			this.newMultiIndex[e.detail.column] = e.detail.value;
			let data = [];
			switch (e.detail.column) {
				case 0: //拖动第1列
					this.districts[e.detail.value].subs.forEach((items, index) => {
						data.push(items.name);
					});
					this.multiArray[1] = data;
					let datas = [];
					if (this.districts[this.newMultiIndex[0]].subs[this.newMultiIndex[1]].subs.length > 0) {
						this.districts[this.newMultiIndex[0]].subs[this.newMultiIndex[1]].subs.forEach((items, index) => {
							datas.push(items.name);
						});
						this.multiArray[2] = datas;
					} else {
					}
					break;
				case 1: //拖动第2列
					this.districts[this.newMultiIndex[0]].subs[e.detail.value].subs.forEach((items, index) => {
						data.push(items.name);
					});
					this.multiArray[2] = data;
					break;
			}
		},
		editAddress() {
			this.multiArray[0] = [];
			this.districts.forEach((item, index) => {
			    this.multiArray[0].push(item.name);
			});
			if (this.addressid != '') {
				this.$ajax.get('com/editcompanyselfaddress', { addressid: this.addressid }).then(res => {
					if (res.data.code == 0) {
						this.address = res.data.result.data.address;
						this.districtname = res.data.result.data.districtname;
						let addressArray = this.districtname.split(',');
						this.districts.forEach((item, index) => {
							if (item.name == addressArray[0]) {
								this.oldMultiIndex[0] = index;
							}
						});

						this.multiArray[1] = [];
						this.districts[this.oldMultiIndex[0]].subs.forEach((item, index) => {
							if (item.name == addressArray[1]) {
								this.oldMultiIndex[1] = index;
							}
							this.multiArray[1].push(item.name);
						});

						this.multiArray[2] = [];
						this.districts[this.oldMultiIndex[0]].subs[this.oldMultiIndex[1]].subs.forEach((item, index) => {
							if (item.name == addressArray[2]) {
								this.oldMultiIndex[2] = index;
							}
							this.multiArray[2].push(item.name);
						});
						this.newMultiIndex = this.oldMultiIndex;
					}
				});
			} else {
				this.multiArray[1] = [];
				this.districts[0].subs.forEach((item, index) => {
					this.multiArray[1].push(item.name);
				});
				this.multiArray[2] = [];
				this.districts[0].subs[0].subs.forEach((item, index) => {
					this.multiArray[2].push(item.name);
				});
			}
		},
		onConfirm() {
			this.oldMultiIndex = this.newMultiIndex;
			console.log(this.oldMultiIndex);
			let adress = ',' + this.multiArray[0][this.oldMultiIndex[0]] + ',' + this.multiArray[1][this.oldMultiIndex[1]] + ',' + this.multiArray[2][this.oldMultiIndex[2]];
			this.districtname = adress.substring(1);
		},
		saveAddress() {
			if (this.check()) {
				this.districtid = this.districts[this.oldMultiIndex[0]].subs[this.oldMultiIndex[1]].subs[this.oldMultiIndex[2]].id;
				this.$ajax
					.get('com/savecompanyselfaddress', {
						cguid: this.cguid,
						addressid: this.addressid,
						districtid: this.districtid,
						address: this.address
					})
					.then(res => {
						this.$api.msg(res.data.msg);
						if (res.data.code == 0) {
							uni.navigateBack();
						}
					});
			}
		},
		check() {
			let msg = '';
			let mark = true;
			if (mark && this.districtname == '') {
				msg = '请选择地区';
				mark = false;
			}
			if (mark && this.address == '') {
				msg = '请输入详细信息地址';
				mark = false;
			}
			if (!mark) {
				this.$api.msg(msg);
			}
			return mark;
		},
        checkde() {
            var hezce = '';
            this.address.split('\n').forEach(item => {
                hezce += item;
            });
            this.address = hezce;
        },
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
		margin-top: 10rpx;
		.input {
			width: 100%;
            height: 120rpx;
		}
	}
}
</style>
