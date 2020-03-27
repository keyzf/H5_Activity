<template>
    <view class="content">
        <view class="navbar">
            <view 
                v-for="(item, index) in navList" :key="index" 
                class="nav-item" 
                :class="{current: tabCurrentIndex === index}"
                @click="tabClick(index)"
            >
                {{item.text}}
            </view>
        </view>

        <swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
            <swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
                <scroll-view class="list-scroll-content" scroll-y @scrolltolower="getRobMore">
                    <!-- 空白页 -->
                    <empty v-if="tabItem.loaded === true && tabItem.robList.length === 0"></empty>
                    
                    <!-- 订单列表 -->
                    
                     <view class="sales" v-for="(rob, index) in tabItem.robList" :key="index" @click="edit(rob)">
                         <view class="title">
                             <view class="tip">
                                 <text>{{rob.title}}</text>
                             </view>
                             <view class="state" :class="{x:rob.state == 1}">
                                 {{rob.stateMsg}}
                             </view>
                         </view>
                         <view class="salescon">
                             {{rob.saleContent}}
                         </view>
                         <view class="salestime">
                             <view class="time">{{rob.timerange}}</view>
                             <view class="btn" v-show="tabItem.type == 999 && rob.applystate < 2" @click.stop="revoke(index)">撤销</view>
                             <view class="btn" @click.stop="del(index)">删除</view>
                         </view>
                     </view>
                     
                    <uni-load-more :status="tabItem.loadingType"></uni-load-more>
                    
                </scroll-view>
            </swiper-item>
        </swiper>
        <view class="footer" @click="addrob">
            <text class="submit">添加抢购</text>
        </view>
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
                        text: '店铺抢购',
                        loadingType: 'more',
                        type: 6,
                        robList: []
                    },
                    {
                        state: 1,
                        text: '平台抢购',
                        loadingType: 'more',
                        type: 999,
                        robList: []
                    }
                ],
                pagesize: 10,
                cguid: 0,
            };
        },
        onLoad() {
            this.cguid = uni.getStorageSync("companyguid");
            this.loadData();
        },
        onShow() {
            if (this.$wx.isWechat()) this.$wx.share();
        },
        // 下拉刷新
        onPullDownRefresh() {
            this.list(0);
        },
        
        methods: {
            //首次加载
            loadData(source){
                //这里是将订单挂载到tab列表下
                let index = this.tabCurrentIndex;
                let navItem = this.navList[index];
                //防止重复加载
                if(navItem.loadingType === 'loading' || navItem.loadingType === 'noMore'){
                    return;
                }
                //tab切换只有第一次需要加载数据
                if(source === 'tabChange' && navItem.loaded === true){
                    return;
                }
                this.list(0);
            },
            //加载更多
            getRobMore() {
                let navItem = this.navList[this.tabCurrentIndex];
                //防止重复加载
                if(navItem.loadingType === 'loading' || navItem.loadingType === 'noMore'){
                	return;
                }
                let length = this.navList[this.tabCurrentIndex].robList.length;
                let lastId = length > 0 ? this.navList[this.tabCurrentIndex].robList[length - 1].saleid : 0;
                this.list(lastId);
            },
            //swiper 切换
            changeTab(e){
                this.tabCurrentIndex = e.target.current;
                this.loadData('tabChange');
            },
            //顶部tab点击
            tabClick(index){
                this.tabCurrentIndex = index;
                this.loadData('tabChange');
            },
            edit(rob){
                let type = this.navList[this.tabCurrentIndex].state;
                let id = type == 0 ? rob.saleid : rob.id;
                uni.navigateTo({
                    url: '/pages/promotion/addrob?buylimitid=' + id + '&type=' + type
                });
            },
            addrob(){
                uni.navigateTo({
                    url: '/pages/promotion/addrob'
                });
            },
            // 撤销抢购
            revoke(index) {
                let _this = this;
                uni.showModal({
                    title: '提示',
                    content: '确定撤销此活动吗？',
                    success: res => {
                        if (res.confirm) {
                            let tabIndex = _this.tabCurrentIndex;
                            let navItem = _this.navList[tabIndex];
                            _this.$ajax.get('buylimit/cancelapply', {cguid: _this.cguid, applyid: navItem.robList[index].applyid}).then(res => {
                                if (res.data.code == 0) {
                                    _this.$api.msg('撤销成功');
                                    navItem.robList[index].stateMsg = '已撤销';
                                    navItem.robList[index].applystate = 2;
                                } else {
                                    _this.$api.msg(res.data.msg);
                                }
                            });
                        }
                    }
                })
            },
            del(index) {
                let _this = this;
                let tabIndex = this.tabCurrentIndex;
                let navItem = this.navList[tabIndex];
                let data = {
                    cguid: _this.cguid,
                    buylimitid: navItem.state == 0 ? navItem.robList[index].saleid : navItem.robList[index].id,
                    applyid: navItem.state == 0 ? navItem.robList[index].saleid : navItem.robList[index].id
                };
                let url = navItem.state == 0 ? 'sale/delbuylimit' : 'buylimit/deleteapply';
                uni.showModal({
                    title: '提示',
                    content: '确定删除此活动吗？',
                    success: function (res) {
                        if (res.confirm) {
                            _this.$ajax.get(url, data).then(res => {
                                uni.hideLoading();
                                console.log(res);
                                if (res.data.code == 0) {
                                    navItem.robList.splice(index, 1);
                                    if (navItem.robList.length == 0) navItem.loadingType = 'noMore';
                                    _this.$api.msg('删除成功');
                                } else {
                                    _this.$api.msg(res.data.code + ":" + res.data.msg);
                                }
                            });
                        }
                    }
                });
            },
            list(lastid) {
                //这里是将订单挂载到tab列表下
                let index = this.tabCurrentIndex;
                let navItem = this.navList[index];
                
                navItem.loadingType = 'loading';
                let url = navItem.state == 0 ? 'sale/getcompanybuylimitlist' : 'buylimit/platapplylist';
                this.$ajax.get(url, {
                        cguid : this.cguid,
                        type: navItem.type,
                        pagesize: this.pagesize,
                        lastid: lastid == 0 ? '' : lastid
                    }).then(res => {
                        if (res.data.code == 0) {
                            let data = res.data.result.data;
                            if (lastid == 0 || lastid == '') {
                                navItem.robList = data;
                            } else {
                                navItem.robList = navItem.robList.concat(data);
                            }
                            //loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
                            this.$set(navItem, 'loaded', true);
                            //判断是否还有数据， 有改为 more， 没有改为noMore 
                            navItem.loadingType = data.length == this.pagesize ? 'more' : 'noMore'
                        } else {
                            this.$api.msg('系统出错,请稍后再试');
                        }
                        uni.stopPullDownRefresh();
                });
            }
        },
    }
</script>

<style lang="scss">
    page, .content{
        background: $page-color-base;
        height: 100%;
    }
    
    .swiper-box{
        height: calc(100% - 90px);
    }
    .list-scroll-content{
        height: 100%;
    }
    
    .navbar{
        display: flex;
        height: 40px;
        padding: 0 5px;
        background: #fff;
        box-shadow: 0 1px 5px rgba(0,0,0,.06);
        position: relative;
        z-index: 10;
        .nav-item{
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            font-size: 15px;
            color: $font-color-dark;
            position: relative;
            &.current{
                color: $base-color;
                &:after{
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

    .uni-swiper-item{
        height: auto;
    }
    
</style>
