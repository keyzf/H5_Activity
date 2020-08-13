<template>
  <view class="content">
    <view class="con" :style="{ position: headerPosition, top: headerTop }">
      <view class="search-box">
        <view class="search-left" @tap="returngo()">
          <uni-text class="yticon icon-zuo"></uni-text>
        </view>
        <!-- 原样式 如果使用原样式，恢复下方注销代码 -->
        <view class="input-box" @tap="returnSearch()"><input type="text" :placeholder="keyword" placeholder-class="placeholder-class"
            confirm-type="search" disabled /></view>
        <view class="search-btn" @click="searchstart">
          <image v-show="searchliststart == 1" src="../../static/searchlist.png" mode="aspectFit"></image>
          <image v-show="searchliststart == 2" src="../../static/searchlistx.png" mode="aspectFit"></image>
          <image v-show="searchliststart == 3" src="../../static/searchlistk.png" mode="aspectFit"></image>
          <image v-show="searchliststart == 4" src="../../static/searchlistkx.png" mode="aspectFit"></image>
        </view>
        <!-- 原样式 end -->
      </view>
      <view class="navbar">
        <view class="nav-item" :class="{ current: condition === 1 || condition === 5 }" @click="tabClick(1)">
          <text>{{ sort == 1 ? '综合' : '新品' }}</text>
          <view class="p-box"><text :class="{ active: condition === 5 || condition === 1 }" class="yticon icon-shang xia"></text></view>
        </view>
        <view class="nav-item" :class="{ current: condition === 2 }" @click="tabClick(2)">销量</view>
        <view class="nav-item" :class="{ current: condition == 3 || condition == 4 }" @click="tabClick(3)">
          <text>价格</text>
          <view class="p-box">
            <text :class="{ active: condition === 3 }" class="yticon icon-shang"></text>
            <text :class="{ active: condition === 4 }" class="yticon icon-shang xia"></text>
          </view>
        </view>
        <view v-if="hideMark == true" class="nav-item" :class="{ current: condition === 6 }" @click="tabClick(6)">店铺</view>
        <text v-if="hideMark == true" class="cate-item yticon icon-fenlei1" @click="toggleCateMask('show')"></text>
      </view>
    </view>
    <view class="shoplist" v-show="condition == 6">
      <view class="shopitem" v-for="(item, index) in shopList" :key="index" @click="navToShop(item.companyguid)">
        <view class="logo">
          <image class="img" :src="item.logo" mode="aspectFill"></image>
          <text class="name">{{ item.companyname }}</text>
        </view>
        <view class="header clamp">
          <text class="type" v-if="item.companyLabel">{{ item.companyLabel }}</text>
          <view class="shoplever">
            <image v-for="(itemse, ine) in item.levelarray" :src="'../../static/level' + itemse + '.png'" mode="aspectFit"
              :key="ine"></image>
          </view>
          <text class="number">{{ item.attentionMsg }}</text>
        </view>
        <image class="conimg" :src="item.picurl" mode="aspectFill"></image>
        <view class="evaluate clamp">{{ item.commentMsg }}</view>
        <view class="activity">
          <text v-for="(it, ins) in item.salecoloractivity" :key="ins" :style="{ color: it.color,borderColor: it.color}">{{ it.wholetext }}</text>
        </view>
        <view class="scope clamp">{{ item.managescope }}</view>
        <view class="address clamp">{{ item.companyAddress.address }}</view>
      </view>
    </view>
    <block v-show="condition != 6">
      <block v-if="searchliststart == 1">
        <view class="goods-list">
          <view v-for="(item, index) in goodsList" :key="index" class="goods-item" @click="navToDetailPage(item.productid)">
            <image v-if="item.isNewOnShelvesProduct == 1" class="label" :src="item.newOnShelvesProductIcon" mode="aspectFit"></image>
            <view class="image-wrapper">
              <uimg :src="item.url"></uimg>
            </view>
            <view class="item-con">
              <view class="title clamp">
                <text v-if="item.presell" class="presell">{{item.presell}}</text>{{ item.name }}
              </view>
              
              <view class="price-box">
                <text class="price">{{ item.priceHeader }}{{ item.price }}</text>
              </view>
              <view class="oldprice">{{ item.oldpriceHeader }} <text>{{ item.oldprice }}</text></view>
              <view class="clamp">
                <view class="typename" v-show="item.typename!=''">
                  <block v-if="item.selficon.url">
                    <image :src="item.selficon.url" mode="aspectFit"></image>
                  </block>
                  <block v-else><text>{{ item.typename }}</text></block>
                </view>
                <text class="companyname" v-show="item.companyname!=''" @click.stop="goshop(item)">{{ item.companyname }}</text>
              </view>
            </view>
          </view>
        </view>
      </block>
      <block v-if="searchliststart == 3">
        <view class="screenlist">
          <view class="screenitem" v-for="(item, index) in goodsList" :key="index" @click="navToDetailPage(item.productid)">
            <image v-if="item.isNewOnShelvesProduct == 1" class="label" :src="item.newOnShelvesProductIcon" mode="aspectFit"></image>
            <image class="img" :src="item.url" mode="aspectFill"></image>
            <view class="cons">
              <view class="title">
                <view class="c">
                  {{ item.name }}
                </view>
                <view class="price-box">
                  <view>
                    <text v-for="ite in item.newactivitylist" :key="ite.wholetext" :style="{color:ite.color,borderColor:ite.color}">{{ ite.wholetext }}</text>
                  </view>
                </view>
              </view>
              <view class="clamp" style="flex-grow: 1;">
                
                <text class="pcice">
                  <text class="pcices">{{ item.price }}</text>
                </text>
                 <text class="oldprice">{{ item.oldpriceHeader }} <text>{{ item.oldprice }}</text></text>
                <view v-if="item.typename != ''" @click.stop="goshop(item)">
                  <text class="shoptitle">{{ item.typename }}</text>
                  <text class="fl clamp">{{ item.companyname }}</text>
                  <image class="tipimg" src="../../static/tab-cart-current.png" mode="aspectFit"></image>
                </view>
              </view>
            </view>
          </view>
        </view>
      </block>
    </block>


    <uni-load-more :status="loadingType"></uni-load-more>
    <view class="cate-mask" :class="cateMaskState === 0 ? 'none' : cateMaskState === 1 ? 'show' : ''" @click="toggleCateMask">
      <view class="cate-content" @click.stop.prevent="stopPrevent" @touchmove.stop.prevent="stopPrevent">
        <scroll-view scroll-y class="cate-list">
          <view v-for="(item, index) in cateList" :key="index">
            <block v-if="item.list.length > 3">
              <view class="cate-item two" :class="{ open: item.active }" @click="opencate(index)">
                <text>{{ item.title }}</text>
                <text class="xjt">
                  <block v-for="tItem in item.list" :key="tItem.filtertype" v-if="tItem.selet">{{ tItem.filtertext }}</block>
                </text>
              </view>
            </block>
            <block v-else>
              <view class="cate-item two">
                <text>{{ item.title }}</text>
              </view>
            </block>

            <view class="cate-item-lists" :class="{ open: item.active }">
              <text v-for="tItem in item.list" :key="tItem.filtertype" class="cate-item-list" :class="{ active: tItem.selet }"
                @click="changeCate(tItem, index)">
                {{ tItem.filtertext }}
              </text>
            </view>
          </view>
        </scroll-view>
        <view class="cate-mask-btn">
          <view class="btn" @click="resetting">重置</view>
          <view class="btn action" @click="define">确定</view>
        </view>
      </view>
    </view>
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
        cutkg: false,
        cguid: '',
        searchliststart: 1,
        sort: 1,
        headerPosition: 'fixed',
        headerTop: '0px',
        loadingType: 'more', //加载更多状态
        filterIndex: 0,
        cateList: [],
        goodsList: [],
        shopList: [],
        targetids: [],
        pagesize: 12,
        nextCursorMark: '',
        condition: 1,
        lastid: '',
        keyword: '',
        cateMaskState: 0,
        cateId: '',
        filter: [],
        filterkg: false,
        hideMark: true,
      };
    },
    onLoad(options) {
      this.keyword = options.keyword || '';
      this.hideMark = options.mark || true;
      console.log(this.hideMark);
      this.targetids = options.targetids || '';
      this.cutkg = options.cutkg || '';
      if (options.cguid) {
        this.cguid = options.cguid;
      }
      if (this.cutkg == 'true') {
        this.condition = 6;
        this.searchCompany('refresh');
        uni.showLoading({
          title: '正在加载'
        });
      } else {
        this.loadData();
      }
    },
    onBackPress() {
      this.$api.ovPage()
    },
    onShow() {
      if (this.$wx.isWechat()) this.$wx.share();
    },
    onPageScroll(e) {
      //兼容iOS端下拉时顶部漂移
      if (e.scrollTop >= 0) {
        this.headerPosition = 'fixed';
      } else {
        this.headerPosition = 'absolute';
      }
    },
    //下拉刷新
    onPullDownRefresh() {
      if (this.condition != 6) {
        this.loadData('refresh');
      } else {
        this.searchCompany('refresh');
      }
    },
    //加载更多
    onReachBottom() {
      if (this.condition != 6) {
        this.loadData();
      } else {
        if (this.loadingType === 'nomore') {
          return;
        } else {
          this.loadingType = 'loading';
          this.searchCompany();
        }
      }
    },
    methods: {
      returnSearch() {
        if (this.hideMark == true) {
          uni.navigateBack();
        } else {
          uni.redirectTo({
            url: '/pages/search/search'
          });
        }
      },
      //加载商品 ，带下拉刷新和上滑加载
      async loadData(type = 'add', loading) {
        //没有更多直接返回
        if (type === 'add') {
          if (this.loadingType === 'nomore') {
            return;
          }
          this.loadingType = 'loading';
        } else {
          this.loadingType = 'more';
        }
        if (type === 'refresh') {
          this.goodsList = [];
          this.lastid = '';
          this.nextCursorMark = '';
        }
        let data = {
          cguid: this.cguid,
          keyword: this.keyword,
          condition: this.condition,
          pagesize: this.pagesize,
          lastid: this.lastid,
          nextCursorMark: this.nextCursorMark,
          targettype: 2,
          filter: this.filter
        };
        if (this.targetids != null && this.targetids.length > 0) data.targetids = this.targetids;
        this.$ajax.get('search/smartSearch', data).then(res => {
          if (res.data.code == 0) {
            let list = res.data.result.data;
            //判断是否还有下一页，有是more  没有是nomore(测试数据判断大于20就没有了)
            this.loadingType = list.length < this.pagesize ? 'nomore' : 'more';
            if (list.length > 0) {
              this.lastid = list[list.length - 1].productid;
              this.nextCursorMark = list[list.length - 1].nextCursorMark;
              this.goodsList = this.goodsList.concat(list);
            }
            if (type === 'refresh') {
              if (loading == 1) {
                uni.hideLoading();
              } else {
                uni.stopPullDownRefresh();
              }
            }
          } else {}
        });
      },
      searchstart() {
        if (this.searchliststart == 2 || this.searchliststart == 4) {
          return
        }
        this.searchliststart = this.searchliststart == 1 ? 3 : 1;
      },
      returngo() {
        uni.navigateBack();
      },
      navToDetailPage(id) {
        uni.navigateTo({
          url: '/pages/product/product?productid=' + id
        });
      },
      navToShop(id) {
        uni.navigateTo({
          url: '/pages/product/shop?cguid=' + id
        });
      },
      opencate(index) {
        this.cateList[index].active = this.cateList[index].active ? false : true;
      },
      //筛选点击
      tabClick(index) {
        if (this.condition === index && index !== 3 && index !== 1) {
          return;
        }
        if (index === 3) {
          this.condition = this.condition === 3 ? 4 : 3;
        } else if (index === 1) {
          this.condition = this.condition === 1 ? 5 : 1;
          this.sort = this.condition === 1 ? 1 : 5;
        } else {
          this.condition = index;
        }
        uni.pageScrollTo({
          duration: 300,
          scrollTop: 0
        });
        if (this.condition == 6) {
          this.searchCompany('refresh');
          this.searchliststart = this.searchliststart == 1 ? 2 : this.searchliststart == 3 ? 4 : this.searchliststart;
        } else {
          this.searchliststart = this.searchliststart == 2 ? 1 : this.searchliststart == 4 ? 3 : this.searchliststart;
          this.loadData('refresh', 1);
        }
        uni.showLoading({
          title: '正在加载'
        });
      },
      searchCompany(type) {

        if (type == 'refresh') {
          this.lastid = '';
          this.shopList = [];
        }
        let data = {
          keyword: this.keyword
        };
        if (this.targetids != null && this.targetids.length > 0) data.targetids = this.targetids;
        if (this.cutkg == 'true') {
          this.$ajax.get('com/searchAttentionCompany', data).then(res => {
            if (res.data.code == 0) {
              let list = res.data.result.data;
              //判断是否还有下一页，有是more  没有是nomore(测试数据判断大于20就没有了)
              this.loadingType = list.length < this.pagesize ? 'nomore' : 'more';
              if (list.length > 0) {
                this.lastid = list[list.length - 1].id;
                this.shopList = this.shopList.concat(list);
              }
              if (type === 'refresh') {
                uni.hideLoading();
                uni.stopPullDownRefresh();
              }
            } else {}
          });
        } else {
          this.$ajax.get('com/searchCompany', data).then(res => {
            if (res.data.code == 0) {
              let list = res.data.result.data;
              //判断是否还有下一页，有是more  没有是nomore(测试数据判断大于20就没有了)
              this.loadingType = list.length < this.pagesize ? 'nomore' : 'more';
              if (list.length > 0) {
                this.lastid = list[list.length - 1].id;
                this.shopList = this.shopList.concat(list);
              }
              if (type === 'refresh') {
                uni.hideLoading();
                uni.stopPullDownRefresh();
              }
            } else {}
          });
        }

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
      //显示分类面板
      toggleCateMask(type) {
        if (this.condition == 6) {
          return;
        }
        let timer = type === 'show' ? 10 : 300;
        let state = type === 'show' ? 1 : 0;
        if (state == 1 && this.filterkg == false) {
          let data = {
            keyword: this.keyword
          };
          if (this.targetids != null && this.targetids.length > 0) data.targetids = this.targetids;
          this.$ajax.get('search/searchFilter', data).then(res => {
            if (res.data.code == 0) {
              let list = res.data.result.data;
              list.forEach(item => {
                item.active = false;
                item.list.forEach(items => {
                  items.selet = false;
                });
              });
              this.cateList = list;
              this.filterkg = true;
              this.cateMaskState = state;
            } else {}
          });
        } else {
          this.cateMaskState = state;
        }
      },
      // 选择参数
      changeCate(iem, inx) {
        this.cateList[inx].list.forEach(items => {
          items.selet = false;
        });
        iem.selet = !iem.selet;
      },
      // 重置属性
      resetting() {
        this.cateList.forEach(item => {
          item.list.forEach(items => {
            items.selet = false;
          });
        });
        this.filter = '';
      },
      // 属性确定
      define() {
        let data = [];
        this.cateList.forEach(item => {
          item.list.forEach(items => {
            if (items.selet == true) {
              data.push(items);
            }
          });
        });
        this.filter = JSON.stringify(data);
        this.loadData('refresh', 1);
        this.cateMaskState = 0;
        uni.showLoading({
          title: '正在加载'
        });
      },
      stopPrevent() {}
    }
  };
