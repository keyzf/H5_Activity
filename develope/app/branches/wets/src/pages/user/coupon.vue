<template>
  <view class="content">
    <view class="navbar">
      <view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{ current: tabCurrentIndex === index }"
        @click="tabClick(index)">{{ item.text }}</view>
    </view>

    <swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
      <swiper-item class="tab-content" v-for="(tabItem, tabIndex) in navList" :key="tabIndex">
        <scroll-view class="list-scroll-content" scroll-y @scrolltolower="getCouponMore">
          <!-- 空白页 -->
          <empty v-if="tabItem.loaded === true && tabItem.couponList.length === 0"></empty>

          <view class="coupon-item" v-for="(item, index) in tabItem.couponList" :key="index" @click="couponUse(tabIndex, index)">
            <view class="con">
              <view class="left" :class="tabIndex == 0 ? 'x' : ''">
                <text class="price">{{ item.discounts }}</text>
                <text>{{ item.limit }}</text>
              </view>
              <view class="right">
                <view class="title">{{ item.title }}</view>
                <view class="time">有效期{{ item.validtime }}</view>
                <view style="overflow: hidden;">
                  <text class="tips x" v-if="tabItem.state == 1" @click.stop="donate(item.usercouponid)">转赠</text>
                  <text class="tips x" v-if="item.targettype != 5 && item.supportjump != 0 && tabItem.state == 1">立即使用</text>
                </view>
                <text class="couponuse" v-if="tabItem.state == 2"></text>
                <text class="couponinvalid" v-if="tabItem.state == 3"></text>
              </view>
            </view>
          </view>

          <uni-load-more :status="tabItem.loadingType"></uni-load-more>
        </scroll-view>
      </swiper-item>
    </swiper>
    <view class="footer"><text class="submit" @click="dklq">领更多好券</text></view>
    <uni-popup ref="popup" type="center">
      <view class="uni-tip">
        <view class="uni-tip-title">优惠券使用说明</view>
        <text class="input">{{ msg }}</text>
        <view class="uni-tip-group-button">
          <view class="uni-tip-button" @click="closes">确定</view>
        </view>
      </view>
    </uni-popup>
    <uni-popup ref="donate" type="center" class="donate">
      <view class="uni-tip">
        <view class="uni-tip-title">转赠优惠券</view>
        <input class="number" type="number" v-model="tel" placeholder="请输入手机号码" maxlength="11" />
        <view class="btns">
          <text class="left" @click="nosubmit">取消</text>
          <text class="right" @click="submit">确定</text>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
  import uniPopup from '@/components/uni-popup/uni-popup.vue';
  import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
  import empty from '@/components/empty';
  export default {
    components: {
      uniLoadMore,
      empty,
      uniPopup
    },
    data() {
      return {
        msg: '',
        tabCurrentIndex: 0,
        pagesize: 10,
        id: 0,
        tel: '',
        navList: [{
            state: 1,
            text: '未使用',
            loadingType: 'more',
            couponList: []
          },
          {
            state: 2,
            text: '已使用',
            loadingType: 'more',
            couponList: []
          },
          {
            state: 3,
            text: '已失效',
            loadingType: 'more',
            couponList: []
          }
        ]
      };
    },

    onLoad(options) {},
    onShow(options) {
      if (this.$wx.isWechat()) this.$wx.share();
      this.navList[this.tabCurrentIndex].couponList = [];
      this.getCouponList(0);
    },
    //下拉刷新
    onPullDownRefresh() {
      this.navList[this.tabCurrentIndex].couponList = [];
      this.getCouponList(0);
    },
    //加载更多
    // onReachBottom() {
    //     // 获取优惠券列表
    // 	let length = this.navList[this.tabCurrentIndex].couponList.length;
    // 	let lastId = length > 0 ? this.navList[this.tabCurrentIndex].couponList[length - 1].id : 0;
    //     this.getCouponList(lastId);
    // },
    onNavigationBarButtonTap(e) {
      this.getCouponIntro();
    },
    methods: {
      // 领券
      dklq() {
        uni.navigateTo({
          url: '/pages/user/morecoupon'
        });
      },
      // 滚动到底部加载更多
      getCouponMore() {
        let navItem = this.navList[this.tabCurrentIndex];
        //防止重复加载
        if (navItem.loadingType === 'loading' || navItem.loadingType === 'noMore') {
          return;
        }
        let length = navItem.couponList.length;
        let lastId = length > 0 ? navItem.couponList[length - 1].id : 0;
        this.getCouponList(lastId);
      },
      //获取订单列表
      loadData(source) {
        //这里是将订单挂载到tab列表下
        let navItem = this.navList[this.tabCurrentIndex];
        //防止重复加载
        if (navItem.loadingType === 'loading' || navItem.loadingType === 'noMore') {
          return;
        }
        //tab切换只有第一次需要加载数据
        if (source === 'tabChange' && navItem.loaded === true) {
          return;
        }
        this.getCouponList(0);
      },
      // 获取优惠券列表
      getCouponList(lastId) {
        let navItem = this.navList[this.tabCurrentIndex];
        navItem.loadingType = 'loading';
        let data = {
          pagesize: this.pagesize,
          type: navItem.state
        };
        data.lid = lastId == 0 ? '' : lastId;
        this.$ajax.get('user/coupon', data).then(res => {
          console.log(res);
          if (res.data.code == 0) {
            navItem.couponList = navItem.couponList.concat(res.data.result.data);
            this.$set(navItem, 'loaded', true);
            navItem.loadingType = res.data.result.data.length == this.pagesize ? 'more' : 'noMore';
          } else {
            this.$api.msg(res.data.msg);
          }
          uni.stopPullDownRefresh();
        });
      },
      //swiper 切换
      changeTab(e) {
        this.tabCurrentIndex = e.target.current;
        this.loadData('tabChange');
      },
      //顶部tab点击
      tabClick(index) {
        this.tabCurrentIndex = index;
        this.loadData('tabChange');
      },
      // 转赠优惠券
      donate(usercouponid) {
        this.id = usercouponid;
        this.$refs.donate.open();
      },
      submit() {
        if (this.tel == "" || this.tel.length != 11) {
          this.$api.msg("请输入手机号");
          return;
        }
        uni.showLoading({
          title: '请稍等...'
        })
        this.$ajax.get('user/couponDonateByTel', {
          tel: this.tel,
          usercouponid: this.id
        }).then(res => {
          uni.hideLoading();
          this.$api.msg(res.data.msg);
          if (res.data.code == 0) {
            this.$refs.donate.close();
            this.navList[this.tabCurrentIndex].couponList = [];
            this.getCouponList(0);
            this.$api.msg("转赠成功");
          }
        });
      },
      nosubmit() {
        this.$refs.donate.close();
      },
      // 立即使用
      couponUse(itemIndex, index) {
        if (itemIndex != 0) return;
        let couponInfo = this.navList[this.tabCurrentIndex].couponList[index];
        switch (couponInfo.targettype) {
          case 1: // 跳转商品详情
            uni.navigateTo({
              url: '/pages/product/product?productid=' + couponInfo.keyword
            });
            break;
          case 2: // 跳转搜索
            if (couponInfo.couponkind == 3) {
              uni.navigateTo({
                url: '/pages/product/welfare-list?targettype=2&usercouponid=' + couponInfo.usercouponid +
                  '&targetids=' + couponInfo.keyword
              });
            } else {
              uni.navigateTo({
                url: '/pages/product/searchlist?mark=false&targetids=' + couponInfo.keyword
              });
            }
            break;
          case 3: // 跳转搜索
            uni.navigateTo({
              url: '/pages/product/searchlist?targetids=' + couponInfo.keyword
            });
            break;
          case 4: // 跳转店铺首页
            uni.navigateTo({
              url: '/pages/product/shop?cguid=' + couponInfo.cguid
            });
            break;
          case 5: // 不处理
            break;
          case 6: // 跳转首页分类
            uni.navigateTo({
              url: '/pages/product/catelist?id=' + couponInfo.keyword
            });
            break;
          case 7: // 跳转自营店铺列表
            uni.navigateTo({
              url: '/pages/product/shopproductlist?cguid=' + couponInfo.cguid
            });
            break;
        }
      },
      // 优惠券使用说明
      getCouponIntro() {
        this.$ajax.get('user/couponIntro', {}).then(res => {
          if (res.data.code == 0) {
            this.msg = res.data.result.data.detail;
            this.$refs.popup.open();
          } else {
            this.$api.msg(res.data.msg);
          }
        });
      },
      closes() {
        this.$refs.popup.close();
      }
    }
  };
