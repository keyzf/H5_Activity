<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">收货人</text>
			<input class="input" type="text" v-model="addressData.name" placeholder="请填写收货人姓名" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">联系电话</text>
			<input class="input" type="number" v-model="addressData.tel" placeholder="请填写收货人手机号" placeholder-class="placeholder" />
		</view>
        <view class="row b-b">
        	<text class="tit">省 市 区</text>
            <text class="input">
                <picker class="skintitle movebtn" mode="multiSelector" @change="districtChange" @columnchange="bindMultiPickerColumnChange" :value="multiIndex" :range="multiArray">
                    <input type="text" disabled="true" v-model="addressData.provice_address" placeholder="请选择省市区" placeholder-class="placeholder" />
                </picker>
            </text>
        </view>
		<view class="row b-b"> 
			<text class="tit">详细地址</text>
			<input class="input" type="text" v-model="addressData.address" placeholder="街道、楼牌号等" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">备注</text>
			<input class="input" type="text" v-model="addressData.remark" placeholder="填写备注信息" placeholder-class="placeholder" />
		</view>
		<view class="row default-row">
			<text class="tit">设为默认</text>
			<switch :checked="addressData.isDefault == 1" color="#fa436a" @change="switchChange" />
		</view>
		<button class="add-btn" @click="confirm">提交</button>
        <semp-city @confirm="onCityClick" platform="jd" :showbox = "showbox"></semp-city>
	</view>
</template>

<script>
    import sempCity from "@/components/semp-city/semp-city.vue"
	export default {
        components: {sempCity},
		data() {
			return {
                showbox:false,
				addressData: {
                    isDefault: 0
                },
                multiArray: [
                	['加载中...'],
                	['加载中...'],
                	['加载中...']
                ],
                multiIndex: [0, 0, 0],
                districts: uni.getStorageSync('districts'),
                addressid: ''
			}
		},
		onLoad(option){
			let title = '新增收货地址';
			this.addressid = option.addressid == 0 ? '' : option.addressid;
			if(option.type==='edit'){
				title = '编辑收货地址'
				this.getAddressById();
			} else {
                this.getAllDistricts();
            }
			this.manageType = option.type;
			uni.setNavigationBarTitle({
				title
			});
		},
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
        },
		methods: {
            // 地区选择完毕
            districtChange(e) {
                this.multiIndex = e.detail.value;
                this.addressData.provice_address = this.districts[this.multiIndex[0]].name + ',';
                this.addressData.provice_address += this.districts[this.multiIndex[0]].subs[this.multiIndex[1]].name + ',';
                this.addressData.provice_address += this.districts[this.multiIndex[0]].subs[this.multiIndex[1]].subs[this.multiIndex[2]].name;
                this.addressData.districtid = this.districts[this.multiIndex[0]].subs[this.multiIndex[1]].subs[this.multiIndex[2]].id;
            },
			// 获取地址详情
			getAddressById() {
				this.$ajax.get('com/getRefundAddressDetail', {
						addressid: this.addressid
					}).then(res => {
						console.log(res);
						if (res.data.code == 0) {
							this.addressData = res.data.result.data;
                            this.getAllDistricts();
						} else {
							this.$api.msg('系统出错,请稍后再试');
						}
					});
			},
            // 获取地址地区列表
            getAllDistricts() {
                if (this.districts != null && this.districts.length > 0) {
                    this.selectDistricts();
                } else {
                    this.$ajax.get('shoppingcart/getAllDistricts', {timestamp: 0, update: 0}).then(res => {
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
            selectDistricts() {
                let nowName = [];
                if (this.addressid == '') {
                    nowName = ['北京市', '北京市', '东城区']
                } else {
                   nowName = this.addressData.provice_address.toString().split(',');
                }
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
			// 添加地址
			saveAddress() {
                this.$ajax.get('com/saveRefundAddress', {
                    cguid: uni.getStorageSync('companyguid'),
                    name: this.addressData.name,
                    tel: this.addressData.tel,
                    address: this.addressData.address,
                    districtid: this.addressData.districtid,
                    isdefault: this.addressData.isDefault,
                    remark: this.addressData.remark,
                    addressid: this.addressid
                }).then(res => {
                    console.log(res);
                    if (res.data.code == 0) {
                        this.$api.msg('保存成功');
                        this.$api.prePage().getAddressList();
                        setTimeout(function() {
                            uni.navigateBack();
                        }, 800);
                    } else {
                        this.$api.msg('保存失败');
                    }
                });
			},
			
			switchChange(e){
				this.addressData.isDefault = e.detail.value ? 1 : 0;
			},
			
			//返回地址参数
			onCityClick(val){
				// 先关闭弹出层
                this.showbox=false;
				if (val.town.value == 0) {
					this.addressData.provice_address = val.province.label + ',' + val.city.label + ',' + val.county.label;
				} else {
					this.addressData.provice_address = val.province.label + ',' + val.city.label + ',' + val.county.label + ',' + val.town.label;
				}
				// 区县id
				this.addressData.districtid = val.county.value;
			},
			
			//提交
			confirm(){
				if(!this.addressData.name){
					this.$api.msg('请填写收货人姓名');
					return;
				}
				if(!/(^1[3|4|5|7|8][0-9]{9}$)/.test(this.addressData.tel)){
					this.$api.msg('请输入正确的手机号码');
					return;
				}
				if(!this.addressData.provice_address){
					this.$api.msg('请选择收货地址');
					return;
				}
				if(!this.addressData.address){
					this.$api.msg('请填写详细收货地址');
					return;
				}
				console.log(this.addressData);
                this.saveAddress();
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
		}
	}
</script>

<style lang="scss">
	page{
		background: $page-color-base;
		padding-top: 16upx;
	}

	.row{
		display: flex;
		align-items: center;
		position: relative;
		padding:0 30upx;
		height: 110upx;
		background: #fff;
		
		.tit{
			flex-shrink: 0;
			width: 140upx;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.input{
			flex: 1;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.icon-shouhuodizhi{
			font-size: 36upx;
			color: $font-color-light;
		}
	}
	.default-row{
		margin-top: 16upx;
		.tit{
			flex: 1;
		}
		switch{
			transform: translateX(16upx) scale(.9);
		}
	}
	.add-btn{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		margin: 60upx auto;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>
