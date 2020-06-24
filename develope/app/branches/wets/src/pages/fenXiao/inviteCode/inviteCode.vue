<!-- 填写邀请码 -->
<template>
  <view class="all">
    <view class="top">
      <!-- 非第一个tab的头部 -->
      <view class="navigateBarsecond" :style="{height:stateBarHeight + 'rpx','background-color': navBarBgColor}">
        <image src="../../../static/fenXiao/black_back.png" mode="aspectFit" @click="back"></image>
        <view class="navigateBartitle">{{navBarTitle}}</view>
        <view class="searchtext"></view>
      </view>
    </view>

    <view class="codes">
      <input class="input" maxlength="20" v-model="couponcode" placeholder="请填写邀请码"> </input>
    </view>
    <view class="connection">
      <view class="connectionbt" @click="commit">确定</view>
    </view>
  </view>
</template>

<script>
  // const API = require('../../common/api.js')
  import API from "@/store/api.js";
  export default {
    data() {
      return {
        stateBarHeight: 100, //状态栏和导航栏的总高度
        navBarBgColor: '#ffffff', //导航栏背景色
        tabtextColor: '#333333', //tab栏字体颜色
        navBarTitle: '填写邀请码', //导航栏标题
        couponcode: ''
      }
    },
    onLoad() {
      this.stateBarHeight = this.globaldata.statusBarHeight + 110 || 110;
      this.regiserh(); //注册handler
    },
    onShow() {
      if (this.isapp()) {
        this.callHandler('CallNative', {
          'key': 'stateBarTextBlack',
          'showstatebar': '0'
        });
      }
    },
    methods: {
      //返回
      back() {
        this.$jump.back();
      },
      regiserh() {
        let that = this;
        if (this.isapp()) {
          this.registerHandler("SCANRESULT", function(data, responseCallback) {
            var dirs = {};
            switch (uni.getSystemInfoSync().platform) {
              case 'android':
                dirs = JSON.parse(data);
                break;
              case 'ios':
                dirs = data;
                break;
              default:
                console.log('运行在开发者工具上')
                break;
            }
            that.couponcode = dirs.scanStr;
          });
        }

      },
      commit() {
        if (this.checkData()) {
          this.exchange();
        }
      },
      scan() {
        if (this.isapp()) {
          this.callHandler('CallNative', {
            'key': 'scan'
          })
        }
      },
      checkData() {
        if (this.isEmpty(this.couponcode)) {
          uni.showToast({
            title: '请填写邀请码',
            icon: 'none'
          })
          return false;
        } else {
          return true;
        }
      },
      exchange() {
        API.inviteCode({
          inviteCode: this.couponcode,
        }).then(res => {
          console.log(res);
          if (res.data.code == -1) {
            uni.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false
            })
          } else {
            // 兑换成功
            uni.showToast({
              title: res.data.msg
            })
            setTimeout(() => {
              uni.navigateBack();
            }, 500);
          }
        }).catch(err => {
          console.log(err);
        })
      },
      isapp() {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/holdmall/i) == 'holdmall') {
          return true;
        } else {
          return false;
        }
      }
    }
  }
</script>

<style lang="scss">
  page {
    background: #f5f5f5;
  }

  .all {

    display: flex;
    flex-direction: column;
    align-items: center;
    background: #f5f5f5;

    .top {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 10;
      display: flex;
      flex-direction: column;


      // 自定义导航栏 非第一个tab
      .navigateBarsecond {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 50rpx 0 0 0;
        padding-bottom: 10rpx;

        image {
          margin-left: 20rpx;
          margin-right: 20rpx;
          padding: 8rpx;
          width: 50rpx;
          height: 50rpx;
        }

        // 搜索模块
        .navigateBartitle {
          font-weight: bold;
          font-size: 34rpx;
        }

        .searchtext {
          width: 100rpx;
          font-size: 28rpx;
          color: rgba(51, 51, 51, 1);
        }
      }
    }

    .codes {
      width: 70%;
      height: 70rpx;
      // border: 1rpx solid #ddd;
      margin-top: 280rpx;
      background-color: #FFFFFF;
      // border-radius: 80rpx;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      image {
        width: 50rpx;
        height: 50rpx;
        margin: 0 30rpx 0 30rpx;

      }

      .input {
        width: 70%;
        margin: 0 0 0 30rpx;
      }
    }

    .connection {

      width: 100%;
      display: flex;
      justify-content: center;
      margin-top: 60rpx;
      background: #f5f5f5;
      padding: 10rpx 0 50rpx;

      .connectionbt {

        font-size: 32rpx;
        padding: 10rpx 20rpx;
        color: #FFFFFF;
        text-align: center;
        border-radius: 10rpx;
        background: linear-gradient(to right, #FC622A, #FC622A);
      }

    }

  }
</style>
