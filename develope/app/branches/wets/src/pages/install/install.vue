<template>
	<view class="content">
		<view class="list-cell" v-show="settings.length > 0" v-for="(item, index) in settings" :key="index" @click="setClick(index)">
		    <view class="cell-tit">
		        <view>{{ item.title }}</view>
		    </view>
		    <view v-show="item.id != 4" class="cell-more yticon icon-you"></view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
            cguid: uni.getStorageSync('companyguid'),
            type: 0,
            force: 0,
            settings: []
        };
	},
    onLoad(option) {
        this.type = option.type;
        this.$ajax.get('setting/getSetting', {cguid: this.cguid}).then(res => {
            console.log(res);
            if (res.data.code == 0) {
                this.settings = res.data.result.data;
            } else {
                this.$api.msg('获取设置列表失败');
            }
        });
    },
    onBackPress(){
        this.$api.ovPage()
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
	methods: {
        setClick(index) {
            let setting = this.settings[index];
            switch(setting.id) {
                case 1: // 关于店铺
                    location.href = setting.url;
                    break;
                case 2: // 店铺规则
                    location.href = setting.url;
                    break;
                case 3: // 帮助
                    location.href = setting.url;
                    break;
                case 4: // 电话号码
                    uni.showModal({
                        title: '客服电话',
                        content: setting.content,
                        showCancel: false
                    });
                    break;
                case 5: // 店铺资质
                    uni.navigateTo({
                        url : '/pages/openshop/qualifications'
                    });
                    break;
                case 6: // 店铺资费
                    uni.navigateTo({
                        url: '/pages/install/installcon?type=' + this.type
                    })
                    break;
                case 7: // 注销店铺
                    this.cancel();
                    break;
            }
        },
        // 注销店铺前的判断
        cancel(){
            let _this = this;
        	this.$ajax.get('com/cancelShopForce', {cguid: this.cguid, force: this.force}).then(res => {
                console.log(res);
                // 10029-已提交注销申请；10030-符合注销条件；10031-不符合注销条件
                switch(parseInt(res.data.code)) {
                    case 10029: 
                        uni.showModal({
                            title: '提示',
                            content: res.data.msg,
                            showCancel: res.data.code == 10030 ? true : false
                        })
                        break;
                    case 10030: 
                        uni.showModal({
                            title: '提示',
                            content: res.data.msg,
                            success: rest => {
                                if (rest.confirm) {
                                    this.force = 1;
                                    _this.cancel();
                                }
                            }
                        })
                        break;
                    case 10031:
                        uni.showModal({
                            title: '提示',
                            content: res.data.msg,
                            showCancel: true
                        })
                        break;
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
}
.list-cell {
    padding: 20upx $page-row-spacing;
    line-height: 60upx;
    background: #fff;
    border-bottom: 1px solid #dddddd;
    justify-content: space-between;
    align-items: center;
    display: flex;
    .radio {
        flex-grow: 1;
        justify-content: space-between;
        align-items: center;
        display: flex;
    }
    &.m-t {
        margin-top: 16upx;
    }
    .cell-more {
        font-size: $font-base;
        color: $font-color-light;
        margin-left: 10upx;
        &.input {
            flex-grow: 1;
        }
    }
    .pice{
        color: $base-color;
        font-size: 32rpx;
    }
    .cell-tit {
        font-size: $font-base + 2upx;
        color: $font-color-dark;
        margin-right: 10upx;
        .tip{
            font-size: 24rpx;
            color: $font-color-base;
        }
    }
}
</style>
