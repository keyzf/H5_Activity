<template>
  <view class="container">
    <view class="set">
      <image src="../../static/set.png" mode="aspectFit" class="img" @click.stop="setclick"></image>
    </view>
    <view class="user-section">
      <view class="user-info-box" @click="clickHeadimg">
        <view class="portrait-box">
          <image class="portrait" :src=" user.img || '/static/missing-face.png'" mode="aspectFill" @error="errorImg()"></image>
          <image class="gradeimg" :src="'/static/vip'+user.grade+'.png'" mode="aspectFit"></image>
        </view>
        <view class="info-box">
          <text class="username">{{ user.name || '游客'}}</text>
        </view>
        <!-- <view class="activity" @click.stop="goenvelopes" v-show="user.isshowredpacketshare == 1">
                <image src="../../static/envelopeactivities.gif" mode="aspectFit"></image>
                <text>邀请得红包</text>
              </view> -->
        <view class="activity" @click.stop="jumpConsumerank" v-show="user.isshowconsumerank == 1">
          <image :src="'../../static/consume.png'" mode="aspectFit"></image>
          <text>年度消费排行榜</text>
        </view>
      </view>
      <view class="typerk">
        <view class="item" @click="tablist({code:'ATTEN'})">
          <view class="number">{{mine.products}}</view>
          <view class="tip">商品关注</view>
        </view>
        <view class="item" @click="tablist({code:'SHOPFOLLOW'})">
          <view class="number">{{mine.shops}}</view>
          <view class="tip">店铺关注</view>
        </view>
        <view class="item" @click="tablist({code:'HISTORY'})">
          <view class="number">{{mine.steps}}</view>
          <view class="tip">浏览记录</view>
        </view>
      </view>
    </view>

    <view class="cover-container">
      <!-- 订单 -->
      <view class="header">我的订单<text class="yticon icon-you" @click="navTo('/pages/order/order?state=0')">全部订单</text></view>
      <view class="order-section">
        <view class="order-item" @click="navTo('/pages/order/order?state=1')" hover-class="common-hover"
          :hover-stay-time="50">
          <text v-if="orderlist.non_payment != 0" class="cart-number">{{ orderlist.non_payment }}</text>
          <view class="yticon">
            <image src="../../static/non_payment.png" mode="aspectFill"></image>
          </view>
          <text>待付款</text>
        </view>
        <view class="order-item" @click="navTo('/pages/order/order?state=2')" hover-class="common-hover"
          :hover-stay-time="50">
          <text v-if="orderlist.non_delivery != 0" class="cart-number">{{ orderlist.non_delivery }}</text>
          <view class="yticon">
            <image src="../../static/non_delivery.png" mode="aspectFill"></image>
          </view>
          <text>待发货</text>
        </view>
        <view class="order-item" @click="navTo('/pages/order/order?state=3')" hover-class="common-hover"
          :hover-stay-time="50">
          <text v-if="orderlist.non_takeover != 0" class="cart-number">{{ orderlist.non_takeover }}</text>
          <view class="yticon">
            <image src="../../static/non_takeover.png" mode="aspectFill"></image>
          </view>
          <text>待收货</text>
        </view>
        <view class="order-item" @click="navTo('/pages/order/order?state=4')" hover-class="common-hover"
          :hover-stay-time="50">
          <text v-if="orderlist.non_evaluate != 0" class="cart-number">{{ orderlist.non_evaluate }}</text>
          <view class="yticon">
            <image src="../../static/service.png" mode="aspectFill"></image>
          </view>
          <text>待评价</text>
        </view>
        <view class="order-item" @click="navTo('/pages/order/aftermarket')" hover-class="common-hover" :hover-stay-time="50">
          <text v-if="orderlist.service != 0" class="cart-number">{{ orderlist.service }}</text>
          <view class="yticon">
            <image src="../../static/non_evaluate.png" mode="aspectFill"></image>
          </view>
          <text>退款售后</text>
        </view>
      </view>
      <view class="header">我的钱包</view>
      <view class="tj-sction">
        <view class="tj-item" @click="navTo('/pages/user/balance')">
          <view>
            <view class="yticon">
              <image src="../../static/coupon.png" mode="aspectFill"></image>
            </view>
            <view>余额</view>
          </view>
          <view class="conse">
            <view class="num">{{wallet.amount ? wallet.amount.amountvalue : 0}}</view>
            <view class="num">{{wallet.amount ? wallet.amount.ydayGain : 0}}</view>
          </view>
          <view class="btn">
            去查看
          </view>
        </view>
        <!-- <view class="tj-item" @click="navTo('/pages/user/extra')">
          <text class="num">{{u_coin}}</text>
          <text>U币</text>
        </view>
        <view class="tj-item" @click="navTo('/pages/user/envelopes')">
          <text class="num">{{envelopes}}</text>
          <text>红包</text>
        </view>
        <view class="tj-item" @click="navTo('/pages/user/coupon')">
          <text class="num">{{coupon}}</text>
          <text>优惠券</text>
        </view> -->
      </view>
      
      <view class="page-section-spacing" v-if="slides.length > 0">
        <swiper class="swiper" style="height: 200rpx;margin: 20rpx 0;">
          <swiper-item v-for="(item,index) in slides" :key="index" @click="goswiper(item)">
            <image :src="item.picurl" mode="aspectFill" class="swiiperimg"></image>
          </swiper-item>
        </swiper>
      </view>
      <template v-if="coupon.length > 0">
        <view class="header" @click="navTo('/pages/user/coupon')">
          我的优惠券
          <text class="more">更多</text>
        </view>
        <scroll-view class="coupon" scroll-x="true">
          <view class="item" v-for="(item,index) in coupon" :key="index" @click="couponUse(item)">
            <view class="kk">
              <!-- <text class="start"></text> -->
              <view class="conse">
                <view class="price">
                  {{item.discounts}}
                </view>
                <view class="tip">
                  {{item.limit}}
                </view>
                <view class="tips clamp">
                  {{item.title}}
                </view>
              </view>
              <view class="btn">
                {{item.couponstate == 1 ? '立即领取' : '立即使用'}}
              </view>
            </view>
          </view>
        </scroll-view>
      </template>
      <template v-if="menu.length > 0">
        <view class="cate-sections" v-for="(item, index) in menu" :key="index">
          <view class="title">{{item.title}}</view>
          <view class="cate-section">
            <view class="cate-item" v-for="(items, ind) in item.list" :key="items.code" @click="tablist(items)">
              <image :src="items.url"></image>
              <view>{{ items.display }}</view>
            </view>
          </view>
        </view>
      </template>
      <template v-if="guesslikeImg">
        <image class="guessimg" :src="guesslikeImg.url" mode="aspectFit" :style="{width:'710rpx',height:710 / guesslikeImg.width * guesslikeImg.height + 'rpx'}"></image>
        <view class="goods-list">
          <view class="goods-item" v-for="(item, index) in guess" :key="index" @click="navToDetailPage(item)">
            <image v-if="item.isNewOnShelvesProduct == 1" class="label" :src="item.newOnShelvesProductIcon" mode="aspectFit"></image>
            <view class="image-wrapper">
              <uimg :src="item.url"></uimg>
              <image v-if="item.mainpicIcon != ''" :src="item.mainpicIcon" mode="aspectFit" class="tipimg"></image>
              <view class="tip clamp" v-if="item.mainpicIcon == '' && item.feature_short != ''">{{item.feature_short}}</view>
            </view>
            <view class="item-con">
              <view class="title"><img v-if="item.titleIcon != ''" :src="item.titleIcon"><text v-if="item.presell" class="presell">{{item.presell}}</text>{{ item.name }}</view>
              <view class="price-box clamp">
                <text class="price">{{ item.price }}</text>
                <text v-if="item.activitylist.length == 0">{{ item.sales }}</text>
                <view v-else>
                  <text v-for="ite in item.activitylist" :key="ite.wholetext" :style="{color:ite.color,borderColor:ite.color}">{{ ite.wholetext }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </template>
    </view>
  </view>
</template>
<script>
  export default {
    data() {
      return {
        u_coin: 0.00,
        coupon: [],
        envelopes: 0.00,
        user: {
          img: "",
          name: "",
          grade: 0,
          isshowredpacketshare: 0,
          isshowconsumerank: 0,
          consumerankurl: '',
          facepic: ''
        },
        orderlist: {
          non_payment: 0,
          non_delivery: 0,
          non_takeover: 0,
          non_evaluate: 0,
          service: 0
        },
        moving: false,
        menu: [],
        loginState: false,
        wallet:{},
        slides:[],
        mine:{},
        guesslikeImg:{},
        guess: []
      }
    },

    created() {
      let _this = this;
      uni.$on('changeLoginState', function(data) {
        _this.getUserInfo();
        _this.getUserInfoSub();
      });
      this.getUserInfo();
      this.getUserInfoSub();
    },
    onShow() {
      if (this.$wx.isWechat()) this.$wx.share();
      this.getUserInfoSub();
    },
    methods: {
      more() {},
      load() {
        this.getUserInfo();
        this.getUserInfoSub();
      },
      setclick(e) {
        uni.navigateTo({
          url: '/pages/set/set'
        });
      },
      clickHeadimg() {
        let userInfo = uni.getStorageSync('userInfo') || '';
        if (!userInfo.guid) {
          uni.navigateTo({
            url: '/pages/public/login'
          });
          return;
        }
        this.navTo('/pages/set/information');
      },
      // 获取个人中心
      getUserInfo() {
        this.$ajax.get('user/myinfo', {}).then(res => {
          if (res.data.code == 0) {
            let data = res.data.result.data;
            this.slides = data.slides;
            this.coupon = data.coupon.list;
            if(data.guesslikeImg){
              this.guesslikeImg = data.guesslikeImg;
              this.guesslist()
               
            }
            
            this.user.img = data.userinfo.facepic;
            this.user.name = data.userinfo.realname;
            this.user.grade = data.userinfo.memberlevel;
            this.user.isshowredpacketshare = data.userinfo.isshowredpacketshare;
            this.user.isshowconsumerank = data.userinfo.isshowconsumerank;
            this.user.consumerankurl = data.userinfo.consumerankurl;
            this.user.facepic = data.userinfo.facepic;
            this.menu = data.menu;
          } else {
            this.$api.msg('系统出错,请稍后再试');
          }
          uni.stopPullDownRefresh();
        });
       
      },
      guesslist() {
        this.$ajax.get('homepage/getGuesslikeList', {}).then(res => {
          if (res.data.code == 0) {
            let data = res.data.result.data;
            this.guess = data
          } else {
            this.$api.msg('系统出错,请稍后再试');
          }
        });
      },
      navToDetailPage(item) {
        if (item.code == 'PROMOTION') {
          uni.navigateTo({
            url: '/pages/product/catelist?id=' + item.activityid
          });
        } else if (item.code == 'MORE') {
          uni.navigateTo({
            url: '/pages/product/catemore'
          });
        } else if (item.jumptype == 1) {
          uni.navigateTo({
            url: '/pages/product/product?productid=' + item.productid
          });
        } else {
          uni.navigateTo({
            url: '/pages/product/product?productid=' + item.productid
          });
        }
      },
      // 获取订单状态数字
      getUserInfoSub() {
        this.$ajax.get('user/myinfosub', {}).then(res => {
          if (res.data.code == 0) {
            let data = res.data.result.data;
            this.wallet = data.wallet;
            this.mine = data.mine;

            this.orderlist.non_payment = data.userinfo.orderlist[0].number;
            this.orderlist.non_delivery = data.userinfo.orderlist[1].number;
            this.orderlist.non_takeover = data.userinfo.orderlist[2].number;
            this.orderlist.non_evaluate = data.userinfo.orderlist[3].number;
            this.orderlist.service = data.userinfo.orderlist[4].number;
          } else {
            this.$api.msg('系统出错,请稍后再试');
          }
          uni.stopPullDownRefresh();
        });
      },
      /**
       * 统一跳转接口,拦截未登录路由
       * navigator标签现在默认没有转场动画，所以用view
       */
      navTo(url) {
        uni.navigateTo({
          url
        })
      },
      goswiper(item){
        let type = item.type;
        switch (type) {
          case 1:
            uni.navigateTo({
              url: '/pages/product/product?productid=' + item.itemid
            });
            break;
          case 2:
            if (item.code == 'BUYLIMIT') {
              uni.navigateTo({
                url: '/pages/product/rushbuy'
              });
            }else if (item.code == 'WX_LOTTERY') {
              uni.navigateTo({
                url: '/pages/draw/draw?form=8'
              });
            } else if (item.code == 'NEWPRODUCT') {
              uni.navigateTo({
                url: '/pages/product/fashionable?id=' + item.itemid
              });
            } else if (item.code == 'GROUPBUYONE') {
              uni.navigateTo({
                url: '/pages/oneyuangroup/oneyuangroup'
              });
            } else if (item.code == 'PROMOTION') {
              uni.navigateTo({
                url: '/pages/product/catelist?id=' + item.itemid
              });
            } else if (item.code == 'POSTER') {
              if(item.h5url){
                uni.navigateTo({
                  url: '/pages/selective/selective?id=' + item.itemid
                });
              }else {
                var cd = item.itemid.toString().split('@');
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
            } else if (item.code == 'MYCOUPON') {
              uni.navigateTo({
                url: '/pages/user/coupon'
              });
            } else if (item.code == 'H5_NOSTATUS') {
              let userinfo = uni.getStorageSync('userInfo');
              if (!userinfo.guid) {
                this.$api.msg('请先登录');
              } else {
                location.href = item.h5url+'?guid=' + userinfo.guid + '&token=' + userinfo.token + '&AppCode=WXMall'
              }
            } else {
              uni.navigateTo({
                url: '/pages/product/catelist?id=' + item.itemid
              });
            }
            break;
          case 4:
            this.$refs.popup.close();
            let userInfo = uni.getStorageSync('userInfo') || '';
            location.href = item.h5url + "?guid=" + userInfo.guid;;
            break;
          default:
            this.$refs.popup.close();
            break;
        }
      },
      couponUse(item){
        if(item.couponstate == 1){
          this.$ajax.get('product/getReceiveCoupon', { couponid: item.couponid }).then(res => {
              if (res.data.code == 0) {
                this.$api.msg('领取成功');
                this.getUserInfo();
              } else {
                this.$api.msg('领取失败');
              }
          });
        }else{
          switch (item.targettype) {
            case 1: // 跳转商品详情
              uni.navigateTo({
                url: '/pages/product/product?productid=' + item.keyword
              });
              break;
            case 2: // 跳转搜索
              if (item.couponkind == 3) {
                uni.navigateTo({
                  url: '/pages/product/welfare-list?targettype=2&usercouponid=' + item.usercouponid +
                    '&targetids=' + item.keyword
                });
              } else {
                uni.navigateTo({
                  url: '/pages/product/searchlist?mark=false&targetids=' + item.keyword
                });
              }
              break;
            case 3: // 跳转搜索
              uni.navigateTo({
                url: '/pages/product/searchlist?targetids=' + item.keyword
              });
              break;
            case 4: // 跳转店铺首页
              uni.navigateTo({
                url: '/pages/product/shop?cguid=' + item.cguid
              });
              break;
            case 5: // 不处理
              break;
            case 6: // 跳转首页分类
              uni.navigateTo({
                url: '/pages/product/catelist?id=' + item.keyword
              });
              break;
            case 7: // 跳转自营店铺列表
              uni.navigateTo({
                url: '/pages/product/shopproductlist?cguid=' + item.cguid
              });
              break;
          }
        }
      },
      // 菜单选择
      tablist(item) {
        let code = item.code;
        switch (code) {
          case 'ATTEN':
            this.navTo('/pages/user/attentionproductlist');
            break;
          case 'ADDRESS':
            this.navTo('/pages/address/address');
            break;
          case 'HOTLINE':
            this.navTo('/pages/user/customer');
            break;
          case 'RICHSCAN':
            if (this.$wx.isWechat()) {
              this.$wx.scanQRCode(1);
            }
            break;
          case 'CHAT':
            this.navTo('/pages/chat/list');
            break;
          case 'SHOPFOLLOW':
            this.navTo('/pages/product/shoplist');
            break;
          case 'COUPON':
            this.navTo('/pages/user/morecoupon');
            break;
          case 'HISTORY':
            this.navTo('/pages/product/recordlist');
            break;
          case 'INVEST':
            this.navTo('/pages/establishment/help?url=' + item.content + '&type=3');
            break;
          case 'WISHLIST':
            this.navTo('/pages/wishlist/wishlist');
            break;
          default:
            this.$api.msg('功能开发中');
            break;
        }
      },
      errorImg() {
        this.user.img = '/static/missing-face.png';
      },
      goenvelopes() {
        // 跳转红包页面
        uni.navigateTo({
          url: '/pages/activity/activity'
        })
      },
      jumpConsumerank() {
        let userinfo = uni.getStorageSync('userInfo');
        location.href = this.user.consumerankurl + '?guid=' + userinfo.guid + '&token=' + userinfo.token +
          '&AppCode=WXMall';
      }
    }
  }
</script>
<style lang='scss' scoped>
  page {
    background: $page-color-base;
    min-height: 100%;
  }
  .swiiperimg{
    width: 100%;
    height: 200rpx;
  }

  /* 分类 */
  .cate-sections {
    padding: 0 22upx;
    background: #fff;
    border-radius: 16upx 16upx 0 0;
    margin-top: 20upx;
    .title{
      font-size: 30rpx;
      padding: 20rpx;
      border-bottom: 1px solid #f1f1f1;
      margin-bottom: 20rpx;
    }
  }
  .cate-section {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    

    .cate-item {
      width: 25%;
      flex-direction: column;
      align-items: center;
      font-size: $font-sm + 2upx;
      color: $font-color-dark;
      margin-bottom: 14upx;
      text-align: center;
    }

    /* 原图标颜色太深,不想改图了,所以加了透明度 */
    image {
      width: 88upx;
      height: 88upx;
    }
  }

  %flex-center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  %section {
    display: flex;
    justify-content: space-around;
    align-content: center;
    background: #fff;
    border-radius: 10upx;
  }
  .set {
    position: fixed;
    top: 0rpx;
    left: 0rpx;
    right: 0rpx;
    z-index: 3;
    background: #f44043;
    text-align: right;
    .img{
      width: 50rpx;
      height: 50rpx;
      margin-top: 20rpx;
      margin-right: 40rpx;
    }
  }
  .user-section {
    height: 460upx;
    padding: 80upx 30upx 0;
    position: relative;
    background: url(../../static/userbg.png) no-repeat center;
    background-size: 100% 100%;
    
    .typerk{
      margin-top: 20rpx;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      text-align: center;
      color: #FFF;
      font-size: 28rpx;
      .number{
        font-weight: bold;
        font-size: 34rpx;
      }
    }
  }

  .user-info-box {
    height: 180upx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: 1;

    .portrait-box {
      position: relative;
    }

    .portrait {
      width: 140upx;
      height: 140upx;
      border: 5upx solid #fff;
      border-radius: 50%;
    }

    .gradeimg {
      position: absolute;
      bottom: -8rpx;
      right: -20rpx;
      height: 60rpx;
      width: 60rpx;
    }

    .info-box {
      flex: 1;
    }

    .username {
      font-size: $font-lg + 6upx;
      color: #FFFFFF;
      margin-left: 20upx;
    }

    .activity {
      min-width: 210rpx;
      padding: 6rpx 20rpx;
      background: #FFF;
      border-radius: 40rpx;
      font-size: 24rpx;
      text-align: center;

      image {
        width: 30rpx;
        height: 40rpx;
        display: inline-block;
        vertical-align: middle;
        margin-right: 8rpx;
      }

      text {
        vertical-align: middle;
      }
    }
  }

  .cover-container {
    padding: 0 20upx;
    position: relative;
    padding-bottom: 20upx;
    margin-top: -100rpx;
    margin-bottom: 100rpx;

    .arc {
      position: absolute;
      left: 0;
      top: -34upx;
      width: 100%;
      height: 36upx;
    }
  }

  .tj-sction {
    
    .tj-item {
      font-size: $font-sm;
      color: #75787d;
      display: flex;
      align-items: center;
      background: #FFF;
      padding: 20rpx;
      .yticon {
        font-size: 48upx;
        image {
          width: 60rpx;
          height: 60rpx;
        }
      }
      .conse{
       flex:1;
       padding:0 20rpx;
      }
      .num {
        font-size: 30rpx;
        color: #333333;
        &:last-child{
          color: #EE3847;
          font-size: 24rpx;
        }
      }
      .btn{
        border: 1rpx solid #8E8E8E;
        padding: 9rpx 18rpx;
        border-radius: 30rpx;
      }
    }

    
  }

  .order-section {
    @extend %section;
    padding: 28upx 0;

    .order-item {
      @extend %flex-center;
      width: 120upx;
      height: 120upx;
      border-radius: 10upx;
      font-size: $font-sm;
      color: $font-color-dark;
      position: relative;

      .cart-number {
        position: absolute;
        top: 0;
        right: 8rpx;
        min-width: 32upx;
        height: 32upx;
        border-radius: 16upx;
        background: red;
        color: #ffffff;
        text-align: center;
        line-height: 32upx;
        padding: 0 4rpx;
        z-index: 1;
      }
    }

    .yticon {
      font-size: 48upx;

      image {
        width: 60rpx;
        height: 60rpx;
      }
    }
  }

  .history-section {
    padding: 30upx 0 0;
    margin-top: 20upx;
    background: #fff;
    border-radius: 0 0 10rpx 10rpx;

    .sec-header {
      display: flex;
      align-items: center;
      font-size: $font-base;
      color: $font-color-dark;
      line-height: 40upx;
      margin-left: 30upx;

      .yticon {
        font-size: 44upx;
        color: #5eba8f;
        margin-right: 16upx;
        line-height: 40upx;
      }
    }

    .h-list {
      white-space: nowrap;
      padding: 30upx 30upx 0;

      image {
        display: inline-block;
        width: 160upx;
        height: 160upx;
        margin-right: 20upx;
        border-radius: 10upx;
      }
    }
  }

  .header {
    margin-top: 12rpx;
    padding: 20rpx 30rpx;
    font-size: 32rpx;
    border-bottom: 1px solid #DDDDDD;
    background: #FFFFFF;
    border-radius: 10rpx 10rpx 0 0;

    text {
      float: right;
      font-size: 26rpx;
      color: rgb(192, 196, 204);
    }
  }

  .coupon{
    white-space: nowrap;
    background: #FFF;
    padding: 20rpx ;
    .item{
      display: inline-block;
      width: 300rpx;
      overflow: hidden;
      font-size: 24rpx;
      position: relative;
      border-radius: 10rpx ;
      border: 1rpx solid #f1f1f1;
      padding: 0 10rpx;
      margin-right: 20rpx;
      .kk{
        display: flex;
        align-items: center;
      }
      .start{
        position: absolute;
        top: 0;
        left: 0;
        background: #EE3847;
        font-size: 20rpx;
        color: #FFF;
        padding: 6rpx 10rpx;
        border-radius: 10rpx 0 10rpx 0;
      }
      .conse{
        flex: 1;
        width: 0;
        padding: 20rpx 10rpx;
        
        .price{
          margin-top: 30rpx;
          font-size: 40rpx;
          color: #EE3847;
        }
        .tip{
          color: #EE3847;
        }
        .tips{
          color: #666;
        }
      }
      .btn{
        width: 40rpx;
        text-align: center;
        white-space: initial;
        color: #EE3847;
        border-left: 1rpx dashed #DDD;
        padding-left: 10rpx;
      }
    }
  }

  .guessimg{
    margin-top: 20rpx;
  }

</style>