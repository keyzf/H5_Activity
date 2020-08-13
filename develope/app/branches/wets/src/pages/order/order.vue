<template>
  <view class="content">
    <view class="navbar">
      <view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{current: tabCurrentIndex === index}"
        @click="tabClick(index)">
        {{item.text}}
      </view>
    </view>

    <swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
      <swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
        <scroll-view class="list-scroll-content" scroll-y @scrolltolower="getOrderMore">
          <!-- 空白页 -->
          <empty v-if="tabItem.loaded === true && tabItem.orderList.length === 0"></empty>

          <!-- 订单列表 -->
          <view v-for="(item,index) in tabItem.orderList" :key="index" class="order-item">
            <view class="i-top b-b">
              <view class="time">
                <text>{{item.companyname}}</text>
              </view>
              <text class="state" :style="{color: item.stateTipColor}">{{item.statename}}</text>
              <text v-show="item.state == 3 || item.state == 7" class="del-btn yticon icon-iconfontshanchu1" @click="deleteOrder(index)"></text>
            </view>
            <view>
              <view class="shops">
                <view style="min-width:0;flex: 1;" v-if="item.products.length==1">
                  <view class="goods-box-single" v-for="(goodsItem, goodsIndex) in item.products" :key="goodsIndex"
                    @click="jumpOrderDetail(goodsItem,item.thirdPartyType)">
                    <image class="goods-img" :src="goodsItem.url" mode="aspectFill"></image>
                    <view class="right">
                      <text class="title clamp">{{goodsItem.productname}}</text>
                      <text class="attr-box">{{goodsItem.attributeshow}} x {{goodsItem.number}}</text>
                      <text class="price">{{goodsItem.newprice}}</text>
                    </view>
                  </view>
                </view>
                <view v-else class="goods-box">
                  <scroll-view scroll-x>
                    <view v-for="(goodsItem, goodsIndex) in item.products" :key="goodsIndex" @click="jumpOrderDetail(goodsItem,item.thirdPartyType)"
                      class="goods-item">
                      <image class="goods-img" :src="goodsItem.url" mode="aspectFill"></image>
                    </view>
                  </scroll-view>
                </view>
                <view class="price-box">
                  <view class="price">{{ item.real_price }}</view>
                  <view class="num">共{{ item.totalnumber }}件</view>
                </view>
              </view>

            </view>

            <view class="action-box b-t" v-show="item.state < 5 && item.thirdPartyType !=1">
              <button v-show="item.state == 0" class="action-btn" @click="cancelOrder('cancelOrder', item)">取消订单</button>
              <button v-show="item.closeorderbtn == 1" class="action-btn" @click="cancelOrders(item)">取消订单</button>
              <button v-show="item.state == 0" class="action-btn" @click="cancelOrder('resetCart', item)">退回购物车</button>
              <button v-show="item.state == 0" class="action-btn recom" @click="nacTo('/pages/money/pay?ordernum=' + item.ordernumber + '&price=' + item.real_price)">去支付</button>
              <button v-show="item.state == 1 || item.state == 2" class="action-btn" @click="nacTo('/pages/order/logistics?ordernum=' + item.ordernumber)">物流信息</button>
              <!-- <button v-show="item.state == 3 || item.state == 7" class="action-btn" @click="deleteOrder(index)">删除订单</button> -->
              <button v-show="item.state == 2" class="action-btn" @click="orderOk(index)">确认收货</button>
            </view>
          </view>

          <uni-load-more :status="tabItem.loadingType"></uni-load-more>

        </scroll-view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
  import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
  import empty from "@/components/empty";
  import API from "@/store/api.js";
  export default {
    components: {
      uniLoadMore,
      empty
    },
    data() {
      return {
        tabCurrentIndex: 0,
        navList: [{
            state: 0,
            text: '全部',
            loadingType: 'more',
            orderList: []
          },
          {
            state: 1,
            text: '待付款',
            loadingType: 'more',
            orderList: []
          },
          {
            state: 2,
            text: '待发货',
            loadingType: 'more',
            orderList: []
          },
          {
            state: 3,
            text: '待收货',
            loadingType: 'more',
            orderList: []
          },
          {
            state: 4,
            text: '待评价',
            loadingType: 'more',
            orderList: []
          }
        ],
        pagesize: 10
      };
    },
    onLoad(options) {
      /**
       * 修复app端点击除全部订单外的按钮进入时不加载数据的问题
       * 替换onLoad下代码即可
       */
      this.tabCurrentIndex = +options.state;
      this.loadData();
    },
    onShow() {
      if (this.$wx.isWechat()) this.$wx.share();
    },
    onBackPress() {
      this.$api.ovPage()
    },
    //下拉刷新
    onPullDownRefresh() {
      this.navList[this.tabCurrentIndex].orderList = [];
      this.getOrderList('');
    },
    //加载更多
    // onReachBottom() {
    //     // 获取优惠券列表
    // 	let length = this.navList[this.tabCurrentIndex].orderList.length;
    // 	let lastId = length > 0 ? this.navList[this.tabCurrentIndex].orderList[length - 1].orderid : 0;
    //     this.getOrderList(lastId);
    // },
    onNavigationBarButtonTap(e) {
      uni.navigateTo({
        url: '/pages/search/ordersearch'
      });
    },
    methods: {
      //首次加载
      loadData(source) {
        //这里是将订单挂载到tab列表下
        let index = this.tabCurrentIndex;
        let navItem = this.navList[index];
        //防止重复加载
        if (navItem.loadingType === 'loading' || navItem.loadingType === 'noMore') {
          return;
        }
        //tab切换只有第一次需要加载数据
        if (source === 'tabChange' && navItem.loaded === true) {
          return;
        }
        this.getOrderList('');
      },
      // 获取订单列表
      getOrderList(lastid) {
        //这里是将订单挂载到tab列表下
        let index = this.tabCurrentIndex;
        let navItem = this.navList[index];
        navItem.loadingType = 'loading';
        this.$ajax.get('order/getOrderList', {
          ordertype: navItem.state,
          lastid: lastid,
          pagesize: this.pagesize
        }).then(res => {
          if (res.data.code == 0) {
            let data = res.data.result.data;
            navItem.orderList = navItem.orderList.concat(data);
            //loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
            this.$set(navItem, 'loaded', true);
            //判断是否还有数据， 有改为 more， 没有改为noMore 
            navItem.loadingType = data.length == this.pagesize ? 'more' : 'noMore'
          } else {
            this.$api.msg('系统出错,请稍后再试');
          }
          uni.stopPullDownRefresh();
        });
      },
      // 滚到到底部加载更多
      getOrderMore() {
        let navItem = this.navList[this.tabCurrentIndex];
        //防止重复加载
        if (navItem.loadingType === 'loading' || navItem.loadingType === 'noMore') {
          return;
        }
        let length = navItem.orderList.length;
        let lastId = length > 0 ? navItem.orderList[length - 1].orderid : 0;
        this.getOrderList(lastId);
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
      // 跳转订单详情
      jumpOrderDetail(order,type) {
        if(type == 1){
          API.dianDiLoginToken({
            dianDiJumpType : 2,
            dianDiOrderNumber : order.ordernum
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
        }else{
          this.nacTo('/pages/order/orderdetails?ordernum=' + order.ordernum);
        }
      },
      // 页面跳转
      nacTo(url) {
        uni.navigateTo({
          url: url
        })
      },
      //删除订单
      deleteOrder(index) {
        let _this = this;
        uni.showModal({
          title: '删除提示',
          content: '确认删除订单吗？',
          success: res => {
            if (res.confirm) {
              uni.showLoading({
                title: '请稍后'
              })
              _this.$ajax.get('order/deleteorder', {
                ordernum: _this.navList[_this.tabCurrentIndex].orderList[index].ordernumber
              }).then(res => {
                uni.hideLoading();
                console.log(res);
                if (res.data.code == 0) {
                  _this.navList[_this.tabCurrentIndex].orderList.splice(index, 1);
                } else {
                  _this.$api.msg(res.data.msg);
                }
              });
            }
          }
        })
      },
      //取消订单、退回购物车
      cancelOrder(type, item) {
        let _this = this;
        if (type == 'cancelOrder') { // 取消订单
          uni.showModal({
            title: '提示',
            content: '确定要取消订单吗？',
            success: res => {
              if (res.confirm) {
                uni.showLoading({
                  title: '请稍后'
                });
                _this.$ajax.get('order/cancelorder', {
                  ordernum: item.ordernumber
                }).then(res => {
                  uni.hideLoading();
                  console.log(res);
                  if (res.data.code == 0) {
                    _this.navList[1].orderList = [];
                    _this.getOrderList('');
                  } else {
                    _this.$api.msg(res.data.msg);
                  }
                });
              };
            }
          });
        } else if (type == 'resetCart') { // 退回购物车
          uni.showModal({
            title: '提示',
            content: '是否将订单中的商品退回购物车？',
            success: res => {
              if (res.confirm) {
                uni.showLoading({
                  title: '请稍后'
                });
                _this.$ajax.get('order/createorderagain', {
                  ordernum: item.ordernumber
                }).then(res => {
                  uni.hideLoading();
                  console.log(res);
                  if (res.data.code == 0) {
                    uni.switchTab({
                      url: '/pages/cart/cart'
                    });
                  } else {
                    _this.$api.msg(res.data.msg);
                  }
                });
              };
            }
          })
        } else {

        }
      },
      // 福利订单取消
      cancelOrders(item) {
        var _this = this;
        uni.showModal({
          title: '提示',
          content: '确定要取消订单吗？',
          success: res => {
            if (res.confirm) {
              uni.showLoading({
                title: '请稍后'
              });
              _this.$ajax.get('order/closeandorder', {
                ordernum: item.ordernumber
              }).then(res => {
                uni.hideLoading();
                if (res.data.code == 0) {
                  _this.navList[2].orderList = [];
                  _this.getOrderList('');
                } else {
                  _this.$api.msg(res.data.msg);
                }
              });
            };
          }
        });
      },
      //订单状态文字和颜色
      orderStateExp(state) {
        let stateTip = '',
          stateTipColor = '#fa436a';
        switch (+state) {
          case 1:
            stateTip = '待付款';
            break;
          case 2:
            stateTip = '待发货';
            break;
          case 9:
            stateTip = '订单已关闭';
            stateTipColor = '#909399';
            break;

            //更多自定义
        }
        return {
          stateTip,
          stateTipColor
        };
      },
      // 确认收货
      orderOk(index) {
        let _this = this;
        uni.showModal({
          title: '提示',
          content: '是否确认收货',
          success: res => {
            if (res.confirm) {
              uni.showLoading({
                title: '请稍后'
              })
              _this.$ajax.get('order/confirmreceipt', {
                ordernum: _this.navList[_this.tabCurrentIndex].orderList[index].ordernumber
              }).then(res => {
                uni.hideLoading();
                console.log(res);
                if (res.data.code == 0) {
                  _this.navList[_this.tabCurrentIndex].orderList.splice(index, 1);
                } else {
                  _this.$api.msg(res.data.msg);
                }
              });
            }
          }
        })
      }
    },
  }
</script>

<style lang="scss">
  page,
  .content {
    background: $page-color-base;
    height: 100%;
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
    box-shadow: 0 1px 5px rgba(0, 0, 0, .06);
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

  .order-item {
    display: flex;
    flex-direction: column;
    padding-left: 30upx;
    background: #fff;
    margin-top: 16upx;

    .i-top {
      display: flex;
      align-items: center;
      height: 80upx;
      padding-right: 30upx;
      font-size: $font-base;
      color: $font-color-dark;
      position: relative;

      .time {
        flex: 1;
      }

      .state {
        color: $base-color;
      }

      .del-btn {
        padding: 10upx 0 10upx 36upx;
        font-size: $font-lg;
        color: $font-color-light;
        position: relative;

        &:after {
          content: '';
          width: 0;
          height: 30upx;
          border-left: 1px solid $border-color-dark;
          position: absolute;
          left: 20upx;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }

    .goods-img {
      width: 120rpx;
      height: 120rpx;
    }

    /* 多条商品 */
    .goods-box {
      height: 160upx;
      padding: 20upx 0;
      white-space: nowrap;
      flex: 1;
      min-width: 0;

      .goods-item {
        width: 120upx;
        height: 120upx;
        display: inline-block;
        margin-right: 24upx;
      }

      .goods-img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }

    /* 单条商品 */
    .goods-box-single {
      display: flex;
      padding: 20upx 0;

      .goods-img {
        display: block;
        width: 120upx;
        height: 120upx;
      }

      .right {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 0 30upx 0 24upx;
        overflow: hidden;

        .title {
          font-size: $font-base + 2upx;
          color: $font-color-dark;
          line-height: 1.2;
        }

        .attr-box {
          font-size: $font-sm + 2upx;
          color: $font-color-light;
          padding: 10upx 12upx 10rpx 0;
        }

        .price {
          font-size: $font-base + 2upx;
          color: $font-color-dark;
        }
      }
    }

    .shops {
      display: flex;
      align-items: center;
    }

    .price-box {
      padding: 20upx;
      color: #929292;
      text-align: right;

      .num {
        font-size: 24rpx;
      }

      .price {
        font-size: 36rpx;
        color: #333;

        &:before {
          content: '￥';
          font-size: $font-sm;
          margin: 0 2upx 0 8upx;
        }
      }
    }

    .action-box {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 100upx;
      position: relative;
      padding-right: 30upx;
    }

    .action-btn {
      width: 160upx;
      height: 60upx;
      margin: 0;
      margin-left: 24upx;
      padding: 0;
      text-align: center;
      line-height: 60upx;
      font-size: $font-sm + 2upx;
      color: $font-color-dark;
      background: #fff;
      border-radius: 100px;

      &:after {
        border-radius: 100px;
      }

      &.recom {
        background: #fff9f9;
        color: $base-color;

        &:after {
          border-color: #f7bcc8;
        }
      }
    }
  }


  /* load-more */
  .uni-load-more {
    display: flex;
    flex-direction: row;
    height: 80upx;
    align-items: center;
    justify-content: center
  }

  .uni-load-more__text {
    font-size: 28upx;
    color: #999
  }

  .uni-load-more__img {
    height: 24px;
    width: 24px;
    margin-right: 10px
  }

  .uni-load-more__img>view {
    position: absolute
  }

  .uni-load-more__img>view view {
    width: 6px;
    height: 2px;
    border-top-left-radius: 1px;
    border-bottom-left-radius: 1px;
    background: #999;
    position: absolute;
    opacity: .2;
    transform-origin: 50%;
    animation: load 1.56s ease infinite
  }

  .uni-load-more__img>view view:nth-child(1) {
    transform: rotate(90deg);
    top: 2px;
    left: 9px
  }

  .uni-load-more__img>view view:nth-child(2) {
    transform: rotate(180deg);
    top: 11px;
    right: 0
  }

  .uni-load-more__img>view view:nth-child(3) {
    transform: rotate(270deg);
    bottom: 2px;
    left: 9px
  }

  .uni-load-more__img>view view:nth-child(4) {
    top: 11px;
    left: 0
  }

  .load1,
  .load2,
  .load3 {
    height: 24px;
    width: 24px
  }

  .load2 {
    transform: rotate(30deg)
  }

  .load3 {
    transform: rotate(60deg)
  }

  .load1 view:nth-child(1) {
    animation-delay: 0s
  }

  .load2 view:nth-child(1) {
    animation-delay: .13s
  }

  .load3 view:nth-child(1) {
    animation-delay: .26s
  }

  .load1 view:nth-child(2) {
    animation-delay: .39s
  }

  .load2 view:nth-child(2) {
    animation-delay: .52s
  }

  .load3 view:nth-child(2) {
    animation-delay: .65s
  }

  .load1 view:nth-child(3) {
    animation-delay: .78s
  }

  .load2 view:nth-child(3) {
    animation-delay: .91s
  }

  .load3 view:nth-child(3) {
    animation-delay: 1.04s
  }

  .load1 view:nth-child(4) {
    animation-delay: 1.17s
  }

  .load2 view:nth-child(4) {
    animation-delay: 1.3s
  }

  .load3 view:nth-child(4) {
    animation-delay: 1.43s
  }

  @-webkit-keyframes load {
    0% {
      opacity: 1
    }

    100% {
      opacity: .2
    }
  }
</style>
