<template>
  <view class="content b-t">
    <!-- 空白页 -->
    <empty v-if="addressList.length === 0"></empty>
    <view class="tip" v-if="addressList.length != 0">
      <view>友情提示：家属购物要十三所职工代收哦</view>
      <image src="../../static/add.png" mode="aspectFit"></image>
    </view>
    <view class="list" v-for="(item, index) in addressList" :key="index" @click="checkAddress(item)">
      <view class="wrapper">
        <view>
          <view class="u-box">
            <view class="name">
              {{ item.receivername }}
              <text class="mobile">{{ item.receivertel }}</text>
              <text class="mention" v-show="item.isSelfPickup == 1">自提</text>
              <text class="mention x" v-show="item.defaultaddressstate == 1">默认</text>
            </view>
          </view>
          <view class="address-box">
            <text class="address">{{ item.address }}</text>
          </view>
          <!-- <view class="btns">
                        <label class="radio" @click="mrdz(item)">
                            <radio value="r1" :checked="item.defaultaddressstate == 1" />
                            设为默认
                        </label>
                        <text class="shanchu" v-show="item.level != 0" @click.stop="delAddress(item.addressid)">删除</text>
                        <text
                            class="bianji"
                            v-show="customAddress == '' || customAddress == 1 || (customAddress == 2 && item.level != 0)"
                            @click.stop="addAddress('edit', item.addressid)"
                        >
                            编辑
                        </text>
                    </view> -->
        </view>
        <view class="btn" v-show="customAddress == '' || customAddress == 1 || (customAddress == 2 && item.level != 0)"
          @click.stop="addAddress('edit', item.addressid)">
          <image src="../../static/addressbj.png" mode="aspectFit"></image>
        </view>
      </view>
    </view>
    <button class="add-btn" v-show="customAddress == 1 || customAddress == ''" @click="addAddress('add', 0)">新增地址</button>
  </view>
</template>

<script>
  import empty from '@/components/empty';
  export default {
    components: {
      empty
    },
    data() {
      return {
        source: 0,
        addressList: [],
        cguid: 0,
        isCustomAddress: 0,
        customAddress: '',
        welfareid:'',
        postknid: 1
      };
    },
    onLoad(option) {
      this.source = option.source;
      this.cguid = option.cguid || '';
      this.customAddress = option.customAddress || '';
      this.isCustomAddress = option.isCustomAddress || '';
      this.welfareid = option.welfareid || '';
      this.postknid = option.postkind || 1;
      this.getAddressList();
    },
    onShow() {
      if (this.$wx.isWechat()) this.$wx.share();
    },
    methods: {
      // 删除地址
      delAddress(id) {
        let _this = this;
        uni.showModal({
          title: '删除地址',
          content: '确定要删除这个地址吗?',
          success: function(res) {
            if (res.confirm) {
              let data = {
                addressid: id
              };
              _this.$ajax.get('shoppingcart/deladdress', data).then(res => {
                if (res.data.code == 0) {
                  _this.getAddressList();
                } else {
                  _this.$api.msg(res.data.msg);
                }
              });
            } else if (res.cancel) {}
          }
        });
      },
      // 修改默认地址
      mrdz(item) {
        if (item.defaultaddressstate == 0) {
          let data = {
            defaultaddress: 1,
            addressid: item.addressid
          };
          this.$ajax.get('shoppingcart/designdefaultaddress', data).then(res => {
            if (res.data.code == 0) {
              this.addressList.forEach(it => {
                it.defaultaddressstate = 0;
              });
              item.defaultaddressstate = 1;
            } else {
              this.$api.msg(res.data.msg);
            }
          });
        }
      },
      // 获取地址列表
      getAddressList() {
        let data = {
          cguid: this.cguid,
          isCustomAddress: this.isCustomAddress,
          postkind: this.postknid
        };
        this.$ajax.get('shoppingcart/selectaddressinfo', data).then(res => {
          console.log(res);
          if (res.data.code == 0) {
            this.addressList = res.data.result.data;
          } else {
            this.$api.msg(res.data.msg);
          }
        });
      },
      //选择地址
      checkAddress(item) {
        if (this.source == 1) {
          //this.$api.prePage()获取上一页实例，在App.vue定义
          this.$api.prePage().addressData = item;
          this.$api.prePage().updateOrderAddress(item.addressid);
          uni.navigateBack();
        }
      },
      addAddress(type, addressid) {
        let url = '/pages/address/addressManage?type=' + type + '&addressid=' + addressid;
        if (this.postknid != '') url += '&postkind=' + this.postknid;
        if (this.welfareid != '') url += '&welfareid=' + this.welfareid;
        uni.navigateTo({
          url: url
        });
      },
      //添加或修改成功之后回调
      refreshList(data, type) {
        //添加或修改后事件，这里直接在最前面添加了一条数据，实际应用中直接刷新地址列表即可
        //this.addressList.unshift(data);
        this.getAddressList();
      }
    }
  };
</script>

<style lang="scss">
  page {
    padding-bottom: 120upx;
    background: rgb(245, 245, 245);
  }

  .content {
    position: relative;
  }

  .list {
    padding: 20upx 30upx;
    background: #fff;
    position: relative;
    border-top: 1rpx solid #f1f1f1;
  }

  .wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .btn {
      image {
        width: 40rpx;
        height: 40rpx;
      }
    }

    // .btns {
    //     overflow: hidden;
    //     padding-top: 10rpx;
    //     border-top: 1px solid #dddddd;
    //     font-size: 28rpx;
    //     margin-top: 16rpx;
    //     .radio {
    //         radio {
    //             transform: scale(0.7);
    //         }
    //     }
    //     .shanchu,
    //     .bianji {
    //         display: inline-block;
    //         padding: 6rpx 20rpx;
    //         border: 1px solid #dddddd;
    //         float: right;
    //         border-radius: 12rpx;
    //         margin-left: 30rpx;
    //     }
    // }
  }

  .address-box {
    display: flex;
    align-items: center;

    .tag {
      font-size: 24upx;
      color: $base-color;
      margin-right: 10upx;
      background: #fffafb;
      border: 1px solid #ffb4c7;
      border-radius: 4upx;
      padding: 10upx;
      line-height: 1;
      min-width: 80rpx;
      text-align: center;
    }

    .address {
      font-size: 30upx;
      color: $font-color-dark;
    }
  }

  .u-box {
    font-size: 32upx;
    margin-bottom: 16upx;

    .mention {
      display: inline-block;
      padding: 0 12rpx;
      border-radius: 10rpx;
      font-size: 24rpx;
      margin-left: 10rpx;
      background: #52B6FF;
      color: #ffffff;

      &.x {
        background: #EE3847;
      }
    }
  }

  .icon-bianji {
    display: flex;
    align-items: center;
    height: 80upx;
    font-size: 40upx;
    color: $font-color-light;
    padding-left: 30upx;
  }

  .add-btn {
    position: fixed;
    left: 30rpx;
    right: 30rpx;
    bottom: 20rpx;
    z-index: 95;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80upx;
    font-size: 32upx;
    color: #fff;
    background: linear-gradient(to right, #FF6401, #EE3847);
    border-radius: 40upx;
  }

  .tip {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx;
    background: #FDF9D6;
    color: #EE3847;
    font-size: 24rpx;

    view {
      background: url(../../static/add.png) no-repeat left center;
      background-size: 24rpx 24rpx;
      padding-left: 30rpx;
    }

    image {
      width: 30rpx;
      height: 30rpx;
    }
  }
</style>
