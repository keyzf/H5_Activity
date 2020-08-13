<!-- 余额明细 -->
<template>
  <view class="all">
    <view class="line"></view>
    <scroll-view class="scroll" scroll-y="true" enableBackToTop="true" @scrolltolower="loadMore" v-bind:style="{height:scrollH+'rpx'}"
      show-scrollbar="false">
      <view class="list" v-for="(item,index) in data.list" :key="index">
        <moneyItem @click='clickitem' :icon='item.change_type' :reason='item.change_text' :date='item.createtime'
          :money='item.amount' :flag='item.income_flag'></moneyItem>
      </view>

      <emptyView class="emptyview" v-if="data.list.length<1"></emptyView>
      <view class="loading-more" v-if="data.isLoading || data.list.length > 4">
        <text class="loading-more-text">{{data.loadingText}}</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
  import moneyItem from '@/components/lmw/moneyitem.vue'
  import API from "@/store/api.js";

  export default {
    components: {
      moneyItem
    },
    computed: {
      scrollH: function() {
        let sys = uni.getSystemInfoSync();
        let winWidth = sys.windowWidth;
        let winrate = 750 / winWidth;
        let winHeight = parseInt(sys.windowHeight * winrate)
        return winHeight
      }
    },
    data() {
      return {
        list: [],
        welfareid: '34',
        pagesize: '10',
        data: {
          isLoading: false,
          hasmore: true,
          refreshText: "",
          loadingText: '加载更多...',
          list: [],
          currrenIndex: -1
        },

      }
    },
    onLoad() {
      // this.stateBarHeight = this.globaldata.statusBarHeight+85||100;
      this.getlistdata('');
    },
    //下拉刷新
    onPullDownRefresh() {
      this.resetData();
      setTimeout(this.getlistdata(''), 2000);
    },

    methods: {
      clickitem(v) {
        // uni.showModal({
        // 	title:'jj',
        // 	content:v.value
        // })
      },
      resetData() {
        this.data = {
          isLoading: false,
          hasmore: true,
          refreshText: "",
          loadingText: '加载更多...',
          list: [],
          currrenIndex: -1
        };
        this.page = 1;
      },
      //加载更多
      loadMore() {
        if (this.data.hasmore) {
          this.getlistdata(this.data.list[this.data.list.length - 1].id);
        }
      },
      getlistdata(lid) {
        this.data.hasmore = false;
        API.getMoneyDetails({
          welfareid: this.globaldata.welfareid,
          pagesize: '10',
          lid: lid
        }).then(res => {
          uni.stopPullDownRefresh();
          console.log(res);
          if (res.data.result.data.amountDetails.length < this.pagesize) {
            this.data.loadingText = "没有更多数据了"
            this.data.hasmore = false;
          } else {
            this.data.hasmore = true;
          }
          this.data.list = this.data.list.concat(res.data.result.data.amountDetails);
        }).catch(err => {
          console.log(err);
          uni.stopPullDownRefresh();
          this.data.hasmore = true;
        })

      }
    }
  }
</script>

<style lang="scss" scoped>
  page {
    height: 100%;
    width: 100%;
    background-color: #f5f5f5;
  }

  .all {

    .line {
      height: 15rpx;
    }

    .scroll {
      width: 100%;
      display: flex;
      flex-direction: column;
      // margin-top: 91rpx;

      .emptyview {
        width: 100%;
        height: 600rpx;
      }

      .top-holdon {
        height: 91rpx;
      }

      .uni-margin-wrap {
        width: 750rpx;

        .swiper {
          height: 300rpx;

          .swiper-item {
            display: block;
            height: 300rpx;
            line-height: 300rpx;
            text-align: center;

            .image {
              width: 100%;
              height: 100%;
            }
          }
        }
      }

      .loading-more {
        align-items: center;
        justify-content: center;
        padding-top: 10px;
        padding-bottom: 10px;
        text-align: center;

        .loading-more-text {
          font-size: 28upx;
          color: #999;
        }
      }

    }

  }
</style>
