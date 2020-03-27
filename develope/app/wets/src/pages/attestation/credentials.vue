<template>
    <view class="content">
		<view class="robtip">
		    {{tip}}
		</view>
        <view class="list-cell b-b">
            <text class="cell-tit">真实姓名</text>
            <input class="cell-more input" v-model="realName" type="text" placeholder="请填写姓名" />
        </view>
        <view class="list-cell b-b">
            <text class="cell-tit">证件类型</text>
            <text class="cell-more input" style="color: #303133;">身份证</text>
        </view>
        <view class="list-cell b-b">
            <text class="cell-tit">证件号</text>
            <input class="cell-more input" v-model="idcard" type="text" placeholder="请填写证件号" />
        </view>
        <view class="idcard">
            <view class="item" v-for="(value,index) in imgdata" @click="add_img(index)">
                <image class="img" :src="value.url" mode="aspectFill"></image>
                <view class="title">{{value.title}}</view>
            </view>
        </view>
        <view class="footer">
            <text v-if="type_url == 'creatShop'" class="submit ash" @click="jump_fun">跳过</text>
            <text class="submit" @click="saveInfo">保存</text>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
				tip:"请保证姓名、身份证为同一人",
                defaultUrl: [
                    '../../static/front-id.png',
                    '../../static/back-id.png',
                    '../../static/hold-id.png'
                ],
                imgdata: [{
                        title: '上传身份证正面图片',
                        url: '../../static/front-id.png'
                    },
                    {
                        title: '上传身份证背面图片',
                        url: '../../static/back-id.png'
                    },
                    {
                        title: '上传手持身份证图片',
                        url: '../../static/hold-id.png'
                    },
                ],
                realName: "",
                idcard: "",
                card_type: "",


            };
        },
        onLoad(param) {
            this.type_url = param.type //creatShop 创建店铺
            this.load();
        },
        onBackPress(){
            this.$api.ovPage()
        },
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
        },
        methods: {
            load() {
                this.$ajax.get('com/documenttype', {}).then(res => {
                    if (res.data.code == 0) {
                        let data = res.data.result.data;
                        this.card_type = data[0].type;
                        console.log(res.data.result.data)
                    } else {
                        this.$api.msg(res.data.msg)
                        return;
                    }
                });
            },
            select_bank() {
                uni.navigateTo({
                    url: '/pages/income/select_bank'
                });
            },
            add_img(index) {
                let page_this = this;
                let uuid = this.$uuid.uuid()
                console.log(uuid)
                //TODO 循环上传多个
                uni.chooseImage({
                    count: 9,
                    sizeType: ['original', 'compressed'],
                    sourceType: ['album'],
                    success: function(res) {
                        console.log(res)      
                        page_this.$uploadImg.uploadimg(res.tempFilePaths[0]).then(img_res => {
                           console.log(img_res);
                           let url = img_res;
                           page_this.imgdata[index].url = url;
                           console.log(page_this.imgdata) 
                        })      
                    }
                });
            },
            saveInfo() {
                //提示框
				if(this.realName == ""){
					this.$api.msg("请填写姓名");
					return;
				}
				if(this.idcard == ""){
					this.$api.msg("请填写证件号码");
					return;
				}
         
                for (let i = 0; i < this.imgdata.length; i++) {
                    if (this.imgdata[i].url == this.defaultUrl[i]) {
                        this.$api.msg("请" + this.imgdata[i].title)
                        return;
                    }
                }
                let data = {
                    cguid: uni.getStorageSync("companyguid"),
                    name: this.realName,
                    idcard: this.idcard,
                    frontUrl: this.imgdata[0].url, //正面
                    backUrl: this.imgdata[1].url, //反面
                    idcardUrl: this.imgdata[2].url, //手持
                    type: this.card_type,

                }
                uni.showLoading({
                    title: '保存中..',
                    mask:true,   
                });
                this.$ajax.get('com/nameverification', data).then(res => {
                    uni.hideLoading();
                    if (res.data.code == 0) {
                        //建店
                        if (this.type_url == "creatShop") {
                            this.jump_fun()
                            return;
                        }
                        if(this.type_url == "shopcheck"){
                            uni.navigateBack();
                            uni.$emit('onload_f', {})
                            return;
                        }
                        this.$api.prePage().data.name = this.realName;
                        this.$api.prePage().data.verificationinfo = this.idcard;
                        this.$api.prePage().data.verificationstateinfo = "身份证";
                        uni.navigateBack();
                    } else {
                        this.$api.msg(res.data.msg)
                    }
                });

            },
            jump_fun() {
                uni.navigateTo({
                    url: '/pages/openshop/cipher'
                })
            },
        }
    };
</script>

<style lang="scss">
    page {
        background: $page-color-base;
    }
	.robtip{
	    font-size: 24rpx;
	    padding: 20rpx $page-row-spacing;
	    color: $base-color;
	}
    .content {
        border-top: 1px solid #dddddd;
        padding-bottom: 100rpx;
    }

    .idcard {
        padding: 20rpx 30rpx 4rpx 30rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #FFFFFF;
        flex-wrap: wrap;

        .item {
            width: 330rpx;
            text-align: center;
            margin-bottom: 16rpx;

            .img {
                width: 330rpx;
                height: 220rpx;
            }

            .title {
                font-size: 28rpx;
            }
        }
    }

    .list-cell {
        display: flex;
        align-items: center;
        padding: 20upx $page-row-spacing;
        line-height: 60upx;
        position: relative;
        background: #fff;
        justify-content: center;

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

        .cell-tip {
            font-size: $font-base;
            color: $font-color-light;
        }
    }
</style>
