<template>
    <view class="content">
        <view class="list-cell b-b">
            <text class="cell-tit">活动名称</text>
            <input class="cell-more input" type="text" v-model="saleinfo.title" placeholder="请输入活动名称" />
        </view>
        <view class="list-cell b-b">
            <text class="cell-tit">开始时间</text>
            <picker class="cell-more input" mode="multiSelector" @change="startValue" @columnchange="bindMultiPickerColumnChange" :value="multiIndex" :range="multiArray">
                <view class="uni-input">{{ multiArray[0][multiIndex[0]] }}-{{ multiArray[1][multiIndex[1]] }}-{{ multiArray[2][multiIndex[2]] }} {{ multiArray[3][multiIndex[3]] }}:{{ multiArray[4][multiIndex[4]] }}:00</view>
            </picker>
        </view>
        <view class="list-cell b-b">
            <text class="cell-tit">结束时间</text>
            <picker class="cell-more input" mode="multiSelector" @change="endValue" @columnchange="bindMultiPickerColumnChange" :value="multiEnd" :range="multiArray">
                <view class="uni-input">{{ multiArray[0][multiEnd[0]] }}-{{ multiArray[1][multiEnd[1]] }}-{{ multiArray[2][multiEnd[2]] }} {{ multiArray[3][multiEnd[3]] }}:{{ multiArray[4][multiEnd[4]] }}:00</view>
            </picker>
        </view>
        <view class="list-cell b-b" @click="activities">
            <text class="cell-tit">活动范围</text>
            <text class="cell-more input">{{ saleinfo.userange == 0 ? '请选择活动范围' : saleinfo.userange == 1 ? '部分商品' : '全部商品' }}</text>
        </view>
        <view v-show="showState" class="list-cell b-b" @click="shopproduct">
            <text class="cell-tit">选择商品</text>
            <text v-show="productids.length > 0" class="cell-more input yticon icon-you">已选择 {{productids.length}} 个</text>
        </view>
        <view class="list-cell b-b m-t">
            <text class="cell-tit">消费满</text>
            <input class="cell-more input" type="number" maxlength="6" v-model="saleinfo.limit" placeholder="请输入金额"/>
            <text>元</text>
        </view>
        <view class="list-cell b-b">
            <text class="cell-tit">减</text>
            <input class="cell-more input" type="number" maxlength="6" v-model="saleinfo.discount" placeholder="请输入金额"/>
            <text>元</text>
        </view>
        <view class="footer"><text class="submit" @click="submit">确定</text></view>
    </view>
</template>

