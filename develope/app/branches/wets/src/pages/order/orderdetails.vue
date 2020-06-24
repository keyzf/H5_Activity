<template>
  <view>
    <view class="orderstata">
      <text class="stat">{{ orderDetail.statename }}</text>
      <view class="tips">
        <!-- <text>需付款:</text>
                <text class="price">{{ orderDetail.real_price }}</text>
                <text>剩余:23小时58分钟</text> -->
      </view>
      <view class="btn" v-show="orderDetail.state == 0">
        <text @click="navTo('/pages/money/pay?ordernum=' + ordernum + '&price=' + orderDetail.real_price)"">去支付</text>
            </view>
        </view>
        <!-- 物流信息 -->
        <view class="
          address-section zjt" v-if="orderDetail.state != 0">
          <view class="order-content" @click="navTo('/pages/order/logistics?ordernum=' + ordernum)">
            <view class="yticon">
              <image class="logoimg" src="../../static/logistics.png" mode="aspectFit"></image>
            </view>
            <view class="cen" v-if="logistics.length > 0">
              <block v-if="logistics[0].logisticsname != ''">
                <view class="top">
                  <text class="name">{{ logistics[0].logisticsname }}</text>
                </view>
                <!-- <text class="address">{{ logistics[0].time }}</text> -->
              </block>
              <block v-else>
                <view class="top">
                  <text class="name">{{ logistics[1].logisticsname }}</text>
                </view>
                <!-- <text class="address">{{ logistics[1].time }}</text> -->
              </block>
            </view>
            <view class="cen" v-if="logistics.length == 0">
              <view class="top"><text class="name">暂无物流信息</text></view>
              <text class="address"></text>
            </view>
          </view>
      </view>
      <!-- 地址 -->
      <view class="address-section" v-if="orderDetail.isFictitiousForOrder == 0">
        <view class="order-content" @click="selectAddress">
          <text class="yticon icon-shouhuodizhi"></text>
          <view class="cen">
            <view class="top">
              <text class="name">{{ addressData.receivername }}</text>
              <text class="mobile">{{ addressData.receivertel }}</text>
            </view>
            <text class="address">{{ addressData.address }}</text>
            <text class="tip" v-show="addressData.alertaddrtips">{{ addressData.alertaddrtips }}</text>
          </view>
        </view>
      </view>
      <view class="address-section" v-else>
        <view class="order-content" style="padding: 0 30rpx;word-break: break-all;align-items: center;">
          <view class="cen">
            <view class="top">
              <text class="name">{{ orderDetail.fictitiousOrderDetilInfo.productname }}</text>
            </view>
            <view class="top">
              <text class="mobile">{{orderDetail.fictitiousOrderDetilInfo.convertcode}}</text>
            </view>
            <text class="address">{{ orderDetail.fictitiousOrderDetilInfo.converturl}}</text>
          </view>
          <view class="cobyOrderSn" @click="copyOrder">复制</view>
        </view>
      </view>

      <view class="goods-section">
        <view class="g-header b-b">
          <!-- <image class="logo" src="http://duoduo.qibukj.cn/./Upload/Images/20190321/201903211727515.png"></image> -->
          <text class="name">{{ orderDetail.companyname }}</text>
          <view class="telshop" v-if="orderDetail.verificationtel != ''" @click="opentel">
            <image src="../../static/telshop.png" mode="aspectFit"></image>
            <text>联系卖家</text>
          </view>
        </view>
        <!-- 商品列表 -->
        <view class="g-item" v-for="(goodsinfo, index) in orderDetail.products" :key="index" @click="navTo('/pages/product/product?productid=' + goodsinfo.productid)">
          <image :src="goodsinfo.url"></image>
          <view class="right">
            <text class="title clamp">{{ goodsinfo.productname }}</text>
            <text class="spec">{{ goodsinfo.attributeshow }}</text>
            <view class="price-box">
              <text class="price">{{ goodsinfo.newprice }}</text>
              <text class="number">x {{ goodsinfo.number }}</text>
              <!-- 是否显示红点 isShowReddot 退换货是否显示红点：0不显示，1显示 -->
              <text class="refund" v-show="goodsinfo.isshowbutton == 1" @click.stop="returnGoods(goodsinfo)">
                {{ goodsinfo.commentstate != 3 ? '售后服务' : '退货' }}
              </text>
              <text class="refund" v-show="goodsinfo.commentstate != 3" @click.stop="productcomment(goodsinfo)">
                {{ goodsinfo.commentstate == 1 ? '评价' : '追加评论' }}
              </text>
            </view>
          </view>
        </view>
        <!-- 留言 -->
        <view class="address-section" style="padding: 30rpx 20rpx 0 0;">
          <view class="order-content">
            <!-- <view class="yticon"><image class="logoimg" src="../../static/notes.png" mode="aspectFit"></image></view> -->
            <view class="cen">
              <view class="top"><text class="name">买家留言</text></view>
              <view class="top"><text class="name">{{ orderDetail.notes || '暂无留言' }}</text></view>
            </view>
          </view>
        </view>
      </view>


      <view class="assemble" v-if="orderDetail.groupbuyinfo_mid > 0">
        <view class="imgs">
          <image :src="item" mode="aspectFill" v-for="(item,index) in orderDetail.groupbuymember" :key="index"></image>
        </view>
        <view class="tip">
          {{orderDetail.groupbuyinfo_head_prefix}}<text>{{orderDetail.groupbuyinfo_head_number}}</text>{{orderDetail.groupbuyinfo_head_suffix}}
          <countdown class="indeblock" :time="orderDetail.groupbuyinfo_mid/1000" :day="false"></countdown>{{orderDetail.groupbuyinfo_end}}<br>{{orderDetail.groupbuyinfo_second_msg}}
        </view>
        <view class="btn" @click="openshare">分享给好友</view>
      </view>
      <view class="list">
        <view class="item" v-if="orderDetail.dealnumber">
          <text class="cell-tit">交 易 号：</text><text class="cell-tip">{{ orderDetail.dealnumber }}</text>
        </view>
        <view class="item" v-if="orderDetail.ordernumber != ''">
          <text class="cell-tit">订单编号：</text><text class="cell-tip">{{ orderDetail.ordernumber }}</text>
        </view>
        <view class="item" v-if="orderDetail.ordernumber != ''">
          <text class="cell-tit">下单时间：</text><text class="cell-tip">{{ orderDetail.ordernumber }}</text>
        </view>
        <view class="item" v-if="orderDetail.ordernumber != ''">
          <text class="cell-tit">发货时间：</text><text class="cell-tip">{{ orderDetail.ordernumber }}</text>
        </view>
        <view class="item" v-if="orderDetail.paymenttime">
          <text class="cell-tit">付款时间：</text>
          <text class="cell-tip">{{ orderDetail.paymenttime }}</text>
        </view>
        <view class="item" v-if="orderDetail.dealtypename != ''">
          <text class="cell-tit">支付方式：</text>
          <text class="cell-tip">{{ orderDetail.dealtypename }}</text>
        </view>
        <view class="item" v-if="orderDetail.couponvalue != 0">
          <text class="cell-tit">优 惠 券：</text>
          <text class="cell-tip red">-￥{{ orderDetail.couponvalue }}</text>
        </view>
        <view class="item" v-if="orderDetail.saleprice != 0">
          <text class="cell-tit">优惠活动：</text>
          <text class="cell-tip red">-￥{{ orderDetail.saleprice }}</text>
        </view>
        <view class="item" v-if="orderDetail.redpacketprice != 0">
          <text class="cell-tit">红包优惠：</text>
          <text class="cell-tip red">-￥{{ orderDetail.redpacketprice }}</text>
        </view>
        <view class="item" v-if="orderDetail.extradiscounts">
          <text class="cell-tit">U币优惠：</text>
          <text class="cell-tip red">-￥{{ orderDetail.extradiscounts }}</text>
        </view>

        <view class="yt-list">
          <view class="yt-list-cell">
            <text class="cell-tit clamp">商品总价</text>
            <text class="cell-tip">￥{{ orderDetail.product_price }}</text>
          </view>
          <view class="yt-list-cell">
            <text class="cell-tit clamp">运 费</text>
            <text class="cell-tip">￥{{ orderDetail.freight ? orderDetail.freight : '0' }}</text>
          </view>
          <view class="yt-list-cell" v-if="orderDetail.state != 0">
            <text class="cell-tit clamp"></text>
            <text class="cell-tip">实付款：{{ orderDetail.real_price }}</text>
          </view>
        </view>
      </view>

      <!-- 二维码 -->
      <view v-show="srce != ''">
        <image :src="srce" :style="{ width: cpSize + 'rpx', height: cpSize + 'rpx' }" class="qrcodeImg"></image>
      </view>
      <canvas class="qrcode" canvas-id="qrcode-canvas" :style="{ width: cpSize + 'rpx', height: cpSize + 'rpx' }" />
      <view class="recommend">
        <text>为</text>
        /
        <text>您</text>
        /
        <text>推</text>
        /
        <text>荐</text>
      </view>

      <view class="goods-list">
        <view class="goods-item" v-for="(item, index) in orderDetail.guessyoulike" :key="index" @click="navToDetailPage(item)">
          <image v-if="item.isNewOnShelvesProduct == 1" class="label" :src="item.newOnShelvesProductIcon" mode="aspectFit"></image>
          <view class="image-wrapper">
            <uimg :src="item.url"></uimg>
          </view>
          <view class="item-con">
            <view class="title clamp">
              <text v-if="item.presell" class="presell">{{ item.presell }}</text>
              {{ item.name }}
            </view>
            <view class="price-box clamp">
              <text class="price">{{ item.price }}</text>
              <text v-if="item.activitylist.length == 0">{{ item.sales }}</text>
              <view v-else>
                <text v-for="ite in item.activitylist" :key="ite.wholetext" :style="{ color: ite.color, borderColor: ite.color }">{{ ite.wholetext }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      <!-- 底部 -->
      <view class="footer" v-if="orderDetail.state == 0">
        <view class="price-content">
          <text>实付款</text>
          <text class="price">{{ orderDetail.real_price }}</text>
        </view>
        <text class="submit" @click="navTo('/pages/money/pay?ordernum=' + ordernum + '&price=' + orderDetail.real_price)">前往支付</text>
      </view>
      <!-- <view class="action-box">
        	<button class="action-btn">取消订单</button>
        	<button class="action-btn recom">去支付</button>
        </view> -->
      <uni-popup ref="assemble" class="assembles" type="center" @touchmove.stop="">
        <view class="layer">
          <view class="assemble">
            <view class="imgs">
              <image :src="item" mode="aspectFill" v-for="(item,index) in orderDetail.groupbuymember" :key="index"></image>
            </view>
            <view class="tip">
              {{orderDetail.groupbuyinfo_head_prefix}}<text>{{orderDetail.groupbuyinfo_head_number}}</text>{{orderDetail.groupbuyinfo_head_suffix}}
              <countdown class="indeblock" :time="orderDetail.groupbuyinfo_mid/1000" :day="false"></countdown><br>{{orderDetail.groupbuyinfo_second_msg}}
            </view>
            <view class="btn" @click="openshare">分享给好友</view>
          </view>
        </view>
      </uni-popup>
    </view>
</template>

<script>
  import uimg from "@/components/uimg/uimg.vue";
  import QRCode from '@/store/qrcode.js';
  import uniPopup from '@/components/uni-popup/uni-popup.vue';
  import countdown from '@/components/countdown/countdown.vue';
  import Clipboard from '@/store/clipboard.min.js';
  export default {
    components: {
      uniPopup,
      uimg,
      countdown
    },
    data() {
      return {
        //telpopup:false,
        srce: '',
        cpSize: 700,
        orderDetail: {
          state: 0,
          fictitiousOrderDetilInfo: {
            copyconvertcode: "",
            converturl: "",
            productname: "",
            convertcode: ""
          }
        },
        logistics: [],
        ordernum: 20190926876000,
        addressData: {
          level: '',
          guid: '',
          addressid: '',
          addresstype: '',
          defaultaddressstate: '',
          receivername: '',
          receivertel: '',
          address: '',
          postcode: '',
          alertaddrtips: ''
        }
      };
    },
    onLoad(options) {
      this.ordernum = options.ordernum;
    },
    onBackPress() {
      this.$api.ovPage()
    },
    onShow() {
      if (this.$wx.isWechat()) this.$wx.share();
      this.getOrderDetail();
      this.getlogistics();
    },
    methods: {
      openshare() {
        this.$refs.assemble.open();
      },
      // 二维码生成
      createQrcode(str) {
        let that = this;
        let qrcode = new QRCode({
          context: that, // 上下文环境
          canvasId: 'qrcode-canvas', // canvas-id
          showLoading: true, // 是否显示loading
          loadingText: '加载中', // loading文字
          text: str, // 生成内容
          size: uni.upx2px(that.cpSize), // 二维码大小
          background: '#FFF', // 背景色
          foreground: '#000', // 前景色
          correctLevel: 3, // 容错级别
          cbResult: function(res) {
            // 生成二维码的回调
            that.srce = res;
          }
        });
      },
      // 获取订单详情
      getOrderDetail() {
        this.$ajax.get('order/getOrderDetail', {
          ordernum: this.ordernum
        }).then(res => {
          if (res.data.code == 0) {
            this.orderDetail = res.data.result.data;
            this.addressData.address = this.orderDetail.address;
            this.addressData.addressid = this.orderDetail.addressid;
            this.addressData.receivername = this.orderDetail.receivername;
            this.addressData.receivertel = this.orderDetail.receivertel;
            this.addressData.alertaddrtips = this.orderDetail.alertaddrtips;
            if (this.orderDetail.showshare == 1) {
              this.$refs.assemble.open();
            }
            if (this.orderDetail.state == 1 || this.orderDetail.state == 2) this.createQrcode('mall_receipt:' +
              this.ordernum);
          } else {
            this.$api.msg('订单详情获取失败');
          }
          uni.hideLoading();
        });
      },
      getlogistics() {
        this.$ajax.get('order/getlogistics', {
          ordernum: this.ordernum
        }).then(res => {
          if (res.data.code == 0) {
            this.logistics = res.data.result.data;
          } else {
            this.$api.msg('物流信息获取失败');
          }
        });
      },
      navTo(url) {
        uni.navigateTo({
          url
        });
      },
      // 商品评价
      productcomment(goodsinfo) {
        let data = {};
        data.ordernum = this.ordernum;
        data.skuid = goodsinfo.skuid;
        data.attributes = goodsinfo.attribute;
        data.skutext = goodsinfo.attributeshow;
        data.url = goodsinfo.url;
        data.state = goodsinfo.commentstate;
        this.navTo('/pages/product/commentfrom?data=' + JSON.stringify(data));
      },
      // 是否可修改地址：0不可，1可以
      selectAddress() {
        if (this.orderDetail.isalertaddr == 1) {
          // 是否可自定义收货地址：0不可，1可以
          if (this.orderDetail.iscustomaddress == 0) {
            this.$api.msg(this.orderDetail.alertaddrerrormsg);
          } else {
            this.navTo('/pages/address/address?source=1');
          }
        } else {
          this.$api.msg(this.orderDetail.alertaddrerrormsg);
        }
      },
      updateOrderAddress() {
        this.$ajax
          .get('order/alertOrderAddress', {
            ordernum: this.ordernum,
            addrid: this.addressData.addressid
          })
          .then(res => {
            console.log(res);
            if (res.data.code == 0) {
              this.$api.msg('修改成功');
              setTimeout(function() {
                this.getOrderDetail();
                this.getlogistics();
              }, 1000);
            } else {
              this.$api.msg(res.data.msg);
              setTimeout(function() {
                this.getOrderDetail();
                this.getlogistics();
              }, 1000);
            }
          });
      },
      // 退货
      returnGoods(info) {
        if (info.isShowDialog == 1) {
          uni.showModal({
            title: '友情提示',
            content: info.isShowMsg,
            success: res => {
              if (res.confirm) {
                this.navTo('/pages/order/orderrefund?bopid=' + info.bopid);
              }
            }
          });
        } else {
          this.navTo('/pages/order/orderrefund?bopid=' + info.bopid);
        }
      },
      //详情页
      navToDetailPage(item) {
        let id = item.productid;
        uni.navigateTo({
          url: '/pages/product/product?productid=' + id
        });
      },
      opentel() {
        let _this = this;
        uni.makePhoneCall({
          phoneNumber: _this.orderDetail.verificationtel
        });
        //this.telpopup=true;
      },
      closetel() {
        this.telpopup = false;
      },
      telshow(e) {
        if (e.show == false) {
          this.telpopup = false;
        }
      },
      // 复制单号
      copyOrder() {
        var _this = this;
        let clipboard = new Clipboard(".cobyOrderSn",{
          text: function () {
            return _this.orderDetail.fictitiousOrderDetilInfo.converturl
          }
        });
        clipboard.on('success', function() {
          _this.$api.msg('复制成功');
          clipboard.destroy()
        });
        clipboard.on('error', function() {
          _this.$api.msg('复制失败');
          clipboard.destroy()
        });
      },
    }
  };
</script>

<style lang="scss">
  page {
    background: $page-color-base;
  }

  .qrcode {
    position: fixed;
    top: -47999px;
    left: -47999px;
    z-index: -99999;
  }

  .qrcodeImg {
    margin: 30rpx auto;
    display: block;
  }

  .orderstata {
    height: 300rpx;
    text-align: center;
    box-sizing: border-box;
    background: url(../../static/orderdetails.png) no-repeat center;
    background-size: 100% 100%;
    color: #ffffff;

    .stat {
      margin-top: 120rpx;
      display: inline-block;
      background: url(../../static/orderd.png) no-repeat left center;
      background-size: 30rpx 30rpx;
      padding-left: 45rpx;

      &.dd {
        margin-top: 60rpx;
        background: url(../../static/orderdd.png) no-repeat left center;
        background-size: 30rpx 30rpx;
      }

      &.gb {
        margin-top: 120rpx;
        background: url(../../static/ordergb.png) no-repeat left center;
        background-size: 30rpx 30rpx;
      }
    }

    .tips {
      margin: 10rpx 0;
      font-size: 30rpx;

      .price {
        font-size: 40rpx;
        margin-right: 20rpx;
      }
    }

    .btn {
      text-align: center;

      text {
        font-size: 30rpx;
        display: inline-block;
        background: #FFF;
        border-radius: 40rpx;
        text-align: center;
        padding: 10rpx 30rpx;
        color: #EE3847;
      }
    }
  }

  /deep/ .uni-popup__wrapper.uni-custom.center .uni-popup__wrapper-box {
    padding: 0;
    border-radius: 30rpx;
    min-width: 60%;
  }

  .showtel {
    text-align: center;

    .tel {
      padding: 70rpx 0;
    }

    .btn {
      border-top: 1px solid #ddd;
      font-size: 28rpx;
      padding: 20rpx;
    }
  }

  .recommend {
    padding: 30rpx 0 20rpx 0;
    text-align: center;
    color: #fa436a;
    font-size: 28rpx;

    text {
      font-size: 36rpx;
    }
  }

  .logoimg {
    width: 40rpx;
    height: 40rpx;
    margin: 0 25rpx;
  }

  .address-section {
    padding: 30rpx 20rpx 30rpx 0;
    background: #fff;
    position: relative;
    border-radius: 8rpx;
    margin-bottom: 20rpx;

    &.zjt {
      background: url(../../static/zjt.png) no-repeat right 6rpx center #FFFFFF;
      background-size: 16rpx;
    }

    .order-content {
      display: flex;
      align-items: flex-start;
    }

    .icon-shouhuodizhi {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 90upx;
      color: #000;
      font-weight: bold;
      font-size: 44upx;
    }

    .cen {
      display: flex;
      flex-direction: column;
      flex: 1;
      font-size: 28upx;
      color: $font-color-dark;
    }

    .name {
      font-size: 30upx;
      margin-right: 24upx;
      font-weight: 600;
    }

    .mobile {
      font-weight: 600;
    }

    .address {
      margin-top: 16upx;
      margin-right: 20upx;
      color: $font-color-light;
    }

    .tip {
      color: #F13B45;
    }

    .icon-you {
      font-size: 32upx;
      color: $font-color-light;
      margin-right: 30upx;
    }

    .a-bg {
      position: absolute;
      left: 0;
      bottom: 0;
      display: block;
      width: 100%;
      height: 5upx;
    }
  }

  .goods-section {
    margin-top: 16upx;
    background: #fff;
    padding-bottom: 1px;

    .g-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 84upx;
      padding: 0 30upx;
      position: relative;

      .telshop {
        image {
          width: 30rpx;
          height: 30rpx;
          vertical-align: bottom;
          margin-right: 10rpx;
        }

        font-size: 28rpx;
      }
    }

    .logo {
      display: block;
      width: 50upx;
      height: 50upx;
      border-radius: 100px;
    }

    .name {
      font-size: 30upx;
      color: $font-color-base;
      margin-left: 24upx;
    }

    .tel {
      margin-left: auto;
      color: #fa436a;
      font-size: 28rpx;
    }

    .g-item {
      display: flex;
      margin: 20upx 30upx;

      image {
        flex-shrink: 0;
        display: block;
        width: 140upx;
        height: 140upx;
        border-radius: 4upx;
      }

      .right {
        flex: 1;
        padding-left: 24upx;
        overflow: hidden;
      }

      .title {
        font-size: 30upx;
        color: $font-color-dark;
      }

      .spec {
        font-size: 26upx;
        color: $font-color-light;
      }

      .price-box {
        display: flex;
        align-items: center;
        font-size: 32upx;
        color: $font-color-dark;
        padding-top: 10upx;

        .price {
          margin-bottom: 4upx;
        }

        .number {
          font-size: 26upx;
          color: $font-color-base;
          margin-left: 20upx;
        }

        .refund {
          width: 120rpx;
          text-align: center;
          border: 1px solid #dddddd;
          border-radius: 20rpx;
          padding: 6rpx;
          font-size: 24rpx;
          margin-left: auto;
        }
      }

      .step-box {
        position: relative;
      }
    }
  }

  .yt-list {
    margin-top: 16upx;
    background: #fff;
    border-top: 1rpx solid #f1f1f1;
  }

  .list {
    margin-top: 20rpx;
    background: #FFFFFF;
    padding: 10rpx 20rpx 0 20rpx;
    border-radius: 10rpx;
    font-size: 28rpx;

    .item {
      color: #929292;

      .cell-tip {
        color: #333;
      }
    }
  }

  .yt-list-cell {

    display: flex;
    align-items: center;
    line-height: 60upx;
    position: relative;

    &.cell-hover {
      background: #fafafa;
    }

    &.b-b:after {
      left: 30upx;
    }

    .cell-icon {
      height: 32upx;
      width: 32upx;
      font-size: 22upx;
      color: #fff;
      text-align: center;
      line-height: 32upx;
      background: #f85e52;
      border-radius: 4upx;
      margin-right: 12upx;

      &.hb {
        background: #ffaa0e;
      }

      &.lpk {
        background: #3ab54a;
      }
    }

    .cell-more {
      align-self: center;
      font-size: 24upx;
      color: $font-color-light;
      margin-left: 8upx;
      margin-right: -10upx;
    }

    .cell-tit {
      flex: 1;
      font-size: 26upx;
      color: $font-color-light;
      margin-right: 10upx;
    }

    .cell-tip {
      font-size: 26upx;
      color: $font-color-dark;

      &.disabled {
        color: $font-color-light;
      }

      &.active {
        color: $base-color;
      }

      &.red {
        color: $base-color;
      }
    }

    &.desc-cell {
      .cell-tit {
        max-width: 90upx;
      }
    }

    .desc {
      flex: 1;
      font-size: $font-base;
      color: $font-color-dark;
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

    .price-content {
      padding-left: 30upx;
    }

    .price-tip {
      color: $base-color;
      margin-left: 8upx;
    }

    .price {
      font-size: 36upx;
      color: $base-color;
    }

    .submit {
      width: 280upx;
      color: #fff;
      font-size: 32upx;
      background-color: $base-color;
      flex-grow: inherit;
    }
  }

  /* 猜你喜欢 */
  .guess-section {
    display: flex;
    flex-wrap: wrap;
    padding: 30rpx;
    margin-top: 16rpx;
    background: #fff;
    margin-bottom: 100rpx;

    .guess-item {
      display: flex;
      flex-direction: column;
      width: 48%;
      padding-bottom: 40upx;

      &:nth-child(2n + 1) {
        margin-right: 4%;
      }

      .price-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-right: 10upx;
        font-size: 24upx;
        color: $font-color-light;
      }
    }

    .image-wrapper {
      width: 100%;
      height: 330upx;
      overflow: hidden;

      image {
        width: 100%;
        height: 100%;
        opacity: 1;
        border-radius: 10rpx;
      }

      img {
        width: 100%;
        height: 100%;
        opacity: 1;
        border-radius: 10rpx;
      }
    }

    .title {
      font-size: $font-lg;
      color: $font-color-dark;
      line-height: 80upx;
    }

    .price {
      font-size: $font-lg;
      color: $uni-color-primary;
      line-height: 1;
    }

    .typename {
      font-size: 24rpx;
      padding: 0rpx 8rpx;
      background: $uni-color-primary;
      color: white;
      margin-right: 12rpx;
      border-radius: 6rpx;
    }

    .companyname {
      font-size: 24rpx;

      &:after {
        content: '>';
        font-size: 24rpx;
        margin: 0 0 0 8rpx;
      }
    }
  }

  .assemble {
    margin: 20rpx 30rpx;

    .imgs {
      text-align: center;

      image {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        margin: 0 10rpx;
        display: inline-block;
      }
    }

    .tip {
      margin-top: 20rpx;
      text-align: center;
      font-size: 32rpx;
      line-height: 48rpx;

      .indeblock {
        display: inline-block;
      }

      text {
        color: $base-color;
      }
    }

    .btn {
      margin-top: 10rpx;
      background: $base-color;
      color: #FFF;
      font-size: 32rpx;
      line-height: 80rpx;
      text-align: center;
      border-radius: 10rpx;
      width: 90%;
      margin: 0 auto;
    }
  }

  .assembles {
    /deep/ .uni-popup__wrapper-box {
      background: url(../../static/share_group_buy_pop.webp) no-repeat center !important;
      background-size: 100% 100% !important;
      ;
      width: 750rpx;
      height: 760rpx;
      max-width: inherit !important;
      max-height: inherit !important;
      ;
    }

    .layer {
      width: 90%;
      margin: 0 auto;
      margin-top: 320rpx;

      .btn {
        margin-top: 40rpx;
        background: rgb(220, 208, 38);
        color: $base-color;
        font-weight: bold;
      }
    }
  }

  .action-box {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 6;
    background: #FFFFFF;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 100upx;
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
</style>
