<template>
    <view class="page-content">
        <view class="item" @click="product(index)" v-for="(item,index) in typeList" :style="{background:'url('+item.background+') no-repeat'}">
            <view class="title">
                {{item.title}}
            </view>
            <view class="tip">
              {{item.subtitle}}
            </view>
        </view>
    </view>
</template>
<script>
export default {
    data() {
        return {
            typeList:[
                {title:"商城商品",subtitle:"商城内已有商品",background:"http://highmall.holdsoft.cn/17.png"},
                {title:"自定义商品",subtitle:"自己输入想要拼团商品的图片、名字、规格等信息",background:"http://highmall.holdsoft.cn/19.png"}],
            explainUrl:""
        };
    },
    onLoad(e) {
       this.groupExplain();
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
    onNavigationBarButtonTap(e) {
        uni.navigateTo({
            url: '/pages/user/customerexit?url='+ this.explainUrl + e.text
        });
    },
    methods: {
      /*  getTypeList(){
            this.$ajax.get("groupbuying/getProductType", {}).then(res => {
              console.log(res);
              if (res.data.code == 0) {
                  ///分类
                  this.TypeList = res.data.result.data;
              }
          });  
        }, */
        groupExplain(){
              this.$ajax.get("groupbuying/instuction", {}).then(res => {
               console.log(res);
               if (res.data.code == 0) {
                   ///团购须知
                   this.explainUrl = res.data.result.data.url;
               }
           }); 
        },
        product(index){
            let url = "";
            if(index == 0){
                url = '/pages/category/category?type=1&pageType=group';
            }else if(index == 1){
                url = "/pages/product/customproduct"
            }
            uni.navigateTo({
                url: url
            });
        },
    }
};
</script>
<style lang="scss">
.page-content{
    border-top: 1px solid #f1f1f1;
}
.item{
    width: 94%;
    margin: 40rpx auto;
    text-align: center;
    padding: 40rpx 0;
    background-size: 100% 100%;
    border-radius: 10rpx;
    line-height: 60rpx;
    color: #FFF;
    .title{
        font-size: 36rpx;
    }
    .tip{
        font-size: 30rpx;
    }
}
</style>
