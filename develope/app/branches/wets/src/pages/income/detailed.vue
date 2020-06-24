<template>
    <view class="content">
        <view class="navbar">
            <view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{current: tabCurrentIndex === index}"
                @click="tabClick(index)">
                {{item.text}}
            </view>
        </view>
        <swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
            <swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
                <scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData">
                    <!-- 空白页 -->
                    <empty v-if="tabItem.loaded === true && tabItem.orderList.length === 0"></empty>
                    <!-- 订单列表 -->
                    <view class="commodity"  v-for="(orderValue,orderindex) in tabItem.orderList">
                        <view class="commodity-con">
                            <view class="title">
                                <text>{{orderValue.title}}</text>
                                <text class="stata" :class="{x:orderValue.dtype ==2}"> {{orderValue.price}}</text>
                            </view>
                            <view class="tip">{{orderValue.createtime}}</view>
                        </view>
                    </view>
                    <uni-load-more :status="tabItem.loadingType"></uni-load-more>
                </scroll-view>
            </swiper-item>
        </swiper>
    </view>
</template>

<script>
    import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
    import empty from "@/components/empty";
    export default {
        components: {
            uniLoadMore,
            empty
        },
        data() {
            return {
                tabCurrentIndex: 0,
                navList: [{
                        state: 0,
                        text: '全部',
                        loadingType: 'more',
                        orderList: [],
                        lid : '',
                        dtype : '',
                    },
                    {
                        state: 1,
                        text: '收入',
                        loadingType: 'more',
                        orderList: [],
                        lid : '',
                        dtype : '',
                    },
                    {
                        state: 2,
                        text: '支出',
                        loadingType: 'more',
                        orderList: [],
                        lid : '',
                        dtype : '',
                    }
                ],
                pagesize: 15
            };
        },
        onLoad() {
        	 this.datalist('tabChange');
        },
        onBackPress(){
            this.$api.ovPage()
        },
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
        },
        //下拉刷新
        onPullDownRefresh() {
           this.datalist("refresh");
        },
        methods: {
             //加载更多
            loadData() {
               if(this.loadingType === 'noMore'){
               	return;
               } 
               this.datalist();
            },
            //swiper 切换
            changeTab(e) {
                this.tabCurrentIndex = e.target.current;
                //加载
                this.datalist("tabChange"); 
            },
            datalist(type) {      
                let state = this.navList[this.tabCurrentIndex].state;
                let lid = this.navList[this.tabCurrentIndex].lid;
                let dtype = this.navList[this.tabCurrentIndex].dtype;

                //tab切换只有第一次需要加载数据
                if (type === 'tabChange' && this.navList[this.tabCurrentIndex].loaded === true) {
                    return;
                }
                if (type == 'refresh') {
                    this.navList[this.tabCurrentIndex].orderList = [];
                    lid = '';
                }
                console.log("sdfsdf")
                this.navList[this.tabCurrentIndex].loadingType = 'loading';
                let data = {
                    pagesize: this.pagesize,
                    lid: lid,
                    cguid: uni.getStorageSync("companyguid"),
                    type: state,
                    dtype : dtype,
                }
                this.$ajax.get('income/getincomeandexpendpage', data).then(res => {
                    console.log(res)
                    if (res.data.code == 0) {
                        let data = res.data.result.data
                        if (data.length > 0) {
                            this.navList[this.tabCurrentIndex].orderList = this.navList[this.tabCurrentIndex].orderList
                                .concat(data);
                            this.navList[this.tabCurrentIndex].lid = data[data.length - 1].id;
                            this.navList[this.tabCurrentIndex].dtype = data[data.length - 1].dtype;
                            
                        }
                        this.navList[this.tabCurrentIndex].loadingType = data.length == this.pagesize ? 'more' : 'noMore'
                        //loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
                        this.$set(this.navList[this.tabCurrentIndex], 'loaded', true);
                        if (type == 'refresh') {
                            uni.stopPullDownRefresh();
                        }
                    }

                })
            },
            //顶部tab点击
            tabClick(index) {
                this.tabCurrentIndex = index;
            },
        },
    }
</script>

<style lang="scss">
    page,
    .content {
        background: $page-color-base;
        height: 100%;
    }

    .swiper-box {
        height: calc(100% - 80rpx);
    }

    .list-scroll-content {
        height: 100%;
    }

    .navbar {
        display: flex;
        height: 40px;
        padding: 0 5px;
        background: #fff;
        box-shadow: 0 1px 5px rgba(0, 0, 0, .06);
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
        position: relative;
    }

    .commodity {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #ffffff;
        padding: 20rpx 30rpx;
        border-bottom: 1px solid #dddddd;
        margin-bottom: 10rpx;

        .commodity-con {
            flex-grow: 1;
            padding: 20rpx;

            .title {
                font-size: 30rpx;
                margin-bottom: 10rpx;
                display: flex;
                justify-content: space-between;

                .stata {
                    margin-left: 20rpx;
                    color: $base-color;
                    &.x{
                        color: #666666;
                    }
                }
            }

            .tip {
                font-size: 24rpx;
                color: $font-color-base;
            }
        }
    }
</style>
