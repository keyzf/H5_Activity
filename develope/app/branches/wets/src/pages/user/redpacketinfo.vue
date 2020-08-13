<template>
	<view>
		<view class="head">
      <view class="tip">红包金额</view>
      <view class="price">{{data.initialmoney}}</view>
    </view>
    <view class="list">
      <view class="item">
        <view class="tip">
          红包名称
        </view>
        <view class="con">
          {{data.title}}
        </view>
      </view>
      <view class="item">
        <view class="tip">
          开始时间
        </view>
        <view class="con">
          {{data.begintime}}
        </view>
      </view>
      <view class="item">
        <view class="tip">
          截止时间
        </view>
        <view class="con">
          {{data.endtime}}
        </view>
      </view>
      <view class="item">
        <view class="tip">
          使用规则
        </view>
        <view class="con">
          {{data.rule}}
        </view>
      </view>
    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data:{}
			};
		},
    onLoad(o) {
      this.$ajax.get('redpacket/getredpacketinfo', {
        userredpacketid:o.id
      }).then(res => {
        if (res.data.code == 0) {
          let data = res.data.result.data;
          this.data = data;
        } else {
          this.$api.msg('系统出错,请稍后再试');
        }
      });
    }
	}
</script>

<style lang="scss" scoped>
  page{
    background: #f6f6f6;
  }
.head{
  background: linear-gradient(to right,#EE5A38,#EE3847);
  padding: 40rpx 0;
  text-align: center;
  color: #FFF;
  .tip{
    font-size: 28rpx;
    margin-bottom: 20rpx;
  }
  .price{
    font-size: 38rpx;
  }
}
.list{
  margin-top: 20rpx;
  background: #FFF;
  padding: 0 20rpx;
  .item{
    padding: 20rpx;
    border-bottom: 1rpx solid #f1f1f1;
    display: flex;
    align-items: center;
      font-size: 28rpx;
    .con{
      flex: 1;
      margin-left: 20rpx;
      text-align: right;
    }
  }
}

</style>
