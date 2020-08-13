<template>
  <view class="page-content">
    <view class="goods-list">
      <view v-for="(item, index) in goodsList" :key="index" class="goods-item" @click="navToDetailPage(item)">
        <image v-if="item.isNewOnShelvesProduct == 1" class="label" :src="item.newOnShelvesProductIcon" mode="aspectFit"></image>
        <view class="image-wrapper">
          <uimg :src="item.url"></uimg>
          <image v-if="item.mainpicIcon != ''" :src="item.mainpicIcon" mode="aspectFit" class="tipimg"></image>
          <view class="tip clamp" v-if="item.mainpicIcon == '' && item.feature_short != ''">{{item.feature_short}}</view>
        </view>
        <view class="item-con">
          <view class="title">
            <img v-if="item.titleIcon != ''" :src="item.titleIcon"><text v-if="item.presell" class="presell">{{item.presell}}</text>{{ item.name }}
          </view>
          <view class="price-box">
            <text class="price">{{ item.priceHeader }}{{ item.price }}</text>
          </view>
          <view class="oldprice">{{ item.oldpriceHeader }} <text>{{ item.oldprice }}</text></view>
          <view class="clamp">
            <view class="typename">
              <block v-if="item.selficon.url">
                <image :src="item.selficon.url" mode="aspectFit"></image>
              </block>
              <block v-else><text>{{ item.typename }}</text></block>
            </view>
            <text class="companyname" @click.stop="goshop(item)">{{ item.companyname }}</text>
          </view>
        </view>
      </view>
    </view>
    <uni-load-more :status="loadingType"></uni-load-more>
  </view>
</template>
<script>
  import uimg from "@/components/uimg/uimg.vue";
  import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
  export default {
    components: {
      uniLoadMore,
      uimg
    },
    data() {
      return {
        list: [],
        goodsList: [],
        data: {},
        pagesize: 10,
        pageid: 0,
        loadingType: 'more' //加载更多状态
      };
    },
    onBackPress() {
      this.$api.ovPage()
    },
    onLoad(e) {
      uni.showLoading({
        title: '加载中'
      });
      this.data = e;
      this.load(0);
    },
    onShow() {
      if (this.$wx.isWechat()) this.$wx.share();
    },
    //下拉刷新
    onPullDownRefresh() {
      this.load(1);
    },
    //加载更多
    onReachBottom() {
      this.more();
    },
    methods: {
      load(i) {
        const data = {
          activityid: this.data.activityid,
          tabid: this.data.tabid
        }
        this.$ajax.get('homepage/listFastAccessProducts', data).then(res => {
          if (res.data.code == 0) {
            var list = res.data.result.data.productlist;
            uni.setNavigationBarTitle({
              title: res.data.result.data.title
            });
            this.loadingType = list.length >= this.pagesize ? 'more' : 'nomore';
            this.goodsList = list;
            this.pageid = list[list.length - 1].productid;
            if (i == 0) {
              uni.hideLoading();
            } else {
              uni.stopPullDownRefresh();
            }
          } else {
            this.$api.msg('系统出错,请稍后再试');
          }
        });
      },
      more() {
        if (this.loadingType == 'nomore') {
          return;
        }
        this.loadingType = 'loading';
        const data = {
          activityid: this.data.activityid,
          tabid: this.data.tabid,
          lid: this.pageid,
          pagesize: this.pagesize
        }
        this.$ajax.get('homepage/listFastAccessProducts', data).then(res => {
          if (res.data.code == 0) {
            var list = res.data.result.data.productlist;
            this.loadingType = list.length >= this.pagesize ? 'more' : 'nomore';
            if (list.length > 0) {
              this.goodsList = this.goodsList.concat(list);
              this.pageid = list[list.length - 1].productid;
            }
          } else {
            this.$api.msg('系统出错,请稍后再试');
          }
        });
      },
      navToDetailPage(item) {
        //测试数据没有写id，用title代替
        let id = item.productid;
        uni.navigateTo({
          url: '/pages/product/product?productid=' + id
        });
      },
      goshop(it) {
        if (it.isself == 0) {
          uni.navigateTo({
            url: '/pages/product/shop?cguid=' + it.cguid
          });
        } else if (it.isself == 1) {
          uni.navigateTo({
            url: '/pages/product/shopproductlist?cguid=' + it.cguid
          });
        }
      },
    }
  };
</script>
<style lang="scss">
  .page-content {
    position: relative;
    width: 100%;
    font-size: 14px;
    background: #eee;
  }

  .banner {
    position: relative;
    width: 100%;
    height: 400upx;
  }

  .swiper-img {
    width: 100%;
    height: 400upx;
  }

  uni-image {
    width: 100%;
    height: 400upx;
  }

  .tabbody {
    position: relative;
    width: 100%;
    border-bottom: 3px solid #4cd964;
  }

  .goods-list {
    display: flex;
    flex-wrap: wrap;
    padding: 20rpx;

    .goods-item {
      display: flex;
      flex-direction: column;
      width: 48%;
      margin-bottom: 40upx;
      padding: 20rpx;
      background: #fff;
      border-radius: 20rpx;

      &:nth-child(2n + 1) {
        margin-right: 4%;
      }
    }

    .image-wrapper {
      width: 100%;
      height: 330upx;
      border-radius: 3px;
      overflow: hidden;

      image {
        width: 100%;
        height: 100%;
        opacity: 1;
      }
    }

    .price-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-right: 10upx;
      font-size: 24upx;
      color: $font-color-light;
    }

    .price {
      font-size: $font-lg;
      color: $uni-color-primary;
      line-height: 1;
    }

    .typename {
      font-size: 24rpx;
      padding: 0rpx 8rpx;
      background: $uni-color-primary;
      color: white;
      margin-right: 12rpx;
      border-radius: 6rpx;
    }

    .companyname {
      font-size: 24rpx;

      &:after {
        content: '>';
        font-size: 24rpx;
        margin: 0 0 0 8rpx;
      }
    }
  }
</style>
