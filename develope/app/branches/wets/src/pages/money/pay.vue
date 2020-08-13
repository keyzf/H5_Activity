<template>
  <view class="app">
    <view class="price-box">
      <text>支付金额</text>
      <text class="price">{{ price }}</text>
    </view>
    <view class="pay-type-list">
      <view class="type-item b-b" @click="changePayType(item.paycode,item.useState)" v-for="(item,index) in list" :key="index" v-if="item.paycode != 'ALIPAY'">
				<!-- <text class="icon yticon icon-weixinzhifu"></text> -->
				<view class="con">
					<text class="tit">{{item.title}}</text>
					<text v-if="item.paycode == 'WXPAY'">推荐使用微信支付</text>
				</view>
				<label class="radio">
					<radio color="#fa436a" :disabled="true" :checked='payType == item.paycode' /></radio>
				</label>
			</view>
    <!-- <view class="type-item b-b" @click="changePayType(3)">
				<view class="con">
					<text class="tit">餐卡支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType == 3' />
					</radio>
				</label>
			</view>
			<view class="type-item" @click="changePayType(4)">
				<view class="con">
					<text class="tit">朋友代付</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType == 4' />
					</radio>
				</label>
			</view> -->
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
        list:[],
        payType: 'WXPAY',
        orderInfo: {},
        ordernum: 0,
        price: "0.00",
        show:false,
        openpassword:0,
        type:false
      };
    },
    onLoad(options) {
      this.ordernum = options.ordernum;
      if(options.type){
        this.type = true;
        this.$ajax.get('diandi/paymethods', {}).then(res => {
          if(res.data.code == 0){
            this.list = res.data.result.data;
          }
        });
      }else{
        this.$ajax.get('order/paymethods', {}).then(res => {
          if(res.data.code == 0){
            this.list = res.data.result.data;
          }
        });
      }
      this.changePayType(this.payType,1)
    },
    onShow() {
      if (this.$wx.isWechat()) this.$wx.share();
    },
    onBackPress() {
      if(this.type){
        history.go(-1)
      }else{
        this.$api.ovPage()
      }
    },
    methods: {
      pay() {
        let _this = this;
        // 初始化成功
        if (this.payType == 'WXPAY' && this.$wx.isWechat()) {
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
        }else if(this.payType == 'MEALPAY'){
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
        }else if(this.payType == 'OTHERPAY'){
          uni.navigateTo({
            url:'/pages/money/friend?ordernumber='+this.ordernum
          })
        }
      },
      //选择支付方式
      changePayType(type,is) {
        if(is == 1){
          let _this = this;
          let types = 2;
          if(type == 'WXPAY'){
            types = 2;
          }else if(type == 'MEALPAY'){
            types = 3;
          }else if(type == 'OTHERPAY'){
            types = 4;
          }
          let urls ;
          if(this.type){
            urls = 'diandi/chosepaytype';
          }else{
            urls = 'order/chosepaytype';
          }
          _this.$ajax.get(urls, {
            ordernumber: _this.ordernum,
            dealtype:types
          }).then(res => {
            if(res.data.code == 0){
              _this.ordernum = res.data.result.data.ordernumber;
              _this.price = res.data.result.data.payprice;
              _this.openpassword = res.data.result.data.openpassword;
              _this.payType = type;
            }else{
              _this.$api.msg(res.data.msg);
              uni.navigateBack()
            }
          });
        }else{
          this.$api.msg('当前订单类型不支持该支付方式！');
        }
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
