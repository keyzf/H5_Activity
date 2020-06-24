<template>
    <view class="content">
        <view class="robtip">
            {{ addressInfo.tips }}
        </view>
        <view class="skin">
            <view class="skintitle">
            	<input type="text" v-model="addressInfo.receivername" placeholder="请输入收货人姓名" />
            </view>
            <view class="movebtn">
            	<input type="text" v-model="addressInfo.receivertel" placeholder="请输入收货人电话" />
            </view>
            <picker class="skintitle movebtn" mode="multiSelector" @change="districtChange" @columnchange="bindMultiPickerColumnChange" :value="multiIndex" :range="multiArray">
            	<view class="uni-input">{{ addressInfo.districtName }}</view>
            </picker>
        	<view class="movebtn">
        		<textarea class="input" v-model="addressInfo.address" auto-height placeholder="详细地址" />
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
                multiArray: [
                	['加载中...'],
                	['加载中...'],
                	['加载中...']
                ],
                multiIndex: [0, 0, 0],
                addressInfo: {},
                districts: uni.getStorageSync('districts'),
                ordernumber: ''
            }
        },
        onLoad(option) {
            this.ordernumber = option.ordernumber;
            this.getAddressByOrdernum();
        },
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
        },
        methods: {
            // 时间选择完毕
            districtChange(e) {
                this.multiIndex = e.detail.value;
                this.addressInfo.districtName = this.districts[this.multiIndex[0]].name + ',';
                this.addressInfo.districtName += this.districts[this.multiIndex[0]].subs[this.multiIndex[1]].name + ',';
                this.addressInfo.districtName += this.districts[this.multiIndex[0]].subs[this.multiIndex[1]].subs[this.multiIndex[2]].name;
                this.addressInfo.districtid = this.districts[this.multiIndex[0]].subs[this.multiIndex[1]].subs[this.multiIndex[2]].id;
            },
            // 获取地址地区列表
            getAllDistricts() {
                if (this.districts != null && this.districts.length > 0) {
                    this.selectDistricts();
                } else {
                    this.$ajax.get('shoppingcart/getAllDistricts', {timestamp: 0, update: 0}).then(res => {
                        console.log(res);
                        if (res.data.code == 0) {
                            uni.setStorageSync('districts', res.data.result.data.districts);
                            this.districts = res.data.result.data.districts;
                            this.selectDistricts();
                        } else {
                            this.$api.msg('获取地区列表失败');
                        }
                    });
                }
            },
            // 选择地址
            selectDistricts() {
                let nowName = this.addressInfo.districtName.toString().split(',');
                //省
                this.multiArray[0] = [];
                this.districts.forEach((item, index) => {
                    if (item.name.toString().trim() == nowName[0].trim()) {
                        this.multiIndex[0] = index;
                    }
                    this.multiArray[0].push(item.name);
                });
                // 市
                this.multiArray[1] = [];
                this.districts[this.multiIndex[0]].subs.forEach((item, index) => {
                    if (item.name.toString().trim() == nowName[1].trim()) {
                        this.multiIndex[1] = index;
                    }
                    this.multiArray[1].push(item.name);
                });
                //区
                this.multiArray[2] = [];
                this.districts[this.multiIndex[0]].subs[this.multiIndex[1]].subs.forEach((item, index) => {
                    if (item.name.toString().trim() == nowName[2].trim()) {
                        this.multiIndex[2] = index;
                    }
                    this.multiArray[2].push(item.name);
                });
            },
            // 获取订单地址
            getAddressByOrdernum() {
                this.$ajax.get('com/getAddressInfo', {ordernumber: this.ordernumber}).then(res => {
                    console.log(res);
                    if (res.data.code == 0) {
                        this.addressInfo = res.data.result.data;
                        this.getAllDistricts();
                    } else {
                        this.$api.msg('获取地址失败');
                    }
                });
            },
            bindMultiPickerColumnChange: function(e) {
                let index = e.detail.value;
            	switch (e.detail.column) {
            		case 0: //拖动第1列
                        this.multiIndex = [index, 0, 0];
                        // 市
                        this.multiArray[1] = [];
                        this.districts[this.multiIndex[0]].subs.forEach((item, index) => {
                            this.multiArray[1].push(item.name);
                        });
                        //区
                        this.multiArray[2] = [];
                        this.districts[this.multiIndex[0]].subs[this.multiIndex[1]].subs.forEach((item, index) => {
                            this.multiArray[2].push(item.name);
                        });
            			break;
            		case 1: //拖动第2列
                        this.multiIndex.splice(1, 1, index);
                        this.multiIndex.splice(2, 1, 0);
            			//区
            			this.multiArray[2] = [];
            			this.districts[this.multiIndex[0]].subs[this.multiIndex[1]].subs.forEach((item, index) => {
            			    this.multiArray[2].push(item.name);
            			});
            			break;
                    case 2: // 拖动第3列
                        this.multiIndex.splice(2, 1, index);
                        break;
            	}
            },
            submit() {
                let data = {
                    ordernumber: this.ordernumber,
                    receivername: this.addressInfo.receivername,
                    receivertel: this.addressInfo.receivertel,
                    address: this.addressInfo.address,
                    districtid: this.addressInfo.districtid
                };
                this.$ajax.get('com/sellerChangeAddress', data).then(res => {
                    if (res.data.code == 0) {
                        this.$api.msg('地址修改成功');
                        this.$api.prePage().getOrderDetail();
                        setTimeout(function() {
                            uni.navigateBack();
                        }, 800);
                    } else {
                        this.$api.msg('地址修改失败');
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
    .movebtn{
        border-top: 1px solid #dddddd;
        padding-top: 10rpx;
        margin-top: 10rpx;
        .input{
            width: 100%;
        }
    }
}

</style>