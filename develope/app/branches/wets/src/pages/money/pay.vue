<template>
  <view class="app">
    <view class="price-box">
      <text>支付金额</text>
      <text class="price">{{ price }}</text>
    </view>

    <view class="pay-type-list">
    <view class="type-item b-b" @click="changePayType(2)">
				<!-- <text class="icon yticon icon-weixinzhifu"></text> -->
				<view class="con">
					<text class="tit">微信支付</text>
					<text>推荐使用微信支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType == 2' />
					</radio>
				</label>
			</view>
    <view class="type-item b-b" @click="changePayType(3)">
				<!-- <text class="icon yticon icon-alipay"></text> -->
				<view class="con">
					<text class="tit">餐卡支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType == 3' />
					</radio>
				</label>
			</view>
			<view class="type-item" @click="changePayType(4)">
				<!-- <text class="icon yticon icon-erjiye-yucunkuan"></text> -->
				<view class="con">
					<text class="tit">朋友代付</text>
					<!-- <text>可用余额 ¥198.5</text> -->
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType == 4' />
					</radio>
				</label>
			</view>
    </view>
    
    <text class="mix-btn" @click="pay">确认支付</text>
    <passkeyborad :show="show" :price="price" @close="close"></passkeyborad>
  </view>
</template>

<script>
  import passkeyborad from '@/components/yzc-paykeyboard/yzc-paykeyboard.vue';
  export default {
    components: {
    	passkeyborad,
    },
    data() {
      return {
        payType: 2,
        orderInfo: {},
        ordernum: 20190926174462,
        price: 0.00,
        show:false,
        openpassword:0
      };
    },
    onLoad(options) {
      this.ordernum = options.ordernum;
      this.price = options.price;
    },
    onShow() {
      if (this.$wx.isWechat()) this.$wx.share();
    },
    onBackPress() {
      this.$api.ovPage()
    },
    methods: {
      pay() {
        let _this = this;
        // 初始化成功
        if (this.payType == 2 && this.$wx.isWechat()) {
          uni.showLoading({
            title: '加载中...'
          });
          // 获取支付需要的config
          _this.$ajax.get('order/getwxgzhpaysign', {
            ordernum: _this.ordernum
          }).then(res => {
            uni.hideLoading();
            if (res.data.code == 0) {
              let data = res.data.result.data;
              // 唤起支付
              _this.$wx.jweixin().chooseWXPay({
                timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
                package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                paySign: data.paySign, // 支付签名
                success: function(res) {
                  // 支付成功后 目前 直接成功并跳转
                  uni.redirectTo({
                    url: '/pages/paysuccess/paysuccess?ordernumber=' + _this.ordernum
                  });
                }
              });
            } else {
              _this.$api.msg('支付拉取失败');
            }
          });
        }else if(this.payType == 3){
          if(this.openpassword ==0){
            uni.showLoading({
              title: '支付中...'
            });
            _this.$ajax.get('order/mealcardpay', {
              ordernumber: _this.ordernum,
              password:null
            }).then(res => {
              if(res.data.code == 0){
                uni.hideLoading();
                _this.$api.msg('支付成功');
                _this.back()
              }else{
                _this.$api.msg(res.data.msg);
              }
            });
          }else{
            this.show = true
          }
        }else if(this.payType == 4){
          uni.navigateTo({
            url:'/pages/money/friend?ordernumber='+this.ordernum
          })
        }
      },
      //选择支付方式
      changePayType(type) {
        let _this = this;
        _this.$ajax.get('order/chosepaytype', {
          ordernumber: _this.ordernum,
          dealtype:type
        }).then(res => {
          if(res.data.code == 0){
            _this.ordernum = res.data.result.data.ordernumber;
            _this.price = res.data.result.data.payprice
            _this.openpassword = res.data.result.data.openpassword
            _this.payType = type;
          }else{
            _this.$api.msg(res.data.msg);
            uni.navigateBack()
          }
        });
      },
      close(res) {
        let _this = this;
        if(res != undefined){
          uni.showLoading({
            title: '支付中...'
          });
          _this.$ajax.get('order/mealcardpay', {
            ordernumber: _this.ordernum,
            password:res
          }).then(res => {
            if(res.data.code == 0){
              _this.show = false;
              uni.hideLoading();
              _this.$api.msg('支付成功');
              _this.back()
            }else{
              _this.show = false;
              _this.$api.msg(res.data.msg);
            }
          });
        }else{
          this.show = false;
        }
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

<style lang='scss'>
  .app {
    width: 100%;
  }

  .price-box {
    background-color: #fff;
    height: 265upx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 28upx;
    color: #909399;

    .price {
      font-size: 50upx;
      color: #303133;
      margin-top: 12upx;
    }
  }

  .pay-type-list {
    margin-top: 20upx;
    background-color: #fff;
    padding-left: 60upx;

    .type-item {
      height: 120upx;
      padding: 20upx 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: 60upx;
      font-size: 30upx;
      position: relative;
    }

    .icon {
      width: 100upx;
      font-size: 52upx;
    }

    .icon-erjiye-yucunkuan {
      color: #fe8e2e;
    }

    .icon-weixinzhifu {
      color: #36cb59;
    }

    .icon-alipay {
      color: #01aaef;
    }

    .tit {
      font-size: $font-lg;
      color: $font-color-dark;
      margin-bottom: 4upx;
    }

    .con {
      flex: 1;
      display: flex;
      flex-direction: column;
      font-size: $font-sm;
      color: $font-color-light;
    }
  }

  .mix-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 630upx;
    height: 80upx;
    margin: 80upx auto 30upx;
    font-size: $font-lg;
    color: #fff;
    background-color: $base-color;
    border-radius: 10upx;
    box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
  }
</style>
