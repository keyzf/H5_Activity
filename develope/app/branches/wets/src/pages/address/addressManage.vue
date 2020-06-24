<template>
  <view class="content">
    <view class="row b-b">
      <text class="tit">收货人</text>
      <input class="input" type="text" v-model="addressData.receivername" placeholder="请填写收货人姓名" placeholder-class="placeholder" />
    </view>
    <view class="row b-b">
      <text class="tit">手机号码</text>
      <input class="input" type="number" v-model="addressData.receivertel" placeholder="请填写收货人手机号" placeholder-class="placeholder" />
    </view>
    <view class="row b-b" v-if="welfareid != ''">
      <text class="tit">备用电话</text>
      <input class="input" type="number" v-model="addressData.alternatetel" placeholder="请填写备用手机号" placeholder-class="placeholder" />
    </view>
    <view class="row b-b" v-show="type >= 3">
      <text class="tit">所在地区</text>
      <input @click="clickAddressName()" class="input" type="text" disabled="true" v-model="addressData.districtname"
        placeholder="省市区县、乡镇等" placeholder-class="placeholder" />
    </view>
    <view class="row b-b" v-show="type >= 3">
      <text class="tit">详细地址</text>
      <input class="input" type="text" v-model="addressData.address" placeholder="街道、楼牌号等" placeholder-class="placeholder" />
    </view>
    <view class="row b-b" v-show="type < 3">
      <text class="tit btn">{{ type == 1 ? '所区' : '西区' }}</text>
    </view>
    <view class="row b-b" v-show="type < 3">
      <text class="tit">提货点</text>
      <picker @change="bindPickerChange" :value="index" :range="addressArray">
        <view class="uni-input">{{ addressData.address }}</view>
      </picker>
    </view>

    <view class="row default-row">
      <view class="tit">
        <view class="name">设为默认</view>
        <view>提醒:每次下单会默认推荐使用该地址</view>
      </view>
      <switch :checked="addressData.defaultaddressstate == 1" color="#fa436a" @change="switchChange" />
    </view>
    <button class="add-btn" @click="confirm">提交</button>
    <semp-city @confirm="onCityClick" :showbox="showboxs" :postkind="addressData.postkind" @change="ckshow"></semp-city>
  </view>
</template>

