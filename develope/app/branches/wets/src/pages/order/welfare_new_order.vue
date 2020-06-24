<template>
  <view>
    <!-- 地址 -->
    <view class="address-section" @click="clickAddress()">
      <view class="order-content">
        <view class="cen">
          <view class="top">
            <text class="name">{{ addressData.receivername || '请选择收货地址' }}</text>
            <text class="mobile">{{ addressData.receivertel }}</text>
          </view>
          <text class="address">{{ addressData.address }}</text>
          <text class="tip">{{ data.customAddressMsg }}</text>
        </view>
        <text class="yticon icon-you"></text>
      </view>

      <image class="a-bg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAu4AAAAFCAYAAAAaAWmiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Rjk3RjkzMjM2NzMxMTFFOUI4RkU4OEZGMDcxQzgzOEYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Rjk3RjkzMjQ2NzMxMTFFOUI4RkU4OEZGMDcxQzgzOEYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGOTdGOTMyMTY3MzExMUU5QjhGRTg4RkYwNzFDODM4RiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGOTdGOTMyMjY3MzExMUU5QjhGRTg4RkYwNzFDODM4RiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PrEOZlQAAAiuSURBVHjazJp7bFvV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"></image>
    </view>
    <view class="goods-section" v-for="(shop, shopIndex) in data.shopinggoodslist" :key="shopIndex">
      <view class="g-header b-b">
        <text class="name">{{ shop.companyname }}</text>
      </view>
      <!-- 商品列表 -->
      <view class="g-item" v-for="(good, index) in shop.goodsinfo" :key="index">
        <image :src="good.pic.url"></image>
        <view class="right">
          <text class="title clamp">{{ good.productname }}</text>
          <text class="spec">{{ good.attributeshow }}</text>
          <view class="price-box">
            <text class="price">{{ good.newprice }}</text>
            <text class="number">x{{ good.number }}</text>
          </view>
          <uni-number-box class="step" :index="shopIndex" :min="1" :value="good.number" :isMin="good.number === 1"
            :zindex="index" @eventChange="numberChange"></uni-number-box>
          <text class="receivetimetips">{{ good.receiveTimeTips }}</text>
        </view>
      </view>
      <view class="yt-list">
        <view class="yt-list-cell b-b">
          <text class="cell-tit clamp">小计</text>
          <text class="cell-tip">{{ shop.subtotal }}</text>
        </view>
      </view>
    </view>
    <!-- 		<view class="yt-list">
			<view class="yt-list-cell desc-cell">
				<text class="cell-tit clamp">买家留言</text>
				<input class="desc" type="text" v-model="notes" placeholder="选填" placeholder-class="placeholder" />
			</view>
		</view> -->
    <!-- <view class="tips" v-if="shopids != undefined">友情提示:优惠券、活动和积分不能组合使用哦</view> -->
    <view class="yt-list">
      <!-- 金额明细 -->
      <view class="yt-list-cell b-b">
        <text class="cell-tit clamp">运费</text>
        <text class="cell-tip">{{ data.freight }}</text>
      </view>
    </view>
    <!-- 底部 -->
    <view class="footer">
      <view class="price-content">
        <text>实付款</text>
        <text class="price">{{ data.price_usemealcard }}</text>
        <view class="tip">{{ data.paystring }}</view>
      </view>
      <text class="submit" @click="submit">提交订单</text>
    </view>
  </view>
</template>