<script>
export default {
    data() {
        return {	
            multiArray: [
                ['2019'],
                ['01','02','03','04','05','06','07','08','09','10','11','12'],
                ['01', '02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21', '22','23','24','25','26','27','28','29','30','31'],
                ['00','01', '02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21', '22','23'],
                ['00', '10','20','30','40','50'],
            ],
            multiIndex: [0, 0, 0, 0, 0],
            multiEnd:[0, 0, 0, 0, 0],
			showState: false,
			productids: [],
			saleinfo: {
				begintime: '',
				discount: '',
				endtime: '',
				limit: '',
				saleid: '',
				saleproductids: '',
				saleproductinfo: '',
				title: '',
				userange: 0
			}
        };
    },
    onLoad(option) {
		this.multiArray[0] = [];
		for (var i = 1900; i < 2101; i++ ) {
			this.multiArray[0].push(i + '');
		}
		// 是否为编辑
		this.saleinfo.saleid = option.id || '';
		if (this.saleinfo.saleid != '') {
			this.getSelainfoBySid();
		} else {
			const date = new Date();
			let year, month, day, hour;
			year = date.getFullYear();
			month = date.getMonth();
			day = date.getDate();
			hour = date.getHours();
			this.multiIndex = [year - 1900, month, day - 1, hour, 0];
			this.multiEnd = [year - 1900, month, day - 1, hour, 0];
			this.saleinfo.begintime = year + '-' + (month + 1) + '-' + day  + ' ' + hour + ':00:00';
			this.saleinfo.endtime = year + '-' + (month + 1) + '-' + day + ' ' + hour + ':00:00';
		}
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    methods: {
		// 开始时间
		startValue(e) {
			this.multiIndex = e.detail.value;
			let time = '';
			this.multiIndex.forEach((item, index) => {
				switch(index) {
					case 0: // 年
						time += this.multiArray[index][item] + '-';
						break;
					case 1: // 月
						time += this.multiArray[index][item] + '-';
						break;
					case 2: // 日
						time += this.multiArray[index][item] + ' ';
						break;
					case 3: // 时
						time += this.multiArray[index][item] + ':';
						break;
					case 4: // 分
						time += this.multiArray[index][item] + ':00';
						break;
				}
			});
			this.saleinfo.begintime = time;
			console.log(time);
		},
		// 结束时间
		endValue(e) {
			this.multiEnd = e.detail.value;
			let time = '';
			this.multiEnd.forEach((item, index) => {
				switch(index) {
					case 0: // 年
						time += this.multiArray[index][item] + '-';
						break;
					case 1: // 月
						time += this.multiArray[index][item] + '-';
						break;
					case 2: // 日
						time += this.multiArray[index][item] + ' ';
						break;
					case 3: // 时
						time += this.multiArray[index][item] + ':';
						break;
					case 4: // 分
						time += this.multiArray[index][item] + ':00';
						break;
				}
			});
			this.saleinfo.endtime = time;
			console.log(time);
		},
		// 查看选择的商品
        shopproduct(){
			console.log(this.productids);
			let ids = this.productids.length > 0 ? this.productids.join(',') : '';
			let url = '/pages/search/shopproductsearch?productids=' + ids;
			if (this.productids.length > 0) {
				url = '/pages/search/shopproduct?productids=' + ids;
			}
            uni.navigateTo({
				url
            });
        },
		// 选择商品或 全部商品
        activities(){
			let ids = this.productids.length > 0 ? this.productids.join(',') : '';
			let _this = this;
            uni.showActionSheet({
                itemList: ['全部商品', '部分商品'],
                success: function(res) {
                    console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
                    if(res.tapIndex == 1){
						_this.saleinfo.userange = 1;
						_this.showState = true;
						uni.navigateTo({
                            url: '/pages/search/shopproductsearch?productids=' + ids
                        });
                    } else {
						_this.saleinfo.userange = 3;
						_this.showState = false;
					}
                }
            });
        },
		// 修改变量
		editData(data) {
			this.productids = data.productids;
			this.showState = data.showState;
		},
		// 根据店铺获取 商品ids
		getSelainfoBySid(){
			let cguid = uni.getStorageSync('companyguid')
			this.$ajax.get('sale/editsaleactivity', {cguid: cguid, saleid: this.saleinfo.saleid}).then(res => {
				console.log(res);
				if (res.data.code == 0) {
					this.saleinfo = res.data.result.data;
					// 商品选择
					if (this.saleinfo.userange == 1) {
						this.productids = this.saleinfo.saleproductids.length > 0 ? this.saleinfo.saleproductids.split(',') : [];
						this.showState = true;
					}
					let times = this.saleinfo.begintime.split(' ');
					this.multiIndex = [times[0].split('-')[0] - 1900, times[0].split('-')[1] - 1, times[0].split('-')[2] - 1, times[1].split(':')[0], times[1].split(':')[1]/10];
					times = this.saleinfo.endtime.split(' ');
					this.multiEnd = [times[0].split('-')[0] - 1900, times[0].split('-')[1] - 1, times[0].split('-')[2] - 1, times[1].split(':')[0], times[1].split(':')[1]/10];
				} else {
					this.$api.msg('获取商品失败');
				}
			});
		},
        bindMultiPickerColumnChange: function(e) {
            if(e.detail.column == 0 && this.multiIndex[1] == 1){
                let curMonthDays=new Date(this.multiArray[0][this.multiIndex[0]],2,0).getDate();
                if(curMonthDays == 28){
                    this.multiArray[2] = ['01', '02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21', '22','23','24','25','26','27','28'];
                }else{
                    this.multiArray[2] = ['01', '02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21', '22','23','24','25','26','27','28','29'];
                }
            }else if(e.detail.column == 1){
                switch (e.detail.value+1){
                    case 1:
                    case 3:
                    case 5:
                    case 7:
                    case 8:
                    case 10:
                    case 12:
                        this.multiArray[2] = ['01', '02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21', '22','23','24','25','26','27','28','29','30','31'];
                        break;
                    case 4:
                    case 6:
                    case 9:
                    case 11:
                        this.multiArray[2] = ['01', '02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21', '22','23','24','25','26','27','28','29','30'];
                        break;
                    case 2:
                        let curMonthDays=new Date(this.multiArray[0][this.multiIndex[0]],2,0).getDate();
                        if(curMonthDays == 28){
                            this.multiArray[2] = ['01', '02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21', '22','23','24','25','26','27','28'];
                        }else{
                            this.multiArray[2] = ['01', '02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21', '22','23','24','25','26','27','28','29'];
                        }
                        break;
                }
            }
        },
		// 保存活动
		submit() {
            if (this.saleinfo.title.length == 0) {
                this.$api.msg('请输入活动名称');
                return;
            }
            if (this.saleinfo.discount.length == 0 || this.saleinfo.limit.length == 0) {
                this.$api.msg('请输入金额');
                return;
            }
			if(this.saleinfo.userange == 0){
				 this.$api.msg('请选择活动范围');
				 return;
			}
			if (this.saleinfo.userange != 3 && this.productids.length == 0) {
				this.$api.msg('请选择商品');
				return;
			}

            uni.showLoading({
            	mask : true
            })
			this.$ajax.get('sale/setsalelimitsubtract', {
				cguid: uni.getStorageSync('companyguid'),
				title: this.saleinfo.title,
				userange: this.saleinfo.userange,
				discount: this.saleinfo.discount,
				limit: this.saleinfo.limit,
				saleid: this.saleinfo.saleid,
				productids: this.saleinfo.discount == 3 ? '' : this.productids.join(','),
				begintime: this.saleinfo.begintime,
				endtime: this.saleinfo.endtime
			}).then(res => {
				console.log(res);
				if (res.data.code == 0) {
					this.$api.prePage().getSaleList(0);
					uni.navigateBack();
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