<script>
  import sempCity from "@/components/semp-city/semp-city.vue"
  export default {
    components: {
      sempCity
    },
    data() {
      return {
        submitMark: true,
        showboxs: false,
        index: 0,
        addressArray: [],
        addressData: {
          address: '',
          addressid: '',
          addresstype: 3,
          alternatetel: '',
          companyguid: '',
          defaultaddressstate: 0,
          detailed_address: '',
          districtid: '',
          districtname: '',
          fourthdistrictid: '',
          guid: '',
          province: '',
          receivertel: '',
          receivername: '',
          postkind: ''
        },
        welfareid: '',
        type: 3
      }
    },
    onLoad(option) {
      let title = '新增收货地址';
      this.addressData.addressid = option.addressid == 0 ? '' : option.addressid;
      this.addressData.postkind = option.postkind || '';
      this.welfareid = option.welfareid || '';
      if (option.type === 'edit') {
        title = '编辑收货地址'
        this.getAddressType();
      }
      this.manageType = option.type;
      uni.setNavigationBarTitle({
        title
      })
    },
    onNavigationBarButtonTap(e) {
      if (!this.addressData.addressid) {} else {
        this.delAddress(this.addressData.addressid)
      }
    },
    onBackPress() {
      this.$api.ovPage()
    },
    onShow() {
      if (this.$wx.isWechat()) this.$wx.share();
    },
    methods: {
      // 获取地址类型
      getAddressType() {
        this.$ajax.get('shoppingcart/getAddressTypeByAid', {
          addressid: this.addressData.addressid
        }).then(res => {
          console.log(res);
          if (res.data.code == 0) {
            let data = res.data.result.data;
            data.forEach(item => {
              if (item.type == 1 || item.type == 2) {
                this.type = item.type;
              }
            });
            if (this.type < 3) {
              this.pickerClick();
            }
            this.getAddressById();
          } else {
            this.$api.msg(res.data.msg);
          }
        })
      },
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
                  _this.$api.prePage().getAddressList();
                  uni.navigateBack();
                } else {
                  _this.$api.msg(res.data.msg);
                }
              });
            } else if (res.cancel) {}
          }
        });
      },
      // 获取地址详情
      getAddressById() {
        this.$ajax.get('shoppingcart/geteditaddress', {
          addressid: this.addressData.addressid
        }).then(res => {
          if (res.data.code == 0) {
            let data = res.data.result.data;
            this.addressData.address = data.address;
            this.addressData.addressid = data.addressid;
            this.addressData.addresstype = data.addresstype;
            this.addressData.alternatetel = data.alternatetel;
            this.addressData.companyguid = data.companyguid;
            this.addressData.defaultaddressstate = data.defaultaddressstate;
            this.addressData.detailed_address = data.detailed_address;
            this.addressData.districtid = data.districtid;
            this.addressData.districtname = data.districtname;
            this.addressData.fourthdistrictid = data.fourthdistrictid;
            this.addressData.guid = data.guid;
            this.addressData.province = data.province;
            this.addressData.receivername = data.receivername;
            this.addressData.receivertel = data.receivertel;
            this.addressData.postkind = data.postkind;
          } else {
            this.$api.msg('系统出错,请稍后再试');
          }
        });
      },
      // 获取地址类型tab
      getAddressTypeByAid() {
        this.$ajax.get('shoppingcart/getAddressTypeByAid', {
          addressid: this.addressData.addressid
        }).then(res => {
          console.log(res);
          if (res.data.code == 0) {
            this.addressData.addresstype = res.data.result.data[0].type;
          } else {
            this.$api.msg('系统出错,请稍后再试');
          }
        });
      },
      // 添加地址
      saveAddress() {
        this.$ajax.get('shoppingcart/addaddressinfo', {
          receivertel: this.addressData.receivertel,
          receivername: this.addressData.receivername,
          guid: this.addressData.guid,
          // province: this.addressData.districtname,
          detailed_address: this.addressData.address,
          defaultaddress: this.addressData.defaultaddressstate,
          addresstype: this.addressData.addresstype,
          districtid: this.addressData.districtid,
          welfareid: this.welfareid,
          alternatetel: this.addressData.alternatetel,
          fourthdistrictid: this.addressData.fourthdistrictid,
          postkind: this.addressData.postkind
        }).then(res => {
          console.log(res);
          if (res.data.code == 0) {
            //this.$api.prePage()获取上一页实例，可直接调用上页所有数据和方法，在App.vue定义
            this.addressData.addressid = res.data.result.data.id;
            this.$api.prePage().refreshList({}, this.manageType);
            this.$api.msg(`地址${this.manageType=='edit' ? '修改': '添加'}成功`);
            setTimeout(() => {
              uni.navigateBack()
            }, 800)
          } else {
            this.$api.msg(`地址${this.manageType=='edit' ? '修改': '添加'}失败，${res.data.msg}`);
            this.submitMark = true;
          }
        });
      },

      // 保存地址
      editAddress() {
        this.$ajax.get('shoppingcart/saveaddress', {
          receivertel: this.addressData.receivertel,
          receivername: this.addressData.receivername,
          guid: this.addressData.guid,
          //province: this.addressData.fourthdistrictid,
          detailed_address: this.addressData.address,
          defaultaddress: this.addressData.defaultaddressstate,
          addressid: this.addressData.addressid,
          addresstype: this.addressData.addresstype,
          districtid: this.type < 3 ? '' : this.addressData.districtid,
          welfareid: this.welfareid,
          alternatetel: this.addressData.alternatetel,
          fourthdistrictid: this.type < 3 ? '' : this.addressData.fourthdistrictid,
          postkind: this.addressData.postkind
        }).then(res => {
          if (res.data.code == 0) {
            //this.$api.prePage()获取上一页实例，可直接调用上页所有数据和方法，在App.vue定义
            let data = this.addressData;
            this.$api.prePage().refreshList(data, this.manageType);
            this.$api.msg(`地址${this.manageType=='edit' ? '修改': '添加'}成功`);
            setTimeout(() => {
              uni.navigateBack()
            }, 800)
          } else {
            this.$api.msg(`地址${this.manageType=='edit' ? '修改': '添加'}失败`);
            this.submitMark = true;
          }
        });
      },

      switchChange(e) {
        this.addressData.defaultaddressstate = e.detail.value ? 1 : 0;
      },

      //返回地址参数
      onCityClick(val) {
        // 先关闭弹出层
        this.showboxs = false;
        if (val.town.value == 0) {
          this.addressData.districtname = val.province.label + ',' + val.city.label + ',' + val.county.label;
        } else {
          this.addressData.districtname = val.province.label + ',' + val.city.label + ',' + val.county.label + ',' +
            val.town.label;
        }
        // 区县id
        this.addressData.districtid = val.county.value;
        // 第四级id
        this.addressData.fourthdistrictid = val.town.value;
      },

      //提交
      confirm() {
        if (!this.addressData.receivername) {
          this.$api.msg('请填写收货人姓名');
          return;
        }
        if (!/(^1[3|4|5|7|8][0-9]{9}$)/.test(this.addressData.receivertel)) {
          this.$api.msg('请输入正确的手机号码');
          return;
        }
        if (!this.addressData.districtname) {
          this.$api.msg('请选择收货地址');
          return;
        }
        if (!this.addressData.address) {
          this.$api.msg('请填写详细收货地址');
          return;
        }
        console.log(this.addressData);
        if (!this.submitMark) {
          this.$api.msg('请稍后再试');
          return;
        }
        this.submitMark = false;
        if (this.addressData.addressid < 1) {
          this.saveAddress();
        } else {
          this.editAddress();
        }
      },

      // 省市县点击打开弹出层
      clickAddressName() {
        this.showboxs = true;
      },
      ckshow(e) {
        if (e.show == false) {
          this.showboxs = false;
        }
      },
      // 获取地址列表
      pickerClick() {
        this.$ajax.get('shoppingcart/workshoplist', {
          addresstype: this.type
        }).then(res => {
          if (res.data.code == 0) {
            let _this = this;
            _this.addressArray = [];
            res.data.result.data.forEach((item, index) => {
              _this.addressArray.push(item.workshop);
              if (item.workshop == _this.addressData.address) _this.index = index;
            });
          } else {
            this.$api.msg(res.data.msg);
          }
        });
      },
      // 选择地址
      bindPickerChange(e) {
        this.index = e.detail.value;
        this.addressData.address = this.addressArray[e.detail.value];
      }
    }
  }
