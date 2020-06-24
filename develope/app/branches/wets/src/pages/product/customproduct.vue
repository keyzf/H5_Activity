<template>
    <view class="content">
        <view class="swipercon">
            <swiper class="swiper" autoplay indicator-dots>
                <block v-if="picurls.length > 0">
                    <swiper-item v-for="(pic, index) in picurls" :key="index">
                        <view class="swiper-item"><img :src="pic" @click="upload_img" /></view>
                    </swiper-item>
                </block>
                <block v-else>
                    <swiper-item>
                        <view class="swiper-item default"><img src="../../static/default.png" @click="upload_img" /></view>
                    </swiper-item>
                </block>
            </swiper>
            <view class="btn" @click="upload_img">
                <image src="../../static/shopimg.png" mode="aspectFit"></image>
            </view>
        </view>
        <view class="list-cell b-b">
            <text class="cell-tit">商品名称</text>
            <input class="cell-more" type="text" v-model="name" maxlength="16" placeholder="请输入商品名称" />
        </view>
        <view class="list-cell b-b">
            <text class="cell-tit">副标题</text>
            <input class="cell-more" type="text" v-model="subheading" maxlength="16" placeholder="请输入副标题" />
        </view>
        <view class="list-cell b-b">
            <text class="cell-tit">关键字</text>
            <input class="cell-more" type="text" v-model="keyword" maxlength="16" placeholder='请输入搜索关键字,以","分隔' />
        </view>
        <view class="list-cell b-b" @click="addtype">
            <text class="cell-tit">分类</text>
            <view class="cell-more yticon icon-you">{{ typeName }}</view>
        </view>
        <view class="list-cell b-b">
            <text class="cell-tit">规格</text>
            <input class="cell-more" type="text" v-model="attributes" maxlength="16" placeholder='请输入规格,例"400ml,1000g,2瓶"等' />
        </view>
        <view class="list-cell b-b">
            <text class="cell-tit">商品链接</text>
            <input class="cell-more" type="text" v-model="url" placeholder="请输入商品链接" />
        </view>

        <view class="footer" >
            <text class="submit" @click="saveProduct">提交拼团商品</text>
        </view>

    </view>
</template>
<script>
    import uniPopup from '@/components/uni-popup/uni-popup.vue';
    export default {
        components: {
            uniPopup
        },
        data() {
            return {
                typeId: '', //类目id  categoryid
                typeName: '请选择', //类目 ,名称
                name: '', //商品名
                subheading: '', //副标题
                keyword: '', //关键词
                picurls_str: "",
                picurls:[],
                attributes:"",
                url:""
            };
        },
        onLoad(param) {
            this.cguid = uni.getStorageSync('companyguid');
            let pages = getCurrentPages(); 
            console.log(pages)
        },
        methods: {
            upload_img() {
                //上传图片  跳转到上传图片的页面  该子页面会把当前页面的属性刷新
                uni.navigateTo({
                    url: '/pages/product/addproductimg-group'
                });
            },
            addtype(){
                uni.navigateTo({
                    url: '/pages/product/addtype'
                });
            },
            saveProduct(){
                if(!this.check_from()){
                    return;
                }
                let picurls_str = this.picurls.toString();//JSON.stringify(
                let json = {
                  picurls : picurls_str,
                  name : this.name,
                  subheading : this.subheading,
                  attributes : this.attributes,
                  url : this.url,
                  categoryid : this.typeId,
                  type : 4,//取自发起拼团类型首页的id1商城内商品2淘宝3京东4自定义
                  keyword: this.keyword
              }
                this.$ajax.get("groupbuying/saveCustomProduct", json).then(res => {
                    console.log(res);
                    //http://upload-z1.qiniup.com/ 接口地址
                    //http://mallstore.holdsoft.cn/ 上传到 该路径
                    if (res.data.code == 0) {
                        //this.tabList = res.data.result.data.tabs;
                        //TODO  保存后逻辑
                        let productid = res.data.result.data.productId
                         uni.navigateTo({
                            url: '/pages/product/assemble-product?productid='+productid+'&typeGroup=4' + "&categoryId=" + this.typeId //到该商品的详情页
                        });
                    }
                });
            },
            check_from() {
                if (this.name == "") {
                    this.$api.msg("请检查商品名称!")
                    return false;
                }
                if (this.subheading == "") {
                    this.$api.msg("请检查副标题!")
                    return false;
                }
                if (this.keyword.length == 0) {
                    this.$api.msg("请输入关键词!")
                    return false;
                }
                if (this.typeId.length == 0) {
                    this.$api.msg("请选择分类!")
                    return false;
                }
                if (this.attributes.length == 0) {
                  this.$api.msg("请输入规格!")
                  return false;
                }
                if (this.url.length == 0) {
                    this.$api.msg("请输入商品链接!")
                    return false;
                }
                if (this.picurls.length == 0) {
                   this.$api.msg("请至少上传一张图片!")
                   return false;
               }
                return true;
            },
            onConfirm() {
                //this.setCookie_f();
                uni.navigateBack();
            },
        },
    };
