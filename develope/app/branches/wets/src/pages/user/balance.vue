<template>
	<view>
		<view class="hader">
      <view class="conse">
        <view class="title">
          <view>
            <view class="tip">账户余额(元)</view>
            <view class="number"> {{data.amountvalue}} </view>
          </view>
          <view style="text-align: right;">
            <view class="tip">昨日收益</view>
            <view class="number"> +{{data.ydayGain}} </view>
          </view>
        </view>
        <view class="btns">
          <view>
            <view class="tip">预估收益(元)</view>
            <view class="number"> +{{data.estimatedGain}} </view>
          </view>
          <view class="btn">
            <text @click="recharge">充值</text>
            <text @click="accounts">转账</text>
          </view>
        </view>
      </view>
		</view>
    <view class="list">
      <view class="item" :class="{x:item.recordtype == 2 && item.change_type != 1}" v-for="(item,index) in list" :key="index" @click="go(item)">
        <image src="../../static/coupon-invalid.png" mode="aspectFit" class="statr"></image>
        <view class="left"><image :src="item.pic" mode="aspectFit"></image></view>
        <view class="con">
            <view class="price">{{ item.typename }}</view>
            <view class="time">{{ item.rangetext }}</view>
            <view class="time">{{ item.timedisplay }}</view>
        </view>
        <view class="right" :class="item.income_flag == 0 && item.recordtype == 1? '' : 'x'">{{item.income_flag == 0 && item.recordtype == 1? '-' : '+'}} {{ item.amount }}</view>
      </view>
    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
        data:{},
				list:[],
        pagesize:30,
        lid:''
			};
		},
    onLoad() {
      this.load()
    },
    onReachBottom() {
      this.load()
    },
    methods:{
      load(){
        this.$ajax.get('user/amount', {}).then(res => {
          if (res.data.code == 0) {
            let data = res.data.result.data;
            this.data = data;
          } else {
            this.$api.msg('系统出错,请稍后再试');
          }
        });
        this.$ajax.get('user/amountDetail', {
          pagesize:this.pagesize,
          lid:this.lid          
        }).then(res => {
          if (res.data.code == 0) {
            let data = res.data.result.data.list;
            if(data.length > 0){
              this.list = this.list.concat(data);
              this.lid = data[data.length - 1].id;
            }
          } else {
            this.$api.msg('系统出错,请稍后再试');
          }
          uni.stopPullDownRefresh();
        });
      },
      recharge() {
        uni.navigateTo({
            url: '/pages/user/recharge'
        });
      },
      accounts() {
        uni.navigateTo({
            url: '/pages/user/accounts'
        });
      },
      go(item){
        if(item.recordtype == 2){
          uni.navigateTo({
              url: '/pages/user/redpacketinfo?id='+item.user_redpacket_id
          });
        }
      }
    }
	}
</script>

<style lang='scss' scoped>
  page{
    background: #f6f6f6;
  }
.hader{
  position: sticky;
  z-index: 3;
  top: 0rpx;
  left: 0;
  right: 0;
  padding: 20rpx;
  background: #f6f6f6;
  
  .conse{
    background: linear-gradient(to left,#EE3847,#EE5A38);
    padding: 20rpx;
    border-radius: 30rpx;
    color: #FFF;
  }
  
  .title{
    display: flex;
    align-items: center;
    justify-content: space-between;
    .tip{
      font-size: 28rpx;
    }
    .number{
      font-size: 60rpx;
      line-height: 1.6;
    }
  }
  .btns{
    font-size: 30rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .btn{
      text{
        display: inline-block;
        padding: 10rpx 30rpx;
        margin-left: 40rpx;
        border-radius: 30rpx;
        border: 1rpx solid #FFF;
      }
    }
  }
}
.list{
  .item{
    padding: 20upx 30upx;
    background: #fff;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .statr{
      display: none;
    }
    
    .left {
        image {
            width: 60rpx;
            height: 60rpx;
            margin-right: 10rpx;
        }
    }
    .con {
        flex: 1;
        font-size: 32rpx;
        padding-right: 20rpx;
        .time {
            font-size: 28rpx;
        }
    }
    .right {
        &.x {
            color: $base-color;
        }
    }
    &.x{
      position: relative;
      color: #969696;
      .statr{
        position: absolute;
        right: 100rpx;
        top: 40rpx;
        width: 100rpx;
        height: 100rpx;
        display: block;
        z-index: 2;
      }
    }
  }
}

</style>
