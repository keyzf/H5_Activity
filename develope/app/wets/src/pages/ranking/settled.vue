<template>
    <view class="conter">
        <view class="settled-item">
            <view class="labers">商家名称</view>
            <view class="con"><input type="text" maxlength="10" placeholder="请输入商家名称" v-model="supplierName" /></view>
        </view>
        <view class="settled-item">
            <view class="labers">商家LOGO</view>
            <view class="con" @click="chooseLogo()"><img v-show="logo != ''" :src="logo" /> <img v-show="logo == ''" src="../../static/missing-face.png" /></view>
            <view class="zjt"><img src="../../static/zjt.png" /></view>
        </view>
        <view class="settled-item">
            <view class="labers">联系人</view>
            <view class="con"><input type="text" maxlength="14" placeholder="请输入姓名" v-model="realname" /></view>
        </view>
        <view class="settled-item">
            <view class="labers">联系电话</view>
            <view class="con"><input type="number" maxlength="11" placeholder="请输入联系人电话" v-model="tel" /></view>
        </view>
        <view class="settled-item">
            <view class="labers">所属城市</view>
            <view class="con"><input type="text" maxlength="15" placeholder="请输入所属城市" v-model="city" /></view>
        </view>
        <view class="settled-item">
            <view class="labers">经营范围</view>
            <view class="con"><textarea rows="" cols="" maxlength="100" placeholder="请输入经营范围" v-model="businessScope"></textarea></view>
        </view>
        <view class="settled-item" @click="additem()">
            <view class="labers">商品列表</view>
            <view class="con">管理商品</view>
            <view class="zjt"><img src="../../static/zjt.png" /></view>
        </view>
        <view class="footer"><text class="submit" @click="submit">提交</text></view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            supplierName: '',
            logo: '',
            realname: '',
            tel: '',
            city: '',
            businessScope: ''
        };
    },
    onLoad() {
        this.getInfo();
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    onUnload() {
        uni.removeStorageSync('productData');
    },
    methods: {
        // 获取入驻详情
        getInfo() {
            this.$ajax.get('helppoorcompetition2019/getMySupplierDetail', {}).then(res => {
                console.log(res);
                if (res.data.code == 0) {
                    let data = res.data.result.data;
                    this.supplierName = data.suppliername;
                    this.logo = data.logo;
                    this.realname = data.realname;
                    this.tel = data.tel;
                    this.city = data.city;
                    this.businessScope = data.businessscope;
                    uni.setStorageSync('productData', data.productinfo);
                } else {
                    this.$api.msg(res.data.msg);
                }
            });
        },
        // 参数校验
        validataParams() {
            let state = true;
            if (this.supplierName.trim().length == 0) {
                state = false;
                this.$api.msg('商家名称不能为空');
            }
            if (this.logo.trim().length == 0 && state) {
                state = false;
                this.$api.msg('商家LOGO不能为空');
            }
            if (this.realname.trim().length == 0 && state) {
                state = false;
                this.$api.msg('联系人不能为空');
            }
            if (this.tel.trim().length == 0 && state) {
                state = false;
                this.$api.msg('请输入联系方式');
            }
            if (!/(^1[3|4|5|7|8][0-9]{9}$)/.test(this.tel) && state) {
                state = false;
                this.$api.msg('请输入正确联系方式');
            }
            if (this.city.trim().length == 0 && state) {
                state = false;
                this.$api.msg('所属城市不能为空');
            }
            if (this.businessScope.trim().length == 0 && state) {
                state = false;
                this.$api.msg('经营范围不能为空');
            }
            // if (this.productinfo.length == 0 && state) {
            //     state = false;
            //     this.$api.msg('请选择商品');
            // }
            return state;
        },
        // 提交
        submit() {
            if (!this.validataParams()) return;
            uni.showLoading({
                title: '提交中'
            });
            let productinfo = [];
            let productData = uni.getStorageSync('productData') || [];
            if (productData.length > 0) {
                productData.forEach(item => {
                    productinfo.push({
                        productname: item.productname,
                        picurls: [{
                            url: item.picurls[0].picurl
                        }]
                    });
                });
            }
            this.$ajax
                .get('helppoorcompetition2019/supplierJoin', {
                    guid: this.guid,
                    supplierName: this.supplierName,
                    logo: this.logo,
                    realname: this.realname,
                    tel: this.tel,
                    city: this.city,
                    businessScope: this.businessScope,
                    productinfo: JSON.stringify(productinfo)
                })
                .then(res => {
                    uni.hideLoading();
                    console.log(res);
                    if (res.data.code == 0) {
                        this.$api.msg('提交成功');
                        this.$api.prePage().refreshHome();
                        setTimeout(function() {
                            uni.navigateBack();
                        }, 1000)
                    } else {
                        this.$api.msg(res.data.msg);
                    }
                });
        },
        // 管理商品
        additem() {
            uni.navigateTo({
                url: '/pages/ranking/list?type=2'
            });
        },
        // 上传logo
        chooseLogo() {
            let _this = this;
            uni.chooseImage({
                count: 1,
                sourceType: ['album'],
                success: res => {
                    if (res.tempFiles[0].size > 1 * 1024 * 1024) {
                        _this.$api.msg('请将图片大小控制在1MB内');
                        return;
                    } else {
                        uni.showLoading({
                            title: '上传中...'
                        })
                        uni.uploadFile({
                            url: _this.$api_url + 'wxservicenumber/getPicUrl',
                            filePath: res.tempFilePaths[0],
                            name: 'file',
                            success: img => {
                                let data = JSON.parse(img.data);
                                if (data.code == 0) {
                                    _this.logo = data.result.data.url;
                                } else {
                                    _this.$api.msg(data.msg);
                                }
                            },
                            fail: res => {
                                _this.$api.msg('上传失败，请重新选择！');
                            },
                            complete: res => {
                                uni.hideLoading();
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
.conter {
    padding-bottom: 100rpx;
}
.settled-item {
    display: flex;
    align-items: center;
    padding: 10px 15px;
    background: #fff;
    border-bottom: 1px solid #dddddd;
    font-size: 28rpx;
    .labers {
        min-width: 76px;
    }
    .con {
        flex-grow: 1;
        text-align: right;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        padding: 0 10px;
        input {
            text-align: right;
            width: 100%;
            line-height: 30px;
        }
        textarea {
            width: 100%;
            height: 100px;
            resize: none;
            padding: 6px 0;
        }
        img {
            width: 30px;
            height: 30px;
            border-radius: 50%;
        }
    }
    .zjt {
        margin-top: -1px;
        img {
            width: 10px;
            margin-right: -10px;
        }
    }
}
</style>