</script>
<style lang="scss">
    page {
        background: $page-color-base;
    }

    /deep/ .uni-popup__wrapper-box {
        border-radius: 20rpx;
    }

    .content {
        border-top: 1px solid #dddddd;
        padding-bottom: 160rpx;
    }

    .swipercon {
        background: #ffffff;
        position: relative;

        .swiper {
            height: 750rpx;
        }

        img {
            width: 750rpx;
            height: 750rpx;
        }

        .default {
            img {
                width: 750rpx;
                height: 350rpx;
                margin-top: 200rpx;
            }
        }

        .btn {
            position: absolute;
            bottom: 60rpx;
            right: 60rpx;
            z-index: 1;

            image {
                width: 60rpx;
                height: 60rpx;
            }
        }
    }

    .addcon {
        background: #ffffff;
        padding: 20rpx 30rpx;

        .addconitem {
            position: relative;
            margin-bottom: 20rpx;

            .subject {
                overflow: hidden;

                image {
                    width: 690rpx;
                    float: left;
                }

                textarea {
                    width: 690rpx;
                    height: 100rpx;
                    border: 1px solid #dddddd;
                    border-radius: 6rpx;
                    padding: 10rpx;
                }
            }

            .operation {
                position: absolute;
                right: 0;
                bottom: 8rpx;
                font-size: 24rpx;
                border-top: 1px solid #dddddd;

                text {
                    border-left: 1px solid #dddddd;
                    padding: 8rpx 18rpx;
                    background: #f6f6f6;
                }
            }
        }

        .addproductcon {
            margin-top: 20rpx;
            border: 1px solid $base-color;
            color: $base-color;
            border-radius: 10rpx;
            text-align: center;
            font-size: 32rpx;
            padding: 16rpx;
        }
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
            text-align: right;
        }

        .cell-tit {
            font-size: $font-base + 2upx;
            color: $font-color-dark;
            margin-right: 10upx;
            width: 120rpx;

            &.cw {
                flex-grow: 1;
                width: auto;
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
            transform: translateX(16upx) scale(0.6);
        }
    }

    .typelist {
        font-size: 28rpx;
        display: flex;
        align-items: center;
        padding: 20upx $page-row-spacing;
        border-bottom: 1px solid #dddddd;
        background: #ffffff;

        .typeinput {
            flex-grow: 1;
            padding-left: 20rpx;
        }

        .typetitle,
        .typetip {
            flex-grow: 0;
        }
    }

    .typecon {
        padding: 20rpx 30rpx;
        margin-top: 20rpx;
        background: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;

        image {
            width: 60rpx;
            height: 60rpx;
        }

        .typeopt {
            flex-grow: 1;
            margin-left: 20rpx;
        }
    }

    .addcategory {
        display: flex;
        align-items: center;
        background: #ffffff;
        font-size: 24rpx;

        .categoryitem {
            flex-grow: 1;
            padding: 20rpx;
            padding-left: 60rpx;

            image {
                width: 50rpx;
                height: 50rpx;
                vertical-align: middle;
                margin-right: 20rpx;
            }
        }
    }

    .btns {
        margin-bottom: 20rpx;
        display: flex;
        justify-content: space-between;
        color: $font-color-base;

        .action {
            color: $base-color;
        }
    }

    .uni-list {
        max-height: 40vh;
        overflow-y: auto;

        .uni-list-cell {
            display: flex;
            border-top: 1px solid #dddddd;
            padding: 20rpx 0;

            &.btn {
                text-align: center;
                padding: 20rpx;
                padding-bottom: 0;
                display: block;
            }
        }
    }

    .addclassification {
        border-top: 1px solid #DDD;
        text-align: center;
        padding: 20rpx 0 0 0;
        vertical-align: middle;

        image {
            width: 50rpx;
            height: 50rpx;
            vertical-align: middle;
            margin-right: 20rpx;
        }
    }

    .uni-tip {
        background: #fff;
        box-sizing: border-box;
    }

    .uni-tip-title {
        text-align: center;
        font-weight: bold;
        font-size: 16px;
        color: #333;
    }

    .input {
        padding: 12rpx;
        font-size: 28rpx;
        color: #666;
        border-bottom: 1px solid #dddddd;
        display: block;
        height: auto;
    }

    .uni-tip-group-button {
        margin-top: 10px;
    }

    .uni-tip-button {
        text-align: center;
        font-size: 14px;
        color: $base-color;
    }
</style>
