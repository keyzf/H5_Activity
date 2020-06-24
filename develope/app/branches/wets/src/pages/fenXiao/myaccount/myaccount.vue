<!-- 我的账户页面 -->
<template>
  <view class="all">
    <head>
      <meta name="format-detection" content="telephone=no">
    </head>
    <view v-if="isapp()" :style="{height:stateBarHeight-40 + 'rpx','background-color': navBarBgColor}"></view>

    <view class="tophead">
      <view class="navigateBar" :style="{'background-color': navBarBgColor}">
        <image src="../../../static/teChanZhuanQu/whiteBack.png" mode="aspectFit" @click="back()"></image>
        <image class="headicon" :src="userInfo.headUrl" mode="scaleToFill" @click="back()"></image>
        <!-- 个人信息 -->
        <view class="infor" :style="{'background-color': navBarBgColor}">
          <view class="toptopheadiner">
            <view class="name">{{userInfo.name}}</view>
            <view class="level">
              <view class="leveltext">{{userInfo.level_name}}</view>
              <view class="levelicon">
                <image :src="getlevel(userInfo.level)"></image>
              </view>
            </view>
          </view>
          <view class="bottom">
            <view class="invitecode cobyOrderSn" @click="copy(userInfo.invite_code)">{{userInfo.invite_code}} 复制</view>
            <view class="coupon" @click="lookcoupon">查看优惠券</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 收入模块 -->
    <view class="income">
      <view class="bg"></view>
      <view class="content">

        <view class="l">
          <view class="t">累计收益(元)</view>
          <view class="l-t-v">{{incomeInfo.total}}</view>
          <view class="l-out" @click="withdraw">立即提现</view>
        </view>

        <view :style="{'background-color':'#dddddd','width':'1rpx','margin':'40rpx 0'}"></view>

        <view class="r">
          <view class="r-today-t">今日预估收益(元)</view>
          <view class="r-today-v">{{incomeInfo.todayPreview}}</view>
          <view class="r-today-t">本月预估收益(元)</view>
          <view class="r-today-v">{{incomeInfo.monthPreview}}</view>
        </view>

      </view>
    </view>

    <!-- 进度条模块 -->
    <view class="progress">
      <view class="pitem">
        <view class="title">订单量</view>
        <view class="p">
          <view class="pv" :style="{'width':getpercent(upgradeInfo.order_quantity,upgradeInfo.order_quantity_upgrade)}">{{upgradeInfo.order_quantity}}/{{upgradeInfo.order_quantity_upgrade}}</view>
        </view>
      </view>
      <view class="pitem">
        <view class="title">邀请量</view>
        <view class="p">
          <view class="pv" :style="{'width':getpercent(upgradeInfo.invite_quantity,upgradeInfo.invite_quantity_upgrade)}">{{upgradeInfo.invite_quantity}}/{{upgradeInfo.invite_quantity_upgrade}}</view>
        </view>
      </view>
      <view class="pitem">
        <view class="title">金&#12288;额</view>
        <view class="p">
          <view class="pv" :style="{'width':getpercent(upgradeInfo.money_quantity,upgradeInfo.money_quantity_upgrade)}">{{upgradeInfo.money_quantity}}/{{upgradeInfo.money_quantity_upgrade}}</view>
        </view>
      </view>
    </view>

    <!-- 账单模块 -->
    <view class="bottmlist">
      <scroll-view id="tab-bar" class="scroll-h" scroll-x="true" show-scrollbar="false" :scroll-into-view="scrollInto">
        <view v-for="(tab,index) in tabBars" :key="tab.id" class="uni-tab-item" :id="tab.id" :data-current="index"
          @click="ontabtap">
          <view :class="tabIndex==index?'itemtext':'itemtextnot'">
            <text :class="tabIndex==index?'uni-tab-item-title':'uni-tab-item-titlenot'">{{tab.name}}</text>
          </view>
        </view>
      </scroll-view>

      <swiper :current="tabIndex" class="swiper-box" :duration="300" @change="ontabchange" :style="{'flex': 1,'height':swiperHeight+'rpx'}">
        <swiper-item class="swiper-item" v-for="(tab,index1) in newsList" :key="index1">

          <scroll-view class="list" scroll-y="true" @scrolltolower="lower(tab.tabindex)" v-bind:style="{'height':'calc(100% - 0rpx)'}"
            enableBackToTop="true">
            <view class="item" v-for="(item,inde) in tab.datalist" :key="inde">
              <view class="head">
                <image :src="item.headUrl" mode="scaleToFill"></image>
                <view class="name">{{item.name}}</view>
              </view>
              <view class="money">￥{{item.income}}</view>
            </view>
            <!-- <uni-load-more :status="tab.tabindex == 0?loadingType0:loadingType1"></uni-load-more> -->
            <emptyView v-if="tab.datalist.length<1" :style="{'width':'750rpx','height':'500rpx'}"></emptyView>
            <uni-load-more v-if="tab.datalist.length>0" :status="tab.tabindex == 0?loadingType0:loadingType1" class="loadmore"></uni-load-more>
          </scroll-view>
        </swiper-item>

      </swiper>

    </view>
  </view>