</script>

<style lang="scss">
  page {
    background: $page-color-base;
    padding-top: 16upx;
  }

  .row {
    display: flex;
    align-items: center;
    position: relative;
    padding: 0 30upx;
    height: 110upx;
    background: #fff;

    .tit {
      flex-shrink: 0;
      width: 140rpx;
      font-size: 30upx;
      color: $font-color-dark;
      min-width: 140rpx;

      &.btn {
        background: $base-color;
        color: #FFF;
        border-radius: 10rpx;
        text-align: center;
        display: inline-block;
        padding: 10rpx 0;
      }
    }

    /deep/ uni-picker {
      flex: 1;
    }

    .uni-input {
      text-align: right;
      font-family: 'yticon' !important;
      font-size: 32rpx;
      font-style: normal;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      position: relative;
      padding-right: 60rpx;

      &:after {
        content: '\e606';
        position: absolute;
        right: 0;
        top: 50%;
        margin-top: -16rpx;
        line-height: 1;
      }

    }

    .input {
      flex: 1;
      color: $font-color-dark;
      font-size: 30rpx;
    }

    .icon-shouhuodizhi {
      font-size: 36upx;
      color: $font-color-light;
    }
  }

  .default-row {
    margin-top: 16upx;
    height: auto;
    padding: 30rpx;

    .tit {
      flex: 1;
      font-size: 24rpx;
      color: #333;

      .name {
        font-size: 32rpx;
      }
    }

    switch {
      transform: translateX(16upx) scale(.9);
    }
  }

  .add-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 690upx;
    height: 80upx;
    margin: 60upx auto;
    font-size: $font-lg;
    color: #fff;
    background: linear-gradient(to right, #FF6401, #EE3847);
    border-radius: 40upx;
  }
</style>
