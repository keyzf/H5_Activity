<template>
  <view>
    <view class="detail-con" v-html="showpage"></view>
    <web-view v-if="urls" :src="urls"></web-view>
  </view>

</template>

<script>
  export default {
    data() {
      return {
        showpage: '',
        urls: ''
      };
    },
    onLoad(option) {
      if (option.type == 0) {
        uni.setNavigationBarTitle({
          title: '帮助'
        });
      } else if (option.type == 1) {
        uni.setNavigationBarTitle({
          title: '使用说明'
        });
      } else if (option.type == 2) {
        uni.setNavigationBarTitle({
          title: '退款规则'
        });
      } else if (option.type == 3) {
        uni.setNavigationBarTitle({
          title: '招商'
        });
      } else if (option.type == 4) {
        uni.setNavigationBarTitle({
          title: '抢购规则'
        });
      }
      if (option.type == 0) {
        this.urls = option.url;
        console.log(option.title)
        if(option.title){
          uni.setNavigationBarTitle({
            title: option.title
          });
        }
      } else {
        uni.request({
          url: option.url,
          success: res => {
            if (res.statusCode == 200) {
              var REG_BODY = /<body[^>]*>([\s\S]*)<\/body>/;
              var result = REG_BODY.exec(res.data);
              if (result && result.length === 2) {
                this.showpage = result[1];
                //.replace(/\<img/gi, '<img style="max-width:750upx;height:auto" ');
              } else {
                this.showpage = result;
              }
            }
          }
        });
      }
    },
    onShow() {
      if (this.$wx.isWechat()) this.$wx.share();
    },
    onBackPress() {
      this.$api.ovPage()
    },
  };
</script>

<style lang="scss">
  page {
    padding: 0 30rpx;
  }

  /deep/ * {
    font-size: 28rpx !important;
  }

  /deep/ img {
    max-width: 690rpx !important;
  }
</style>
