<template>
  <view class="container">
    <!-- 空白页 -->
    <view v-if="empty === true">
      <view class="empty">
        <view class="empty-tips">
          购物车空空如也~
        </view>
        <view class="btns">
          <view @click="gofls">逛逛秒杀</view>
          <view @click="gofl">看看关注</view>
        </view>
      </view>

    </view>
    <view v-else>
      <view class="naver">
        购物车<text @click="delstats">{{ delstat == false ? '编辑' : '完成' }}</text>
      </view>
      <!-- 列表 -->
      <view class="cart-list">
        <block v-for="(item, index) in cartList" :key="index">
          <view class="shop-item">
            <view class="shop-title cart-item">
              <view class="yticon icon-xuanzhong2 checkbox" :class="{ checked: item.checked }" @click="check('shop', index)"></view>
              <view style="flex-grow: 1;" class="name">
                <text>{{ item.companyname }}</text>
                <!-- <text class="tip">免运费</text> -->
              </view>
            </view>
            <uni-swipe-action v-for="(items, indexs) in item.goodsinfo" :key="indexs">
              <uni-swipe-action-item :options="options" @click="onClick" @change="change">
                <view class="cart-item" :class="items.isuse == 0 ? 'xj' : ''">
                  <view class="yticon icon-xuanzhong2 checkbox" :class="{ checked: items.checked }" @click="check('item', index, indexs)"></view>
                  <view class="image-wrapper" @click="check('item', index, indexs)">
                    <img :src="items.pic.url" :class="[item.loaded]" />
                    <text></text>
                  </view>

                  <view class="item-right">
                    <view @click="openproduck(items)">
                      <view class="clamp title">{{ items.productname }}</view>
                      <view class="clamp attr">{{ items.attributeshow }}</view>

                    </view>
                    <view class="edit">
                      <view class="con">
                        <view class="price">¥{{ items.newprice }}</view>
                      </view>
                      <uni-number-box class="step" :min="1" :max="items.number > items.stock ? items.number : items.stock"
                        :value="items.number" :isMin="items.number === 1" :isMax="items.number >= items.stock ? true : false"
                        :index="indexs" :zindex="index" @eventChange="numberChange" v-if="items.isuse == 1" :disabled="truess"></uni-number-box>
                    </view>
                    <text class="tip" v-if="items.isfull == 0 && items.isuse == 1">库存不足,请修改数量</text>
                  </view>
                </view>
              </uni-swipe-action-item>
            </uni-swipe-action>

          </view>
        </block>
      </view>
      <view class="undercarriage" v-show="noCartList.length > 0">
        <view class="title">
          <text>已下架商品({{ noCartList.length }})</text>
          <text class="close" @click="delNoCarts">全部删除</text>
        </view>
        <view class="list">
          <view class="item xj" v-for="(item, index) in noCartList" :key="index">
            <view class="img">
              <image :src="item.pic.url" mode="aspectFit"></image>
              <text></text>
            </view>
            <view class="main">
              <view class="titles">{{ item.productname }}</view>
              <view class="tip">{{ item.attributeshow }}</view>
              <!-- <view class="btn">
                                <text></text>
                                <text class="btns">看相似</text>
                            </view> -->
            </view>
          </view>
        </view>
      </view>
      <!-- 底部菜单栏 -->
      <view class="action-section">
        <view class="checkbox">
          <image :src="allChecked ? '/static/selected.png' : '/static/select.png'" mode="aspectFit" @click="check('all')"></image>
          <view class="clear-btn" :class="{ show: allChecked }" @click="clearCart">删除</view>
        </view>
        <block v-if="delstat == false">
          <view class="total-box">
            <view class="price">
              <text class="coupon" v-show="oldtotal != ''">总额:{{ oldtotal }}，</text>
              合计:{{ total == '' ? 0 : total }}
            </view>
            <text class="coupon" v-show="extra_price != 0">{{ extra_price }}</text>
          </view>
          <button type="primary" class="no-border confirm-btn" @click="createOrder">结算</button>
        </block>
        <block v-else>
          <view class="total-box"></view>
          <button type="primary" class="no-border confirm-btn" @click="deleteCartItem">删除</button>
        </block>
      </view>
    </view>
    <!-- 为您推荐
        <view class="f-header"><image :src="row.pic[0].url" :style="'width:' + row.pic[0].width + 'rpx;height:' + row.pic[0].height + 'rpx;'"></image></view>
        <view class="goods-list">
            <view class="goods-item" v-for="(item, index) in guess" :key="index" @click="navToDetailPage(item)">
                <image v-if="item.isNewOnShelvesProduct == 1" class="label" :src="item.newOnShelvesProductIcon" mode="aspectFit"></image>
                <view class="image-wrapper">
                    <uimg :src="item.url"></uimg>
                    <view class="tip clamp"></view>
                </view>
                <view class="item-con">
                    <view class="title clamp"><text v-if="item.presell" class="presell">{{item.presell}}</text>{{ item.name }}</view>
                    <view class="price-box clamp">
                        <text class="price">{{ item.price }}</text>
                        <text v-if="item.activitylist.length == 0">{{ item.sales }}</text>
                        <view v-else>
                            <text v-for="ite in item.activitylist" :key="ite.wholetext" :style="{color:ite.color,borderColor:ite.color}">{{ ite.wholetext }}</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
         -->

  </view>
