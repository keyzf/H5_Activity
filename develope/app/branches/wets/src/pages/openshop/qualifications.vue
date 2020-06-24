<template>
    <!-- 上传营业执照 -->
    <view class="content">
        <!-- 已上传的营业执照 -->
        <view class="up" v-if="licence_old != '' ">
            <view class="con new" >
                <image :src="licence_old" mode="aspectFit"></image>
            </view>
        </view>
        <view  class="up" v-else> 
             <view class="con" :class="licenseUrl == '../../static/upimg.png' ? 'def' : 'new'" @click="add_img('license')">
                <image :src="licenseUrl" mode="aspectFit"></image>
                <view v-if="licenseUrl == '../../static/upimg.png'">上传营业执照照片</view>
            </view>
        </view>
        
        <view class="down">
            <view>已上传资质</view>
            <view class="imglist">
                <view class="item" v-for="(item, index) in otherurl_old">
                    <image :src="item.url" mode="aspectFit"></image>
                </view>   
            </view>
        </view>
        <view class="down">
            <view>如有其它资质请继续上传</view>
            <view class="imglist">
                <view class="item" v-for="(item, index) in img_List" @click="add_img('otherlicense', index)">
                    <image :src="item" mode="aspectFit"></image>
                </view>
                <view class="item add" @click="add_img('add_other_li')">
                    <image src="../../static/upimg.png" mode="aspectFit"></image>
                    <view>上传照片</view>
                </view>
            </view>
        </view>
        <view class="footer">
            <text class="submit ash" v-if="type_url == 'creatShop'" @click="jump_fun">以后再说</text>
            <text class="submit" @click="binding_bank_card">确定</text>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            licenseUrl: '../../static/upimg.png',
            img_List: [],
            type_url : "", //不同页面进来显示不同按钮 逻辑
            licence_old : "",
            otherurl_old : [],
        };
    },
    onLoad(param) {
    	this.type_url = param.type // creatShop  
        //加载已上传的资质
        this.getCompanyLicence()
    },
    onBackPress(){
        this.$api.ovPage()
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    methods: {
        getCompanyLicence(){
            let data = {
               cguid: uni.getStorageSync('companyguid')
            }
              this.$ajax.get('com/getCompanyLicence', data).then(res => {
               if (res.data.code == 0) {
                   this.licence_old = res.data.result.data.licence;
                   this.otherurl_old = res.data.result.data.otherurl;
                  
               }
               console.log(res);
           }); 
            
        },
        binding_bank_card() {
            //保存资质
            this.save_licence();
          
            
        },
        save_licence() {
            let data = {
                otherurl: this.img_List.toString(),
                cguid: uni.getStorageSync('companyguid')
            };
            if(this.licenseUrl == "../../static/upimg.png" && this.licence_old == ""){
               this.$api.msg("请上传营业执照图片!")
               return false;   
            }
            if(this.licenseUrl != "../../static/upimg.png"){
                data.licence = this.licenseUrl;
            }
          uni.showLoading({
          	mask:true
          })
            this.$ajax.get('com/appendCompanyLicence', data).then(res => {
                uni.hideLoading();
                if (res.data.code == 0) {
                    //银行卡页面
                    this.$api.msg(res.data.msg);
                    if(this.type_url == 'creatShop'){
                       this.jump_fun();
                       return; 
                    }else{
                       setTimeout(function(){ uni.navigateBack(); }, 2000);
                    }   
                }
                console.log(res);
            });
        },

        add_img(img_type, index_img) {
            let page_this = this;
            //TODO 循环上传多个
            uni.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['album'],
                success: function(res) {
                    console.log(res);
                     page_this.$uploadImg.uploadimg(res.tempFilePaths[0]).then(uploadFileRes => {     
                        let img_url = uploadFileRes;
                        //   逻辑
                        if (img_type == 'license') {
                            page_this.licenseUrl = img_url;
                        } else if (img_type == 'otherlicense') {
                            page_this.img_List[index_img] = img_url;
                        } else {
                            page_this.img_List.push(img_url);
                        } 
                         //刷新list
                         page_this.$forceUpdate()
                     })    
                }
            });
        },
        jump_fun() {
            uni.navigateTo({
                url: '/pages/openshop/binding_bank_card'
            });
        }
    }
};
</script>

<style lang="scss">
page {
    background: $page-color-base;
    font-size: 28rpx;
}
.content {
    border-top: 1px solid #dddddd;
}
.up {
    padding: 40rpx;
    text-align: center;
    background: #ffffff;
    margin-bottom: 10rpx;
    .con {
        display: inline-block;
        margin: 0 auto;
        border: 1px solid #dddddd;
        padding: 40rpx;

        image {
            width: 120rpx;
            height: 120rpx;
            display: inline-block;
        }
        &.new {
            padding: 0;
            img {
                width: 360rpx;
                height: 240rpx;
            }
        }
    }
}
.down {
    padding: 30rpx;
    background: #ffffff;
    .imglist {
        display: flex;
        text-align: center;
        padding: 20rpx 0;
        flex-wrap: wrap;
        .item {
            width: 210rpx;
            height: 210rpx;
            border: 1px solid #dddddd;
            border-radius: 16rpx;
            margin: 0 20rpx 20rpx 0;
            box-sizing: border-box;
            image {
                width: 210rpx;
                height: 210rpx;
            }
            &.add {
                padding-top: 60rpx;
                image {
                    width: 80rpx;
                    height: 80rpx;
                }
            }
        }
    }
}
</style>
