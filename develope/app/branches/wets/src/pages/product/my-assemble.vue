<template>
    <view class="content">
        <view class="navbar">
            <view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{ current: tabCurrentIndex === index }" @click="tabClick(index)">{{ item.text }}</view>
        </view>

        <swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
            <swiper-item class="tab-content" v-for="(tabItem, tabIndex) in navList" :key="tabIndex">
                <scroll-view class="list-scroll-content" scroll-y @scrolltolower="getList(tabIndex,'refresh')">
                    <!-- 空白页 -->
                    <empty v-if="tabItem.loaded === true && tabItem.orderList.length === 0"></empty>
                    <view class="group">
                        <view class="item" v-for="(item_son,index_son) in tabItem.orderList" @click="participatein(item_son.ordernumber)">
                            <view>
                              <text v-if="item_son.state == 2" class="state">正在抢单</text> 
                              <image class="shopimg" :src="item_son.picurl" mode="aspectFit"></image>
                            </view>
                          <view class="introduce">
                              <view class="title">{{item_son.product_name}}</view>
                              <view class="progress" v-if="item_son.state == 1">
                                  <view :style="{width:(item_son.currentamount/item_son.peopleamount)*100+'%'}"></view>
                              </view>
                              <view class="main">
                                  <view class="con">
                                      <view v-if="item_son.state == 1" class="news">还差<text class="number">{{item_son.remainamount}}</text>人
                                          <countdown class="indeblock" :time="(item_son.endtimestamp - new Date().getTime())/1000"
                                              @timeup="robtip()" :day="false"></countdown>
                                      </view>
                                      <view v-if="item_son.state == 5" class="news">
                                          <text class="number">拼团成功</text>
                                      </view>
                                       <view v-if="item_son.state == 3"class="news">
                                      	<text class="number">拼团失败</text>
                                      </view>
                                      <view v-if="item_son.state == 4" class="news">
                                      	<text class="number">抢单失败</text>
                                      </view>
                                      <view class="pcice">
                                          <text class="new">{{item_son.unit_price}}</text><text class="old">{{item_son.old_price}}</text>
                                      </view>
                                      <view class="tip">{{item_son.peopleamount}}人拼已拼{{item_son.currentamount}}件</view>
                                  </view>
                                  <view class="right">
                                      <view class="title-img">
                                          <image class="img" :src="item_son.headUrl" mode="aspectFill"></image>
                                          <image class="tip" :src="'../../static/vip' + item_son.memberlevel + '.png'" mode="aspectFit"></image>
                                      </view>
                                      <view class="btn">
                                          立即分享
                                      </view>
                                  </view>
                              </view>
                          </view>
                        </view>
                    </view>
                    <uni-load-more :status="tabItem.loadingType"></uni-load-more>
                </scroll-view>
            </swiper-item>
        </swiper>
        <uni-popup ref="popup" type="center">
            <view class="uni-tip">
                <view class="uni-tip-title" >请输入拼团昵称</view>
                <input class="input" type="text" v-model="nickname" value=""  maxlength="10" :placeholder="placeholder_title"/>
                <view class="uni-tip-group-button" ><view class="uni-tip-button" @click="submit_name">确定</view></view>
            </view>
        </uni-popup>
    </view>
</template>
<!-- http://api.holdsoft.cn/mall/groupbuying/setNickname -->
<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import empty from '@/components/empty';
import countdown from '@/components/countdown/countdown.vue';
export default {
    components: {
        uniLoadMore,
        empty,
        uniPopup,
        countdown
    },
    data() {
        return {
            msg:'',
            tabCurrentIndex: 0,
            lid : 0,
            placeholder_title:"",
            nickname:"",
            pagesize:8,
            navList: [
                {
                    state: 0,
                    text: '我发起的',
                    loadingType: 'more',
                    orderList: []
                },
                {
                    state: 1,
                    text: '我参与的',
                    loadingType: 'more',
                    orderList: []
                }
            ]
        };
    },
    onLoad(options) {
        this.getList(0,"refresh")
        this.getTitle();
        
    },
    onShow() {
        if (this.$wx.isWechat()) this.$wx.share();
    },
     //下拉刷新
    onPullDownRefresh() {
        this.getList(this.tabCurrentIndex,"refresh");
    },
    //加载更多
    onReachBottom() {
        if (this.loadingType == "nomore") {
            return;
        }
        this.getList(this.tabCurrentIndex, "more");
    },
    onNavigationBarButtonTap(e) {
        this.$refs.popup.open();
    },
    methods: {
        //1我发起的 2我参与的
        getList(index,type){
            let list = this.navList[index].orderList
            if (type == "more") {
                this.lid = list[list.length - 1].teamid
            } else if (type == "refresh") {
                uni.stopPullDownRefresh();
                this.lid = 0;
                list = [];
                this.loadingType = "more"
               
            }
            let json = {
                pagesize:this.pagesize,
                type : index + 1
            }
            if(this.lid != 0){
                json.lid = this.lid;
            }
            this.$ajax.get("groupbuying/listMyGroupbuying", json).then(res => {
                 if (res.data.code == 0) {
                  let resList = res.data.result.data;
                  if (resList.length < this.pagesize) {
                      this.loadingType = "nomore";
                  }
                  list = list.concat(resList);
                  console.log(index)
                  this.navList[index].orderList = list
                  console.log(this.navList);
              }
            });
        },
        //查询title 
        getTitle(){
            this.$ajax.get("groupbuying/myGroupbuyingTitle", {}).then(res => {
                if (res.data.code == 0) {
                    let title_res = res.data.result.data.title;
                    this.placeholder_title = title_res.substring(0,title_res.length - 3)
                    uni.setNavigationBarTitle({
                        title: title_res
                    })
              }
            });
        },
        submit_name(){
            let thispage = this
            if(this.nickname == ""){
                this.$api.msg('请输入拼团昵称');
                return;
            }
            if(this.nickname.length < 3 || this.nickname.length > 10){
                this.$api.msg('昵称不合法');
                return;
            }
            this.$ajax.get("groupbuying/setNickname", {nickname:this.nickname}).then(res => {
               if (res.data.code == 0) {
                   uni.setNavigationBarTitle({
                       title: thispage.nickname + "的拼团"
                   })
                   this.$refs.popup.close();
               }else{
                   this.$api.msg(res.data.msg);
               }
           }); 
        },
        changeTab(e) {
            this.tabCurrentIndex = e.target.current;
            if(this.navList[this.tabCurrentIndex].orderList.length > 0){
                return;
            }
            this.getList(this.tabCurrentIndex,"refresh");
        },
        tabClick(index) {
            this.tabCurrentIndex = index;
        },
        participatein(ordernumber){
              if(ordernumber == null || ordernumber == "" || ordernumber == undefined){
                this.$api.msg("该订单不存在")
                return;
            }
            uni.navigateTo({
                url: '/pages/order/orderdetails?ordernum=' + ordernumber
            });
        },
    }
};
</script>