<script>
  import uimg from '@/components/uimg/uimg.vue';
  import QRCode from '@/store/qrcode.js';
  import uniPopup from '@/components/uni-popup/uni-popup.vue';
  import uniNumberBox from '@/components/uni-number-box.vue';
  export default {
    components: {
      uniNumberBox,
      uniPopup,
      uimg
    },
    data() {
      return {
        guid: '',
        welfareid: '',
        openub: 0,
        skuinfo: '',
        shopids: '',
        data: {},
        addressData: {},
        redpacketState: false,
        extraState: false,
        privilegepointState: false,
        notes: '',
        addressid: ''
      };
    },
    onLoad(options) {
      this.skuinfo = options.skuinfo;
      this.guid = uni.getStorageSync('userinfo').guid;
      this.welfareid = options.welfareid;
      if (this.welfareid != undefined && this.welfareid != null) {
        //福利
        this.getWelfareCheckout('');
      }else{
        uni.navigateBack()
      }
    },
    onBackPress() {
      this.$api.ovPage();
    },
    onShow() {
      if (this.$wx.isWechat()) this.$wx.share();
    },
    methods: {
      submit() {
        let _this = this;
        uni.showModal({
          title: '',
          content: '确定提交节日慰问品订单？',
          success: function(res) {
            if (res.confirm) {
              _this.$ajax.get('benefits/judgeWelfareAddress', {
                addressid: _this.addressid,
                welfareid: _this.welfareid
              }).then(res => {
                if (res.data.code == 0) {
                  _this.addOrder()
                }else{
                  uni.showModal({
                    title: '',
                    content: res.data.msg,
                    success: function(res) {
                      if (res.confirm) {
                        // 走下面
                        _this.addOrder()
                      }else{
                        _this.clickAddress()
                      }
                    }
                  });
                }
              });
            }
          }
        });
      },
      addOrder(){
        this.$ajax.get('benefits/addOrder', {
          addressid: this.addressid,
          guid: this.guid,
          welfareid: this.welfareid,
          openub: this.openub,
          skuinfo: this.skuinfo,
          notes:this.notes
        }).then(res => {
          console.log(res)
          if (res.data.code == 0) {
            if(res.data.result.data.jumppaymethods == 0){
              uni.redirectTo({
                url:'/pages/paysuccess/paysuccess?ordernumber='+res.data.result.data.ordernumber
              })
            }else{
              uni.navigateTo({
                url:'/pages/money/pay?ordernum='+res.data.result.data.ordernumber+'&price='+this.data.price_usemealcard
              })
            }
          } else {
            
          }
        });
      },
      getWelfareCheckout() {
        uni.showLoading({
          title: '加载中'
        });
        this.$ajax.get('benefits/checkOut', {
          addressid: this.addressid,
          guid: this.guid,
          welfareid: this.welfareid,
          openub: this.openub,
          skuinfo: this.skuinfo
        }).then(res => {
          if (res.data.code == 0) {
            this.data = res.data.result.data;
            this.addressData = res.data.result.data.addressinfo;
            this.addressid = res.data.result.data.addressinfo.addressid;
          } else {
            
          }
          uni.hideLoading();
        });
      },
      
      numberChange(data) {
        uni.showLoading({
          title: '加载中'
        });
        var skuinfo = [];
        this.data.shopinggoodslist.forEach((value, index) => {
          value.goodsinfo.forEach((val, ind) => {
            if (index == data.index && ind == data.zindex) {
              skuinfo.push({
                skuid: val.skuid.toString(),
                number: data.number
              })
            } else {
              skuinfo.push({
                skuid: val.skuid.toString(),
                number: val.number
              })
            }
          })
        })
        this.skuinfo = JSON.stringify(skuinfo);
        this.$ajax.get('benefits/checkOut', {
          addressid: this.addressid,
          guid: this.guid,
          welfareid: this.welfareid,
          openub: this.openub,
          skuinfo: this.skuinfo
        }).then(res => {
          if (res.data.code == 0) {
            this.data = res.data.result.data;
            this.addressData = res.data.result.data.addressinfo;
          } else {

          }
          uni.hideLoading();
        });
      },
      clickAddress() {
        let url = '/pages/address/address?source=1&isCustomAddress=' + this.data.isCustomAddress + '&welfareid='+ this.welfareid;
        this.navTo(url);
      },
      navTo(url) {
        uni.navigateTo({
          url
        });
      },
      //详情页
      navToDetailPage(item) {
        let id = item.productid;
        uni.navigateTo({
          url: '/pages/product/product?productid=' + id
        });
      },
      updateOrderAddress(id) {
        this.addressid = id;
        this.getWelfareCheckout();
      }
    }
  };
</script>

