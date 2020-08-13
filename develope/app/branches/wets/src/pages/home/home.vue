<template>
  <view class="coent">
    <homePage ref="home" v-if="page_code=='home'" :datalist="datalist"></homePage>
    <pageTwo ref="category" v-if="page_code=='category'"></pageTwo>
    <pageThree ref="shop" v-if="page_code=='shop'"></pageThree>
    <pagefore ref="cart" v-if="page_code=='cart'"></pagefore>
    <pagefive ref="user" v-if="page_code=='user'"></pagefive>
    <footerNav></footerNav>
    <view class="backtop" :class="{ x: backshow }">
      <image src="../../static/backtop.png" mode="aspectFit" @click="backtop"></image>
    </view>
    <uni-popup ref="popup" type="center" @change="elasticdels">
      <swiper :indicator-dots="true" :autoplay="true" :interval="3000" class="popbender">
        <swiper-item v-for="(item,index) in elastic" :key="index">
          <image :src="item.picurl" mode="aspectFit" @click="elastics(index)" class="imgs"></image>
        </swiper-item>
      </swiper>
      <image src="../../static/imgdel.png" mode="aspectFit" class="elasticdel" @click="elasticdel"></image>
    </uni-popup>
  </view>
</template>

<script>
  import homePage from "../index/index";
  import pageTwo from "../category/category";
  import pageThree from "../establishment/shop";
  import pagefore from "../cart/cart";
  import pagefive from "../user/user";
  import footerNav from "../../components/footer/footer_nav.vue";
  import uniPopup from '@/components/uni-popup/uni-popup.vue';
  import API from "@/store/api.js";
  export default {
    data() {
      return {
        backshow: false,
        datalist: [],
        elastic: [{
          begintime: "2020-02-18 19:24:16",
          code: "PROMOTION",
          endtime: "2020-02-25 23:59:18",
          everyday_begintime: null,
          everyday_endtime: null,
          h5url: "",
          id: 119,
          iscetc: 0,
          iscorpmall: 1,
          isfamily: 1,
          ishold: 1,
          iswechat: 1,
          itemid: 280,
          picurl: "http://highmall.holdsoft.cn/popupad/1582024981344tc4.png",
          source: 1,
          supportshop: 0,
          type: 2,
          vercode: null,
        }]
      }
    },
    components: {
      homePage,
      pageTwo,
      pageThree,
      pagefore,
      pagefive,
      footerNav,
      uniPopup
    },
    onPageScroll(o) {
      if (o.scrollTop > 60 && this.$store.state.footer_store.now_page_index == 'home') {
        this.backshow = true;
      } else {
        this.backshow = false;
      }
    },
    //下拉刷新
    onPullDownRefresh() {
      this.$refs[this.page_code].load();

    },
    //加载更多
    onReachBottom() {
      this.$refs[this.page_code].more();
    },
    computed: {
      page_code() {
        let codes = this.$store.state.footer_store.now_page_index;
        return codes;
      }
    },
    onLoad(o) {
      if (o.page == 'user') {
        this.$store.state.footer_store.now_page_index = 'user';
      } else if (o.page == 'cart') {
        this.$store.state.footer_store.now_page_index = 'cart';
      } else if (o.recommendloginguid) {
        let userinfo = uni.getStorageSync('userInfo');
        if (!userinfo.guid) {
          uni.setStorageSync('recommendloginguid', o.recommendloginguid);
          uni.navigateTo({
            url: '/pages/public/login'
          });
        }
      } else {
        //已建店 到建店页面
        this.isOpenShop()
      }
      if (this.$wx.isWechat()) this.$wx.share();
      this.$ajax.get('homepage/homepageInfo190507', {}).then(res => {
        this.datalist = res.data.result.data;
      });
      var _this = this;
      uni.$on('changeLoginState', function(data) {
        _this.load();
      });
    },
    onShow() {
      let num = this.$store.state.footer_store.navlist.length;
      if (num > 0) {
        this.$store.state.footer_store.now_page_index = this.$store.state.footer_store.navlist[num - 1];
        this.$store.commit("cut_navlist")
      }
      this.$ajax.get('shoppingcart/getModelTipNum', {
        code: 'SHOPCART'
      }).then(res => {
        if (res.data.code == 0) {
          let number = res.data.result.data.tipnumber;
          this.$store.commit("set_number", number)
        }
      });
      if (!this.$store.state.showpop) {
        this.$ajax.get('popup/getpopupad', {}).then(res => {
          if (res.data.code == 0) {
            if (res.data.result.data.length > 0) {
              this.elastic = res.data.result.data;
              this.$refs.popup.open();
            }
          }
        });
      }
    },
    methods: {
      elastics(index) {
        this.$store.state.showpop = true;
        if (this.elastic[index].code == 'HELP_POOR_COMPETITION') {
          location.href = '';
          return;
        }
        let type = this.elastic[index].type;
        switch (type) {
          case 1:
            this.$refs.popup.close();
            uni.navigateTo({
              url: '/pages/product/product?productid=' + this.elastic[index].itemid
            });
            break;
          case 2:
            this.$refs.popup.close();
            if (this.elastic[index].code == 'BUYLIMIT') {
              uni.navigateTo({
                url: '/pages/product/rushbuy'
              });
            }else if (this.elastic[index].code == 'WX_LOTTERY') {
              uni.navigateTo({
                url: '/pages/draw/draw?form=8'
              });
            } else if (this.elastic[index].code == 'NEWPRODUCT') {
              uni.navigateTo({
                url: '/pages/product/fashionable?id=' + this.elastic[index].itemid
              });
            } else if (this.elastic[index].code == 'GROUPBUYONE') {
              uni.navigateTo({
                url: '/pages/oneyuangroup/oneyuangroup'
              });
            } else if (this.elastic[index].code == 'THIRDPARTY_DIANDI') {
              let userinfo = uni.getStorageSync('userInfo');
              if (!userinfo.guid) {
                this.$api.msg('请先登录');
              } else {
                API.dianDiLoginToken({
                  dianDiJumpType : this.elastic[index].itemid
                }).then(res => {
                  let resData = res.data.result.data
                  if (res.data.code == -1) {
                    uni.showModal({
                      title: '提示',
                      content: res.data.msg,
                      showCancel: false
                    })
                    return
                  } 
                  // 跳转到点滴
                  let _url = resData.method_url+'?'+'surl='+resData.login_url+'&force=true&login_token='+resData.login_token
                  window.location.href = _url
                }).catch(err => {
                  console.log(err);
                })
              }
            } else if (this.elastic[index].code == 'PROMOTION') {
              uni.navigateTo({
                url: '/pages/product/catelist?id=' + this.elastic[index].itemid
              });
            } else if (this.elastic[index].code == 'POSTER') {
              if(this.elastic[index].h5url){
                uni.navigateTo({
                  url: '/pages/selective/selective?id=' + this.elastic[index].itemid
                });
              }else {
                var cd = this.elastic[index].itemid.toString().split('@');
                if (cd.length > 1) {
                  uni.navigateTo({
                    url: '/pages/selective/selective?id=' + cd[0]
                  });
                } else {
                  uni.navigateTo({
                    url: '/pages/product/poster?id=' + cd[0]
                  });
                }
              }
              
            } else if (this.elastic[index].code == 'MYCOUPON') {
              uni.navigateTo({
                url: '/pages/user/coupon'
              });
            } else if (this.elastic[index].code == 'H5_NOSTATUS') {
              let userinfo = uni.getStorageSync('userInfo');
              if (!userinfo.guid) {
                this.$api.msg('请先登录');
              } else {
                location.href = this.elastic[index].h5url+'?guid=' + userinfo.guid + '&token=' + userinfo.token + '&AppCode=WXMall'
              }
            } else {
              uni.navigateTo({
                url: '/pages/product/catelist?id=' + this.elastic[index].itemid
              });
            }
            break;
          case 4:
            this.$refs.popup.close();
            let userInfo = uni.getStorageSync('userInfo') || '';
            location.href = this.elastic[index].h5url + "?guid=" + userInfo.guid;;
            break;
          default:
            this.$refs.popup.close();
            break;
        }
      },
      elasticdel() {
        this.$store.state.showpop = true;
        this.$refs.popup.close();
      },
      elasticdels(e) {
        if (!e.show) {
          this.$store.state.showpop = true;
        }
      },
      load() {
        this.$ajax.get('homepage/homepageInfo190507', {}).then(res => {
          this.datalist = res.data.result.data;
        });
      },
      backtop() {
        uni.pageScrollTo({
          scrollTop: 0,
          duration: 0
        });
      },
      isOpenShop() {
        this.$ajax.get('com/hasCompany', {}).then(res => {
          if (res.data.code == 0) {
            let companyresult = res.data.result.data.companyresult;
            // 0-未创建店铺，1-已创建店铺
            if (companyresult == 1) {
              this.$store.dispatch('menu_2');
            }
          }
        });
      },
    }
  }
</script>

<style lang="scss">
  .coent {
    padding-bottom: 100rpx;
    height: 100%;
  }

  /deep/ .uni-popup__wrapper.uni-custom.center .uni-popup__wrapper-box {
    background: inherit;
    padding: 0;
    max-width: inherit;
    max-height: inherit;
    overflow-y: inherit;
  }

  .elasticdel {
    width: 60rpx;
    height: 60rpx;
    margin: 40rpx auto;
    display: block;
  }

  .popbender {
    width: 600rpx;
    height: 600rpx;

    .imgs {
      width: 100%;
      height: 100%;
    }
  }
</style>
