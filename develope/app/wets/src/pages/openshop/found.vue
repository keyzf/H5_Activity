<template>
    <!-- 建店 -- 上传logo -->
    <view class="content">
        <view class="item">
            <view class="imgs" :class="logo_url != '../../static/shopadd.png'?'tnew':''" @click="add_img('logo')">
                <image :src="logo_url" mode="aspectFill"></image>
                <view v-if="logo_url == '../../static/shopadd.png'">店铺LOGO</view>
            </view>
        </view>
        <view class="item" @click="add_img('shop')">
            <view class="imgs" :class="shop_url != '../../static/shopadd.png'?'cnew':''">
                <image :src="shop_url" mode="aspectFill"></image>
                <view v-if="shop_url == '../../static/shopadd.png'">店铺主图</view>
            </view>
        </view>
        <view class="inputs">
            <input type="text" value="" maxlength="10" placeholder="请输入店铺名称(建议少于10个字)" v-model="companyname" />
        </view>
        <view class="checkbox">
            <checkbox-group @change="checkboxChange">
                <label> 
                    <checkbox value="r1" />
                    <text>
                        遵守<< 
                        <text  @click.stop="agreement" class="open_agreement_line">开店协议</text>
                        >>
                    </text>
                </label>
            </checkbox-group>
        </view>
        <view class="footer"><text class="submit" @click="credentials">确定</text></view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                logo_url: "../../static/shopadd.png",
                shop_url: "../../static/shopadd.png",
                companyname: "",
                checked: false,
            };
        },
        onLoad(param) {
            this.type = param.type
        },
        onBackPress(){
            this.$api.ovPage()
        },
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
        },
        methods: {
            checkboxChange: function(e) {
                var values = e.detail.value;
                console.log(values);
                if (values.length > 0) {
                    this.checked = true;
                } else {
                    this.checked = false;
                }
            },
            //确定
            credentials() {
                if (!this.checked) {
                    this.$api.msg("请选择开店协议")
                    return;
                }
                if (this.companyname.length == 0) {
                    this.$api.msg("请输入店铺名称!")
                    return;
                }
                if (this.logo_url == "../../static/shopadd.png") {
                    this.$api.msg("请上传店铺LOGO!")
                    return;
                }
                if (this.shop_url == "../../static/shopadd.png") {
                    this.$api.msg("请上传店铺主图!")
                    return;
                }

                let data = {

                    logo: this.logo_url,
                    mainpicurl: this.shop_url,
                    type: this.type,
                    companyname: this.companyname,
                }
                this.$ajax.get('com/createShop', data).then(res => {
                    if (res.data.code == 0) {
                        let url = "";
                        let res_data = res.data.result.data
                        console.log()
                        //存 companyguid
                        uni.setStorageSync('companyguid', res_data.companyguid);
                        if (res_data.skipIdCardVerification == 0) { //不能跳过身份验证
                            url = "/pages/attestation/credentials?type=creatShop" //绑定身份
                        } else {
                            url = '/pages/openshop/cipher'
                        }
                        //手机绑定
                        uni.navigateTo({
                            url: url
                        })
                    } else {
                        this.$api.msg(res.data.msg)
                    }
                });

            },
            add_img(img_type) {
                let page_this = this;
                //TODO 循环上传多个
                uni.chooseImage({
                    count: 1,
                    sizeType: ['original', 'compressed'],
                    sourceType: ['album'],
                    success: function(res) {
                        console.log(res)
                        page_this.$uploadImg.uploadimg(res.tempFilePaths[0]).then(img_res => {
                            console.log(img_res);
                            //   逻辑
                            if (img_type == 'logo') {
                                page_this.logo_url = img_res;
                            } else {
                                page_this.shop_url = img_res;
                            }

                        });
                    }
                });
            },
            agreement() {
                uni.navigateTo({
                    url: '/pages/establishment/strategy?type=creat'
                })

            },
        }
    };
</script>

<style lang="scss">
    .content {
        border-top: 1px solid #dddddd;
    }

    .item {
        padding: 30rpx;
        text-align: center;
        vertical-align: middle;
        border-bottom: 1px solid #dddddd;

        .imgs {
            display: inline-block;
            width: 240rpx;
            height: 240rpx;
            border-radius: 50%;
            background: #DDDDDD;
            font-size: 28rpx;
            vertical-align: middle;

            image {
                margin-top: 80rpx;
                width: 60rpx;
                height: 60rpx;
            }

            &.tnew {
                image {
                    margin-top: 0;
                    width: 240rpx;
                    height: 240rpx;
                    border-radius: 50%;
                }
            }

            &.cnew {
                width: 640rpx;
                border-radius: 0;

                image {
                    margin-top: 0;
                    width: 640rpx;
                    height: 240rpx;
                }
            }
        }
    }

    .inputs {
        padding: 20rpx 30rpx;
        border-bottom: 1px solid #dddddd;
    }

    .checkbox {
        padding: 20rpx 30rpx;
        font-size: 28rpx;

        checkbox {
            transform: scale(0.7);
        }
    }

    .open_agreement {
        color: blue;
    }

    .open_agreement_line {
        color: blue;
        text-decoration: underline;
    }
</style>