<style lang="scss">
  page {
    background: $page-color-base;
    padding-bottom: 100upx;
  }

  /deep/ .uni-popup__wrapper.uni-custom .uni-popup__wrapper-box {
    padding: 0;
    border-radius: 20rpx;
  }

  .maxmara {
    .title {
      font-size: 40rpx;
      margin: 40rpx 40rpx 0 40rpx;
    }

    .con {
      display: flex;
      align-items: center;
      padding: 40rpx;

      image {
        width: 80rpx;
        height: 80rpx;
      }

      .tip {
        margin-left: 30rpx;
        font-size: 28rpx;
        color: #c0c4cc;
      }
    }

    .btns {
      border-top: 1px solid #dddddd;
      display: flex;

      view {
        padding: 20rpx 0;
        flex-grow: 1;
        text-align: center;
        font-size: 28rpx;

        &.btn {
          background: $base-color;
          color: #fff;
        }
      }
    }
  }

  .identification {
    .title {
      font-size: 40rpx;
      margin: 40rpx;
      text-align: center;
    }

    .con {
      padding: 0 40rpx;

      input {
        width: 100%;
        border-bottom: 1px solid $base-color;
        padding: 8rpx;
        margin-bottom: 20rpx;
        height: 2.5em;
      }

      .tip {
        font-size: 28rpx;
        color: red;
      }
    }

    .btns {
      margin-top: 30rpx;
      border-top: 1px solid #dddddd;
      display: flex;

      view {
        padding: 20rpx 0;
        flex-grow: 1;
        text-align: center;
        font-size: 28rpx;

        &.btn {
          background: $base-color;
          color: #fff;
        }
      }
    }
  }

  .address-section {
    padding: 30upx 0;
    background: #fff;
    position: relative;

    .order-content {
      display: flex;
      align-items: center;
      padding-left: 20rpx;
    }

    .icon-shouhuodizhi {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 90upx;
      color: #888;
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
      font-size: 34upx;
      margin-right: 24upx;
    }

    .address {
      margin-top: 16upx;
      margin-right: 20upx;
      color: $font-color-light;
    }

    .tip {
      font-size: 24rpx;
      color: $base-color;
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
      height: 84upx;
      padding: 0 30upx;
      position: relative;
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
          color: $base-color;
        }

        .number {
          font-size: 26upx;
          color: $font-color-base;
          margin-left: 20upx;
        }
      }

      .receivetimetips {
        font-size: 24rpx;
        color: $base-color;
      }

      .step-box {
        position: relative;
      }
    }
  }

  .tips {
    font-size: 24rpx;
    color: $base-color;
    padding: 10rpx 30rpx;
  }

  .yt-list {
    margin-top: 16upx;
    background: #fff;
  }

  .yt-list-cell {
    display: flex;
    align-items: center;
    padding: 10upx 30upx 10upx 40upx;
    line-height: 70upx;
    position: relative;

    .tit {
      flex-grow: 1;
      font-size: 28rpx;
    }

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
        max-width: 120upx;
      }
    }

    .desc {
      flex: 1;
      font-size: $font-base;
      color: $font-color-dark;
      text-align: right;
    }
  }

  /* 支付列表 */
  .pay-list {
    padding-left: 40upx;
    margin-top: 16upx;
    background: #fff;

    .pay-item {
      display: flex;
      align-items: center;
      padding-right: 20upx;
      line-height: 1;
      height: 110upx;
      position: relative;
    }

    .icon-weixinzhifu {
      width: 80upx;
      font-size: 40upx;
      color: #6bcc03;
    }

    .icon-alipay {
      width: 80upx;
      font-size: 40upx;
      color: #06b4fd;
    }

    .icon-xuanzhong2 {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60upx;
      height: 60upx;
      font-size: 40upx;
      color: $base-color;
    }

    .tit {
      font-size: 32upx;
      color: $font-color-dark;
      flex: 1;
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
      flex-grow: 2;

      .tip {
        font-size: 24rpx;
      }
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
      display: flex;
      align-items: center;
      justify-content: center;
      width: 280upx;
      height: 100%;
      color: #fff;
      font-size: 32upx;
      background-color: $base-color;
    }
  }

  /* 优惠券面板 */
  .mask {
    display: flex;
    align-items: flex-end;
    position: fixed;
    left: 0;
    top: var(--window-top);
    bottom: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0);
    z-index: 9995;
    transition: 0.3s;

    .mask-content {
      width: 100%;
      min-height: 30vh;
      max-height: 70vh;
      background: #f3f3f3;
      transform: translateY(100%);
      transition: 0.3s;
      overflow-y: scroll;
      margin-bottom: 50px;
    }

    .temporarily {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: $base-color;
      color: #fff;
      text-align: center;
      padding: 20rpx;
    }

    &.none {
      display: none;
    }

    &.show {
      background: rgba(0, 0, 0, 0.4);

      .mask-content {
        transform: translateY(0);
      }
    }
  }

  /* 优惠券列表 */
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
      overflow: hidden;
      color: #ffffff;
      padding: 20rpx 30upx;
      text-align: center;
      background: #dddddd;
      height: 200rpx;

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

  .wanjia-gengduo-d {
    min-width: 30rpx;
    height: 50rpx;
    font-family: 'yticon' !important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    position: relative;

    &:after {
      content: '\E606';
      position: absolute;
      right: 0;
      top: 50%;
      margin-top: -8px;
      line-height: 1;
    }
  }
</style>
