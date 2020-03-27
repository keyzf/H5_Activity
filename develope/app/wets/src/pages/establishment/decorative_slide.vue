<template>
    <view class="content">
        <view v-for="(product, index) in slideinfo.slidelist" :key="index" class="skin">
            <view class="skintitle">轮播广告{{index + 1}} <text @click="delSlide(index)">删除</text></view>
            <view class="carousel" v-show="product.picurl" @click="upload(index)">
                <img :src="product.picurl" class="carouselimg" />
            </view>
            <view class="carousel" v-show="!product.picurl" @click="upload(index)">
                <view class="carouselk">
                    <img src="../../static/upimg.png" alt="" />
                    <view>添加轮播广告</view>
                    <view>比例为25:9</view>
                </view>
            </view>
            <view class="list-cell" @click="selectProduct(product)">
                <text class="cell-more" v-show="product.linktext == undefined || product.linktext == ''">添加广告链接(选填)</text>
                <text class="cell-more" v-show="product.linktext !== undefined && product.linktext != ''" v-html="product.linktext"></text>
                <text class="cell-tit">
                    <img src="../../static/add.png" alt="">添加
                </text>
            </view>
        </view>

        <view class="list-cell b-b" @click="addSlide">
            <text class="cell-more">添加轮播图</text>
            <text class="cell-tit"><img src="../../static/add.png" alt="">添加</text>
        </view>
        <view class="footer" @click="submit">
            <text class="submit">提交</text>
        </view>
        <view>
            <!-- 上传图片裁剪 -->
            <image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel" :cut_scale="0.75" :cropHeight="300"
                ></image-cropper>
        </view>
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
                slideinfo: {},
                tempFilePath: '', //图
                cropFilePath: '', //图  
                index: "",
                 up_ok : "", //图片上传状态
            };
        },
        onLoad(option) {
            this.slideinfo = JSON.parse(option.data);
            if (this.slideinfo.slidelist == undefined || this.slideinfo.slidelist.length == 0) {
                this.slideinfo.slidelist = [];
                this.slideinfo.slidelist.push({linkid:"",linktype:"1",linktext:""});
            }
        },
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
        },
        onBackPress(){
            this.$api.ovPage()
        },
        methods: {
            submit() {
                for (let i = 0; i< this.slideinfo.slidelist.length; i++) {
                    if(this.slideinfo.slidelist[i].picurl == undefined || this.slideinfo.slidelist[i].picurl == ""){
                       this.$api.msg("请设置广告图片!")
                       return false; 
                    }
                    
                    if(this.slideinfo.slidelist[i].linkid == null ){
                        this.slideinfo.slidelist[i].linkid = "";
                    }	  
                }
                uni.$emit('editSlide', this.slideinfo)
                uni.navigateBack();
            },
            selectProduct(product) {
                uni.$once('selectProduct', (data) => {
                	product.linkid = data.productid;
                	product.linktype = 1;
                	product.linktext = data.name;
                	this.$forceUpdate();
                });
                uni.navigateTo({
                    url: '/pages/establishment/selectproduct'
                });
            },
            addSlide() {
                this.slideinfo.slidelist.push({});
            },
            delSlide(index){
                this.slideinfo.slidelist.splice(index,1)
                //picurl为上一页面的显示的属性
                if(this.slideinfo.slidelist.length == 0){
                    this.slideinfo.picurl = undefined;
                }
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
                    }
                });
            },
            //裁剪成功
            confirm(e) {
                this.tempFilePath = ''
                this.cropFilePath = e.detail.tempFilePath
                //上传图片
                this.$uploadImg.uploadimg(this.cropFilePath).then(res => {
                    this.up_ok = 'ok';
                    this.slideinfo.slidelist[this.index].picurl = res;
                    this.slideinfo.slidelist[this.index].linktype = 1;
                    this.slideinfo.picurl = this.slideinfo.slidelist[0].picurl;
                    this.$forceUpdate();
                })
                .catch(errorres =>{
                    this.up_ok = 'no'; 
                });
            },
            //裁剪失败
            cancel() {
                this.tempFilePath = "";
                this.up_ok = 'no';
            }
        },




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

            img {
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
        .skintitle{
            text{
                font-size: 28rpx;
                position: absolute;
                right: 30rpx;
                color: #10AEFF;
            }
        }
        .carousel {
            text-align: center;
            color: #666666;
            font-size: 24rpx;
            border: 1px solid #DDDDDD;
            margin-top: 10rpx;
            overflow: hidden;
            .carouselk {
                padding: 30rpx;
                background: #f8f8f8;
                img {
                    width: 81rpx;
                    height: 81rpx;
                }
            }

            .carouselimg {
                width: 690rpx;
                height: 248.5rpx;
                border-radius: 20rpx;
                float: left;
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
