<template>
  <view>
    <view class="list" v-for="(item,index) in data">
      <block v-if="item.elementType=='JUMP_PIC'">
        <block v-for="n in round(item)">
          <view class="item" :style="{background: item.display.backgroundColor}">
            <block v-for="(it,ind) in find(item.detail,n,item.display.rowNumber)">
              <image :src="it.pictureUrl" mode="aspectFit" :style="{width:'750rpx',height: (750/item.display.width)*item.display.height+'rpx'}"
                @click="go(it,index)"></image>
            </block>
          </view>
        </block>
      </block>
      <block v-if="item.elementType=='PRODUCTS'">
        <!-- 猜你喜欢 -->
        <view class="goods-list">
          <view class="goods-item" v-for="(items, index) in item.detail" :key="index" @click="navToDetailPage(items)">
            <image v-if="items.isNewOnShelvesProduct == 1" class="label" :src="items.newOnShelvesProductIcon" mode="aspectFit"></image>
            <view class="image-wrapper">
              <uimg :src="items.productPicUrl"></uimg>
              <image v-if="items.mainpicIcon != ''" :src="items.mainpicIcon" mode="aspectFit" class="tipimg"></image>
              <view class="tip clamp" v-if="items.mainpicIcon == '' && items.feature_short != ''">{{items.feature_short}}</view>
            </view>
            <view class="item-con">
              <view class="title"><img v-if="items.titleIcon != ''" :src="items.titleIcon"><text v-if="items.presell" class="presell">{{items.presell}}</text>{{ items.productName }}</view>
              <view class="price-box">
                <text class="price">{{ items.priceHeader }}{{ items.newprice }}</text>
              </view>
              <view class="oldprice">{{ items.oldpriceHeader }} <text>{{ items.oldprice }}</text></view>
            </view>
          </view>
        </view>
      </block>
    </view>
  </view>
</template>

<script>
  import uimg from "@/components/uimg/uimg.vue";
  export default {
    components: {
      uimg
    },
    data() {
      return {
        activityid: 0,
        data: []
      };
    },
    onLoad(options) {
      this.activityid = options.id;
      const data = {
        activityid: this.activityid
      };
      this.$ajax.get('homepage/inletTab', data).then(res => {
        if (res.data.code == 0) {
          uni.setNavigationBarTitle({
            title: res.data.result.data.title
          });
        }
      });
      const datas = {
        posterId: this.activityid
      };
      this.$ajax.get('poster/getPoster', datas).then(res => {
        if (res.data.code == 0) {
          this.data = res.data.result.data;
        }
      });
    },
    methods: {
      go(that, index) {
        if (this.data[index].elementType == "JUMP_PIC") {
          if (that.jumpType == "H5") {
            location.href = that.jumpLink;
          } else if (that.jumpType == "ACTIVITY") {
            uni.navigateTo({
              url: '/pages/product/catelist?id=' + that.activityId
            });
          } else if (that.jumpType == "PRODUCT") {
            uni.navigateTo({
              url: '/pages/product/product?productid=' + that.productId
            });
          }

        }
      },
      round(item) {
        if (item.detail == null) {
          return
        }
        return Math.ceil(item.detail.length / item.display.rowNumber)
      },
      find(list, n, row) {
        var da = []
        for (var i = row * n; i <= n; i++) {
          if (list[i - 1]) {
            da.push(list[i - 1])
          }
        }
        return da
      },
      navToDetailPage(item) {
        if (item.code == 'PROMOTION') {
          uni.navigateTo({
            url: '/pages/product/catelist?id=' + item.activityid
          });
        } else if (item.code == 'MORE') {
          uni.navigateTo({
            url: '/pages/product/catemore'
          });
        } else if (item.jumptype == 1) {
          uni.navigateTo({
            url: '/pages/product/product?productid=' + item.productId
          });
        } else {
          uni.navigateTo({
            url: '/pages/product/product?productid=' + item.productId
          });
        }
      },
    }
  }
</script>

<style lang="scss">
  page {
    font-size: 0;
  }

  .img {
    width: 100%;
  }
</style>
