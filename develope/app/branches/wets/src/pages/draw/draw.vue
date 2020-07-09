<template>
  <view class="conbox">
    <view class="navigateBar" v-if="stateBarHeight>0" :style="{height:stateBarHeight + 'rpx'}">
      <image src="../../static/index/whiteBack.png" mode="scaleToFill" @click="back"></image>
      <view class="middle">幸运大转盘</view>
      <view class="helpText"></view>
    </view>
    <view class="container" :class="{x:isapp()}">
      <!-- 背景 -->
      <image src="../../static/images/bg.png" class="cont"></image>
      <view class="main" style="padding-top: 50upx;">
        <image src="../../static/img/title.png" mode="aspectFit" class="titleimgse"></image>
        <view class="rule">
          <text @click="openguize()">规则</text>
        </view>
        <view class="canvas-container">
          <view :animation="animationData" class="canvas-content" id="zhuanpano" style="">
            <view class="canvas-list">
              <view class="canvas-item" :style="{transform: 'rotate('+(index * width)+'deg)', zIndex:index, }" v-for="(iteml,index) in list"
                :key="index">
                <view class="canvas-item-text" :style="'transform:rotate('+(index )+')'">
                  <text class="b" style="font-size: 40upx;">{{iteml.icon}}</text>
                </view>
              </view>
            </view>
          </view>
          <view @tap="playReward" class="canvas-btn" v-bind:class="btnDisabled">
            <view>抽奖</view>
          </view>
        </view>
      </view>
      <view class="number">剩余{{number}}次抽奖机会</view>
      <view class="btn" @click="gobuy"></view>
      <view class="typelist">
        <text :class="{x:types == 0}" @click="typesedit(0)">任务攻略</text>
        <text :class="{x:types == 1}" @click="typesedit(1)">我的中奖记录</text>
        <text :class="{x:types == 2}" @click="typesedit(2)">中奖榜单</text>
      </view>
      <view class="prizecon">
        <view class="guize" v-show="types==0">
          <view class="g_item">
            1.活动期间用户每天登录商城，即有1次抽奖机会；
          </view>
          <view class="g_item">
            2.活动期间用户每次下单成功，可额外获得2次抽奖机会；
          </view>
          <view class="g_item">
            3.活动期间用户每天邀请朋友一起来玩，可额外收获机会；
          </view>
          <view class="g_item">
            4.新用户关注电科商城公众号，可收获更多惊喜；
          </view>
        </view>
        <table class="prize" v-show="types==1">
          <tr>
            <td>序号</td>
            <td>时间</td>
            <td>奖项</td>
          </tr>
          <tr v-for="(item,index) in mys" :key="index">
            <td>{{index + 1}}</td>
            <td>
              {{item.lottery_time}}
            </td>
            <td>
              {{item.prize_name}}
            </td>
          </tr>
        </table>
        <table class="prize" v-show="types==2">
          <tr>
            <td>序号</td>
            <td>奖项</td>
            <td>用户名</td>
          </tr>
          <tr v-for="(item,index) in general" :key="index">
            <td>{{index + 1}}</td>
            <td>
              {{item.prize_name}}
            </td>
            <td>
              {{intercept(item.user_name)}}
            </td>
          </tr>
        </table>
      </view>
    </view>
    <uni-load-more v-show="types != 0" :status="loading"></uni-load-more>
    <uni-popup ref="popup" type="center">
      <view class="draw">
        <text class="del" @click="close"></text>
        <view class="con">
          <image src="@/static/img/tip.png" mode="aspectFit"></image>
          <view class="title" v-if="type != 3">
            {{tip[type]}}
          </view>
          <view class="title" v-else>
            {{tips}}
          </view>
          <view class="btns" v-if="type == 0">
            <text @click="gobuy">商城购物</text>
            <text @click="go">查看奖券</text>
          </view>
          <view class="btns" v-if="type == 1">
            <text @click="go">查看奖券</text>
            <text @click="invitation">邀请他人</text>
          </view>
          <view class="btns" v-if="type == 2">
            <text @click="go">查看奖券</text>
            <text @click="close">继续抽奖</text>
          </view>
          <view class="btns" v-if="type == 3">
            <text @click="go">查看奖券</text>
            <text @click="invitation">邀请他人</text>
          </view>
          <view class="btns" v-if="type == 4">
            <text @click="go">查看奖券</text>
            <text @click="close">继续抽奖</text>
          </view>
          <view class="btns" v-if="type == 5">
            <text @click="gologin">登录注册</text>
          </view>
        </view>
      </view>
    </uni-popup>

    <uni-popup ref="guize" type="center" class="ysguize">
      <!-- 规则 -->
      <view class="guize">
        <view class="title">
          活动规则
        </view>
        <view class="g_item">
          1.活动时间：2020年x月xx日——2020年x月xx日；
        </view>
        <view class="g_item">
          2.抽到的奖券可在【我的】→【我的钱包】→【优惠券】中查看；
        </view>
        <view class="g_item">
          3.请在奖券标明的有效期限内使用您的奖券；
        </view>
        <view class="g_item">
          4.抽中实物奖品将以等额券形式发放，金额仅包含实物奖品实际购买价格；
        </view>
        <view class="g_item">
          5.为体现公平透明原则，电科商城开发人员不得参与抽奖活动；
        </view>
        <view class="g_item">
          6.在参与本活动过程中，如果用户出现违规行为或其他可能影响活动公平及其他用户合法权益行为的，电科商城有权取消违规用户的获奖资格，并撤销违规交易。
        </view>
        <view class="code">
          <image src="@/static/img/code.jpg" mode="aspectFit"></image>
          <view class="titles" v-if="stateBarHeight > 0">
            打开微信扫一扫
          </view>
          <view class="titles" v-else>
            扫一扫或长按识别
          </view>
        </view>
      </view>
    </uni-popup>

    <view class="invitation" :class="{x:show}">
      <image src="@/static/envelopes_activity_share.png" mode="aspectFit"></image>
    </view>
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
        list: [{
          "name": "满50 减",
          "value": "0",
          icon: '6.8元',
        }, {
          "name": "满1000 减",
          "value": "1",
          icon: '168元',
        }, {
          "name": "满100 减",
          "value": "2",
          icon: '16.8元',
        }, {
          "name": "满500 减",
          "value": "3",
          icon: '61.8元',
        }, {
          "name": "满50 减",
          "value": "4",
          icon: '6.8元',
        }, {
          "name": "满1000 减",
          "value": "5",
          icon: '168元',
        }, {
          "name": "满100 减",
          "value": "6",
          icon: '16.8元',
        }, {
          "name": "满500 减",
          "value": "7",
          icon: '61.8元',
        }, ],
        width: 0,
        animationData: {},
        btnDisabled: '',
        show: false,
        number: 0,
        tip: ['今日抽奖次数已用完，在商城下单购物，或明天再邀请朋友一起来玩，还有更多惊喜！', '邀请朋友来玩，有惊喜在等你！', '恭喜您，抽中一张超值奖券！奖券： ',
          '', '恭喜您，抽中一张超值奖券！奖券：', '您未登录电科商城，请先进行登录/注册'
        ],
        tips: '',
        type: 0,
        first: true,
        guid: '',
        token: '',
        name: '',
        types: 0,
        stateBarHeight: 0,
        loads: false,
        source: 1,
        form: 12,
        general: [],
        mys: [],
        loading: 'more',
        pageNo: 1,
        pageSize: 20
      }
    },
    onLoad: function(o) {
		
		
      // 获取奖品列表
      this.width = 360 / this.list.length
      this.form = o.form;
      var that = this;
      if (that.isapp()) {
		that.$util.bridgeAndroidAndIOS();
        that.stateBarHeight = 122;
        that.$util.mcallHandler('CallNative', {
          key: 'stateBarTextWhite',
          showstatebar: '0'
        }, function(responseData) {});
      }
    },
    //加载更多
    onReachBottom() {
      if (this.loading == 'more') {
        this.moretypelist()
      }
    },
    onShow() {
      if (this.show) {
        this.show = false;
      }
      var that = this;
      if (that.isapp()) {
        that.source = 2;
        that.$util.mcallHandler('CallNative', {
          key: 'stateBarTextWhite',
          showstatebar: '0'
        }, function(responseData) {});
        if (!that.loads) {
          that.$util.bridgeAndroidAndIOS(function() {
            that.loads = true;
            that.guid = uni.getStorageSync('userInfo').guid;
            that.token = uni.getStorageSync('userInfo').token;
            if (that.guid) {
              that.load()
              that.getname()
            } else {
              that.type = 5;
            }
          })
        } else {
          that.guid = uni.getStorageSync('userInfo').guid;
          that.token = uni.getStorageSync('userInfo').token;
          if (that.guid) {
            that.load()
            that.getname()
          } else {
            that.type = 5;
          }
        }
      } else {
        that.guid = uni.getStorageSync('userInfo').guid;
        that.token = uni.getStorageSync('userInfo').token;
        if (that.guid) {
          that.load()
          that.getname()
          if (this.$wx.isWechat()) {
            this.$wx.share({
                title: '电科惊喜大转盘',
                desc: '100%中奖！惊喜优惠等着你！',
                imgUrl: 'http://ets.51pingce.net/static/img/tk.png'
              },
              'http://ets.51pingce.net/pages/draw/draw?form=6'
            );
          }
        } else {
          that.type = 5;
        }
      }
    },
    methods: {
      animation(index) {
        //中奖index
        var list = this.list;
        // var awardIndex = 1 || Math.round(Math.random() * (awardsNum.length - 1)); //随机数
        var runNum = 4; //旋转8周
        // 旋转角度
        this.runDeg = this.runDeg || 0;
        this.runDeg = this.runDeg + (360 - this.runDeg % 360) + (360 * runNum - index * (360 / list.length))
        //创建动画
        var animationRun = uni.createAnimation({
          duration: 4000,
          timingFunction: 'ease'
        })
        animationRun.rotate(this.runDeg).step();
        this.animationData = animationRun.export();
        this.number--


        setTimeout(() => {
          if (this.number > 0) {
            this.type = 2;
            this.tip[2] = '恭喜您，抽中一张 ' + list[index].name + list[index].icon + ' 奖券！';
          } else {
            if (!this.first) {
              this.type = 3;
              this.tips = '恭喜您，抽中一张 ' + list[index].name + list[index].icon + ' 奖券！  邀请朋友来玩，有惊喜在等你！'
            } else {
              this.type = 4;
              this.tip[4] = '恭喜您，抽中一张 ' + list[index].name + list[index].icon + ' 奖券！';
            }
          }
          if (this.types != 0) {
            this.typesedit(this.types)
          }
          this.$refs.popup.open()
          this.btnDisabled = '';
        }, 4300)
      },
      //发起抽奖
      playReward() {
        var that = this;
        if (this.number > 0) {
          this.btnDisabled = 'disabled';
          var animationRun = uni.createAnimation({
            duration: 6000,
            timingFunction: 'linear'
          })
          animationRun.rotate(3600).step();
          this.animationData = animationRun.export();
          uni.request({
            url: 'http://39.107.114.246/ets-service/lottery/lottery',
            method: 'POST',
            data: {
              guid: this.guid,
              token: this.token,
              userName: this.name
            },
            header: {
              'content-type': 'application/json',
            },
            success: (res) => {
              if (res.data.res.code == 0) {
                that.animation(res.data.res.resultIndex)
                that.number = res.data.res.lotteryNum;
              } else {
                uni.showToast({
                  title: res.data.res.msg,
                  duration: 2000,
                  icon: 'none'
                })
                that.btnDisabled = '';
              }
            }
          });
          uni.request({
            url: 'http://39.107.114.246/ets-service/lottery/log',
            method: 'POST',
            data: {
              guid: this.guid,
              source: this.source,
              type: 2
            },
            header: {
              'content-type': 'application/json',
            },
            success: (res) => {}
          });
        } else {
          if (this.type == 5) {

          } else if (!this.first) {
            this.type = 1;
          } else {
            this.type = 0;
          }
          this.$refs.popup.open()
        }
      },
      openguize() {
        this.$refs.guize.open()
      },
      typesedit(index) {
        this.types = index;
        if (index != 0) {
          var _this = this;
          this.pageNo = 1
          var data = {
            pageNo: this.pageNo,
            pageSize: this.pageSize,
          }
          if (index == 1) {
            data.guid = this.guid;
          }
          uni.request({
            url: 'http://39.107.114.246/ets-service/lottery/list',
            method: 'POST',
            data: data,
            header: {
              'content-type': 'application/json',
            },
            success: (res) => {
              if (res.data.code == 0) {
                if (index == 1) {
                  _this.mys = res.data.res
                } else {
                  _this.general = res.data.res
                }
                _this.loading = res.data.res.length != _this.pageSize ? 'noMore' : 'more';
              } else {
                uni.showToast({
                  title: res.data.msg,
                  duration: 2000,
                  icon: 'none'
                })
              }
            }
          });
        }

      },
      moretypelist() {
        this.loading = 'loading';
        this.pageNo++
        var _this = this;
        var data = {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
        }
        if (_this.types == 1) {
          data.guid = this.guid;
        }
        uni.request({
          url: 'http://39.107.114.246/ets-service/lottery/list',
          method: 'POST',
          data: data,
          header: {
            'content-type': 'application/json',
          },
          success: (res) => {
            if (res.data.code == 0) {
              if (_this.types == 1) {
                _this.mys = _this.mys.concat(res.data.res)
              } else {
                _this.general = _this.general.concat(res.data.res)
              }
              _this.loading = res.data.res.length != _this.pageSize ? 'noMore' : 'more';
            } else {
              uni.showToast({
                title: res.data.msg,
                duration: 2000,
                icon: 'none'
              })
            }
          }
        });
      },
      intercept(item) {
        if (item != undefined) {
          if (item.length > 4) {
            var str = item.substr(0, 2)
            for (var i = 1; i <= (item.length - 4); i++) {
              str += '*';
            }
            str += item.substr(-2)
          } else {
            var str = item.substr(0, 1)
            for (var i = 1; i <= (item.length - 2); i++) {
              str += '*';
            }
            str += item.substr(-1)
          }
          return str
        } else {
          return '幸运客户'
        }

      },
      getname() {
        this.$ajax.get('login/regUserCenter', {
          guid: this.guid
        }).then(res => {
          if (res.data.code == 0) {
            this.name = res.data.result.data.name;
          }
        });

      },
      load() {
        uni.request({
          url: 'http://39.107.114.246/ets-service/lottery/inquire',
          method: 'POST',
          data: {
            guid: this.guid,
            token: this.token
          },
          header: {
            'content-type': 'application/json',
          },
          success: (res) => {
            if (res.data.code == 0) {
              this.number = res.data.res.lotteryNum;
              this.first = res.data.res.whetherShare;
              uni.request({
                url: 'http://39.107.114.246/ets-service/lottery/log',
                method: 'POST',
                data: {
                  guid: this.guid,
                  source: this.source,
                  type: 1
                },
                header: {
                  'content-type': 'application/json',
                },
                success: (res) => {}
              });
            } else {
              uni.showToast({
                title: res.data.msg,
                duration: 2000,
                icon: 'none'
              })
            }
          }
        });

        uni.request({
          url: 'http://39.107.114.246/ets-service/lottery/log',
          method: 'POST',
          data: {
            guid: this.guid,
            source: this.source,
            type: this.form
          },
          header: {
            'content-type': 'application/json',
          },
          success: (res) => {}
        });
      },
      close() {
        this.$refs.popup.close()
      },
      invitation() {
        this.$refs.popup.close()
        if (this.isapp()) {
          this.$util.mcallHandler('CallNative', {
            key: 'share',
            pic: 'http://ets.51pingce.net/static/img/tk.png',
            title: '电科惊喜大转盘',
            subtitle: '100%中奖！惊喜优惠等着你！',
            url: 'http://ets.51pingce.net/pages/draw/draw?form=7'
          }, function(responseData) {

          });
          this.share()
        } else {
          this.show = true;
          this.share()
        }
      },
      share() {
        uni.request({
          url: 'http://39.107.114.246/ets-service/lottery/share',
          method: 'POST',
          data: {
            guid: this.guid,
            token: this.token
          },
          header: {
            'content-type': 'application/json',
          },
          success: (res) => {
            if (res.data.res.code == 0) {
              this.first = true
              this.number = res.data.res.lotteryNum;
            }
          }
        });
        uni.request({
          url: 'http://39.107.114.246/ets-service/lottery/log',
          method: 'POST',
          data: {
            guid: this.guid,
            source: this.source,
            type: 4
          },
          header: {
            'content-type': 'application/json',
          },
          success: (res) => {}
        });
      },
      go() {
        this.$refs.popup.close()
        uni.request({
          url: 'http://39.107.114.246/ets-service/lottery/log',
          method: 'POST',
          data: {
            guid: this.guid,
            source: this.source,
            type: 3
          },
          header: {
            'content-type': 'application/json',
          },
          success: (res) => {}
        });
        if (this.isapp()) {
          this.$util.mcallHandler('CallNative', {
            key: 'stateBarTextBlack',
            showstatebar: '1'
          }, function(responseData) {});
          this.$util.mcallHandler('CallNative', {
            key: 'couponlist'
          }, function(responseData) {});
        } else {
          uni.navigateTo({
            url: '/pages/user/coupon'
          })
        }
      },
      back() {
        this.$jump.back();
      },
      gobuy(){
        if (this.isapp()) {
          this.callHandler('CallNative', {
            'key': 'homepage'
          });
        } else {
          uni.navigateTo({
            url: '/pages/home/home'
          })
        }
      },
      gologin() {
        this.$refs.popup.close();
        this.$jump.gotoLogin();
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
<style scoped lang="scss">
  page {
    min-height: 100%;
    background: linear-gradient(#6106e4, #d300ee);
  }

  .btn {
    width: 290rpx;
    height: 84rpx;
    position: relative;
    margin: 30px auto 10rpx auto;
    background: url(../../static/img/btn.png) no-repeat center;
    background-size: 100% 100%;
    z-index: 66;
  }

  // 自定义导航栏
  .navigateBar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    display: flex;
    align-items: flex-end;
    padding-bottom: 20rpx;
    background: #7500ed;

    image {
      margin-left: 20rpx;
      margin-right: 20rpx;
      padding: 8rpx;
      width: 36rpx;
      height: 44rpx;
    }

    .middle {
      position: relative;
      height: 50rpx;
      width: 70%;
      display: flex;
      align-items: center;
      margin-left: 10%;
      justify-content: center;
      font-size: 34rpx;
      color: #FFFFFF;
    }

    .helpText {
      width: 20%;
      font-size: 28rpx;
      color: #fff;
      text-align: center;
    }
  }

  .number {
    text-align: center;
    position: relative;
    color: #FFF;
    font-size: 24rpx;
    margin: 10rpx 0;
  }

  .icon-awrad {
    font-size: 50upx !important;
  }

  .conbox {
    width: 750upx;
    overflow-x: hidden;
    overflow-y: scroll;
    min-height: 100%;
  }

  .container {
    min-height: 100%;

    &.x {
      padding-top: 122rpx;
    }
  }

  image.cont {
    width: 750upx;
    overflow: hidden;
    height: 1360rpx;
    position: absolute;
    z-index: 0;
  }

  image.caidai {
    position: absolute;
    top: 0;
    left: 0;
    width: 750upx;
    height: 1024upx;
  }


  .header-title>view {
    padding: 8upx 16upx;
    border: 1px solid #d89720;
    color: #d89720;
    font-size: 28upx;
    border-radius: 26upx;
  }

  .rule {
    padding: 0 30rpx;
    text-align: right;
    position: relative;

    text {
      display: inline-block;
      background: #5f05c6;
      border-radius: 20rpx;
      padding: 6rpx 30rpx;
      color: #FFF;
      font-size: 24rpx;
    }
  }

  .titleimgse {
    display: block;
    width: 660rpx;
    height: 318rpx;
    margin: 10rpx auto 0 auto;
  }

  /* 转盘 */
  .canvas-container {
    margin: 0 auto;
    position: relative;
    width: 600upx;
    height: 600upx;
  }


  .canvas-content {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    display: block;
    width: 600upx;
    height: 600upx;
    background: url(@/static/img/circle.png) no-repeat;
    background-size: cover;
  }

  .canvas-list {
    position: absolute;
    left: 0;
    top: 0;
    width: inherit;
    height: inherit;
    z-index: 9999;
  }

  .canvas-item {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    color: #e4370e;
    /* text-shadow: 0 1upx 1upx rgba(255, 255, 255, 0.6); */
  }

  .canvas-item-text {
    position: relative;
    display: block;
    padding-top: 60upx;
    margin: 0 auto;
    text-align: center;
    -webkit-transform-origin: 50% 300upx;
    transform-origin: 50% 300upx;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #FB778B;
  }

  .canvas-item-text text {
    font-size: 30upx;
  }

  /* 分隔线 */
  .canvas-line {
    position: absolute;
    left: 0;
    top: 0;
    width: inherit;
    height: inherit;
    z-index: 99;
  }

  .canvas-litem {
    position: absolute;
    left: 300upx;
    top: 0;
    width: 3upx;
    height: 300upx;
    background-color: rgba(228, 55, 14, 0.4);
    overflow: hidden;
    -webkit-transform-origin: 50% 300upx;
    transform-origin: 50% 300upx;
  }

  /**
* 抽奖按钮
*/
  .canvas-btn {
    position: absolute;
    left: 240upx;
    top: 240upx;
    z-index: 3;
    width: 120upx;
    height: 120upx;
    color: #f4e9cc;
    background: url(@/static/img/btnse.png) no-repeat center;
    background-size: 100% 100%;
    text-align: center;
    font-size: 26upx;
    text-shadow: 0 -1px 1px rgba(0, 0, 0, 0.6);
    text-decoration: none;
    padding-top: 51rpx;
  }


  .canvas-btn.disabled {
    pointer-events: none;
    color: #ccc;
    background: url(@/static/img/btnses.png) no-repeat center;
    background-size: 100% 100%;
  }



  .typecheckbox view {
    border: 1px solid #FF3637;
    background: transparent;
    color: #FF3637;
    display: flex;
    height: 60upx;
    width: 140upx;
    border-radius: 50upx;
    align-items: center;
    justify-content: center;
    display: flex;
    margin-left: 20upx;
  }


  .guize {
    color: #a99fff;
    position: relative;
    background: #FFF;
    border-radius: 20rpx;
    padding: 30rpx;
  }

  .ysguize {
    /deep/ .uni-popup__wrapper-box {
      overflow-y: inherit !important;
      padding: 0 !important;
      background: none !important;
    }
  }

  .guize .title {
    text-align: center;
    margin-bottom: 28upx;
    margin-top: -79rpx;
    background: url(../../static/img/top.png) no-repeat center;
    background-size: 700rpx 100rpx;
    line-height: 100rpx;
    color: #FFF;
  }

  .guize .g_item {
    font-family: PingFang-SC-Medium;
    font-size: 24upx;
    letter-spacing: 0.5px;
    text-align: justify;
  }

  .myrewards .title {
    font-family: PingFang-SC-Bold;
    font-size: 16px;
    color: #E4431A;
    letter-spacing: 0.57px;
    display: flex;
    padding-top: 36upx;
    justify-content: center;
  }

  /deep/ .uni-popup__wrapper-box {
    border-radius: 20rpx;
  }

  .draw {
    position: relative;

    .del {
      width: 50rpx;
      height: 50rpx;
      background: url(../../static/imgdel.png) no-repeat center;
      background-size: 50rpx 50rpx;
      position: absolute;
      right: 0;
      top: 0;
      z-index: 1;
    }

    .con {
      image {
        width: 100%;
        height: 340rpx;
      }

      .title {
        text-align: center;
        font-size: 34rpx;

      }

      .btns {
        text-align: center;
        margin-top: 30rpx;

        text {
          background: #fe5c01;
          display: inline-block;
          padding: 16rpx 50rpx;
          border-radius: 30rpx;
          box-shadow: 0 6rpx 10rpx #fe8947;
          font-size: 30rpx;
          line-height: 1;
          color: #FFF;
          margin: 20rpx;
        }
      }
    }
  }

  .invitation {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 666;
    display: none;

    &.x {
      display: block;
    }

    image {
      width: 90%;
      height: 600rpx;
      display: block;
      margin: 0 auto;
    }
  }

  .code {
    padding: 30rpx;

    .titles {
      text-align: center;
      font-size: 28rpx;
      margin-top: 20rpx;
    }

    image {
      display: block;
      width: 200rpx;
      height: 200rpx;
      margin: 0 auto;
    }
  }

  .typelist {
    position: relative;
    display: flex;
    align-content: center;
    justify-content: space-evenly;
    margin-top: 60rpx;

    text {
      border-radius: 30rpx;
      background: #6f2ae7;
      color: #FFF;
      padding: 6rpx 30rpx;
      font-size: 30rpx;

      &.x {
        background: #3c0096;
      }
    }
  }

  .prizecon {
    margin: 30rpx;
    background: #FFF;
    border-radius: 20rpx;
    padding: 10rpx;

    .prize {
      width: 100%;
      text-align: center;
      font-size: 28rpx;
      color: #666;

      td {
        border-bottom: 1px solid #f1f1f1;
        padding: 6rpx 0;
      }

      tr {
        &:last-child td {
          border: 0;
        }
      }

      image {
        width: 70rpx;
        height: 70rpx;
        border-radius: 50%;
      }
    }
  }
</style>