</template>

<script>
  function toDecimal(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
      return;
    }
    f = Math.round(x * 100) / 100;
    return f;
  }
  import API from "@/store/api.js";
  import Clipboard from '@/store/clipboard.min.js';
  export default {

    onLoad() {
      this.stateBarHeight = this.globaldata.statusBarHeight + 110 || 110;
      this.getSwiperheight();
      this.getMyAccount();
      this.getMyAccountList('0', '')
      this.getMyAccountList('1', '')
    },
    onShow() {
      if (this.isapp()) {
        this.callHandler('CallNative', {
          'key': 'stateBarTextBlack',
          'showstatebar': '0'
        });
      }
    },
    data() {
      return {
        stateBarHeight: 100, //状态栏和导航栏的总高度
        navBarBgColor: 'rgba(252, 98, 42, 1)', //导航栏背景色
        tabtextColor: 'rgba(255,255,255,1)', //tab栏字体颜色
        orderpercent: '0%',
        invitepercent: '0%',
        moneypercent: '0%',
        tabBars: [{
          name: '待收益账单',
          isFinish: '0'
        }, {
          name: '已完成账单',
          isFinish: '1'
        }],
        scrollInto: "",
        tabIndex: 0,
        swiperHeight: 0,
        newsList: [{
          tabindex: '0',
          datalist: []
        }, {
          tabindex: '1',
          datalist: []
        }, ],
        loadingType0: 'more',
        loadingType1: 'more2',
        userInfo: {},
        upgradeInfo: {},
        incomeInfo: {},
        pagesize: '10',
        isFinish: '0'

      };
    },
    methods: {
      //提现
      withdraw() {
        uni.navigateTo({
          url: '../withdrawindex/withdrawindex'
        })
      },
      //返回
      back() {
        this.$jump.back();
      },
      //复制到剪切板
      copy(content) {
        if (this.isapp()) {
          this.callHandler('CallNative', {
            'key': 'ClipboardStr',
            'content': content
          });
        }else{
            var _this = this;
            let clipboard = new Clipboard(".cobyOrderSn",{
              text: function () {
                return content
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
        }

      },
      //查看优惠券
      lookcoupon() {
        if (this.isapp()) {
          this.callHandler('CallNative', {
            'key': 'distashcoupon',
          });
        }else{
          uni.navigateTo({
            url:'/pages/user/coupon'
          })
        }
      },
      //加载更多
      lower(e) {
        console.log(e);
        if ('0' == e) { //待收益
          let lastid = this.newsList[0].datalist[this.newsList[0].datalist.length - 1].id;
          this.getMyAccountList('0', lastid);

        } else if ('1' == e) { //已完成订单
          let lastid = this.newsList[1].datalist[this.newsList[1].datalist.length - 1].id;
          this.getMyAccountList('1', lastid);
        }
      },
      //计算百分比
      getpercent(a, b) {
        if (b == 0) return '0%';
        return (toDecimal(a / b) > 1 ? 1 : toDecimal(a / b)) * 100 + '%';
      },
      //获取level
      getlevel(level) {
        switch (level) {
          case 1:
            return '../../../static/fenXiao/level1.png';
            break;
          case 2:
            return '../../../static/fenXiao/level2.png';
            break;
          case 3:
            return '../../../static/fenXiao/level3.png';
            break;
        }
      },
      //获取swiper高度
      getSwiperheight() {
        let screenheight = 0;
        uni.getSystemInfo({
          complete(res) {
            console.log(res);
            screenheight = res.screenHeight * 2
          }
        });
        this.swiperHeight = (screenheight - this.stateBarHeight - 560);
      },
      ontabtap(e) {
        let index = e.target.dataset.current || e.currentTarget.dataset.current;
        this.switchTab(index);
      },
      ontabchange(e) {
        let index = e.target.current || e.detail.current;
        this.switchTab(index);
      },
      switchTab(index) {
        if (this.tabIndex === index) {
          return;
        }
        this.tabIndex = index;
        this.scrollInto = this.tabBars[index].id;
        if (this.tabIndex == 0) {
          this.isFinish = '0';
        } else if (this.tabIndex == 1) {
          this.isFinish = '1';
        }

      },
      getMyAccount() {
        API.MyAccount({
          // posterId: this.id
        }).then(res => {
          console.log(res);
          // 停止下拉刷新
          uni.stopPullDownRefresh();

          if (res.data.code != 0) {
            uni.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false
            })
            return
          }
          this.userInfo = res.data.result.data.userInfo;
          this.upgradeInfo = res.data.result.data.upgradeInfo;
          this.incomeInfo = res.data.result.data.incomeInfo;
        }).catch(err => {
          // 停止下拉刷新
          uni.stopPullDownRefresh();
          console.log(err);
        })
      },
      getMyAccountList(isFinish, lastid) {

        if ('0' == isFinish) { //待收益
          if (this.loadingType0 == 'nomore') {
            return;
          }
          this.loadingType0 = 'loading';
        } else if ('1' == isFinish) { //已完成订单
          if (this.loadingType1 == 'nomore') {
            return;
          }
          this.loadingType1 = 'loading';
        }
        API.MyAccountList({
          // posterId: this.id
          isFinish: isFinish,
          lastid: lastid,
          pagesize: this.pagesize
        }).then(res => {
          console.log(res);
          // 停止下拉刷新
          let list = res.data.result.data.list;
          if ('0' == isFinish) { //待收益
            this.loadingType0 = list.length >= this.pagesize ? 'more' : 'nomore';
          } else if ('1' == isFinish) { //已完成订单
            this.loadingType1 = list.length >= this.pagesize ? 'more' : 'nomore';
          }
          // 停止下拉刷新
          uni.stopPullDownRefresh();
          if (res.data.code != 0) {
            uni.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false
            })
            return
          }
          if ('0' === isFinish) {
            this.newsList[0].datalist = this.newsList[0].datalist.concat(list);
          } else if ('1' === isFinish) {
            this.newsList[1].datalist = this.newsList[1].datalist.concat(list);
          }
        }).catch(err => {
          // 停止下拉刷新
          uni.stopPullDownRefresh();
          console.log(err);
          if ('0' === isFinish) {
            this.loadingType0 = 'more';
          } else if ('1' === isFinish) {
            this.loadingType1 = 'more';
          }
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
    background-color: #f5f5f5;
  }

  .all {

    //底部账单模块
    .bottmlist {

      .scroll-h {
        width: 720rpx;
        height: 70rpx;
        white-space: nowrap;
        margin: 0 15rpx;
        justify-content: center;
        background-color: #FFFFFF;
        border: 1rpx solid #FFFFFF;
        border-radius: 10rpx;
        // background-color: #ee3847;

        /* flex-wrap: nowrap; */
        /* border-color: #cccccc;
			border-bottom-style: solid;
			border-bottom-width: 1px; */

        .uni-tab-item {
          flex-wrap: nowrap;
          // padding-left: 34upx;
          width: 50%;
          height: 100%;
          // padding: 0 10rpx;
          // padding-right: 34upx;
          // background-color: #ffff00;
          display: inline-block;
          border-radius: 10rpx;

          .itemtext {

            display: flex;
            flex-direction: column;
            text-align: center;
            color: #fff;

            .uni-tab-item-title {
              color: #fff;
              background-color: rgba(252, 98, 42, 1);
              font-size: 30upx;
              height: 67upx;
              line-height: 70upx;
              flex-wrap: nowrap;
              white-space: nowrap;
              border-radius: 8rpx;
            }
          }

          .itemtextnot {

            display: flex;
            flex-direction: column;
            text-align: center;
            color: rgba(252, 98, 42, 1);

            .uni-tab-item-titlenot {
              color: rgba(252, 98, 42, 1);
              background-color: #ffffff;
              font-size: 30upx;
              height: 67upx;
              line-height: 70upx;
              flex-wrap: nowrap;
              white-space: nowrap;
              border-radius: 8rpx;
            }
          }
        }
      }

      .swiper-box {
        position: relative;
        // top: 150rpx;
        background-color: #F5F5F5;
        // height: calc(100% - 400rpx);
        // height: 900rpx;

        .swiper-item {
          // flex: 1;
          // flex-direction: column;
          // background-color: #00ff00;
          // height: calc(100% - 400rpx);
          // height: 900rpx;

          .list {

            margin: 10rpx 0 0 0;

            .item {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
              padding: 10rpx 20rpx;
              background-color: #FFFFFF;
              margin: 1rpx 0;
              color: rgba(51, 51, 51, 1);
              font-size: 26rpx;

              .head {
                display: flex;
                flex-direction: row;
                align-items: center;

                image {
                  width: 60rpx;
                  height: 60rpx;
                }

                .name {
                  margin: 0 30rpx;
                }
              }

              .money {
                margin: 0 10rpx 0 0;
              }

            }

          }

        }
      }

    }

    //进度条模块
    .progress {
      color: rgba(51, 51, 51, 1);
      font-size: 26rpx;
      padding: 20rpx 15rpx;

      .pitem {
        margin: 10rpx 5rpx;
        display: flex;
        flex-direction: row;
        position: relative;
        height: 35rpx;

        .title {
          width: 13%;
        }

        .p {
          border: 1rpx solid rgba(252, 98, 42, 1);
          width: 85%;
          border-radius: 15rpx;
        }

        .pv {
          position: relative;
          width: 50%;
          height: 100%;
          background-color: rgba(252, 98, 42, 1);
          border-radius: 10rpx;
          line-height: 35rpx;
          text-align: right;
          padding: 0 10rpx;
          color: #FFFFFF;
          font-size: 20rpx;
        }

      }

    }

    // 收入模块
    .income {
      position: relative;

      .bg {
        background-color: rgba(252, 98, 42, 1);
        height: 180rpx;
        width: 100%;
        position: absolute;
        z-index: 5;
      }

      .content {
        position: relative;
        background-color: #FFFFFF;
        // top: 50rpx;
        // height: 350rpx;
        margin: 0 15rpx;
        border-radius: 20rpx;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        font-size: 26rpx;
        color: #333333;
        z-index: 10;

        .l {
          // background-color: #EE3847;
          width: 50%;
          padding: 20rpx;
          position: relative;

          .l-t-v {
            color: rgba(252, 98, 42, 1);
            font-size: 38rpx;
            margin: 20rpx 0;
          }

          .l-out {
            position: absolute;
            right: 20rpx;
            bottom: 40rpx;
          }

        }

        .r {
          // background-color: #4399FC;
          width: 50%;
          padding: 20rpx;

          .r-today-v {
            color: rgba(252, 98, 42, 1);
            font-size: 38rpx;
            margin: 15rpx 0;
          }
        }
      }

    }

    .tophead {
      top: 0;
      left: 0;
      right: 0;
      z-index: 10;
      display: flex;
      flex-direction: column;

      // 自定义导航栏
      .navigateBar {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        padding: 30rpx 0 0 0;
        padding-bottom: 20rpx;


        image {
          margin-left: 20rpx;
          padding: 8rpx;
          width: 50rpx;
          height: 50rpx;
        }

        .headicon {
          margin-left: 20rpx;
          margin-right: 20rpx;
          padding: 0rpx;
          width: 120rpx;
          height: 120rpx;
          border-radius: 120rpx;
          border: 4rpx solid rgba($color: #ffffff, $alpha: 0.6);
        }

        // 个人信息
        .infor {
          position: relative;
          text-align: center;
          background: #FFF;
          flex: 1;

          .toptopheadiner {
            display: flex;
            flex-direction: row;
            align-content: center;
            justify-content: space-between;
            margin: 0 0 10rpx 0;
            color: #FFFFFF;

            .name {
              font-size: 40rpx;

              word-break: break-word; //换行模式
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
            }

            .level {
              width: 200rpx;
              display: flex;
              flex-direction: row;
              justify-content: flex-end;
              align-items: center;
              margin: 0 30rpx 0 0;

              .leveltext {
                font-size: 24rpx;
              }

              image {
                padding: 8rpx;
                margin: 7rpx 0 0 0;
                width: 35rpx;
                height: 35rpx;
              }
            }

          }

          .bottom {
            display: flex;
            flex-direction: row;
            align-content: center;
            align-items: flex-end;
            color: rgba(51, 51, 51, 1);
            margin: 20rpx 0 0 0;


            .invitecode {
              font-size: 24rpx;
              background: linear-gradient(to right, #FDA12B, #FBD007);
              border-radius: 10rpx;
              padding: 0 13rpx;
            }

            .coupon {
              font-size: 28rpx;
              margin-left: 20rpx;
              background: linear-gradient(to right, #FDA12B, #FBD007);
              border-radius: 20rpx;
              padding: 0 13rpx;
            }

          }
        }

      }

    }
  }
</style>
