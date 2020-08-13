<template>
  <view class="page-content">
    <view class="nav-head">
      <div class="uni-page-head-hd">
        <div class="uni-page-head-btn" @click="backnav"><i class="uni-btn-icon" style="color: rgb(0, 0, 0); font-size: 27px;"></i></div>
      </div>
      <view class="nav-bd">
        <view class="uni-page-head__title">{{navtitle}}</view>
      </view>
      <div class="uni-page-head-ft">
        <div v-show="showhelp" class="uni-page-head-btn" style="width: 36px;">
          <image src="../../static/help.png" mode="aspectFit" @click="openedit"></image>
        </div>
      </div>
    </view>
    <empty v-if="tabList.length == 0 && goodsList.length === 0"></empty>
    <view v-if="list.robstate == 1" class="activity">
      距活动结束
      <text>{{ d }}</text>
      :
      <text>{{ h }}</text>
      :
      <text>{{ i }}</text>
      :
      <text>{{ s }}</text>
    </view>
    <view class="banner" v-if="list.picList.length > 0">
      <swiper class="swiper-img" autoplay circular indicator-dots :style="'height:' + swperheight">
        <swiper-item v-for="(item, index) in list.picList" :key="index" class="carousel-item" @click="titleimg(item)">
          <uimg :src="item.url" :mode="'widthFix'" class="swiperimg"></uimg>
        </swiper-item>
      </swiper>
    </view>
    <luBarTabNav :tabList="tabList" :barFixed="barFixed" :barHeight="barHeight" :barTop="barTop" :barId="barId" ref="barTabNav">
      <view v-for="(item, index) in list.tabs" :key="index" :id="'item' + (index + 1)">
        <view class="bt-title">
          {{ item.name }}
          <text class="tip" @click="navTonorelist(item)" v-if="item.showmore == 1">更多</text>
        </view>
        <view class="goods-list">
          <view class="goods-item" @click="navToDetailPage(items.productid)" v-for="(items, indexs) in item.productlist"
            :key="indexs">
            <image v-if="items.isNewOnShelvesProduct == 1" class="label" :src="items.newOnShelvesProductIcon" mode="aspectFit"></image>
            <view class="image-wrapper">
              <uimg :src="items.url"></uimg>
              <image v-if="items.mainpicIcon != ''" :src="items.mainpicIcon" mode="aspectFit" class="tipimg"></image>
              <view class="tip clamp" v-if="items.mainpicIcon == '' && items.feature_short != ''">{{items.feature_short}}</view>
            </view>
            <view class="item-con">
              <view class="title"><img v-if="items.titleIcon != ''" :src="items.titleIcon"><text v-if="items.presell" class="presell">{{items.presell}}</text>{{ items.name }}</view>
              <view class="price-box">
                <text class="price">{{ items.priceHeader }}{{ items.price }}</text>
              </view>
              <view class="oldprice">{{ items.oldpriceHeader }} <text>{{ items.oldprice }}</text></view>
              <view class="clamp">
                <view class="typename">
                  <block v-if="items.selficon.url">
                    <image :src="items.selficon.url" mode="aspectFit"></image>
                  </block>
                  <block v-else><text>{{ items.typename }}</text></block>
                </view>
                <text class="companyname" @click.stop="goshop(items)">{{ items.companyname }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="bt-title" v-if="goodsList.length > 0">更多推荐</view>
      <view class="goods-list">
        <view v-for="(item, index) in goodsList" :key="index" class="goods-item" @click="navToDetailPage(item.productid)">
          <image v-if="item.isNewOnShelvesProduct == 1" class="label" :src="item.newOnShelvesProductIcon" mode="aspectFit"></image>
          <view class="image-wrapper">
            <uimg :src="item.url"></uimg>
            <image v-if="item.mainpicIcon != ''" :src="item.mainpicIcon" mode="aspectFit" class="tipimg"></image>
            <view class="tip clamp" v-if="item.mainpicIcon == '' && item.feature_short != ''">{{item.feature_short}}</view>
          </view>
          <view class="item-con">
            <view class="title"><img v-if="item.titleIcon != ''" :src="item.titleIcon"><text v-if="item.presell" class="presell">{{item.presell}}</text>{{ item.name }}</view>
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
      <uni-load-more v-if="tabList.length != 0 && goodsList.length != 0" :status="loadingType"></uni-load-more>
    </luBarTabNav>
  </view>
</template>
<script>
  import uimg from "@/components/uimg/uimg.vue";
  import luBarTabNav from '@/components/lu-bar-tab-nav/lu-bar-tab-nav.vue';
  import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
  import empty from '@/components/empty';
  export default {
    components: {
      luBarTabNav,
      uniLoadMore,
      empty,
      uimg
    },
    data() {
      return {
        navtitle: '商品列表',
        showhelp: false,
        swperheight: 0,
        list: {
          picList: []
        },
        goodsList: [],
        barFixed: true,
        barHeight: '44',
        barTop: 0,
        barId: '0',
        tabList: [],
        activityid: 0,
        loadingType: 'more',
        pagesize: 10,
        pageid: 0,
        timer: null,
        d: '00',
        h: '00',
        i: '00',
        s: '00',
        leftTime: 0,
        seconds: 0
      };
    },
    onLoad(e) {
      uni.showLoading({
        title: '加载中'
      });
      this.activityid = e.id;
      this.load(0);
    },
    onBackPress() {
      this.$api.ovPage()
    },
    //下拉刷新
    onPullDownRefresh() {
      this.load(1);
    },
    //加载更多
    onReachBottom() {
      this.more();
    },
    onShow() {
      if (this.$wx.isWechat()) {
        if(this.activityid == 555){
          this.$wx.share({
              title: '电科商城便利店',
              desc: '电科人自己的便利店',
              imgUrl: 'http://ets.51pingce.net/static/logo.png'
            },
            'http://ets.51pingce.net/pages/product/catelist?id=' + this.activityid
          );
        }else{
          this.$wx.share();
        }
      }
    },
    methods: {
      backnav() {
        uni.navigateBack()
      },
      timeUp() {
        clearInterval(this.timer);
        this.$emit('timeup');
      },
      countDown() {
        let seconds = this.seconds;
        let [day, hour, minute, second] = [0, 0, 0, 0];
        if (seconds > 0) {
          day = Math.floor(seconds / (60 * 60 * 24));
          hour = Math.floor(seconds / (60 * 60)) - day * 24;
          minute = Math.floor(seconds / 60) - day * 24 * 60 - hour * 60;
          second = Math.floor(seconds) - day * 24 * 60 * 60 - hour * 60 * 60 - minute * 60;
        } else {
          this.timeUp();
        }
        if (day < 10) {
          day = '0' + day;
        }
        if (hour < 10) {
          hour = '0' + hour;
        }
        if (minute < 10) {
          minute = '0' + minute;
        }
        if (second < 10) {
          second = '0' + second;
        }
        this.d = day;
        this.h = hour;
        this.i = minute;
        this.s = second;
      },
      openedit() {
        uni.navigateTo({
          url: '/pages/user/customerexit?url=' + this.list.helpurl + '&name=' + this.list.helptitle
        });
      },
      load(is) {
        const data = {
          activityid: this.activityid
        };
        this.$ajax.get('homepage/fastAccessDetail', data).then(res => {
          if (res.data.code == 0) {
            this.list = res.data.result.data;
            if (this.list.helpurl != '') {
              this.showhelp = true;
            }
            if (res.data.result.data.robstate == 1) {
              this.seconds = res.data.result.data.robtime / 1000;
              this.countDown();
              this.timer = setInterval(() => {
                this.seconds--;
                if (this.seconds < 0) {
                  this.timeUp();
                  return;
                }
                this.countDown();
              }, 1000);
            }
            uni.setNavigationBarTitle({
              title: this.list.title
            });
            this.navtitle = this.list.title;
            if (res.data.result.data.picList.length > 0) {
              let js = res.data.result.data.picList[0].width / 750;
              this.swperheight = res.data.result.data.picList[0].height / js + 'rpx';
            }
            var navlist = [];
            for (var i = 0; i < this.list.tabs.length; i++) {
              var obj = {
                text: this.list.tabs[i].name,
                navTarget: '#item' + (i + 1)
              };
              navlist.push(obj);
            }
            this.tabList = navlist;

            if (is == 0) {
              uni.hideLoading();
            } else {
              uni.stopPullDownRefresh();
            }
          } else {
            this.$api.msg('系统出错,请稍后再试');
          }
        });
        const datas = {
          activityid: this.activityid
        };
        this.$ajax.get('homepage/listMoreRecommendProducts', datas).then(res => {
          if (res.data.code == 0) {
            var list = res.data.result.data.productlist;
            this.loadingType = list.length >= this.pagesize ? 'more' : 'nomore';
            this.goodsList = list;
            if (list.length > 0) {
              this.pageid = list[list.length - 1].productid;
            } else {
              this.loadingType = 'nomore';
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
          activityid: this.activityid,
          lid: this.pageid,
          pagesize: this.pagesize
        };
        this.$ajax.get('homepage/listMoreRecommendProducts', data).then(res => {
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
      navToDetailPage(id) {
        uni.navigateTo({
          url: '/pages/product/product?productid=' + id
        });
      },
      navTonorelist(item) {
        uni.navigateTo({
          url: '/pages/product/morelist?activityid=' + this.activityid + '&tabid=' + item.id
        });
      },
      titleimg(item) {
        if (item.type == 1) {
          uni.navigateTo({
            url: '/pages/product/product?productid=' + item.productid
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
    },
    onPageScroll: function(e) {
      this.$refs.barTabNav._selectedTab(e.scrollTop);
    }
  };
</script>
<style lang="scss">
  page {
    background: #f5f5f5;
  }

  .nav-head {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 44px;
    padding: 7px 3px;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    overflow: hidden;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    box-sizing: border-box;
    z-index: 999;
    -webkit-transition-property: all;
    transition-property: all;
    background-color: rgb(255, 255, 255);
    color: rgb(0, 0, 0);

    .nav-bd {
      position: absolute;
      left: 70px;
      right: 70px;
      min-width: 0;
      -webkit-user-select: auto;
      user-select: auto;
    }

    .uni-page-head__title {
      font-weight: 700;
      font-size: 16px;
      line-height: 30px;
      text-align: center;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 16px;
      opacity: 1;
    }

    image {
      width: 50rpx;
      height: 50rpx;
    }
  }

  .page-content {
    position: relative;
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: center;
    font-size: 14px;
  }

  .banner {
    position: relative;
    width: 100%;
  }

  .swiper-img {
    width: 100%;
  }

  .swiperimg {
    width: 100%;
    height: 100% !important;

    /deep/ view {
      width: 100%;
      height: 100% !important;
    }

    /deep/ image {
      width: 100%;
      height: 100% !important;
    }
  }

  .activity {
    line-height: 60rpx;
    width: 100%;
    text-align: center;

    text {
      background: #303133;
      color: #fff;
      padding: 4rpx 8rpx;
      margin: 4rpx 8rpx;
      border-radius: 4rpx;
    }
  }

  .tabbody {
    position: relative;
    width: 100%;
    border-bottom: 3px solid #4cd964;
  }

  .bt-title {
    padding: 20upx;
    font-size: 32upx;
    line-height: 32upx;
    text-align: center;
    position: relative;

    .tip {
      font-size: 26upx;
      color: red;
      position: absolute;
      right: 30rpx;
    }
  }
</style>
