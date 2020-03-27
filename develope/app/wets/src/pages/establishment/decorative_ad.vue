<template>
    <view class="content">
        <view class="skin">
            <view class="skintitle">两列广告设置</view>
            <view class="biserial">
                <view class="biserialitem" v-if="adinfo.adlist[0].picurl == undefined || adinfo.adlist[0].picurl == ''" @click="upload(0)">
                    <img src="../../static/upimg.png" alt="">
                    <view>添加广告</view>
                    <view>比例为4:3</view>
                </view>
                <view class="biserialitem" v-else @click="upload(0)">
                    <img :src="adinfo.adlist[0].picurl" class="carouselimg" />
                </view>
                <view class="biserialitem" v-if="adinfo.adlist[1].picurl == undefined || adinfo.adlist[1].picurl == ''" @click="upload(1)">
                    <img src="../../static/upimg.png" alt="">
                    <view>添加广告</view>
                    <view>比例为4:3</view>
                </view>
                <view class="biserialitem" v-else @click="upload(1)">
                    <img :src="adinfo.adlist[1].picurl" class="carouselimg" />
                </view>
            </view>
        </view>
        <view class="list-cell b-b" @click="selectProduct(0)">
            <text class="cell-more" v-show="adinfo.adlist[0].linktext == undefined || adinfo.adlist[0].linktext == ''">左侧添加广告链接(选填)</text>
            <text class="cell-more" v-show="adinfo.adlist[0].linktext !== undefined && adinfo.adlist[0].linktext != ''"
                v-html="adinfo.adlist[0].linktext"></text>
            <view class="cell-tit">
                <image src="../../static/add.png" mode="">添加</image>
            </view>
        </view>
        <view class="list-cell b-b" @click="selectProduct(1)">
            <text class="cell-more" v-show="adinfo.adlist[1].linktext == undefined || adinfo.adlist[1].linktext == ''">右侧添加广告链接(选填)</text>
            <text class="cell-more" v-show="adinfo.adlist[1].linktext !== undefined && adinfo.adlist[1].linktext != ''"
                v-html="adinfo.adlist[1].linktext"></text>
            <view class="cell-tit">
                <image src="../../static/add.png" mode="">添加</image>
            </view>
        </view>
        <view class="footer">
            <text class="submit" @click="submit">提交</text>
        </view>
           <!-- 上传图片裁剪 -->
        <image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel" :cut_scale="0.36" 
           ></image-cropper>
    </view>
</template>

<script>
    import ImageCropper from "@/components/invinbg-image-cropper/invinbg-image-cropper.vue";
    export default {
        components: {
            ImageCropper
        },
        data() {
            return {
                adinfo: {},
                tempFilePath: '', //图
                cropFilePath: '', //图  
                index: "",
                up_ok : "", //图片上传状态
            };
        },
        onLoad(option) {
            console.log(uni.getSystemInfoSync().windowWidth)
            this.adinfo = JSON.parse(option.data);
            if (this.adinfo.adlist == undefined || this.adinfo.adlist.length < 2) {
                this.adinfo.adlist = [];
                this.adinfo.adlist.push({linkid:"",linktype:"",linktext:""});
                this.adinfo.adlist.push({linkid:"",linktype:"",linktext:""});
            }
            console.log(this.adinfo)
        },
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
        },
        onBackPress(){
            this.$api.ovPage()
        },
        methods: {
            selectProduct(index) {
                uni.$once('selectProduct', (data) => {
                    this.adinfo.adlist[index].linkid = data.productid;
                    this.adinfo.adlist[index].linktype = 1;
                    this.adinfo.adlist[index].linktext = data.name;
                    this.$forceUpdate();
                });
                uni.navigateTo({
                    url: '/pages/establishment/selectproduct'
                });
            },
            submit() {
                console.log(this.adinfo.adlist)
                for (let i = 0; i< this.adinfo.adlist.length; i++) {
                	if(this.adinfo.adlist[i].picurl == undefined || this.adinfo.adlist[i].picurl == ""){
                       this.$api.msg("请设置两张广告图片!")
                       return false; 
                    }
                    if(this.adinfo.adlist[i].linkid == null ){
                       this.adinfo.adlist[i].linkid = "";
                    }
                    
                }
                
                uni.$emit('editAd', this.adinfo)
                uni.navigateBack();
            },
            upload(index) {
                if(this.up_ok == 'ing'){
                    this.$api.msg("等待图片上传后再操作")
                    return;
                }
                this.index = index;
                uni.chooseImage({
                    count: 1, //默认9
                    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['album'], //从相册选择
                    success: (res) => {
                        this.up_ok = 'ing';
                        this.tempFilePath = res.tempFilePaths.shift()
                        console.log(this.tempFilePath);
                    }
                });
            },
            //裁剪成功
            confirm(e) {
                console.log(e)
                this.tempFilePath = ''
                this.cropFilePath = e.detail.tempFilePath
                //上传图片
                this.$uploadImg.uploadimg(this.cropFilePath).then(res => {
                    this.up_ok = 'ok';
                    console.log(res); 
                    this.adinfo.adlist[this.index].picurl = res
                    this.$forceUpdate();
                    console.log( this.adinfo)
                })
                .catch(errorres =>{
                    this.up_ok = 'no';
                    console.log(errorres);
                });

            },
            //裁剪失败
            cancel() {
                this.tempFilePath = "";
                this.up_ok = 'no';
                console.log('canceled')
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
        align-items: baseline;
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
            align-self: baseline;
            font-size: $font-lg;
            color: $font-color-light;
            margin-left: 10upx;
            flex: 1;
        }

        .cell-tit {
            font-size: $font-base + 2upx;
            color: $font-color-dark;
            margin-right: 10upx;
            text-align: center;

            image {
                width: 50rpx;
                height: 50rpx;
                display: inline-block;
                vertical-align: middle;
                margin-right: 10rpx;
            }
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

    .skin {
        padding: 20rpx 30rpx;
        background: #ffffff;
        margin-bottom: 20rpx;

        .biserial {
            display: flex;
            justify-content: space-between;

            .biserialitem {
                width: 340rpx;
                height: 257rpx;
                border: 1px solid #DDDDDD;
                background: #f8f8f8;
                border-radius: 20rpx;
                text-align: center;
                overflow: hidden;
                font-size: 28rpx;

                img {
                    margin-top: 70rpx;
                    width: 81rpx;
                    height: 81rpx;
                }

                .carouselimg {
                    margin-top: 0;
                    width: 340rpx;
                    height: 257rpx;
                    border-radius: 20rpx;
                    float: left;
                }
            }
        }

        .movebtn {
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
</style>
