<template>
  <view>
    <image :src="data.url" mode="aspectFill" class="titleimg"></image>
    <view class="title">
      {{data.name}}
    </view>
    <view class="tip">
      <text>{{data.priceText}}</text>
      <text class="price">{{data.price}}</text>
      <text class="oldprice">{{data.newprice}}</text>
    </view>
    <view class="imgs">
      <image :src="item" mode="aspectFill" v-for="(item,index) in data.groupbuymember" :key="index"></image>
    </view>
    <view class="tips">
      <text>仅剩</text><text class="number">{{data.leftNum}}</text><text>个名额，</text>
      <countdown :time="time" :day="false"></countdown>
      <text>后结束</text>
    </view>
    <view class="btn" @click="participate">
      参与 {{data.username}} 的拼团
    </view>
    <uni-popup ref="assemble" class="assembles" type="center" @touchmove.stop="">
      <view class="layer">
        <text class="del" @click="closeshare"></text>
        <view class="assemble">
          <view class="tip">
            {{tip.errorContent}}
          </view>
          <view class="tip x">
            {{tip.errorTitle}}
          </view>
          <view class="btn" @click="launch">发起拼团</view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
  import countdown from '@/components/countdown/countdown.vue';
  import uniPopup from '@/components/uni-popup/uni-popup.vue';
  export default {
    components: {
      uniPopup,
      countdown
    },
    data() {
      return {
        teamGuid: '',
        data: {},
        time: 0,
        tip: {}
      };
    },
    onLoad(o) {
      this.teamGuid = o.teamGuid;
      uni.setStorageSync('teamGuid', o.teamGuid);
    },
    onShow() {
      this.onload()
    },
    methods: {
      onload() {
        var _this = this;
        _this.$ajax.get('groupbuyone/getJoinTeamInfo', {
          teamGuid: _this.teamGuid
        }).then(res => {
          if (res.data.code == 0) {
            _this.data = res.data.result.data;
            _this.time = res.data.result.data.leftTimestamp / 1000
          } else {
            _this.$api.msg(res.data.msg);
            uni.redirectTo({
              url: '/pages/home/home'
            });
          }
        });
      },
      launch() {
        this.$refs.assemble.close()
        uni.navigateTo({
          url: '/pages/oneyuangroup/oneyuangroup'
        })
      },
      participate() {
        var _this = this;
        let userinfo = uni.getStorageSync('userInfo');
        if (!userinfo.guid) {
          uni.navigateTo({
            url: '/pages/public/login'
          });
        } else {
          _this.$ajax.get('groupbuyone/validateNewUser', {
            teamGuid: _this.teamGuid
          }).then(res => {
            if (res.data.code == 0) {
              if (res.data.result.data.isNewUser == 0) {
                _this.tip = res.data.result.data;
                _this.$refs.assemble.open()
              } else {
                let goodsData = [];
                goodsData.push({
                  attr_val: _this.data.productId,
                  number: 1,
                  skuid: _this.data.skuId,
                  keywords: _this.data.keywords
                });
                uni.navigateTo({
                  url: '/pages/order/createOrder?type=direct&data=' + JSON.stringify({
                    goodsData: goodsData,
                    openGroupbuyOneTeam: 0,
                    groupbuyOneTeamGuid: _this.teamGuid
                  })
                });
              }
            } else {
              _this.$api.msg(res.data.msg);
            }
          });
        }
      },
      closeshare() {
        this.$refs.assemble.close()
      },
    }
  }
</script>

<style lang="scss" scoped>
  .titleimg {
    width: 750rpx;
    height: 500rpx;
  }

  .title {
    padding: 20rpx 30rpx;
    color: #333;
    font-size: 30rpx;
    text-align: center;
  }

  .tip {
    text-align: center;
    font-size: 24rpx;
    color: #ee3847;

    .price {
      font-size: 32rpx;
      margin: 0 4rpx;
      font-weight: bold;
    }

    .oldprice {
      color: #969696;
      text-decoration: line-through;
    }
  }

  .tips {
    text-align: center;
    font-size: 24rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .number {
      color: #ee3847;
      margin: 0 4rpx;
      font-weight: bold;
    }
  }

  .imgs {
    text-align: center;
    padding: 20rpx 30rpx;

    image {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      margin: 0 10rpx;
      display: inline-block;
    }
  }

  .btn {
    text-align: center;
    font-size: 30rpx;
    width: 600rpx;
    line-height: 80rpx;
    background: #ee3847;
    color: #FFF;
    border-radius: 20rpx;
    margin: 20rpx auto;
  }

  .assemble {
    margin: 20rpx 50rpx;

    .tip {
      margin-top: 20rpx;
      text-align: center;
      font-size: 32rpx;
      line-height: 48rpx;
      color: #666;

      &.x {
        color: #ee3847;
      }

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
      width: 750rpx;
      height: 760rpx;
      max-width: inherit !important;
      max-height: inherit !important;
    }

    .layer {
      width: 90%;
      margin: 0 auto;
      margin-top: 320rpx;
      position: relative;

      .del {
        background: url(../../static/del.png) no-repeat center;
        background-size: 60rpx 60rpx;
        width: 100rpx;
        height: 100rpx;
        position: absolute;
        right: 16rpx;
        top: -104rpx;
      }

      .btn {
        margin-top: 80rpx;
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
