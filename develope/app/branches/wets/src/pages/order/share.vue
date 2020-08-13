<template>
  <view>
    <view class="title">
      <view> 拼团价 </view>
      <view class="price">{{data.real_price}}</view>
      <view class="name">
        {{data.goods}}
      </view>
    </view>
    <view class="tips">
      你可以通过以下方式找朋友拼团
    </view>
    <view class="tip">
      <countdown :time="time" :day="false" @timeup="gohome"></countdown>
      <view>你可以通过以下方式找朋友拼团</view>
    </view>
    <view class="pay">
      <view class="item" @click="config">
        <image src="../../static/adds.png" mode="aspectFit"></image>
        <view>分享链接</view>
      </view>
      <view class="item cobyOrderSn" @click="pushOther">
        <image src="../../static/adds.png" mode="aspectFit"></image>
        <view>图片分享</view>
      </view>
    </view>
    <uni-popup ref="assemble" class="assembles" type="center" @touchmove.stop="" :show="qrShow" @change="changeshow">
      <image :src="finalPath" class="qrcodeImg" mode="aspectFit"></image>
    </uni-popup>
    <view class="invitation" :class="{x:show}">
      <image src="@/static/envelopes_activity_share.png" mode="aspectFit"></image>
    </view>
    <view class="hideCanvasView">
      <canvas class="hideCanvas" canvas-id="default_PosterCanvasId" :style="{width: (poster.width||10) + 'px', height: (poster.height||10) + 'px'}"></canvas>
    </view>
  </view>
</template>

<script>
  import countdown from '@/components/countdown/countdown.vue';
  import uniPopup from '@/components/uni-popup/uni-popup.vue';
  import {
    getSharePoster
  } from '@/store/QS-SharePoster/QS-SharePoster.js';
  export default {
    components: {
      uniPopup,
      countdown
    },
    data() {
      return {
        ordernumber: '',
        tel: '',
        data: {},
        srce: '',
        cpSize: 500,
        teamguid: '',
        time: 100000,
        canvasId: 'default_PosterCanvasId',
        qrShow: false,
        poster: {},
        finalPath: '',
        show:false
      };
    },
    onLoad(o) {
      this.ordernumber = o.ordernumber;
      this.teamguid = o.teamguid;
      this.onload()
    },
    methods: {
      onload() {
        var _this = this;
        _this.$ajax.get('order/groupbuyoneshare', {
          ordernumber: _this.ordernumber,
          teamguid: _this.teamguid
        }).then(res => {
          if (res.data.code == 0) {
            _this.data = res.data.result.data;
            _this.time = (res.data.result.data.endtimestamp - new Date().getTime()) / 1000
            if (_this.$wx.isWechat()) {
              _this.$wx.share({
                  title: _this.data.productsubtitle,
                  desc: _this.data.qrcode_notes,
                  imgUrl: _this.data.productpic
                },
                'http://ets.51pingce.net/pages/order/joinleague?teamGuid=' + _this.data.teamguid
              );
            }
          } else {
            _this.$api.msg(res.data.msg);
            setTimeout(function(){
              uni.navigateBack()
            },1000)
          }
        });
      },
      changeshow(code){
        this.qrShow = code.show;
      },
      async pushOther() {
        if(this.finalPath == ''){
          var _this = this;
          var data = null;
          var res = await _this.$ajax.get('groupbuyone/generateGroupBuySharePic', {
            ordernumber: _this.ordernumber
          })
          if (res.data.code == 0) {
            data = res.data.result.data
          }
          console.log()
          if(data){
            try {
              const d = await getSharePoster({
                _this: this, //若在组件中使用 必传
                type: 'testShareType',
                background: {
                  height: 1100,
                  width: 750,
                  backgroundColor: '#FFF'
                },
                posterCanvasId: this.canvasId, //canvasId
                drawArray: ({
                  bgObj,
                  type,
                  bgScale
                }) => {
                  const fontSize = bgObj.width * 0.04;
                  const lineHeight = bgObj.height * 0.02;
                  return new Promise((rs, rj) => {
                    rs([{
                        type: 'image',
                        url: data.picurl,
                        dx: 0,
                        dy: 0,
                        dWidth:bgObj.width,
                        dHeight:600
                      },
                      {
                        type: 'text',
                        text: data.productname,
                        size: fontSize,
                        textAlign:'center',
                        dx:bgObj.width * 0.5,
                        dy: 640,
                        lineFeed:{
                          maxWidth:bgObj.width * 0.8,
                          lineHeight:lineHeight
                        }
                      },
                      {
                        type: 'text',
                        text: data.groupbuyprice,
                        size: fontSize,
                        textAlign:'center',
                        dx:bgObj.width * 0.5,
                        dy: 720 ,
                        color:'#ed3a47'
                      },
                      {
                        type: 'text',
                        text: data.redtitle,
                        size: fontSize,
                        textAlign:'center',
                        dx:bgObj.width * 0.5,
                        dy: 780,
                        color:'#ed3a47'
                      },
                      {
                        type: 'qrcode',
                        text: 'http://ets.51pingce.net/pages/order/joinleague?teamGuid=' + data.teamguid,
                        size: bgObj.width * 0.3,
                        dx:30,
                        dy: 820,
                      },
                      {
                        type: 'text',
                        text: data.qrcodetip.split(/[\s\n]/)[0],
                        size: fontSize,
                        dx: bgObj.width * 0.4,
                        dy: 890,
                      },
                      {
                        type: 'text',
                        text: data.qrcodetip.split(/[\s\n]/)[1],
                        size: fontSize,
                        dx: bgObj.width * 0.4,
                        dy: 950,
                      },
                    ]);
                  })
                },
                setCanvasWH: ({
                  bgObj,
                  type,
                  bgScale
                }) => { // 为动态设置画布宽高的方法，
                  this.poster = bgObj;
                }
              });
              this.finalPath = d.poster.tempFilePath;
              this.qrShow = true;
            } catch (e) {
              console.log(JSON.stringify(e));
            }
          }
        }else{
          this.qrShow = true;
        }
      },
      config() {
        var _this = this
        _this.show = true
        uni.navigateTo({
          url:'/pages/order/joinleague?teamGuid=' + _this.data.teamguid
        })
      },
      gohome(){
        uni.redirectTo({
          url:'/pages/home/home'
        })
      },
      back() {
        var xh = getCurrentPages();
        xh.forEach((item, index) => {
          if (item.route.indexOf('/order/') != -1) {
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

  .hideCanvasView {
    position: relative;
  }

  .hideCanvas {
    position: fixed;
    top: -99999upx;
    left: -99999upx;
    z-index: -99999;
  }
  .qrcodeImg{
    width: 650rpx;
    height: 954rpx;
  }
  .assembles {
    text-align: center;

    /deep/.uni-popup__wrapper-box {
      border-radius: 20rpx !important;
      padding: 0rpx !important;
      width: 650rpx !important;
      max-width: 650rpx !important;
    }
  }

  .tip {
    text-align: center;
    font-size: 26rpx;
    margin-bottom: 20rpx;
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
</style>