</template>

<script>
  import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
  import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue'
  import uniNumberBox from '@/components/uni-number-box.vue';
  export default {
    components: {
      uniNumberBox,
      uniSwipeAction,
      uniSwipeActionItem
    },
    data() {
      return {
        truess: true,
        oldtotal: 0,
        extra_price: 0,
        total: 0, //总价格
        msg: '',
        allChecked: false, //全选状态  true|false
        empty: false, //空白页现实  true|false
        cartList: [],
        noCartList: [],
        delstat: false,
        options: [{
          text: '移入关注',
          style: {
            backgroundColor: '#FFB500'
          }
        }, {
          text: '删除',
          style: {
            backgroundColor: '#FF6401'
          }
        }]
      };
    },
    created() {
      uni.showLoading({
        title: '加载中'
      });
      this.load();
      let _this = this;
      uni.$on('changeLoginState', function(data) {
        _this.load();
      });
      uni.$on('join', function(data) {
        _this.load();
      });
    },
    watch: {
      //显示空白页
      cartList(e) {
        let empty = e.length === 0 ? true : false;
        if (this.empty !== empty) {
          this.empty = empty;
        }
      }
    },

    methods: {
      gofl() {
        // if (uni.getStorageSync('userInfo').guid) {
        //   uni.navigateTo({
        //     url: '/pages/welfare/welfare'
        //   })
        // }else{
        //   this.$api.msg('请登录');
        // }
        uni.navigateTo({
          url:'/pages/user/attentionproductlist'
        })
      },
      gofls() {
        // if (uni.getStorageSync('userInfo').guid) {
        //   uni.navigateTo({
        //     url: '/pages/fenXiao/fenxiaoMain/fenxiaoMain'
        //   })
        // }else{
        //   this.$api.msg('请登录');
        // }
        uni.navigateTo({
          url:'/pages/product/rushbuy'
        })
      },
      onClick(e) {
        console.log('当前点击的是第' + e.index + '个按钮，点击内容是' + e.content.text)
      },
      change(open) {
        console.log('当前开启状态：' + open)
      },
      //请求数据
      load(type) {
        const data = {
          timestamp: new Date().getTime()
        };
        this.$ajax.get('shoppingcart/lookshoplist', data).then(res => {
          if (res.data.code == 0) {
            let list = res.data.result.data;
            if (type == 'res') {
              this.cartList = [];
            }
            this.noCartList = [];
            let noIndex = [];
            let cartList = list.map((item, index) => {
              item.checked = false;
              for (var i = 0; i < item.goodsinfo.length; i++) {
                item.goodsinfo[i].checked = false;
                if (item.goodsinfo[i].isuse == 0) {
                  this.noCartList.push(item.goodsinfo[i]);
                  item.goodsinfo.splice(i, 1);
                  i--;
                }
              }
              if (item.goodsinfo.length == 0) noIndex.push(index);
              return item;
            });
            noIndex.forEach(item => {
              cartList.splice(item, 1);
            });
            this.allChecked = false;
            this.cartList = cartList;
            uni.hideLoading();
          } else {
            this.$api.msg(res.data.msg);
          }
          uni.stopPullDownRefresh();
        });
        // let list = await this.$api.json('cartList');
        // let cartList = list.map(item=>{
        // 	item.checked = true;
        // 	return item;
        // });
        // this.cartList = cartList;
        // this.calcTotal();  //计算总价
      },
      // 删除不能购买的商品
      delNoCarts() {
        let _this = this;
        uni.showModal({
          title: '提示',
          content: '您确定全部删除商品吗',
          success: function(res) {
            if (res.confirm) {
              let k = [];
              _this.noCartList.forEach(item => {
                k.push(item.id);
              });
              const data = {
                shopid: k
              };
              _this.$ajax.get('shoppingcart/delshop', data).then(res => {
                if (res.data.code == 0) {
                  _this.load();
                  _this.cartnumbers();
                  _this.$api.msg('删除成功');
                } else {
                  _this.$api.msg(res.data.msg);
                }
              });
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          }
        });
      },
      more() {},
      openindex() {
        this.$store.state.footer_store.now_page_index = 'home';
      },
      cartnumbers() {
        this.$ajax.get('shoppingcart/getModelTipNum', {
          code: 'SHOPCART'
        }).then(res => {
          let number = res.data.result.data.tipnumber;
          this.$store.commit("set_number", number)
        });
      },
      delstats() {
        this.delstat = !this.delstat;
        this.load();
        this.allChecked = false;
        this.calcTotal();
      },
      navToLogin() {
        uni.navigateTo({
          url: '/pages/public/login'
        });
      },
      openproduck(it) {
        let id = it.productid;
        uni.navigateTo({
          url: '/pages/product/product?productid=' + id
        });
      },
      //选中状态处理
      check(type, index, indexs) {
        if (type === 'item') {
          this.cartList[index].goodsinfo[indexs].checked = !this.cartList[index].goodsinfo[indexs].checked;
          let shopitem = [];
          let shopfalse = [];
          this.cartList[index].goodsinfo.forEach(item => {
            if (item.isuse != 0 || this.delstat) {
              if (item.isfull != 0 || this.delstat) {
                if (item.checked) {
                  shopitem.push(2);
                }
              } else {
                item.checked = false;
                shopfalse.push(2);
              }
            } else {
              item.checked = false;
              shopfalse.push(2);
            }
          });
          if (shopitem.length + shopfalse.length == this.cartList[index].goodsinfo.length && shopitem.length > 0) {
            this.cartList[index].checked = true;
          } else {
            this.cartList[index].checked = false;
          }

          let kgz = true;
          this.cartList.forEach(item => {
            if (item.checked == false) {
              item.goodsinfo.forEach(ite => {
                if ((ite.isuse != 0 && ite.isfull != 0) || this.delstat) {
                  if (ite.checked == false) {
                    kgz = false;
                  }
                }
              });
            }
          });
          this.allChecked = kgz;
        } else if (type === 'shop') {
          this.cartList[index].checked = !this.cartList[index].checked;
          let kg = this.cartList[index].checked;
          let shopstata = false;
          for (var i = 0; i < this.cartList[index].goodsinfo.length; i++) {
            if (this.cartList[index].goodsinfo[i].isuse == 0 || this.cartList[index].goodsinfo[i].isfull == 0) {
              if (this.delstat == true) {
                this.cartList[index].goodsinfo[i].checked = kg;
                shopstata = true;
              } else {
                this.cartList[index].goodsinfo[i].checked = false;
              }
            } else {
              this.cartList[index].goodsinfo[i].checked = kg;
              shopstata = true;
            }
          }
          if (shopstata == false) {
            this.cartList[index].checked = false;
          }
          let kgz = true;
          this.cartList.forEach(item => {
            if (item.checked == false) {
              item.goodsinfo.forEach(ite => {
                if ((ite.isuse != 0 && ite.isfull != 0) || this.delstat) {
                  if (ite.checked == false) {
                    kgz = false;
                  }
                }
              });
            }
          });
          this.allChecked = kgz;
        } else {
          const checked = !this.allChecked;
          const list = this.cartList;
          let cartList = list.map(item => {
            item.checked = checked;
            let erc = [];
            for (var i = 0; i < item.goodsinfo.length; i++) {
              item.goodsinfo[i].checked = checked;
              if (item.goodsinfo[i].isuse == 0 || item.goodsinfo[i].isfull == 0) {
                if (this.delstat == false) {
                  item.goodsinfo[i].checked = false;
                  erc.push('en');
                } else {
                  item.goodsinfo[i].checked = checked;
                }
              }
            }
            if (erc.length == item.goodsinfo.length) {
              item.checked = false;
            }
            return item;
          });
          this.cartList = cartList;
          this.allChecked = checked;
        }
        if (this.delstat == false) {
          this.calcTotal();
        }
      },
      //数量
      numberChange(data) {
        if (!this.delstat) {
          let idnum = this.cartList[data.zindex].goodsinfo[data.index].id;
          const datas = {
            number: data.number - this.cartList[data.zindex].goodsinfo[data.index].number,
            shopid: idnum
          };
          this.$ajax.get('shoppingcart/updatestocfix', datas).then(res => {
            if (res.data.code == 0) {
              this.allChecked = false;
              this.$ajax.get('shoppingcart/lookshoplist', {}).then(res => {
                if (res.data.code == 0) {
                  let list = res.data.result.data;
                  list.forEach((item, pindex) => {
                    item.goodsinfo.forEach((it, index) => {
                      if (idnum == it.id) {
                        this.cartList.forEach((newitem, pindex) => {
                          newitem.goodsinfo.forEach((newit, index) => {
                            if (idnum == newit.id) {
                              newit.isfull = it.isfull;
                              newit.isues = it.isues;
                              newit.number = it.number;
                              newit.state = it.state;
                              newit.stock = it.stock;
                            }
                          });
                        });
                      }
                    });
                  });
                } else {
                  this.$api.msg(res.data.msg);
                }
              });

              this.calcTotal();
            } else {
              this.$api.msg(res.data.msg);
            }
          });
        }
      },
      //删除
      deleteCartItem() {
        let _this = this;
        uni.showModal({
          title: '提示',
          content: '您确定删除商品吗',
          success: function(res) {
            if (res.confirm) {
              let k = [];
              _this.cartList.forEach(item => {
                item.goodsinfo.forEach(it => {
                  if (it.checked) {
                    k.push(it.id);
                  }
                });
              });
              const data = {
                shopid: k
              };
              _this.$ajax.get('shoppingcart/delshop', data).then(res => {
                if (res.data.code == 0) {
                  _this.load();
                  _this.cartnumbers();
                  _this.$api.msg('删除成功');
                } else {
                  _this.$api.msg(res.data.msg);
                }
              });
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          }
        });
      },
      //清空
      clearCart() {
        let _this = this;
        uni.showModal({
          content: '清空购物车？',
          success: e => {
            if (e.confirm) {
              let k = [];
              _this.cartList.forEach(item => {
                item.goodsinfo.forEach(it => {
                  k.push(it.id);
                });
              });
              const data = {
                shopid: k
              };
              _this.$ajax.get('shoppingcart/delshop', data).then(res => {
                if (res.data.code == 0) {
                  _this.load();
                  _this.cartnumbers();
                } else {
                  _this.$api.msg(res.data.msg);
                }
              });
            }
          }
        });
      },
      //计算总价
      calcTotal() {
        let list = this.cartList;
        if (list.length === 0) {
          this.empty = true;
          return;
        }
        let total = [];
        let checked = true;
        list.forEach(item => {
          item.goodsinfo.forEach(item => {
            if (item.checked === true) {
              total.push(item.id);
            }
          });
        });
        const data = {
          shopids: total
        };
        this.$ajax.get('shoppingcart/shopcartdiscountinfo', data).then(res => {
          if (res.data.code == 0) {
            let data = res.data.result.data;
            this.total = data.price_true;
            this.extra_price = data.extra_price;
            this.oldtotal = data.totalprice;
            this.msg = '';
          } else {
            this.msg = res.data.msg;
          }
        });
        //this.allChecked = checked;
        //this.total = Number(total.toFixed(2));
      },
      //创建订单
      createOrder() {
        if (this.msg.length > 0) {
          this.$api.msg(this.msg);
          return;
        }
        let list = this.cartList;
        let goodsData = [];
        list.forEach(item => {
          item.goodsinfo.forEach(goods => {
            if (goods.checked) {
              console.log(goods);
              goodsData.push({
                attr_val: goods.id,
                number: goods.number
              });
            }
          });
        });
        if (goodsData.length > 0) {
          uni.navigateTo({
            url: '/pages/order/createOrder?type=cart&data=' + JSON.stringify({
              goodsData: goodsData
            })
          });
        } else {
          this.$api.msg('请选择商品');
        }
      }
    }
  };
</script>

<style lang="scss">
  page {
    background: #f8f8f8;
  }

  .undercarriage {
    padding: 20rpx 20rpx 20rpx 104rpx;
    background: #FFF;
    border-radius: 10rpx;
    margin: 10rpx 0;

    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 28rpx;
      color: #333;
      margin-bottom: 20rpx;

      .close {
        background: #F5F5F5;
        border-radius: 30rpx;
        padding: 10rpx 30rpx;
      }
    }

    .list {
      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .img {
          width: 200rpx;
          height: 200rpx;
          position: relative;

          image {
            width: 200rpx;
            height: 200rpx;
          }
        }

        &.xj {
          .img {
            position: relative;

            text {
              position: absolute;
              left: 0;
              top: 0;
              right: 0;
              bottom: 0;
              background: url(../../static/below.png) no-repeat center rgba(0, 0, 0, 0.3);
            }
          }
        }

        .main {
          color: #DDDDDD;
          flex: 1;
          padding-left: 20rpx;
          font-size: 26rpx;

          .btn {
            color: #333;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .btns {
              color: #EE3847;
              border: 1rpx solid #EE3847;
              padding: 10rpx 30rpx;
              border-radius: 30rpx;
            }
          }
        }
      }
    }
  }

  .naver {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    text-align: center;
    background: #fff;
    z-index: 10;
    font-weight: 700;
    font-size: 32rpx;
    line-height: 88rpx;
    text-align: center;

    text {
      font-size: 26rpx;
      line-height: 88rpx;
      font-weight: 500;
      margin-right: 30rpx;
      position: absolute;
      right: 0;
    }
  }

  .cart-list {
    margin-top: 88rpx;
  }

  .container {
    padding-bottom: 200upx;
    background: #f8f8f8;
    border-top: 1px solid #f1f1f1;

    /* 空白页 */
    .empty {
      background: #fff;
      padding: 40rpx;

      .empty-tips {
        font-size: $font-sm + 2upx;
        color: $font-color-disabled;
        text-align: center;
        margin-bottom: 40rpx;
      }

      .btns {
        display: flex;
        align-items: center;
        justify-content: space-evenly;

        view {
          font-size: 28rpx;
          color: #333;
          padding: 16rpx 40rpx;
          border: 1rpx solid #F1f1f1;
          border-radius: 30rpx;
        }
      }
    }
  }

  /* 购物车列表项 */

  .shop-item {
    margin-bottom: 16upx;
    background: #ffffff;
    border-bottom: 1px solid #f5f5f5;

    .shop-title {
      padding: 30upx 20upx 0 20upx !important;
      font-size: 28upx;

      .name {
        overflow: hidden;

        .tip {
          float: right;
          color: #3AD49B;
          background: #9FF3D4;
          border-radius: 30rpx;
          padding: 4rpx 30rpx;
          font-size: 24rpx;
        }
      }
    }
  }

  .cart-item {
    display: flex;
    position: relative;
    padding: 16upx 20upx;
    align-items: center;
    width: 100%;

    .image-wrapper {
      width: 200upx;
      height: 200upx;
      flex-shrink: 0;
      position: relative;

      image {
        border-radius: 8upx;
      }

      img {
        width: 200upx;
        height: 200upx;
        border-radius: 8upx;
      }
    }

    &.xj {
      color: $border-color-base;

      .image-wrapper {
        position: relative;

        text {
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          background: url(../../static/below.png) no-repeat center rgba(0, 0, 0, 0.3);
        }
      }
    }

    .checkbox {
      z-index: 8;
      font-size: 44upx;
      line-height: 1;
      padding: 20upx;
      color: $font-color-disabled;
      background: #fff;
      border-radius: 50px;
    }

    .item-right {
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
      position: relative;
      padding-left: 30upx;

      .title,
      .price {
        font-size: $font-base + 2upx;
        color: $font-color-dark;
        height: 40upx;
        line-height: 40upx;
      }

      .attr {
        font-size: $font-sm + 2upx;
        color: $font-color-light;
        height: 50upx;
        line-height: 50upx;
      }

      .price {
        height: 50upx;
        line-height: 50upx;
        color: $base-color;
      }

      .tip {
        font-size: 24rpx;
      }

      .edit {
        display: flex;
        align-items: center;
        margin-top: 20rpx;

        .con {
          flex-grow: 1;
          word-break: break-all;

          .oldprice {
            font-size: 24rpx;
            text-decoration: line-through;
            color: #969696;
          }
        }

        .step {
          min-width: 100px;
        }
      }
    }

    .del-btn {
      padding: 4upx 10upx;
      font-size: 34upx;
      height: 50upx;
      color: $font-color-light;
    }
  }

  /* 底部栏 */
  .action-section {
    margin-bottom: 100rpx;
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 95;
    display: flex;
    align-items: center;
    padding: 0 0 0 30upx;
    background: #ffffff;
    border-bottom: 1rpx solid #f1f1f1;

    .checkbox {
      height: 52upx;
      position: relative;

      image {
        width: 52upx;
        height: 100%;
        position: relative;
        z-index: 5;
      }
    }

    .clear-btn {
      position: absolute;
      left: 26upx;
      top: 0;
      z-index: 4;
      width: 0;
      height: 52upx;
      line-height: 52upx;
      font-size: $font-base;
      color: #fff;
      background: $font-color-disabled;
      border-radius: 0 50px 50px 0;
      opacity: 0;
      transition: 0.2s;
      display: none;

      &.show {
        display: block;
        padding-left: 38upx;
        opacity: 1;
        width: 120upx;
      }
    }

    .total-box {
      flex: 1;
      display: flex;
      flex-direction: column;
      text-align: right;
      padding-right: 40upx;

      .price {
        font-size: $font-lg;
        color: $font-color-dark;

        text {
          font-size: 24rpx;
        }
      }

      .coupon {
        font-size: $font-sm;
        color: $font-color-light;

        text {
          color: $font-color-dark;
        }
      }
    }

    .confirm-btn {
      padding: 0 38upx;
      margin: 0;
      border-radius: 0;
      height: 90upx;
      line-height: 90upx;
      font-size: $font-base + 2upx;
      background: $uni-color-primary;
    }
  }

  /* 复选框选中状态 */
  .action-section .checkbox.checked,
  .cart-item .checkbox.checked {
    color: $uni-color-primary;
  }
</style>