</script>

<style lang="scss">
  page,
  .content {
    background: $page-color-base;
    height: 100%;
  }

  page {
    padding-bottom: 100rpx;
  }

  .swiper-box {
    height: calc(100% - 40px);
  }

  .list-scroll-content {
    height: 100%;
  }

  .navbar {
    display: flex;
    height: 40px;
    padding: 0 5px;
    background: #fff;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.06);
    position: relative;
    z-index: 10;

    .nav-item {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      font-size: 15px;
      color: $font-color-dark;
      position: relative;

      &.current {
        color: $base-color;

        &:after {
          content: '';
          position: absolute;
          left: 50%;
          bottom: 0;
          transform: translateX(-50%);
          width: 44px;
          height: 0;
          border-bottom: 2px solid $base-color;
        }
      }
    }
  }

  .uni-swiper-item {
    height: auto;
  }

  .coupon-item {
    margin: 20upx 24upx;
    background: #fff;
    overflow: hidden;

    .con {
      display: flex;
      align-items: center;
      position: relative;

      &:after {
        position: absolute;
        left: 0;
        bottom: 0;
        content: '';
        width: 100%;
        height: 0;
        border-bottom: 1px dashed #f3f3f3;
        transform: scaleY(50%);
      }
    }

    .left {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 240rpx;
      min-width: 240rpx;
      overflow: hidden;
      color: #ffffff;
      padding: 20rpx 30upx;
      text-align: center;
      background: #dddddd;
      height: 200rpx;
      font-size: 24rpx;

      &.x {
        background: #fa436a;
      }
    }

    .title {
      font-size: 32upx;
      color: $font-color-dark;
      margin-bottom: 10upx;
    }

    .time {
      font-size: 24upx;
      color: $font-color-light;
    }

    .right {
      font-size: 26upx;
      color: $font-color-base;
      flex-grow: 1;
      padding: 0 30upx;

      .couponinvalid {
        position: absolute;
        right: 30rpx;
        top: 30rpx;
        z-index: 3;
        width: 160rpx;
        height: 160rpx;
        background: url(../../static/coupon-invalid.png) no-repeat center;
        background-size: 100% 100%;
      }

      .couponuse {
        position: absolute;
        right: 30rpx;
        top: 30rpx;
        z-index: 3;
        width: 160rpx;
        height: 160rpx;
        background: url(../../static/coupon-use.png) no-repeat center;
        background-size: 100% 100%;
      }
    }

    .price {
      font-size: 44upx;
      color: #ffffff;
    }

    .tips {
      font-size: 24upx;
      color: $font-color-light;
      display: inline-block;
      border-radius: 20upx;
      margin-right: 30rpx;

      &.x {
        padding: 0 10upx;
        border: 1px solid #fa436a;
        color: #fa436a;
        float: right;
        margin-top: 10rpx;
      }
    }

    .received {
      position: absolute;
      top: 0;
      right: 10rpx;
    }
  }

  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 995;
    display: flex;
    align-items: center;
    width: 100%;
    height: 90upx;
    justify-content: space-between;
    font-size: 30upx;
    background-color: #fff;
    z-index: 998;
    color: $font-color-base;
    box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);

    .submit {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 750upx;
      height: 100%;
      color: #fff;
      font-size: 32upx;
      background-color: $base-color;
    }
  }

  /* load-more */
  .uni-load-more {
    display: flex;
    flex-direction: row;
    height: 80upx;
    align-items: center;
    justify-content: center;
  }

  .uni-load-more__text {
    font-size: 28upx;
    color: #999;
  }

  .uni-load-more__img {
    height: 24px;
    width: 24px;
    margin-right: 10px;
  }

  .uni-load-more__img>view {
    position: absolute;
  }

  .uni-load-more__img>view view {
    width: 6px;
    height: 2px;
    border-top-left-radius: 1px;
    border-bottom-left-radius: 1px;
    background: #999;
    position: absolute;
    opacity: 0.2;
    transform-origin: 50%;
    animation: load 1.56s ease infinite;
  }

  .uni-load-more__img>view view:nth-child(1) {
    transform: rotate(90deg);
    top: 2px;
    left: 9px;
  }

  .uni-load-more__img>view view:nth-child(2) {
    transform: rotate(180deg);
    top: 11px;
    right: 0;
  }

  .uni-load-more__img>view view:nth-child(3) {
    transform: rotate(270deg);
    bottom: 2px;
    left: 9px;
  }

  .uni-load-more__img>view view:nth-child(4) {
    top: 11px;
    left: 0;
  }

  .load1,
  .load2,
  .load3 {
    height: 24px;
    width: 24px;
  }

  .load2 {
    transform: rotate(30deg);
  }

  .load3 {
    transform: rotate(60deg);
  }

  .load1 view:nth-child(1) {
    animation-delay: 0s;
  }

  .load2 view:nth-child(1) {
    animation-delay: 0.13s;
  }

  .load3 view:nth-child(1) {
    animation-delay: 0.26s;
  }

  .load1 view:nth-child(2) {
    animation-delay: 0.39s;
  }

  .load2 view:nth-child(2) {
    animation-delay: 0.52s;
  }

  .load3 view:nth-child(2) {
    animation-delay: 0.65s;
  }

  .load1 view:nth-child(3) {
    animation-delay: 0.78s;
  }

  .load2 view:nth-child(3) {
    animation-delay: 0.91s;
  }

  .load3 view:nth-child(3) {
    animation-delay: 1.04s;
  }

  .load1 view:nth-child(4) {
    animation-delay: 1.17s;
  }

  .load2 view:nth-child(4) {
    animation-delay: 1.3s;
  }

  .load3 view:nth-child(4) {
    animation-delay: 1.43s;
  }

  @-webkit-keyframes load {
    0% {
      opacity: 1;
    }

    100% {
      opacity: 0.2;
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
    max-height: 60vh;
    overflow-y: auto;
  }

  .uni-tip-group-button {
    margin-top: 10px;
  }

  .uni-tip-button {
    text-align: center;
    font-size: 14px;
    color: $base-color;
  }

  .donate {
    z-index: 999;

    /deep/ .uni-popup__wrapper-box {
      border-radius: 20rpx;
      padding: 0 !important;
    }

    /deep/ .uni-tip-title {
      padding: 20rpx;
    }

    .number {
      line-height: 70rpx;
      height: 70rpx;
      font-size: 32rpx;
      border-bottom: 2px solid $base-color;
      margin: 20rpx;
    }

    .btns {
      border-top: 1px solid #DDD;
      overflow: hidden;

      text {
        width: 50%;
        float: left;
        line-height: 70rpx;
        text-align: center;
        font-size: 32rpx;

        &.right {
          border-left: 1px solid #DDD;
        }
      }
    }
  }
</style>
