<!-- 提现首页 -->
<template>
  <view class="all">

    <view class="top">
      <!-- 非第一个tab的头部 -->
      <view class="navigateBarsecond" :style="{height:stateBarHeight + 'rpx','background-color': navBarBgColor}">
        <image src="../../../static/fenXiao/black_back.png" mode="aspectFit" @click="back"></image>
        <view class="navigateBartitle">{{navBarTitle}}</view>
        <view class="searchtext" @click="todetail">明细</view>
      </view>
    </view>

    <view class="line" :style="{'margin-top':(stateBarHeight+10)+'rpx'}"></view>
    <view class="image">
      <image src="../../../static/fenXiao/withdraw.png"></image>
    </view>

    <view class="title">收益金额</view>
    <view class="money">{{income}}</view>

    <view class="btns">
      <view class="connectionbt" @click="commitout">提现到支付宝</view>
      <view class="connectionbt" @click="changeaccount" v-if="haveAlipayAccount === '1'">换绑支付宝账号</view>
    </view>

    <!-- 弹窗 -->
    <uni-popup :show="showtip" :type="type" :mask-click="false" @change="change">
      <view class="uni-tip">
        <view class="close">
          <view></view>
          <image src="../../../static/fenXiao/close.png" @click="cancel()"></image>
        </view>
        <view class="uni-tip-title">提现金额： {{real_income}}</view>
        <view class="uni-tip-title">提现账户： {{alipayAccount}}</view>
        <view class="tip">{{incomeTips}}</view>
        <view class="connection">
          <view class="connectionbt" @click="commit">确认提现</view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
  import uniPopup from '@/components/uni-popup/uni-popup.vue';
  import API from "@/store/api.js";
  export default {
    components: {
      uniPopup
    },
    onLoad() {
      this.stateBarHeight = this.globaldata.statusBarHeight + 110 || 110;
      this.getList();
    },
    onShow() {
      if (this.isapp()) {
        this.callHandler('CallNative', {
          'key': 'stateBarTextBlack',
          'showstatebar': '0'
        });
      }
    },
    onNavigationBarButtonTap(e) {
      uni.navigateTo({
        url: '../withdrawdetail/withdrawdetail'
      })
    },

    data() {
      return {
        stateBarHeight: 100, //状态栏和导航栏的总高度
        navBarBgColor: '#ffffff', //导航栏背景色
        tabtextColor: '#333333', //tab栏字体颜色
        navBarTitle: '收益账户', //导航栏标题
        showtip: false,
        type: '',
        income: '',
        real_income: '',
        incomeTips: '',
        haveAlipayAccount: '0',
        alipayAccount: ''
      };
    },
    methods: {
      //返回
      back() {
        this.$jump.back();
      },
      todetail() {
        uni.navigateTo({
          url: '../withdrawdetail/withdrawdetail'
        })
      },
      getList() {
        API.PreviewWithdraw({
          // posterId: this.id
        }).then(res => {
          console.log(res);
          // 停止下拉刷新
          if (res.data.code != 0) {
            uni.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false
            })
            return
          }
          this.income = res.data.result.data.income;
          this.haveAlipayAccount = res.data.result.data.haveAlipayAccount + '';
          this.alipayAccount = res.data.result.data.alipayAccount;
          this.incomeTips = res.data.result.data.incomeTips;
          this.real_income = res.data.result.data.real_income;

        }).catch(err => {
          // 停止下拉刷新
          uni.stopPullDownRefresh();
          console.log(err);
        })
      },
      //提现到支付宝
      commitout() {
        if (this.haveAlipayAccount === '0') { //去绑定
          let that = this;
          uni.$once('bindhaveAlipayAccount', function(data) {
            if (data.keyword == '1') {
              that.haveAlipayAccount === '1'
            }
          })
          uni.navigateTo({
            url: '../bindAliAccound/bindAliAccound?haveAlipayAccount=' + this.haveAlipayAccount
          })
        } else if (this.haveAlipayAccount === '1') { //去提现

          this.togglePopup();

        }
      },

      //换绑
      changeaccount() {
        uni.navigateTo({
          url: '../bindAliAccound/bindAliAccound?haveAlipayAccount=' + this.haveAlipayAccount
        })
      },
      togglePopup() {
        // uni.showToast({
        // 	title:'jjj'
        // })
        // console.log("bbbbbb");
        // this.content = '居中弹出 popup'
        this.type = 'center';
        this.showtip = true;
      },
      cancel() {
        this.showtip = false;
      },
      commit() {
        this.exchange();
      },
      change(e) {
        console.log('是否打开:' + e.show)
        if (!e.show) {
          this.showtip = false
        }
      },
      //确定提现
      exchange() {
        API.withdraw({
          // posterId: this.id
        }).then(res => {
          this.showtip = false;
          console.log(res);
          // 停止下拉刷新
          if (res.data.code != 0) {
            uni.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false
            })
            return
          } else {
            uni.showToast({
              title: res.data.msg
            })
          }
        }).catch(err => {
          console.log(err);
          this.showtip = false;
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
    background-color: #FFFFFF;
  }

  .all {

    display: flex;
    flex-direction: column;
    align-items: center;

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


    .line {
      background-color: #f5f5f5;
      height: 1rpx;
      width: 100%;
    }

    .image {

      margin: 70rpx 0 50rpx 0;

      image {

        width: 180rpx;
        height: 180rpx;
      }

    }

    .title {
      font-size: 36rpx;
      color: #333333;
    }

    .money {
      font-size: 56rpx;
      color: #EE3847;
      margin: 5rpx 20rpx;
    }

    .btns {

      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-top: 60rpx;
      background: #FFFFFF;
      padding: 10rpx 0 50rpx;

      .connectionbt {

        width: 70%;
        height: 80rpx;
        font-size: 32rpx;
        color: #FFFFFF;
        border-radius: 10rpx;
        margin: 10rpx;
        text-align: center;
        line-height: 80rpx;
        background: linear-gradient(to right, #DA494D, #DA494D);
      }

    }

    /* 提示窗口 */
    .uni-tip {
      display: flex;
      flex-direction: column;
      padding: 15px 15px 15px 30px;
      width: 300px;
      background-color: #fff;
      border-radius: 10px;
      justify-content: start;

      .close {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        image {
          width: 28rpx;
          height: 28rpx;
          margin: 0 20rpx 0 0;
        }
      }

      .uni-tip-title {

        // text-align: center;
        font-weight: bold;
        font-size: 16px;
        margin-top: 10rpx;
        color: #000000;
      }

      .tip {
        font-size: 18rpx;
        color: #01AAFD;
        margin-top: 20rpx;
      }

      .connection {
        display: flex;
        justify-content: center;
        margin: 50rpx 0 5rpx 0;

        .connectionbt {
          background-color: #DA494D;
          color: #FFFFFF;
          font-size: 32rpx;
          padding: 15rpx 60rpx;
          border-radius: 15rpx;
        }

      }

    }
  }
</style>