<style lang="scss">
page,
.content {
    background: $page-color-base;
    height: 100%;
}
.swiper-box {
    height: calc(100% - 40px);
}
.list-scroll-content {
    height: 100%;
}

.navbar {
    display: flex;
    height: 40px;
    padding: 0 5px;
    background: #fff;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.06);
    position: relative;
    z-index: 10;
    .nav-item {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        font-size: 15px;
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
                width: 44px;
                height: 0;
                border-bottom: 2px solid $base-color;
            }
        }
    }
}

.uni-swiper-item {
    height: auto;
}
/deep/ .uni-popup__wrapper-box{
    border-radius: 20rpx !important;
}
.uni-tip {
    background: #fff;
    box-sizing: border-box;
}

.uni-tip-title {
    text-align: center;
    font-weight: bold;
    font-size: 16px;
    color: #333;
}

.input {
    padding: 12rpx;
    font-size: 28rpx;
    color: #666;
    border-bottom: 2px solid #DB1A38;
    display: block;
    height: 80rpx;
}

.uni-tip-group-button {
    margin-top: 10px;
}

.uni-tip-button {
    text-align: center;
    font-size: 14px;
    color: $base-color;
}

.group{
    font-size: 28rpx;
    .item{
        display: flex;
        align-items: center;
        background: #FFF;
        border-radius: 10rpx;
        margin: 20rpx;
        padding: 20rpx;
        .state{
            display: inline-block;
            position: absolute;
            left: 30rpx;
           /* top: 20rpx; */
            background: $base-color;
            color: #FFF;
            z-index: 2;
            padding: 4rpx 8rpx;
        }
        .shopimg{
            width: 220rpx;
            min-width: 220rpx;
            height: 220rpx;
            margin-right: 20rpx;
        }
        .introduce{
            flex-grow: 1;
            .title{
                font-size: 30rpx;
                line-height: 40rpx;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                font-weight: 600;
            }
            .progress{
                overflow: hidden;
                width: 50%;
                height: 8rpx;
                border: 1px solid #F43F3B;
                border-radius: 4rpx;
                view{
                    float: left;
                    display: inline-block;
                    height: 8rpx;
                    border-radius: 4rpx;
                    background: #F43F3B;
                    width: 20%;
                }
            }
            .main{
                display: flex;
                align-items: center;
                .con{
                    flex-grow: 1;
                    .news{
                        min-height: 80rpx;
                        color: #969696;
                        .number{
                            color: #F43F3B;
                        }
                        .indeblock{
                            display: inline-block;
                            margin-left: 12rpx;
                        }
                    }
                    .pcice{
                        .new{
                            color: #F43F3B;
                            font-size: 34rpx;
                            font-weight: 600;
                        }
                        .old{
                            margin-left: 20rpx;
                            color: #969696;
                            text-decoration: line-through;
                        }
                    }
                    .tip{
                        color: #969696;
                    }
                }
                .right{
                    min-width: 140rpx;
                    .title-img{
                        position: relative;
                        text-align: right;
                        .img{
                            width: 100rpx;
                            height: 100rpx;
                            border-radius: 50%;
                        }
                        .tip{
                            position: absolute;
                            right: 0;
                            bottom: 0;
                            width: 60rpx;
                            height: 60rpx;
                            border-radius: 50%;
                        }
                    }
                    .btn{
                        margin-top: 10rpx;
                        border-radius: 10rpx;
                        color: #FFF;
                        background: #F43F3B;
                        text-align: center;
                    }
                }
            }
        }
        
    }
}
</style>
