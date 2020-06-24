<template>
  <view>
    <view class="com">
      <text class="tip" @click="open">活动规则</text>
      <image class="bg" :src="shareInfo.backGroudImage || '../../static/envelopes_activity.png'" mode="scaleToFill"></image>
      <view class="btn" @click="goshare">
        <image src="../../static/envelopes_activity_btn.png" mode="aspectFit"></image>
      </view>
    </view>
    <view class="share" :class="{x:share}" @click="noshare">
      <image src="../../static/envelopes_activity_share.png" mode="aspectFit"></image>
    </view>
    <uni-popup ref="popup" type="center">
      <view class="uni-tip">
        <view class="uni-tip-title">活动规则</view>
        <text class="input">{{ shareInfo.redpacketrule }}</text>
        <view class="uni-tip-group-button">
          <view class="uni-tip-button" @click="closes">确定</view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
  import uniPopup from '@/components/uni-popup/uni-popup.vue';
  export default {
    components: {
      uniPopup
    },
    data() {
      return {
        share: false,
        shareInfo: {
          redpacketrule: '', // 规则内容
          backGroudImage: '', // 背景图片
          sharebackGroudImage: '' // 分享图片
        }
      };
    },
    onShow() {
      this.$ajax.get('redpacket/redpacketshare', {}).then(res => {
        if (res.data.code == 0) {
          this.shareInfo = res.data.result.data;
          if (this.$wx.isWechat()) {
            let userInfo = uni.getStorageSync('userInfo');
            let _this = this;
            this.$wx.share({
                title: '福利享不停',
                desc: '这里有一份新人大礼包，快来领取！',
                imgUrl: _this.shareInfo.sharebackGroudImage
              },
              'http://ets.51pingce.net/pages/home/home?recommendloginguid=' + userInfo.guid
            );
          }
        } else {
          this.$api.msg(res.data.msg);
        }
      });
    },
    methods: {
      goshare() {
        this.share = !this.share;
      },
      noshare() {
        this.share = false;
      },
      open() {
        this.$refs.popup.open();
      },
      closes() {
        this.$refs.popup.close();
      }
    }

  }
</script>

<style lang="scss">
  .com {
    position: relative;
    min-height: 100vh;
    height: 960rpx;
    font-size: 0;

    .tip {
      position: absolute;
      top: 0;
      right: 0;
      padding: 20rpx 30rpx;
      font-size: 24rpx;
      z-index: 2;
      color: #FFF;
    }

    .bg {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
    }

    .btn {
      position: absolute;
      left: 64rpx;
      right: 64rpx;
      bottom: 35rpx;
      cursor: pointer;

      image {
        width: 615rpx;
        height: 248rpx;
      }
    }
  }

  .share {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba($color: #000000, $alpha: 0.6);
    z-index: 666;
    display: none;

    image {
      width: 600rpx;
      margin: 60rpx auto;
      display: block;
    }

    &.x {
      display: block;
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

  .uni-tip-group-button {
    margin-top: 10px;
  }

  .uni-tip-button {
    text-align: center;
    font-size: 14px;
    color: $base-color;
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

  /deep/ .uni-popup__wrapper-box {
    border-radius: 20rpx;
  }

  /deep/ .uni-tip-title {
    padding: 20rpx;
  }
</style>