</script>

<style lang="scss">
  page,
  .content {
    background: $page-color-base;
  }

  .yticon {
    font-size: 52rpx;
  }

  .content {
    padding-top: 168rpx;
  }

  .search-box {
    width: 100%;
    background-color: rgb(242, 242, 242);
    padding: 15upx 2.5%;
    display: flex;
    justify-content: space-between;
  }

  .search-box .input-box {
    width: 85%;
    flex-shrink: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .search-box .search-btn {
    width: 12%;
    margin: 0 0 0 2%;
    display: flex;
    justify-content: center;
    align-items: center;

    image {
      width: 50rpx;
      height: 50rpx;
    }
  }

  .search-box .input-box>input {
    width: 100%;
    height: 60upx;
    font-size: 32upx;
    border: 0;
    border-radius: 60upx;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    padding: 0 3%;
    margin: 0;
    background-color: #ffffff;
  }

  .placeholder-class {
    color: #9e9e9e;
  }

  .search-keyword {
    width: 100%;
    background-color: rgb(242, 242, 242);
  }

  .con {
    position: fixed;
    left: 0;
    top: var(--window-top);
    width: 100%;
    z-index: 666;
  }

  .navbar {
    display: flex;
    width: 100%;
    height: 80upx;
    background: #fff;
    box-shadow: 0 2upx 10upx rgba(0, 0, 0, 0.06);
    z-index: 10;

    .nav-item {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      font-size: 30upx;
      color: $font-color-dark;
      position: relative;

      &.current {
        color: $base-color;

        &:after {
          content: '';
          position: absolute;
          left: 50%;
          bottom: 0;
          transform: translateX(-50%);
          width: 120upx;
          height: 0;
          border-bottom: 4upx solid $base-color;
        }
      }
    }

    .p-box {
      display: flex;
      flex-direction: column;

      .yticon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30upx;
        height: 14upx;
        line-height: 1;
        margin-left: 4upx;
        font-size: 26upx;
        color: #888;

        &.active {
          color: $base-color;
        }
      }

      .xia {
        transform: scaleY(-1);
      }
    }

    .cate-item {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 80upx;
      position: relative;
      font-size: 44upx;

      &:after {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        border-left: 1px solid #ddd;
        width: 0;
        height: 36upx;
      }
    }
  }

  /* 分类 */
  .cate-mask {
    position: fixed;
    left: 0;
    top: var(--window-top);
    bottom: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0);
    z-index: 667;
    transition: 0.3s;

    .cate-content {
      width: 630upx;
      height: 100%;
      background: #fff;
      float: right;
      transform: translateX(100%);
      transition: 0.3s;
    }

    &.none {
      display: none;
    }

    &.show {
      background: rgba(0, 0, 0, 0.4);

      .cate-content {
        transform: translateX(0);
      }
    }
  }

  .cate-mask-btn {
    display: flex;
    border-top: 1px solid #dddddd;

    .btn {
      flex-grow: 1;
      line-height: 100rpx;
      text-align: center;
      font-size: 32rpx;

      &.action {
        background: $base-color;
        color: #ffffff;
      }
    }
  }

  .cate-list {
    display: flex;
    flex-direction: column;
    height: calc(100% - 100rpx);

    .cate-item {
      display: flex;
      align-items: center;
      height: 90upx;
      padding-left: 30upx;
      font-size: 28upx;
      color: #555;
      position: relative;
    }

    .cate-item-lists {
      overflow: hidden;
      display: flex;
      flex-wrap: wrap;
      align-items: stretch;
      height: 76rpx;
      overflow: hidden;

      &.open {
        height: auto;
      }

      .cate-item-list {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 12rpx;
        border: 1px solid #dddddd;
        min-height: 68rpx;
        border-radius: 40rpx;
        font-size: 28rpx;
        width: 31%;
        margin: 1%;
        text-align: center;
        line-height: 1;

        &.active {
          border-color: $base-color;
        }
      }
    }

    .two {
      height: 64upx;
      color: #303133;
      font-size: 30upx;
      display: flex;
      align-items: center;

      .xjt {
        flex-grow: 1;
        background: url(../../static/xjt.png) no-repeat right center;
        height: 64upx;
        line-height: 64upx;
        color: #fa436a;
        margin-right: 30rpx;
        background-size: 38rpx 20rpx;
        text-align: right;
        padding-right: 50rpx;
      }

      &.open {
        .xjt {
          background: url(../../static/sjt.png) no-repeat right center;
          background-size: 38rpx 20rpx;
        }
      }
    }

    .active {
      color: $base-color;
    }
  }

  // 店铺
  .shoplist {
    display: flex;
    flex-wrap: wrap;
    padding: 20rpx;

    .shopitem {
      width: 48%;
      margin-bottom: 40upx;
      padding: 20rpx;
      background: #fff;
      border-radius: 20rpx;
      font-size: 28rpx;

      &:nth-child(2n + 1) {
        margin-right: 4%;
      }

      .logo {
        display: flex;
        align-items: center;

        .img {
          width: 50rpx;
          height: 50rpx;
          border-radius: 50%;
        }
      }

      .header {
        display: flex;
        align-items: center;
        margin-bottom: 8rpx;
        margin-top: 8rpx;
        font-size: 24rpx;

        .type {
          background: rgb(238, 77, 63);
          color: #fff;
          padding: 0 10rpx;
          border-radius: 10rpx;
        }

        .shoplever image {
          width: 30rpx;
          height: 30rpx;
          margin-left: 4rpx;
          display: inline-block;
          vertical-align: middle;
        }
      }

      .conimg {
        width: 100%;
        height: 180rpx;
      }

      .activity {
        text {
          border: 1px solid rgb(238, 77, 63);
          padding: 0 8rpx;
          margin-right: 6rpx;
          display: inline-block;
          border-radius: 10rpx;
          font-size: 24rpx;
          margin-bottom: 4rpx;
        }
      }

      .scope {
        background: url(../../static/tab-shop.png) no-repeat left center;
        padding-left: 40rpx;
        background-size: 30rpx 30rpx;
        font-weight: 600;
      }

      .address {
        background: url(../../static/address.png) no-repeat left center;
        padding-left: 40rpx;
        background-size: 30rpx 30rpx;
        font-weight: 600;
      }
    }
  }

  .screenlist {
    padding: 10px;

    .screenitem {
      display: flex;
      background: #FFF;
      border-bottom: 1px solid #DDDDDD;
      padding: 20rpx;
      align-items: stretch;
      position: relative;

      .label {
        width: 80rpx;
        height: 80rpx;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
      }

      .img {
        width: 40%;
        min-width: 40%;
        height: 300rpx;
      }

      .cons {
        width: 60%;
        min-width: 60%;
        padding: 10rpx;
        position: relative;
        display: flex;
        align-items: flex-end;

        .title {
          
          position: absolute;
          top: 10rpx;
          left: 10rpx;
          right: 10rpx;
          .c{
          font-size: 32rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .price-box {
            font-size: 24upx;
            
            view {
              margin-top: 10rpx;
              text {
                display: inline-block;
                border: 1px solid #ddd;
                border-radius: 10rpx;
                padding: 0 6rpx;
                margin-left: 10rpx;
              }
            }
          }
        }

        .pcice {
          font-size: 36rpx;
          color: $base-color;

          .pcices {
            vertical-align: middle;
          }

          .tip {
            font-size: 28rpx;
            color: #C1C1C1;
            margin-left: 10rpx;
            vertical-align: middle;
          }

          .active {
            border: 1px solid #ddd;
            border-radius: 10rpx;
            padding: 2rpx 6rpx;
            margin-left: 10rpx;
            font-size: 24rpx;
            vertical-align: middle;
          }
        }
        .oldprice{
          margin-left: 20rpx;
          font-size: 24rpx;
          color: #969699;
          text{
            text-decoration: line-through;
          }
        }

        .shoptitle {
          display: inline-block;
          padding: 0 10rpx;
          border-radius: 10rpx;
          background: $base-color;
          color: #FFF;
          font-size: 28rpx;
          margin-right: 10rpx;
        }

        .fl {
          display: inline-block;
          max-width: 200rpx;
          overflow: hidden;
          font-size: 24rpx;
          line-height: 28rpx;
          vertical-align: middle;
        }

        .tipimg {
          display: inline-block;
          float: right;
          width: 30rpx;
          height: 30rpx;
          margin-top: 10rpx;
        }
      }
    }
  }
</style>
