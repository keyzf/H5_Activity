<template>
  <view>
    <view class="title">
      <view class="tip">
        代付金额
      </view>
      <view class="price">{{data.real_price}}</view>
      <view class="name">
        {{data.goods}}
      </view>
    </view>
    <input type="text" v-model="tel" placeholder="请输入对方的手机号" />
    <view class="btn" @click="pushOther">
      发送
    </view>
    <view class="tips">
      你可以通过以下方式找朋友代付
    </view>
    <view class="pay">
      <view class="item" @click="open">
        <image src="../../static/adds.png" mode="aspectFit"></image>
        <view>当面扫码</view>
      </view>
      <view class="item cobyOrderSn" @click="config">
        <image src="../../static/adds.png" mode="aspectFit"></image>
        <view>复制口令</view>
      </view>
    </view>
    <canvas class="qrcode" canvas-id="qrcode-canvas" :style="{ width: cpSize + 'rpx', height: cpSize + 'rpx' }" />
    <uni-popup ref="assemble" class="assembles" type="center" @touchmove.stop="">
      <view>{{data.qrcode_notes}}</view>
      <view v-show="srce != ''">
        <image :src="srce" :style="{ width: cpSize + 'rpx', height: cpSize + 'rpx' }" class="qrcodeImg"></image>
      </view>
      <view>{{data.qrcode_notes_below}}</view>
    </uni-popup>
  </view>
</template>

<script>
  import QRCode from '@/store/qrcode.js';
  import Clipboard from '@/store/clipboard.min.js';
  import uniPopup from '@/components/uni-popup/uni-popup.vue';
  export default {
    components: {
      uniPopup
    },
    data() {
      return {
        ordernumber: '',
        tel: '',
        data: {},
        srce: '',
        cpSize: 500,
      };
    },
    onLoad(o) {
      this.ordernumber = o.ordernumber;
      this.onload()
    },
    methods: {
      onload() {
        var _this = this;
        _this.$ajax.get('order/getOtherPayMainInfo', {
          ordernumber: _this.ordernumber
        }).then(res => {
          if (res.data.code == 0) {
            _this.data = res.data.result.data;
            let qrcode = new QRCode({
              context: _this, // 上下文环境
              canvasId: 'qrcode-canvas', // canvas-id
              showLoading: true, // 是否显示loading
              loadingText: '加载中', // loading文字
              text: _this.data.qrcode, // 生成内容
              size: uni.upx2px(_this.cpSize), // 二维码大小
              background: '#FFF', // 背景色
              foreground: '#000', // 前景色
              correctLevel: 3, // 容错级别
              cbResult: function(res) {
                // 生成二维码的回调
                _this.srce = res;
              }
            });
          } else {
            _this.$api.msg(res.data.msg);
          }
        });
      },
      pushOther() {
        var _this = this;
        _this.$ajax.get('order/pushOtherPayMessage', {
          ordernumber: _this.ordernumber,
          tel: _this.tel,
          otherpaystring: _this.data.code
        }).then(res => {
          if (res.data.code == 0) {
            _this.$api.msg(res.data.msg);
            _this.back()
          } else {
            _this.$api.msg(res.data.msg);
          }
        });
      },
      open() {
        this.$refs.assemble.open();
      },
      config() {
        var _this = this;
        let clipboard = new Clipboard(".cobyOrderSn",{
          text: function () {
            return _this.data.code
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
      back(){
        var xh = getCurrentPages();
        xh.forEach((item,index) => {
          if(item.route.indexOf('/order/') != -1){
            uni.navigateBack({
              delta: xh.length - index
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  page {
    background: #f5f5f5;
    min-height: 100%;
    overflow: hidden;
  }

  .assembles {
    text-align: center;

    /deep/.uni-popup__wrapper-box {
      border-radius: 20rpx !important;
    }
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

  .title {
    background: linear-gradient(to right, #ee5738, #ee3a46);
    color: #FFF;
    padding: 20rpx 40rpx;
    text-align: center;
    font-size: 28rpx;

    .price {
      font-size: 40rpx;
      margin: 20rpx 0;
    }
  }

  input {
    margin: 20rpx;
    background: #FFF;
    display: block;
    height: 80rpx;
    padding: 0 20rpx;
  }

  .btn {
    width: 60%;
    margin: 20rpx auto;
    background: #ee3a46;
    border-radius: 10rpx;
    text-align: center;
    color: #FFF;
    line-height: 2.2;
  }

  .tips {
    font-size: 28rpx;
    padding: 20rpx;
    background: #FFF;
    margin: 20rpx 0;
  }

  .pay {
    display: flex;

    .item {
      flex: 1;
      text-align: center;
      font-size: 28rpx;

      image {
        width: 100rpx;
        height: 100rpx;
        display: block;
        margin: 0 auto;
      }
    }
  }
</style>
